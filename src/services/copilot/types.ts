export interface CopilotMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}

export interface CopilotResponse {
  replyText: string;
  timestamp: string;
  suggestedFollowUps?: string[];
  status: "success" | "error";
  errorMessage?: string;
}

export interface CopilotStudentContext {
  studentId?: string;
  studentName?: string;
  course?: string;
  year?: string;
  email?: string;
  attendancePercent?: number;
  attendanceTrend?: number;
  quizAverage?: number;
  quizTrend?: number;
  quizzesCompleted?: number;
  quizAccuracy?: number;
  assignmentAverage?: number;
  assignmentTrend?: number;
  totalAssignments?: number;
  lateSubmissions?: number;
  weakTopics?: string[];
  learningLevel?: number;
  totalXP?: number;
  arenaCoins?: number;
  streak?: number;
  longestStreak?: number;
  currentFocus?: string;
  successScore?: number;
  riskFlags?: string[];
  recentActivities?: Array<{
    title: string;
    detail: string;
    time: string;
  }>;
  recoveryPlan?: {
    title?: string;
    focus?: string;
    days?: number;
    completedTasks?: number;
    totalTasks?: number;
    currentDay?: number;
  };
}

