import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useCampus } from "./CampusContext";
import { 
  LearningProfile, Mission, Quest, Skill, Achievement, XPEvent, 
  initialLearningProfiles, defaultMissions, defaultQuests, defaultSkills, defaultAchievements,
  Cosmetic, defaultCosmetics
} from "../data/learningData";

interface LearningContextType {
  profile: LearningProfile | null;
  missions: Mission[];
  quests: Quest[];
  skills: Skill[];
  achievements: Achievement[];
  xpEvents: XPEvent[];
  cosmetics: Cosmetic[];
  awardXP: (amount: number, reason: string, source: string) => void;
  completeMission: (missionId: string) => void;
  completeQuestTask: (questId: string, taskId: string) => void;
  completeQuiz: (subject: string, score: number, total: number) => void;
  updateStreak: () => void;
  unlockCosmetic: (cosmeticId: string, cost: number) => boolean;
  equipCosmetic: (cosmeticId: string, type: "avatar" | "frame" | "background" | "title") => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export function LearningProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useCampus();
  const studentId = currentUser?.role === "student" ? currentUser.id : null;

  const [profiles, setProfiles] = useState<Record<string, LearningProfile>>(initialLearningProfiles);
  const [missions, setMissions] = useState<Record<string, Mission[]>>({});
  const [quests, setQuests] = useState<Record<string, Quest[]>>({});
  const [skills, setSkills] = useState<Record<string, Skill[]>>({});
  const [achievements, setAchievements] = useState<Record<string, Achievement[]>>({});
  const [xpEvents, setXPEvents] = useState<Record<string, XPEvent[]>>({});

  // Initialize data for student if missing
  useEffect(() => {
    if (studentId) {
      if (!profiles[studentId]) {
        setProfiles(prev => ({
          ...prev,
          [studentId]: {
            studentId, level: 1, totalXP: 0, arenaCoins: 0, streak: 0, longestStreak: 0, lastLearningDate: "",
            completedQuests: 0, quizAccuracy: 0, quizzesCompleted: 0, title: "New Explorer", currentFocus: "General",
            avatarId: "av-1", frameId: "fr-1", backgroundId: "bg-1", titleId: "ti-1",
            unlockedCosmetics: ["av-1", "fr-1", "bg-1", "ti-1"]
          }
        }));
      }
      if (!missions[studentId]) setMissions(prev => ({ ...prev, [studentId]: [...defaultMissions] }));
      if (!quests[studentId]) setQuests(prev => ({ ...prev, [studentId]: [...defaultQuests] }));
      if (!skills[studentId]) setSkills(prev => ({ ...prev, [studentId]: [...defaultSkills] }));
      if (!achievements[studentId]) setAchievements(prev => ({ ...prev, [studentId]: [...defaultAchievements] }));
      if (!xpEvents[studentId]) setXPEvents(prev => ({ ...prev, [studentId]: [] }));
    }
  }, [studentId, profiles, missions, quests, skills, achievements, xpEvents]);

  const profile = studentId ? profiles[studentId] : null;
  const studentMissions = studentId ? (missions[studentId] || []) : [];
  const studentQuests = studentId ? (quests[studentId] || []) : [];
  const studentSkills = studentId ? (skills[studentId] || []) : [];
  const studentAchievements = studentId ? (achievements[studentId] || []) : [];
  const studentXPEvents = studentId ? (xpEvents[studentId] || []) : [];

  function checkLevelUp(currentXP: number) {
    // Basic level calculation: Level = floor(XP / 250) + 1
    // e.g. 1840 / 250 = 7.36 -> Level 8, wait initial is Level 12 for 1840. 
    // Let's make it 150XP per level. 1840 / 150 = 12.2.
    return Math.floor(currentXP / 150) + 1;
  }

  function awardXP(amount: number, reason: string, source: string) {
    if (!studentId || !profile) return;
    
    // Add event
    const newEvent: XPEvent = {
      id: `xp-${Date.now()}`, studentId, amount, reason, source, timestamp: new Date().toISOString()
    };
    setXPEvents(prev => ({ ...prev, [studentId]: [newEvent, ...(prev[studentId] || [])] }));

    // Update profile
    setProfiles(prev => {
      const p = prev[studentId];
      const newTotal = p.totalXP + amount;
      const newCoins = p.arenaCoins + amount; // 1 XP = 1 Coin in this system
      const newLevel = checkLevelUp(newTotal);
      return {
        ...prev,
        [studentId]: {
          ...p,
          totalXP: newTotal,
          arenaCoins: newCoins,
          level: newLevel
        }
      };
    });

    updateStreak();
    
    // Simple achievement check for total XP (demo)
    checkAchievements();
  }

  function updateStreak() {
    if (!studentId || !profile) return;
    const now = new Date();
    const lastDate = profile.lastLearningDate ? new Date(profile.lastLearningDate) : null;
    
    setProfiles(prev => {
      const p = prev[studentId];
      let newStreak = p.streak;
      if (!lastDate) {
        newStreak = 1;
      } else {
        const diffHours = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
        if (diffHours > 24 && diffHours < 48) {
          newStreak += 1;
        } else if (diffHours >= 48) {
          newStreak = 1; // reset streak
        }
      }
      return {
        ...prev,
        [studentId]: {
          ...p,
          streak: newStreak,
          longestStreak: Math.max(newStreak, p.longestStreak),
          lastLearningDate: now.toISOString()
        }
      };
    });
  }

