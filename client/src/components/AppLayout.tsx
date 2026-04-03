import { useEffect, useState, type ReactNode } from "react";
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
    width="24"
    height="24"
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

function PageTransition({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsActive(true);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div className={isActive ? "page-enter page-enter-active" : "page-enter"}>{children}</div>;
}

export function AppLayout() {
  const location = useLocation();
  const title = getTitle(location.pathname);
  const isScanPage = location.pathname === "/scan";

  return (
    <div className="app-shell">
      {!isScanPage && (
        <header className="app-header" aria-label="App bar">
          <div className="app-header__bar">
            <div className="app-header__brand-wrap">
              <span className="app-header__brand" aria-label="CropGuard">
                CropGuard
              </span>
            </div>

            <div className="app-header__actions">
              <button
                type="button"
                aria-label="Notifications"
                className="icon-button"
                data-haptic="light"
              >
                <BellIcon />
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="page-content" role="main">
        <PageTransition key={location.pathname}>
          {!isScanPage && (
            <h1 className="page-large-title" aria-live="polite">
              {title}
            </h1>
          )}
          <Outlet />
        </PageTransition>
      </main>

      {!isScanPage && <BottomNav />}
    </div>
  );
}
