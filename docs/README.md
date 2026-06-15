# LingoStep — App personal para aprender inglés (dev-focused)

## Context

El usuario es dev; su punto débil es inglés. Quiere una app **personal, sin login**,
con **orden/estructura** (su queja real con ChatGPT: "es fácil perderse, no hay orden").
Prioridad de aprendizaje: **leer documentación → escribir → pronunciación**.

Repo actual: scaffold Vite + React 19 + TS (React Compiler on). `DESIGN.md` ya define
sistema de diseño estilo Duolingo (tokens de color, tipografía, componentes). No hay
código de app todavía — `src/App.tsx` es el template default.

### Decisiones (confirmadas por el usuario)

- **IA:** Groq (no Claude). API key del usuario guardada en `localStorage`, llamada
  **directo desde el navegador** con `dangerouslyAllowBrowser: true`.
- **Persistencia:** `localStorage` (sin backend, sin DB).
- **MVP:** módulo **Reading** primero. Writing + Pronunciation después (estructura lista).
- **UI:** **shadcn/ui** (Tailwind v4). Tematizar **adaptando las variables que shadcn ya
  trae** (`--primary`, `--secondary`, `--radius`, `--background`, etc.) a los tokens
  Duolingo de `DESIGN.md`. **No** crear variables nuevas de shadcn — solo override.
  Tipografía grande y correcta (display pesado para titulares).

> ⚠️ **Seguridad:** key en `localStorage` + `dangerouslyAllowBrowser` es aceptable
> **solo** porque es 100% personal y local. NO desplegar públicamente con este patrón.
> Si algún día se hospeda online, mover la llamada a un proxy backend (Vite serverless).
> La key es del usuario, se ingresa en Settings, nunca se commitea.

---

## Approach

App de una sola página con navegación por estado (3 vistas: Home / Reading / Settings).
Sin router externo para mantenerlo lean — `react-router-dom` se puede añadir luego.

### Diseño / tokens — shadcn/ui adaptado a Duolingo

**Setup (CLI actual):**

1. Instalar Tailwind v4: `pnpm add tailwindcss @tailwindcss/vite` + plugin en `vite.config.ts`.
2. Alias `@` → `src` en `vite.config.ts` (`resolve.alias`) y en `tsconfig*.json`
   (`paths: { "@/*": ["./src/*"] }`).
3. `pnpm dlx shadcn@latest init` → genera `components.json`, `lib/utils.ts` (cn), e
   inyecta el bloque de theming en `src/index.css`.

**Tematización (clave del pedido):** en `src/index.css`, override los valores del `:root`
de shadcn con los tokens Duolingo de `DESIGN.md`. **Mapeo** (no se añaden variables nuevas):
| Variable shadcn | Token Duolingo |
|---|---|
| `--primary` | Ecto Green `#58cc02` |
| `--primary-foreground` | Paper `#ffffff` |
| `--secondary` / `--accent` | Macaw Blue `#1cb0f6` |
| `--ring` | Lingot Lime `#a5ed6e` |
| `--foreground` | Charcoal `#4b4b4b` (titulares: Eel Dark Blue `#042c60`) |
| `--muted-foreground` | Ash `#777777` |
| `--border` / `--input` | Graphite `#3c3c3c` (suavizado) |
| `--background` / `--card` | Paper `#ffffff` |
| `--destructive` | rojo de error (mantener) |
| `--radius` | `0.75rem` (= 12px, único radius del sistema) |

**Tipografía grande:** `--font-sans` = **Nunito** (substituto din-round); display =
**Inter 800 / DIN-like** (substituto feather) vía Google Fonts en `index.html`. Escala de
DESIGN.md: body 15px, heading 32px, **display 48–64px** weight 700-800, tracking ajustado.
Definir clases utilitarias `.font-display` y tamaños de titular grandes.

**Efecto 3D pressable (Duolingo):** los botones filled usan borde inferior 2-3px en verde
más oscuro (no `box-shadow`). Se implementa con una **clase utilitaria** sobre el `Button`
de shadcn (o un wrapper `<ActionButton>`), **sin** crear nuevas variables de tema.

**Componentes shadcn a instalar** (`pnpm dlx shadcn@latest add ...`):
`button card progress badge tabs input dialog sonner` — base suficiente para Home,
Reading, LessonView y Settings. Añadir más solo si hace falta.

### Estructura de archivos

```
components.json                  # config shadcn (generado por init)
src/
  main.tsx                       # existente
  App.tsx                        # reescribir: shell + switch de vistas
  index.css                      # theming shadcn override con tokens Duolingo
  types.ts                       # Progress, Settings, Lesson, etc.
  lib/
    utils.ts                     # cn() (generado por shadcn)
    storage.ts                   # helpers tipados localStorage (get/set + defaults)
    groq.ts                      # factory cliente Groq (lee key de settings)
  components/
    ui/                          # componentes shadcn (button, card, ...) — generados
    ActionButton.tsx             # wrapper Button con efecto 3D pressable Duolingo
  features/
    home/HomeDashboard.tsx       # módulos + streak/XP/progreso
    settings/SettingsView.tsx    # pegar Groq key + elegir modelo
    reading/
      ReadingModule.tsx          # lista de lecciones
      LessonView.tsx             # pasaje + tap-word + comprensión
      data/lessons.ts            # contenido seed (extractos estilo dev-docs, nivelados)
      ai.ts                      # explainWord() + gradeAnswer() vía Groq
```

