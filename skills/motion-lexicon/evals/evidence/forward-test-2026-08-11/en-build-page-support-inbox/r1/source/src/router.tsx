import { HomePage } from "./pages/HomePage";
import { SupportInboxPage } from "./pages/SupportInboxPage";

export function AppRouter() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";

  if (pathname === "/") return <HomePage />;
  if (pathname === "/support") return <SupportInboxPage />;

  return (
    <main className="app-shell">
      <h1>Route not found</h1>
      <a className="focus-target" href="/">Return home</a>
    </main>
  );
}
