import { Haptics, ImpactStyle } from "@capacitor/haptics";

export async function triggerHaptic(style: ImpactStyle = ImpactStyle.Light) {
  try {
    await Haptics.impact({ style });
  } catch {
    // Ignore failures on platforms where haptics are unavailable.
  }
}

export function triggerLightHaptic() {
  return triggerHaptic(ImpactStyle.Light);
}

export function triggerMediumHaptic() {
  return triggerHaptic(ImpactStyle.Medium);
}
