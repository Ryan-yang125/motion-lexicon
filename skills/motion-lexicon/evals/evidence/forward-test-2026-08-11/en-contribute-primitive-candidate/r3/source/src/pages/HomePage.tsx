import { Button } from "../components/ui/Button";

export function HomePage() {
  return (
    <main className="app-shell">
      <p className="eyebrow">Motion Lexicon candidate</p>
      <h1>Status becomes action</h1>
      <p>Portable primitive demo installed at the fixture path.</p>
      <a className="focus-target" href="/status-becomes-action/">Open portable demo</a>
      <Button onClick={() => document.documentElement.classList.toggle("dark")}>
        Toggle theme
      </Button>
    </main>
  );
}
