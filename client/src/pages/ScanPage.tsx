import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CameraPreview, type CameraPreviewOptions } from "@capacitor-community/camera-preview";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import "./ScanPage.css";

export function ScanPage() {
  const navigate = useNavigate();
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    // Make DOM layers transparent to reveal camera behind Webview
    const bodyBg = document.body.style.backgroundColor;
    const htmlBg = document.documentElement.style.backgroundColor;
    const root = document.getElementById("root");
    const rootBg = root ? root.style.backgroundColor : "";

    document.documentElement.style.backgroundColor = "transparent";
    document.body.style.backgroundColor = "transparent";
    if (root) root.style.backgroundColor = "transparent";

    const startCamera = async () => {
      try {
        // Request camera permissions first
        let status = await Camera.checkPermissions();
        if (status.camera !== "granted") {
          status = await Camera.requestPermissions({ permissions: ["camera"] });
        }

        if (status.camera === "granted") {
          const cameraPreviewOptions: CameraPreviewOptions = {
            position: "rear",
            toBack: true,
            disableAudio: true,
            enableHighResolution: true,
            parent: "camera-preview-web",
            className: "camera-preview-web-video",
          };
          await CameraPreview.start(cameraPreviewOptions);
        } else {
          console.warn("Camera permission denied by user");
        }
      } catch (err) {
        console.warn("Camera start failed", err);
      }
    };
    
    startCamera();

    return () => {
      CameraPreview.stop().catch(() => {});
      document.documentElement.style.backgroundColor = htmlBg;
      document.body.style.backgroundColor = bodyBg;
      if (root) root.style.backgroundColor = rootBg;
    };
  }, []);

  const toggleFlash = async () => {
    const nextMode = !flashOn;
    setFlashOn(nextMode);
    try {
      await CameraPreview.setFlashMode({ flashMode: nextMode ? "torch" : "off" });
    } catch(err) {
      console.warn("Flash toggle failed", err);
    }
  };

  const capturePhoto = async () => {
    try {
      const result = await CameraPreview.capture({ quality: 90 });
      navigate("/scan/result", { state: { image: `data:image/jpeg;base64,${result.value}` } });
    } catch (err) {
      console.warn("Capture failed", err);
    }
  };

  const uploadGallery = async () => {
    try {
      let status = await Camera.checkPermissions();
      if (status.photos !== "granted") {
        status = await Camera.requestPermissions({ permissions: ["photos"] });
      }

      if (status.photos === "granted" || status.photos === "limited") {
        const photo = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Photos
        });
        navigate("/scan/result", { state: { image: `data:image/jpeg;base64,${photo.base64String}` } });
      } else {
        console.warn("Photos permission denied by user");
      }
    } catch (err) {
      console.warn("Gallery upload failed", err);
    }
  };

  return (
    <div className="leaf-scan-screen" role="main" aria-label="Leaf scanner">
      <div id="camera-preview-web" style={{ position: 'absolute', inset: 0, zIndex: -1 }} />
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
          onClick={toggleFlash}
          style={{ opacity: flashOn ? 1.0 : 0.6 }}
        >
          <svg viewBox="0 0 24 24">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={flashOn ? "currentColor" : "none"} strokeWidth={flashOn ? "0" : "2"} />
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

      <div className="leaf-scan-bottom">
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
            onClick={capturePhoto}
            aria-label="Take photo and scan"
            data-haptic="medium"
          >
            <div className="leaf-scan-shutter-inner" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="leaf-scan-upload"
            id="btn-gallery"
            onClick={uploadGallery}
            aria-label="Upload from gallery"
            data-haptic="light"
          >
            Upload from Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
