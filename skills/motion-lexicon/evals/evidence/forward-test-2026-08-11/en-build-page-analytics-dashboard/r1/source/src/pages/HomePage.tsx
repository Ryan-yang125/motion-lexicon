import { Button } from "../components/ui/Button";

export function HomePage() {
  return (
    <main className="app-shell">
      <p className="eyebrow">Workspace</p>
      <h1>Starter route</h1>
      <Button onClick={() => document.documentElement.classList.toggle("dark")}>
        Toggle theme
      </Button>
    </main>
  );
}
