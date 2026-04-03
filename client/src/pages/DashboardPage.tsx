import { useNavigate } from "react-router-dom";
import { quickMetrics, urgentAlerts, weatherNow } from "../data/mockData";
import type { RiskLevel } from "../types/app";

const riskLevel: RiskLevel = "high";
const riskScore = 82;

const weatherItems = [
  {
    label: "Temperature",
    value: `${weatherNow.temperatureC}°C`,
    color: "#ef4444",
    bgColor: "rgba(239,68,68,0.1)",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Humidity",
    value: `${weatherNow.humidityPct}%`,
    color: "#3b82f6",
    bgColor: "rgba(59,130,246,0.1)",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Rainfall",
    value: `${weatherNow.rainfallMm} mm`,
    color: "#6366f1",
    bgColor: "rgba(99,102,241,0.1)",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
        <line x1="8" y1="19" x2="8" y2="21" strokeLinecap="round" />
        <line x1="8" y1="13" x2="8" y2="15" strokeLinecap="round" />
        <line x1="16" y1="19" x2="16" y2="21" strokeLinecap="round" />
        <line x1="16" y1="13" x2="16" y2="15" strokeLinecap="round" />
        <line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round" />
        <line x1="12" y1="15" x2="12" y2="17" strokeLinecap="round" />
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
      </svg>
    ),
  },
  {
    label: "Wind",
    value: `${weatherNow.windKph} km/h`,
    color: "#10b981",
    bgColor: "rgba(16,185,129,0.1)",
    icon: (
      <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" strokeLinecap="round" />
      </svg>
    ),
  },
];

function trendArrow(trend: "up" | "down" | "steady") {
  if (trend === "up") return "↑";
  if (trend === "down") return "↓";
  return "→";
}

function trendClass(trend: "up" | "down" | "steady") {
  if (trend === "up") return "trend trend--up";
  if (trend === "down") return "trend trend--down";
  return "trend trend--steady";
}

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="page page-enter stack-lg">
      {/* HERO RISK CARD */}
      <section className={`risk-card risk-card--${riskLevel}`} aria-label="Farm risk score">
        <div className="risk-card__content">
          <p className="eyebrow">Farm Risk Score · Today</p>
          <p className="risk-card__score">{riskScore}</p>
          <span
            className="risk-card__label"
            aria-live="polite"
          >
            {riskLevel.toUpperCase()} RISK
          </span>
          <p className="risk-card__desc">{weatherNow.summary}</p>
        </div>
        <div className={`risk-card__badge`} aria-hidden="true">
          <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>
            {riskLevel === "high" ? "⚠️" : riskLevel === "medium" ? "⏳" : "✅"}
          </span>
          {riskLevel.toUpperCase()}
        </div>
      </section>

      {/* WEATHER 2×2 GRID */}
      <section aria-label="Current weather conditions">
        <div className="weather-grid">
          {weatherItems.map((w) => (
            <article className="weather-widget" key={w.label}>
              <div className="weather-widget__top">
                <div
                  className="weather-widget__icon"
                  style={{ background: w.bgColor, color: w.color }}
                  aria-hidden="true"
                >
                  {w.icon}
                </div>
                <span className="weather-widget__label">{w.label}</span>
              </div>
              <div className="weather-widget__value">{w.value}</div>
            </article>
          ))}
        </div>
      </section>

      {/* QUICK ACTION TILES */}
      <section className="action-grid" aria-label="Quick actions">
        <button
          type="button"
          className="action-tile"
          onClick={() => navigate("/scan")}
          id="btn-scan-crop"
        >
          <div
            className="action-tile__icon"
            style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="6" width="16" height="12" rx="2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="action-tile__copy">
            <p className="action-tile__title">Scan Crop</p>
            <p className="action-tile__sub">Detect disease risk instantly</p>
          </div>
          <div className="action-tile__chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>

        <button
          type="button"
          className="action-tile"
          onClick={() => navigate("/forecast")}
          id="btn-forecast"
        >
          <div
            className="action-tile__icon"
            style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 14a4 4 0 1 1 3.5-6" />
              <path d="M9 14h8a3 3 0 0 0 0-6" />
              <path d="M9 18h6" />
            </svg>
          </div>
          <div className="action-tile__copy">
            <p className="action-tile__title">7-Day Forecast</p>
            <p className="action-tile__sub">Humidity-driven outbreak risk</p>
          </div>
          <div className="action-tile__chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>

        <button
          type="button"
          className="action-tile"
          onClick={() => navigate("/community")}
          id="btn-community"
        >
          <div
            className="action-tile__icon"
            style={{ background: "rgba(249,115,22,0.1)", color: "#f97316" }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="9" r="2" />
              <circle cx="16" cy="9" r="2" />
              <path d="M4.5 17a3.5 3.5 0 0 1 7 0" />
              <path d="M12.5 17a3.5 3.5 0 0 1 7 0" />
            </svg>
          </div>
          <div className="action-tile__copy">
            <p className="action-tile__title">Community</p>
            <p className="action-tile__sub">Nearby farmer reports</p>
          </div>
          <div className="action-tile__chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>
      </section>

      {/* FIELD INTELLIGENCE */}
      <section className="card stack-md" aria-label="Field intelligence">
        <div className="card-heading">
          <h3>Field Intelligence</h3>
          <p>Signal summary from weather and reports</p>
        </div>
        <div className="chip-row">
          {quickMetrics.map((metric) => (
            <div key={metric.label} className="chip-card">
              <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {metric.label}
              </p>
              <strong style={{ fontSize: "1.1rem", color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                {metric.value}
              </strong>
              <span className={trendClass(metric.trend)}>
                {trendArrow(metric.trend)} {metric.trend}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* URGENT ALERTS */}
      <section className="card" aria-label="Nearby alerts">
        <div className="card-heading">
          <h3>Nearby Alerts</h3>
          <p>Latest community detections around your farm</p>
        </div>
        <div className="alert-list">
          {urgentAlerts.map((alert) => (
            <article key={alert.id} className="alert-item">
              <div className="alert-item__left">
                <p className="alert-item__title">{alert.title}</p>
                <p className="alert-item__meta">
                  {alert.crop} · {alert.issue} · {alert.distanceKm} km away
                </p>
              </div>
              <div className="alert-item__right">
                <span className={`risk-pill risk-pill--${alert.severity}`}>
                  {alert.severity}
                </span>
                <span className="alert-item__time">{alert.reported}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FLOATING CTA */}
      <div className="dashboard-cta">
        <button
          type="button"
          id="btn-start-scan"
          className="btn btn--primary btn--block btn--native-cta"
          onClick={() => navigate("/scan")}
        >
          Start Leaf Scan
        </button>
      </div>
    </div>
  );
}
