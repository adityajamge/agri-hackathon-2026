import { forecastWeek, regionalHotspots, riskRules } from "../data/mockData";

export function ForecastPage() {
  const highRiskDays = forecastWeek.filter((day) => day.risk === "high").length;

  return (
    <div className="page page-enter stack-lg">
      <section className="forecast-summary">
        <div>
          <p className="eyebrow">Outbreak Window</p>
          <h2>{highRiskDays} high-risk days in next 7 days</h2>
          <p>
            Plan preventive spray and field scouting before peak humidity days.
          </p>
        </div>
      </section>

      <section className="forecast-grid">
        {forecastWeek.map((day) => (
          <article key={day.day} className="forecast-card">
            <header>
              <h3>{day.day}</h3>
              <span className={`risk-pill risk-pill--${day.risk}`}>{day.risk}</span>
            </header>
            <p>{day.tempMin} C to {day.tempMax} C</p>
            <p>Humidity: {day.humidity}%</p>
            <p>Rain chance: {day.rainChance}%</p>
            <p className="forecast-card__reason">{day.reason}</p>
          </article>
        ))}
      </section>

      <section className="card stack-md">
        <div className="card-heading">
          <h3>Regional risk map</h3>
          <p>Prototype visual for nearby risk clusters</p>
        </div>

        <div className="map-canvas" role="img" aria-label="Regional risk map preview">
          {regionalHotspots.map((spot) => (
            <button
              key={spot.id}
              type="button"
              className={`map-marker map-marker--${spot.severity}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-label={`${spot.label} hotspot`}
            >
              <span>{spot.reports}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card stack-sm">
        <h3>Risk engine logic</h3>
        <ul className="tips-list">
          {riskRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
