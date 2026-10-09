import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  X,
  Star,
  Lock,
  CheckCircle2,
  ChevronDown,
  Plus,
  Minus,
  Maximize2,
  Sparkles,
  Gamepad2,
  PlayCircle,
  HelpCircle,
  Trophy,
  Zap,
  Target,
  Play,
  Clock
} from "lucide-react";
import {
  SubjectWorld,
  TopicNode,
  TopicStatus,
  UserProgressState,
  subjectWorlds,
  subjectDailyChallenges,
  SubjectDailyChallenge
} from "../../data/learningArenaData";
import TopicDetailPanel from "./TopicDetailPanel";
import MissionModal from "./MissionModal";

export interface FullMapModalProps {
  initialSubjectId: string;
  userProgress: UserProgressState;
  onClose: () => void;
  onCompleteTopicMission: (subjectId: string, topicId: string, xpEarned: number) => void;
}

// Base unscaled canvas dimensions for spacious floating islands
const BASE_WORLD_WIDTH = 3400;
const BASE_WORLD_HEIGHT = 1000;

// Deterministic Winding S-Curve Layout: 1 Quiz = 1 Floating Island
const getIslandCoordinates = (index: number) => {
  const startX = 260;
  const stepX = 275; // Generous 275px horizontal spacing ensures ZERO island overlap!
  const x = startX + index * stepX;

  // Staggered Y coordinates across top, middle, and bottom terrain
  const yPattern = [400, 240, 580, 750, 320, 660, 280, 540, 720, 360, 640];
  const y = yPattern[index % yPattern.length];

  return { x, y };
};

