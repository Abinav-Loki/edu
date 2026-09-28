// ============================================================
// EduGuard AI — Centralised Mock Data
// Replace these values with real API/Supabase calls in Phase 2
// ============================================================

export const student = {
  name: "Arun Kumar",
  firstName: "Arun",
  course: "B.Tech IT",
  year: "3rd Year",
  avatar: null, // will be an image URL in production
  attendancePercent: 68,
  quizAverage: 58,
  assignmentAverage: 62,
  lateSubmissions: 2,
  totalAssignments: 6,
  attendanceTrend: -7,
  quizTrend: -18,
  assignmentTrend: -12,
};

export const performanceData = [
  { week: "Week 1", quiz: 72, assignment: 75, attendance: 80 },
  { week: "Week 2", quiz: 65, assignment: 70, attendance: 76 },
  { week: "Week 3", quiz: 60, assignment: 65, attendance: 72 },
  { week: "Week 4", quiz: 58, assignment: 62, attendance: 68 },
];

export type Priority = "high" | "medium" | "low";

export interface WeakTopic {
  id: string;
  name: string;
  priority: Priority;
  subject: string;
  description: string;
}

export const weakTopics: WeakTopic[] = [
  {
    id: "sql-joins",
    name: "SQL Joins",
    priority: "high",
    subject: "Database Management",
    description: "Understanding INNER, LEFT, RIGHT and FULL OUTER joins",
  },
  {
    id: "normalization",
    name: "Normalization",
    priority: "medium",
    subject: "Database Management",
    description: "1NF, 2NF, 3NF and BCNF normal forms",
  },
  {
    id: "transactions",
    name: "Transactions",
    priority: "low",
    subject: "Database Management",
    description: "ACID properties, commit, rollback and savepoints",
  },
];

export interface Activity {
  id: string;
  type: "quiz" | "study" | "assignment" | "tutor";
  title: string;
  detail: string;
  time: string;
}

export const recentActivity: Activity[] = [
  {
    id: "act-1",
    type: "quiz",
    title: "Completed Database Fundamentals Quiz",
    detail: "72%",
    time: "2 hours ago",
  },
  {
    id: "act-2",
    type: "study",
    title: "Viewed SQL Joins Study Material",
    detail: "15%",
    time: "5 hours ago",
  },
  {
    id: "act-3",
    type: "assignment",
    title: "Submitted Assignment 2",
    detail: "Late",
    time: "1 day ago",
  },
  {
    id: "act-4",
    type: "tutor",
    title: "Asked: What is Normalization?",
    detail: "AI Tutor",
    time: "1 day ago",
  },
];

export const recoveryPlan = {
  title: "Your 7-Day Recovery Plan",
  subtitle: "A personalized plan to help you get back on track.",
  focus: "SQL Joins & Normalization",
  days: 7,
  tasks: 12,
  quizzes: 12,
  currentDay: 1,
  completedTasks: 1,
  totalDayTasks: 4,
  dailyTasks: [
    {
      id: "task-1",
      title: "Watch SQL Joins Basics",
      type: "Video",
      duration: "20 min",
      completed: true,
    },
    {
      id: "task-2",
      title: "Practice Quiz – SQL Joins",
      type: "Quiz",
      duration: "10 questions",
      completed: false,
    },
    {
      id: "task-3",
      title: "Read: Normalization Notes",
      type: "Reading",
      duration: "15 min",
      completed: false,
    },
    {
      id: "task-4",
      title: "Revision: Key Concepts",
      type: "Revision",
      duration: "10 min",
      completed: false,
    },
  ],
  weeklyGoals: {
    topics: 3,
    quizzes: 7,
    assignments: 1,
  },
};

