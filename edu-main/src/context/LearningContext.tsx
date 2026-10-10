import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useCampus } from "./CampusContext";
import { 
  LearningProfile, Mission, Quest, Skill, Achievement, XPEvent, 
  initialLearningProfiles, defaultMissions, defaultQuests, defaultSkills, defaultAchievements,
  Cosmetic, defaultCosmetics
} from "../data/learningData";
import { isSupabaseConfigured } from "../lib/supabase";
import {
  fetchLearningProfileFromDB,
  saveLearningProfileToDB,
  saveXPEventToDB,
  fetchXPEventsFromDB,
  fetchMissionsFromDB,
  completeMissionInDB,
  fetchQuestsFromDB,
  updateQuestProgressInDB,
  fetchSkillsFromDB,
  saveSkillToDB,
  fetchAchievementsFromDB,
  saveAchievementToDB,
  saveQuizResultToDB
} from "../services/supabaseService";

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
  const activeUserId = currentUser?.id || null;

  // State isolated strictly for the current authenticated user
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [xpEvents, setXPEvents] = useState<XPEvent[]>([]);

  // Synchronously load user data whenever activeUserId changes
  useEffect(() => {
    if (!activeUserId) {
      // Clear in-memory state on logout / unauthenticated
      setProfile(null);
      setMissions([]);
      setQuests([]);
      setSkills([]);
      setAchievements([]);
      setXPEvents([]);
      return;
    }

    // 1. Synchronous isolated read from localStorage for this specific user
    const profileKey = `edu_learning_profile_${activeUserId}`;
    const missionsKey = `edu_missions_${activeUserId}`;
    const questsKey = `edu_quests_${activeUserId}`;
    const skillsKey = `edu_skills_${activeUserId}`;
    const achievementsKey = `edu_achievements_${activeUserId}`;
    const xpEventsKey = `edu_xp_events_${activeUserId}`;

    let localProfile: LearningProfile | null = null;
    try {
      const raw = localStorage.getItem(profileKey);
      if (raw) localProfile = JSON.parse(raw);
    } catch (e) {
      console.warn("Error reading local learning profile:", e);
    }

    if (!localProfile) {
      // Check seeded demo profiles or generate fresh clean baseline for this user
      if (initialLearningProfiles[activeUserId]) {
        localProfile = { ...initialLearningProfiles[activeUserId], studentId: activeUserId };
      } else {
        localProfile = {
          studentId: activeUserId,
          level: 1,
          totalXP: 0,
          arenaCoins: 0,
          streak: 0,
          longestStreak: 0,
          lastLearningDate: "",
          completedQuests: 0,
          quizAccuracy: 0,
          quizzesCompleted: 0,
          title: "New Explorer",
          currentFocus: "General",
          avatarId: "av-1",
          frameId: "fr-1",
          backgroundId: "bg-1",
          titleId: "ti-1",
          unlockedCosmetics: ["av-1", "fr-1", "bg-1", "ti-1"]
        };
      }
      try {
        localStorage.setItem(profileKey, JSON.stringify(localProfile));
      } catch (e) {}
    }
    setProfile(localProfile);

    // Missions
    try {
      const rawMissions = localStorage.getItem(missionsKey);
      if (rawMissions) {
        setMissions(JSON.parse(rawMissions));
      } else {
        const freshMissions = defaultMissions.map(m => ({ ...m }));
        setMissions(freshMissions);
        localStorage.setItem(missionsKey, JSON.stringify(freshMissions));
      }
    } catch {
      setMissions([...defaultMissions]);
    }

    // Quests
    try {
      const rawQuests = localStorage.getItem(questsKey);
      if (rawQuests) {
        setQuests(JSON.parse(rawQuests));
      } else {
        const freshQuests = defaultQuests.map(q => ({ ...q, tasks: q.tasks.map(t => ({ ...t })) }));
        setQuests(freshQuests);
        localStorage.setItem(questsKey, JSON.stringify(freshQuests));
      }
    } catch {
      setQuests([...defaultQuests]);
    }

    // Skills
    try {
      const rawSkills = localStorage.getItem(skillsKey);
      if (rawSkills) {
        setSkills(JSON.parse(rawSkills));
      } else {
        const freshSkills = defaultSkills.map(s => ({ ...s }));
        setSkills(freshSkills);
        localStorage.setItem(skillsKey, JSON.stringify(freshSkills));
      }
    } catch {
      setSkills([...defaultSkills]);
    }

    // Achievements
    try {
      const rawAchievements = localStorage.getItem(achievementsKey);
      if (rawAchievements) {
        setAchievements(JSON.parse(rawAchievements));
      } else {
        const freshAchievements = defaultAchievements.map(a => ({ ...a }));
        setAchievements(freshAchievements);
        localStorage.setItem(achievementsKey, JSON.stringify(freshAchievements));
      }
    } catch {
      setAchievements([...defaultAchievements]);
    }

    // XP Events
    try {
      const rawXP = localStorage.getItem(xpEventsKey);
      setXPEvents(rawXP ? JSON.parse(rawXP) : []);
    } catch {
      setXPEvents([]);
    }

    // 2. Asynchronously reconcile with Supabase if configured
    if (isSupabaseConfigured()) {
      let isCurrent = true;
      Promise.all([
        fetchLearningProfileFromDB(activeUserId),
        fetchMissionsFromDB(activeUserId),
        fetchQuestsFromDB(activeUserId),
        fetchSkillsFromDB(activeUserId),
        fetchAchievementsFromDB(activeUserId),
        fetchXPEventsFromDB(activeUserId)
      ]).then(([dbProfile, dbMissions, dbQuests, dbSkills, dbAchievements, dbXPEvents]) => {
        if (!isCurrent) return;
        if (dbProfile) {
          setProfile(dbProfile);
          try { localStorage.setItem(profileKey, JSON.stringify(dbProfile)); } catch (e) {}
        }
        if (dbMissions && dbMissions.length > 0) {
          setMissions(dbMissions);
          try { localStorage.setItem(missionsKey, JSON.stringify(dbMissions)); } catch (e) {}
        }
        if (dbQuests && dbQuests.length > 0) {
          setQuests(dbQuests);
          try { localStorage.setItem(questsKey, JSON.stringify(dbQuests)); } catch (e) {}
        }
        if (dbSkills && dbSkills.length > 0) {
          setSkills(dbSkills);
          try { localStorage.setItem(skillsKey, JSON.stringify(dbSkills)); } catch (e) {}
        }
        if (dbAchievements && dbAchievements.length > 0) {
          setAchievements(dbAchievements);
          try { localStorage.setItem(achievementsKey, JSON.stringify(dbAchievements)); } catch (e) {}
        }
        if (dbXPEvents && dbXPEvents.length > 0) {
          setXPEvents(dbXPEvents);
          try { localStorage.setItem(xpEventsKey, JSON.stringify(dbXPEvents)); } catch (e) {}
        }
      }).catch(err => {
        console.warn("Supabase learning sync error for user", activeUserId, err);
      });

      return () => {
        isCurrent = false;
      };
    }
  }, [activeUserId]);

  function checkLevelUp(currentXP: number) {
    return Math.floor(currentXP / 150) + 1;
  }

  function checkAchievements(currentXP: number) {
    if (!activeUserId) return;
    setAchievements(prev => {
      const updated = prev.map(a => {
        if (!a.unlocked) {
          let shouldUnlock = false;
          if (a.id === "ach-4" && currentXP >= 2000) shouldUnlock = true;
          if (a.progress >= a.requirement) shouldUnlock = true;
          if (shouldUnlock) {
            const unlockedAchievement = { ...a, unlocked: true, unlockedAt: new Date().toISOString() };
            if (isSupabaseConfigured()) saveAchievementToDB(unlockedAchievement, activeUserId).catch(console.error);
            return unlockedAchievement;
          }
        }
        return a;
      });
      try {
        localStorage.setItem(`edu_achievements_${activeUserId}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }

  function awardXP(amount: number, reason: string, source: string) {
    if (!activeUserId || !profile) return;
    if (amount <= 0) return;

    // Create unique event
    const newEvent: XPEvent = {
      id: `xp-${activeUserId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentId: activeUserId,
      amount,
      reason,
      source,
      timestamp: new Date().toISOString()
    };

    setXPEvents(prev => {
      const updated = [newEvent, ...prev];
      try {
        localStorage.setItem(`edu_xp_events_${activeUserId}`, JSON.stringify(updated.slice(0, 50)));
      } catch (e) {}
      return updated;
    });

    const newTotal = profile.totalXP + amount;
    const newCoins = profile.arenaCoins + amount;
    const newLevel = checkLevelUp(newTotal);

    const updatedProfile: LearningProfile = {
      ...profile,
      totalXP: newTotal,
      arenaCoins: newCoins,
      level: newLevel,
      lastLearningDate: new Date().toISOString(),
      streak: profile.streak === 0 ? 1 : profile.streak
    };

    setProfile(updatedProfile);
    try {
      localStorage.setItem(`edu_learning_profile_${activeUserId}`, JSON.stringify(updatedProfile));
    } catch (e) {}

    if (isSupabaseConfigured()) {
      saveXPEventToDB(newEvent).catch(console.error);
      saveLearningProfileToDB(updatedProfile).catch(console.error);
    }

    checkAchievements(newTotal);
  }

  function updateStreak() {
    if (!activeUserId || !profile) return;
    const now = new Date();
    const lastDate = profile.lastLearningDate ? new Date(profile.lastLearningDate) : null;
    
    let newStreak = profile.streak;
    if (!lastDate) {
      newStreak = 1;
    } else {
      const diffHours = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
      if (diffHours > 24 && diffHours < 48) {
        newStreak += 1;
      } else if (diffHours >= 48) {
        newStreak = 1;
      }
    }

    const updated: LearningProfile = {
      ...profile,
      streak: newStreak,
      longestStreak: Math.max(newStreak, profile.longestStreak),
      lastLearningDate: now.toISOString()
    };

    setProfile(updated);
    try {
      localStorage.setItem(`edu_learning_profile_${activeUserId}`, JSON.stringify(updated));
    } catch (e) {}

    if (isSupabaseConfigured()) {
      saveLearningProfileToDB(updated).catch(console.error);
    }
  }

  function completeMission(missionId: string) {
    if (!activeUserId) return;
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.completed) {
      // Idempotent: already completed, prevent duplicate XP award
      return;
    }

    const xpToAward = mission.xpReward;
    const updated = missions.map(m =>
      m.id === missionId ? { ...m, progress: m.target, completed: true } : m
    );
    setMissions(updated);
    try {
      localStorage.setItem(`edu_missions_${activeUserId}`, JSON.stringify(updated));
    } catch (e) {}

    if (isSupabaseConfigured()) {
      completeMissionInDB(missionId, activeUserId).catch(console.error);
    }

    if (xpToAward > 0) {
      awardXP(xpToAward, `Completed Mission: ${mission.title}`, "mission");
    }
  }

  function completeQuestTask(questId: string, taskId: string) {
    if (!activeUserId) return;
    const quest = quests.find(q => q.id === questId);
    const task = quest?.tasks.find(t => t.id === taskId);
    if (!task || task.completed) {
      // Idempotent: already completed
      return;
    }

    let questCompleted = false;
    let xpToAward = 0;
    let questTitle = "";
    let updatedQuestTasks: any[] = [];
    let updatedQuestStatus = "IN_PROGRESS";

    const updatedQuests = quests.map(q => {
      if (q.id === questId) {
        const nextTasks = q.tasks.map(t => t.id === taskId ? { ...t, completed: true } : t);
        const allDone = nextTasks.every(t => t.completed);
        updatedQuestTasks = nextTasks;
        if (allDone && q.status !== "COMPLETED") {
          questCompleted = true;
          xpToAward = q.xpReward;
          questTitle = q.title;
          updatedQuestStatus = "COMPLETED";
          return { ...q, tasks: nextTasks, status: "COMPLETED" as const };
        }
        return { ...q, tasks: nextTasks, status: "IN_PROGRESS" as const };
      }
      return q;
    });

    setQuests(updatedQuests);
    try {
      localStorage.setItem(`edu_quests_${activeUserId}`, JSON.stringify(updatedQuests));
    } catch (e) {}

    if (isSupabaseConfigured() && updatedQuestTasks.length > 0) {
      updateQuestProgressInDB(questId, activeUserId, updatedQuestTasks, updatedQuestStatus).catch(console.error);
    }

    if (questCompleted) {
      awardXP(xpToAward, `Quest Completed: ${questTitle}`, "quest");
      if (profile) {
        const updatedProf = { ...profile, completedQuests: profile.completedQuests + 1 };
        setProfile(updatedProf);
        try {
          localStorage.setItem(`edu_learning_profile_${activeUserId}`, JSON.stringify(updatedProf));
        } catch (e) {}
        if (isSupabaseConfigured()) saveLearningProfileToDB(updatedProf).catch(console.error);
      }
    } else {
      awardXP(10, "Quest Task Completed", "quest_task");
    }
  }

  function completeQuiz(subject: string, score: number, total: number) {
    if (!activeUserId || !profile) return;
    const accuracy = total > 0 ? (score / total) * 100 : 0;
    
    const totalAcc = (profile.quizAccuracy * profile.quizzesCompleted + accuracy) / (profile.quizzesCompleted + 1);
    const updatedProf = {
      ...profile,
      quizzesCompleted: profile.quizzesCompleted + 1,
      quizAccuracy: Math.round(totalAcc)
    };
    setProfile(updatedProf);
    try {
      localStorage.setItem(`edu_learning_profile_${activeUserId}`, JSON.stringify(updatedProf));
    } catch (e) {}

    if (isSupabaseConfigured()) {
      saveLearningProfileToDB(updatedProf).catch(console.error);
      saveQuizResultToDB({
        id: `qr-${Date.now()}`,
        studentId: activeUserId,
        topic: subject,
        score,
        total,
        accuracy: Math.round(accuracy),
        createdAt: new Date().toISOString()
      }).catch(console.error);
    }

    // Update skill
    const updatedSkills = skills.map(s => {
      if (s.subject === subject && accuracy > 70 && s.proficiency < 100) {
        const updatedSkill = { ...s, proficiency: Math.min(100, s.proficiency + 5), lastUpdated: new Date().toISOString() };
        if (isSupabaseConfigured()) saveSkillToDB(updatedSkill, activeUserId).catch(console.error);
        return updatedSkill;
      }
      return s;
    });
    setSkills(updatedSkills);
    try {
      localStorage.setItem(`edu_skills_${activeUserId}`, JSON.stringify(updatedSkills));
    } catch (e) {}

    awardXP(score * 10, `Completed ${subject} Quiz`, "quiz");
  }

  function unlockCosmetic(cosmeticId: string, cost: number): boolean {
    if (!activeUserId || !profile) return false;
    if (profile.arenaCoins < cost) return false;
    if (profile.unlockedCosmetics.includes(cosmeticId)) return true;

    const updatedProf = {
      ...profile,
      arenaCoins: profile.arenaCoins - cost,
      unlockedCosmetics: [...profile.unlockedCosmetics, cosmeticId]
    };
    setProfile(updatedProf);
    try {
      localStorage.setItem(`edu_learning_profile_${activeUserId}`, JSON.stringify(updatedProf));
    } catch (e) {}

    if (isSupabaseConfigured()) saveLearningProfileToDB(updatedProf).catch(console.error);
    return true;
  }

  function equipCosmetic(cosmeticId: string, type: "avatar" | "frame" | "background" | "title") {
    if (!activeUserId || !profile) return;
    const updates: Partial<LearningProfile> = {};
    if (type === "avatar") updates.avatarId = cosmeticId;
    if (type === "frame") updates.frameId = cosmeticId;
    if (type === "background") updates.backgroundId = cosmeticId;
    if (type === "title") {
      updates.titleId = cosmeticId;
      const cosmetic = defaultCosmetics.find(c => c.id === cosmeticId);
      if (cosmetic) updates.title = cosmetic.name;
    }
    const updatedProf = { ...profile, ...updates };
    setProfile(updatedProf);
    try {
      localStorage.setItem(`edu_learning_profile_${activeUserId}`, JSON.stringify(updatedProf));
    } catch (e) {}

    if (isSupabaseConfigured()) saveLearningProfileToDB(updatedProf).catch(console.error);
  }

  return (
    <LearningContext.Provider value={{
      profile, missions, quests, skills, achievements, xpEvents,
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
