import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, PartyPopper, ThumbsUp, BookOpen, Loader2 } from "lucide-react";
import { Route } from "@/routes/reading/$lessonId";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "@/components/ActionButton";
import {
  loadSettings,
  loadProgress,
  saveProgress,
  recordLessonComplete,
} from "@/lib/storage";
import { createGroqClient } from "@/lib/groq";
import { explainWord, type WordExplanation } from "./ai";

type Phase = "reading" | "questions" | "done";

export function LessonView() {
  const navigate = useNavigate();
  const lesson = Route.useLoaderData();

  const [phase, setPhase] = useState<Phase>("reading");
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<WordExplanation | null>(null);
  const [loadingWord, setLoadingWord] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  async function handleWordClick(word: string) {
    const clean = word.replace(/[^a-zA-Z'-]/g, "");
    if (!clean || clean.length < 3) return;

    setSelectedWord(clean);
    setExplanation(null);

    const settings = loadSettings();
    const client = createGroqClient(settings);

    if (!client) {
      setExplanation({
        meaning_es:
          "Configura tu Groq API key en Settings para ver explicaciones.",
        part_of_speech: "—",
        example_en: "—",
      });
      return;
    }

    setLoadingWord(true);
    try {
      const result = await explainWord(
        client,
        settings.model,
        clean,
        lesson.passage
      );
      setExplanation(result);
    } catch {
      setExplanation({
        meaning_es: "Error al conectar con Groq. Verifica tu API key.",
        part_of_speech: "—",
        example_en: "—",
      });
    } finally {
      setLoadingWord(false);
    }
  }

  function handleSubmitAnswers() {
    let correct = 0;
    for (const q of lesson.questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const pct = Math.round((correct / lesson.questions.length) * 100);
    setScore(pct);
    setSubmitted(true);

    const updated = recordLessonComplete(
      loadProgress(),
      lesson.id,
      pct,
      lesson.xpReward
    );
    saveProgress(updated);
  }

  const words = lesson.passage.split(/(\s+)/);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate({ to: "/reading" })}
          className="text-muted-foreground hover:text-foreground transition-colors mt-1"
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground leading-tight">
            {lesson.title}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{lesson.level}</Badge>
            <Badge variant="outline">{lesson.topic}</Badge>
            <span className="text-xs text-primary font-semibold">
              +{lesson.xpReward} XP
            </span>
          </div>
        </div>
      </div>

      {phase === "reading" && (
        <>
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-sm text-muted-foreground mb-3 font-semibold">
                Tap any word to get an explanation in Spanish
              </p>
              <div className="leading-8 text-base">
                {words.map((chunk, i) =>
                  /^\s+$/.test(chunk) ? (
                    <span key={i}>{chunk}</span>
                  ) : (
                    <button
                      key={i}
                      onClick={() => handleWordClick(chunk)}
                      className={`inline rounded px-0.5 transition-colors hover:bg-primary/20 hover:text-primary ${
                        selectedWord === chunk.replace(/[^a-zA-Z'-]/g, "")
                          ? "bg-primary/20 text-primary"
                          : ""
                      }`}
                    >
                      {chunk}
                    </button>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {selectedWord && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-4 pb-4">
                {loadingWord ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 size={14} className="animate-spin" />
                    Loading explanation…
                  </div>
                ) : explanation ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary text-lg">
                        {selectedWord}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {explanation.part_of_speech}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{explanation.meaning_es}</p>
                    {explanation.example_en !== "—" && (
                      <p className="text-sm text-muted-foreground italic">
                        "{explanation.example_en}"
                      </p>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          <ActionButton
            onClick={() => setPhase("questions")}
            className="w-full h-12 text-base"
          >
            Continue to Questions
          </ActionButton>
        </>
      )}

      {phase === "questions" && (
        <>
          <h2 className="font-display text-2xl font-extrabold">
            Comprehension Check
          </h2>

          <div className="space-y-5">
            {lesson.questions.map((q, qi) => (
              <Card key={q.id}>
                <CardContent className="pt-4 pb-4 space-y-3">
                  <p className="font-semibold text-sm">
                    {qi + 1}. {q.text}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const selected = answers[q.id] === oi;
                      const isCorrect = oi === q.correctIndex;
                      let cls =
                        "w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors font-medium";

                      if (!submitted) {
                        cls += selected
                          ? " border-primary bg-primary/10 text-primary"
                          : " border-border hover:border-primary/50 hover:bg-muted";
                      } else {
                        if (isCorrect)
                          cls +=
                            " border-green-500 bg-green-50 text-green-700";
                        else if (selected)
                          cls += " border-red-400 bg-red-50 text-red-700";
                        else cls += " border-border text-muted-foreground";
                      }

                      return (
                        <button
                          key={oi}
                          className={cls}
                          disabled={submitted}
                          onClick={() =>
                            setAnswers((a) => ({ ...a, [q.id]: oi }))
                          }
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!submitted ? (
            <ActionButton
              onClick={handleSubmitAnswers}
              className="w-full h-12 text-base"
              disabled={Object.keys(answers).length < lesson.questions.length}
            >
              Submit Answers
            </ActionButton>
          ) : (
            <div className="space-y-4">
              <Card
                className={`border-2 ${score >= 70 ? "border-primary" : "border-secondary"}`}
              >
                <CardContent className="pt-5 pb-5 text-center space-y-2">
                  <div className="flex justify-center mb-2">
                    {score === 100 ? (
                      <PartyPopper size={32} className="text-primary" />
                    ) : score >= 70 ? (
                      <ThumbsUp size={32} className="text-primary" />
                    ) : (
                      <BookOpen size={32} className="text-secondary" />
                    )}
                  </div>
                  <div className="font-display text-5xl font-extrabold text-primary">
                    {score}%
                  </div>
                  <p className="font-semibold">
                    {score === 100
                      ? "Perfect score!"
                      : score >= 70
                        ? "Well done!"
                        : "Keep practicing!"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    +{lesson.xpReward} XP earned
                  </p>
                </CardContent>
              </Card>
              <ActionButton
                onClick={() => navigate({ to: "/reading" })}
                className="w-full h-12 text-base"
              >
                Back to Lessons
              </ActionButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}
