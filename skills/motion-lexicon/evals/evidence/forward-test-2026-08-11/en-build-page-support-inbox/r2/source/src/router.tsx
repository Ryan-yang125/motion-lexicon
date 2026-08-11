import { SupportInboxPage } from "./pages/SupportInboxPage";

export function AppRouter() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";
  if (pathname === "/" || pathname === "/support") return <SupportInboxPage />;
  return <main className="app-shell"><h1>Route not found</h1><a className="focus-target" href="/support">Return to support inbox</a></main>;
}
