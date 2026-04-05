function isBetween(value, min, max) {
  return Number.isFinite(value) && value >= min && value <= max;
}

function computeRiskLevel({ temperature, humidity, rainfallExpected }) {
  if (humidity > 80 && isBetween(temperature, 25, 35) && rainfallExpected) {
    return "HIGH";
  }

  if (humidity > 60 || isBetween(temperature, 20, 35)) {
    return "MEDIUM";
  }

  return "LOW";
}

function formatRainOffset(rainDayOffset) {
  if (rainDayOffset === 0) {
    return "today";
  }

  if (rainDayOffset === 1) {
    return "in 1 day";
  }

  if (typeof rainDayOffset === "number" && rainDayOffset > 1) {
    return `in ${rainDayOffset} days`;
  }

  return "soon";
}

function buildRiskReason({ riskLevel, humidity, rainDayOffset }) {
  if (riskLevel === "HIGH") {
    return `High humidity + rain expected ${formatRainOffset(rainDayOffset)}`;
  }

  if (riskLevel === "MEDIUM") {
    if (humidity > 60) {
      return "Humidity is elevated and disease pressure is building";
    }
    return "Temperature is in the pest-active range";
  }

  return "Current humidity and rainfall conditions indicate low outbreak pressure";
}

module.exports = {
  computeRiskLevel,
  buildRiskReason,
};
