import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cropOptions } from "../data/mockData";

type LocationMode = "gps" | "manual";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState(cropOptions[0].name);
  const [locationMode, setLocationMode] = useState<LocationMode>("gps");
  const [farmName, setFarmName] = useState("Green Acre Farm");
  const [village, setVillage] = useState("Nandgaon");

  const canProceed =
    step < 3 || (farmName.trim().length > 1 && village.trim().length > 1);

  const saveSetup = () => {
    localStorage.setItem("cropguard.onboarded", "true");
    localStorage.setItem(
      "cropguard.profile",
      JSON.stringify({
        farmName: farmName.trim(),
        village: village.trim(),
        district: "Nashik",
        primaryCrop: selectedCrop,
        language: "English",
      }),
    );
    navigate("/dashboard", { replace: true });
  };

  const handleContinue = () => {
    if (!canProceed) {
      return;
    }

    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    saveSetup();
  };

  return (
    <div className="onboarding-root page page-enter">
      <div className="onboarding-panel">
        <p className="eyebrow">Phase 1 Setup</p>
        <h1>Protect crops before damage spreads</h1>
        <p className="lead-text">
          Three quick steps to personalize the dashboard, scanner, and outbreak
          alerts for your farm.
        </p>

        <div className="step-dots" aria-label={`Step ${step} of 3`}>
          {[1, 2, 3].map((dot) => (
            <span
              key={dot}
              className={`step-dot${dot <= step ? " is-active" : ""}`}
            />
          ))}
        </div>

        {step === 1 && (
          <section className="step-card">
            <h2>What CropGuard does</h2>
            <div className="feature-grid">
              <article className="feature-card">
                <p className="feature-title">Early disease detection</p>
                <p>Scan leaf photos and get instant diagnosis confidence.</p>
              </article>
              <article className="feature-card">
                <p className="feature-title">7 day outbreak forecast</p>
                <p>Weather + local reports convert into a practical risk score.</p>
              </article>
              <article className="feature-card">
                <p className="feature-title">Community intelligence</p>
                <p>Nearby farmer reports create regional early warning alerts.</p>
              </article>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="step-card">
            <h2>Select your primary crop</h2>
            <div className="crop-grid">
              {cropOptions.map((crop) => (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => setSelectedCrop(crop.name)}
                  className={`option-card${
                    selectedCrop === crop.name ? " is-selected" : ""
                  }`}
                >
                  <span className="option-card__code">{crop.shortCode}</span>
                  <span className="option-card__name">{crop.name}</span>
                  <span className="option-card__hint">{crop.climate}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="step-card">
            <h2>Farm location and identity</h2>
            <div className="location-mode" role="radiogroup" aria-label="Location mode">
              <button
                type="button"
                className={`mode-button${
                  locationMode === "gps" ? " is-selected" : ""
                }`}
                onClick={() => setLocationMode("gps")}
                role="radio"
                aria-checked={locationMode === "gps"}
              >
                Use current GPS
              </button>
              <button
                type="button"
                className={`mode-button${
                  locationMode === "manual" ? " is-selected" : ""
                }`}
                onClick={() => setLocationMode("manual")}
                role="radio"
                aria-checked={locationMode === "manual"}
              >
                Enter manually
              </button>
            </div>

            <div className="form-grid">
              <label className="field-group">
                <span>Farm name</span>
                <input
                  value={farmName}
                  onChange={(event) => setFarmName(event.target.value)}
                  placeholder="Enter farm name"
                />
              </label>

              <label className="field-group">
                <span>Village</span>
                <input
                  value={village}
                  onChange={(event) => setVillage(event.target.value)}
                  placeholder="Enter village"
                />
              </label>

              <p className="helper-text">
                {locationMode === "gps"
                  ? "GPS will be used when native device permissions are connected."
                  : "Manual location keeps the app functional when GPS is unavailable."}
              </p>
            </div>
          </section>
        )}

        <div className="page-actions">
          {step > 1 ? (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setStep((current) => Math.max(1, current - 1))}
            >
              Back
            </button>
          ) : (
            <button type="button" className="btn btn--ghost" onClick={saveSetup}>
              Skip Setup
            </button>
          )}

          <button
            type="button"
            className="btn btn--primary"
            onClick={handleContinue}
            disabled={!canProceed}
          >
            {step === 3 ? "Start Dashboard" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
