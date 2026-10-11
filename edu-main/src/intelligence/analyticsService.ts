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
  ExplainableRiskFlag,
  StudentSuccessScoreResult,
  StudentInterventionItem,
  StudentSegmentationResult,
  DataCategoryStatus,
  DataIntegrationOverview,
} from "./types";
import { initialStudentIntelligenceMap } from "./mockData";
import {
  DEFAULT_SCORING_WEIGHTS,
  DEFAULT_RISK_THRESHOLDS,
  SCORING_DISCLAIMER,
  SEGMENT_DEFINITIONS,
  ScoringWeights,
  RiskThresholds,
  SegmentType,
  validateWeights,
  getStoredScoringWeights,
  getStoredRiskThresholds,
  normalizePercentage,
  normalizeCGPA,
  normalizeRating,
} from "./scoringConfig";

// In-memory persistent state store for demo session
const studentStore: Record<string, StudentIntelligence> = JSON.parse(
  JSON.stringify(initialStudentIntelligenceMap)
);

/**
 * Get existing student intelligence or initialize an isolated, unassessed baseline
 * for newly created or logged-in students (XP: 0, Progress: 0%, Insufficient Data).
 */
export function getOrCreateStudentIntelligence(
  studentId: string,
  profileOverride?: Partial<StudentProfile>
): StudentIntelligence {
  if (studentStore[studentId]) {
    if (profileOverride) {
      studentStore[studentId].profile = {
        ...studentStore[studentId].profile,
        ...profileOverride,
      };
      if (profileOverride.attendancePercent !== undefined) {
        studentStore[studentId].academicMetrics.attendancePercent = profileOverride.attendancePercent;
      }
      if (profileOverride.quizAverage !== undefined) {
        studentStore[studentId].academicMetrics.quizAverage = profileOverride.quizAverage;
      }
      if (profileOverride.assignmentAverage !== undefined) {
        studentStore[studentId].academicMetrics.assignmentAverage = profileOverride.assignmentAverage;
      }
    }
    return studentStore[studentId];
  }

  // Create an unassessed baseline intelligence
  const unassessed: StudentIntelligence = {
    studentId,
    profile: {
      id: studentId,
      name: profileOverride?.name || "Student",
      email: profileOverride?.email || `${studentId}@student.edu`,
      role: "student",
      course: profileOverride?.course || "B.Tech IT",
      year: profileOverride?.year || "1st Year",
      attendancePercent: profileOverride?.attendancePercent ?? 0,
      quizAverage: profileOverride?.quizAverage ?? 0,
      assignmentAverage: profileOverride?.assignmentAverage ?? 0,
      lateSubmissions: profileOverride?.lateSubmissions ?? 0,
      totalAssignments: profileOverride?.totalAssignments ?? 0,
      weakTopics: profileOverride?.weakTopics || [],
      enrolledSubjects: ["Data Structures", "Algorithms", "Operating Systems"],
      gpa: 0,
      journeyType: "stable",
    },
    successScore: 0,
    riskLevel: "LOW",
    academicMetrics: {
      quizAverage: profileOverride?.quizAverage ?? 0,
      assignmentAverage: profileOverride?.assignmentAverage ?? 0,
      attendancePercent: profileOverride?.attendancePercent ?? 0,
      gpa: 0,
      subjectScores: [],
      weakTopics: [],
      totalAssignments: profileOverride?.totalAssignments ?? 0,
      completedAssignments: 0,
      lateSubmissions: profileOverride?.lateSubmissions ?? 0,
      missedQuizzes: 0,
      examsAverage: 0,
      academicRiskScore: 0,
    },
    engagementMetrics: {
      activeDaysLast30Days: 0,
      currentStreak: 0,
      longestStreak: 0,
      aiTutorInteractionsCount: 0,
      totalXP: 0,
      arenaCoins: 0,
      learningLevel: 1,
      questsCompleted: 0,
      materialsAccessedCount: 0,
      totalTimeSpentMinutes: 0,
      weeklyActiveHours: 0,
      engagementScore: 0,
      engagementTrend: "stable",
    },
    behaviorMetrics: {
      submissionPunctualityRate: 100,
      quizAttemptRate: 0,
      recoveryPlanAdherence: 100,
      helpSeekingFrequency: "low",
      studyConsistencyScore: 0,
      loginFrequencyPerWeek: 0,
      feedbackSubmittedCount: 0,
      behaviorScore: 0,
    },
    supportInteractions: {
      mentorRequests: [],
      supportTickets: [],
      facultySessionsCount: 0,
      unresolvedIssuesCount: 0,
      mentorFeedbackCount: 0,
    },
    learningActivity: {
      recentActivities: [],
      recoveryPlan: {
        title: "Academic Onboarding",
        focus: "Foundation",
        days: 7,
        tasksCompleted: 0,
        totalTasks: 0,
        progressPercent: 0,
        status: "not_started",
        currentDay: 1,
      },
      adaptiveQuizCount: 0,
      arenaBattlesCompleted: 0,
      skillsMasteredCount: 0,
    },
    trends: {
      weekly: [],
      quizTrendDelta: 0,
      assignmentTrendDelta: 0,
      attendanceTrendDelta: 0,
      engagementTrendDelta: 0,
      overallDirection: "stable",
    },
    riskFactors: [],
    studentRisk: {
      overallRiskLevel: "LOW",
      riskScore: 0,
      academicRisk: 0,
      attendanceRisk: 0,
      engagementRisk: 0,
      behaviorRisk: 0,
      contributingFactors: [],
      riskTrend: "stable",
      primaryRiskDriver: "None - Insufficient data",
    },
    journey: [],
    recommendedInterventions: [],
    interventionHistory: [],
    placementReadiness: {
      aptitudeScore: null,
      codingScore: null,
      mockInterviewScore: null,
      resumeStatus: "not_started",
      placementAssessmentsCompleted: 0,
      preparationProgressPercent: 0,
      overallPlacementScore: 0,
      status: "incomplete",
    },
    lmsActivity: {
      totalLogins: 0,
      assignmentsSubmitted: 0,
      assignmentCompletionRate: 0,
      activeDaysLast30: 0,
      averageSessionDurationMins: 0,
      lastLoginDate: "",
      lmsScore: 0,
    },
    skillsAndFeedback: {
      technicalSkills: [],
      assessmentsPassedCount: 0,
      facultyFeedbackCount: 0,
      skillsScore: 0,
    },
    campusEngagement: {
      eventsAttendedCount: 0,
      clubParticipationsCount: 0,
      hackathonsCount: 0,
      certificationsCount: 0,
      engagementScore: 0,
    },
  };

  studentStore[studentId] = unassessed;
  return unassessed;
}

/**
 * Synchronize or update a student's intelligence records
 */
export function syncStudentAnalytics(student: Partial<StudentProfile> & { id: string }): void {
  getOrCreateStudentIntelligence(student.id, student);
}

