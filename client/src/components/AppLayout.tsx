import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";

const pageTitles: Record<string, string> = {
  "/dashboard": "Radar",
  "/scan": "Scanner",
  "/scan/result": "Diagnosis",
  "/forecast": "Forecast",
  "/community": "Community",
  "/community/report": "Report",
  "/profile": "My Farm",
};

function getTitle(pathname: string): string {
  const match = Object.entries(pageTitles).find(([key]) =>
    pathname.startsWith(key),
  );
  return match ? match[1] : "CropGuard";
}

const BellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export function AppLayout() {
  const location = useLocation();
  const title = getTitle(location.pathname);
  const isScanPage = location.pathname === "/scan";

  return (
    <div className="app-shell">
      {/* ── Top bar: wordmark left, bell right ── */}
      {!isScanPage && (
        <header className="app-header" aria-label="App bar">
          <div className="app-header__bar">
            {/* CropGuard wordmark — no icon square */}
            <div className="app-header__icon">
              <span className="brand-wordmark" aria-label="CropGuard">
                CropGuard
              </span>
            </div>

            {/* Bell notification icon on right */}
            <div className="app-header__icon app-header__icon--status">
              <button
                type="button"
                aria-label="Notifications"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  display: "flex",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <BellIcon />
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="page-content" role="main">
        {/* iOS large-title: left-aligned, lives in the scroll view */}
        {!isScanPage && (
          <h1 className="page-large-title" aria-live="polite">
            {title}
          </h1>
        )}
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
