import { createFileRoute } from "@tanstack/react-router";
import { HomeDashboard } from "@/features/home/HomeDashboard";

export const Route = createFileRoute("/")({
  component: HomeDashboard,
});
