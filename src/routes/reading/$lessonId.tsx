import { createFileRoute, notFound } from "@tanstack/react-router";
import { LessonView } from "@/features/reading/LessonView";
import { LESSONS } from "@/features/reading/data/lessons";

export const Route = createFileRoute("/reading/$lessonId")({
  loader: ({ params }) => {
    const lesson = LESSONS.find((l) => l.id === params.lessonId);
    if (!lesson) throw notFound();
    return lesson;
  },
  component: LessonView,
  notFoundComponent: () => (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <p className="text-muted-foreground">Lesson not found.</p>
    </div>
  ),
});