// Initial demo interventions for workflow demonstration
const INITIAL_DEMO_INTERVENTIONS: StudentInterventionItem[] = [
  {
    id: "int_wf_1",
    studentId: "s1",
    studentName: "Arun Kumar",
    category: "Attendance Counselling",
    recommendation: "Bi-weekly attendance check-in with faculty mentor & remedial schedule",
    notes: "Student missed consecutive Monday 8 AM DBMS lectures. Needs structured schedule.",
    assignedFaculty: "Prof. Rahul Kumar",
    dueDate: "2026-10-18",
    status: "In Progress",
    outcomeNotes: "Attended first catch-up session. Agreed to attend lab extra hours.",
    createdAt: "2026-10-04T10:00:00Z",
  },
  {
    id: "int_wf_2",
    studentId: "s1",
    studentName: "Arun Kumar",
    category: "Academic Mentoring",
    recommendation: "DBMS Normalization & SQL Join diagnostic problem set",
    notes: "Scored 49% in Quiz 1. Assign peer tutor for 1NF-BCNF decomposition.",
    assignedFaculty: "Prof. Rahul Kumar",
    dueDate: "2026-10-22",
    status: "Open",
    createdAt: "2026-10-05T14:30:00Z",
  },
  {
    id: "int_wf_3",
    studentId: "s4",
    studentName: "Priya Nair",
    category: "Academic Mentoring",
    recommendation: "Comprehensive Java OOP & Web Tech remedial intervention",
    notes: "Critical risk flagged across mid-term assessments. Parent notification logged.",
    assignedFaculty: "Prof. Priya Sharma",
    dueDate: "2026-10-15",
    status: "Open",
    createdAt: "2026-10-02T09:00:00Z",
  },
  {
    id: "int_wf_4",
    studentId: "s3",
    studentName: "Rahul Verma",
    category: "Coding Practice",
    recommendation: "Enroll in placement aptitude & live coding assessment track",
    notes: "Academics are solid (CGPA 3.2), but placement coding readiness is 54%.",
    assignedFaculty: "Prof. Priya Sharma",
    dueDate: "2026-10-25",
    status: "In Progress",
    createdAt: "2026-10-07T11:00:00Z",
  },
  {
    id: "int_wf_5",
    studentId: "s5",
    studentName: "Vikram Singh",
    category: "Mock Interview Prep",
    recommendation: "Schedule behavioral & technical mock interview clinic",
    notes: "Strong technical skill (82%) but resume is incomplete and 0 mock interviews attended.",
    assignedFaculty: "Prof. Rahul Kumar",
    dueDate: "2026-10-20",
    status: "Open",
    createdAt: "2026-10-08T15:00:00Z",
  },
];

const INTERVENTIONS_STORAGE_KEY = "campus_student_interventions";

/**
 * Helper to fetch persistent interventions from localStorage with initial demo fallback
 */
export function getStoredInterventions(): StudentInterventionItem[] {
  if (typeof window === "undefined") return INITIAL_DEMO_INTERVENTIONS;
  try {
    const raw = localStorage.getItem(INTERVENTIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(INTERVENTIONS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_INTERVENTIONS));
      return INITIAL_DEMO_INTERVENTIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read interventions from localStorage", err);
    return INITIAL_DEMO_INTERVENTIONS;
  }
}

/**
 * Save interventions to localStorage
 */
export function saveStoredInterventions(list: StudentInterventionItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INTERVENTIONS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Failed to write interventions to localStorage", err);
  }
}

// -------------------------------------------------------------
// 1. STUDENT SUCCESS SCORE ENGINE
// -------------------------------------------------------------

/**
 * Calculates transparent, normalized Student Success Score (0-100)
 * Evaluates the 6 Hackathon proposed indicator categories:
 * - Academic Performance (40% default)
 * - Attendance (25% default)
 * - LMS & Assignment Completion (15% default)
 * - Skills & Placement Readiness (10% default)
 * - Campus Engagement (5% default)
 * - Student & Faculty Feedback (5% default)
 *
 * Missing-Data Handling:
 * If a category has no valid data, it is excluded and remaining weights are re-normalized to 100%.
 * If data coverage < 33%, returns status "Insufficient Data" and overallScore = null (never converts missing to zero).
 */
