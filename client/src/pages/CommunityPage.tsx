import { useNavigate } from "react-router-dom";
import { communityReports, regionalHotspots } from "../data/mockData";

export function CommunityPage() {
  const navigate = useNavigate();

  return (
    <div className="page page-enter stack-lg">
      {/* POLISHED MAP + FAB */}
      <section aria-label="Threat map">
        <div className="community-map-container">
          {/* Realistic map background */}
          <div className="map-bg" role="img" aria-label="Regional threat map with outbreak markers">
            {/* Overlay map markers */}
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

            {/* Map label overlay */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderRadius: 10,
                padding: "6px 10px",
                fontSize: "0.76rem",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
              aria-hidden="true"
            >
              📍 Live Threat Map
            </div>

            {/* Legend */}
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: 12,
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
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
                { color: "#10b981", label: "Low" },
              ].map((l) => (
                <span
                  key={l.label}
                  style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.7rem", fontWeight: 700, color: "var(--text-primary)" }}
                >
                  <span
                    style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, display: "inline-block" }}
                  />
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          {/* FAB — Report outbreak */}
          <button
            type="button"
            id="btn-report-outbreak"
            className="community-fab"
            onClick={() => navigate("/community/report")}
            aria-label="Report an outbreak"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
          Tap <strong>+</strong> to report a new outbreak in your area
        </p>
      </section>

      {/* RECENT REPORTS FEED */}
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
