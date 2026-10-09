import {
  StudentIntelligence,
  StudentProfile,
  AcademicPerformance,
  EngagementMetrics,
  BehaviorMetrics,
  SupportInteractions,
  LearningActivity,
  StudentJourneyEvent,
  RiskFactor,
  StudentRisk,
  Intervention,
  InterventionOutcome,
  InterventionRecord,
  StudentTrends,
  RiskLevel,
  InterventionCategory
} from "./types";
import { initialStudentIntelligenceMap } from "./mockData";

// In-memory persistent state store for demo session
const studentStore: Record<string, StudentIntelligence> = JSON.parse(
  JSON.stringify(initialStudentIntelligenceMap)
);

/**
 * Get full Student Intelligence aggregated object for a given student ID.
 * Supports replaceability by real backend API without UI overhaul.
 */
export function getStudentIntelligence(studentId: string): StudentIntelligence {
  const data = studentStore[studentId] || studentStore["s1"];
  
  // Re-calculate dynamic scores & risk factors on demand
  const successScore = calculateStudentSuccessScore(data.studentId);
  const riskCalculation = calculateAcademicRisk(data.studentId);
  const activeRiskFactors = getRiskFactors(data.studentId);

  // Sync state
  data.successScore = successScore;
  data.riskLevel = riskCalculation.riskLevel;
  data.studentRisk = {
    ...data.studentRisk,
    riskScore: riskCalculation.riskScore,
    academicRisk: riskCalculation.academicRisk,
    attendanceRisk: riskCalculation.attendanceRisk,
    engagementRisk: riskCalculation.engagementRisk,
    behaviorRisk: riskCalculation.behaviorRisk,
    overallRiskLevel: riskCalculation.riskLevel,
    contributingFactors: activeRiskFactors,
  };
  data.riskFactors = activeRiskFactors;

  return data;
}

/**
 * Alias for getStudentIntelligence(studentId)
 */
export function getStudentAnalytics(studentId: string): StudentIntelligence {
  return getStudentIntelligence(studentId);
}

/**
 * Get list of all available students in intelligence platform
 */
export function getStudentList(): StudentProfile[] {
  return Object.values(studentStore).map((data) => data.profile);
}

/**
 * Get all complete Student Intelligence objects (for multi-student overview)
 */
export function getAllStudentIntelligences(): StudentIntelligence[] {
  return Object.keys(studentStore).map((id) => getStudentIntelligence(id));
}

/**
 * Service 1: getAcademicMetrics(studentId)
 */
export function getAcademicMetrics(studentId: string): AcademicPerformance {
  const intel = studentStore[studentId] || studentStore["s1"];
  return intel.academicMetrics;
}

/**
 * Service 2: getEngagementMetrics(studentId)
 */
export function getEngagementMetrics(studentId: string): EngagementMetrics {
  const intel = studentStore[studentId] || studentStore["s1"];
  return intel.engagementMetrics;
}

/**
 * Service 3: getStudentJourney(studentId)
 */
