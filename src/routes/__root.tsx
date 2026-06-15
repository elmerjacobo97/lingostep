import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Settings } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";

// eslint-disable-next-line react-refresh/only-export-components
const RootLayout = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <div className="min-h-svh bg-background">
      <nav className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="font-display text-xl font-extrabold text-primary hover:opacity-80 transition-opacity"
          >
            LingoStep
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/settings"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} />
            </Link>
          </div>
        </div>
      </nav>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  </ThemeProvider>
);

export const Route = createRootRoute({ component: RootLayout });