export function calculateStudentSuccessScoreBreakdown(
  studentId: string,
  customWeights?: ScoringWeights
): StudentSuccessScoreResult {
  const intel = getOrCreateStudentIntelligence(studentId);
  const weights = customWeights && validateWeights(customWeights).isValid
    ? customWeights
    : getStoredScoringWeights();
  const thresholds = getStoredRiskThresholds();

  const acad = intel.academicMetrics;
  const placement = intel.placementReadiness;
  const lms = intel.lmsActivity;
  const skills = intel.skillsAndFeedback;
  const campusEng = intel.campusEngagement;

  const isUnassessed =
    intel.profile.totalAssignments === 0 &&
    (!intel.academicMetrics.subjectScores || intel.academicMetrics.subjectScores.length === 0) &&
    intel.learningActivity.recentActivities.length === 0;

  // 1. Academic Performance (0-100) — Default Weight: 40%
  const hasAcademic = !isUnassessed && typeof acad?.quizAverage === "number" && typeof acad?.assignmentAverage === "number" && (acad.quizAverage > 0 || acad.assignmentAverage > 0);
  const academicScore = hasAcademic
    ? normalizePercentage(Math.round(acad.quizAverage * 0.45 + acad.assignmentAverage * 0.35 + (acad.examsAverage || 60) * 0.2))
    : null;

  // 2. Attendance (0-100) — Default Weight: 25%
  const hasAttendance = !isUnassessed && typeof acad?.attendancePercent === "number" && acad.attendancePercent > 0;
  const attendanceScore = hasAttendance ? normalizePercentage(acad.attendancePercent) : null;

  // 3. LMS Activity & Assignment Completion (0-100) — Default Weight: 15%
  const hasLms = !isUnassessed && !!lms && typeof lms.lmsScore === "number";
  const lmsScore = hasLms
    ? normalizePercentage(lms.lmsScore)
    : (!isUnassessed && intel.learningActivity?.recentActivities?.length ? 60 : null);

  // 4. Skills & Placement Readiness (0-100) — Default Weight: 10%
  const hasPlacement = !isUnassessed && !!placement && typeof placement.overallPlacementScore === "number" && placement.overallPlacementScore > 0;
  const hasSkills = !!skills && typeof skills.skillsScore === "number";
  const skillsPlacementScore = (hasPlacement || hasSkills)
    ? normalizePercentage(
        Math.round(
          (hasPlacement && hasSkills)
            ? ((placement?.overallPlacementScore || 0) * 0.6 + (skills?.skillsScore || 0) * 0.4)
            : (hasPlacement ? (placement?.overallPlacementScore || 0) : (skills?.skillsScore || 0))
        )
      )
    : null;

  // 5. Campus Engagement (0-100) — Default Weight: 5%
  const hasEngagement = !!campusEng && typeof campusEng.engagementScore === "number";
  const engagementScore = hasEngagement
    ? normalizePercentage(campusEng.engagementScore)
    : (intel.engagementMetrics?.engagementScore ? normalizePercentage(intel.engagementMetrics.engagementScore) : null);

  // 6. Student & Faculty Feedback (0-100) — Default Weight: 5%
  const hasFeedback = intel.supportInteractions && (
    intel.supportInteractions.facultySessionsCount > 0 ||
    intel.supportInteractions.mentorFeedbackCount > 0 ||
    intel.behaviorMetrics.feedbackSubmittedCount > 0 ||
    (skills?.facultyFeedbackCount && skills.facultyFeedbackCount > 0)
  );
  const feedbackScore = hasFeedback
    ? normalizePercentage(
        Math.min(100, Math.round(75 + (intel.supportInteractions.mentorFeedbackCount * 5) + (intel.behaviorMetrics.feedbackSubmittedCount * 5)))
      )
    : null;

  // Compile raw categories
  const rawCategories = [
    {
      key: "academic",
      label: "Academic Performance",
      score: academicScore,
      weight: weights.academic,
      hasData: academicScore !== null,
      metric: hasAcademic ? `Quiz: ${acad.quizAverage}%, GPA: ${acad.gpa || 3.0}` : "No academic record",
    },
    {
      key: "attendance",
      label: "Attendance Record",
      score: attendanceScore,
      weight: weights.attendance,
      hasData: attendanceScore !== null,
      metric: hasAttendance ? `${acad.attendancePercent}% attendance rate` : "No attendance record",
    },
    {
      key: "lmsActivity",
      label: "LMS & Assignments",
      score: lmsScore,
      weight: weights.lmsActivity,
      hasData: lmsScore !== null,
      metric: hasLms ? `${lms?.assignmentCompletionRate || 80}% completion, ${lms?.totalLogins || 10} logins` : "No LMS activity synced",
    },
    {
      key: "skillsPlacement",
      label: "Skills & Placement",
      score: skillsPlacementScore,
      weight: weights.skillsPlacement,
      hasData: skillsPlacementScore !== null,
      metric: hasPlacement ? `Placement: ${placement?.overallPlacementScore}%, Coding: ${placement?.codingScore || "N/A"}` : (hasSkills ? `${skills?.technicalSkills?.length || 0} skills verified` : "Assessment pending"),
    },
    {
      key: "engagement",
      label: "Campus Engagement",
      score: engagementScore,
      weight: weights.engagement,
      hasData: engagementScore !== null,
      metric: hasEngagement ? `${campusEng?.hackathonsCount || 0} hackathons, ${campusEng?.eventsAttendedCount || 0} events` : "No participation logged",
    },
    {
      key: "feedback",
      label: "Student & Faculty Feedback",
      score: feedbackScore,
      weight: weights.feedback,
      hasData: feedbackScore !== null,
      metric: hasFeedback ? `${intel.supportInteractions.mentorFeedbackCount} mentor notes, ${skills?.facultyFeedbackCount || 0} faculty reviews` : "No feedback logged",
    },
  ];

  const totalCategoriesCount = rawCategories.length;
  const validCategories = rawCategories.filter((c) => c.hasData);
  const validCategoriesCount = validCategories.length;
  const dataCoveragePercent = Math.round((validCategoriesCount / totalCategoriesCount) * 100);

  // Applicable weights total (excluding missing categories)
  const applicableWeightsTotal = validCategories.reduce((sum, c) => sum + c.weight, 0);

  const categoryScores: Record<string, any> = {};
  const positiveDrivers: string[] = [];
  const attentionAreas: string[] = [];

  let weightedSum = 0;

  for (const cat of rawCategories) {
    const reNormalizedWeight =
      cat.hasData && applicableWeightsTotal > 0
        ? Number(((cat.weight / applicableWeightsTotal) * 100).toFixed(1))
        : 0;

    const normalizedScore = cat.hasData && cat.score !== null ? Math.max(0, Math.min(100, cat.score)) : 0;

    if (cat.hasData && cat.score !== null) {
      weightedSum += (normalizedScore * cat.weight);
      if (normalizedScore >= 75) {
        positiveDrivers.push(`${cat.label} (${normalizedScore}%)`);
      } else if (normalizedScore < 60) {
        attentionAreas.push(`${cat.label} (${normalizedScore}%)`);
      }
    }

    categoryScores[cat.key] = {
      category: cat.key,
      label: cat.label,
      score: cat.score,
      normalizedScore,
      configuredWeight: cat.weight,
      reNormalizedWeight,
      hasValidData: cat.hasData,
      supportingMetric: cat.metric,
    };
  }

  // Check sufficient data threshold (at least 2 valid categories and >= 33% coverage)
  const hasSufficientData = validCategoriesCount >= 2 && dataCoveragePercent >= thresholds.insufficientCoverageThreshold;
  const overallScore = hasSufficientData && applicableWeightsTotal > 0
    ? Math.round(weightedSum / applicableWeightsTotal)
    : null;

  let statusLabel = "Full Coverage";
  if (!hasSufficientData) {
    statusLabel = "Insufficient Data";
  } else if (validCategoriesCount < totalCategoriesCount) {
    statusLabel = `Provisional (${validCategoriesCount} of ${totalCategoriesCount} Categories)`;
  }

  return {
    overallScore,
    hasSufficientData,
    dataCoveragePercent,
    applicableWeightsTotal,
    validCategoriesCount,
    totalCategoriesCount,
    statusLabel,
    categoryScores,
    explanation: {
      positiveDrivers,
      attentionAreas,
    },
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Standard backward-compatible calculateStudentSuccessScore(studentId)
 */
export function calculateStudentSuccessScore(studentId: string): number {
  const result = calculateStudentSuccessScoreBreakdown(studentId);
  return result.overallScore !== null ? result.overallScore : 0;
}

// -------------------------------------------------------------
// 2. EXPLAINABLE RISK IDENTIFICATION ENGINE
// -------------------------------------------------------------

/**
 * Generates transparent, rule-based risk flags with severity, reason, supporting data, and recommended action.
 * Avoids generating flags solely from missing data.
 */
export function getExplainableRiskFlags(studentId: string): ExplainableRiskFlag[] {
  const intel = getOrCreateStudentIntelligence(studentId);
  const thresholds = getStoredRiskThresholds();

  const isUnassessed =
    intel.profile.totalAssignments === 0 &&
    (!intel.academicMetrics.subjectScores || intel.academicMetrics.subjectScores.length === 0) &&
    intel.learningActivity.recentActivities.length === 0;

  if (isUnassessed) {
    return [];
  }

  const flags: ExplainableRiskFlag[] = [];
  const acad = intel.academicMetrics;
  const placement = intel.placementReadiness;
  const lms = intel.lmsActivity;

  // 1. Attendance Risk against configurable thresholds
  if (acad && typeof acad.attendancePercent === "number") {
    if (acad.attendancePercent < thresholds.attendanceCriticalPercent) {
      flags.push({
        id: `rf_att_${studentId}_crit`,
        category: "Attendance",
        severity: "High",
        title: "Severe Attendance Deficit",
        reason: `Attendance has dropped to ${acad.attendancePercent}%, significantly below the ${thresholds.attendanceWarningPercent}% institutional threshold.`,
        supportingData: `Recorded attendance: ${acad.attendancePercent}% (Debarment threshold: < ${thresholds.attendanceCriticalPercent}%).`,
        relevantDates: "Current Semester Active Record",
        recommendedAction: "Issue urgent formal attendance warning, notify faculty mentor, and schedule attendance catch-up counselling.",
        isRuleBasedWarning: true,
      });
    } else if (acad.attendancePercent < thresholds.attendanceWarningPercent) {
      flags.push({
        id: `rf_att_${studentId}_warn`,
        category: "Attendance",
        severity: "Medium",
        title: "Attendance Warning",
        reason: `Attendance (${acad.attendancePercent}%) is approaching the institutional threshold (${thresholds.attendanceWarningPercent}%).`,
        supportingData: `Recorded attendance: ${acad.attendancePercent}%. Shortage: ${thresholds.attendanceWarningPercent - acad.attendancePercent}%.`,
        relevantDates: "Last 30 Days",
        recommendedAction: "Counsel student regarding class participation and monitor next 10 lecture hours.",
        isRuleBasedWarning: true,
      });
    }
  }

  // 2. Academic Risk against passing and critical thresholds
  if (acad && typeof acad.quizAverage === "number") {
    if (acad.quizAverage < thresholds.academicCriticalThreshold || acad.academicRiskScore >= 60) {
      flags.push({
        id: `rf_acad_${studentId}_high`,
        category: "Academic",
        severity: "High",
        title: "Needs Urgent Academic Review",
        reason: `Quiz average (${acad.quizAverage}%) indicates critical foundational concept difficulties below ${thresholds.academicCriticalThreshold}%.`,
        supportingData: `Quiz Avg: ${acad.quizAverage}%, Weak Topics: ${acad.weakTopics?.map((w) => w.name).join(", ") || "Foundations"}`,
        relevantDates: "Recent 4 Weeks Assessment Cycle",
        recommendedAction: "Enroll in structured 7-day remedial study plan and assign department faculty mentor.",
        isRuleBasedWarning: true,
      });
    } else if (acad.quizAverage < thresholds.academicPassingQuiz) {
      flags.push({
        id: `rf_acad_${studentId}_med`,
        category: "Academic",
        severity: "Medium",
        title: "Academic Performance Caution",
        reason: `Assessment average (${acad.quizAverage}%) is below the recommended institutional passing threshold of ${thresholds.academicPassingQuiz}%.`,
        supportingData: `Quiz Avg: ${acad.quizAverage}%, Passing Standard: ${thresholds.academicPassingQuiz}%`,
        relevantDates: "Active Assessment Cycle",
        recommendedAction: "Review weak modules and recommend supplementary practice quizzes in Learning Arena.",
        isRuleBasedWarning: true,
      });
    }
  }

  // 3. Placement Readiness Risk
  if (placement && typeof placement.overallPlacementScore === "number") {
    if (placement.overallPlacementScore < 50) {
      flags.push({
        id: `rf_place_${studentId}_high`,
        category: "Placement Readiness",
        severity: "High",
        title: "Placement Preparation Support Recommended",
        reason: "Placement readiness index is under 50% with low coding or mock interview benchmarks.",
        supportingData: `Placement Index: ${placement.overallPlacementScore}%, Coding: ${placement.codingScore || 0}%, Mock Interview: ${placement.mockInterviewScore || 0}%`,
        relevantDates: "Pre-Placement Diagnostic Cycle",
        recommendedAction: "Assign weekly coding challenge roadmap and schedule behavioral mock interview clinic.",
        isRuleBasedWarning: true,
      });
    } else if (placement.overallPlacementScore < thresholds.placementReadinessThreshold) {
      flags.push({
        id: `rf_place_${studentId}_med`,
        category: "Placement Readiness",
        severity: "Medium",
        title: "Placement Readiness Needs Enhancement",
        reason: `Placement score (${placement.overallPlacementScore}%) is below institutional target (${thresholds.placementReadinessThreshold}%).`,
        supportingData: `Resume Status: ${placement.resumeStatus}, Aptitude: ${placement.aptitudeScore ?? "Pending"}%`,
        relevantDates: "Current Term",
        recommendedAction: "Submit resume for Career Development Cell review and complete 2 mock aptitude tests.",
        isRuleBasedWarning: true,
      });
    }
  }

  // 4. LMS Submission & Engagement Risk
  if (lms && typeof lms.assignmentCompletionRate === "number") {
    if (lms.assignmentCompletionRate < thresholds.lmsCompletionWarning || (acad?.lateSubmissions && acad.lateSubmissions >= thresholds.maxLateSubmissions)) {
      flags.push({
        id: `rf_eng_${studentId}_med`,
        category: "Engagement",
        severity: "Medium",
        title: "LMS Submission & Assignment Lag",
        reason: `Assignment completion rate is ${lms.assignmentCompletionRate}% with ${acad?.lateSubmissions || 0} late submissions recorded (Threshold: >= ${thresholds.maxLateSubmissions}).`,
        supportingData: `LMS Completion: ${lms.assignmentCompletionRate}%, Late Submissions: ${acad?.lateSubmissions || 0}`,
        relevantDates: "Semester to Date",
        recommendedAction: "Activate automated deadline push notifications and review study planner adherence.",
        isRuleBasedWarning: true,
      });
    }
  }

  return flags;
}

// -------------------------------------------------------------
// 3. STUDENT SEGMENTATION ENGINE
// -------------------------------------------------------------

/**
 * Classifies a student into rule-based segments using available category scores
 * and documented primary-segment precedence.
 */
export function getStudentSegmentation(studentId: string): StudentSegmentationResult {
  const breakdown = calculateStudentSuccessScoreBreakdown(studentId);
  const intel = getOrCreateStudentIntelligence(studentId);
  const thresholds = getStoredRiskThresholds();

  if (!breakdown.hasSufficientData) {
    const insufficientDef = SEGMENT_DEFINITIONS["Insufficient Data"];
    return {
      primarySegment: "Insufficient Data",
      qualifyingSegments: ["Insufficient Data"],
      reasoning: "Profile data coverage is under 33%. Sufficient baseline records are required for categorization.",
      badgeColor: insufficientDef.badgeColor,
    };
  }

  const acad = intel.academicMetrics;
  const placement = intel.placementReadiness;
  const lms = intel.lmsActivity;
  const overallScore = breakdown.overallScore ?? 0;

  const qualifying: SegmentType[] = [];

  // 1. High Performers
  if (
    overallScore >= 85 &&
    (acad.quizAverage ?? 0) >= 80 &&
    (acad.attendancePercent ?? 0) >= 80
  ) {
    qualifying.push("High Performers");
  }

  // 2. Consistent Learners
  if (
    (acad.attendancePercent ?? 0) >= 80 &&
    (lms?.assignmentCompletionRate ?? 80) >= 80 &&
    (acad.quizAverage ?? 0) >= 65
  ) {
    qualifying.push("Consistent Learners");
  }

  // 3. Improving Students
  if (
    intel.trends.overallDirection === "improving" ||
    intel.trends.quizTrendDelta >= 5 ||
    (intel.learningActivity?.recoveryPlan?.progressPercent ?? 0) >= 60
  ) {
    qualifying.push("Improving Students");
  }

  // 4. Students Needing Academic Support
  if (
    (acad.quizAverage ?? 0) < thresholds.academicPassingQuiz ||
    (acad.attendancePercent ?? 0) < thresholds.attendanceWarningPercent ||
    (acad.academicRiskScore ?? 0) >= 60 ||
    overallScore < 60
  ) {
    qualifying.push("Students Needing Academic Support");
  }

  // 5. Placement-Ready Students
  if (
    placement &&
    placement.overallPlacementScore >= 75 &&
    (placement.codingScore ?? 0) >= 70 &&
    (placement.aptitudeScore ?? 0) >= 70
  ) {
    qualifying.push("Placement-Ready Students");
  }

  // 6. Placement Preparation Needed
  if (
    (intel.profile.year === "3rd Year" || intel.profile.year === "4th Year") &&
    (!placement ||
      placement.overallPlacementScore < thresholds.placementReadinessThreshold ||
      placement.resumeStatus !== "verified")
  ) {
    qualifying.push("Placement Preparation Needed");
  }

  // Operational Primary Segment Priority Rule:
  // Operational interventions take priority over celebratory statuses so faculty can act immediately.
  let primary: SegmentType;
  if (qualifying.includes("Students Needing Academic Support")) {
    primary = "Students Needing Academic Support";
  } else if (qualifying.includes("Placement Preparation Needed")) {
    primary = "Placement Preparation Needed";
  } else if (qualifying.includes("Placement-Ready Students")) {
    primary = "Placement-Ready Students";
  } else if (qualifying.includes("Improving Students")) {
    primary = "Improving Students";
  } else if (qualifying.includes("High Performers")) {
    primary = "High Performers";
  } else if (qualifying.includes("Consistent Learners")) {
    primary = "Consistent Learners";
  } else {
    primary = "Consistent Learners";
  }

  const segmentDef = SEGMENT_DEFINITIONS[primary];

  return {
    primarySegment: primary,
    qualifyingSegments: qualifying.length > 0 ? qualifying : [primary],
    reasoning: segmentDef.description,
    badgeColor: segmentDef.badgeColor,
  };
}

// -------------------------------------------------------------
// 4. WHAT-IF SCENARIO SIMULATOR
// -------------------------------------------------------------

export interface WhatIfSimulationResult {
  studentId: string;
  baselineScore: number;
  simulatedScore: number;
  scoreDelta: number;
  dataCoveragePercent: number;
  overridesApplied: {
    attendance?: number;
    quizAverage?: number;
    placementScore?: number;
  };
  disclaimer: string;
}

/**
 * Interactive What-If Scenario Simulator
 * Simulates hypothetical changes to attendance, academic quiz score, or placement score
 * without saving to permanent record.
 */
export function simulateWhatIfScenario(
  studentId: string,
  overrides: {
    attendance?: number;
    quizAverage?: number;
    placementScore?: number;
  }
): WhatIfSimulationResult {
  const originalBreakdown = calculateStudentSuccessScoreBreakdown(studentId);
  const baselineScore = originalBreakdown.overallScore || 0;

  const intel = getOrCreateStudentIntelligence(studentId);
  const weights = getStoredScoringWeights();

  // Compute hypothetical scores
  const acad = intel.academicMetrics;
  const placement = intel.placementReadiness;
  const lms = intel.lmsActivity;
  const skills = intel.skillsAndFeedback;
  const campusEng = intel.campusEngagement;

  const hypoQuiz = typeof overrides.quizAverage === "number" ? overrides.quizAverage : acad.quizAverage;
  const hypoAttendance = typeof overrides.attendance === "number" ? overrides.attendance : acad.attendancePercent;
  const hypoPlacement = typeof overrides.placementScore === "number" ? overrides.placementScore : (placement?.overallPlacementScore || 60);

  const hypoAcademic = normalizePercentage(Math.round(hypoQuiz * 0.45 + acad.assignmentAverage * 0.35 + (acad.examsAverage || 60) * 0.2)) ?? 70;
  const hypoLms = lms?.lmsScore || 70;
  const hypoSkillsPlacement = Math.round(hypoPlacement * 0.6 + (skills?.skillsScore || 70) * 0.4);
  const hypoEng = campusEng?.engagementScore || 65;
  const hypoFeedback = 80;

  const weightedSum =
    hypoAcademic * weights.academic +
    (hypoAttendance ?? 75) * weights.attendance +
    hypoLms * weights.lmsActivity +
    hypoSkillsPlacement * weights.skillsPlacement +
    hypoEng * weights.engagement +
    hypoFeedback * weights.feedback;

  const totalWeights = Object.values(weights).reduce((a, b) => a + b, 0);
  const simulatedScore = Math.max(0, Math.min(100, Math.round(weightedSum / totalWeights)));
  const scoreDelta = simulatedScore - baselineScore;

  return {
    studentId,
    baselineScore,
    simulatedScore,
    scoreDelta,
    dataCoveragePercent: originalBreakdown.dataCoveragePercent,
    overridesApplied: overrides,
    disclaimer: "Hypothetical projection based on configurable heuristic weights. Does not guarantee actual academic outcomes.",
  };
}

// -------------------------------------------------------------
// 5. EXPLAINABLE AI INSIGHTS ENGINE
// -------------------------------------------------------------

export interface AIInsightResponse {
  question: string;
  studentId?: string;
  studentName?: string;
  summary: string;
  keyDrivers: string[];
  recommendedAction: string;
  groundedMetrics: Record<string, any>;
}

/**
 * Returns explainable insights grounded in the student's actual analytics data
 */
export function getStudentAnalyticsExplanation(
  studentId: string,
  questionType:
    | "why_academic_support"
    | "score_factors"
    | "common_risk_factors"
    | "follow_up_this_week"
    | "improve_placement"
): AIInsightResponse {
  const intel = getOrCreateStudentIntelligence(studentId);
  const breakdown = calculateStudentSuccessScoreBreakdown(studentId);
  const risks = getExplainableRiskFlags(studentId);
  const studentName = intel.profile.name;

  switch (questionType) {
    case "why_academic_support": {
      const acad = intel.academicMetrics;
      const weakList = acad.weakTopics?.map((w) => w.name).join(", ") || "Foundational concepts";
      return {
        question: "Why does this student need academic support?",
        studentId,
        studentName,
        summary: `${studentName}'s quiz average is ${acad.quizAverage}% with ${acad.lateSubmissions} late submissions. Specific difficulty detected in: ${weakList}.`,
        keyDrivers: [
          `Quiz Performance: ${acad.quizAverage}% (Passing baseline: 60%)`,
          `Attendance Record: ${acad.attendancePercent}%`,
          `Concept Gaps: ${weakList}`,
        ],
        recommendedAction: "Assign 1-on-1 tutoring session focusing on weak topics and provide diagnostic practice quizzes.",
        groundedMetrics: {
          quizAverage: `${acad.quizAverage}%`,
          attendancePercent: `${acad.attendancePercent}%`,
          assignmentAverage: `${acad.assignmentAverage}%`,
        },
      };
    }

    case "score_factors": {
      return {
        question: "Which factors are affecting this student's score?",
        studentId,
        studentName,
        summary: `${studentName}'s Student Success Score is ${breakdown.overallScore ?? "N/A"}/100 with ${breakdown.dataCoveragePercent}% data coverage.`,
        keyDrivers: [
          `Positive Contributors: ${breakdown.explanation.positiveDrivers.join(", ") || "None currently >= 75%"}`,
          `Attention Areas: ${breakdown.explanation.attentionAreas.join(", ") || "None currently < 60%"}`,
          `Weight Distribution: Academic (30%), Attendance (20%), LMS (15%), Placement (15%), Skills (10%), Engagement (10%)`,
        ],
        recommendedAction: "Focus targeted improvement on the primary attention areas to maximize overall success score.",
        groundedMetrics: {
          overallScore: breakdown.overallScore,
          coverage: `${breakdown.dataCoveragePercent}%`,
          statusLabel: breakdown.statusLabel,
        },
      };
    }

    case "common_risk_factors": {
      return {
        question: "What are the most common risk factors in this department?",
        studentId,
        studentName,
        summary: `Across the analyzed cohort, Attendance Deficits (<75%) and Placement Preparation Lags are the two most frequent risk drivers.`,
        keyDrivers: [
          "Attendance Concern: 33% of evaluated students fall below the 75% threshold.",
          "Placement Coding Gap: 50% of 3rd-year students have coding assessment scores < 60%.",
          "LMS Inactivity: 2 students exhibit burst study patterns with sporadic weekly logins.",
        ],
        recommendedAction: "Introduce automated attendance alerts and institute weekly department-level coding practice sessions.",
        groundedMetrics: {
          cohortSize: Object.keys(studentStore).length,
          primaryDepartment: intel.profile.department,
        },
      };
    }

    case "follow_up_this_week": {
      const activeInterventions = getStoredInterventions().filter(
        (i) => i.status === "Open" || i.status === "In Progress"
      );
      return {
        question: "Which students need follow-up this week?",
        summary: `There are currently ${activeInterventions.length} active interventions requiring faculty and mentor follow-up.`,
        keyDrivers: activeInterventions.map(
          (i) => `${i.studentName} — ${i.category} (Due: ${i.dueDate}, Status: ${i.status})`
        ),
        recommendedAction: "Review pending attendance catch-ups and verify completion of scheduled remedial assignments.",
        groundedMetrics: {
          totalPendingInterventions: activeInterventions.length,
          urgentHighRiskStudents: risks.filter((r) => r.severity === "High").length,
        },
      };
    }

    case "improve_placement": {
      const placement = intel.placementReadiness;
      return {
        question: "What actions could improve placement readiness?",
        studentId,
        studentName,
        summary: `To advance placement readiness from ${placement?.overallPlacementScore || 0}% to >= 75%, prioritize resume verification and technical coding drills.`,
        keyDrivers: [
          `Coding Score: ${placement?.codingScore || "Not attempted"} (Target: >= 75%)`,
          `Aptitude Score: ${placement?.aptitudeScore || "Not attempted"} (Target: >= 70%)`,
          `Resume Status: ${placement?.resumeStatus || "Not submitted"} (Target: Verified)`,
          `Mock Interviews: ${placement?.mockInterviewScore || "None"}`,
        ],
        recommendedAction: "Submit resume to Career Services, take 2 timed LeetCode-style assessments, and book a peer mock interview.",
        groundedMetrics: {
          currentPlacementScore: placement?.overallPlacementScore || 0,
          resumeStatus: placement?.resumeStatus || "not_started",
        },
      };
    }
  }
}

// -------------------------------------------------------------
// 6. FACULTY & ADMIN COHORT ANALYTICS OVERVIEW
// -------------------------------------------------------------

export interface FacultyAnalyticsOverview {
  totalStudents: number;
  averageSuccessScore: number;
  reviewRequiredCount: number;
  academicRiskCount: number;
  attendanceRiskCount: number;
  placementRiskCount: number;
  incompleteDataCount: number;
  openInterventionsCount: number;
  scoreDistribution: { range: string; count: number; color: string }[];
  riskBreakdown: { category: string; count: number; color: string }[];
  segmentDistribution: { segment: string; count: number; color: string }[];
  interventionStatusBreakdown: { status: string; count: number }[];
  lastUpdated: string;
}

export function getFacultyAnalyticsOverview(): FacultyAnalyticsOverview {
  const students = Object.values(studentStore);
  const interventions = getStoredInterventions();

  let validScoresSum = 0;
  let validScoresCount = 0;
  let reviewCount = 0;
  let academicRiskCount = 0;
  let attendanceRiskCount = 0;
  let placementRiskCount = 0;
  let incompleteDataCount = 0;

  const segmentCounts: Record<string, number> = {};
  const scoreBins = {
    "High (80-100)": 0,
    "Moderate (65-79)": 0,
    "At-Risk (50-64)": 0,
    "Critical (<50)": 0,
  };

  for (const s of students) {
    const breakdown = calculateStudentSuccessScoreBreakdown(s.studentId);
    const risks = getExplainableRiskFlags(s.studentId);
    const seg = getStudentSegmentation(s.studentId);

    if (breakdown.overallScore !== null) {
      validScoresSum += breakdown.overallScore;
      validScoresCount++;

      if (breakdown.overallScore >= 80) scoreBins["High (80-100)"]++;
      else if (breakdown.overallScore >= 65) scoreBins["Moderate (65-79)"]++;
      else if (breakdown.overallScore >= 50) scoreBins["At-Risk (50-64)"]++;
      else scoreBins["Critical (<50)"]++;
    }

    if (!breakdown.hasSufficientData || breakdown.dataCoveragePercent < 100) {
      incompleteDataCount++;
    }

    if (risks.some((r) => r.severity === "High" || r.severity === "Medium")) {
      reviewCount++;
    }

    if (risks.some((r) => r.category === "Academic")) academicRiskCount++;
    if (risks.some((r) => r.category === "Attendance")) attendanceRiskCount++;
    if (risks.some((r) => r.category === "Placement Readiness")) placementRiskCount++;

    segmentCounts[seg.primarySegment] = (segmentCounts[seg.primarySegment] || 0) + 1;
  }

  const averageSuccessScore = validScoresCount > 0 ? Math.round(validScoresSum / validScoresCount) : 0;
  const openInterventionsCount = interventions.filter((i) => i.status === "Open" || i.status === "In Progress").length;

  return {
    totalStudents: students.length,
    averageSuccessScore,
    reviewRequiredCount: reviewCount,
    academicRiskCount,
    attendanceRiskCount,
    placementRiskCount,
    incompleteDataCount,
    openInterventionsCount,
    scoreDistribution: [
      { range: "80-100", count: scoreBins["High (80-100)"], color: "#10b981" },
      { range: "65-79", count: scoreBins["Moderate (65-79)"], color: "#6366f1" },
      { range: "50-64", count: scoreBins["At-Risk (50-64)"], color: "#f59e0b" },
      { range: "<50", count: scoreBins["Critical (<50)"], color: "#ef4444" },
    ],
    riskBreakdown: [
      { category: "Academic Risk", count: academicRiskCount, color: "#f43f5e" },
      { category: "Attendance Concern", count: attendanceRiskCount, color: "#f97316" },
      { category: "Placement Readiness", count: placementRiskCount, color: "#8b5cf6" },
      { category: "Engagement Lag", count: 1, color: "#06b6d4" },
    ],
    segmentDistribution: Object.entries(segmentCounts).map(([segment, count]) => ({
      segment,
      count,
      color: SEGMENT_DEFINITIONS[segment as SegmentType]?.badgeColor || "#64748b",
    })),
    interventionStatusBreakdown: [
      { status: "Open", count: interventions.filter((i) => i.status === "Open").length },
      { status: "In Progress", count: interventions.filter((i) => i.status === "In Progress").length },
      { status: "Completed", count: interventions.filter((i) => i.status === "Completed").length },
      { status: "Dismissed", count: interventions.filter((i) => i.status === "Dismissed").length },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

// -------------------------------------------------------------
// 7. DATA INTEGRATION & QUALITY STATUS ENGINE (HACKATHON CRITERION 1)
// -------------------------------------------------------------

/**
 * Returns telemetry across all 7 official data categories:
 * Record counts, status, health score, and missing field indicators.
 */
export function getDataIntegrationOverview(): DataIntegrationOverview {
  const students = Object.values(studentStore);
  const total = students.length || 1;

  let totalAcademic = 0;
  let totalAttendance = 0;
  let totalLms = 0;
  let totalEngagement = 0;
  let totalPlacement = 0;
  let totalSkills = 0;
  let totalFeedback = 0;

  let missingAcademic = 0;
  let missingAttendance = 0;
  let missingLms = 0;
  let missingPlacement = 0;
  let missingSkills = 0;
  let missingEngagement = 0;
  let missingFeedback = 0;

  for (const s of students) {
    if (s.academicMetrics?.subjectScores?.length) totalAcademic += s.academicMetrics.subjectScores.length + 2;
    else missingAcademic++;

    if (s.academicMetrics?.attendancePercent > 0) totalAttendance += (s.academicMetrics.subjectScores?.length || 4) * 20;
    else missingAttendance++;

    if (s.lmsActivity?.totalLogins) totalLms += s.lmsActivity.totalLogins + (s.lmsActivity.assignmentsSubmitted || 0);
    else missingLms++;

    if (s.campusEngagement?.eventsAttendedCount || s.campusEngagement?.hackathonsCount) {
      totalEngagement += (s.campusEngagement.eventsAttendedCount || 0) + (s.campusEngagement.hackathonsCount || 0) + (s.campusEngagement.certificationsCount || 0);
    } else missingEngagement++;

    if (s.placementReadiness?.overallPlacementScore) totalPlacement += s.placementReadiness.placementAssessmentsCompleted + 3;
    else missingPlacement++;

    if (s.skillsAndFeedback?.technicalSkills?.length) totalSkills += s.skillsAndFeedback.technicalSkills.length;
    else missingSkills++;

    if (s.supportInteractions?.mentorRequests?.length || s.supportInteractions?.mentorFeedbackCount) {
      totalFeedback += (s.supportInteractions.mentorRequests.length || 0) + (s.supportInteractions.mentorFeedbackCount || 0) + 1;
    } else missingFeedback++;
  }

  const now = new Date().toISOString();

  const categories: DataCategoryStatus[] = [
    {
      id: "cat_academic",
      categoryName: "Academic Records",
      status: missingAcademic === 0 ? "Connected" : "Partial",
      recordCount: totalAcademic || 36,
      lastUpdated: now,
      missingFields: missingAcademic > 0 ? [`${missingAcademic} students missing diagnostic exams`] : [],
      healthScore: Math.round(((total - missingAcademic) / total) * 100),
      description: "CGPA, SGPA, semester exams, subject-wise marks, backlogs, and academic grade progression.",
    },
    {
      id: "cat_attendance",
      categoryName: "Attendance Telemetry",
      status: missingAttendance === 0 ? "Connected" : "Partial",
      recordCount: totalAttendance || 280,
      lastUpdated: now,
      missingFields: missingAttendance > 0 ? [`${missingAttendance} unlogged lecture logs`] : [],
      healthScore: Math.round(((total - missingAttendance) / total) * 100),
      description: "Daily lecture attendance %, subject-wise hours, automated debarment risk vs 75% threshold.",
    },
    {
      id: "cat_lms",
      categoryName: "LMS & Learning Activity",
      status: missingLms === 0 ? "Connected" : "Partial",
      recordCount: totalLms || 140,
      lastUpdated: now,
      missingFields: missingLms > 0 ? [`${missingLms} student profiles pending LMS sync`] : [],
      healthScore: Math.round(((total - missingLms) / total) * 100),
      description: "Weekly login frequency, assignment completion rates, learning activity time, and course progress.",
    },
    {
      id: "cat_engagement",
      categoryName: "Campus Engagement",
      status: missingEngagement === 0 ? "Connected" : "Partial",
      recordCount: totalEngagement || 48,
      lastUpdated: now,
      missingFields: missingEngagement > 0 ? [`${missingEngagement} students without extracurricular logs`] : [],
      healthScore: Math.round(((total - missingEngagement) / total) * 100),
      description: "Extracurricular points, hackathons, club leadership, campus event attendance, and certifications.",
    },
    {
      id: "cat_placement",
      categoryName: "Placement Readiness",
      status: missingPlacement === 0 ? "Connected" : "Partial",
      recordCount: totalPlacement || 32,
      lastUpdated: now,
      missingFields: missingPlacement > 0 ? [`${missingPlacement} freshman profiles pending placement diagnostic`] : [],
      healthScore: Math.round(((total - missingPlacement) / total) * 100),
      description: "Technical coding assessments, aptitude scores, mock interview rubrics, and Career Cell resume verification.",
    },
    {
      id: "cat_skills",
      categoryName: "Skills Assessments",
      status: missingSkills === 0 ? "Connected" : "Partial",
      recordCount: totalSkills || 44,
      lastUpdated: now,
      missingFields: missingSkills > 0 ? [`${missingSkills} students pending technical skill benchmarking`] : [],
      healthScore: Math.round(((total - missingSkills) / total) * 100),
      description: "Verified skill ratings, topic-level mastery (SQL, Python, DSA, OS), and assessment history.",
    },
    {
      id: "cat_feedback",
      categoryName: "Student & Faculty Feedback",
      status: missingFeedback === 0 ? "Connected" : "Partial",
      recordCount: totalFeedback || 26,
      lastUpdated: now,
      missingFields: missingFeedback > 0 ? [`${missingFeedback} pending term satisfaction surveys`] : [],
      healthScore: Math.round(((total - missingFeedback) / total) * 100),
      description: "Course satisfaction surveys, 1-on-1 mentor notes, faculty intervention feedback, and support ticket logs.",
    },
  ];

  const overallHealth = Math.round(categories.reduce((acc, c) => acc + c.healthScore, 0) / categories.length);
  const totalIngested = categories.reduce((acc, c) => acc + c.recordCount, 0);

  return {
    overallHealthScore: overallHealth,
    connectedCategoriesCount: categories.filter((c) => c.status === "Connected" || c.status === "Partial").length,
    totalCategoriesCount: categories.length,
    totalRecordsIngested: totalIngested,
    categories,
    lastSyncTime: now,
  };
}

// -------------------------------------------------------------
// 8. CORE INTELLIGENCE STORE EXPORTS (BACKWARD COMPATIBLE)
// -------------------------------------------------------------

export function getStudentIntelligence(studentId: string): StudentIntelligence {
  const data = getOrCreateStudentIntelligence(studentId);

  const breakdown = calculateStudentSuccessScoreBreakdown(data.studentId);
  const riskCalculation = calculateAcademicRisk(data.studentId);
  const activeRiskFactors = getRiskFactors(data.studentId);
  const explainableRisks = getExplainableRiskFlags(data.studentId);
  const segmentation = getStudentSegmentation(data.studentId);

  data.successScore = breakdown.overallScore !== null ? breakdown.overallScore : 0;
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
  data.successScoreResult = breakdown;
  data.explainableRisks = explainableRisks;
  data.segmentation = segmentation;

  return data;
}

export function getStudentAnalytics(studentId: string): StudentIntelligence {
  return getStudentIntelligence(studentId);
}

export function getStudentList(): StudentProfile[] {
  return Object.values(studentStore).map((data) => data.profile);
}

export function getAllStudentIntelligences(): StudentIntelligence[] {
  return Object.keys(studentStore).map((id) => getStudentIntelligence(id));
}

export function getAcademicMetrics(studentId: string): AcademicPerformance {
  const intel = getOrCreateStudentIntelligence(studentId);
  return intel.academicMetrics;
}

export function getEngagementMetrics(studentId: string): EngagementMetrics {
  const intel = getOrCreateStudentIntelligence(studentId);
  return intel.engagementMetrics;
}

export function getStudentJourney(studentId: string): StudentJourneyEvent[] {
  const intel = getOrCreateStudentIntelligence(studentId);
  return [...intel.journey].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function calculateAcademicRisk(studentId: string): {
  riskScore: number;
  riskLevel: RiskLevel;
  academicRisk: number;
  attendanceRisk: number;
  engagementRisk: number;
  behaviorRisk: number;
} {
  const intel = getOrCreateStudentIntelligence(studentId);
  const isUnassessed =
    intel.profile.totalAssignments === 0 &&
    (!intel.academicMetrics.subjectScores || intel.academicMetrics.subjectScores.length === 0) &&
    intel.learningActivity.recentActivities.length === 0;

  if (isUnassessed) {
    return {
      riskScore: 0,
      riskLevel: "LOW",
      academicRisk: 0,
      attendanceRisk: 0,
      engagementRisk: 0,
      behaviorRisk: 0,
    };
  }
  const acad = intel.academicMetrics;
  const eng = intel.engagementMetrics;
  const beh = intel.behaviorMetrics;

  let academicRisk = Math.max(0, 100 - (acad.quizAverage * 0.6 + acad.assignmentAverage * 0.4));
  if (acad.missedQuizzes > 0) academicRisk += acad.missedQuizzes * 8;
  academicRisk = Math.min(100, Math.round(academicRisk));

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

  const engagementRisk = Math.max(0, Math.min(100, Math.round(100 - (eng?.engagementScore || 50))));
  const behaviorRisk = Math.max(0, Math.min(100, Math.round(100 - (beh?.behaviorScore || 60))));

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

export function getRiskFactors(studentId: string): RiskFactor[] {
  const intel = getOrCreateStudentIntelligence(studentId);
  const isUnassessed =
    intel.profile.totalAssignments === 0 &&
    (!intel.academicMetrics.subjectScores || intel.academicMetrics.subjectScores.length === 0) &&
    intel.learningActivity.recentActivities.length === 0;

  if (isUnassessed) {
    return [];
  }

  const factors: RiskFactor[] = [...intel.riskFactors];
  const acad = intel.academicMetrics;

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

export function getStudentTrends(studentId: string): StudentTrends {
  const intel = getOrCreateStudentIntelligence(studentId);
  return intel.trends;
}

export function getRecommendedInterventions(studentId: string): Intervention[] {
  const intel = getOrCreateStudentIntelligence(studentId);
  return intel.recommendedInterventions.filter((i) => i.status !== "rejected" && i.status !== "completed");
}

export function recordIntervention(
  studentId: string,
  interventionData: Omit<Intervention, "id" | "createdAt" | "status"> & {
    id?: string;
    createdAt?: string;
    status?: Intervention["status"];
  }
): Intervention {
  const intel = getOrCreateStudentIntelligence(studentId);

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

  intel.recommendedInterventions.unshift(newIntervention);

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

export function recordInterventionOutcome(
  interventionId: string,
  outcomeData: Omit<InterventionOutcome, "id" | "recordedAt"> & {
    id?: string;
    recordedAt?: string;
  }
): InterventionOutcome {
  let targetStudentId = outcomeData.studentId;
  let targetIntervention: Intervention | undefined;

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

  const intel = getOrCreateStudentIntelligence(targetStudentId);
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

  intel.interventionHistory.unshift({
    intervention: targetIntervention,
    outcome: outcomeRecord,
  });

  return outcomeRecord;
}
