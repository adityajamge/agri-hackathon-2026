import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import type { CommunityReport } from "../services/models";
import { fetchCommunityReports } from "../services/community";
import { getSessionUser } from "../services/session";

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

function severityColor(severity: CommunityReport["severity"]) {
  if (severity === "high") return "#D93025";
  if (severity === "medium") return "#F29900";
  return "#1A7F45";
}

function formatTimeAgo(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const deltaMs = Date.now() - parsed.getTime();
  const deltaMinutes = Math.max(1, Math.floor(deltaMs / 60000));

  if (deltaMinutes < 60) {
    return `${deltaMinutes}m ago`;
  }

  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `${deltaHours}h ago`;
  }

  const deltaDays = Math.floor(deltaHours / 24);
  return `${deltaDays}d ago`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function CommunityLiveMap({
  center,
  reports,
}: {
  center: { latitude: number; longitude: number };
  reports: CommunityReport[];
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || mapRef.current) {
      return;
    }

    const map = L.map(container, {
      zoomControl: true,
    }).setView([center.latitude, center.longitude], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    markersLayerRef.current = markersLayer;

    return () => {
      markersLayer.clearLayers();
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, [center.latitude, center.longitude]);

  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) {
      return;
    }

    mapRef.current.setView([center.latitude, center.longitude], mapRef.current.getZoom(), {
      animate: false,
    });

    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    const homeMarker = L.circleMarker([center.latitude, center.longitude], {
      radius: 8,
      color: "#1A7F45",
      fillColor: "#1A7F45",
      fillOpacity: 0.85,
      weight: 2,
    }).bindPopup("Your farm location");

    markersLayer.addLayer(homeMarker);

    reports.forEach((report) => {
      const popupHtml = [
        `<strong>${escapeHtml(report.issue)}</strong>`,
        `${escapeHtml(report.crop)} · ${report.severity.toUpperCase()}`,
        `${escapeHtml(report.reporter)}`,
      ].join("<br/>");

      const marker = L.circleMarker([report.latitude, report.longitude], {
        radius: 7,
        color: severityColor(report.severity),
        fillColor: severityColor(report.severity),
        fillOpacity: 0.78,
        weight: 2,
      }).bindPopup(popupHtml);

      markersLayer.addLayer(marker);
    });
  }, [center.latitude, center.longitude, reports]);

  return <div ref={mapContainerRef} className="community-live-map" />;
}

export function CommunityPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const user = getSessionUser();
  const latitude = user?.latitude ?? 18.52;
  const longitude = user?.longitude ?? 73.85;

  useEffect(() => {
    let isMounted = true;

    const loadReports = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetchCommunityReports({
          limit: 50,
          latitude,
          longitude,
        });

        if (!isMounted) {
          return;
        }

        setReports(response.reports || []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Failed to load community feed";
        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadReports();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  return (
    <div className="page stack-lg">
      <section aria-label="Threat map">
        <div className="community-map-container">
          <CommunityLiveMap center={{ latitude, longitude }} reports={reports} />

          <div className="map-live-pill" aria-hidden="true">
            <span className="map-live-pill__icon">
              <PinIcon />
            </span>
            Live Threat Map
          </div>

          <div className="map-legend" aria-hidden="true">
            {[
              { color: "#D93025", label: "High" },
              { color: "#F29900", label: "Med" },
              { color: "#1A7F45", label: "Low" },
            ].map((legend) => (
              <span key={legend.label} className="map-legend__item">
                <span className="map-legend__dot" style={{ background: legend.color }} />
                {legend.label}
              </span>
            ))}
          </div>

          <button
            type="button"
            id="btn-report-outbreak"
            className="community-fab"
            onClick={() => navigate("/community/report")}
            aria-label="Report an outbreak"
          >
            <PlusIcon />
          </button>
        </div>
      </section>

      <section aria-label="Recent farmer reports">
        <p className="section-label">FARMER REPORTS · LIVE</p>

        {isLoading && <p className="card-body-text">Loading community reports...</p>}
        {!isLoading && errorMessage && <p className="card-body-text">{errorMessage}</p>}

        <div className="native-list-card report-feed" role="list">
          {reports.map((report) => (
            <article
              key={report.id}
              className="report-item tap-row"
              role="listitem"
              data-row-tap
              data-haptic={report.severity === "high" ? "medium" : "light"}
            >
              <div className="report-item__header">
                <span className="report-item__name">{report.reporter}</span>
                <span
                  className={`risk-pill risk-pill--${report.severity}`}
                  data-haptic={report.severity === "high" ? "medium" : "light"}
                >
                  {report.severity.toUpperCase()}
                </span>
              </div>
              <p className="report-item__meta">
                {report.crop} · {report.issue}
                {report.distanceKm !== null ? ` · ${report.distanceKm} km` : ""} · {formatTimeAgo(report.createdAt)}
              </p>
              <p className="report-item__note">{report.note || "No additional notes"}</p>
            </article>
          ))}

          {!isLoading && reports.length === 0 && !errorMessage && (
            <article className="report-item" role="listitem">
              <p className="report-item__note">No live reports yet. Be the first to publish one.</p>
            </article>
          )}
        </div>
      </section>
    </div>
  );
}
