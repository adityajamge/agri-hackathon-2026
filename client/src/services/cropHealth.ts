import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { apiRequest } from "./api";
import { getAuthToken } from "./session";
import type { CropAnalyzeResponse, CropHistoryResponse } from "./models";

type AnalyzePayload = {
  imageBase64: string;
  latitude?: number;
  longitude?: number;
  userId?: string;
};

function ensureDataUri(base64: string, mimeType = "image/jpeg") {
  if (/^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(base64)) {
    return base64;
  }

  return `data:${mimeType};base64,${base64}`;
}

function getRequiredToken(providedToken?: string) {
  const token = providedToken || getAuthToken();
  if (!token) {
    throw new Error("Authentication token is missing. Please sign in again.");
  }

  return token;
}

export async function capturePhotoWithCamera() {
  const photo = await Camera.getPhoto({
    quality: 90,
    source: CameraSource.Camera,
    resultType: CameraResultType.Base64,
    allowEditing: false,
  });

  if (!photo.base64String) {
    throw new Error("Failed to capture image from camera");
  }

  const format = (photo.format || "jpeg").toLowerCase();
  return ensureDataUri(photo.base64String, `image/${format}`);
}

export async function pickPhotoFromGallery() {
  const photo = await Camera.getPhoto({
    quality: 90,
    source: CameraSource.Photos,
    resultType: CameraResultType.Base64,
    allowEditing: false,
  });

  if (!photo.base64String) {
    throw new Error("Failed to read image from gallery");
  }

  const format = (photo.format || "jpeg").toLowerCase();
  return ensureDataUri(photo.base64String, `image/${format}`);
}

export async function analyzeCropHealth(payload: AnalyzePayload, token?: string) {
  return apiRequest<CropAnalyzeResponse>("/crop/analyze", {
    method: "POST",
    token: getRequiredToken(token),
    body: {
      ...payload,
      imageBase64: ensureDataUri(payload.imageBase64),
    },
  });
}

export async function fetchScanHistory(limit = 20, token?: string) {
  const query = new URLSearchParams({
    limit: String(limit),
  });

  return apiRequest<CropHistoryResponse>(`/crop/history?${query.toString()}`, {
    token: getRequiredToken(token),
  });
}
