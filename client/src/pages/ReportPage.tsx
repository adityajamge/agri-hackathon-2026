import { type FormEvent, useMemo, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { cropOptions, issueOptions } from "../data/mockData";
import { createCommunityReport } from "../services/community";
import { getSessionUser } from "../services/session";
import type { RiskLevel } from "../types/app";

type Coordinates = { latitude: number; longitude: number };

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
      throw new Error("Location permission denied");
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
    return undefined;
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(new Error(error.message || "Unable to read location")),
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 120000,
      },
    );
  });
}

export function ReportPage() {
  const sessionUser = getSessionUser();
  const initialCoordinates = useMemo(
    () =>
      typeof sessionUser?.latitude === "number" && typeof sessionUser?.longitude === "number"
        ? { latitude: sessionUser.latitude, longitude: sessionUser.longitude }
        : null,
    [sessionUser?.latitude, sessionUser?.longitude],
  );

  const [crop, setCrop] = useState(cropOptions[0].name);
  const [issue, setIssue] = useState(issueOptions[0]);
  const [severity, setSeverity] = useState<RiskLevel>("medium");
  const [notes, setNotes] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(initialCoordinates);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>(
    initialCoordinates
      ? `Using saved farm location (${initialCoordinates.latitude.toFixed(4)}, ${initialCoordinates.longitude.toFixed(4)})`
      : "No location found yet. Fetch GPS before publishing.",
  );

  const refreshGps = async () => {
    setLocationStatus("Fetching GPS location...");
    try {
      const current = await getCurrentCoordinates();
      if (!current) {
        setLocationStatus("Location unavailable on this device.");
        return;
      }

      setCoordinates(current);
      setLocationStatus(
        `GPS ready (${current.latitude.toFixed(4)}, ${current.longitude.toFixed(4)})`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not fetch GPS";
      setLocationStatus(message);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitted(false);
    setIsSubmitting(true);

    try {
      let reportCoordinates = coordinates;

      if (!reportCoordinates) {
        const fetched = await getCurrentCoordinates();
        if (fetched) {
          reportCoordinates = fetched;
          setCoordinates(fetched);
        }
      }

      await createCommunityReport({
        crop,
        issue,
        severity,
        note: notes.trim(),
        ...(reportCoordinates ? { latitude: reportCoordinates.latitude } : {}),
        ...(reportCoordinates ? { longitude: reportCoordinates.longitude } : {}),
      });

      setSubmitted(true);
      setNotes("");
      setLocationStatus(
        reportCoordinates
          ? `Published using (${reportCoordinates.latitude.toFixed(4)}, ${reportCoordinates.longitude.toFixed(4)})`
          : "Published with server-side location fallback",
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to publish report";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page stack-lg">
      <section className="card stack-md">
        <div className="card-heading">
          <h3>Report local outbreak</h3>
          <p>Share field signal with nearby farmers</p>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          <label className="field-group">
            <span>Crop</span>
            <select value={crop} onChange={(event) => setCrop(event.target.value)}>
              {cropOptions.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field-group">
            <span>Issue detected</span>
            <select value={issue} onChange={(event) => setIssue(event.target.value)}>
              {issueOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="severity-group">
            <legend>Severity</legend>
            <div className="segmented-control">
              {(["low", "medium", "high"] as RiskLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSeverity(level)}
                  className={`segment${severity === level ? " is-selected" : ""}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="field-group">
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Describe symptoms, spread speed, and any treatment tried"
              rows={4}
            />
          </label>

          <div className="field-group" style={{ gap: 8 }}>
            <span>Report location</span>
            <p className="card-body-text">{locationStatus}</p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={refreshGps}
              disabled={isSubmitting}
            >
              Refresh GPS
            </button>
          </div>

          {submitError && <p className="card-body-text" style={{ color: "#b42318" }}>{submitError}</p>}

          <button type="submit" className="btn btn--primary btn--block" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish Community Alert"}
          </button>
        </form>

        {submitted && (
          <p className="toast-success">
            Alert submitted. Nearby farmers can now see this in the live community feed.
          </p>
        )}
      </section>
    </div>
  );
}
