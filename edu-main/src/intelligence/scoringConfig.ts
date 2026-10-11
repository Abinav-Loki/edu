/**
 * Central Configuration for ARIVON AI — ByteXL Hackathon Intelligence Engine
 * Defines configurable scoring weights, institutional risk thresholds,
 * documented normalization functions, and student segmentation definitions.
 */

export interface ScoringWeights {
  academic: number;         // Proposed Hackathon initial: 40%
  attendance: number;       // Proposed Hackathon initial: 25%
  lmsActivity: number;      // Proposed Hackathon initial: 15% (Assignment & LMS)
  skillsPlacement: number;  // Proposed Hackathon initial: 10% (Skills & Placement Readiness)
  engagement: number;       // Proposed Hackathon initial: 5% (Campus events, clubs, certs)
  feedback: number;         // Proposed Hackathon initial: 5% (Student satisfaction & faculty feedback)
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  academic: 40,
  attendance: 25,
  lmsActivity: 15,
  skillsPlacement: 10,
  engagement: 5,
  feedback: 5,
};

export interface RiskThresholds {
  attendanceWarningPercent: number;      // Default 75%
  attendanceCriticalPercent: number;     // Default 60%
  academicPassingQuiz: number;           // Default 60%
  academicCriticalThreshold: number;     // Default 50%
  lmsCompletionWarning: number;          // Default 65%
  placementReadinessThreshold: number;   // Default 60%
  lmsMaxDaysInactive: number;            // Default 7 days
  maxLateSubmissions: number;            // Default 3
  insufficientCoverageThreshold: number; // Default 33% (less than 2 categories)
}

export const DEFAULT_RISK_THRESHOLDS: RiskThresholds = {
  attendanceWarningPercent: 75,
  attendanceCriticalPercent: 60,
  academicPassingQuiz: 60,
  academicCriticalThreshold: 50,
  lmsCompletionWarning: 65,
  placementReadinessThreshold: 60,
  lmsMaxDaysInactive: 7,
  maxLateSubmissions: 3,
  insufficientCoverageThreshold: 33,
};

export const SCORING_DISCLAIMER =
  "Transparent, deterministic academic decision-support heuristic based on verified institutional metrics. Not an automated causal prediction.";

/**
 * Normalization helper functions ensuring all raw metrics are converted
 * onto a documented 0–100 scale without silently converting missing data to zero.
 */
export function normalizeCGPA(cgpa: number | null | undefined, maxScale: 4 | 10 = 10): number | null {
  if (cgpa === null || cgpa === undefined || isNaN(cgpa)) return null;
  const clamped = Math.max(0, Math.min(maxScale, cgpa));
  return Math.round((clamped / maxScale) * 100);
}

export function normalizePercentage(val: number | null | undefined): number | null {
  if (val === null || val === undefined || isNaN(val)) return null;
  return Math.max(0, Math.min(100, Math.round(val)));
}

export function normalizeRating(rating: number | null | undefined, maxRating = 5): number | null {
  if (rating === null || rating === undefined || isNaN(rating)) return null;
  const clamped = Math.max(0, Math.min(maxRating, rating));
  return Math.round((clamped / maxRating) * 100);
}

/**
 * Validates configured weights.
 */
export function validateWeights(weights: ScoringWeights): { isValid: boolean; error?: string } {
  const values = Object.values(weights);
  for (const v of values) {
    if (typeof v !== "number" || isNaN(v) || v < 0) {
      return { isValid: false, error: "Weights must be non-negative numerical values." };
    }
  }
  const total = values.reduce((sum, v) => sum + v, 0);
  if (total <= 0) {
    return { isValid: false, error: "Total weight sum must be strictly positive." };
  }
  return { isValid: true };
}

/**
 * Get active scoring weights (persisted in localStorage for demo/admin configurability).
 */
