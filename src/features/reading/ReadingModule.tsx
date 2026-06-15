import { useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, CheckCircle2, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { loadProgress } from "@/lib/storage";
import { LESSONS } from "./data/lessons";

const LEVEL_COLOR: Record<string, string> = {
  A2: "bg-green-100 text-green-700",
  B1: "bg-blue-100 text-blue-700",
  B2: "bg-purple-100 text-purple-700",
};

export function ReadingModule() {
  const navigate = useNavigate();
  const progress = loadProgress();

  const byLevel = ["A2", "B1", "B2"].map((level) => ({
    level,
    lessons: LESSONS.filter((l) => l.level === level),
  }));

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: "/" })}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="font-display text-4xl font-extrabold text-primary">
            Reading
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Real dev docs. Tap words for instant explanations.
          </p>
        </div>
      </div>

      {byLevel.map(({ level, lessons }) => (
        <div key={level} className="space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLOR[level]}`}
            >
              {level}
            </span>
            <span className="text-sm text-muted-foreground">
              {
                lessons.filter((l) =>
                  progress.completedLessons.includes(l.id)
                ).length
              }
              /{lessons.length} done
            </span>
          </div>

          {lessons.map((lesson) => {
            const done = progress.completedLessons.includes(lesson.id);
            const score = progress.scores[lesson.id];

            return (
              <Link
                key={lesson.id}
                to="/reading/$lessonId"
                params={{ lessonId: lesson.id }}
              >
                <Card className="cursor-pointer hover:shadow-sm transition-all mt-2">
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="shrink-0">
                      {done ? (
                        <CheckCircle2 size={28} className="text-primary" />
                      ) : (
                        <FileText size={28} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm">{lesson.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {lesson.topic}
                        </Badge>
                        <span className="text-xs text-primary font-semibold">
                          +{lesson.xpReward} XP
                        </span>
                      </div>
                      {done && score !== undefined && (
                        <div className="mt-1.5 space-y-0.5">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Score</span>
                            <span className="font-semibold text-primary">
                              {score}%
                            </span>
                          </div>
                          <Progress value={score} className="h-1.5" />
                        </div>
                      )}
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-muted-foreground shrink-0"
                    />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
