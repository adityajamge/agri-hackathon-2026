import { forecastWeek, riskRules } from "../data/mockData";

// ────────────────────────────────────────────────────────────────────────────
// SVG weather icons — zero emojis
// ────────────────────────────────────────────────────────────────────────────

const WeatherHigh = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="8" y1="19" x2="8" y2="21" />
    <line x1="8" y1="13" x2="8" y2="15" />
    <line x1="16" y1="19" x2="16" y2="21" />
    <line x1="16" y1="13" x2="16" y2="15" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="12" y1="15" x2="12" y2="17" />
    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
  </svg>
);

const WeatherMedium = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 14a4 4 0 1 1 3.5-6" />
    <path d="M9 14h8a3 3 0 0 0 0-6" />
  </svg>
);

const WeatherLow = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const DropletIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const CloudIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
  </svg>
);

const BulletIcon = () => (
  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" fill="currentColor" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

function WeatherIcon({ risk }: { risk: string }) {
  if (risk === "high") return <WeatherHigh />;
  if (risk === "medium") return <WeatherMedium />;
  return <WeatherLow />;
}

// ────────────────────────────────────────────────────────────────────────────

export function ForecastPage() {
  const highRiskDays = forecastWeek.filter((d) => d.risk === "high").length;

  return (
    <div className="page page-enter stack-lg">

      {/* OUTBREAK WINDOW — native white card with left accent border */}
      <section className="forecast-hero" aria-label="Outbreak window summary">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "var(--brand)" }}><AlertIcon /></span>
          <p className="eyebrow" style={{ color: "var(--brand)" }}>Outbreak Window</p>
        </div>
        <h2>{highRiskDays} high-risk days in the next 7 days</h2>
        <p>Plan preventive spray and field scouting before peak humidity days.</p>
      </section>

      {/* 7-DAY FORECAST LIST */}
      <section aria-label="7-day forecast">
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
          Daily Risk Forecast
        </p>
        <div className="forecast-list" role="list">
          {forecastWeek.map((day) => (
            <div className="forecast-row" key={day.day} role="listitem">
              {/* Day + SVG weather icon */}
              <div className="forecast-day">
                <span className="forecast-day__name">{day.day}</span>
                <WeatherIcon risk={day.risk} />
              </div>

              {/* Temps + detail row */}
              <div className="forecast-temps">
                <span className="forecast-temps__range">
                  {day.tempMax}° / {day.tempMin}°
                </span>
                <span className="forecast-temps__detail" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 2, color: "#3b82f6" }}>
                    <DropletIcon /> {day.humidity}%
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 2, color: "#6366f1" }}>
                    <CloudIcon /> {day.rainChance}%
                  </span>
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", marginTop: 1 }}>
                  {day.reason}
                </span>
              </div>

              {/* Risk pill */}
              <div className="forecast-row__right">
                <span className={`risk-pill risk-pill--${day.risk}`}>
                  {day.risk.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RISK ENGINE LOGIC */}
      <section className="card stack-md" aria-label="Risk engine logic">
        <div className="card-heading">
          <h3>Risk Engine Logic</h3>
          <p>How outbreak scores are calculated</p>
        </div>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.5px",
            background: "var(--separator)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {riskRules.map((rule) => (
            <li
              key={rule}
              style={{
                background: "var(--card-bg)",
                padding: "11px 14px",
                fontSize: "0.85rem",
                color: "var(--text-primary)",
                lineHeight: 1.5,
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <span style={{ color: "var(--brand)", marginTop: 4, flexShrink: 0 }}>
                <BulletIcon />
              </span>
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
