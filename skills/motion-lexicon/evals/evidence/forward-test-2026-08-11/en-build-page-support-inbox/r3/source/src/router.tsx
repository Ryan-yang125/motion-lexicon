import { HomePage } from "./pages/HomePage";
import { SupportPage } from "./pages/SupportPage";

export function AppRouter() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";

  if (pathname === "/") return <HomePage />;
  if (pathname === "/support") return <SupportPage />;

  return (
    <main className="app-shell">
      <h1>Route not found</h1>
      <a className="focus-target" href="/">Return home</a>
    </main>
  );
}
