import { useMemo } from "react";
import { defaultProfile, scanHistory } from "../data/mockData";
import type { UserProfile } from "../types/app";

function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem("cropguard.profile");
    if (!raw) return defaultProfile;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    return {
      farmName: parsed.farmName ?? defaultProfile.farmName,
      village: parsed.village ?? defaultProfile.village,
      district: parsed.district ?? defaultProfile.district,
      primaryCrop: parsed.primaryCrop ?? defaultProfile.primaryCrop,
      language: parsed.language ?? defaultProfile.language,
    };
  } catch {
    return defaultProfile;
  }
}

const SettingsIcon = {
  language: (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  wifi: (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
    </svg>
  ),
  crop: (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 19.98" />
      <path d="M3 6C8 6 12 9 12 14" />
      <path d="M12 14c0-5 4-8 9-8" />
    </svg>
  ),
};

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export function ProfilePage() {
  const profile = useMemo(() => getStoredProfile(), []);

  return (
    <div className="page page-enter stack-lg">
      {/* PROFILE HEADER */}
      <section className="profile-header" aria-label="Farm profile">
        <div className="profile-avatar" aria-hidden="true">
          {profile.farmName.charAt(0)}
        </div>
        <div className="profile-header__info">
          <p className="profile-header__name">{profile.farmName}</p>
          <p className="profile-header__sub">
            {profile.village}, {profile.district}
          </p>
          <div>
            <span className="profile-header__crop">
              🌱 {profile.primaryCrop}
            </span>
          </div>
        </div>
      </section>

      {/* SCAN HISTORY */}
      <section aria-label="Detection history">
        <p className="settings-group-label">Detection History</p>
        <div className="history-list" role="list">
          {scanHistory.map((entry) => (
            <article key={entry.id} className="history-item" role="listitem">
              <div className="history-item__left">
                <p className="history-item__title">{entry.issue}</p>
                <p className="history-item__meta">
                  {entry.crop} · {entry.date}
                </p>
              </div>
              <div className="history-item__right">
                <span className="history-item__confidence">
                  {entry.confidence}%
                </span>
                <span className="history-item__outcome">{entry.outcome}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PREFERENCES — iOS Settings style */}
      <section aria-label="Preferences">
        <p className="settings-group-label">Preferences</p>
        <div className="settings-group">
          <div className="settings-row">
            <div
              className="settings-row__icon"
              style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}
              aria-hidden="true"
            >
              {SettingsIcon.language}
            </div>
            <div className="settings-row__body">
              <p className="settings-row__title">Language</p>
            </div>
            <div className="settings-row__value">
              {profile.language}
              <ChevronRight />
            </div>
          </div>

          <div className="settings-row">
            <div
              className="settings-row__icon"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
              aria-hidden="true"
            >
              {SettingsIcon.bell}
            </div>
            <div className="settings-row__body">
              <p className="settings-row__title">Risk Notifications</p>
              <p className="settings-row__sub">Outbreak alerts &amp; warnings</p>
            </div>
            <div className="settings-row__value">
              Enabled
              <ChevronRight />
            </div>
          </div>

          <div className="settings-row">
            <div
              className="settings-row__icon"
              style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}
              aria-hidden="true"
            >
              {SettingsIcon.wifi}
            </div>
            <div className="settings-row__body">
              <p className="settings-row__title">Offline Sync</p>
              <p className="settings-row__sub">Model and data caching</p>
            </div>
            <div className="settings-row__value">
              WiFi + Mobile
              <ChevronRight />
            </div>
          </div>

          <div className="settings-row">
            <div
              className="settings-row__icon"
              style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}
              aria-hidden="true"
            >
              {SettingsIcon.crop}
            </div>
            <div className="settings-row__body">
              <p className="settings-row__title">Primary Crop</p>
            </div>
            <div className="settings-row__value">
              {profile.primaryCrop}
              <ChevronRight />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section aria-label="About">
        <p className="settings-group-label">About</p>
        <div className="settings-group">
          <div className="settings-row">
            <div className="settings-row__body">
              <p className="settings-row__title">CropGuard Version</p>
            </div>
            <div className="settings-row__value" style={{ color: "var(--text-tertiary)" }}>
              1.0.0
            </div>
          </div>
          <div className="settings-row">
            <div className="settings-row__body">
              <p className="settings-row__title">AI Model</p>
            </div>
            <div className="settings-row__value" style={{ color: "var(--text-tertiary)" }}>
              PlantNet v2
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
