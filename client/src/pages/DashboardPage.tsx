import { useNavigate } from "react-router-dom";
import { quickMetrics, urgentAlerts, weatherNow } from "../data/mockData";
import type { RiskLevel } from "../types/app";

const riskLevel: RiskLevel = "high";
const riskScore = 82;

function trendClass(trend: "up" | "down" | "steady") {
  if (trend === "up") {
    return "trend trend--up";
  }

  if (trend === "down") {
    return "trend trend--down";
  }

  return "trend trend--steady";
}

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="page page-enter stack-lg">
      <section className={`risk-card risk-card--${riskLevel}`}>
        <div>
          <p className="eyebrow">Today</p>
          <h2>Farm Risk Score: {riskScore}/100</h2>
          <p className="risk-description">{weatherNow.summary}</p>
        </div>
        <div className={`risk-orb risk-orb--${riskLevel}`} aria-hidden="true">
          {riskLevel.toUpperCase()}
        </div>
      </section>

      <section className="action-grid">
        <button
          type="button"
          className="action-tile"
          onClick={() => navigate("/scan")}
        >
          <p className="action-tile__title">Scan Crop</p>
          <p>Capture leaf photo and detect disease risk instantly.</p>
        </button>

        <button
          type="button"
          className="action-tile"
          onClick={() => navigate("/forecast")}
        >
          <p className="action-tile__title">Forecast</p>
          <p>View humidity-driven outbreak forecast for next 7 days.</p>
        </button>

        <button
          type="button"
          className="action-tile"
          onClick={() => navigate("/community")}
        >
          <p className="action-tile__title">Community</p>
          <p>Check nearby farmer reports and local hotspot clusters.</p>
        </button>
      </section>

      <section className="metrics-grid">
        <article className="metric-card">
          <p className="metric-card__label">Temperature</p>
          <p className="metric-card__value">{weatherNow.temperatureC} C</p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">Humidity</p>
          <p className="metric-card__value">{weatherNow.humidityPct}%</p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">Rainfall</p>
          <p className="metric-card__value">{weatherNow.rainfallMm} mm</p>
        </article>
        <article className="metric-card">
          <p className="metric-card__label">Wind</p>
          <p className="metric-card__value">{weatherNow.windKph} km/h</p>
        </article>
      </section>

      <section className="card stack-md">
        <div className="card-heading">
          <h3>Field intelligence</h3>
          <p>Signal summary from weather and local reports</p>
        </div>

        <div className="chip-row">
          {quickMetrics.map((metric) => (
            <div key={metric.label} className="chip-card">
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
              <span className={trendClass(metric.trend)}>{metric.trend}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card stack-md">
        <div className="card-heading">
          <h3>Nearby urgent alerts</h3>
          <p>Latest community detections around your farm</p>
        </div>

        <div className="alert-list">
          {urgentAlerts.map((alert) => (
            <article key={alert.id} className="alert-item">
              <div>
                <p className="alert-item__title">{alert.title}</p>
                <p className="alert-item__meta">
                  {alert.crop} - {alert.issue} - {alert.distanceKm} km away
                </p>
              </div>
              <div className="alert-item__right">
                <span className={`risk-pill risk-pill--${alert.severity}`}>
                  {alert.severity}
                </span>
                <span>{alert.reported}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
