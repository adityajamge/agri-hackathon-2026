import { useNavigate } from "react-router-dom";

export function ScanPage() {
  const navigate = useNavigate();

  return (
    <div className="page page-enter stack-lg">
      <section className="scanner-shell">
        <div className="scan-frame" aria-hidden="true">
          <div className="scan-frame__guide" />
          <p className="scan-frame__label">Align the infected leaf inside frame</p>
        </div>

        <div className="scanner-actions">
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => navigate("/scan/result")}
          >
            Tap to Scan Leaf
          </button>
          <button type="button" className="btn btn--ghost btn--block">
            Upload from Gallery
          </button>
        </div>
      </section>

      <section className="card stack-sm">
        <h3>Before scanning</h3>
        <ul className="tips-list">
          <li>Keep the leaf flat and in focus.</li>
          <li>Capture in daylight for best confidence.</li>
          <li>Scan both old and new lesions when possible.</li>
        </ul>
      </section>
    </div>
  );
}
