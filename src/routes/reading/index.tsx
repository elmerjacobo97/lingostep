import { createFileRoute } from "@tanstack/react-router";
import { ReadingModule } from "@/features/reading/ReadingModule";

export const Route = createFileRoute("/reading/")({
  component: ReadingModule,
});
