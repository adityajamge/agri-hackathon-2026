import { useNavigate } from "react-router-dom";
import { communityReports, regionalHotspots } from "../data/mockData";

// ─── SVG Icons ──────────────────────────────────────────────────────────────

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

export function CommunityPage() {
  const navigate = useNavigate();

  return (
    <div className="page page-enter stack-lg">

      {/* MAP + FAB */}
      <section aria-label="Threat map">
        <div className="community-map-container">
          <div
            className="map-bg"
            role="img"
            aria-label="Regional threat map showing outbreak markers"
          >
            {/* Markers layer */}
            <div className="map-canvas">
              {regionalHotspots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  className={`map-marker map-marker--${spot.severity}`}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  aria-label={`${spot.label} — ${spot.reports} reports, ${spot.severity} severity`}
                >
                  {spot.reports}
                </button>
              ))}
            </div>

            {/* Label chip — no emoji */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: 10,
                padding: "6px 10px",
                fontSize: "0.76rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
              aria-hidden="true"
            >
              <span style={{ color: "var(--brand)" }}><PinIcon /></span>
              Live Threat Map
            </div>

            {/* Legend — no emojis */}
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: 10,
                padding: "7px 10px",
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
              aria-hidden="true"
            >
              {[
                { color: "#ef4444", label: "High" },
                { color: "#f59e0b", label: "Med" },
                { color: "#15803d", label: "Low" },
              ].map((l) => (
                <span
                  key={l.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: l.color,
                      display: "inline-block",
                    }}
                  />
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          {/* Floating action button — deep forest green + strong shadow */}
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

        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            textAlign: "center",
            marginTop: 6,
          }}
        >
          Tap the button to report a new outbreak in your area
        </p>
      </section>

      {/* RECENT FARMER REPORTS */}
      <section aria-label="Recent farmer reports">
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-secondary)",
            padding: "0 4px 6px",
          }}
        >
          Farmer Reports · Last 48h
        </p>
        <div className="report-feed" role="list">
          {communityReports.map((report) => (
            <article key={report.id} className="report-item" role="listitem">
              <div className="report-item__header">
                <span className="report-item__name">{report.reporter}</span>
                <span className={`risk-pill risk-pill--${report.severity}`}>
                  {report.severity}
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
