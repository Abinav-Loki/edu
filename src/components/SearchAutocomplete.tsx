import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Bot,
  FileQuestion,
  Calendar,
  Target,
  Award,
  BookOpen,
  Library,
  Users,
  TrendingUp,
  HelpCircle,
  Settings,
  Database,
  Cpu,
  Code,
  Network,
  ArrowRight,
  FileText
} from "lucide-react";
import { useCampus } from "../context/CampusContext";
import { useSettings } from "../context/SettingsContext";

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Page" | "Topic" | "Material";
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  keywords: string[];
}

const staticCatalog: SearchItem[] = [
  // Pages & Tools
  {
    id: "page-tutor",
    title: "AI Socratic Tutor",
    subtitle: "Ask questions, explore concepts, Socratic hints",
    category: "Page",
    icon: Bot,
    link: "/tutor",
    keywords: ["tutor", "ai", "chat", "socratic", "help", "assistant", "doubt"]
  },
  {
    id: "page-quiz",
    title: "Adaptive Quiz",
    subtitle: "Knowledge checks, practice tests, subject mastery",
    category: "Page",
    icon: FileQuestion,
    link: "/quiz",
    keywords: ["quiz", "test", "exam", "questions", "practice", "mcq", "score"]
  },
  {
    id: "page-planner",
    title: "AI Study Planner",
    subtitle: "Generate weekly study plans & schedules",
    category: "Page",
    icon: Calendar,
    link: "/study-planner",
    keywords: ["planner", "study", "schedule", "timetable", "tasks", "calendar", "plan"]
  },
  {
    id: "page-recovery",
    title: "Academic Recovery Plan",
    subtitle: "Personalized milestone roadmap to get back on track",
    category: "Page",
    icon: Target,
    link: "/recovery-plan",
    keywords: ["recovery", "catch up", "milestone", "plan", "weak", "improve"]
  },
  {
    id: "page-arena",
    title: "Learning Arena",
    subtitle: "Missions, quests, badges, streaks, and arena shop",
    category: "Page",
    icon: Award,
    link: "/learning-arena",
    keywords: ["arena", "gamification", "missions", "quests", "xp", "coins", "rewards", "shop"]
  },
  {
    id: "page-resources",
    title: "Study Resources & Notes",
    subtitle: "Curated PDFs, video lectures, and revision slides",
    category: "Page",
    icon: BookOpen,
    link: "/resources",
    keywords: ["resources", "materials", "notes", "slides", "pdf", "videos", "lectures"]
  },
  {
    id: "page-library",
    title: "Digital Library",
    subtitle: "Search syllabus reference books and articles",
    category: "Page",
    icon: Library,
    link: "/library",
    keywords: ["library", "books", "syllabus", "reading", "textbooks"]
  },
  {
    id: "page-mentor",
    title: "Find a Mentor",
    subtitle: "Connect with faculty and book 1-on-1 sessions",
    category: "Page",
    icon: Users,
    link: "/find-mentor",
    keywords: ["mentor", "faculty", "professor", "teacher", "meeting", "booking", "slots"]
  },
  {
    id: "page-progress",
    title: "Academic Analytics & Progress",
    subtitle: "Radar breakdown, attendance trends, quiz history",
    category: "Page",
    icon: TrendingUp,
    link: "/progress",
    keywords: ["progress", "analytics", "grades", "attendance", "radar", "performance", "stats"]
  },
  {
    id: "page-support",
    title: "Campus Support & Tickets",
    subtitle: "Submit helpdesk issues, feedback, and campus requests",
    category: "Page",
    icon: HelpCircle,
    link: "/support",
    keywords: ["support", "ticket", "help", "issue", "feedback", "helpdesk"]
  },
  {
    id: "page-settings",
    title: "Profile & Settings",
    subtitle: "Theme, dark mode, audio effects, password, region",
    category: "Page",
    icon: Settings,
    link: "/settings",
    keywords: ["settings", "profile", "theme", "dark", "sound", "password", "preferences"]
  },

  // Academic Topics
  {
    id: "topic-dbms",
    title: "Database Management Systems (DBMS)",
    subtitle: "Relational models, ER diagrams, SQL constraints",
    category: "Topic",
    icon: Database,
    link: "/resources?search=DBMS",
    keywords: ["dbms", "database", "sql", "tables", "schema", "relational", "er"]
  },
  {
    id: "topic-normalization",
    title: "SQL Normalization & Normal Forms",
    subtitle: "1NF, 2NF, 3NF, BCNF decomposition & keys",
    category: "Topic",
    icon: Database,
    link: "/quiz",
    keywords: ["normalization", "1nf", "2nf", "3nf", "bcnf", "keys", "functional dependency"]
  },
  {
    id: "topic-sql-joins",
    title: "SQL Joins & Group By Aggregations",
    subtitle: "INNER, LEFT, RIGHT, FULL OUTER joins & queries",
    category: "Topic",
    icon: Database,
    link: "/tutor",
    keywords: ["joins", "sql", "inner join", "left join", "group by", "having", "queries"]
  },
  {
    id: "topic-os",
    title: "Operating Systems (OS)",
    subtitle: "Process management, memory paging, file systems",
    category: "Topic",
    icon: Cpu,
    link: "/resources?search=OS",
    keywords: ["os", "operating system", "process", "threads", "memory", "paging"]
  },
  {
    id: "topic-semaphores",
    title: "Semaphores & Process Synchronization",
    subtitle: "Critical section, mutex locks, producer-consumer",
    category: "Topic",
    icon: Cpu,
    link: "/tutor",
    keywords: ["semaphores", "mutex", "synchronization", "concurrency", "deadlock", "locks"]
  },
  {
    id: "topic-dsa",
    title: "Data Structures & Algorithms (DSA)",
    subtitle: "Linked lists, binary trees, sorting, graph traversal",
    category: "Topic",
    icon: Code,
    link: "/resources?search=DSA",
    keywords: ["dsa", "data structures", "algorithms", "trees", "graphs", "sorting", "leetcode"]
  },
  {
    id: "topic-cn",
    title: "Computer Networks & Protocols",
    subtitle: "OSI model, TCP 3-way handshake, IP routing",
    category: "Topic",
    icon: Network,
    link: "/resources?search=CN",
    keywords: ["cn", "network", "tcp", "ip", "udp", "handshake", "routing", "osi"]
  }
];

