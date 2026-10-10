import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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

// Base unscaled canvas dimensions for spacious floating islands (16:9 widescreen proportions)
const BASE_WORLD_WIDTH = 2400;
const BASE_WORLD_HEIGHT = 1350;

// Non-overlapping coordinates with generous clearance (min ~300px to 520px center distance, zero overlap)
const ISLAND_COORDINATES = [
  // 1: Dragon Cave Sanctuary (volcano base & dragon on lower left)
  { x: 300, y: 780 },
  // 2: Pine Grove Summit (floating green isle top-left)
  { x: 580, y: 300 },
  // 3: Stone Arch Portal & Ancient Steps
  { x: 800, y: 760 },
  // 4: Academic Grand Castle Royal Gates
  { x: 1120, y: 480 },
  // 5: Village Isle Windmills
  { x: 1220, y: 960 },
  // 6: Village Central Market & Pier
  { x: 1600, y: 1060 },
  // 7: Bridge to Waterfall Waypoint
  { x: 1940, y: 900 },
  // 8: Data Waterfall Island Platform
  { x: 2200, y: 640 },
  // 9: Data Crystal Summit
  { x: 2180, y: 240 },
  // 10: Library Isle Great Codex Plaza
  { x: 1780, y: 300 },
  // 11: Celestial Observatory Dome
  { x: 1440, y: 200 },
  // 12: Grand Spire Pinnacle (for DSA 12th topic)
  { x: 860, y: 200 },
  // 13: Mystic Volcano Shrine (reserve)
  { x: 180, y: 480 },
  // 14: Corsair Bay Cove (reserve)
  { x: 420, y: 1120 },
  // 15: Astral Lighthouse (reserve)
  { x: 2260, y: 1120 },
];

const getIslandCoordinates = (index: number) => {
  if (index >= 0 && index < ISLAND_COORDINATES.length) {
    return ISLAND_COORDINATES[index];
  }
  const startX = 340;
  const stepX = 320;
  return { x: startX + (index % 5) * stepX, y: 550 };
};

const getCubicBezierPoints = (
  p0: { x: number; y: number },
  p3: { x: number; y: number }
) => {
  const dx = p3.x - p0.x;
  const dy = p3.y - p0.y;
  const cx1 = p0.x + dx * 0.3;
  const cy1 = p0.y + dy * 0.1 - 40;
  const cx2 = p0.x + dx * 0.7;
  const cy2 = p3.y - dy * 0.1 - 40;
  return { cx1, cy1, cx2, cy2 };
};

const getCubicBezierPoint = (
  p0: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
) => {
  const { cx1, cy1, cx2, cy2 } = getCubicBezierPoints(p0, p3);

  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * p0.x + 3 * uu * t * cx1 + 3 * u * tt * cx2 + ttt * p3.x;
  const y = uuu * p0.y + 3 * uu * t * cy1 + 3 * u * tt * cy2 + ttt * p3.y;
  return { x, y };
};

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const calculateFitZoom = (w: number, h: number) => {
  if (w <= 0 || h <= 0) return 0.75;
  const paddingX = 24;
  const paddingY = 24;
  const availableW = Math.max(320, w - paddingX);
  const availableH = Math.max(320, h - paddingY);

  const scaleX = availableW / BASE_WORLD_WIDTH;
  const scaleY = availableH / BASE_WORLD_HEIGHT;

  const fitScale = Math.min(scaleX, scaleY);
  return Number(Math.min(1.0, Math.max(0.38, fitScale)).toFixed(3));
};

