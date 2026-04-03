import { useNavigate } from "react-router-dom";
import { latestScan } from "../data/mockData";

export function ScanResultPage() {
  const navigate = useNavigate();

  return (
    <div className="page page-enter stack-lg">
      <section className="result-hero">
        <p className="eyebrow">Diagnosis</p>
        <h2>{latestScan.issue}</h2>
        <p>{latestScan.imageHint}</p>

        <div className="result-meter" role="meter" aria-valuenow={latestScan.confidence}>
          <div
            className="result-meter__bar"
            style={{ width: `${latestScan.confidence}%` }}
          />
          <span>{latestScan.confidence}% confidence</span>
        </div>

        <div className="result-tags">
          <span className="soft-tag">Crop: {latestScan.crop}</span>
          <span className={`risk-pill risk-pill--${latestScan.severity}`}>
            Severity: {latestScan.severity}
          </span>
        </div>
      </section>

      <section className="card stack-md">
        <div className="card-heading">
          <h3>Action plan</h3>
          <p>Prioritizing eco-first interventions</p>
        </div>

        <ol className="action-plan">
          {latestScan.advisory.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>

        <div className="recommendation-grid">
          <article className="recommendation-card">
            <p className="eyebrow">Bio control first</p>
            <strong>{latestScan.ecoOption}</strong>
          </article>
          <article className="recommendation-card">
            <p className="eyebrow">Chemical backup</p>
            <strong>{latestScan.chemicalOption}</strong>
          </article>
        </div>
      </section>

      <section className="action-row">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => navigate("/scan")}
        >
          Scan Again
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => navigate("/community/report")}
        >
          Share Alert
        </button>
      </section>
    </div>
  );
}
