import { useNavigate } from "react-router-dom";
import { latestScan } from "../data/mockData";

export function ScanResultPage() {
  const navigate = useNavigate();

  return (
    <div className="page stack-lg">
      {/* RESULT HERO */}
      <section className="result-hero" aria-label="Diagnosis result">
        <div>
          <p className="eyebrow">AI Diagnosis</p>
          <h2>{latestScan.issue}</h2>
        </div>

        <div
          className="result-meter"
          role="meter"
          aria-valuenow={latestScan.confidence}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Confidence: ${latestScan.confidence}%`}
        >
          <div
            className="result-meter__bar"
            style={{ width: `${latestScan.confidence}%` }}
            aria-hidden="true"
          />
          <span>{latestScan.confidence}% confidence</span>
        </div>

        <div className="result-tags">
          <span className="soft-tag">{latestScan.crop}</span>
          <span
            className={`risk-pill risk-pill--${latestScan.severity}`}
            data-haptic={latestScan.severity === "high" ? "medium" : "light"}
          >
            {latestScan.severity.toUpperCase()} severity
          </span>
        </div>

        <p>{latestScan.imageHint}</p>
      </section>

      {/* ACTION PLAN */}
      <section className="card" aria-label="Action plan">
        <div className="card-heading">
          <h3>Action Plan</h3>
          <p>Eco-first intervention steps</p>
        </div>
        <ol className="action-plan">
          {latestScan.advisory.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      {/* TREATMENT OPTIONS */}
      <section aria-label="Treatment recommendations">
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
          Treatment Options
        </p>
        <div className="recommendation-grid">
          <article className="recommendation-card">
            <p className="eyebrow">Bio Control First</p>
            <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.4 }}>
              {latestScan.ecoOption}
            </strong>
          </article>
          <article className="recommendation-card">
            <p className="eyebrow">Chemical Backup</p>
            <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.4 }}>
              {latestScan.chemicalOption}
            </strong>
          </article>
        </div>
      </section>

      {/* ACTIONS */}
      <div className="action-row">
        <button
          type="button"
          id="btn-scan-again"
          className="btn btn--ghost"
          onClick={() => navigate("/scan")}
        >
          Scan Again
        </button>
        <button
          type="button"
          id="btn-share-alert"
          className="btn btn--primary"
          onClick={() => navigate("/community/report")}
        >
          Share Alert
        </button>
      </div>
    </div>
  );
}
