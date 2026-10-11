import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Sparkles,
  Star,
  Check,
  Lock,
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  Shield,
  Zap,
  Flame,
  Award,
  Crown
} from "lucide-react";
import { useCampus } from "../context/CampusContext";
import { useLearning } from "../context/LearningContext";
import { useSettings } from "../context/SettingsContext";
import {
  avatarFramesList,
  AvatarFrame,
  getFrameById,
  frameCategories
} from "../data/avatarFramesData";

const rarityBadges: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  COMMON: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
    glow: "shadow-xs",
  },
  UNCOMMON: {
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    glow: "shadow-xs shadow-emerald-500/10",
  },
  RARE: {
    bg: "bg-sky-50 dark:bg-sky-950/60",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-800",
    glow: "shadow-xs shadow-sky-500/10",
  },
  EPIC: {
    bg: "bg-purple-50 dark:bg-purple-950/60",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
    glow: "shadow-xs shadow-purple-500/10",
  },
  LEGENDARY: {
    bg: "bg-amber-50 dark:bg-amber-950/60",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    glow: "shadow-sm shadow-amber-500/20",
  },
  MYTHIC: {
    bg: "bg-rose-50 dark:bg-rose-950/60",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    glow: "shadow-md shadow-rose-500/30",
  },
};

const rarityWeight: Record<string, number> = {
  MYTHIC: 5,
  LEGENDARY: 4,
  EPIC: 3,
  RARE: 2,
  UNCOMMON: 1,
  COMMON: 0,
};

