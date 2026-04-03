import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { cropOptions } from "../data/mockData";
import "./OnboardingPage.css";

type LocationMode = "gps" | "manual";
type TransitionPhase = "entered" | "exiting" | "entering";

type HeroVariant = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  tone: "brand" | "feature";
};

const heroVariants: Record<number, HeroVariant> = {
  1: {
    icon: <LeafHeroIcon />,
    title: "CropGuard",
    subtitle: "Smart farming protection",
    tone: "brand",
  },
  2: {
    icon: <GrainHeroIcon />,
    title: "Choose your crop",
    subtitle: "We'll customize alerts for you",
    tone: "feature",
  },
  3: {
    icon: <PinHeroIcon />,
    title: "Your farm location",
    subtitle: "For hyper-local risk alerts",
    tone: "feature",
  },
};

const features = [
  {
    title: "Early disease detection",
    description: "Scan leaves and detect disease risk instantly.",
    toneClass: "onb-feature-icon--disease",
    icon: <DiseaseIcon />,
  },
  {
    title: "7-day outbreak forecast",
    description: "Get weather-driven risk windows before spread.",
    toneClass: "onb-feature-icon--forecast",
    icon: <ForecastIcon />,
  },
  {
    title: "Community intelligence",
    description: "See nearby reports and regional threat signals.",
    toneClass: "onb-feature-icon--community",
    icon: <CommunityIcon />,
  },
];

function LeafHeroIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <path d="M51 17C36 17 24 29 24 44" />
      <path d="M21 56c8-13 18-21 30-24" />
      <path d="M24 44c0 8 5 14 12 16" />
      <path d="M33 28c3 6 8 10 14 12" />
    </svg>
  );
}

function GrainHeroIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <path d="M36 13v46" />
      <path d="M36 22c-7 0-12 5-12 12 7 0 12-5 12-12Z" />
      <path d="M36 31c7 0 12 5 12 12-7 0-12-5-12-12Z" />
      <path d="M36 40c-7 0-12 5-12 12 7 0 12-5 12-12Z" />
      <path d="M36 49c7 0 12 5 12 12-7 0-12-5-12-12Z" />
    </svg>
  );
}

function PinHeroIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <path d="M36 61s16-14 16-28c0-9-7-16-16-16s-16 7-16 16c0 14 16 28 16 28Z" />
      <circle cx="36" cy="33" r="6" />
    </svg>
  );
}

function DiseaseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 20h14" />
      <path d="M10 4h4" />
      <path d="M12 4v5" />
      <path d="M8 9h8" />
      <path d="M14 9l5 5" />
      <path d="M8 20a4 4 0 0 0 8 0" />
    </svg>
  );
}

function ForecastIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M8 14h3" />
    </svg>
  );
}

function CommunityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="9" r="2.5" />
      <circle cx="16" cy="9" r="2.5" />
      <path d="M4 19a4 4 0 0 1 8 0" />
      <path d="M12 19a4 4 0 0 1 8 0" />
    </svg>
  );
}

function GpsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h4l10-10-4-4L4 16v4Z" />
      <path d="m12 6 4 4" />
    </svg>
  );
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [contentStep, setContentStep] = useState(1);
  const [heroStep, setHeroStep] = useState(1);
  const [contentPhase, setContentPhase] = useState<TransitionPhase>("entered");
  const [heroVisible, setHeroVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [selectedCrop, setSelectedCrop] = useState(cropOptions[0].name);
  const [locationMode, setLocationMode] = useState<LocationMode>("gps");
  const [farmName, setFarmName] = useState("Green Acre Farm");
  const [village, setVillage] = useState("Nandgaon");

  const timersRef = useRef<number[]>([]);

  const canProceed =
    step < 3 || (farmName.trim().length > 1 && village.trim().length > 1);

  function clearTimers() {
    timersRef.current.forEach((timerId) => {
      window.clearTimeout(timerId);
    });
    timersRef.current = [];
  }

  function queueTimer(callback: () => void, delayMs: number) {
    const timerId = window.setTimeout(callback, delayMs);
    timersRef.current.push(timerId);
  }

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

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

  const animateToStep = (targetStep: number) => {
    if (targetStep < 1 || targetStep > 3) return;
    if (targetStep === step) return;
    if (isTransitioning) return;

    clearTimers();
    setIsTransitioning(true);
    setContentPhase("exiting");
    setHeroVisible(false);

    queueTimer(() => {
      setStep(targetStep);
      setContentStep(targetStep);
      setContentPhase("entering");
    }, 180);

    queueTimer(() => {
      setHeroStep(targetStep);
      setHeroVisible(true);
    }, 200);

    queueTimer(() => {
      setContentPhase("entered");
      setIsTransitioning(false);
    }, 400);
  };

  const handleContinue = () => {
    if (!canProceed || isTransitioning) {
      return;
    }

    if (step < 3) {
      animateToStep(step + 1);
      return;
    }

    saveSetup();
  };

  const handleSecondaryAction = () => {
    if (isTransitioning) return;

    if (step > 1) {
      animateToStep(step - 1);
      return;
    }

    saveSetup();
  };

  const hero = heroVariants[heroStep];

  return (
    <div className="onb-root page" role="main" aria-label="Onboarding flow">
      <section className="onb-hero-zone">
        <div
          className={`onb-hero-content${heroVisible ? " is-visible" : " is-hidden"}`}
        >
          <span className="onb-hero-icon" aria-hidden="true">
            {hero.icon}
          </span>
          <p className={`onb-hero-title onb-hero-title--${hero.tone}`}>{hero.title}</p>
          <p className={`onb-hero-subtitle onb-hero-subtitle--${hero.tone}`}>
            {hero.subtitle}
          </p>
        </div>
      </section>

      <section className="onb-card-shell">
        <div className="onb-card-scroll">
          <div className="onb-progress" aria-label={`Step ${step} of 3`}>
            {[1, 2, 3].map((pillStep) => {
              const status =
                pillStep < step
                  ? "completed"
                  : pillStep === step
                    ? "active"
                    : "inactive";

              return (
                <span className={`onb-progress-pill is-${status}`} key={pillStep}>
                  <span
                    key={
                      status === "active"
                        ? `active-${step}-${pillStep}`
                        : `fill-${pillStep}-${status}`
                    }
                    className={`onb-progress-pill__fill${
                      status === "active"
                        ? " is-active"
                        : status === "completed"
                          ? " is-completed"
                          : ""
                    }`}
                  />
                </span>
              );
            })}
          </div>

          <div className={`onb-step-content onb-step-content--${contentPhase}`}>
            {contentStep === 1 && (
              <section className="onb-step-block" aria-label="Onboarding overview">
                <h1 className="onb-step1-title">Protect crops before damage spreads</h1>
                <p className="onb-step1-subtitle">
                  Three quick steps to personalize your dashboard.
                </p>

                <p className="onb-section-label">What CropGuard does</p>
                <div className="onb-feature-list" role="list">
                  {features.map((feature) => (
                    <article className="onb-feature-row" key={feature.title} role="listitem">
                      <span className={`onb-feature-icon ${feature.toneClass}`} aria-hidden="true">
                        {feature.icon}
                      </span>
                      <span className="onb-feature-copy">
                        <span className="onb-feature-title">{feature.title}</span>
                        <span className="onb-feature-description">
                          {feature.description}
                        </span>
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {contentStep === 2 && (
              <section className="onb-step-block" aria-label="Crop selection">
                <h2 className="onb-step-title">Select your primary crop</h2>
                <div className="onb-crop-grid">
                  {cropOptions.map((crop) => {
                    const isSelected = selectedCrop === crop.name;

                    return (
                      <button
                        key={crop.id}
                        type="button"
                        className={`onb-crop-card${isSelected ? " is-selected" : ""}`}
                        onClick={() => setSelectedCrop(crop.name)}
                        data-haptic="light"
                      >
                        {isSelected && <span className="onb-crop-check">✓</span>}
                        <span className={`onb-crop-badge${isSelected ? " is-selected" : ""}`}>
                          {crop.shortCode}
                        </span>
                        <span className={`onb-crop-name${isSelected ? " is-selected" : ""}`}>
                          {crop.name}
                        </span>
                        <span className="onb-crop-climate">{crop.climate}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {contentStep === 3 && (
              <section className="onb-step-block" aria-label="Farm location and identity">
                <h2 className="onb-step-title">Farm location and identity</h2>

                <div className="onb-segmented" role="radiogroup" aria-label="Location mode">
                  <button
                    type="button"
                    className={`onb-segment${locationMode === "gps" ? " is-active" : ""}`}
                    onClick={() => setLocationMode("gps")}
                    role="radio"
                    aria-checked={locationMode === "gps"}
                    data-haptic="light"
                  >
                    <GpsIcon />
                    <span>Use current GPS</span>
                  </button>
                  <button
                    type="button"
                    className={`onb-segment${locationMode === "manual" ? " is-active" : ""}`}
                    onClick={() => setLocationMode("manual")}
                    role="radio"
                    aria-checked={locationMode === "manual"}
                    data-haptic="light"
                  >
                    <PencilIcon />
                    <span>Enter manually</span>
                  </button>
                </div>

                <label className="onb-input-group">
                  <span className="onb-input-label">Farm name</span>
                  <input
                    value={farmName}
                    onChange={(event) => setFarmName(event.target.value)}
                    placeholder="Enter farm name"
                    className="onb-input"
                  />
                </label>

                <label className="onb-input-group">
                  <span className="onb-input-label">Village</span>
                  <input
                    value={village}
                    onChange={(event) => setVillage(event.target.value)}
                    placeholder="Enter village"
                    className="onb-input"
                  />
                </label>

                <p className="onb-helper-text">
                  GPS will be used when native device permissions are connected.
                </p>
              </section>
            )}
          </div>
        </div>

        <div className="onb-actions">
          <button
            type="button"
            className="onb-button onb-button--secondary"
            onClick={handleSecondaryAction}
            disabled={isTransitioning}
            data-haptic="light"
          >
            {step > 1 ? "Back" : "Skip Setup"}
          </button>

          <button
            type="button"
            className="onb-button onb-button--primary"
            onClick={handleContinue}
            disabled={!canProceed || isTransitioning}
            data-haptic="medium"
          >
            {step === 3 ? "Start Dashboard" : "Continue"}
          </button>
        </div>
      </section>
    </div>
  );
}
