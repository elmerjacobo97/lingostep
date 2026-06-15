import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  PenLine,
  Mic,
  ChevronRight,
  Flame,
  Trophy,
  BookMarked,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "@/components/ActionButton";
import { loadProgress } from "@/lib/storage";
import { LESSONS } from "@/features/reading/data/lessons";

const MODULES = [
  {
    href: "/reading" as const,
    title: "Reading",
    description:
      "Read real dev docs. Tap words to get instant explanations in Spanish.",
    icon: BookOpen,
    active: true,
  },
  {
    href: null,
    title: "Writing",
    description: "Write in English, get AI corrections and grammar feedback.",
    icon: PenLine,
    active: false,
  },
  {
    href: null,
    title: "Pronunciation",
    description:
      "Listen and repeat. Speech recognition scores your pronunciation.",
    icon: Mic,
    active: false,
  },
];

export function HomeDashboard() {
  const navigate = useNavigate();
  const progress = loadProgress();
  const completedCount = progress.completedLessons.length;
  const pct =
    LESSONS.length > 0
      ? Math.round((completedCount / LESSONS.length) * 100)
      : 0;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      <div>
        <h1 className="font-display text-5xl font-extrabold text-primary leading-tight">
          LingoStep
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          English for developers. Structured. Ordered. No chaos.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Trophy className="mx-auto mb-1 text-primary" size={20} />
            <div className="text-3xl font-extrabold text-primary">
              {progress.xp}
            </div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-1">
              XP
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Flame className="mx-auto mb-1 text-secondary" size={20} />
            <div className="text-3xl font-extrabold text-secondary">
              {progress.streak.count}
            </div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-1">
              Day Streak
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <BookMarked className="mx-auto mb-1 text-foreground" size={20} />
            <div className="text-3xl font-extrabold text-foreground">
              {completedCount}/{LESSONS.length}
            </div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mt-1">
              Lessons
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-semibold">
          <span>Reading Module</span>
          <span className="text-primary">{pct}%</span>
        </div>
        <Progress value={pct} className="h-3" />
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-2xl font-extrabold text-foreground">
          Modules
        </h2>
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <Card
              key={mod.title}
              className={`transition-all ${mod.active ? "hover:shadow-sm cursor-pointer" : "opacity-60"}`}
              onClick={() =>
                mod.active && mod.href && navigate({ to: mod.href })
              }
            >
              <CardContent className="flex items-center gap-4 py-5">
                <div className="shrink-0 rounded-xl bg-muted p-3">
                  <Icon size={24} className="text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base">{mod.title}</span>
                    {!mod.active && (
                      <Badge variant="secondary" className="text-xs">
                        Soon
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
                    {mod.description}
                  </p>
                </div>
                {mod.active && (
                  <ChevronRight
                    size={18}
                    className="text-muted-foreground shrink-0"
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ActionButton
        onClick={() => navigate({ to: "/reading" })}
        className="w-full h-14 text-lg"
      >
        Start Reading
        <ChevronRight size={20} />
      </ActionButton>
    </div>
  );
}
