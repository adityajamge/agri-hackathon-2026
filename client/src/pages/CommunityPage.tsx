import { useNavigate } from "react-router-dom";
import { communityReports, regionalHotspots } from "../data/mockData";

// ─── SVG Icons ──────────────────────────────────────────────────────────────

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

export function CommunityPage() {
  const navigate = useNavigate();

  return (
    <div className="page stack-lg">
      <section aria-label="Threat map">
        <div className="community-map-container">
          <div
            className="map-bg"
            role="img"
            aria-label="Regional threat map showing outbreak markers"
          >
            <div className="map-canvas">
              {regionalHotspots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  className={`map-marker map-marker--${spot.severity}`}
                  data-haptic={spot.severity === "high" ? "medium" : "light"}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  aria-label={`${spot.label} — ${spot.reports} reports, ${spot.severity} severity`}
                >
                  {spot.reports}
                </button>
              ))}
            </div>

            <div className="map-live-pill" aria-hidden="true">
              <span className="map-live-pill__icon">
                <PinIcon />
              </span>
              Live Threat Map
            </div>

            <div className="map-legend" aria-hidden="true">
              {[
                { color: "#D93025", label: "High" },
                { color: "#F29900", label: "Med" },
                { color: "#1A7F45", label: "Low" },
              ].map((l) => (
                <span key={l.label} className="map-legend__item">
                  <span className="map-legend__dot" style={{ background: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            id="btn-report-outbreak"
            className="community-fab"
            onClick={() => navigate("/community/report")}
            aria-label="Report an outbreak"
          >
            <PlusIcon />
          </button>
        </div>
      </section>

      <section aria-label="Recent farmer reports">
        <p className="section-label">FARMER REPORTS · LAST 48H</p>
        <div className="native-list-card report-feed" role="list">
          {communityReports.map((report) => (
            <article
              key={report.id}
              className="report-item tap-row"
              role="listitem"
              data-row-tap
              data-haptic={report.severity === "high" ? "medium" : "light"}
            >
              <div className="report-item__header">
                <span className="report-item__name">{report.reporter}</span>
                <span
                  className={`risk-pill risk-pill--${report.severity}`}
                  data-haptic={report.severity === "high" ? "medium" : "light"}
                >
                  {report.severity.toUpperCase()}
                </span>
              </div>
              <p className="report-item__meta">
                {report.crop} · {report.issue} · {report.distanceKm} km · {report.time}
              </p>
              <p className="report-item__note">{report.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