  function completeMission(missionId: string) {
    if (!studentId) return;
    let xpToAward = 0;
    setMissions(prev => {
      const ms = prev[studentId].map(m => {
        if (m.id === missionId && !m.completed) {
          xpToAward = m.xpReward;
          return { ...m, progress: m.target, completed: true };
        }
        return m;
      });
      return { ...prev, [studentId]: ms };
    });
    if (xpToAward > 0) {
      awardXP(xpToAward, "Mission Completed", "mission");
    }
  }

  function completeQuestTask(questId: string, taskId: string) {
    if (!studentId) return;
    let questCompleted = false;
    let xpToAward = 0;
    let questTitle = "";

    setQuests(prev => {
      const qs = prev[studentId].map(q => {
        if (q.id === questId) {
          const updatedTasks = q.tasks.map(t => t.id === taskId ? { ...t, completed: true } : t);
          const allCompleted = updatedTasks.every(t => t.completed);
          if (allCompleted && q.status !== "COMPLETED") {
            questCompleted = true;
            xpToAward = q.xpReward;
            questTitle = q.title;
            return { ...q, tasks: updatedTasks, status: "COMPLETED" as const };
          }
          return { ...q, tasks: updatedTasks, status: "IN_PROGRESS" as const };
        }
        return q;
      });
      return { ...prev, [studentId]: qs };
    });

    if (questCompleted) {
      awardXP(xpToAward, `Quest Completed: ${questTitle}`, "quest");
      setProfiles(prev => ({
        ...prev,
        [studentId]: { ...prev[studentId], completedQuests: prev[studentId].completedQuests + 1 }
      }));
    } else {
      awardXP(10, "Quest Task Completed", "quest_task");
    }
  }

  function completeQuiz(subject: string, score: number, total: number) {
    if (!studentId || !profile) return;
    const accuracy = (score / total) * 100;
    
    setProfiles(prev => {
      const p = prev[studentId];
      const totalAcc = (p.quizAccuracy * p.quizzesCompleted + accuracy) / (p.quizzesCompleted + 1);
      return {
        ...prev,
        [studentId]: { ...p, quizzesCompleted: p.quizzesCompleted + 1, quizAccuracy: Math.round(totalAcc) }
      };
    });

    // Update skill randomly for demo
    setSkills(prev => {
      const ss = prev[studentId].map(s => {
        if (s.subject === subject && accuracy > 70 && s.proficiency < 100) {
          return { ...s, proficiency: Math.min(100, s.proficiency + 5), lastUpdated: new Date().toISOString() };
        }
        return s;
      });
      return { ...prev, [studentId]: ss };
    });

    awardXP(score * 10, `Completed ${subject} Quiz`, "quiz");
  }

  function checkAchievements() {
    if (!studentId) return;
    setAchievements(prev => {
      const updated = prev[studentId].map(a => {
        if (!a.unlocked && a.progress >= a.requirement) {
          return { ...a, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return a;
      });
      return { ...prev, [studentId]: updated };
    });
  }

  function unlockCosmetic(cosmeticId: string, cost: number): boolean {
    if (!studentId || !profile) return false;
    if (profile.arenaCoins < cost) return false;

    setProfiles(prev => {
      const p = prev[studentId];
      if (p.unlockedCosmetics.includes(cosmeticId)) return prev;
      return {
        ...prev,
        [studentId]: {
          ...p,
          arenaCoins: p.arenaCoins - cost,
          unlockedCosmetics: [...p.unlockedCosmetics, cosmeticId]
        }
      };
    });
    return true;
  }

  function equipCosmetic(cosmeticId: string, type: "avatar" | "frame" | "background" | "title") {
    if (!studentId || !profile) return;
    setProfiles(prev => {
      const p = prev[studentId];
      const updates: Partial<LearningProfile> = {};
      if (type === "avatar") updates.avatarId = cosmeticId;
      if (type === "frame") updates.frameId = cosmeticId;
      if (type === "background") updates.backgroundId = cosmeticId;
      if (type === "title") {
        updates.titleId = cosmeticId;
        const cosmetic = defaultCosmetics.find(c => c.id === cosmeticId);
        if (cosmetic) updates.title = cosmetic.name;
      }
      return {
        ...prev,
        [studentId]: {
          ...p,
          ...updates
        }
      };
    });
  }

  return (
    <LearningContext.Provider value={{
      profile, missions: studentMissions, quests: studentQuests,
      skills: studentSkills, achievements: studentAchievements, xpEvents: studentXPEvents,
      cosmetics: defaultCosmetics,
      awardXP, completeMission, completeQuestTask, completeQuiz, updateStreak,
      unlockCosmetic, equipCosmetic
    }}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error("useLearning must be used within a LearningProvider");
  }
  return context;
}
