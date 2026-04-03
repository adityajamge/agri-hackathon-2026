import { useNavigate } from "react-router-dom";
import "./ScanPage.css";

export function ScanPage() {
  const navigate = useNavigate();

  return (
    <div className="leaf-scan-screen" role="main" aria-label="Leaf scanner">
      <header className="leaf-scan-topbar">
        <button
          type="button"
          className="leaf-scan-top-button"
          onClick={() => navigate("/dashboard")}
          aria-label="Close scanner"
          data-haptic="light"
        >
          <svg viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h1 className="leaf-scan-title">Leaf Scanner</h1>

        <button
          type="button"
          className="leaf-scan-top-button"
          aria-label="Toggle flash"
          data-haptic="light"
        >
          <svg viewBox="0 0 24 24">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </button>
      </header>

      <section className="leaf-scan-stage" aria-label="Camera viewfinder">
        <div className="leaf-scan-overlay-top" aria-hidden="true" />

        <div className="leaf-scan-frame-row" aria-hidden="true">
          <div className="leaf-scan-overlay-side" />

          <div className="leaf-scan-frame-window">
            <div className="leaf-scan-corner leaf-scan-corner--tl" />
            <div className="leaf-scan-corner leaf-scan-corner--tr" />
            <div className="leaf-scan-corner leaf-scan-corner--bl" />
            <div className="leaf-scan-corner leaf-scan-corner--br" />

            <div className="leaf-scan-line" />
          </div>

          <div className="leaf-scan-overlay-side" />
        </div>
      </section>

      <p className="leaf-scan-instruction">Align the infected leaf inside the frame</p>

      <div className="leaf-scan-tips" role="note" aria-label="Scanning tips">
        <p className="leaf-scan-tip">Keep the leaf flat and in focus</p>
        <p className="leaf-scan-tip">Capture in daylight for best accuracy</p>
        <p className="leaf-scan-tip">Scan both old and new lesions</p>
      </div>

      <div className="leaf-scan-actions">
        <button
          type="button"
          className="leaf-scan-shutter"
          id="btn-shutter"
          onClick={() => navigate("/scan/result")}
          aria-label="Take photo and scan"
          data-haptic="medium"
        >
          <div className="leaf-scan-shutter-inner" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="leaf-scan-upload"
          id="btn-gallery"
          aria-label="Upload from gallery"
          data-haptic="light"
        >
          Upload from Gallery
        </button>
      </div>
    </div>
  );
}
