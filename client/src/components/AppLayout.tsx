import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";

const pageMeta: Record<string, string> = {
  "/dashboard": "Radar",
  "/scan": "Scanner",
  "/scan/result": "Diagnosis",
  "/forecast": "Forecast",
  "/community": "Community",
  "/community/report": "Report",
  "/profile": "My Farm",
};

function getTitle(pathname: string): string {
  const match = Object.entries(pageMeta).find(([key]) =>
    pathname.startsWith(key),
  );
  return match ? match[1] : "CropGuard";
}

export function AppLayout() {
  const location = useLocation();
  const title = getTitle(location.pathname);
  const isScanPage = location.pathname === "/scan";

  return (
    <div className="app-shell">
      {/* Top App Bar — hidden on scanner (full-bleed camera UI) */}
      {!isScanPage && (
        <header className="app-header" aria-label="App bar">
          <div className="app-header__bar">
            {/* Left: brand mark */}
            <div className="app-header__icon">
              <div className="brand-mark" aria-hidden="true">CG</div>
            </div>

            {/* Center: page title */}
            <h1 className="app-header__title">{title}</h1>

            {/* Right: notification bell */}
            <div className="app-header__icon app-header__icon--status">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--text-secondary)" }}
                aria-hidden="true"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
          </div>
        </header>
      )}

      <main className="page-content" role="main">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