export default function ShopPage() {
  const navigate = useNavigate();
  const { currentUser } = useCampus();
  const { profile, buyFrameWithXP, equipCosmetic } = useLearning();
  const { playSound } = useSettings();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOwnership, setSelectedOwnership] = useState<"ALL" | "OWNED" | "AVAILABLE">("ALL");
  const [sortBy, setSortBy] = useState<"DEFAULT" | "PRICE_ASC" | "PRICE_DESC" | "RARITY" | "NAME">("DEFAULT");
  
  // Interactive live preview frame (defaults to currently equipped frame)
  const [previewFrameId, setPreviewFrameId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!currentUser || !profile) {
    return (
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
        <div className="max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Frames Shop</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Please sign in with a student account to browse and buy custom avatar frames.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  const userXP = profile.totalXP || 0;
  const currentEquippedId = profile.frameId || "fr-1";
  const unlockedFrames = profile.unlockedCosmetics || ["fr-1"];
  const userInitial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "A";

  const equippedFrame = getFrameById(currentEquippedId);
  const activePreviewFrame = getFrameById(previewFrameId || currentEquippedId);

  // Stats calculation
  const totalFramesCount = avatarFramesList.length; // 100
  const ownedCount = avatarFramesList.filter(
    (f) => unlockedFrames.includes(f.id) || f.costXP === 0
  ).length;
  const unlockPercentage = Math.round((ownedCount / totalFramesCount) * 100);

  // Filter & Sort Logic
  const displayedFrames = useMemo(() => {
    return avatarFramesList
      .filter((frame) => {
        // Ownership filter
        const isUnlocked = unlockedFrames.includes(frame.id) || frame.costXP === 0;
        if (selectedOwnership === "OWNED" && !isUnlocked) return false;
        if (selectedOwnership === "AVAILABLE" && isUnlocked) return false;

        // Category filter
        if (selectedCategory !== "All" && frame.category !== selectedCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = frame.name.toLowerCase().includes(q);
          const matchDesc = frame.description.toLowerCase().includes(q);
          const matchCat = frame.category.toLowerCase().includes(q);
          const matchEmoji = frame.emoji.includes(q);
          if (!matchName && !matchDesc && !matchCat && !matchEmoji) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "PRICE_ASC") return a.costXP - b.costXP;
        if (sortBy === "PRICE_DESC") return b.costXP - a.costXP;
        if (sortBy === "RARITY") return (rarityWeight[b.rarity] || 0) - (rarityWeight[a.rarity] || 0);
        if (sortBy === "NAME") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [selectedOwnership, selectedCategory, searchQuery, sortBy, unlockedFrames]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAction = (frame: AvatarFrame) => {
    const isUnlocked = unlockedFrames.includes(frame.id) || frame.costXP === 0;

    if (isUnlocked) {
      equipCosmetic(frame.id, "frame");
      setPreviewFrameId(frame.id);
      playSound("notification");
      showToast(`Equipped ${frame.name} frame! ✨ Shows automatically on your profile.`);
      return;
    }

    if (userXP < frame.costXP) {
      showToast(`Insufficient EXP! You need ${frame.costXP - userXP} more EXP.`);
      return;
    }

    const success = buyFrameWithXP(frame.id, frame.costXP);
    if (success) {
      setPreviewFrameId(frame.id);
      playSound("success");
      showToast(`🎉 Purchased and equipped ${frame.name}! (-${frame.costXP} EXP)`);
    }
  };

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-5 lg:py-7 text-slate-800 dark:text-slate-100 max-w-[1600px] mx-auto w-full">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-800 flex items-center gap-2.5 animate-[fadeIn_0.2s_ease-out]">
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ─── HERO HEADER BANNER ─── */}
      <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-white/60 dark:border-slate-800/80 p-6 sm:p-8 mb-6 shadow-sm relative overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute -right-24 -top-24 w-80 h-80 bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-pink-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-gradient-to-tr from-amber-500/15 via-sky-500/15 to-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-black mb-3">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Campus Cosmetics & Prestige Store</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>Avatar Frames Shop</span>
              <span className="text-2xl sm:text-3xl">✨</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
              Explore 100 unique emojified glowing frames! Buy frames with your earned EXP and equip them to customize your student avatar on your profile, header, and campus leaderboard.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200/80 dark:border-slate-700/80">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>Level {profile.level} • {profile.title}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200/80 dark:border-slate-700/80">
                <Award className="w-3.5 h-3.5 text-indigo-500" />
                <span>{ownedCount} of {totalFramesCount} Frames Unlocked ({unlockPercentage}%)</span>
              </div>
            </div>
          </div>

          {/* Student EXP Balance Pill */}
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 dark:from-amber-500/25 dark:to-orange-500/25 border border-amber-300 dark:border-amber-700/60 rounded-3xl p-5 flex items-center gap-4 shadow-sm shrink-0 w-full sm:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
              <Star className="w-7 h-7 fill-white text-white" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Your Available EXP
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {userXP.toLocaleString()} <span className="text-base text-amber-600 dark:text-amber-400 font-bold">EXP</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Earn more by completing missions on the Learning Arena!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── LIVE PROFILE SHOWCASE CARD ─── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.75rem] border border-slate-200/80 dark:border-slate-800 p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-5 w-full md:w-auto">
            {/* Live Interactive Avatar with Frame */}
            <div className="relative shrink-0">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black transition-all duration-300 ${activePreviewFrame.ringClasses} ${activePreviewFrame.avatarBg}`}
              >
                {userInitial}
              </div>
              <div className="absolute -bottom-1 -right-1 text-2xl select-none drop-shadow-md transition-transform duration-300 hover:scale-125">
                {activePreviewFrame.emoji}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {previewFrameId && previewFrameId !== currentEquippedId ? "Previewing" : "Equipped"}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${rarityBadges[activePreviewFrame.rarity]?.bg} ${rarityBadges[activePreviewFrame.rarity]?.text} ${rarityBadges[activePreviewFrame.rarity]?.border}`}>
                  {activePreviewFrame.rarity}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  Category: {activePreviewFrame.category}
                </span>
              </div>

              <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span>{activePreviewFrame.name}</span>
                <span>{activePreviewFrame.emoji}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mt-0.5">
                {activePreviewFrame.description}
              </p>
            </div>
          </div>

          {/* Quick Actions for Preview Frame */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {previewFrameId && previewFrameId !== currentEquippedId && (
              <button
                onClick={() => setPreviewFrameId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Preview</span>
              </button>
            )}

            {currentEquippedId !== activePreviewFrame.id && (
              <button
                onClick={() => handleAction(activePreviewFrame)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                {unlockedFrames.includes(activePreviewFrame.id) || activePreviewFrame.costXP === 0 ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Equip {activePreviewFrame.name}</span>
                  </>
                ) : userXP >= activePreviewFrame.costXP ? (
                  <>
                    <Star className="w-4 h-4 fill-current" />
                    <span>Unlock for {activePreviewFrame.costXP} EXP</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Need {activePreviewFrame.costXP - userXP} more EXP</span>
                  </>
                )}
              </button>
            )}

            {currentEquippedId === activePreviewFrame.id && (
              <div className="px-5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-black flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Currently Equipped on Profile</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ─── FILTERS & SEARCH CONTROL BAR ─── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.75rem] border border-slate-200/80 dark:border-slate-800 p-5 mb-6 shadow-sm space-y-4">
        
        {/* Row 1: Search, Ownership Tabs, Sort Selector */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100 frames by name, category, or emoji..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Ownership Filter Segmented Control */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                onClick={() => setSelectedOwnership("ALL")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedOwnership === "ALL"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                All ({totalFramesCount})
              </button>
              <button
                onClick={() => setSelectedOwnership("OWNED")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedOwnership === "OWNED"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Owned ({ownedCount})
              </button>
              <button
                onClick={() => setSelectedOwnership("AVAILABLE")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedOwnership === "AVAILABLE"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Available ({totalFramesCount - ownedCount})
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort frames"
                className="bg-transparent text-slate-700 dark:text-slate-200 font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="DEFAULT">Default Order</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
                <option value="RARITY">Rarity: Highest First</option>
                <option value="NAME">Name: A to Z</option>
              </select>
            </div>
          </div>

        </div>

        {/* Row 2: Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {frameCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === "All"
              ? avatarFramesList.length
              : avatarFramesList.filter((f) => f.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-750 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

      </div>

      {/* ─── 100 FRAMES GRID ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayedFrames.map((frame) => {
          const isEquipped = currentEquippedId === frame.id;
          const isUnlocked = unlockedFrames.includes(frame.id) || frame.costXP === 0;
          const canAfford = userXP >= frame.costXP;
          const isPreviewing = previewFrameId === frame.id;
          const badgeStyle = rarityBadges[frame.rarity] || rarityBadges.COMMON;

          return (
            <div
              key={frame.id}
              onClick={() => setPreviewFrameId(frame.id)}
              className={`rounded-2xl p-4.5 border transition-all duration-200 flex flex-col justify-between group relative cursor-pointer ${
                isEquipped
                  ? "bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700/80 shadow-md ring-2 ring-indigo-500/20"
                  : isPreviewing
                  ? "bg-sky-50/90 dark:bg-sky-950/40 border-sky-300 dark:border-sky-700/80 shadow-md"
                  : "bg-white/70 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-slate-700 hover:shadow-md"
              }`}
            >
              {/* Card Header: Rarity & Category */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} ${badgeStyle.glow}`}
                  >
                    {frame.rarity}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate">
                    {frame.category}
                  </span>
                </div>

                {/* Avatar Preview with Glowing Frame & Emoji */}
                <div className="flex justify-center my-3">
                  <div className="relative group-hover:scale-110 transition-transform duration-300">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-black transition-all ${frame.ringClasses} ${frame.avatarBg}`}
                    >
                      {userInitial}
                    </div>
                    {/* Emojified Badge */}
                    <div className="absolute -bottom-1 -right-1 text-base select-none drop-shadow-sm">
                      {frame.emoji}
                    </div>
                  </div>
                </div>

                {/* Frame Details */}
                <div className="text-center mt-2">
                  <h3 className="font-black text-slate-800 dark:text-white text-sm flex items-center justify-center gap-1.5">
                    <span className="truncate">{frame.name}</span>
                    <span>{frame.emoji}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2 mt-1 min-h-[30px]">
                    {frame.description}
                  </p>
                </div>
              </div>

              {/* Card Footer: Price & Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase">
                    Price
                  </span>
                  <span className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    {frame.costXP === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">FREE</span>
                    ) : (
                      <>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{frame.costXP} EXP</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Action Button */}
                {isEquipped ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-black flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Equipped</span>
                  </button>
                ) : isUnlocked ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(frame);
                    }}
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Equip Frame</span>
                  </button>
                ) : canAfford ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(frame);
                    }}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black shadow-xs shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Unlock ({frame.costXP} EXP)</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Need {frame.costXP - userXP} more</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {displayedFrames.length === 0 && (
        <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center my-6">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            No frames match your selected filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedOwnership("ALL");
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
}