interface SearchAutocompleteProps {
  className?: string;
  isMobile?: boolean;
  onSelect?: () => void;
}

export default function SearchAutocomplete({ className = "", isMobile = false, onSelect }: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { materials } = useCampus();
  const { playSound } = useSettings();
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine static catalog with real materials from Supabase
  const searchIndex = useMemo(() => {
    const list: SearchItem[] = [...staticCatalog];
    if (materials && materials.length > 0) {
      materials.forEach((mat) => {
        list.push({
          id: `mat-${mat.id}`,
          title: mat.fileName,
          subtitle: `${mat.subject} • Uploaded by ${mat.uploadedBy}`,
          category: "Material",
          icon: FileText,
          link: mat.fileUrl ? mat.fileUrl : `/resources?search=${encodeURIComponent(mat.subject)}`,
          keywords: [mat.fileName.toLowerCase(), mat.subject.toLowerCase(), "material", "notes", "file", "download"]
        });
      });
    }
    return list;
  }, [materials]);

  // Filter items matching query
  const filteredResults = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return [];

    return searchIndex.filter((item) => {
      if (item.title.toLowerCase().includes(clean)) return true;
      if (item.subtitle.toLowerCase().includes(clean)) return true;
      return item.keywords.some((kw) => kw.includes(clean));
    }).slice(0, 7); // Show top 7 results
  }, [query, searchIndex]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global shortcut ⌘K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleNavigate(item: SearchItem) {
    if (item.link.startsWith("http")) {
      window.open(item.link, "_blank");
    } else {
      navigate(item.link);
    }
    playSound("click");
    setIsOpen(false);
    setQuery("");
    if (onSelect) onSelect();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredResults.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredResults.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredResults.length > 0 && filteredResults[selectedIndex]) {
        handleNavigate(filteredResults[selectedIndex]);
      } else if (query.trim()) {
        navigate(`/resources?search=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
        if (onSelect) onSelect();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }

  const popularSuggestions = ["DBMS", "Quiz", "AI Tutor", "OS", "Recovery Plan", "DSA"];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Container */}
      <div className="relative group w-full">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400 group-focus-within:text-sky-500 transition-colors pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={isMobile ? "Search topics, quiz, tutor..." : "Search topics, tools, or notes..."}
          className="w-full pl-11 pr-10 py-2.5 rounded-2xl text-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-indigo-500 focus:bg-white/90 dark:focus:bg-slate-800/90 transition-all shadow-sm"
          aria-label="Search topics, questions, or tools"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          autoComplete="off"
        />

        {/* Clear Button */}
        {query && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown Panel */}
      {isOpen && query.trim().length > 0 && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 w-full rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/90 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {filteredResults.length > 0 ? (
            <>
              <div className="px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span>Matching Suggestions</span>
                <span>{filteredResults.length} found</span>
              </div>

              <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100/60 dark:divide-slate-800/40 p-1.5 space-y-0.5">
                {filteredResults.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleNavigate(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-indigo-50/90 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200"
                          : "hover:bg-slate-50/80 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          item.category === "Page"
                            ? "bg-indigo-100/80 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                            : item.category === "Topic"
                            ? "bg-sky-100/80 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400"
                            : "bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate leading-tight text-slate-800 dark:text-slate-100">
                            {item.title}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                              item.category === "Page"
                                ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                                : item.category === "Topic"
                                ? "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300"
                                : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                            }`}
                          >
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>

              {/* Enter prompt footer */}
              <div className="px-3.5 py-2 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span>Use ↑↓ to navigate, Enter to select</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">ESC to close</span>
              </div>
            </>
          ) : (
            /* Result Not Found State */
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/50 flex items-center justify-center text-amber-500 mx-auto mb-3 shadow-xs">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Result not found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                No matching topics, tools, or notes found for{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">"{query}"</span>.
              </p>

              {/* Quick suggestion pills */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2">
                  Try searching for:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {popularSuggestions.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setQuery(tag);
                        inputRef.current?.focus();
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 transition cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
