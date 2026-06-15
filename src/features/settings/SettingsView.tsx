import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ActionButton } from '@/components/ActionButton'
import { loadSettings, saveSettings } from '@/lib/storage'

const MODELS = [
  { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B (Recommended)' },
  { value: 'llama3-8b-8192', label: 'Llama 3 8B (Fast)' },
  { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
]

export function SettingsView() {
  const [settings, setSettings] = useState(loadSettings)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-lg mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="font-display text-4xl font-extrabold text-primary">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your AI tutor.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Groq API Key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Get your free key at{' '}
            <span className="font-mono text-secondary">console.groq.com</span>.
            Stored only in your browser — never sent anywhere except Groq.
          </p>
          <Input
            type="password"
            placeholder="gsk_..."
            value={settings.groqApiKey}
            onChange={(e) => setSettings((s) => ({ ...s, groqApiKey: e.target.value }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {MODELS.map((m) => (
            <label key={m.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="model"
                value={m.value}
                checked={settings.model === m.value}
                onChange={() => setSettings((s) => ({ ...s, model: m.value }))}
                className="accent-primary"
              />
              <span className="text-sm font-medium">{m.label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <ActionButton onClick={handleSave} className="w-full h-12 text-base">
        {saved ? '✓ Saved!' : 'Save Settings'}
      </ActionButton>
    </div>
  )
}
