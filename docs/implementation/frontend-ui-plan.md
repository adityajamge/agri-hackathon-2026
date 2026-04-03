# CropGuard Frontend UI Plan

## Product Suggestions

1. Keep scanner and dashboard as the two fastest actions from every screen.
2. Show risk score in plain language, not only percentages.
3. Keep eco-first advisory prominent and chemical advisory as backup.
4. Use cached mock data contracts now so backend integration later is direct.
5. Keep all core screens usable in low-connectivity scenarios.

## Frontend Scope (UI Only)

- Completed with React + Vite + Capacitor-compatible routing.
- No backend or API calls yet.
- All data shown from local mock datasets.

## Implementation Plan

### Phase 1: Foundation
- Define route map and screen-level navigation.
- Create reusable type models for risk, forecast, alerts, and profile.
- Build shared app shell with top header and bottom navigation.

### Phase 2: Core Screens
- Onboarding (3-step farm setup)
- Dashboard (risk score, weather summary, quick actions)
- Scanner UI and Scan Result UI
- Forecast page with 7-day risk cards and hotspot map
- Community feed + report flow
- Profile + scan history + settings UI

### Phase 3: Backend Readiness
- Add clear .env templates for client and server.
- Keep all cards/forms aligned to future API contracts.
- Ensure route paths match intended backend endpoints and push notifications flow.

## Proposed Directory Structure

```text
client/
  src/
    components/
      AppLayout.tsx
      BottomNav.tsx
    data/
      mockData.ts
    pages/
      CommunityPage.tsx
      DashboardPage.tsx
      ForecastPage.tsx
      OnboardingPage.tsx
      ProfilePage.tsx
      ReportPage.tsx
      ScanPage.tsx
      ScanResultPage.tsx
    types/
      app.ts
    App.tsx
    index.css
    main.tsx
server/
  .env.example
  index.js
```

## Backend Phase (Next)

- Express route modules for auth, scan, forecast, community reports.
- Weather integration via Open-Meteo.
- Detection integration via Plant.id or local model endpoint.
- MongoDB persistence for reports, scans, and user profiles.
- Push notifications and 10km proximity alert logic.
