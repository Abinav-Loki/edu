import { useState, useEffect } from "react";
import { useLearning } from "../context/LearningContext";
import { useCampus } from "../context/CampusContext";
import { useNavigate } from "react-router-dom";
import { isSupabaseConfigured } from "../lib/supabase";
import { 
  fetchArenaProgressFromDB, 
  saveArenaProgressToDB,
  saveUserActivityProgressToDB,
  saveQuizAttemptToDB,
  saveNotificationToDB
} from "../services/supabaseService";
import {
  Gamepad2,
  Map as MapIcon,
  ClipboardList,
  TreeDeciduous,
  Trophy,
  CalendarDays,
  Star,
  Bot,
  CheckCircle2,
  Circle,
  ChevronRight,
  Flame,
  Award,
  Target,
  Play
} from "lucide-react";
import {
  subjectWorlds,
  initialUserProgress,
  freshUserProgress,
  UserProgressState,
  SubjectWorld,
  TopicNode
} from "../data/learningArenaData";
import SubjectCardSelector from "../components/learning/SubjectCardSelector";
import FullMapModal from "../components/learning/FullMapModal";
import { getFrameById } from "../data/avatarFramesData";

export default function LearningArenaPage() {
  const navigate = useNavigate();
  const { currentUser } = useCampus();
  const { profile, missions, quests, achievements, completeMission, completeQuestTask, awardXP } = useLearning();

  const [activeTab, setActiveTab] = useState<"command" | "missions" | "skills" | "trophies" | "daily">("command");
  const [activeSubjectId, setActiveSubjectId] = useState<string>("dbms");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const isDemo = currentUser?.isDemo !== false;
  const baselineProgress = isDemo ? initialUserProgress : freshUserProgress;

  // Initialize progress from user-isolated localStorage synchronously so page refreshes never reset
  const [userProgress, setUserProgress] = useState<UserProgressState>(() => {
    try {
      if (currentUser?.id) {
        const localKey = `edu_arena_progress_${currentUser.id}`;
        const saved = localStorage.getItem(localKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.completedTopicIds) return parsed;
        }
      }
    } catch (e) {
      console.warn("Error reading arena progress from localStorage:", e);
    }
    return baselineProgress;
  });

  // Re-synchronize arena progress strictly for the active user identity on mount or user switch
  useEffect(() => {
    if (!currentUser?.id) {
      setUserProgress(baselineProgress);
      return;
    }
    const studentId = currentUser.id;
    const localKey = `edu_arena_progress_${studentId}`;
    try {
      const saved = localStorage.getItem(localKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completedTopicIds) setUserProgress(parsed);
      } else {
        setUserProgress(baselineProgress);
      }
    } catch (e) {
      setUserProgress(baselineProgress);
    }

    fetchArenaProgressFromDB(studentId).then((dbProgress) => {
      if (dbProgress && dbProgress.completedTopicIds) {
        setUserProgress(dbProgress);
      }
    }).catch(console.error);
  }, [currentUser?.id, baselineProgress]);

  if (!currentUser || !profile) {
    return (
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
        <div className="max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Learning Arena</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Please sign in with a student or staff account to access your personal learning roadmap and track XP.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  const xpToNextLevel = 150;
  const currentLevelXP = profile.totalXP % 150;
  const progressPercent = (currentLevelXP / xpToNextLevel) * 100;

  // Active Quest info from LearningContext
  const activeQuest = quests.find((q) => q.status !== "COMPLETED") || quests[0];
  const completedTasks = activeQuest?.tasks?.filter((t) => t.completed)?.length || 0;
  const totalTasks = activeQuest?.tasks?.length || 1;
  const questProgress = Math.round((completedTasks / totalTasks) * 100);

  // Active Subject World object
  const activeSubject: SubjectWorld =
    subjectWorlds.find((s) => s.id === activeSubjectId) || subjectWorlds[0];

  // Subject topic status derivation
  const activeCompletedIds = userProgress.completedTopicIds[activeSubjectId] || [];
  const activeCurrentTopicId = userProgress.currentMissionTopicId[activeSubjectId];
  const activeCurrentTopic =
    activeSubject.topics.find((t) => t.id === activeCurrentTopicId) || activeSubject.topics[0];

  // Topic mission completion handler with strict idempotency & error guard
  const handleCompleteTopicMission = (subjectId: string, topicId: string, xpEarned: number) => {
    if (!currentUser?.id) return;
    const studentId = currentUser.id;

    // Strict Guard: If error occurred or 0 XP earned, do not award XP or advance completed state
    if (xpEarned <= 0) {
      return;
    }

    // Guard: Prevent double-awarding XP if topic is already completed
    const currentCompleted = userProgress.completedTopicIds[subjectId] || [];
    if (currentCompleted.includes(topicId)) {
      return;
    }

    // Award XP to user profile & gamification engine
    if (awardXP) {
      const subject = subjectWorlds.find((s) => s.id === subjectId);
      awardXP(xpEarned, `Mastered ${subject?.name || subjectId} Mission`, "learning_arena");
    }

    setUserProgress((prev) => {
      const subject = subjectWorlds.find((s) => s.id === subjectId);
      if (!subject) return prev;

      const updatedCompleted = [...(prev.completedTopicIds[subjectId] || []), topicId];

      // Find next unlocked topic in progression
      let nextCurrentTopicId = prev.currentMissionTopicId[subjectId];
      const currentIndex = subject.topics.findIndex((t) => t.id === topicId);
      if (currentIndex !== -1 && currentIndex + 1 < subject.topics.length) {
        nextCurrentTopicId = subject.topics[currentIndex + 1].id;
      }

      const updatedXP = (prev.subjectXP[subjectId] || 0) + xpEarned;

      const updatedState: UserProgressState = {
        completedTopicIds: {
          ...prev.completedTopicIds,
          [subjectId]: updatedCompleted,
        },
        currentMissionTopicId: {
          ...prev.currentMissionTopicId,
          [subjectId]: nextCurrentTopicId,
        },
        subjectXP: {
          ...prev.subjectXP,
          [subjectId]: updatedXP,
        },
      };

      // Instantly save to user-specific localStorage & Supabase
      saveArenaProgressToDB(studentId, updatedState).catch(console.error);

      // Persist to user_progress table
      saveUserActivityProgressToDB({
        id: `prog_topic_${studentId}_${topicId}`,
        userId: studentId,
        activityId: topicId,
        activityType: "topic_mission",
        status: "completed",
        progressPercentage: 100,
        xpEarned,
        score: Math.round(xpEarned / 20),
        total: 5,
        completedAt: new Date().toISOString()
      }).catch(console.warn);

      // Persist to quiz_attempts table
      saveQuizAttemptToDB({
        id: `qa_${Date.now()}_${topicId}`,
        studentId,
        topicId,
        topicTitle: subject.topics?.find(t => t.id === topicId)?.title || topicId,
        score: Math.round(xpEarned / 20),
        totalQuestions: 5,
        xpEarned,
        accuracy: Math.round((Math.round(xpEarned / 20) / 5) * 100),
        createdAt: new Date().toISOString()
      }).catch(console.warn);

      // Emit real-time notification
      saveNotificationToDB({
        id: `notif_arena_${Date.now()}`,
        recipientId: studentId,
        role: "student",
        title: "Topic Mission Mastered!",
        message: `You completed '${subject.topics?.find(t => t.id === topicId)?.title || topicId}' with ${Math.round(xpEarned / 20)}/5 correct answers and earned +${xpEarned} XP!`,
        type: "mission",
        read: false,
        link: "/learning-arena"
      }).catch(console.warn);

      return updatedState;
    });
  };

  // Profile frame derivation
  const currentFrameId = profile.frameId || "fr-1";
  const equippedFrame = getFrameById(currentFrameId);
  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A";

  const userXP = profile.totalXP;
  const leaderboardUsers = [
    { rank: 1, name: "Priya S", xp: Math.max(520, userXP + 40), initial: "P", color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
    { rank: 2, name: currentUser?.name || "Arun Kumar", xp: userXP, initial: userInitial, color: "bg-indigo-600 text-white", isMe: true },
    { rank: 3, name: "Loshith V", xp: Math.max(280, userXP - 30), initial: "L", color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
    { rank: 4, name: "Divya R", xp: Math.max(210, userXP - 80), initial: "D", color: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300" },
    { rank: 5, name: "Karthik M", xp: Math.max(160, userXP - 130), initial: "K", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  ].sort((a, b) => b.xp - a.xp).map((u, idx) => ({ ...u, rank: idx + 1 }));

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 lg:py-6 text-slate-800 dark:text-slate-100">
      
      {/* ─── HERO SECTION: BALANCED 2-COLUMN LAYOUT ─── */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6 items-start">
        
        {/* Left Column: Hero Card on top + Daily Quests & Rewards Streaks filling the gap */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          
          {/* Main Hero Card */}
          <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] p-6 lg:p-7 flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-white/60 dark:border-slate-800 relative overflow-hidden w-full">
            <div className="flex-1 z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
                Gamified Interactive Worlds
              </div>
              <div className="flex items-center gap-3.5 mb-2.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">Learning Arena</h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm leading-relaxed max-w-md">
                Explore subject maps, unlock topics, complete missions, and level up your academic skills! ✨
              </p>

              <div className="flex flex-wrap gap-2.5 mt-4">
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-black shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Explore Map Full-Screen</span>
                </button>
              </div>
            </div>
            
            <div className="relative shrink-0 z-10 hidden sm:block">
              <div className="absolute -top-3 -left-10 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border border-indigo-100 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap animate-[bounce_3s_ease-in-out_infinite]">
                Let's conquer your missions! 🚀
              </div>
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-indigo-50/70 to-purple-50/70 dark:from-slate-800 dark:to-slate-750 border border-indigo-100/50 dark:border-slate-700 p-2 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src="/ai_mascot.jpg"
                  alt="Mascot"
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal drop-shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-100 dark:bg-indigo-950/40 rounded-full blur-3xl opacity-60 z-0 pointer-events-none" />
          </div>

          {/* IN THIS GAP: Daily Quests Card & Rewards/Streaks Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Daily Quests Card */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-500" />
                    <span>Daily Quests</span>
                  </h3>
                  <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800">
                    12h 30m left
                  </span>
                </div>
                
                <div className="space-y-2">
                  {missions.map((mission, idx) => (
                    <div
                      key={mission.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-100 dark:hover:border-slate-700/60 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button onClick={() => completeMission(mission.id)} className="cursor-pointer shrink-0">
                          {mission.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 hover:text-indigo-500" />
                          )}
                        </button>
                        <span className={`text-xs font-medium truncate ${mission.completed ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-700 dark:text-slate-200"}`}>
                          {mission.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                          +{mission.xpReward} XP
                        </span>
                        {idx === 0 && <Gamepad2 className="w-3 h-3 text-indigo-400" />}
                        {idx === 1 && <MapIcon className="w-3 h-3 text-emerald-400" />}
                        {idx > 1 && <Trophy className="w-3 h-3 text-amber-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rewards & Streaks Card */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Rewards & Streaks</span>
                  </h3>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    🔥 Active
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-amber-50/60 dark:bg-amber-950/40 rounded-xl p-3 border border-amber-100 dark:border-amber-900/50 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                      <span className="text-xl font-black text-slate-800 dark:text-white">{profile.streak}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Day Streak</span>
                  </div>
                  <div className="bg-amber-50/60 dark:bg-amber-950/40 rounded-xl p-3 border border-amber-100 dark:border-amber-900/50 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <span className="text-xl font-black text-slate-800 dark:text-white">
                        {achievements.filter((a) => a.unlocked).length}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Badges Earned</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Longest Streak</span>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{profile.longestStreak || profile.streak} Days 🔥</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* TOP RIGHT COLUMN: LEVEL CARD + LEADERBOARD DIRECTLY BELOW IT */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
          
          {/* Level Card with Equipped Avatar Frame */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-center relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-slate-800 dark:text-white text-sm">Your Level</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                ⭐ {profile.totalXP} XP
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              {/* User Avatar with equipped frame! */}
              <div className="relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-black transition-all ${equippedFrame.ringClasses} ${equippedFrame.avatarBg}`}>
                  {userInitial}
                </div>
                <div className="absolute -bottom-1 -right-1 text-xs select-none">
                  {equippedFrame.emoji}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-slate-800 dark:text-white text-base">Level {profile.level}</div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{profile.title}</div>
                <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 truncate mt-0.5 flex items-center gap-1">
                  <span>Frame:</span>
                  <span className="truncate">{equippedFrame.name}</span>
                </div>
              </div>
            </div>

            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1.5">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
              <span>To Level {profile.level + 1}</span>
              <span>{currentLevelXP} / {xpToNextLevel} XP</span>
            </div>
          </div>

          {/* LEADERBOARD CARD (POSITIONED ON TOP RIGHT DIRECTLY BELOW THE LEVEL) */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-black text-slate-800 dark:text-white text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Leaderboard</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-normal">(This Week)</span>
              </h3>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            </div>

            <div className="space-y-2">
              {leaderboardUsers.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                    user.isMe
                      ? "bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 shadow-2xs"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="w-5 text-center text-xs font-black text-slate-500 dark:text-slate-400">
                    {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : `#${user.rank}`}
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${user.isMe ? equippedFrame.ringClasses : ""} ${user.color}`}>
                    {user.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-black truncate ${user.isMe ? "text-indigo-900 dark:text-indigo-200" : "text-slate-700 dark:text-slate-300"}`}>
                      {user.name} {user.isMe && <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold">(You)</span>}
                    </div>
                  </div>
                  <div className="text-[11px] font-black text-amber-600 dark:text-amber-400 whitespace-nowrap">
                    {user.xp} XP
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ─── TABS NAVIGATION (Frames Shop removed) ─── */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: "command", label: "Command (Map Worlds)", icon: MapIcon },
          { id: "missions", label: "Missions", icon: ClipboardList },
          { id: "skills", label: "Skill Tree", icon: TreeDeciduous },
          { id: "trophies", label: "Trophies", icon: Trophy },
          { id: "daily", label: "Daily Challenges", icon: CalendarDays },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id 
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700" 
                : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-indigo-500 dark:text-indigo-400" : "text-slate-400"}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── MAIN CONTENT AREA: COMMAND TAB ─── */}
      {activeTab === "command" && (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
          
          {/* 1. LEARNING MAP PREVIEW BANNER (DISPLAYED FIRST) */}
          <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] border border-white/60 dark:border-slate-800 p-6 flex flex-col h-[380px] relative overflow-hidden group shadow-sm">
            <div className="flex items-center justify-between mb-4 z-10">
              <div>
                <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-full uppercase tracking-wider border border-sky-100 dark:border-sky-800">
                  Selected Subject
                </span>
                <h2 className="font-extrabold text-slate-800 dark:text-white text-xl flex items-center gap-2 mt-1">
                  <MapIcon className="w-5 h-5 text-sky-500" />
                  {activeSubject.name} Learning Map
                </h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {activeCompletedIds.length} of {activeSubject.topics.length} topics completed
                </p>
              </div>

              <button
                onClick={() => setIsMapModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md shadow-sky-600/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>EXPLORE MAP FULL-SCREEN</span>
              </button>
            </div>

            {/* Map Viewport Preview */}
            <div className="flex-1 bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl relative overflow-hidden border border-sky-100 dark:border-slate-700 shadow-inner">
              <div className="absolute inset-0 bg-[url('/learning_map.jpg')] bg-cover bg-center opacity-90" />
              <div className="absolute inset-0 bg-sky-950/10 pointer-events-none" />
              
              {/* Topic Nodes Preview */}
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <div className="z-10 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white p-6 rounded-3xl backdrop-blur-md border border-white/80 dark:border-slate-700 shadow-2xl max-w-md">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 flex items-center justify-center mx-auto mb-3">
                    <MapIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-lg mb-1">{activeSubject.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-4">
                    Current Mission: <span className="text-sky-600 dark:text-sky-300 font-bold">{activeCurrentTopic?.title}</span>
                  </p>
                  <button
                    onClick={() => setIsMapModalOpen(true)}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Enter Interactive Map World <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. YOUR LEARNING WORLDS (POSITIONED BELOW THE LEARNING MAP!) */}
          <SubjectCardSelector
            activeSubjectId={activeSubjectId}
            onSelectSubject={(id) => setActiveSubjectId(id)}
            onExploreMap={(id) => {
              setActiveSubjectId(id);
              setIsMapModalOpen(true);
            }}
            userProgress={userProgress}
          />

          {/* 3. MISSIONS & AI COMPANION WORKSPACE (CLEAN 3-CARD BALANCED GRID) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Current Mission Card */}
            <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] border border-white/60 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-indigo-500" />
                  <span>Current Mission</span>
                </h3>
                
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800">
                    <Gamepad2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">
                        {activeCurrentTopic ? activeCurrentTopic.title : "All Mastered!"}
                      </h4>
                      <span className="text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800 shrink-0">
                        +{activeCurrentTopic?.xp || 50} XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {activeCurrentTopic?.description || "Select another subject world to continue learning!"}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>Topic Progress</span>
                    <span>{questProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${questProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsMapModalOpen(true)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Start Mission on Map <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mission Progress Tasks */}
            <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] border border-white/60 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Mission Tasks</h3>
                  <div className="w-9 h-9 rounded-full border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 flex items-center justify-center text-[10px] font-black text-indigo-700 dark:text-indigo-300">
                    {questProgress}%
                  </div>
                </div>
                
                <div className="space-y-2.5">
                  {activeQuest?.tasks?.map((task) => (
                    <div key={task.id} className="flex items-center gap-2.5 group">
                      <button 
                        onClick={() => completeQuestTask(activeQuest.id, task.id)}
                        disabled={task.completed}
                        className="shrink-0 transition-transform hover:scale-110 cursor-pointer"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-400" />
                        )}
                      </button>
                      <span className={`text-xs font-medium ${task.completed ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-700 dark:text-slate-200"}`}>
                        {task.description}
                      </span>
                    </div>
                  ))}
                  {!activeQuest?.tasks?.length && (
                    <div className="text-xs text-slate-500 italic">No tasks available.</div>
                  )}
                </div>
              </div>

              <div className="pt-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
                {completedTasks} of {totalTasks} tasks completed
              </div>
            </div>

            {/* AI Companion Banner */}
            <div className="bg-indigo-50/80 dark:bg-indigo-950/40 rounded-[1.5rem] p-6 border border-indigo-100 dark:border-indigo-900/60 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute -left-10 -top-10 w-28 h-28 bg-indigo-200 dark:bg-indigo-800/30 rounded-full blur-2xl opacity-50 pointer-events-none" />
              
              <div>
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-slate-700">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">AI Copilot Companion</h4>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Instant mission guidance</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed relative z-10 mb-4">
                  Stuck on a tricky concept or mission problem? Your AI tutor is primed with personalized hints and step-by-step breakdowns!
                </p>
              </div>

              <button 
                onClick={() => navigate("/tutor")}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer relative z-10"
              >
                <span>Ask AI Tutor</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Fallback for other tabs */}
      {activeTab !== "command" && (
        <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] border border-white/60 dark:border-slate-800 p-12 text-center shadow-sm animate-[fadeIn_0.3s_ease-out]">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 capitalize">{activeTab} Details</h2>
          <p className="text-slate-500 dark:text-slate-400">This section is synced with the {activeTab} service module.</p>
          <button 
            onClick={() => setActiveTab("command")}
            className="mt-6 px-6 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg hover:bg-indigo-100 transition-colors text-sm cursor-pointer"
          >
            Return to Map
          </button>
        </div>
      )}

      {/* ─── FULL MAP OVERLAY MODAL ─── */}
      {isMapModalOpen && (
        <FullMapModal
          initialSubjectId={activeSubjectId}
          userProgress={userProgress}
          onClose={() => setIsMapModalOpen(false)}
          onCompleteTopicMission={handleCompleteTopicMission}
        />
      )}

    </div>
  );
}
