import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchScanHistory } from "../services/cropHealth";
import { clearSession, getSessionUser } from "../services/session";
import type { CropScanResult } from "../services/models";

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString();
}

// ─── SVG icons ───────────────────────────────────────────────────────────────

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const WifiIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
  </svg>
);

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 8C8 10 5.9 16.17 3.82 19.98" />
    <path d="M3 6C8 6 12 9 12 14" />
    <path d="M12 14c0-5 4-8 9-8" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

export function ProfilePage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<CropScanResult[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const sessionUser = getSessionUser();
  const profile = useMemo(
    () => ({
      farmName: sessionUser?.farmName || "My Farm",
      village: sessionUser?.village || "Unknown Village",
      district: sessionUser?.district || "Unknown District",
      primaryCrop: sessionUser?.primaryCrop || "Unknown Crop",
      language: "English",
    }),
    [sessionUser],
  );

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      setIsLoadingHistory(true);
      setHistoryError(null);

      try {
        const response = await fetchScanHistory(20);
        if (!isMounted) {
          return;
        }

        setHistory(response.history || []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Failed to load scan history";
        setHistoryError(message);
      } finally {
        if (isMounted) {
          setIsLoadingHistory(false);
        }
      }
    };

    void loadHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  // Generate initials for circular avatar
  const initials = profile.farmName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="page stack-lg">
      <section className="farm-profile-card" aria-label="Farm profile">
        <div className="farm-profile-avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="farm-profile-copy">
          <p className="farm-profile-name">{profile.farmName}</p>
          <p className="farm-profile-location">
            {profile.village}, {profile.district}
          </p>
          <span className="farm-profile-crop">{profile.primaryCrop}</span>
        </div>
      </section>

      <section aria-label="Detection history">
        <p className="section-label">DETECTION HISTORY</p>

        {isLoadingHistory && <p className="card-body-text">Loading scan history...</p>}
        {!isLoadingHistory && historyError && <p className="card-body-text">{historyError}</p>}

        <div className="native-list-card" role="list">
          {history.map((entry) => (
            <article
              key={entry.id}
              className="history-item tap-row"
              role="listitem"
              data-row-tap
              data-haptic={entry.confidence_percent >= 90 ? "medium" : "light"}
            >
              <div className="history-item__left">
                <p className="history-item__title">{entry.diseaseName}</p>
                <p className="history-item__meta">
                  {entry.cropName || "Unknown crop"} · {formatDate(entry.createdAt)}
                </p>
              </div>
              <div className="history-item__right">
                <span className="history-item__confidence">
                  {entry.confidence_percent}%
                </span>
                <span className="history-item__outcome">
                  {entry.isHealthy ? "Healthy" : "Treatment advised"}
                </span>
              </div>
            </article>
          ))}

          {!isLoadingHistory && history.length === 0 && !historyError && (
            <article className="history-item" role="listitem">
              <div className="history-item__left">
                <p className="history-item__title">No scans yet</p>
                <p className="history-item__meta">Run your first crop scan to build history.</p>
              </div>
            </article>
          )}
        </div>
      </section>

      <section aria-label="Preferences">
        <p className="section-label">PREFERENCES</p>
        <div className="native-list-card preferences-list" role="list">
          <article className="preferences-row tap-row" data-row-tap role="listitem">
            <div
              className="preferences-row__icon"
              style={{ background: "#EAF0FE", color: "#3B71DE" }}
              aria-hidden="true"
            >
              <GlobeIcon />
            </div>
            <div className="preferences-row__body">
              <p className="preferences-row__title">Language</p>
              <p className="preferences-row__subtitle">App language</p>
            </div>
            <div className="preferences-row__value">
              {profile.language}
              <ChevronRightIcon />
            </div>
          </article>

          <article className="preferences-row tap-row" data-row-tap role="listitem">
            <div
              className="preferences-row__icon"
              style={{ background: "#FDECEA", color: "#D93025" }}
              aria-hidden="true"
            >
              <BellIcon />
            </div>
            <div className="preferences-row__body">
              <p className="preferences-row__title">Risk Notifications</p>
              <p className="preferences-row__subtitle">Outbreak alerts &amp; warnings</p>
            </div>
            <div className="preferences-row__value">
              Enabled
              <ChevronRightIcon />
            </div>
          </article>

          <article className="preferences-row tap-row" data-row-tap role="listitem">
            <div
              className="preferences-row__icon"
              style={{ background: "#E8F5EE", color: "#1A7F45" }}
              aria-hidden="true"
            >
              <WifiIcon />
            </div>
            <div className="preferences-row__body">
              <p className="preferences-row__title">Offline Sync</p>
              <p className="preferences-row__subtitle">Model and data caching</p>
            </div>
            <div className="preferences-row__value">
              WiFi + Mobile
              <ChevronRightIcon />
            </div>
          </article>

          <article className="preferences-row tap-row" data-row-tap role="listitem">
            <div
              className="preferences-row__icon"
              style={{ background: "#E8F5EE", color: "#1A7F45" }}
              aria-hidden="true"
            >
              <LeafIcon />
            </div>
            <div className="preferences-row__body">
              <p className="preferences-row__title">Primary Crop</p>
              <p className="preferences-row__subtitle">Main monitored crop</p>
            </div>
            <div className="preferences-row__value">
              {profile.primaryCrop}
              <ChevronRightIcon />
            </div>
          </article>
        </div>
      </section>

      <section aria-label="Account actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            clearSession();
            navigate("/onboarding", { replace: true });
          }}
        >
          Sign Out
        </button>
      </section>
    </div>
  );
}
