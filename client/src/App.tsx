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

function hasCompletedOnboarding() {
  try {
    return localStorage.getItem("cropguard.onboarded") === "true";
  } catch {
    return false;
  }
}

function EntryRedirect() {
  return (
    <Navigate
      to={hasCompletedOnboarding() ? "/dashboard" : "/onboarding"}
      replace
    />
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<EntryRedirect />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route element={<AppLayout />}>
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
