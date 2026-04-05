import { useEffect, useMemo, useState } from "react";
import { getSessionUser } from "../services/session";
import { fetchWeatherRisk } from "../services/weather";
import type { WeatherForecastDay } from "../services/models";

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

function WeatherIcon({ risk }: { risk: "low" | "medium" | "high" }) {
  if (risk === "high") return <WeatherHigh />;
  if (risk === "medium") return <WeatherMedium />;
  return <WeatherLow />;
}

// ────────────────────────────────────────────────────────────────────────────

function toRiskClass(riskLevel: WeatherForecastDay["risk_level"]): "low" | "medium" | "high" {
  if (riskLevel === "HIGH") return "high";
  if (riskLevel === "MEDIUM") return "medium";
  return "low";
}

function getDayLabel(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString(undefined, { weekday: "short" });
}

export function ForecastPage() {
  const [forecast, setForecast] = useState<WeatherForecastDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sessionUser = getSessionUser();
  const latitude = sessionUser?.latitude ?? 18.52;
  const longitude = sessionUser?.longitude ?? 73.85;

  useEffect(() => {
    let isMounted = true;

    const loadForecast = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetchWeatherRisk(latitude, longitude);
        if (!isMounted) {
          return;
        }

        setForecast(response.forecast || []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Failed to load forecast";
        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadForecast();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  const highRiskDays = useMemo(
    () => forecast.filter((day) => day.risk_level === "HIGH").length,
    [forecast],
  );

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

        {isLoading && <p className="card-body-text">Loading forecast...</p>}
        {!isLoading && errorMessage && <p className="card-body-text">{errorMessage}</p>}

        <div className="native-list-card" role="list">
          {forecast.map((day) => {
            const riskClass = toRiskClass(day.risk_level);

            return (
            <button
              type="button"
              className="forecast-row"
              key={day.date}
              data-row-tap
              data-haptic={riskClass === "high" ? "medium" : "light"}
            >
              <div className="forecast-day">
                <span className="forecast-day__name">{getDayLabel(day.date)}</span>
              </div>

              <div className="forecast-main">
                <span className="forecast-weather-icon">
                  <WeatherIcon risk={riskClass} />
                </span>
                <div className="forecast-main__copy">
                  <span className="forecast-temp">{Math.round(day.temperature)}°C</span>
                  <span className="forecast-stats">
                    <span>
                      <DropletIcon /> {day.humidity}%
                    </span>
                    <span>
                      <CloudIcon /> {day.precipitation_probability}%
                    </span>
                  </span>
                  <span className="forecast-reason">{day.risk_reason}</span>
                </div>
              </div>

              <span
                className={`risk-pill risk-pill--${riskClass}`}
                data-haptic={riskClass === "high" ? "medium" : "light"}
              >
                {day.risk_level}
              </span>
            </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