export interface QuizOption {
  id: string;
  label: string;
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  options: QuizOption[];
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question:
      "Which SQL join returns all records from the left table, and the matching records from the right table?",
    topic: "SQL Joins",
    difficulty: "medium",
    options: [
      { id: "a", label: "A", text: "Inner Join", correct: false },
      { id: "b", label: "B", text: "Left Join", correct: true },
      { id: "c", label: "C", text: "Right Join", correct: false },
      { id: "d", label: "D", text: "Full Outer Join", correct: false },
    ],
    explanation:
      "A LEFT JOIN returns all rows from the left table and matched rows from the right table. If no match exists, NULLs are returned for right table columns.",
  },
  {
    id: "q2",
    question:
      "Which normal form eliminates partial dependencies on a composite primary key?",
    topic: "Normalization",
    difficulty: "medium",
    options: [
      { id: "a", label: "A", text: "1NF", correct: false },
      { id: "b", label: "B", text: "2NF", correct: true },
      { id: "c", label: "C", text: "3NF", correct: false },
      { id: "d", label: "D", text: "BCNF", correct: false },
    ],
    explanation:
      "2NF eliminates partial dependencies — every non-key attribute must depend on the whole primary key, not just part of it.",
  },
  {
    id: "q3",
    question: "Which ACID property ensures that a transaction is fully completed or not at all?",
    topic: "Transactions",
    difficulty: "easy",
    options: [
      { id: "a", label: "A", text: "Consistency", correct: false },
      { id: "b", label: "B", text: "Isolation", correct: false },
      { id: "c", label: "C", text: "Atomicity", correct: true },
      { id: "d", label: "D", text: "Durability", correct: false },
    ],
    explanation:
      "Atomicity guarantees that each transaction is treated as a single unit — it either fully completes or is fully rolled back.",
  },
];

export interface ChatMessage {
  id: string;
  role: "bot" | "user";
  content: string;
  timestamp: string;
}

export const initialChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    role: "bot",
    content:
      "Let's solve this together! 👋 Before I give you a hint, can you tell me what concept you think this question is testing?",
    timestamp: "10:30 AM",
  },
  {
    id: "msg-2",
    role: "user",
    content: "I think it's about SQL joins, maybe inner join?",
    timestamp: "10:31 AM",
  },
  {
    id: "msg-3",
    role: "bot",
    content:
      "Great! That's a good start. 👍 Now, which table do you think should be the starting point for this join?\n\nThink about which table has the most relevant data for the condition.",
    timestamp: "10:31 AM",
  },
];

export const knowledgeAnswer = {
  query: "What happens if I miss my exam due to illness?",
  answer: [
    "Submit a medical certificate within 3 days.",
    "Fill out the Make-up Exam Request form.",
    "Obtain Dean approval.",
    "Receive the new exam date by email.",
  ],
  source: {
    filename: "Exam Guidelines.pdf",
    page: 18,
    section: "4.2",
  },
  disclaimer:
    "This is mock data for demonstration purposes only. Do not treat this as real university policy.",
};

export const progressData = {
  overallScore: 63,
  streak: 5,
  badges: [
    { id: "b1", name: "First Quiz", icon: "🏆", earned: true },
    { id: "b2", name: "7-Day Streak", icon: "🔥", earned: false },
    { id: "b3", name: "Topic Master", icon: "⭐", earned: false },
    { id: "b4", name: "Early Bird", icon: "🌅", earned: true },
  ],
  subjectScores: [
    { subject: "Database Management", score: 58, total: 100 },
    { subject: "Operating Systems", score: 71, total: 100 },
    { subject: "Computer Networks", score: 65, total: 100 },
    { subject: "Software Engineering", score: 74, total: 100 },
  ],
};

export const resources = [
  {
    id: "r1",
    title: "SQL Joins — Complete Guide",
    type: "PDF",
    subject: "Database Management",
    duration: "45 min read",
    pages: 24,
  },
  {
    id: "r2",
    title: "Normalization in DBMS",
    type: "Video",
    subject: "Database Management",
    duration: "32 min",
    pages: null,
  },
  {
    id: "r3",
    title: "ACID Properties Explained",
    type: "Article",
    subject: "Database Management",
    duration: "15 min read",
    pages: 8,
  },
  {
    id: "r4",
    title: "Operating Systems — Process Management",
    type: "PDF",
    subject: "Operating Systems",
    duration: "60 min read",
    pages: 36,
  },
];

export const calendarEvents = [
  {
    id: "e1",
    title: "Database Quiz 4",
    date: "2026-10-05",
    type: "quiz",
    time: "10:00 AM",
  },
  {
    id: "e2",
    title: "Assignment 3 Deadline",
    date: "2026-10-07",
    type: "assignment",
    time: "11:59 PM",
  },
  {
    id: "e3",
    title: "OS Mid-Term Exam",
    date: "2026-10-12",
    type: "exam",
    time: "9:00 AM",
  },
  {
    id: "e4",
    title: "Recovery Plan — Day 5 Review",
    date: "2026-10-03",
    type: "plan",
    time: "6:00 PM",
  },
];

export const quote = {
  text: "The expert in anything was once a beginner.",
  author: "Helen Hayes",
};
