import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWeatherRisk } from "../services/weather";
import { getSessionUser } from "../services/session";
import type { WeatherRiskResponse } from "../services/models";

const ThermometerIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
);

const DropletIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const CloudRainIcon = () => (
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

const WindIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const ScanIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="6" width="16" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CloudIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 14a4 4 0 1 1 3.5-6" />
    <path d="M9 14h8a3 3 0 0 0 0-6" />
    <path d="M9 18h6" />
  </svg>
);

function toRiskClass(level: WeatherRiskResponse["risk_level"] | undefined) {
  if (level === "HIGH") return "high";
  if (level === "MEDIUM") return "medium";
  return "low";
}

function computeRiskScore(weather: WeatherRiskResponse | null) {
  if (!weather) {
    return 0;
  }

  if (weather.risk_level === "HIGH") {
    const score = weather.humidity + (weather.rainfall_expected ? 12 : 4);
    return Math.max(80, Math.min(98, Math.round(score)));
  }

  if (weather.risk_level === "MEDIUM") {
    const score = (weather.temperature + weather.humidity) / 2;
    return Math.max(50, Math.min(79, Math.round(score)));
  }

  return Math.max(15, Math.min(49, Math.round(weather.humidity * 0.45)));
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherRiskResponse | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);

  const sessionUser = getSessionUser();
  const latitude = sessionUser?.latitude ?? 18.52;
  const longitude = sessionUser?.longitude ?? 73.85;

  useEffect(() => {
    let isMounted = true;

    const loadWeather = async () => {
      setIsLoading(true);
      setWeatherError(null);

      try {
        const response = await fetchWeatherRisk(latitude, longitude);
        if (!isMounted) {
          return;
        }

        setWeather(response);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Failed to load weather risk";
        setWeatherError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadWeather();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  const targetRiskScore = useMemo(() => computeRiskScore(weather), [weather]);

  useEffect(() => {
    if (targetRiskScore <= 0) {
      setAnimatedScore(0);
      return;
    }

    const durationMs = 600;
    const start = performance.now();

    let rafId = 0;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;

      setAnimatedScore(Math.round(targetRiskScore * eased));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [targetRiskScore]);

  const rainfallToday = weather?.forecast?.[0]?.precipitation_sum_mm ?? 0;
  const riskClass = toRiskClass(weather?.risk_level);
  const riskLabel = weather?.risk_level || "LOW";

  const weatherItems = [
    {
      label: "Temperature",
      value: weather ? `${weather.temperature}°C` : "--",
      tintClass: "weather-widget__icon-wrap--temp",
      icon: <ThermometerIcon />,
    },
    {
      label: "Humidity",
      value: weather ? `${weather.humidity}%` : "--",
      tintClass: "weather-widget__icon-wrap--humidity",
      icon: <DropletIcon />,
    },
    {
      label: "Rainfall",
      value: weather ? `${rainfallToday.toFixed(1)} mm` : "--",
      tintClass: "weather-widget__icon-wrap--rain",
      icon: <CloudRainIcon />,
    },
    {
      label: "Outbreak Risk",
      value: riskLabel,
      tintClass: "weather-widget__icon-wrap--wind",
      icon: <WindIcon />,
    },
  ];

  return (
    <div className="page stack-lg">
      <section className="radar-risk-card" aria-label="Farm risk score">
        <div className="radar-risk-copy">
          <p className="section-caption">FARM RISK SCORE · TODAY</p>
          <p className="radar-risk-score" aria-live="polite">
            {animatedScore}
          </p>
          <span
            className={`radar-risk-chip risk-pill risk-pill--${riskClass}`}
            role="button"
            tabIndex={0}
            data-haptic="medium"
          >
            {riskLabel} RISK
          </span>
          <p className="card-body-text">
            {isLoading && "Fetching latest local risk signal..."}
            {!isLoading && weather && weather.risk_reason}
            {!isLoading && !weather && weatherError && weatherError}
          </p>
        </div>

        <div
          className="radar-risk-icon"
          role="button"
          tabIndex={0}
          data-haptic="medium"
          aria-label="High risk warning"
        >
          <AlertTriangleIcon />
        </div>
      </section>

      <section aria-label="Current weather metrics">
        <div className="weather-grid">
          {weatherItems.map((item) => (
            <article className="weather-widget" key={item.label}>
              <div className="weather-widget__header">
                <div className={`weather-widget__icon-wrap ${item.tintClass}`}>{item.icon}</div>
                <p className="metric-label">{item.label}</p>
              </div>
              <p className="weather-widget__value">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Quick actions">
        <div className="native-list-card" role="list">
          <button
            type="button"
            className="native-list-row"
            data-row-tap
            onClick={() => navigate("/scan")}
          >
            <span className="native-row-icon native-row-icon--scan" aria-hidden="true">
              <ScanIcon />
            </span>
            <span className="native-row-copy">
              <span className="native-row-title">Scan Crop</span>
              <span className="native-row-subtitle">Detect disease risk instantly</span>
            </span>
            <span className="native-row-chevron" aria-hidden="true">
              <ChevronRightIcon />
            </span>
          </button>

          <button
            type="button"
            className="native-list-row"
            data-row-tap
            onClick={() => navigate("/forecast")}
          >
            <span className="native-row-icon native-row-icon--forecast" aria-hidden="true">
              <CloudIcon />
            </span>
            <span className="native-row-copy">
              <span className="native-row-title">7-Day Forecast</span>
              <span className="native-row-subtitle">Humidity-driven outbreak outlook</span>
            </span>
            <span className="native-row-chevron" aria-hidden="true">
              <ChevronRightIcon />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
