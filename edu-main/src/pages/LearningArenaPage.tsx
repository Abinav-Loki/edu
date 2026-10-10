import { useState, useEffect } from "react";
import { useLearning } from "../context/LearningContext";
import { useCampus } from "../context/CampusContext";
import { useNavigate } from "react-router-dom";
import { isSupabaseConfigured } from "../lib/supabase";
import { fetchArenaProgressFromDB, saveArenaProgressToDB } from "../services/supabaseService";
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
  UserProgressState,
  SubjectWorld,
  TopicNode
} from "../data/learningArenaData";
import SubjectCardSelector from "../components/learning/SubjectCardSelector";
import FullMapModal from "../components/learning/FullMapModal";

export default function LearningArenaPage() {
  const navigate = useNavigate();
  const { currentUser } = useCampus();
  const { profile, missions, quests, achievements, completeMission, completeQuestTask, awardXP } = useLearning();

  const [activeTab, setActiveTab] = useState<"command" | "missions" | "skills" | "trophies" | "daily">("command");
  const [activeSubjectId, setActiveSubjectId] = useState<string>("dbms");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

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
    return initialUserProgress;
  });

  // Re-synchronize arena progress strictly for the active user identity on mount or user switch
  useEffect(() => {
    if (!currentUser?.id) {
      setUserProgress(initialUserProgress);
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
        setUserProgress(initialUserProgress);
      }
    } catch (e) {
      setUserProgress(initialUserProgress);
    }

    fetchArenaProgressFromDB(studentId).then((dbProgress) => {
      if (dbProgress && dbProgress.completedTopicIds) {
        setUserProgress(dbProgress);
      }
    }).catch(console.error);
  }, [currentUser?.id]);

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

  // Topic mission completion handler with strict idempotency
  const handleCompleteTopicMission = (subjectId: string, topicId: string, xpEarned: number) => {
    if (!currentUser?.id) return;
    const studentId = currentUser.id;

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

      return updatedState;
    });
  };


  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 lg:py-6 text-slate-800">
      
      {/* HERO SECTION */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Main Hero Card */}
        <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-[1.5rem] p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-white/60 relative overflow-hidden">
          <div className="flex-1 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-4">
              Gamified Interactive Worlds
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <h1 className="text-3xl font-black text-slate-800">Learning Arena</h1>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed max-w-md">
              Explore subject maps, unlock topics, complete missions, and level up your academic skills! ✨
            </p>
          </div>
          
          <div className="relative shrink-0 z-10 hidden sm:block">
            <div className="absolute -top-3 -left-12 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-indigo-100 text-xs font-bold text-slate-700 whitespace-nowrap animate-[bounce_3s_ease-in-out_infinite]">
              Let's conquer your missions! 🚀
            </div>
            <div className="w-36 h-36 rounded-2xl bg-gradient-to-tr from-indigo-50/70 to-purple-50/70 border border-indigo-100/50 p-2 shadow-sm flex items-center justify-center overflow-hidden">
              <img
                src="/ai_mascot.jpg"
                alt="Mascot"
                className="w-full h-full object-contain mix-blend-multiply drop-shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-60 z-0" />
        </div>

        {/* Level Card */}
        <div className="w-full lg:w-72 bg-white/70 backdrop-blur-xl rounded-[1.5rem] p-6 shadow-sm border border-white/60 flex flex-col justify-center relative overflow-hidden">
          <div className="font-bold text-slate-800 mb-4">Your Level</div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-16 bg-gradient-to-br from-amber-300 to-orange-500 rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/30 relative">
              <div className="absolute -top-1 w-full flex justify-center">
                <div className="w-6 h-1.5 bg-amber-200 rounded-full" />
              </div>
              {profile.level}
            </div>
            <div>
              <div className="font-bold text-slate-800 text-lg">Level {profile.level}</div>
              <div className="text-xs font-medium text-slate-500">{profile.title}</div>
            </div>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-right text-[10px] font-bold text-slate-400">
            {profile.totalXP} / {profile.totalXP - currentLevelXP + xpToNextLevel} XP
          </div>
        </div>
      </div>

      {/* TABS */}
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? "bg-white text-indigo-600 shadow-sm border border-slate-100" 
                : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-indigo-500" : "text-slate-400"}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      {activeTab === "command" && (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
          
          {/* 1. SUBJECT WORLDS CARD SELECTOR */}
          <SubjectCardSelector
            activeSubjectId={activeSubjectId}
            onSelectSubject={(id) => setActiveSubjectId(id)}
            onExploreMap={(id) => {
              setActiveSubjectId(id);
              setIsMapModalOpen(true);
            }}
            userProgress={userProgress}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column: Active Subject Overview & Missions */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              
              {/* Learning Map Preview Banner */}
              <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] border border-white/60 p-6 flex flex-col h-[380px] relative overflow-hidden group shadow-sm">
                <div className="flex items-center justify-between mb-4 z-10">
                  <div>
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Selected Subject
                    </span>
                    <h2 className="font-extrabold text-slate-800 text-xl flex items-center gap-2 mt-1">
                      <MapIcon className="w-5 h-5 text-sky-500" />
                      {activeSubject.name} Learning Map
                    </h2>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                      {activeCompletedIds.length} of {activeSubject.topics.length} topics completed
                    </p>
                  </div>

                  <button
                    onClick={() => setIsMapModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-md shadow-sky-600/30 transition-all flex items-center gap-2 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>EXPLORE MAP FULL-SCREEN</span>
                  </button>
                </div>

                {/* Map Viewport Preview */}
                <div className="flex-1 bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl relative overflow-hidden border border-sky-100 shadow-inner">
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
                        className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        Enter Interactive Map World <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Mission & Progress Bottom Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Current Mission Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] border border-white/60 p-6 flex flex-col shadow-sm">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-indigo-500" />
                    Current Mission
                  </h3>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                        <Gamepad2 className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-800 text-sm">
                            {activeCurrentTopic ? activeCurrentTopic.title : "All Mastered!"}
                          </h4>
                          <span className="text-[9px] font-bold bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded border border-indigo-100">
                            +{activeCurrentTopic?.xp || 50} XP
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {activeCurrentTopic?.description || "Select another subject world to continue learning!"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${questProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                        {completedTasks} / {totalTasks} completed
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsMapModalOpen(true)}
                    className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
                  >
                    Start Mission on Map <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Mission Progress Tasks */}
                <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] border border-white/60 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 text-sm">Mission Progress</h3>
                    <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                      {questProgress}%
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {activeQuest?.tasks?.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 group">
                        <button 
                          onClick={() => completeQuestTask(activeQuest.id, task.id)}
                          disabled={task.completed}
                          className="shrink-0 transition-transform hover:scale-110"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" />
                          )}
                        </button>
                        <span className={`text-sm font-medium ${task.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>
                          {task.description}
                        </span>
                      </div>
                    ))}
                    {!activeQuest?.tasks?.length && (
                      <div className="text-sm text-slate-500 italic">No tasks available.</div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: AI Companion, Quests, Leaderboard */}
            <div className="flex flex-col gap-6">
              
              {/* AI Companion Banner */}
              <div className="bg-indigo-50/80 rounded-2xl p-5 border border-indigo-100 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                <div className="absolute -left-10 -top-10 w-24 h-24 bg-indigo-200 rounded-full blur-2xl opacity-50" />
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-800 text-sm">AI Companion</h4>
                    <p className="text-[10px] font-medium text-slate-500">Need help with a topic?</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate("/tutor")}
                  className="w-full mt-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  Ask AI Tutor <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Daily Quests */}
              <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] border border-white/60 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-500" />
                    Daily Quests
                  </h3>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-full">12h 30m left</span>
                </div>
                
                <div className="space-y-3">
                  {missions.map((mission, idx) => (
                    <div key={mission.id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <button onClick={() => completeMission(mission.id)}>
                          {mission.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                        <span className={`text-xs font-medium ${mission.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>
                          {mission.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">+{mission.xpReward} XP</span>
                        {idx === 0 && <Gamepad2 className="w-3 h-3 text-indigo-400" />}
                        {idx === 1 && <MapIcon className="w-3 h-3 text-emerald-400" />}
                        {idx > 1 && <Trophy className="w-3 h-3 text-amber-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rewards & Streaks */}
              <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] border border-white/60 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-amber-500" />
                  Rewards & Streaks
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/50 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="text-lg font-black text-slate-800">{profile.streak}</span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500">Day Streak</span>
                  </div>
                  <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/50 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <span className="text-lg font-black text-slate-800">
                        {achievements.filter((a) => a.unlocked).length}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500">Badges Earned</span>
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] border border-white/60 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    Leaderboard <span className="text-[10px] font-medium text-slate-400 font-normal">(This Week)</span>
                  </h3>
                  <button className="text-[10px] font-bold text-sky-500 hover:text-sky-600">View All</button>
                </div>

                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Priya S", xp: 420, initial: "P", color: "bg-amber-100 text-amber-600" },
                    { rank: 2, name: currentUser?.name || "Arun Kumar", xp: 380, initial: currentUser?.name?.[0] || "A", color: "bg-sky-500 text-white", isMe: true },
                    { rank: 3, name: "Losh", xp: 350, initial: "L", color: "bg-orange-100 text-orange-600" },
                    { rank: 4, name: "Divya", xp: 300, initial: "D", color: "bg-pink-100 text-pink-600" },
                  ].map((user, idx) => (
                    <div key={idx} className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${user.isMe ? "bg-sky-50 border border-sky-100" : "hover:bg-slate-50"}`}>
                      <div className="w-5 text-center text-xs font-bold text-slate-400">
                        {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : user.rank}
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${user.color}`}>
                        {user.initial}
                      </div>
                      <div className={`text-xs font-bold flex-1 ${user.isMe ? "text-slate-800" : "text-slate-600"}`}>
                        {user.name}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500">
                        {user.xp} XP
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Fallback for other tabs */}
      {activeTab !== "command" && (
        <div className="bg-white/70 backdrop-blur-xl rounded-[1.5rem] border border-white/60 p-12 text-center shadow-sm animate-[fadeIn_0.3s_ease-out]">
          <h2 className="text-xl font-bold text-slate-800 mb-2 capitalize">{activeTab} Details</h2>
          <p className="text-slate-500">This section is synced with the {activeTab} service module.</p>
          <button 
            onClick={() => setActiveTab("command")}
            className="mt-6 px-6 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg hover:bg-indigo-100 transition-colors text-sm"
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