export function getStoredScoringWeights(): ScoringWeights {
  try {
    const saved = localStorage.getItem("arivon_scoring_weights");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (validateWeights(parsed).isValid) return parsed;
    }
  } catch (e) {
    console.warn("Could not read scoring weights from localStorage:", e);
  }
  return { ...DEFAULT_SCORING_WEIGHTS };
}

export function saveStoredScoringWeights(weights: ScoringWeights): boolean {
  const validation = validateWeights(weights);
  if (!validation.isValid) return false;
  try {
    localStorage.setItem("arivon_scoring_weights", JSON.stringify(weights));
    return true;
  } catch {
    return false;
  }
}

/**
 * Get active risk thresholds (persisted in localStorage for demo/admin configurability).
 */
export function getStoredRiskThresholds(): RiskThresholds {
  try {
    const saved = localStorage.getItem("arivon_risk_thresholds");
    if (saved) {
      return { ...DEFAULT_RISK_THRESHOLDS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn("Could not read risk thresholds from localStorage:", e);
  }
  return { ...DEFAULT_RISK_THRESHOLDS };
}

export function saveStoredRiskThresholds(thresholds: RiskThresholds): boolean {
  try {
    localStorage.setItem("arivon_risk_thresholds", JSON.stringify(thresholds));
    return true;
  } catch {
    return false;
  }
}

/**
 * Official Hackathon Student Segments
 */
export type SegmentType =
  | "High Performers"
  | "Consistent Learners"
  | "Improving Students"
  | "Students Needing Academic Support"
  | "Placement-Ready Students"
  | "Placement Preparation Needed"
  | "Insufficient Data";

export interface SegmentInfo {
  type: SegmentType;
  title: string;
  description: string;
  badgeColor: string;
  recommendedFocus: string;
}

export const SEGMENT_DEFINITIONS: Record<SegmentType, SegmentInfo> = {
  "High Performers": {
    type: "High Performers",
    title: "High Performers",
    description: "Exceptional academic standing (Success Score >= 85, Quiz >= 80%, Attendance >= 80%).",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400",
    recommendedFocus: "Advanced research projects, hackathon representation, and peer mentoring leadership.",
  },
  "Consistent Learners": {
    type: "Consistent Learners",
    title: "Consistent Learners",
    description: "High reliability with steady attendance (>= 80%) and regular LMS/assignment completion (>= 80%).",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400",
    recommendedFocus: "Skill-broadening electives, industry certifications, and honors course enrollment.",
  },
  "Improving Students": {
    type: "Improving Students",
    title: "Improving Students",
    description: "Demonstrated positive trajectory across recent weekly assessments and learning milestones.",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400",
    recommendedFocus: "Positive reinforcement, momentum maintenance, and targeted feedback on remaining gaps.",
  },
  "Students Needing Academic Support": {
    type: "Students Needing Academic Support",
    title: "Students Needing Academic Support",
    description: "Facing academic hurdles (Quiz < 60% or Attendance < 75%) or flagged with High/Critical risk.",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400",
    recommendedFocus: "Immediate 1-on-1 faculty tutoring, recovery plan enrollment, and attendance counseling.",
  },
  "Placement-Ready Students": {
    type: "Placement-Ready Students",
    title: "Placement-Ready Students",
    description: "Senior students with verified coding, aptitude, and interview benchmarks (Placement Readiness >= 75%).",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400",
    recommendedFocus: "Campus recruitment drives, company shortlist applications, and mock HR interviews.",
  },
  "Placement Preparation Needed": {
    type: "Placement Preparation Needed",
    title: "Placement Preparation Needed",
    description: "Approaching placement eligibility but lagging coding benchmarks, aptitude tests, or resume verification.",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400",
    recommendedFocus: "Resume workshops, weekly coding bootcamps, and diagnostic aptitude test modules.",
  },
  "Insufficient Data": {
    type: "Insufficient Data",
    title: "Insufficient Data",
    description: "Profile has less than 33% verified data coverage; insufficient records to compute confident classification.",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
    recommendedFocus: "Collect baseline onboarding diagnostic, attendance logs, and preliminary assessment records.",
  },
};
