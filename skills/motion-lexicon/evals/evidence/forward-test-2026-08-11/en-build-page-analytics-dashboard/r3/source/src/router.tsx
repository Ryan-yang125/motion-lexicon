import { AnalyticsDashboardPage } from "./pages/AnalyticsDashboardPage";

export function AppRouter() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";

  if (pathname === "/" || pathname === "/analytics") {
    return <AnalyticsDashboardPage />;
  }

  return (
    <main className="app-shell">
      <h1>Route not found</h1>
      <a className="focus-target" href="/">Return home</a>
    </main>
  );
}
