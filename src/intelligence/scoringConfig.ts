/**
 * Central Configuration for Smart Campus Analytics Hackathon
 * Defines configurable scoring weights, risk thresholds, segmentation rules,
 * and transparent scoring heuristics.
 */

export interface ScoringWeights {
  academic: number;           // Default 30%
  attendance: number;         // Default 20%
  lmsActivity: number;        // Default 15%
  placementReadiness: number; // Default 15%
  skillsAssessments: number;  // Default 10%
  engagementFeedback: number; // Default 10%
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  academic: 30,
  attendance: 20,
  lmsActivity: 15,
  placementReadiness: 15,
  skillsAssessments: 10,
  engagementFeedback: 10,
};

export interface RiskThresholds {
  attendanceWarningPercent: number;    // e.g. 75%
  attendanceCriticalPercent: number;   // e.g. 60%
  academicPassingQuiz: number;         // e.g. 60%
  academicPassingExam: number;         // e.g. 50%
  placementReadinessThreshold: number; // e.g. 60%
  lmsMaxDaysInactive: number;          // e.g. 7 days
  maxLateSubmissions: number;          // e.g. 3
  insufficientCoverageThreshold: number; // e.g. 33% (less than 2 categories)
}

export const DEFAULT_RISK_THRESHOLDS: RiskThresholds = {
  attendanceWarningPercent: 75,
  attendanceCriticalPercent: 60,
  academicPassingQuiz: 60,
  academicPassingExam: 50,
  placementReadinessThreshold: 60,
  lmsMaxDaysInactive: 7,
  maxLateSubmissions: 3,
  insufficientCoverageThreshold: 33,
};

export const SCORING_DISCLAIMER =
  "Initial transparent scoring heuristic for academic decision support. Not a guaranteed or scientifically validated predictive model.";

/**
 * Validates configured weights.
 * Rules:
 * 1. Non-negative values for all categories.
 * 2. Total weight sum must be greater than 0.
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
 * Student Segments as defined by hackathon specifications
 */
export type SegmentType =
  | "Strong Academics / Strong Placement Readiness"
  | "Strong Academics / Placement Support Needed"
  | "Academic Support Needed / Good Engagement"
  | "Attendance Concern / Declining Academics"
  | "Strong Skills / Placement Preparation Incomplete"
  | "Insufficient Data for Segmentation";

export interface SegmentInfo {
  type: SegmentType;
  description: string;
  badgeColor: string;
  recommendedFocus: string;
}

export const SEGMENT_DEFINITIONS: Record<SegmentType, SegmentInfo> = {
  "Strong Academics / Strong Placement Readiness": {
    type: "Strong Academics / Strong Placement Readiness",
    description: "High academic performance (CGPA >= 3.5 or Quiz >= 80%) and strong placement readiness (>= 75%).",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400",
    recommendedFocus: "Advanced hackathons, research publications, and campus leadership roles.",
  },
  "Strong Academics / Placement Support Needed": {
    type: "Strong Academics / Placement Support Needed",
    description: "Consistent academic grades (Quiz >= 75%) but lagging placement preparation (< 60%).",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400",
    recommendedFocus: "Aptitude training, resume clinics, and mock interview practice.",
  },
  "Academic Support Needed / Good Engagement": {
    type: "Academic Support Needed / Good Engagement",
    description: "Active LMS and campus engagement (> 70%) but facing academic challenges (Quiz < 60%).",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400",
    recommendedFocus: "Targeted faculty tutoring, peer study groups, and foundational remedial modules.",
  },
  "Attendance Concern / Declining Academics": {
    type: "Attendance Concern / Declining Academics",
    description: "Attendance below 75% threshold paired with declining quiz/assessment scores.",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400",
    recommendedFocus: "Attendance counseling, mentor intervention, and structured catch-up sessions.",
  },
  "Strong Skills / Placement Preparation Incomplete": {
    type: "Strong Skills / Placement Preparation Incomplete",
    description: "High technical skill proficiency (> 75%) but missing placement milestones like resume and interviews.",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400",
    recommendedFocus: "Resume finalization, mock interviews, and communication workshops.",
  },
  "Insufficient Data for Segmentation": {
    type: "Insufficient Data for Segmentation",
    description: "Student profile has less than 33% data coverage; unable to establish confident categorization.",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
    recommendedFocus: "Collect baseline academic, attendance, and onboarding diagnostic records.",
  },
};
