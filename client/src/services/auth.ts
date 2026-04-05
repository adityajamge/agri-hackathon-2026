import { apiRequest } from "./api";
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from "./models";

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function fetchCurrentUser(token: string): Promise<AuthUser> {
  const response = await apiRequest<{ user: AuthUser }>("/auth/me", {
    token,
  });

  return response.user;
}
