import { forecastWeek, riskRules } from "../data/mockData";

const weatherIconMap: Record<string, string> = {
  high: "🌧️",
  medium: "⛅",
  low: "☀️",
};

export function ForecastPage() {
  const highRiskDays = forecastWeek.filter((d) => d.risk === "high").length;

  return (
    <div className="page page-enter stack-lg">
      {/* HERO BANNER */}
      <section className="forecast-hero" aria-label="Outbreak window summary">
        <p className="eyebrow">Outbreak Window</p>
        <h2>{highRiskDays} high-risk days in next 7 days</h2>
        <p>Plan preventive spray and field scouting before peak humidity days.</p>
      </section>

      {/* iOS-STYLE FORECAST LIST */}
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
              {/* Left: Day + weather icon */}
              <div className="forecast-day">
                <span className="forecast-day__name">{day.day}</span>
                <span className="forecast-day__icon" aria-hidden="true">
                  {weatherIconMap[day.risk]}
                </span>
              </div>

              {/* Center: Temps + details */}
              <div className="forecast-temps">
                <span className="forecast-temps__range">
                  {day.tempMax}° / {day.tempMin}°
                </span>
                <span className="forecast-temps__detail">
                  💧 {day.humidity}% · 🌧 {day.rainChance}%
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    marginTop: "1px",
                  }}
                >
                  {day.reason}
                </span>
              </div>

              {/* Right: Risk pill */}
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
              <span
                style={{
                  color: "var(--brand)",
                  fontSize: "1rem",
                  lineHeight: 1.3,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                ●
              </span>
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