export default function FullMapModal({
  initialSubjectId,
  userProgress,
  onClose,
  onCompleteTopicMission,
}: FullMapModalProps) {
  const [currentSubjectId, setCurrentSubjectId] = useState(initialSubjectId);
  const [selectedTopic, setSelectedTopic] = useState<TopicNode | null>(null);
  const [activeMissionTopic, setActiveMissionTopic] = useState<TopicNode | null>(null);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  
  const [isChallengePanelOpen, setIsChallengePanelOpen] = useState(false);

  // 1. Zoom out map scale significantly (~60% desktop scale) so more of the world is visible at once
  const [zoomLevel, setZoomLevel] = useState(0.60);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 800 });

  // Measure container dimensions & adjust initial responsive zoom
  useEffect(() => {
    const updateSize = () => {
      if (scrollContainerRef.current) {
        const w = scrollContainerRef.current.clientWidth;
        const h = scrollContainerRef.current.clientHeight;
        setContainerSize({ width: w, height: h });

        // Responsive default zoom calculation: Desktop ~60%, Tablet ~66%, Mobile ~72%
        if (w >= 1200) {
          setZoomLevel((prev) => (prev === 0.72 || prev === 0.8 || prev === 0.6 ? 0.60 : prev));
        } else if (w >= 768) {
          setZoomLevel((prev) => (prev === 0.72 || prev === 0.8 || prev === 0.66 ? 0.66 : prev));
        } else {
          setZoomLevel((prev) => (prev === 0.72 || prev === 0.8 || prev === 0.72 ? 0.72 : prev));
        }
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [isChallengePanelOpen]);

  // Compute actual world dimensions to cover 100% of viewport with NO black gaps
  const worldWidth = Math.max(containerSize.width, BASE_WORLD_WIDTH * zoomLevel);
  const worldHeight = Math.max(containerSize.height, BASE_WORLD_HEIGHT * zoomLevel);

  // Active Subject World object & Subject Daily Challenge
  const currentSubject: SubjectWorld =
    subjectWorlds.find((s) => s.id === currentSubjectId) || subjectWorlds[0];
  
  const currentDailyChallenge: SubjectDailyChallenge =
    subjectDailyChallenges[currentSubjectId] || subjectDailyChallenges["dbms"];

  // User progress stats
  const completedIds = userProgress.completedTopicIds[currentSubjectId] || [];
  const currentMissionId = userProgress.currentMissionTopicId[currentSubjectId];
  const subjectXP = userProgress.subjectXP[currentSubjectId] || 0;

  const totalTopics = currentSubject.topics.length;
  const completedCount = completedIds.length;
  const progressPercent = Math.round((completedCount / totalTopics) * 100);

  // Center camera on current topic node on subject change or modal mount
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const currentTopicIndex = currentSubject.topics.findIndex((t) => t.id === currentMissionId);
    const validIndex = currentTopicIndex !== -1 ? currentTopicIndex : 0;
    const { x, y } = getIslandCoordinates(validIndex);

    const scaledX = x * zoomLevel;
    const scaledY = y * zoomLevel;

    const targetX = scaledX - container.clientWidth / 2;
    const targetY = scaledY - container.clientHeight / 2;

    const maxScrollX = Math.max(0, worldWidth - container.clientWidth);
    const maxScrollY = Math.max(0, worldHeight - container.clientHeight);

    container.scrollLeft = Math.min(Math.max(0, targetX), maxScrollX);
    container.scrollTop = Math.min(Math.max(0, targetY), maxScrollY);
  }, [currentSubjectId, currentMissionId, zoomLevel, containerSize, isChallengePanelOpen]);

  // Derive node status dynamically
  const getTopicStatus = (topic: TopicNode): TopicStatus => {
    if (completedIds.includes(topic.id)) return "COMPLETED";
    if (topic.id === currentMissionId) return "CURRENT";

    const allPrereqsMet = topic.prerequisites.every((reqId) =>
      completedIds.includes(reqId)
    );
    return allPrereqsMet ? "AVAILABLE" : "LOCKED";
  };

  const handleNodeClick = (topic: TopicNode) => {
    const status = getTopicStatus(topic);
    if (status === "LOCKED") return;
    setSelectedTopic(topic);
  };

  const handleStartMissionFromPanel = (topic: TopicNode) => {
    setSelectedTopic(null);
    setActiveMissionTopic(topic);
  };

  const handleStartDailyChallenge = () => {
    // Find target topic in current subject or fallback to active mission topic
    const target = currentSubject.topics.find((t) => t.id === currentDailyChallenge.targetTopicId)
      || currentSubject.topics.find((t) => t.id === currentMissionId)
      || currentSubject.topics[0];

    if (target) {
      handleStartMissionFromPanel(target);
    }
  };

  const handleCompleteMission = (topicId: string, xpEarned: number) => {
    setActiveMissionTopic(null);
    onCompleteTopicMission(currentSubjectId, topicId, xpEarned);
  };

  // Check if current daily challenge topic is completed
  const isChallengeCompleted = completedIds.includes(currentDailyChallenge.targetTopicId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 animate-[fadeIn_0.2s_ease-out]">
      
      {/* ─── TOP MAP NAVIGATION HEADER ─── */}
      <header className="shrink-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-sky-100 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 relative z-30 shadow-md">
        
        {/* Left: Back & Subject Dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Subject Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSubjectDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-slate-800/90 hover:bg-sky-100 border border-sky-200/80 dark:border-slate-700 text-xs font-bold text-sky-900 dark:text-white transition-colors shadow-xs"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
              <span className="truncate max-w-[140px] sm:max-w-none">{currentSubject.name}</span>
              <ChevronDown className="w-4 h-4 text-sky-600 dark:text-slate-400" />
            </button>

            {subjectDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 space-y-1">
                {subjectWorlds.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setCurrentSubjectId(s.id);
                      setSubjectDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                      s.id === currentSubjectId
                        ? "bg-sky-600 text-white"
                        : "text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">
                      {userProgress.completedTopicIds[s.id]?.length || 0}/{s.topics.length}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Progress & Level info */}
        <div className="hidden md:flex items-center gap-4 bg-sky-50/80 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-800 rounded-2xl px-4 py-1.5">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {currentSubject.shortName} • {progressPercent}% Completed ({completedCount}/{totalTopics} Islands)
          </div>
          <div className="w-32 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: XP Counter & Close */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-black shadow-xs">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{subjectXP} XP</span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ─── MAIN TWO-COLUMN WORKSPACE: FULL MAP (100% WIDTH DEFAULT) + SLIDE-IN DAILY CHALLENGE PANEL ─── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* ─── LEFT COLUMN: CONTINUOUS FLOATING ISLAND MAP ENVIRONMENT ─── */}
        <div
          ref={scrollContainerRef}
          className="flex-1 relative overflow-auto scrollbar-thin scrollbar-thumb-sky-300 dark:scrollbar-thumb-slate-700 bg-gradient-to-br from-sky-100 via-sky-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 cursor-grab active:cursor-grabbing transition-all duration-300"
        >
          {/* FLOATING DAILY CHALLENGE TOGGLE BUTTON (Visible when Panel is Closed) */}
          {!isChallengePanelOpen && (
            <button
              onClick={() => setIsChallengePanelOpen(true)}
              className="absolute top-4 right-4 z-30 sidebar-gradient text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/30 backdrop-blur-md text-xs font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer animate-[fadeIn_0.2s_ease-out]"
            >
              <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>✨ Daily Challenge</span>
            </button>
          )}

          {/* World Boundary Container */}
          <div
            className="relative overflow-hidden bg-gradient-to-br from-sky-200 via-sky-100 to-indigo-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
            style={{
              width: `${worldWidth}px`,
              height: `${worldHeight}px`,
            }}
          >
            {/* Background Map Graphic (Full Cover) */}
            <div className="absolute inset-0 bg-[url('/learning_map.jpg')] bg-cover bg-center opacity-90 pointer-events-none" />
            
            {/* Sky Atmosphere Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/15 via-transparent to-sky-900/10 pointer-events-none" />

            {/* Inner Canvas element transformed at zoomLevel scale */}
            <div
              className="relative"
              style={{
                width: `${BASE_WORLD_WIDTH}px`,
                height: `${BASE_WORLD_HEIGHT}px`,
                transform: `scale(${zoomLevel})`,
                transformOrigin: "0 0",
              }}
            >
              {/* SVG Connecting Path Lines between Islands */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                  <linearGradient id="completedPathGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#0EA5E9" />
                  </linearGradient>
                  <linearGradient id="availablePathGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>

                {currentSubject.topics.map((topic, index) => {
                  const status = getTopicStatus(topic);
                  const currentPos = getIslandCoordinates(index);

                  return topic.prerequisites.map((prereqId) => {
                    const prereqIndex = currentSubject.topics.findIndex((t) => t.id === prereqId);
                    if (prereqIndex === -1) return null;

                    const prereqPos = getIslandCoordinates(prereqIndex);
                    const isCompletedPath =
                      completedIds.includes(topic.id) && completedIds.includes(prereqId);
                    const isAvailablePath = status !== "LOCKED";

                    const x1 = prereqPos.x;
                    const y1 = prereqPos.y;
                    const x2 = currentPos.x;
                    const y2 = currentPos.y;
                    const cx1 = (x1 + x2) / 2;
                    const cy1 = y1;
                    const cx2 = (x1 + x2) / 2;
                    const cy2 = y2;

                    return (
                      <path
                        key={`${prereqId}-${topic.id}`}
                        d={`M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
                        fill="none"
                        stroke={
                          isCompletedPath
                            ? "url(#completedPathGrad)"
                            : isAvailablePath
                            ? "url(#availablePathGrad)"
                            : "#94A3B8"
                        }
                        strokeWidth={isCompletedPath ? 5 : isAvailablePath ? 4 : 2.5}
                        strokeDasharray={isAvailablePath || isCompletedPath ? "none" : "6 6"}
                        strokeOpacity={isCompletedPath ? 1 : isAvailablePath ? 0.9 : 0.5}
                      />
                    );
                  });
                })}
              </svg>

              {/* FLOATING ISLAND NODES (1 Quiz = 1 Spacious Floating Island) */}
              <div className="absolute inset-0 z-20 pointer-events-auto">
                {currentSubject.topics.map((topic, index) => {
                  const status = getTopicStatus(topic);
                  const isCompleted = status === "COMPLETED";
                  const isCurrent = status === "CURRENT";
                  const isAvailable = status === "AVAILABLE";
                  const isLocked = status === "LOCKED";

                  const { x, y } = getIslandCoordinates(index);

                  return (
                    <div
                      key={topic.id}
                      onClick={() => handleNodeClick(topic)}
                      className={`absolute flex flex-col items-center select-none transition-all duration-300 group ${
                        isLocked ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:scale-105 hover:z-30"
                      }`}
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {/* ─── FLOATING ISLAND CONTAINER (3D Game Island Style) ─── */}
                      <div className="relative flex flex-col items-center">
                        
                        {/* 1. TOP BADGE OVERLAY */}
                        {isCurrent && (
                          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[10px] font-black px-3.5 py-1 rounded-full mb-2 shadow-xl shadow-sky-500/50 animate-bounce whitespace-nowrap flex items-center gap-1.5 border border-sky-200">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                            <span>★ ACTIVE MISSION</span>
                          </div>
                        )}

                        {isAvailable && (
                          <div className="bg-gradient-to-r from-indigo-600 to-sky-600 text-white text-[10px] font-black px-3.5 py-1 rounded-full mb-2 shadow-lg shadow-indigo-500/40 whitespace-nowrap flex items-center gap-1.5 border border-indigo-300 animate-pulse">
                            <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
                            <span>🔓 UNLOCKED QUIZ</span>
                          </div>
                        )}

                        {isCompleted && (
                          <div className="bg-emerald-600 text-white text-[9.5px] font-extrabold px-3 py-0.5 rounded-full mb-1.5 shadow-md whitespace-nowrap flex items-center gap-1 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                            <span>✓ QUIZ MASTERED</span>
                          </div>
                        )}

                        {isLocked && (
                          <div className="bg-slate-200/90 text-slate-600 dark:bg-slate-800/90 dark:text-slate-400 text-[9px] font-bold px-2.5 py-0.5 rounded-full mb-1.5 border border-slate-300/50 whitespace-nowrap flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>QUIZ LOCKED</span>
                          </div>
                        )}

                        {/* 2. FLOATING ISLAND CARD PLATFORM */}
                        <div
                          className={`w-56 p-4 rounded-3xl font-black text-xs shadow-2xl border backdrop-blur-xl flex flex-col items-center text-center gap-2 transition-all relative overflow-hidden ${
                            isCompleted
                              ? "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white border-emerald-300 shadow-emerald-500/30 ring-2 ring-emerald-400/50"
                              : isCurrent
                              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-sky-400 ring-4 ring-sky-400/50 shadow-2xl shadow-sky-500/40"
                              : isAvailable
                              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-indigo-500 ring-4 ring-indigo-400/30 shadow-2xl hover:border-sky-400"
                              : "bg-white/80 dark:bg-slate-900/80 text-slate-400 border border-slate-300/80"
                          }`}
                        >
                          {/* Island Number Tag */}
                          <div className="text-[10px] font-extrabold tracking-wider uppercase opacity-80 flex items-center gap-1">
                            <span>Island #{index + 1}</span>
                          </div>

                          {/* Title */}
                          <div className="flex items-center justify-center gap-2 text-sm font-black leading-snug">
                            <span>{topic.shortTitle}</span>
                            {isCompleted && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                            {isCurrent && <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />}
                            {isAvailable && <PlayCircle className="w-4 h-4 text-indigo-500 shrink-0" />}
                            {isLocked && <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                          </div>

                          {/* Description */}
                          <p className={`text-[11px] font-medium leading-tight line-clamp-2 ${isCompleted ? "text-emerald-100" : "text-slate-500 dark:text-slate-400"}`}>
                            {topic.title}
                          </p>

                          {/* ─── QUIZ ACTION BUTTON ─── */}
                          {isCurrent && (
                            <div className="w-full mt-1 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-black rounded-xl shadow-md flex items-center justify-center gap-1.5">
                              <span>▶ START QUIZ (+{topic.xp} XP)</span>
                            </div>
                          )}

                          {isAvailable && (
                            <div className="w-full mt-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black rounded-xl shadow-md flex items-center justify-center gap-1.5">
                              <span>⚡ PLAY QUIZ (+{topic.xp} XP)</span>
                            </div>
                          )}

                          {isCompleted && (
                            <div className="text-[10px] font-extrabold opacity-95 text-emerald-100 bg-emerald-600/60 px-3 py-1 rounded-lg">
                              ✓ Mastered • 100% Score
                            </div>
                          )}

                          {isLocked && (
                            <div className="text-[10px] font-medium text-slate-400 italic">
                              Complete Island #{index} to unlock
                            </div>
                          )}
                        </div>

                        {/* 3. ISLAND RATING STARS & FOOTER */}
                        {isCompleted && (
                          <div className="flex gap-1 mt-1.5 bg-white/95 dark:bg-slate-900/95 rounded-full px-3 py-0.5 border border-emerald-300 shadow-md backdrop-blur-sm">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          </div>
                        )}

                        {(isCurrent || isAvailable) && (
                          <div className="flex gap-1 mt-1.5 bg-white/95 dark:bg-slate-900/95 rounded-full px-3 py-0.5 border border-indigo-200 dark:border-slate-700 shadow-md backdrop-blur-sm">
                            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-[9.5px] font-bold text-indigo-600 dark:text-indigo-400">
                              1 Mission Quiz Ready
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: SUBJECT-SPECIFIC DAILY CHALLENGE PANEL (TOGGLEABLE SLIDE-IN DRAWER) ─── */}
        {isChallengePanelOpen && (
          <aside className="fixed lg:relative inset-y-0 right-0 z-40 w-full sm:w-96 lg:w-80 xl:w-96 shrink-0 flex flex-col sidebar-gradient rounded-l-[20px] lg:rounded-[20px] shadow-2xl shadow-indigo-500/20 my-0 lg:my-3 mr-0 lg:mr-3 border border-white/30 backdrop-blur-md p-5 overflow-y-auto text-white animate-[slideInRight_0.3s_ease-out]">
            
            {/* Header Badge & Close button */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/35 backdrop-blur-md text-amber-300 text-xs font-black shadow-sm">
                <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>✨ DAILY CHALLENGE</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-white bg-white/20 px-2.5 py-1 rounded-lg border border-white/30 backdrop-blur-xs">
                  Today
                </span>
                <button
                  onClick={() => setIsChallengePanelOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors border border-white/30 cursor-pointer"
                  title="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subject Title & Challenge Card */}
            <div className="p-5 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md shadow-xl flex flex-col gap-3 relative overflow-hidden mb-4">
              
              {/* Subtle Glow Accent */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/25 border border-white/40 flex items-center justify-center shadow-md backdrop-blur-sm shrink-0">
                  <Trophy className="w-5 h-5 text-amber-300 fill-amber-300/30" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-black text-amber-300 uppercase tracking-widest">
                    {currentSubject.name}
                  </div>
                  <h3 className="text-xl font-black text-white leading-tight drop-shadow-xs">
                    {currentDailyChallenge.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs font-semibold text-white/95 leading-relaxed mt-1">
                {currentDailyChallenge.description}
              </p>

              {/* Details Pills: XP Reward & Time */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="bg-white/20 border border-white/35 rounded-xl p-2.5 flex items-center gap-2 backdrop-blur-md shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/30 border border-amber-300/50 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-amber-200 uppercase tracking-wider">REWARD</div>
                    <div className="text-xs font-black text-amber-300 drop-shadow-xs">+{currentDailyChallenge.xpReward} XP</div>
                  </div>
                </div>

                <div className="bg-white/20 border border-white/35 rounded-xl p-2.5 flex items-center gap-2 backdrop-blur-md shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-white/25 border border-white/40 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-sky-100 uppercase tracking-wider">TIME EST.</div>
                    <div className="text-xs font-black text-white">~{currentDailyChallenge.estimatedMinutes} Mins</div>
                  </div>
                </div>
              </div>

              {/* Start Mission CTA Button (Vibrant Crystal Clear CTA) */}
              <button
                onClick={handleStartDailyChallenge}
                className={`w-full mt-2 py-3.5 px-4 rounded-xl text-xs font-black shadow-2xl backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 border-2 border-white/90 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                  isChallengeCompleted
                    ? "bg-emerald-500 text-white hover:bg-emerald-400 border-emerald-300 shadow-emerald-900/40"
                    : "bg-white text-indigo-950 hover:bg-sky-50 shadow-black/20 ring-4 ring-white/20"
                }`}
              >
                {isChallengeCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span className="font-black text-white text-xs">Replay Mission (+{currentDailyChallenge.xpReward} XP)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-indigo-950 text-indigo-950" />
                    <span className="font-black text-indigo-950 text-xs">Start Mission (+{currentDailyChallenge.xpReward} XP)</span>
                  </>
                )}
              </button>
            </div>

            {/* Subject Mission Overview Card */}
            <div className="p-4 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md shadow-lg space-y-3 mb-4">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-white" />
                <span>Subject Overview</span>
              </h4>

              <div className="space-y-2 text-xs font-bold">
                <div className="flex items-center justify-between text-white">
                  <span className="text-white/80">Total Islands</span>
                  <span className="font-black text-white">{totalTopics} Quizzes</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span className="text-white/80">Mastered</span>
                  <span className="font-black text-emerald-300">{completedCount} Completed</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span className="text-white/80">Subject XP</span>
                  <span className="font-black text-amber-300">{subjectXP} XP</span>
                </div>
              </div>
            </div>

            {/* Bottom Motivational Footer Card */}
            <div className="mt-auto p-4 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md shadow-lg cursor-default">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="font-extrabold text-xs leading-snug text-white">
                    Keep your momentum!<br />Daily streak active 🔥
                  </p>
                  <p className="text-amber-300 text-[10px] mt-1 font-extrabold">
                    Earn +{currentDailyChallenge.xpReward} XP today!
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/25 border border-white/40 flex items-center justify-center text-amber-300 shadow-md shrink-0">
                  <Sparkles className="w-5 h-5 fill-amber-300" />
                </div>
              </div>
            </div>

          </aside>
        )}

      </div>


      {/* ─── MAP CONTROLS OVERLAY (Zoom +, -, Center) ─── */}
      <div className="absolute bottom-6 left-6 z-30 flex flex-col gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-sky-100 dark:border-slate-800 p-1.5 rounded-2xl shadow-xl">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 0.08, 1.0))}
          className="w-9 h-9 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors"
          title="Zoom In"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 0.08, 0.4))}
          className="w-9 h-9 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            const defaultZoom = containerSize.width >= 1200 ? 0.60 : containerSize.width >= 768 ? 0.66 : 0.72;
            setZoomLevel(defaultZoom);
            const container = scrollContainerRef.current;
            if (container) {
              const currentTopicIndex = currentSubject.topics.findIndex((t) => t.id === currentMissionId);
              const validIndex = currentTopicIndex !== -1 ? currentTopicIndex : 0;
              const { x, y } = getIslandCoordinates(validIndex);
              container.scrollLeft = Math.max(0, x * defaultZoom - container.clientWidth / 2);
              container.scrollTop = Math.max(0, y * defaultZoom - container.clientHeight / 2);
            }
          }}
          className="w-9 h-9 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors"
          title="Center Current Mission"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* ─── TOPIC DETAIL PANEL MODAL ─── */}
      {selectedTopic && (
        <TopicDetailPanel
          topic={selectedTopic}
          status={getTopicStatus(selectedTopic)}
          onClose={() => setSelectedTopic(null)}
          onStartMission={handleStartMissionFromPanel}
        />
      )}

      {/* ─── MISSION QUIZ MODAL ─── */}
      {activeMissionTopic && (
        <MissionModal
          topic={activeMissionTopic}
          onClose={() => setActiveMissionTopic(null)}
          onCompleteMission={handleCompleteMission}
        />
      )}
    </div>
  );
}


