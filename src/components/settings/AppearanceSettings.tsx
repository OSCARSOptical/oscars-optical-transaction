
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

export default function AppearanceSettings() {
  // Check initial theme, fallback to system preference
  const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between py-2">
          <span className="flex items-center gap-2 text-base font-medium">
            <Moon className="h-5 w-5 text-crimson-600 dark:text-crimson-400" />
            <span>Dark Mode</span>
          </span>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            className="data-[state=checked]:bg-crimson-600"
            aria-label="Toggle dark mode"
          />
        </div>
        <div className="rounded-lg border border-muted mt-4 overflow-hidden">
          {/* Preview section: visually shows light/dark mode cards */}
          <div className="grid grid-cols-2">
            <div className="p-4 bg-white flex flex-col items-center justify-center h-32 dark:bg-gray-900 transition-colors ease-in">
              <Sun className="mb-2 text-yellow-400" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">Light</span>
            </div>
            <div className="p-4 bg-gray-900 flex flex-col items-center justify-center h-32 dark:bg-white transition-colors ease-in">
              <Moon className="mb-2 text-crimson-600 dark:text-crimson-500" />
              <span className="font-semibold text-gray-100 dark:text-gray-900">Dark</span>
            </div>
          </div>
        </div>
        <div className="text-muted-foreground p-2 mt-4">
          <p>
            Switch between light and dark mode. Dark mode uses a sleek dark background with crimson highlights.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
