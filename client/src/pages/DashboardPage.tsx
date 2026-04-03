import { useNavigate } from "react-router-dom";
import { quickMetrics, urgentAlerts, weatherNow } from "../data/mockData";
import type { RiskLevel } from "../types/app";

const riskLevel: RiskLevel = "high";
const riskScore = 82;

// ─── SVG icon components ──────────────────────────────────────────────────────

const ThermometerIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
);

const DropletIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const CloudRainIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="19" x2="8" y2="21" />
    <line x1="8" y1="13" x2="8" y2="15" />
    <line x1="16" y1="19" x2="16" y2="21" />
    <line x1="16" y1="13" x2="16" y2="15" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="12" y1="15" x2="12" y2="17" />
    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
  </svg>
);

const WindIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const ScanIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="6" width="16" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CloudIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 14a4 4 0 1 1 3.5-6" />
    <path d="M9 14h8a3 3 0 0 0 0-6" />
    <path d="M9 18h6" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// ─── Risk badge icon ──────────────────────────────────────────────────────────

function RiskBadgeIcon({ level }: { level: RiskLevel }) {
  if (level === "high") return <AlertTriangleIcon />;
  if (level === "medium") return <ClockIcon />;
  return <CheckCircleIcon />;
}

// ─── Trend helper ─────────────────────────────────────────────────────────────

function TrendUp() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}
function TrendDown() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function TrendSteady() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function trendClass(trend: "up" | "down" | "steady") {
  if (trend === "up") return "trend trend--up";
  if (trend === "down") return "trend trend--down";
  return "trend trend--steady";
}

// ─── Weather widget data ──────────────────────────────────────────────────────

const weatherItems = [
  {
    label: "Temperature",
    value: `${weatherNow.temperatureC}°C`,
    color: "#ef4444",
    bgColor: "rgba(239,68,68,0.1)",
    icon: <ThermometerIcon />,
  },
  {
    label: "Humidity",
    value: `${weatherNow.humidityPct}%`,
    color: "#3b82f6",
    bgColor: "rgba(59,130,246,0.1)",
    icon: <DropletIcon />,
  },
  {
    label: "Rainfall",
    value: `${weatherNow.rainfallMm} mm`,
    color: "#6366f1",
    bgColor: "rgba(99,102,241,0.1)",
    icon: <CloudRainIcon />,
  },
  {
    label: "Wind",
    value: `${weatherNow.windKph} km/h`,
    color: "#15803d",
    bgColor: "rgba(21,128,61,0.1)",
    icon: <WindIcon />,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="page page-enter stack-lg">

      {/* HERO RISK CARD */}
      <section className={`risk-card risk-card--${riskLevel}`} aria-label="Farm risk score">
        <div className="risk-card__content">
          <p className="eyebrow">Farm Risk Score · Today</p>
          <p
            className="risk-card__score"
            style={{
              fontSize: "4rem",
              fontWeight: 900,
              textShadow: riskLevel === "high"
                ? "0 4px 16px rgba(220,38,38,0.25)"
                : "none",
            }}
          >
            {riskScore}
          </p>
          <span className="risk-card__label" aria-live="polite">
            {riskLevel.toUpperCase()} RISK
          </span>
          <p className="risk-card__desc">{weatherNow.summary}</p>
        </div>

        {/* Badge with SVG icon, no emoji */}
        <div
          className="risk-card__badge"
          aria-hidden="true"
          style={riskLevel === "high" ? {
            boxShadow: "0 4px 18px rgba(220,38,38,0.22)",
          } : undefined}
        >
          <RiskBadgeIcon level={riskLevel} />
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
          id="btn-scan-crop"
          className="action-tile"
          onClick={() => navigate("/scan")}
        >
          <div
            className="action-tile__icon"
            style={{ background: "rgba(21,128,61,0.1)", color: "#15803d" }}
            aria-hidden="true"
          >
            <ScanIcon />
          </div>
          <div className="action-tile__copy">
            <p className="action-tile__title">Scan Crop</p>
            <p className="action-tile__sub">Detect disease risk instantly</p>
          </div>
          <div className="action-tile__chevron" aria-hidden="true">
            <ChevronRightIcon />
          </div>
        </button>

        <button
          type="button"
          id="btn-forecast"
          className="action-tile"
          onClick={() => navigate("/forecast")}
        >
          <div
            className="action-tile__icon"
            style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}
            aria-hidden="true"
          >
            <CloudIcon />
          </div>
          <div className="action-tile__copy">
            <p className="action-tile__title">7-Day Forecast</p>
            <p className="action-tile__sub">Humidity-driven outbreak risk</p>
          </div>
          <div className="action-tile__chevron" aria-hidden="true">
            <ChevronRightIcon />
          </div>
        </button>

        <button
          type="button"
          id="btn-community"
          className="action-tile"
          onClick={() => navigate("/community")}
        >
          <div
            className="action-tile__icon"
            style={{ background: "rgba(249,115,22,0.1)", color: "#f97316" }}
            aria-hidden="true"
          >
            <UsersIcon />
          </div>
          <div className="action-tile__copy">
            <p className="action-tile__title">Community</p>
            <p className="action-tile__sub">Nearby farmer reports</p>
          </div>
          <div className="action-tile__chevron" aria-hidden="true">
            <ChevronRightIcon />
          </div>
        </button>
      </section>

      {/* FIELD INTELLIGENCE */}
      <section className="card stack-md" aria-label="Field intelligence">
        <div className="card-heading">
          <h3>Field Intelligence</h3>
          <p>Signal summary from weather &amp; reports</p>
        </div>
        <div className="chip-row">
          {quickMetrics.map((metric) => (
            <div key={metric.label} className="chip-card">
              <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {metric.label}
              </p>
              <strong style={{ fontSize: "1.1rem", color: "var(--text-primary)", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
                {metric.value}
              </strong>
              <span className={trendClass(metric.trend)} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                {metric.trend === "up" && <TrendUp />}
                {metric.trend === "down" && <TrendDown />}
                {metric.trend === "steady" && <TrendSteady />}
                {metric.trend}
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

      {/* FLOATING PRIMARY CTA */}
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