// Computes the hardware-accelerated 2D translation matrix to center on the camera point with soft edge bounds
function computeTransform(
  camX: number,
  camY: number,
  zoom: number,
  viewportW: number,
  viewportH: number,
  worldW: number,
  worldH: number
) {
  const scaledW = worldW * zoom;
  const scaledH = worldH * zoom;

  let tx: number;
  let ty: number;

  if (scaledW <= viewportW) {
    tx = (viewportW - scaledW) / 2;
  } else {
    const minTx = viewportW - scaledW - 60;
    const maxTx = 60;
    const desiredTx = viewportW / 2 - camX * zoom;
    tx = Math.min(maxTx, Math.max(minTx, desiredTx));
  }

  if (scaledH <= viewportH) {
    ty = (viewportH - scaledH) / 2;
  } else {
    const minTy = viewportH - scaledH - 60;
    const maxTy = 60;
    const desiredTy = viewportH / 2 - camY * zoom;
    ty = Math.min(maxTy, Math.max(minTy, desiredTy));
  }

  return { tx: Math.round(tx), ty: Math.round(ty) };
}

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

  // Viewport container ref & measured size
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 800 });

  // Dynamic zoom level — exploration default is comfortable 0.82
  const [zoomLevel, setZoomLevel] = useState(0.82);

  // Camera world position (focus coordinates)
  const [cameraPos, setCameraPos] = useState<{ x: number; y: number }>(() => {
    const currentTopicIndex = currentSubject.topics.findIndex((t) => t.id === currentMissionId);
    const validIndex = currentTopicIndex !== -1 ? currentTopicIndex : 0;
    return getIslandCoordinates(validIndex);
  });

  // Newly unlocked topic index (triggers card zoom-up animation on screen)
  const [newlyUnlockedIndex, setNewlyUnlockedIndex] = useState<number | null>(null);

  // Drag panning state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; camX: number; camY: number } | null>(null);

  // Animation state for traveling token moving from completed card to newly unlocked card
  const [movingToken, setMovingToken] = useState<{
    fromIndex: number;
    toIndex: number;
    startTime: number;
    duration: number;
    xpEarned: number;
    completedTitle: string;
    nextTitle: string;
  } | null>(null);

  const [tokenPosition, setTokenPosition] = useState<{ x: number; y: number } | null>(null);
  const [celebrationToast, setCelebrationToast] = useState<{ title: string; xp: number } | null>(null);

  // Lock body scrolling while map modal is active
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Measure container dimensions accurately on resize and drawer toggle
  useEffect(() => {
    const updateSize = () => {
      if (scrollContainerRef.current) {
        const w = scrollContainerRef.current.clientWidth;
        const h = scrollContainerRef.current.clientHeight;
        setContainerSize({ width: w, height: h });
      }
    };
    updateSize();
    const timer = setTimeout(updateSize, 60);
    window.addEventListener("resize", updateSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateSize);
    };
  }, [isChallengePanelOpen]);

  // Center camera smoothly on active mission topic when subject changes
  useEffect(() => {
    if (movingToken) return;
    const currentTopicIndex = currentSubject.topics.findIndex((t) => t.id === currentMissionId);
    const validIndex = currentTopicIndex !== -1 ? currentTopicIndex : 0;
    const pos = getIslandCoordinates(validIndex);
    setCameraPos(pos);
  }, [currentSubjectId, currentMissionId]);

  // Smooth pan helper
  const smoothPanTo = useCallback((x: number, y: number, targetZoom?: number) => {
    setCameraPos({ x, y });
    if (targetZoom) {
      setZoomLevel(targetZoom);
    }
  }, []);

  // Animation physics loop: camera glides seamlessly along with traveling mascot token
  useEffect(() => {
    if (!movingToken) return;

    let animId: number;
    const fromPos = getIslandCoordinates(movingToken.fromIndex);
    const toPos = getIslandCoordinates(movingToken.toIndex);

    const animate = (now: number) => {
      const elapsed = now - movingToken.startTime;
      const rawT = Math.min(1, elapsed / movingToken.duration);
      const easedT = easeInOutCubic(rawT);
      const pos = getCubicBezierPoint(fromPos, toPos, easedT);
      setTokenPosition(pos);

      // SILKY SMOOTH CAMERA FOLLOW: Camera moves along with transition across the map
      setCameraPos(pos);

      if (rawT < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        // Arrival: Unlock topic, celebrate, and trigger Card Zoom-Up animation on screen!
        const targetIndex = movingToken.toIndex;
        onCompleteTopicMission(
          currentSubjectId,
          currentSubject.topics[movingToken.fromIndex].id,
          movingToken.xpEarned
        );

        setNewlyUnlockedIndex(targetIndex);
        setCameraPos(toPos);

        setCelebrationToast({
          title: `Unlocked: ${movingToken.nextTitle}`,
          xp: movingToken.xpEarned,
        });

        setTimeout(() => setCelebrationToast(null), 4000);
        setTimeout(() => setNewlyUnlockedIndex(null), 2500);
        setTimeout(() => {
          setMovingToken(null);
          setTokenPosition(null);
        }, 400);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [movingToken, currentSubjectId, onCompleteTopicMission, currentSubject.topics]);

  // Drag-to-pan mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || movingToken) return;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      camX: cameraPos.x,
      camY: cameraPos.y,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartRef.current || movingToken) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    setCameraPos({
      x: dragStartRef.current.camX - dx / zoomLevel,
      y: dragStartRef.current.camY - dy / zoomLevel,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoomLevel((prev) => Math.min(1.4, Math.max(0.4, Number((prev + delta).toFixed(2)))));
  };

  // Derive node status dynamically
  const getTopicStatus = (topic: TopicNode): TopicStatus => {
    if (completedIds.includes(topic.id)) return "COMPLETED";
    if (topic.id === currentMissionId) return "CURRENT";

    const allPrereqsMet = topic.prerequisites.every((reqId) =>
      completedIds.includes(reqId)
    );
    return allPrereqsMet ? "AVAILABLE" : "LOCKED";
  };

  const handleNodeClick = (topic: TopicNode, index: number) => {
    const status = getTopicStatus(topic);
    if (status === "LOCKED") return;

    // Smoothly pan camera to center on the clicked card
    const targetPos = getIslandCoordinates(index);
    smoothPanTo(targetPos.x, targetPos.y);

    setSelectedTopic(topic);
  };

  const handleStartMissionFromPanel = (topic: TopicNode) => {
    setSelectedTopic(null);
    setActiveMissionTopic(topic);
  };

  const handleStartDailyChallenge = () => {
    const target =
      currentSubject.topics.find((t) => t.id === currentDailyChallenge.targetTopicId) ||
      currentSubject.topics.find((t) => t.id === currentMissionId) ||
      currentSubject.topics[0];

    if (target) {
      handleStartMissionFromPanel(target);
    }
  };

  const handleCompleteMission = (topicId: string, xpEarned: number) => {
    setActiveMissionTopic(null);

    const currentIndex = currentSubject.topics.findIndex((t) => t.id === topicId);
    const nextIndex =
      currentIndex !== -1 && currentIndex + 1 < currentSubject.topics.length
        ? currentIndex + 1
        : -1;

    if (currentIndex !== -1 && nextIndex !== -1) {
      const fromPos = getIslandCoordinates(currentIndex);
      const toPos = getIslandCoordinates(nextIndex);

      // Smooth camera start at fromPos and ensure comfortable zoom for transition
      setCameraPos(fromPos);
      setTokenPosition(fromPos);
      if (zoomLevel < 0.72) {
        setZoomLevel(0.82);
      }

      setMovingToken({
        fromIndex: currentIndex,
        toIndex: nextIndex,
        startTime: performance.now(),
        duration: 2200,
        xpEarned,
        completedTitle: currentSubject.topics[currentIndex].shortTitle,
        nextTitle: currentSubject.topics[nextIndex].shortTitle,
      });
    } else {
      // Final topic in subject
      onCompleteTopicMission(currentSubjectId, topicId, xpEarned);
      setCelebrationToast({
        title: "All World Topics Mastered! 🏆",
        xp: xpEarned,
      });
      setTimeout(() => setCelebrationToast(null), 4000);
    }
  };

  // Check if current daily challenge topic is completed
  const isChallengeCompleted = completedIds.includes(currentDailyChallenge.targetTopicId);

  // Compute camera translation coordinates
  const { tx, ty } = computeTransform(
    cameraPos.x,
    cameraPos.y,
    zoomLevel,
    containerSize.width,
    containerSize.height,
    BASE_WORLD_WIDTH,
    BASE_WORLD_HEIGHT
  );

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 animate-[fadeIn_0.2s_ease-out]">
      
      {/* ─── TOP MAP NAVIGATION HEADER ─── */}
      <header className="shrink-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-sky-100 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 relative z-30 shadow-md">
        
        {/* Left: Back & Subject Dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Subject Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSubjectDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-slate-800/90 hover:bg-sky-100 border border-sky-200/80 dark:border-slate-700 text-xs font-bold text-sky-900 dark:text-white transition-colors shadow-xs cursor-pointer"
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
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
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
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className={`flex-1 h-full relative overflow-hidden select-none bg-gradient-to-br from-sky-300 via-sky-100 to-indigo-200 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
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

          {/* Ambient Atmosphere Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 via-transparent to-sky-900/10 pointer-events-none" />

          {/* ─── HARDWARE-ACCELERATED WORLD STAGE (Silky Smooth 60fps Camera Tracking) ─── */}
          <div
            className="absolute left-0 top-0 shadow-2xl rounded-3xl overflow-visible"
            style={{
              width: `${BASE_WORLD_WIDTH}px`,
              height: `${BASE_WORLD_HEIGHT}px`,
              transform: `translate3d(${tx}px, ${ty}px, 0) scale(${zoomLevel})`,
              transformOrigin: "0 0",
              transition: isDragging || movingToken ? "none" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
              willChange: "transform",
            }}
          >
            {/* Background Map Graphic (Panoramic 16:9 Illustration) */}
            <div className="absolute inset-0 bg-[url('/learning_map.jpg')] bg-cover bg-center rounded-3xl opacity-95 shadow-2xl pointer-events-none" />
            
            {/* Sky Atmosphere Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/20 via-transparent to-sky-950/10 pointer-events-none rounded-3xl" />
            
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
                <linearGradient id="activeMovingBeamGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
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
                  const isCurrentlyMovingOnThisPath =
                    movingToken && movingToken.fromIndex === prereqIndex && movingToken.toIndex === index;

                  // Identical cubic bezier control points matching the mascot trajectory curve
                  const { cx1, cy1, cx2, cy2 } = getCubicBezierPoints(prereqPos, currentPos);

                  return (
                    <g key={`${prereqId}-${topic.id}`}>
                      <path
                        d={`M ${prereqPos.x} ${prereqPos.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${currentPos.x} ${currentPos.y}`}
                        fill="none"
                        stroke={
                          isCurrentlyMovingOnThisPath
                            ? "url(#activeMovingBeamGrad)"
                            : isCompletedPath
                            ? "url(#completedPathGrad)"
                            : isAvailablePath
                            ? "url(#availablePathGrad)"
                            : "#94A3B8"
                        }
                        strokeWidth={isCurrentlyMovingOnThisPath ? 8 : isCompletedPath ? 6 : isAvailablePath ? 4.5 : 2.5}
                        strokeDasharray={isCurrentlyMovingOnThisPath ? "10 6" : isAvailablePath || isCompletedPath ? "none" : "6 6"}
                        strokeOpacity={isCurrentlyMovingOnThisPath ? 1 : isCompletedPath ? 1 : isAvailablePath ? 0.95 : 0.45}
                        filter={isCurrentlyMovingOnThisPath ? "url(#glowEffect)" : undefined}
                      />
                      {(isCompletedPath || isCurrentlyMovingOnThisPath) && (
                        <path
                          d={`M ${prereqPos.x} ${prereqPos.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${currentPos.x} ${currentPos.y}`}
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth={isCurrentlyMovingOnThisPath ? 4 : 2}
                          strokeDasharray="6 14"
                          strokeOpacity={0.8}
                          className="animate-[dash_1.5s_linear_infinite]"
                        />
                      )}
                    </g>
                  );
                });
              })}
            </svg>

            {/* ─── TRAVELING MASCOT TOKEN (Animated path journey between cards when finished) ─── */}
            {tokenPosition && (
              <div
                className="absolute z-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform"
                style={{
                  left: `${tokenPosition.x}px`,
                  top: `${tokenPosition.y}px`,
                }}
              >
                {/* Glowing Energy Aura */}
                <div className="absolute -inset-6 bg-gradient-to-r from-amber-400 via-sky-400 to-indigo-500 rounded-full blur-xl opacity-80 animate-ping" />
                
                {/* Traveling Avatar Token Badge */}
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 border-2 border-white shadow-2xl flex items-center justify-center text-white ring-4 ring-amber-300/60 scale-110 animate-bounce">
                  <Gamepad2 className="w-8 h-8 text-white drop-shadow-lg" />
                  <Sparkles className="w-5 h-5 text-amber-200 fill-amber-200 absolute -top-2 -right-2 animate-spin" />
                </div>

                {/* Floating Advancing Tag */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded-full bg-slate-900/95 text-amber-300 text-xs font-black whitespace-nowrap shadow-xl border border-amber-300/40 flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                  <span>Advancing to Next Mission... 🚀</span>
                </div>
              </div>
            )}

            {/* ─── FLOATING ISLAND NODES (Spacious, Clear, Non-Overlapping Cards) ─── */}
            <div className="absolute inset-0 z-20 pointer-events-auto">
              {currentSubject.topics.map((topic, index) => {
                const status = getTopicStatus(topic);
                const isCompleted = status === "COMPLETED";
                const isCurrent = status === "CURRENT";
                const isAvailable = status === "AVAILABLE";
                const isLocked = status === "LOCKED";
                const isCurrentlyTargeted = movingToken && movingToken.toIndex === index;
                const isNewlyUnlocked = newlyUnlockedIndex === index;

                const { x, y } = getIslandCoordinates(index);

                return (
                  <div
                    key={topic.id}
                    onClick={() => handleNodeClick(topic, index)}
                    className={`absolute flex flex-col items-center select-none transition-all duration-300 group ${
                      isNewlyUnlocked
                        ? "animate-[zoomUp_0.9s_cubic-bezier(0.34,1.56,0.64,1)] z-50 scale-110"
                        : isLocked
                        ? "cursor-not-allowed opacity-85"
                        : "cursor-pointer hover:scale-105 hover:z-30"
                    } ${isCurrentlyTargeted ? "scale-110 z-40" : ""}`}
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {/* ─── FLOATING ISLAND CONTAINER ─── */}
                    <div className="relative flex flex-col items-center">
                      
                      {/* 1. TOP BADGE OVERLAY */}
                      {isNewlyUnlocked && (
                        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-slate-950 text-xs font-black px-4 py-1 rounded-full mb-1.5 shadow-xl shadow-amber-500/50 animate-bounce whitespace-nowrap flex items-center gap-1.5 border-2 border-white">
                          <Sparkles className="w-4 h-4 fill-amber-950 text-amber-950" />
                          <span>🎉 NEW MISSION UNLOCKED!</span>
                        </div>
                      )}

                      {isCurrent && !movingToken && !isNewlyUnlocked && (
                        <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white text-[11px] font-black px-3 py-1 rounded-full mb-1.5 shadow-lg shadow-sky-500/40 animate-bounce whitespace-nowrap flex items-center gap-1.5 border border-white/80">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          <span>★ ACTIVE MISSION</span>
                        </div>
                      )}

                      {isAvailable && !isNewlyUnlocked && (
                        <div className="bg-gradient-to-r from-indigo-600 to-sky-600 text-white text-[11px] font-black px-3 py-1 rounded-full mb-1.5 shadow-md shadow-indigo-500/30 whitespace-nowrap flex items-center gap-1.5 border border-indigo-200 animate-pulse">
                          <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
                          <span>🔓 UNLOCKED QUIZ</span>
                        </div>
                      )}

                      {isCompleted && !isNewlyUnlocked && (
                        <div className="bg-emerald-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full mb-1.5 shadow-sm whitespace-nowrap flex items-center gap-1 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-100" />
                          <span>✓ QUIZ MASTERED</span>
                        </div>
                      )}

                      {isLocked && !isNewlyUnlocked && (
                        <div className="bg-slate-200/95 dark:bg-slate-800/95 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1.5 border border-slate-300/60 dark:border-slate-700 whitespace-nowrap flex items-center gap-1 shadow-xs">
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span>QUIZ LOCKED</span>
                        </div>
                      )}

                      {/* 2. PROMINENT, NON-OVERLAPPING CARD PLATFORM (w-64 = 256px, Spacious & Crisp) */}
                      <div
                        className={`w-64 p-4 rounded-3xl font-bold shadow-2xl border-2 backdrop-blur-2xl flex flex-col items-center text-center gap-2 transition-all relative overflow-hidden ${
                          isNewlyUnlocked
                            ? "bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border-amber-400 ring-8 ring-amber-400/80 shadow-2xl shadow-amber-500/60 scale-105"
                            : isCompleted
                            ? "bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-700 text-white border-emerald-300 shadow-emerald-500/40 ring-4 ring-emerald-400/40"
                            : isCurrent
                            ? "bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border-sky-400 ring-4 ring-sky-400/60 shadow-2xl shadow-sky-500/50 scale-105"
                            : isAvailable
                            ? "bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white border-indigo-500 ring-4 ring-indigo-400/30 shadow-2xl hover:border-sky-400"
                            : "bg-white/90 dark:bg-slate-900/90 text-slate-400 border-slate-300 dark:border-slate-700"
                        } ${isCurrentlyTargeted ? "ring-8 ring-amber-400/70 border-amber-300 animate-pulse" : ""}`}
                      >
                        {/* Island Number Tag */}
                        <div className="text-[11px] font-black tracking-wider uppercase opacity-85 flex items-center gap-2">
                          <span>Island #{index + 1}</span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            +{topic.xp} XP
                          </span>
                        </div>

                        {/* Title */}
                        <div className="flex items-center justify-center gap-1.5 text-sm font-black leading-snug">
                          <span className="truncate max-w-[190px]">{topic.shortTitle}</span>
                          {isCompleted && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                          {isCurrent && <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />}
                          {isAvailable && <PlayCircle className="w-4 h-4 text-indigo-500 shrink-0" />}
                          {isLocked && <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                        </div>

                        {/* Description */}
                        <p className={`text-[11px] font-medium leading-relaxed line-clamp-2 px-1 ${
                          isCompleted ? "text-emerald-100" : "text-slate-600 dark:text-slate-300"
                        }`}>
                          {topic.title}
                        </p>

                        {/* ─── QUIZ ACTION BUTTON ─── */}
                        {(isCurrent || isNewlyUnlocked) && (
                          <div className="w-full mt-1 py-2 px-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-black rounded-xl shadow-md shadow-sky-500/30 flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>START MISSION (+{topic.xp} XP)</span>
                          </div>
                        )}

                        {isAvailable && !isCurrent && !isNewlyUnlocked && (
                          <div className="w-full mt-1 py-2 px-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-black rounded-xl shadow-md shadow-indigo-500/30 flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>PLAY QUIZ (+{topic.xp} XP)</span>
                          </div>
                        )}

                        {isCompleted && !isNewlyUnlocked && (
                          <div className="w-full mt-1 py-1.5 px-3 text-xs font-black text-emerald-100 bg-emerald-700/60 border border-emerald-400/40 rounded-xl flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            <span>Mastered • 100% Score</span>
                          </div>
                        )}

                        {isLocked && !isNewlyUnlocked && (
                          <div className="w-full mt-1 py-1.5 px-3 text-[11px] font-semibold text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl flex items-center justify-center gap-1.5">
                            <Lock className="w-3 h-3" />
                            <span>Complete Island #{index}</span>
                          </div>
                        )}
                      </div>

                      {/* 3. ISLAND RATING STARS & FOOTER */}
                      {isCompleted && (
                        <div className="flex gap-1 mt-1.5 bg-white/95 dark:bg-slate-900/95 rounded-full px-2.5 py-0.5 border border-emerald-300 shadow-sm backdrop-blur-sm">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        </div>
                      )}

                      {(isCurrent || isAvailable || isNewlyUnlocked) && !isCompleted && (
                        <div className="flex gap-1 mt-1.5 bg-white/95 dark:bg-slate-900/95 rounded-full px-2.5 py-0.5 border border-indigo-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">
                          <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
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

        {/* ─── RIGHT COLUMN: SUBJECT-SPECIFIC DAILY CHALLENGE PANEL (TOGGLEABLE SLIDE-IN DRAWER) ─── */}
        {isChallengePanelOpen && (
          <aside className="fixed lg:relative top-16 lg:top-0 bottom-0 right-0 z-40 w-full sm:w-96 lg:w-88 xl:w-96 h-[calc(100vh-4rem)] lg:h-full shrink-0 flex flex-col sidebar-gradient border-l border-white/20 shadow-2xl backdrop-blur-xl p-5 overflow-y-auto text-white animate-[slideInRight_0.3s_ease-out]">
            
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
                  title="Close Challenge Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title & Subject */}
            <div className="mb-4">
              <h3 className="text-xl font-black text-white leading-tight drop-shadow-xs">
                {currentDailyChallenge.title}
              </h3>
              <p className="text-xs text-sky-100 font-medium mt-1">
                {currentSubject.name} Focus Challenge
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-white/90 leading-relaxed mb-5 bg-white/10 p-3.5 rounded-2xl border border-white/20 backdrop-blur-xs">
              {currentDailyChallenge.description}
            </p>

            {/* Reward & Info Pills */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <div className="flex items-center gap-2.5 bg-white/15 border border-white/25 rounded-2xl p-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400/30 flex items-center justify-center text-amber-300">
                  <Star className="w-4 h-4 fill-amber-300" />
                </div>
                <div>
                  <div className="text-[10px] text-white/75 font-bold uppercase tracking-wider">Reward</div>
                  <div className="text-sm font-black text-amber-300">+{currentDailyChallenge.xpReward} XP</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/15 border border-white/25 rounded-2xl p-3">
                <div className="w-8 h-8 rounded-xl bg-sky-400/30 flex items-center justify-center text-sky-200">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-white/75 font-bold uppercase tracking-wider">Duration</div>
                  <div className="text-sm font-black text-white">{currentDailyChallenge.estimatedMinutes} mins</div>
                </div>
              </div>
            </div>

            {/* Streak & Completion Status */}
            <div className="bg-white/15 border border-white/25 rounded-2xl p-4 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">Daily Streak Active</div>
                  <div className="text-[11px] text-amber-200 font-semibold">{currentDailyChallenge.subtitle}</div>
                </div>
              </div>

              {isChallengeCompleted && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/40 border border-emerald-300 text-emerald-200 text-[11px] font-black">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Done</span>
                </div>
              )}
            </div>

            {/* Challenge Action Button */}
            <button
              onClick={handleStartDailyChallenge}
              disabled={isChallengeCompleted}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isChallengeCompleted
                  ? "bg-white/30 text-white/60 cursor-not-allowed border border-white/20"
                  : "bg-white text-indigo-700 hover:bg-sky-50 hover:shadow-white/30 active:scale-98"
              }`}
            >
              {isChallengeCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Challenge Mastered Today!</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-indigo-700" />
                  <span>Start Challenge (+{currentDailyChallenge.xpReward} XP)</span>
                </>
              )}
            </button>

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

      {/* ─── CELEBRATION TOAST NOTIFICATION ─── */}
      {celebrationToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl border-2 border-white/60 flex items-center gap-3.5 backdrop-blur-xl animate-[bounce_0.6s_ease-out]">
          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-amber-300 shadow-md shrink-0">
            <Trophy className="w-6 h-6 fill-amber-300 text-amber-300" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Mission Completed! +{celebrationToast.xp} XP Earned
            </div>
            <div className="text-sm font-black drop-shadow-xs">
              {celebrationToast.title} 🚀
            </div>
          </div>
        </div>
      )}

      {/* ─── MAP CONTROLS OVERLAY (Zoom +, -, Center Mission, Fit to Screen) ─── */}
      <div className="absolute bottom-6 left-6 z-30 flex flex-col gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-sky-100 dark:border-slate-800 p-1.5 rounded-2xl shadow-xl">
        <button
          onClick={() => setZoomLevel((z) => Math.min(Number((z + 0.1).toFixed(2)), 1.4))}
          className="w-9 h-9 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(Number((z - 0.1).toFixed(2)), 0.38))}
          className="w-9 h-9 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            // Smoothly fly camera to active mission
            const currentTopicIndex = currentSubject.topics.findIndex((t) => t.id === currentMissionId);
            const validIndex = currentTopicIndex !== -1 ? currentTopicIndex : 0;
            const targetPos = getIslandCoordinates(validIndex);
            smoothPanTo(targetPos.x, targetPos.y, 0.85);
          }}
          className="w-9 h-9 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 flex items-center justify-center text-sky-600 dark:text-sky-400 transition-colors cursor-pointer"
          title="Focus Active Mission"
        >
          <Target className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            if (scrollContainerRef.current) {
              const w = scrollContainerRef.current.clientWidth;
              const h = scrollContainerRef.current.clientHeight;
              const fit = calculateFitZoom(w, h);
              setZoomLevel(fit);
              setCameraPos({ x: BASE_WORLD_WIDTH / 2, y: BASE_WORLD_HEIGHT / 2 });
            }
          }}
          className="w-9 h-9 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          title="Fit Map to Screen"
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
    </div>,
    document.body
  );
}
