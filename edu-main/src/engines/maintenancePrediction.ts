import { Asset } from "../data/centralData";

export interface MaintenancePrediction {
  healthScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  predictionWindow: string; // e.g. "12-18 days"
  explanation: string[];
}

export function calculateMaintenancePrediction(asset: Asset): MaintenancePrediction {
  let score = 100;
  let explanations: string[] = [];

  // Age based on operating hours (assume 5000 is end of life for this demo)
  if (asset.operatingHours > 4000) {
    score -= 30;
    explanations.push("High operating hours (>4000)");
  } else if (asset.operatingHours > 2000) {
    score -= 10;
    explanations.push("Moderate operating hours");
  }

  // Incidents impact
  if (asset.serviceIncidents > 3) {
    score -= 20;
    explanations.push(`Multiple past incidents (${asset.serviceIncidents})`);
  } else if (asset.serviceIncidents > 0) {
    score -= 5;
  }

  // Time since last service
  const lastServiceDate = new Date(asset.lastService);
  const daysSince = Math.floor((Date.now() - lastServiceDate.getTime()) / (1000 * 3600 * 24));
  
  if (daysSince > 365) {
    score -= 40;
    explanations.push(`Extended period since last service (>1 year)`);
  } else if (daysSince > 180) {
    score -= 15;
    explanations.push(`Over 6 months since last service`);
  }

  // Ensure score is within 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine risk level and window
  let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  let predictionWindow: string;

  if (score < 30) {
    riskLevel = "CRITICAL";
    predictionWindow = "1-3 days";
  } else if (score < 60) {
    riskLevel = "HIGH";
    predictionWindow = "3-7 days";
  } else if (score < 80) {
    riskLevel = "MEDIUM";
    predictionWindow = "12-18 days";
  } else {
    riskLevel = "LOW";
    predictionWindow = "30+ days";
  }

  if (explanations.length === 0) {
    explanations.push("Asset is operating normally.");
  }

  return {
    healthScore: score,
    riskLevel,
    predictionWindow,
    explanation: explanations,
  };
}
