import { useMemo } from "react";
import { defaultProfile, scanHistory } from "../data/mockData";
import type { UserProfile } from "../types/app";

function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem("cropguard.profile");
    if (!raw) {
      return defaultProfile;
    }

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

export function ProfilePage() {
  const profile = useMemo(() => getStoredProfile(), []);

  return (
    <div className="page page-enter stack-lg">
      <section className="profile-hero">
        <div>
          <p className="eyebrow">Farm Profile</p>
          <h2>{profile.farmName}</h2>
          <p>
            {profile.village}, {profile.district}
          </p>
        </div>
        <span className="soft-tag">Primary Crop: {profile.primaryCrop}</span>
      </section>

      <section className="profile-grid">
        <article className="card stack-sm">
          <h3>Detection history</h3>
          <div className="history-list">
            {scanHistory.map((entry) => (
              <article key={entry.id} className="history-item">
                <div>
                  <p className="history-item__title">{entry.issue}</p>
                  <p className="history-item__meta">
                    {entry.crop} - {entry.date}
                  </p>
                </div>
                <div className="history-item__right">
                  <strong>{entry.confidence}%</strong>
                  <span>{entry.outcome}</span>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="card stack-sm">
          <h3>Preferences</h3>
          <div className="setting-list">
            <div className="setting-row">
              <div>
                <p>Language</p>
                <span>{profile.language}</span>
              </div>
              <button type="button" className="btn btn--ghost btn--small">
                Change
              </button>
            </div>
            <div className="setting-row">
              <div>
                <p>Risk Notifications</p>
                <span>Enabled</span>
              </div>
              <button type="button" className="btn btn--ghost btn--small">
                Configure
              </button>
            </div>
            <div className="setting-row">
              <div>
                <p>Offline Sync</p>
                <span>WiFi + Mobile Data</span>
              </div>
              <button type="button" className="btn btn--ghost btn--small">
                Update
              </button>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
