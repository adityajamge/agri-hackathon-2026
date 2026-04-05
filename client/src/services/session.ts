import type { AuthUser } from "./models";

const TOKEN_KEY = "cropguard.authToken";
const USER_KEY = "cropguard.authUser";
const ONBOARDED_KEY = "cropguard.onboarded";

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage write errors for environments with restricted storage.
  }
}

function safeRemoveItem(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage remove errors.
  }
}

export function getAuthToken(): string | null {
  const token = safeGetItem(TOKEN_KEY);
  return token && token.trim().length > 0 ? token : null;
}

export function getSessionUser(): AuthUser | null {
  const raw = safeGetItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthUser;
    return parsed;
  } catch {
    return null;
  }
}

export function hasSession(): boolean {
  return Boolean(getAuthToken());
}

export function saveSession(token: string, user: AuthUser) {
  safeSetItem(TOKEN_KEY, token);
  safeSetItem(USER_KEY, JSON.stringify(user));
  safeSetItem(ONBOARDED_KEY, "true");

  safeSetItem(
    "cropguard.profile",
    JSON.stringify({
      farmName: user.farmName,
      village: user.village,
      district: user.district,
      primaryCrop: user.primaryCrop,
      language: "English",
    }),
  );
}

export function updateSessionUser(user: AuthUser) {
  safeSetItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  safeRemoveItem(TOKEN_KEY);
  safeRemoveItem(USER_KEY);
}
