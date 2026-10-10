import { Student as BaseStudent, MentorRequest, SupportTicket, Material } from "../data/centralData";
import { LearningProfile, Skill, Quest, Mission } from "../data/learningData";
import { WeakTopic } from "../data/mock";

// Re-export base types for modularity
export type { BaseStudent, MentorRequest, SupportTicket, Material, LearningProfile, Skill, Quest, Mission, WeakTopic };

// Overall Risk Levels
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// Student Journey Categories
export type JourneyCategory = "academic" | "attendance" | "engagement" | "behavior" | "support" | "risk" | "intervention";

// Student Journey Event Severity
export type EventSeverity = "info" | "positive" | "warning" | "critical";

// Archetype Student Journey Types
export type StudentJourneyType = "stable" | "improving" | "declining" | "high_risk" | "irregular";

// Extended Student Interface (reusing BaseStudent)
export interface StudentProfile extends BaseStudent {
  email: string;
  enrolledSubjects: string[];
  gpa: number;
  guardianContact?: string;
  assignedMentorId?: string;
  assignedMentorName?: string;
  journeyType: StudentJourneyType;
}

// 1. Academic Performance Data Model
export interface SubjectScore {
  subject: string;
  quizAvg: number;
  assignmentAvg: number;
  attendancePercent: number;
  score: number; // combined score 0-100
  total: number;
  status: "good" | "warning" | "critical";
}

export interface AcademicPerformance {
  quizAverage: number;
  assignmentAverage: number;
  attendancePercent: number;
  gpa: number;
  subjectScores: SubjectScore[];
  weakTopics: WeakTopic[];
  totalAssignments: number;
  completedAssignments: number;
  lateSubmissions: number;
  missedQuizzes: number;
  examsAverage: number;
  academicRiskScore: number; // 0-100 (100 = critical academic risk)
}

// 2. Engagement Metrics Data Model
export interface EngagementMetrics {
  activeDaysLast30Days: number;
  currentStreak: number;
  longestStreak: number;
  aiTutorInteractionsCount: number;
  totalXP: number;
  arenaCoins: number;
  learningLevel: number;
  questsCompleted: number;
  materialsAccessedCount: number;
  totalTimeSpentMinutes: number;
  weeklyActiveHours: number;
  engagementScore: number; // 0-100
  engagementTrend: "improving" | "stable" | "declining";
}

// 3. Behavior Metrics Data Model
export interface BehaviorMetrics {
  submissionPunctualityRate: number; // percentage on-time
  quizAttemptRate: number; // percentage of assigned quizzes attempted
  recoveryPlanAdherence: number; // percentage of recovery plan completed
  helpSeekingFrequency: "low" | "moderate" | "high";
  studyConsistencyScore: number; // 0-100
  loginFrequencyPerWeek: number;
  feedbackSubmittedCount: number;
  behaviorScore: number; // 0-100
}

// 4. Support Interactions Data Model
export interface SupportInteractions {
  mentorRequests: MentorRequest[];
  supportTickets: SupportTicket[];
  facultySessionsCount: number;
  lastMentorSessionDate?: string;
  unresolvedIssuesCount: number;
  mentorFeedbackCount: number;
}

// 5. Learning Activity Data Model
export interface ActivityItem {
  id: string;
  type: "quiz" | "study" | "assignment" | "tutor" | "arena" | "mentor" | "recovery";
  title: string;
  detail: string;
  timestamp: string;
  durationMinutes?: number;
  subject?: string;
  score?: number;
}

export interface RecoveryPlanStatus {
  title: string;
  focus: string;
  days: number;
  tasksCompleted: number;
  totalTasks: number;
  progressPercent: number;
  status: "not_started" | "in_progress" | "completed" | "overdue";
  currentDay: number;
}

export interface LearningActivity {
  recentActivities: ActivityItem[];
  recoveryPlan: RecoveryPlanStatus;
  adaptiveQuizCount: number;
  arenaBattlesCompleted: number;
  skillsMasteredCount: number;
}

// 6. Student Journey Event Model
export interface StudentJourneyEvent {
  id: string;
  studentId: string;
  timestamp: string;
  date: string;
  category: JourneyCategory;
  title: string;
  description: string;
  severity: EventSeverity;
  metadata?: Record<string, any>;
}

// 7. Risk Factors Data Model
export interface RiskFactor {
  factorId: string;
  category: "academic" | "attendance" | "engagement" | "behavior";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  weight: number; // weight contribution (1-30)
  status: "active" | "mitigated" | "resolved";
}

// 8. Student Risk Data Model
export interface StudentRisk {
  overallRiskLevel: RiskLevel;
  riskScore: number; // 0-100 (100 = maximum risk)
  academicRisk: number; // 0-100
  attendanceRisk: number; // 0-100
  engagementRisk: number; // 0-100
  behaviorRisk: number; // 0-100
  contributingFactors: RiskFactor[];
  riskTrend: "improving" | "stable" | "worsening";
  primaryRiskDriver: string;
}

// 9. Intervention Data Model
export type InterventionCategory =
  | "academic_tutoring"
  | "mentor_session"
  | "counseling"
  | "recovery_plan"
  | "peer_study"
  | "attendance_warning"
  | "adaptive_quiz";

export interface Intervention {
  id: string;
  studentId: string;
  title: string;
  description: string;
  category: InterventionCategory;
  suggestedBy: "AI_ENGINE" | "FACULTY" | "MENTOR" | "SYSTEM";
  priority: "high" | "medium" | "low";
  status: "recommended" | "assigned" | "in_progress" | "completed" | "rejected";
  createdAt: string;
  targetCompletionDate?: string;
  assignedTo?: string;
}

