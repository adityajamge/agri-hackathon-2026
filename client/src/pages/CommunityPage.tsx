import { useNavigate } from "react-router-dom";
import { communityReports, regionalHotspots } from "../data/mockData";

export function CommunityPage() {
  const navigate = useNavigate();

  return (
    <div className="page page-enter stack-lg">
      <section className="community-map card stack-sm">
        <div className="card-heading">
          <h3>Threat map</h3>
          <p>Live crowd reports in your area</p>
        </div>

        <div className="map-canvas map-canvas--compact" role="img" aria-label="Community outbreak map">
          {regionalHotspots.map((spot) => (
            <button
              key={spot.id}
              type="button"
              className={`map-marker map-marker--${spot.severity}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              <span>{spot.reports}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={() => navigate("/community/report")}
        >
          Report an Outbreak
        </button>
      </section>

      <section className="card stack-md">
        <div className="card-heading">
          <h3>Recent farmer reports</h3>
          <p>Last 48 hours</p>
        </div>

        <div className="report-feed">
          {communityReports.map((report) => (
            <article key={report.id} className="report-item">
              <header>
                <p>{report.reporter}</p>
                <span className={`risk-pill risk-pill--${report.severity}`}>
                  {report.severity}
                </span>
              </header>
              <p className="report-item__meta">
                {report.crop} - {report.issue} - {report.distanceKm} km - {report.time}
              </p>
              <p>{report.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
