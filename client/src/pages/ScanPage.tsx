import { useNavigate } from "react-router-dom";

export function ScanPage() {
  const navigate = useNavigate();

  return (
    <div className="scan-fullscreen page-enter" role="main" aria-label="Leaf scanner">
      {/* Top Bar */}
      <div className="scan-top-bar">
        <button
          type="button"
          className="scan-close-btn"
          onClick={() => navigate("/dashboard")}
          aria-label="Close scanner"
        >
          <svg viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <h2>Leaf Scanner</h2>

        {/* Flash toggle placeholder */}
        <button
          type="button"
          className="scan-close-btn"
          aria-label="Toggle flash"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </button>
      </div>

      {/* Viewfinder */}
      <div className="scan-viewfinder-area">
        <div className="scan-bg-blur" aria-hidden="true" />

        <div className="scan-viewfinder" aria-label="Align infected leaf inside this frame">
          {/* Corner brackets */}
          <div className="scan-corner scan-corner--tl" aria-hidden="true" />
          <div className="scan-corner scan-corner--tr" aria-hidden="true" />
          <div className="scan-corner scan-corner--bl" aria-hidden="true" />
          <div className="scan-corner scan-corner--br" aria-hidden="true" />

          {/* Animated scan line */}
          <div className="scan-line" aria-hidden="true" />

          <p className="scan-viewfinder__label">
            Align the infected leaf inside the frame
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="scan-tips" role="note" aria-label="Scanning tips">
        <p className="scan-tip">Keep the leaf flat and in focus</p>
        <p className="scan-tip">Capture in daylight for best accuracy</p>
        <p className="scan-tip">Scan both old and new lesions</p>
      </div>

      {/* Shutter + Gallery */}
      <div className="scan-actions">
        {/* Native camera shutter button */}
        <button
          type="button"
          className="shutter-btn"
          id="btn-shutter"
          onClick={() => navigate("/scan/result")}
          aria-label="Take photo and scan"
        >
          <div className="shutter-btn-inner" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="scan-gallery-btn"
          id="btn-gallery"
          aria-label="Upload from gallery"
        >
          Upload from Gallery
        </button>
      </div>
    </div>
  );
}
