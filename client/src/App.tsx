import { ImpactStyle } from "@capacitor/haptics";
import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { CommunityPage } from "./pages/CommunityPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ForecastPage } from "./pages/ForecastPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ReportPage } from "./pages/ReportPage";
import { ScanPage } from "./pages/ScanPage";
import { ScanResultPage } from "./pages/ScanResultPage";
import { hasSession } from "./services/session";
import { triggerHaptic } from "./utils/haptics";

function hasActiveSession() {
  return hasSession();
}

function EntryRedirect() {
  return (
    <Navigate
      to={hasActiveSession() ? "/dashboard" : "/onboarding"}
      replace
    />
  );
}

function OnboardingRoute() {
  if (hasActiveSession()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <OnboardingPage />;
}

function ProtectedLayoutRoute() {
  if (!hasActiveSession()) {
    return <Navigate to="/onboarding" replace />;
  }

  return <AppLayout />;
}

function App() {
  useEffect(() => {
    const rowTapTimers = new WeakMap<HTMLElement, number>();

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const rowTarget = target.closest<HTMLElement>("[data-row-tap]");
      if (rowTarget) {
        rowTarget.classList.add("is-tapped");
        const existingTimer = rowTapTimers.get(rowTarget);
        if (existingTimer) {
          window.clearTimeout(existingTimer);
        }
        const timer = window.setTimeout(() => {
          rowTarget.classList.remove("is-tapped");
          rowTapTimers.delete(rowTarget);
        }, 150);
        rowTapTimers.set(rowTarget, timer);
      }

      const interactive = target.closest<HTMLElement>(
        "button, a, [data-haptic], [data-row-tap]",
      );
      if (!interactive) return;
      if (interactive instanceof HTMLButtonElement && interactive.disabled) return;

      const styledTarget = target.closest<HTMLElement>("[data-haptic]");
      const style =
        styledTarget?.dataset.haptic === "medium" || interactive.dataset.haptic === "medium"
          ? ImpactStyle.Medium
          : ImpactStyle.Light;

      void triggerHaptic(style);
    };

    document.addEventListener("click", handleClick, { passive: true });

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<EntryRedirect />} />
        <Route path="/onboarding" element={<OnboardingRoute />} />

        <Route element={<ProtectedLayoutRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/scan/result" element={<ScanResultPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/report" element={<ReportPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App
