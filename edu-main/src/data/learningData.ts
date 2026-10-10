export interface XPEvent {
  id: string;
  studentId: string;
  amount: number;
  reason: string;
  source: string;
  timestamp: string;
}

export type CosmeticRarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type CosmeticType = "avatar" | "frame" | "background" | "title";

export interface Cosmetic {
  id: string;
  type: CosmeticType;
  name: string;
  description: string;
  rarity: CosmeticRarity;
  cost: number;
  unlockRequirement?: string;
  previewUrl?: string; // used for images if applicable
  icon?: string; // fallback icon/emoji
  isDefault?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  subject: string;
  proficiency: number; // 0-100
  level: string;
  lastUpdated: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
  dueDate: string;
}

export interface QuestTask {
  id: string;
  description: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  subject: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  tasks: QuestTask[];
  xpReward: number;
  status: "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";
  recommendedReason?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LearningProfile {
  studentId: string;
  level: number;
  totalXP: number;
  arenaCoins: number;
  streak: number;
  longestStreak: number;
  lastLearningDate: string;
  completedQuests: number;
  quizAccuracy: number;
  quizzesCompleted: number;
  title: string;
  currentFocus: string;
  
  // Cosmetic state
  avatarId: string;
  frameId: string;
  backgroundId: string;
  titleId: string;
  unlockedCosmetics: string[];
}

export const initialLearningProfiles: Record<string, LearningProfile> = {
  "s1": {
    studentId: "s1",
    level: 12,
    totalXP: 1840,
    arenaCoins: 1250,
    streak: 7,
    longestStreak: 14,
    lastLearningDate: new Date().toISOString(),
    completedQuests: 12,
    quizAccuracy: 86,
    quizzesCompleted: 24,
    title: "DBMS Explorer",
    currentFocus: "DBMS Normalization",
    avatarId: "av-1",
    frameId: "fr-1",
    backgroundId: "bg-1",
    titleId: "ti-1",
    unlockedCosmetics: ["av-1", "fr-1", "bg-1", "ti-1", "ti-2", "av-2"]
  }
};

export const defaultCosmetics: Cosmetic[] = [
  // Avatars
  { id: "av-1", type: "avatar", name: "Basic Student", description: "The starting avatar.", rarity: "COMMON", cost: 0, icon: "🎓", isDefault: true },
  { id: "av-2", type: "avatar", name: "Campus Explorer", description: "Someone who knows the campus inside out.", rarity: "UNCOMMON", cost: 500, icon: "🗺️" },
  { id: "av-3", type: "avatar", name: "SQL Master", description: "Master of databases.", rarity: "RARE", cost: 1200, icon: "💾", unlockRequirement: "Reach Level 10" },
  { id: "av-4", type: "avatar", name: "AI Oracle", description: "One with the AI.", rarity: "LEGENDARY", cost: 3000, icon: "🤖", unlockRequirement: "Reach Level 25" },
  
  // Frames
  { id: "fr-1", type: "frame", name: "Default Frame", description: "Standard CampusOS frame.", rarity: "COMMON", cost: 0, isDefault: true },
  { id: "fr-2", type: "frame", name: "Scholar Frame", description: "For dedicated learners.", rarity: "UNCOMMON", cost: 400 },
  { id: "fr-3", type: "frame", name: "Golden Frame", description: "A shiny golden frame.", rarity: "RARE", cost: 800 },
  { id: "fr-4", type: "frame", name: "Neon Knowledge", description: "Glows with academic energy.", rarity: "EPIC", cost: 1500 },
  
  // Backgrounds
  { id: "bg-1", type: "background", name: "Light Canvas", description: "Clean and simple.", rarity: "COMMON", cost: 0, isDefault: true },
  { id: "bg-2", type: "background", name: "Campus Library", description: "A quiet place to study.", rarity: "UNCOMMON", cost: 500 },
  { id: "bg-3", type: "background", name: "Data Matrix", description: "For the tech-savvy.", rarity: "EPIC", cost: 1200 },
  
  // Titles
  { id: "ti-1", type: "title", name: "New Explorer", description: "Just starting out.", rarity: "COMMON", cost: 0, isDefault: true },
  { id: "ti-2", type: "title", name: "DBMS Explorer", description: "Specialized in databases.", rarity: "UNCOMMON", cost: 200 },
  { id: "ti-3", type: "title", name: "Consistency Champion", description: "Maintains long streaks.", rarity: "RARE", cost: 600, unlockRequirement: "14 Day Streak" },
  { id: "ti-4", type: "title", name: "Campus Scholar", description: "Top of the class.", rarity: "LEGENDARY", cost: 2500 }
];

export const defaultMissions: Mission[] = [
  {
    id: "m1",
    title: "Quick Win",
    description: "Complete 10 DBMS questions",
    subject: "DBMS",
    difficulty: "BEGINNER",
    xpReward: 50,
    progress: 0,
    target: 10,
    completed: false,
    dueDate: new Date().toISOString()
  },
  {
    id: "m2",
    title: "Skill Builder",
    description: "Solve 3 SQL problems",
    subject: "SQL",
    difficulty: "INTERMEDIATE",
    xpReward: 75,
    progress: 0,
    target: 3,
    completed: false,
    dueDate: new Date().toISOString()
  }
];

export const defaultQuests: Quest[] = [
  {
    id: "q1",
    title: "DBMS Recovery Mission",
    subject: "DBMS",
    description: "Master database normalization and basic SQL joins.",
    difficulty: "INTERMEDIATE",
    tasks: [
      { id: "qt1", description: "Review Normalization notes", completed: false },
      { id: "qt2", description: "Complete 10-question quiz", completed: false },
      { id: "qt3", description: "Solve 3 SQL problems", completed: false },
      { id: "qt4", description: "Book DBMS mentor session", completed: false }
    ],
    xpReward: 300,
    status: "AVAILABLE",
    recommendedReason: "Your recent DBMS assessments show difficulty with normalization."
  }
];

export const defaultSkills: Skill[] = [
  { id: "sk1", name: "Database Fundamentals", subject: "DBMS", proficiency: 100, level: "Advanced", lastUpdated: new Date().toISOString() },
  { id: "sk2", name: "SQL", subject: "DBMS", proficiency: 82, level: "Intermediate", lastUpdated: new Date().toISOString() },
  { id: "sk3", name: "ER Modeling", subject: "DBMS", proficiency: 70, level: "Intermediate", lastUpdated: new Date().toISOString() },
  { id: "sk4", name: "Normalization", subject: "DBMS", proficiency: 52, level: "Beginner", lastUpdated: new Date().toISOString() },
  { id: "sk5", name: "Transactions", subject: "DBMS", proficiency: 30, level: "Beginner", lastUpdated: new Date().toISOString() }
];

export const defaultAchievements: Achievement[] = [
  {
    id: "a1",
    title: "Query Master",
    description: "Solve 50 SQL problems.",
    icon: "🏅",
    requirement: 50,
    progress: 12,
    unlocked: false
  },
  {
    id: "a2",
    title: "Consistency Champion",
    description: "Maintain a 14-day learning streak.",
    icon: "🔥",
    requirement: 14,
    progress: 7,
    unlocked: false
  },
  {
    id: "a3",
    title: "Knowledge Contributor",
    description: "Upload 5 useful study materials.",
    icon: "📚",
    requirement: 5,
    progress: 1,
    unlocked: false
  }
];
