import { useState } from "react";
import { GraduationCap, Menu, X, Search } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { useCampus } from "../context/CampusContext";
import NotificationDropdown from "./NotificationDropdown";
import SearchAutocomplete from "./SearchAutocomplete";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-sky-500/20 border border-white/20 shrink-0">
      {initials}
    </div>
  );
}

export default function MobileHeader() {
  const { isMobileOpen, toggleMobile } = useSidebar();
  const { currentUser } = useCampus();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header
      className="md:hidden flex flex-col px-4 py-3 bg-white/75 dark:bg-slate-900/85 backdrop-blur-md border-b border-white/60 dark:border-slate-800 sticky top-0 z-30 shadow-sm"
      role="banner"
    >
      <div className="flex items-center justify-between">
        {/* Hamburger button + Logo + greeting */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={toggleMobile}
            className="w-9 h-9 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer"
            aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0">
            <GraduationCap className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div className="py-0.5 min-w-0 truncate">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
              Hello, {currentUser?.name?.split(" ")[0] || "User"} 👋
            </div>
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
              {(currentUser as any)?.course || currentUser?.department || currentUser?.role || "CampusOS AI"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="w-9 h-9 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm cursor-pointer"
            aria-label="Search"
          >
            {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
          <NotificationDropdown />
          <Avatar name={currentUser?.name || "User"} />
        </div>
      </div>

      {/* Expandable Mobile Search Row */}
      {isSearchOpen && (
        <div className="pt-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <SearchAutocomplete isMobile onSelect={() => setIsSearchOpen(false)} />
        </div>
      )}
    </header>
  );
}