// 10. Intervention Outcome Data Model
export interface InterventionOutcome {
  id: string;
  interventionId: string;
  studentId: string;
  recordedAt: string;
  outcomeStatus: "successful" | "partially_successful" | "unsuccessful" | "pending_eval";
  impactMetrics: {
    scoreImprovement?: number;
    attendanceChange?: number;
    engagementDelta?: number;
    riskScoreDelta?: number;
  };
  notes: string;
  evaluatedBy: string;
}

// Intervention paired with optional outcome record
export interface InterventionRecord {
  intervention: Intervention;
  outcome?: InterventionOutcome;
}

// Historical Trends Data Model (Weekly Data)
export interface WeeklyTrendData {
  week: string; // e.g., "Week 1", "Week 2", ... "Week 8"
  date: string;
  quizAverage: number;
  assignmentAverage: number;
  attendancePercent: number;
  engagementScore: number;
  successScore: number;
  riskScore: number;
}

export interface StudentTrends {
  weekly: WeeklyTrendData[];
  quizTrendDelta: number; // change over recent weeks
  assignmentTrendDelta: number;
  attendanceTrendDelta: number;
  engagementTrendDelta: number;
  overallDirection: "improving" | "stable" | "declining";
}

// Aggregated Central Student Intelligence Structure
export interface StudentIntelligence {
  studentId: string;
  profile: StudentProfile;
  successScore: number; // 0-100 overall success index
  riskLevel: RiskLevel;
  academicMetrics: AcademicPerformance;
  engagementMetrics: EngagementMetrics;
  behaviorMetrics: BehaviorMetrics;
  supportInteractions: SupportInteractions;
  learningActivity: LearningActivity;
  trends: StudentTrends;
  riskFactors: RiskFactor[];
  studentRisk: StudentRisk;
  journey: StudentJourneyEvent[];
  recommendedInterventions: Intervention[];
  interventionHistory: InterventionRecord[];
  
  // Hackathon Extended Analytics Models
  placementReadiness?: PlacementReadiness;
  lmsActivity?: LMSActivityMetrics;
  skillsAndFeedback?: SkillsAndFeedback;
  campusEngagement?: CampusEngagement;
  successScoreResult?: StudentSuccessScoreResult;
  explainableRisks?: ExplainableRiskFlag[];
  segmentation?: StudentSegmentationResult;
}

// -------------------------------------------------------------
// HACKATHON SMART CAMPUS ANALYTICS TYPES
// -------------------------------------------------------------

export interface PlacementReadiness {
  aptitudeScore: number | null; // 0-100
  codingScore: number | null;   // 0-100
  mockInterviewScore: number | null; // 0-100
  resumeStatus: "not_started" | "in_progress" | "verified";
  placementAssessmentsCompleted: number;
  preparationProgressPercent: number; // 0-100
  overallPlacementScore: number; // 0-100
  status: "ready" | "needs_preparation" | "incomplete";
}

export interface LMSActivityMetrics {
  totalLogins: number;
  assignmentsSubmitted: number;
  assignmentCompletionRate: number; // 0-100%
  activeDaysLast30: number;
  averageSessionDurationMins: number;
  lastLoginDate: string;
  lmsScore: number; // 0-100
}

export interface SkillsAndFeedback {
  technicalSkills: { name: string; score: number }[];
  assessmentsPassedCount: number;
  facultyFeedbackCount: number;
  recentFacultyNotes?: string;
  skillsScore: number; // 0-100
}

export interface CampusEngagement {
  eventsAttendedCount: number;
  clubParticipationsCount: number;
  hackathonsCount: number;
  certificationsCount: number;
  engagementScore: number; // 0-100
}

export interface ExplainableRiskFlag {
  id: string;
  category: "Academic" | "Attendance" | "Placement Readiness" | "Engagement";
  severity: "Low" | "Medium" | "High";
  title: string;
  reason: string;
  supportingData: string;
  relevantDates: string;
  recommendedAction: string;
  isRuleBasedWarning: boolean;
}

export interface CategoryScoreDetail {
  category: string;
  label: string;
  score: number | null;
  normalizedScore: number;
  configuredWeight: number;
  reNormalizedWeight: number;
  hasValidData: boolean;
  supportingMetric: string;
}

export interface StudentSuccessScoreResult {
  overallScore: number | null;
  hasSufficientData: boolean;
  dataCoveragePercent: number;
  applicableWeightsTotal: number;
  validCategoriesCount: number;
  totalCategoriesCount: number;
  statusLabel: string;
  categoryScores: Record<string, CategoryScoreDetail>;
  explanation: {
    positiveDrivers: string[];
    attentionAreas: string[];
  };
  lastUpdated: string;
}

export interface StudentInterventionItem {
  id: string;
  studentId: string;
  studentName: string;
  category:
    | "Academic Mentoring"
    | "Attendance Counselling"
    | "Assignment Completion Support"
    | "Aptitude Practice"
    | "Coding Practice"
    | "Mock Interview Prep";
  recommendation: string;
  notes: string;
  assignedFaculty: string;
  dueDate: string;
  status: "Open" | "In Progress" | "Completed" | "Dismissed";
  outcomeNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface StudentSegmentationResult {
  primarySegment: string;
  qualifyingSegments: string[];
  reasoning: string;
  badgeColor: string;
}

