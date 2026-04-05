import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { reverseGeocode } from "../services/location";
import {
  getSessionLocationLabel,
  getSessionUser,
  setSessionLocationLabel,
} from "../services/session";
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

const LocationPinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

function getFallbackLocationLabel(village?: string | null, district?: string | null) {
  const villagePart = village?.trim() || "";
  const districtPart = district?.trim() || "";
  if (villagePart && districtPart) {
    return `${villagePart}, ${districtPart}`;
  }

  if (districtPart) {
    return districtPart;
  }

  if (villagePart) {
    return villagePart;
  }

  return "Location unavailable";
}

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
  const sessionUser = useMemo(() => getSessionUser(), [location.pathname]);
  const userLatitude = sessionUser?.latitude ?? null;
  const userLongitude = sessionUser?.longitude ?? null;
  const fallbackLocationLabel = getFallbackLocationLabel(sessionUser?.village, sessionUser?.district);

  const [locationLabel, setLocationLabel] = useState(
    () => getSessionLocationLabel() || fallbackLocationLabel,
  );
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false);

  useEffect(() => {
    setIsLocationPopoverOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const existingLabel = getSessionLocationLabel();
    if (!existingLabel) {
      setLocationLabel(fallbackLocationLabel);
      return;
    }

    setLocationLabel(existingLabel);
  }, [fallbackLocationLabel]);

  useEffect(() => {
    if (typeof userLatitude !== "number" || typeof userLongitude !== "number") {
      return;
    }

    let isMounted = true;

    const hydrateLocationLabel = async () => {
      try {
        const resolved = await reverseGeocode(userLatitude, userLongitude);
        if (!isMounted) {
          return;
        }

        const nextLabel = resolved.shortName || resolved.displayName;
        if (nextLabel) {
          setLocationLabel(nextLabel);
          setSessionLocationLabel(nextLabel);
        }
      } catch {
        // Keep fallback location when geocoding service is unavailable.
      }
    };

    void hydrateLocationLabel();

    return () => {
      isMounted = false;
    };
  }, [userLatitude, userLongitude]);

  return (
    <div className="app-shell" style={isScanPage ? { background: 'transparent' } : {}}>
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
                aria-label="Current location"
                className="location-chip"
                onClick={() => setIsLocationPopoverOpen((open) => !open)}
                data-haptic="light"
              >
                <span className="location-chip__icon" aria-hidden="true">
                  <LocationPinIcon />
                </span>
                <span className="location-chip__text">{locationLabel}</span>
              </button>

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

          {isLocationPopoverOpen && (
            <div className="location-popover" role="status" aria-live="polite">
              {locationLabel}
            </div>
          )}
        </header>
      )}

      <main className="page-content" role="main" style={isScanPage ? { padding: 0, background: 'transparent' } : {}}>
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
