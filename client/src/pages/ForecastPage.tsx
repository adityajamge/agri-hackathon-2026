import { forecastWeek } from "../data/mockData";

// ────────────────────────────────────────────────────────────────────────────
// SVG weather icons — zero emojis
// ────────────────────────────────────────────────────────────────────────────

const WeatherHigh = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
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
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 14a4 4 0 1 1 3.5-6" />
    <path d="M9 14h8a3 3 0 0 0 0-6" />
  </svg>
);

const WeatherLow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
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
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const CloudIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
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
  const visibleForecast = forecastWeek.slice(0, 5);

  return (
    <div className="page stack-lg">
      <section className="outbreak-card" aria-label="Outbreak window summary">
        <div className="outbreak-card__label-wrap">
          <span className="outbreak-card__icon" aria-hidden="true">
            <AlertIcon />
          </span>
          <p className="outbreak-card__label">OUTBREAK WINDOW</p>
        </div>
        <p className="outbreak-card__title">
          {highRiskDays} high-risk days in the next 7 days
        </p>
        <p className="outbreak-card__description">
          Plan preventive spray and field scouting before peak humidity days.
        </p>
      </section>

      <section aria-label="7-day forecast">
        <p className="section-label">DAILY RISK FORECAST</p>
        <div className="native-list-card" role="list">
          {visibleForecast.map((day) => (
            <button
              type="button"
              className="forecast-row"
              key={day.day}
              data-row-tap
              data-haptic={day.risk === "high" ? "medium" : "light"}
            >
              <div className="forecast-day">
                <span className="forecast-day__name">{day.day}</span>
              </div>

              <div className="forecast-main">
                <span className="forecast-weather-icon">
                  <WeatherIcon risk={day.risk} />
                </span>
                <div className="forecast-main__copy">
                  <span className="forecast-temp">
                    {day.tempMax}° / {day.tempMin}°
                  </span>
                  <span className="forecast-stats">
                    <span>
                      <DropletIcon /> {day.humidity}%
                    </span>
                    <span>
                      <CloudIcon /> {day.rainChance}%
                    </span>
                  </span>
                  <span className="forecast-reason">{day.reason}</span>
                </div>
              </div>

              <span
                className={`risk-pill risk-pill--${day.risk}`}
                data-haptic={day.risk === "high" ? "medium" : "light"}
              >
                {day.risk.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
