import { useState } from "react";
import { Sparkles, Star, Check, ShoppingBag, Lock, ShieldCheck, Crown, Flame, Zap, Award } from "lucide-react";
import { useLearning } from "../../context/LearningContext";
import { useCampus } from "../../context/CampusContext";
import { avatarFramesList, AvatarFrame, getFrameById } from "../../data/avatarFramesData";

export default function AvatarFramesShop() {
  const { profile, buyFrameWithXP, equipCosmetic } = useLearning();
  const { currentUser } = useCampus();

  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "OWNED" | "AVAILABLE">("ALL");
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);

  if (!profile) return null;

  const currentFrameId = profile.frameId || "fr-1";
  const equippedFrame = getFrameById(currentFrameId);
  const unlockedFrames = profile.unlockedCosmetics || ["fr-1"];
  const userXP = profile.totalXP || 0;

  const filteredFrames = avatarFramesList.filter((frame) => {
    const isUnlocked = unlockedFrames.includes(frame.id) || frame.costXP === 0;
    if (selectedFilter === "OWNED") return isUnlocked;
    if (selectedFilter === "AVAILABLE") return !isUnlocked;
    return true;
  });

  const handlePurchaseOrEquip = (frame: AvatarFrame) => {
    const isUnlocked = unlockedFrames.includes(frame.id) || frame.costXP === 0;

    if (isUnlocked) {
      equipCosmetic(frame.id, "frame");
      setPurchaseToast(`Equipped ${frame.name}! ✨`);
      setTimeout(() => setPurchaseToast(null), 3000);
      return;
    }

    if (userXP < frame.costXP) {
      return;
    }

    const success = buyFrameWithXP(frame.id, frame.costXP);
    if (success) {
      setPurchaseToast(`🎉 Purchased and equipped ${frame.name}! (-${frame.costXP} EXP)`);
      setTimeout(() => setPurchaseToast(null), 3500);
    }
  };

  const rarityColorMap: Record<string, string> = {
    COMMON: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    UNCOMMON: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    RARE: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    EPIC: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    LEGENDARY: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  };

  const userInitial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A";

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800/80 p-6 lg:p-7 shadow-sm relative overflow-hidden transition-all">
      {/* Background Ambient Glow */}
      <div className="absolute -right-24 -top-24 w-72 h-72 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification */}
      {purchaseToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-bold px-4 py-2 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{purchaseToast}</span>
        </div>
      )}

      {/* DASHBOARD BOX HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Profile Customization Vault</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>Avatar Frames Shop</span>
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium max-w-xl">
            Upgrade your profile prestige across the campus leaderboard. Unlock handcrafted glowing frames using your earned EXP!
          </p>
        </div>

        {/* EXP Currency Status Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 dark:from-amber-500/25 dark:to-orange-500/25 border border-amber-300 dark:border-amber-700/60 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30">
              <Star className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Your Balance
              </div>
              <div className="text-base font-black text-slate-900 dark:text-white leading-tight">
                {userXP.toLocaleString()} <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">EXP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SPOTLIGHT: CURRENTLY EQUIPPED FRAME SHOWCASE */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-sky-50/70 dark:from-slate-800/60 dark:via-indigo-950/30 dark:to-slate-800/60 border border-indigo-100/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar with Equipped Frame */}
          <div className="relative">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-xl transition-all duration-300 ${equippedFrame.ringClasses} ${equippedFrame.avatarBg}`}>
              {userInitial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md text-xs font-bold border-2 border-white dark:border-slate-900">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Currently Equipped:
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${rarityColorMap[equippedFrame.rarity]}`}>
                {equippedFrame.rarity}
              </span>
            </div>
            <div className="text-base font-black text-slate-800 dark:text-white flex items-center gap-1.5 mt-0.5">
              <span>{equippedFrame.emoji}</span>
              <span>{equippedFrame.name}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {equippedFrame.description}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 self-stretch sm:self-auto justify-center">
          {(["ALL", "OWNED", "AVAILABLE"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedFilter === filter
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              {filter === "ALL" ? "All Frames" : filter === "OWNED" ? "Owned" : "Buyable"}
            </button>
          ))}
        </div>
      </div>

      {/* FRAMES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {filteredFrames.map((frame) => {
          const isUnlocked = unlockedFrames.includes(frame.id) || frame.costXP === 0;
          const isEquipped = currentFrameId === frame.id;
          const canAfford = userXP >= frame.costXP;

          return (
            <div
              key={frame.id}
              className={`rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between group relative overflow-hidden ${
                isEquipped
                  ? "bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-700 shadow-md ring-2 ring-indigo-400/40"
                  : isUnlocked
                  ? "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 shadow-xs hover:shadow-md"
                  : "bg-white/90 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-indigo-200 shadow-xs hover:shadow-md"
              }`}
            >
              {/* Top Row: Rarity and Cost */}
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${rarityColorMap[frame.rarity]}`}>
                  {frame.rarity}
                </span>

                <div className="flex items-center gap-1 font-black text-xs">
                  {frame.costXP === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      FREE
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> OWNED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {frame.costXP} EXP
                    </span>
                  )}
                </div>
              </div>

              {/* Center Row: Frame Avatar Preview & Name */}
              <div className="flex items-center gap-3.5 my-2">
                {/* Frame Ring Live Preview */}
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg transition-transform duration-300 group-hover:scale-105 ${frame.ringClasses} ${frame.avatarBg}`}>
                    {userInitial}
                  </div>
                  <div className="absolute -top-1 -right-1 text-sm select-none">
                    {frame.emoji}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white truncate">
                    {frame.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                    {frame.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                {isEquipped ? (
                  <button
                    disabled
                    className="w-full py-2 px-3 rounded-xl bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-default shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Equipped</span>
                  </button>
                ) : isUnlocked ? (
                  <button
                    onClick={() => handlePurchaseOrEquip(frame)}
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-indigo-500/20 active:scale-98"
                  >
                    <span>Equip Frame</span>
                  </button>
                ) : canAfford ? (
                  <button
                    onClick={() => handlePurchaseOrEquip(frame)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-98"
                  >
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>Buy for {frame.costXP} EXP</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200/60 dark:border-slate-700/60"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Need {frame.costXP - userXP} more EXP</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