export function getStudentJourney(studentId: string): StudentJourneyEvent[] {
  const intel = studentStore[studentId] || studentStore["s1"];
  // Return sorted by timestamp descending
  return [...intel.journey].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Service 4: calculateStudentSuccessScore(studentId)
 * Weighted Formula:
 * - Academic (Quiz + Assignment + Exams): 40%
 * - Attendance: 30%
 * - Engagement: 15%
 * - Behavior (Punctuality + Adherence): 15%
 */
export function calculateStudentSuccessScore(studentId: string): number {
  const intel = studentStore[studentId] || studentStore["s1"];
  const acad = intel.academicMetrics;
  const eng = intel.engagementMetrics;
  const beh = intel.behaviorMetrics;

  const academicComponent = (acad.quizAverage * 0.4 + acad.assignmentAverage * 0.4 + acad.examsAverage * 0.2);
  const attendanceComponent = acad.attendancePercent;
  const engagementComponent = eng.engagementScore;
  const behaviorComponent = (beh.submissionPunctualityRate * 0.5 + beh.recoveryPlanAdherence * 0.5);

  const rawScore =
    academicComponent * 0.4 +
    attendanceComponent * 0.3 +
    engagementComponent * 0.15 +
    behaviorComponent * 0.15;

  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

/**
 * Service 5: calculateAcademicRisk(studentId)
 * Computes sub-risk scores & overall risk tier
 */
export function calculateAcademicRisk(studentId: string): {
  riskScore: number;
  riskLevel: RiskLevel;
  academicRisk: number;
  attendanceRisk: number;
  engagementRisk: number;
  behaviorRisk: number;
} {
  const intel = studentStore[studentId] || studentStore["s1"];
  const acad = intel.academicMetrics;
  const eng = intel.engagementMetrics;
  const beh = intel.behaviorMetrics;

  // 1. Academic Risk (0-100): Inverse of quiz & assignment scores + penalty for late/missed
  let academicRisk = Math.max(0, 100 - (acad.quizAverage * 0.6 + acad.assignmentAverage * 0.4));
  if (acad.missedQuizzes > 0) academicRisk += acad.missedQuizzes * 8;
  academicRisk = Math.min(100, Math.round(academicRisk));

  // 2. Attendance Risk (0-100): High risk below 75%, extreme below 60%
  let attendanceRisk = 0;
  if (acad.attendancePercent < 55) {
    attendanceRisk = 90;
  } else if (acad.attendancePercent < 65) {
    attendanceRisk = 75;
  } else if (acad.attendancePercent < 75) {
    attendanceRisk = 50;
  } else if (acad.attendancePercent < 85) {
    attendanceRisk = 25;
  } else {
    attendanceRisk = 10;
  }

  // 3. Engagement Risk (0-100)
  const engagementRisk = Math.max(0, Math.min(100, Math.round(100 - eng.engagementScore)));

  // 4. Behavior Risk (0-100)
  const behaviorRisk = Math.max(0, Math.min(100, Math.round(100 - beh.behaviorScore)));

  // Weighted overall risk score (100 = highest risk)
  const overallRiskScore = Math.round(
    academicRisk * 0.4 + attendanceRisk * 0.35 + engagementRisk * 0.15 + behaviorRisk * 0.1
  );

  let riskLevel: RiskLevel = "LOW";
  if (overallRiskScore >= 75) {
    riskLevel = "CRITICAL";
  } else if (overallRiskScore >= 55) {
    riskLevel = "HIGH";
  } else if (overallRiskScore >= 35) {
    riskLevel = "MEDIUM";
  } else {
    riskLevel = "LOW";
  }

  return {
    riskScore: overallRiskScore,
    riskLevel,
    academicRisk,
    attendanceRisk,
    engagementRisk,
    behaviorRisk,
  };
}

/**
 * Service 6: getRiskFactors(studentId)
 */
export function getRiskFactors(studentId: string): RiskFactor[] {
  const intel = studentStore[studentId] || studentStore["s1"];
  const factors: RiskFactor[] = [...intel.riskFactors];
  const acad = intel.academicMetrics;
  const eng = intel.engagementMetrics;

  // Dynamic check if attendance < 75% and not already listed
  if (acad.attendancePercent < 75 && !factors.some((f) => f.category === "attendance" && f.status === "active")) {
    factors.push({
      factorId: `rf_dyn_att_${Date.now()}`,
      category: "attendance",
      title: `Low Attendance Warning (${acad.attendancePercent}%)`,
      description: `Student attendance is below mandatory 75% requirement.`,
      impact: acad.attendancePercent < 60 ? "high" : "medium",
      weight: 25,
      status: "active",
    });
  }

  // Dynamic check if quiz average < 60%
  if (acad.quizAverage < 60 && !factors.some((f) => f.category === "academic" && f.status === "active")) {
    factors.push({
      factorId: `rf_dyn_acad_${Date.now()}`,
      category: "academic",
      title: `Quiz Average Deficit (${acad.quizAverage}%)`,
      description: `Current quiz average is below 60% passing threshold.`,
      impact: "high",
      weight: 25,
      status: "active",
    });
  }

  return factors;
}

/**
 * Service 7: getStudentTrends(studentId)
 */
export function getStudentTrends(studentId: string): StudentTrends {
  const intel = studentStore[studentId] || studentStore["s1"];
  return intel.trends;
}

/**
 * Service 8: getRecommendedInterventions(studentId)
 */
export function getRecommendedInterventions(studentId: string): Intervention[] {
  const intel = studentStore[studentId] || studentStore["s1"];
  return intel.recommendedInterventions.filter((i) => i.status !== "rejected" && i.status !== "completed");
}

/**
 * Service 9: recordIntervention(studentId, intervention)
 * Dynamically logs a new intervention for a student
 */
export function recordIntervention(
  studentId: string,
  interventionData: Omit<Intervention, "id" | "createdAt" | "status"> & {
    id?: string;
    createdAt?: string;
    status?: Intervention["status"];
  }
): Intervention {
  const intel = studentStore[studentId] || studentStore["s1"];

  const newIntervention: Intervention = {
    id: interventionData.id || `int_${Date.now()}`,
    studentId,
    title: interventionData.title,
    description: interventionData.description,
    category: interventionData.category,
    suggestedBy: interventionData.suggestedBy || "AI_ENGINE",
    priority: interventionData.priority || "medium",
    status: interventionData.status || "assigned",
    createdAt: interventionData.createdAt || new Date().toISOString(),
    targetCompletionDate: interventionData.targetCompletionDate,
    assignedTo: interventionData.assignedTo,
  };

  // Add to active recommendations
  intel.recommendedInterventions.unshift(newIntervention);

  // Add entry to journey
  const journeyEvent: StudentJourneyEvent = {
    id: `je_int_${Date.now()}`,
    studentId,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split("T")[0],
    category: "intervention",
    title: `Intervention Initiated: ${newIntervention.title}`,
    description: newIntervention.description,
    severity: newIntervention.priority === "high" ? "critical" : "warning",
    metadata: { interventionId: newIntervention.id, category: newIntervention.category },
  };

  intel.journey.unshift(journeyEvent);

  return newIntervention;
}

/**
 * Service 10: recordInterventionOutcome(interventionId, outcome)
 * Records the results/evaluations of an intervention and updates student trajectory
 */
export function recordInterventionOutcome(
  interventionId: string,
  outcomeData: Omit<InterventionOutcome, "id" | "recordedAt"> & {
    id?: string;
    recordedAt?: string;
  }
): InterventionOutcome {
  let targetStudentId = outcomeData.studentId;
  let targetIntervention: Intervention | undefined;

  // Search across student store if studentId not provided
  if (!targetStudentId) {
    for (const [sId, intel] of Object.entries(studentStore)) {
      const found = intel.recommendedInterventions.find((i) => i.id === interventionId);
      if (found) {
        targetStudentId = sId;
        targetIntervention = found;
        break;
      }
    }
  }

  const intel = studentStore[targetStudentId] || studentStore["s1"];
  if (!targetIntervention) {
    targetIntervention = intel.recommendedInterventions.find((i) => i.id === interventionId) || {
      id: interventionId,
      studentId: targetStudentId,
      title: "Intervention Session",
      description: "Support intervention",
      category: "academic_tutoring",
      suggestedBy: "FACULTY",
      priority: "medium",
      status: "completed",
      createdAt: new Date().toISOString(),
    };
  }

  // Update intervention status to completed
  targetIntervention.status = "completed";

  const outcomeRecord: InterventionOutcome = {
    id: outcomeData.id || `out_${Date.now()}`,
    interventionId,
    studentId: targetStudentId,
    recordedAt: outcomeData.recordedAt || new Date().toISOString(),
    outcomeStatus: outcomeData.outcomeStatus,
    impactMetrics: outcomeData.impactMetrics || {},
    notes: outcomeData.notes,
    evaluatedBy: outcomeData.evaluatedBy || "Faculty Advisor",
  };

  // Save to intervention history
  intel.interventionHistory.unshift({
    intervention: targetIntervention,
    outcome: outcomeRecord,
  });

  // Apply metric impact if present
  if (outcomeRecord.impactMetrics) {
    const { scoreImprovement, attendanceChange, riskScoreDelta } = outcomeRecord.impactMetrics;
    if (scoreImprovement) {
      intel.academicMetrics.quizAverage = Math.min(100, intel.academicMetrics.quizAverage + scoreImprovement);
    }
    if (attendanceChange) {
      intel.academicMetrics.attendancePercent = Math.min(100, intel.academicMetrics.attendancePercent + attendanceChange);
    }
    if (riskScoreDelta) {
      intel.studentRisk.riskScore = Math.max(0, intel.studentRisk.riskScore + riskScoreDelta);
    }
  }

  // Add event to student journey
  const journeyEvent: StudentJourneyEvent = {
    id: `je_out_${Date.now()}`,
    studentId: targetStudentId,
    timestamp: outcomeRecord.recordedAt,
    date: outcomeRecord.recordedAt.split("T")[0],
    category: "intervention",
    title: `Intervention Outcome Recorded (${outcomeRecord.outcomeStatus.replace("_", " ")})`,
    description: outcomeRecord.notes,
    severity: outcomeRecord.outcomeStatus === "successful" ? "positive" : "info",
    metadata: { outcomeId: outcomeRecord.id, impact: outcomeRecord.impactMetrics },
  };

  intel.journey.unshift(journeyEvent);

  return outcomeRecord;
}
