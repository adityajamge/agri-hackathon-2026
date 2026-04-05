import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { analyzeCropHealth } from "../services/cropHealth";
import { getSessionUser } from "../services/session";
import type { CropScanResult, TreatmentPlan } from "../services/models";

type ScanRouteState = {
  image?: string;
};

function severityFromResult(result: CropScanResult | null): "low" | "medium" | "high" {
  if (!result) {
    return "medium";
  }

  if (result.isHealthy) {
    return "low";
  }

  if (result.probability >= 0.85) {
    return "high";
  }

  if (result.probability >= 0.6) {
    return "medium";
  }

  return "low";
}

function toList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
}

export function ScanResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as ScanRouteState | null) || null;
  const imageBase64 = routeState?.image;

  const [scanResult, setScanResult] = useState<CropScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!imageBase64) {
      setErrorMessage("No image found. Please scan or upload a leaf photo first.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const runAnalysis = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const user = getSessionUser();
        const response = await analyzeCropHealth({
          imageBase64,
          latitude: user?.latitude ?? undefined,
          longitude: user?.longitude ?? undefined,
          userId: user?.id,
        });

        if (!isMounted) {
          return;
        }

        setScanResult(response.result);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Failed to analyze crop image";
        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void runAnalysis();

    return () => {
      isMounted = false;
    };
  }, [imageBase64]);

  const treatment = useMemo<TreatmentPlan>(() => scanResult?.treatment || {}, [scanResult]);
  const biologicalOptions = useMemo(() => toList(treatment.biological), [treatment.biological]);
  const chemicalOptions = useMemo(() => toList(treatment.chemical), [treatment.chemical]);
  const preventionSteps = useMemo(() => toList(treatment.prevention), [treatment.prevention]);

  const advisory = preventionSteps.length
    ? preventionSteps
    : ["Monitor leaf changes daily and consult local agri extension support if symptoms spread."];
  const severity = severityFromResult(scanResult);
  const confidence = scanResult?.confidence_percent ?? 0;
  const diagnosisTitle = scanResult?.diseaseName || "Pending diagnosis";
  const cropTitle = scanResult?.cropName || "Unknown crop";

  if (!imageBase64 && !isLoading) {
    return (
      <div className="page stack-lg">
        <section className="card" aria-label="Missing image">
          <div className="card-heading">
            <h3>No scan image found</h3>
            <p>Please capture or upload a leaf image to continue.</p>
          </div>
          <div className="action-row">
            <button type="button" className="btn btn--primary" onClick={() => navigate("/scan")}>
              Go to Scanner
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page stack-lg">
      {/* RESULT HERO */}
      <section className="result-hero" aria-label="Diagnosis result">
        <div>
          <p className="eyebrow">AI Diagnosis</p>
          <h2>{isLoading ? "Analyzing leaf image..." : diagnosisTitle}</h2>
        </div>

        <div
          className="result-meter"
          role="meter"
          aria-valuenow={confidence}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Confidence: ${confidence}%`}
        >
          <div
            className="result-meter__bar"
            style={{ width: `${confidence}%` }}
            aria-hidden="true"
          />
          <span>{isLoading ? "Running model..." : `${confidence}% confidence`}</span>
        </div>

        <div className="result-tags">
          <span className="soft-tag">{cropTitle}</span>
          <span
            className={`risk-pill risk-pill--${severity}`}
            data-haptic={severity === "high" ? "medium" : "light"}
          >
            {severity.toUpperCase()} severity
          </span>
        </div>

        <p>
          {errorMessage
            ? errorMessage
            : scanResult?.isHealthy
              ? "Plant appears healthy in this scan. Keep monitoring and repeat scan if symptoms appear."
              : "Detected disease risk from uploaded image. Follow the action plan below."}
        </p>
      </section>

      {/* ACTION PLAN */}
      <section className="card" aria-label="Action plan">
        <div className="card-heading">
          <h3>Action Plan</h3>
          <p>Eco-first intervention steps</p>
        </div>
        <ol className="action-plan">
          {advisory.map((item) => (
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
              {biologicalOptions[0] || "No biological treatment returned for this scan."}
            </strong>
          </article>
          <article className="recommendation-card">
            <p className="eyebrow">Chemical Backup</p>
            <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.4 }}>
              {chemicalOptions[0] || "No chemical backup suggestion returned for this scan."}
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
