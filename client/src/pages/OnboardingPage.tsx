import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { cropOptions } from "../data/mockData";
import { ApiRequestError } from "../services/api";
import { registerUser } from "../services/auth";
import { saveSession } from "../services/session";
import "./OnboardingPage.css";

type LocationMode = "gps" | "manual";
type TransitionPhase = "entered" | "exiting" | "entering";
type Coordinates = { latitude: number; longitude: number };

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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [farmName, setFarmName] = useState("Green Acre Farm");
  const [village, setVillage] = useState("Nandgaon");
  const [district, setDistrict] = useState("Nashik");
  const [manualLatitude, setManualLatitude] = useState("");
  const [manualLongitude, setManualLongitude] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const timersRef = useRef<number[]>([]);

  const hasIdentityFields =
    fullName.trim().length > 1 &&
    email.trim().length > 4 &&
    password.length >= 6 &&
    district.trim().length > 1;
  const hasFarmFields = farmName.trim().length > 1 && village.trim().length > 1;
  const hasManualCoordinates =
    locationMode === "gps" || (manualLatitude.trim().length > 0 && manualLongitude.trim().length > 0);

  const canProceed =
    step < 3 || (hasIdentityFields && hasFarmFields && hasManualCoordinates);

  function parseCoordinate(value: string): number | undefined {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  function hasGrantedLocationPermission(permission: {
    location?: string;
    coarseLocation?: string;
  }) {
    return permission.location === "granted" || permission.coarseLocation === "granted";
  }

  async function getCurrentCoordinates(): Promise<Coordinates | undefined> {
    if (Capacitor.isNativePlatform()) {
      const checkedPermissions = await Geolocation.checkPermissions();
      let granted = hasGrantedLocationPermission(checkedPermissions);

      if (!granted) {
        const requestedPermissions = await Geolocation.requestPermissions();
        granted = hasGrantedLocationPermission(requestedPermissions);
      }

      if (!granted) {
        throw new Error(
          "Location permission was denied. Enable GPS permission or switch to manual location mode.",
        );
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 120000,
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    }

    if (!navigator.geolocation) {
      return Promise.resolve(undefined);
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(error.message || "Unable to read device location"));
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 120000,
        },
      );
    });
  }

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

  const saveSetup = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      let latitude: number | undefined;
      let longitude: number | undefined;

      if (locationMode === "gps") {
        const gpsCoordinates = await getCurrentCoordinates();
        latitude = gpsCoordinates?.latitude;
        longitude = gpsCoordinates?.longitude;
      } else {
        latitude = parseCoordinate(manualLatitude);
        longitude = parseCoordinate(manualLongitude);

        if (latitude === undefined || longitude === undefined) {
          throw new Error("Enter valid latitude and longitude values for manual location mode.");
        }
      }

      const response = await registerUser({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        farmName: farmName.trim(),
        village: village.trim(),
        district: district.trim(),
        primaryCrop: selectedCrop,
        ...(latitude !== undefined ? { latitude } : {}),
        ...(longitude !== undefined ? { longitude } : {}),
      });

      saveSession(response.token, response.user);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.status === 409) {
          setSubmitError("An account with this email already exists. Use a different email to continue.");
        } else {
          setSubmitError(error.message);
        }
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Could not create account right now. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
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

  const handleContinue = async () => {
    if (!canProceed || isTransitioning || isSubmitting) {
      return;
    }

    if (step < 3) {
      animateToStep(step + 1);
      return;
    }

    await saveSetup();
  };

  const handleSecondaryAction = () => {
    if (isTransitioning || isSubmitting) return;

    if (step > 1) {
      animateToStep(step - 1);
    }
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
                  <span className="onb-input-label">Full name</span>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter your name"
                    className="onb-input"
                    autoComplete="name"
                  />
                </label>

                <label className="onb-input-group">
                  <span className="onb-input-label">Email</span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    className="onb-input"
                    autoComplete="email"
                    inputMode="email"
                  />
                </label>

                <label className="onb-input-group">
                  <span className="onb-input-label">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                    className="onb-input"
                    autoComplete="new-password"
                  />
                </label>

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

                <label className="onb-input-group">
                  <span className="onb-input-label">District</span>
                  <input
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                    placeholder="Enter district"
                    className="onb-input"
                  />
                </label>

                {locationMode === "manual" && (
                  <>
                    <label className="onb-input-group">
                      <span className="onb-input-label">Latitude</span>
                      <input
                        value={manualLatitude}
                        onChange={(event) => setManualLatitude(event.target.value)}
                        placeholder="e.g. 18.5204"
                        className="onb-input"
                        inputMode="decimal"
                      />
                    </label>

                    <label className="onb-input-group">
                      <span className="onb-input-label">Longitude</span>
                      <input
                        value={manualLongitude}
                        onChange={(event) => setManualLongitude(event.target.value)}
                        placeholder="e.g. 73.8567"
                        className="onb-input"
                        inputMode="decimal"
                      />
                    </label>
                  </>
                )}

                <p className="onb-helper-text">
                  GPS improves weather and disease accuracy. Manual coordinates work offline too.
                </p>

                {submitError && (
                  <p className="onb-helper-text" style={{ color: "#b42318", marginTop: 8 }}>
                    {submitError}
                  </p>
                )}
              </section>
            )}
          </div>
        </div>

        <div className="onb-actions">
          <button
            type="button"
            className="onb-button onb-button--secondary"
            onClick={handleSecondaryAction}
            disabled={isTransitioning || isSubmitting || step === 1}
            data-haptic="light"
          >
            Back
          </button>

          <button
            type="button"
            className="onb-button onb-button--primary"
            onClick={handleContinue}
            disabled={!canProceed || isTransitioning || isSubmitting}
            data-haptic="medium"
          >
            {step === 3 ? (isSubmitting ? "Creating Account..." : "Create Account") : "Continue"}
          </button>
        </div>
      </section>
    </div>
  );
}
