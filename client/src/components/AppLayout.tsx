import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";

const pageMeta = [
  { path: "/dashboard", title: "Field Radar", subtitle: "Risk pulse and local weather" },
  { path: "/scan", title: "Leaf Scanner", subtitle: "Capture and diagnose quickly" },
  { path: "/forecast", title: "Outbreak Forecast", subtitle: "7 day disease pressure view" },
  { path: "/community", title: "Community Alerts", subtitle: "Nearby outbreak intelligence" },
  { path: "/profile", title: "My Farm", subtitle: "History and settings" },
];

function getPageMeta(pathname: string) {
  const match = pageMeta.find((item) => pathname.startsWith(item.path));
  if (match) {
    return match;
  }

  return {
    path: pathname,
    title: "CropGuard",
    subtitle: "Farm protection platform",
  };
}

export function AppLayout() {
  const location = useLocation();
  const meta = getPageMeta(location.pathname);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">
            CG
          </div>
          <div>
            <p className="brand-name">CropGuard</p>
            <p className="brand-subtitle">AI crop defense network</p>
          </div>
        </div>
        <span className="status-chip">Offline ready UI</span>
      </header>

      <section className="page-heading" aria-live="polite">
        <h1>{meta.title}</h1>
        <p>{meta.subtitle}</p>
      </section>

      <main className="page-content">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
