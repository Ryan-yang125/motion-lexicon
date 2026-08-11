import { AnalyticsPage } from "./pages/AnalyticsPage";

export function AppRouter() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";

  if (pathname === "/" || pathname === "/analytics") return <AnalyticsPage />;

  return (
    <main className="app-shell">
      <h1>Route not found</h1>
      <a className="focus-target" href="/">Return home</a>
    </main>
  );
}