### Modelo de datos (localStorage)

```ts
// types.ts
type Settings = { groqApiKey: string; model: string; nativeLang: "es" };
type Progress = {
  completedLessons: string[];
  scores: Record<string, number>; // lessonId -> %
  xp: number;
  streak: { count: number; lastDay: string }; // YYYY-MM-DD
};
```

`lib/storage.ts`: `loadSettings()/saveSettings()`, `loadProgress()/saveProgress()`,
con defaults y `try/catch` de `JSON.parse`. Claves: `lingostep.settings`, `lingostep.progress`.

### Módulo Reading (MVP) — flujo

1. **HomeDashboard**: tarjetas de módulos. Reading activo; Writing/Pronunciation con badge
   "Próximamente". Muestra streak, XP, % de lecciones completadas (de `Progress`).
2. **ReadingModule**: lista de lecciones seed (~6-8), agrupadas por nivel (A2/B1/B2).
   Cada lección = extracto real estilo documentación dev (ej. fragmento de docs de React,
   HTTP, Git) + 3-4 preguntas de comprensión (multiple choice en el seed).
3. **LessonView**:
   - Render del pasaje. Tap/click en una palabra → `explainWord()` (Groq): significado en
     español, tipo gramatical, ejemplo de uso. Si no hay key → tooltip "Configura tu key".
   - Preguntas de comprensión (MCQ del seed; corrección instantánea local, sin IA).
   - (Opcional con IA) una pregunta abierta "resume en inglés" → `gradeAnswer()` (Groq)
     devuelve score + feedback de gramática.
   - Al terminar: guarda score, marca completada, suma XP, actualiza streak.

### Groq (`lib/groq.ts` + `features/reading/ai.ts`)

- Instalar `groq-sdk` (pnpm). Cliente:
  ```ts
  new Groq({ apiKey: settings.groqApiKey, dangerouslyAllowBrowser: true });
  ```
- Modelo default sugerido para corrección de calidad: `llama-3.3-70b-versatile`
  (rápido y bueno); seleccionable en Settings. Endpoint OpenAI-compatible
  `chat.completions.create`.
- `explainWord(word, context)`: system prompt "eres tutor de inglés para hispanohablante
  dev", pide JSON `{ meaning_es, part_of_speech, example_en }`.
- `gradeAnswer(question, userAnswer)`: devuelve `{ score, feedback_es, corrected_en }`.
- Manejar errores (key inválida / rate limit) con mensaje claro en UI.

### Curriculum / orden (documentado para futuro)

- **M1 Reading** ← se construye ahora (leer docs, vocabulario, comprensión).
- **M2 Writing** — escribir en inglés; Groq corrige gramática, reescribe, explica.
- **M3 Pronunciation** — Web Speech API nativa: `speechSynthesis` (TTS) +
  `SpeechRecognition` (escuchar y puntuar). Sin costo, sin IA externa.

---

## Critical files

- `vite.config.ts` / `tsconfig*.json` — plugin Tailwind v4 + alias `@`.
- `src/index.css` — theming shadcn: override `:root` con tokens Duolingo (tabla arriba).
- `index.html` — Google Fonts (Nunito + Inter pesado).
- `components.json` — config shadcn (init).
- `src/App.tsx` — reescribir como shell + switch de vistas.
- `src/lib/storage.ts`, `src/lib/groq.ts` — persistencia + cliente IA.
- `src/components/ActionButton.tsx` — botón 3D pressable Duolingo sobre shadcn Button.
- `src/features/reading/data/lessons.ts` — contenido seed (lo más laborioso del MVP).
- `src/types.ts` — modelos `Settings` / `Progress` / `Lesson`.
- `package.json` — añadir `groq-sdk`, `tailwindcss`, `@tailwindcss/vite` (+ deps de shadcn).

## Verification

1. `pnpm install`, `pnpm dev` → abre `localhost:5173`.
2. Verificar que el tema Duolingo aplica: primary verde `#58cc02`, radius 12px, titulares
   grandes con fuente display. Botón filled muestra el borde inferior 3D pressable.
3. Home muestra módulos; Reading abre lista de lecciones.
4. Completar una lección (MCQ) → score guardado; **refrescar** → progreso/streak persisten
   (verificar `localStorage` en DevTools, clave `lingostep.progress`).
5. En Settings pegar Groq API key → en LessonView, tap a una palabra → `explainWord`
   devuelve significado en español (verifica request a `api.groq.com` en Network).
6. Sin key configurada → la UI degrada con mensaje, no crashea.
7. `pnpm build` + `pnpm lint` limpios.
