import { useState, useMemo, useEffect } from "react";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  Search,
  Play,
  FileCheck,
  X,
  Eye,
  CheckCircle2,
  Sparkles,
  Layers,
  ExternalLink,
  Clock
} from "lucide-react";
import { useCampus } from "../context/CampusContext";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";

function YoutubeIcon({ className = "w-5 h-5 text-red-600" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export type LibraryCategory = "all" | "pdf" | "video" | "past_paper";

export interface SelectedResource {
  id: string | number;
  title: string;
  course: string;
  type: "pdf" | "video" | "past_paper" | "youtube";
  size?: string;
  duration?: string;
  date?: string;
  description: string;
  uploadedBy?: string;
  youtubeUrl?: string;
}

export interface LibraryItem {
  id: string | number;
  title: string;
  course: string;
  type: "pdf" | "video" | "past_paper";
  size: string;
  date: string;
  description?: string;
  uploadedBy?: string;
  url?: string;
}

export interface YouTubeVideoSuggestion {
  id: string;
  title: string;
  subject: "DBMS" | "DSA" | "Operating Systems" | "Computer Networks" | "General";
  description: string;
  duration: string;
  youtubeUrl: string;
  searchTopic: string;
}

// ---------------------------------------------------------------------------
// 1. FUTURE API-READY YOUTUBE SUGGESTIONS ENGINE
// ---------------------------------------------------------------------------

export const curatedYouTubeVideos: YouTubeVideoSuggestion[] = [
  // DBMS
  {
    id: "yt-dbms-1",
    title: "DBMS Normalization (1NF, 2NF, 3NF, BCNF) Made Easy",
    subject: "DBMS",
    description: "Learn relational database normalization rules with step-by-step table functional dependency decomposition.",
    duration: "38 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=DBMS+Normalization+1NF+2NF+3NF+BCNF",
    searchTopic: "DBMS Normalization"
  },
  {
    id: "yt-dbms-2",
    title: "SQL Joins & Complex Queries Visual Breakdown",
    subject: "DBMS",
    description: "Master INNER, LEFT, RIGHT, and FULL OUTER joins with interactive database tables and query performance tips.",
    duration: "28 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=SQL+Joins+DBMS+Tutorial",
    searchTopic: "SQL Joins"
  },
  {
    id: "yt-dbms-3",
    title: "ER Model to Relational Schema Mapping",
    subject: "DBMS",
    description: "Converting Entity-Relationship diagrams into clean relational database schemas and primary key constraints.",
    duration: "22 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=ER+Model+to+Relational+Schema+DBMS",
    searchTopic: "ER Model"
  },
  {
    id: "yt-dbms-4",
    title: "Transactions, Concurrency & ACID Properties",
    subject: "DBMS",
    description: "Deep dive into Atomicity, Consistency, Isolation, Durability, two-phase locking, and schedule serializability.",
    duration: "42 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=DBMS+Transactions+ACID+Properties",
    searchTopic: "Transactions and ACID"
  },

  // DSA
  {
    id: "yt-dsa-1",
    title: "Binary Trees & BST Traversals (Inorder, Preorder, Postorder)",
    subject: "DSA",
    description: "Complete visual explanation of binary search trees, insertion, deletion, and level-order BFS traversal.",
    duration: "45 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=Binary+Trees+Traversals+DSA",
    searchTopic: "Binary Trees"
  },
  {
    id: "yt-dsa-2",
    title: "Graph Algorithms (BFS, DFS, Dijkstra & Kruskal)",
    subject: "DSA",
    description: "Graph representations using Adjacency Lists, shortest path calculation, and minimum spanning trees.",
    duration: "55 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=Graph+Algorithms+BFS+DFS+Dijkstra",
    searchTopic: "Graph Algorithms"
  },
  {
    id: "yt-dsa-3",
    title: "Sorting Algorithms (Quick Sort, Merge Sort, Heap Sort)",
    subject: "DSA",
    description: "Comparative time and space complexity analysis of divide-and-conquer sorting with live code trace.",
    duration: "35 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=Quick+Sort+Merge+Sort+Heap+Sort+DSA",
    searchTopic: "Sorting Algorithms"
  },
  {
    id: "yt-dsa-4",
    title: "Dynamic Programming Masterclass (Memoization & Tabulation)",
    subject: "DSA",
    description: "Step-by-step approach to solving 0/1 Knapsack, Longest Common Subsequence, and Fibonacci DP problems.",
    duration: "50 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=Dynamic+Programming+DSA+Tutorial",
    searchTopic: "Dynamic Programming"
  },

  // Operating Systems
  {
    id: "yt-os-1",
    title: "CPU Scheduling Algorithms (FCFS, SJF, Priority, Round Robin)",
    subject: "Operating Systems",
    description: "Calculate Gantt charts, average waiting time, and turnaround time for pre-emptive and non-pre-emptive OS scheduling.",
    duration: "40 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=CPU+Scheduling+Algorithms+Operating+Systems",
    searchTopic: "Process Scheduling"
  },
  {
    id: "yt-os-2",
    title: "Deadlocks Characterization & Banker's Algorithm",
    subject: "Operating Systems",
    description: "Deadlock conditions, Resource Allocation Graphs, prevention, avoidance, and safety algorithm calculation.",
    duration: "34 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=Deadlock+Bankers+Algorithm+Operating+Systems",
    searchTopic: "Deadlocks"
  },
  {
    id: "yt-os-3",
    title: "Virtual Memory & Page Replacement Algorithms (FIFO, LRU, Optimal)",
    subject: "Operating Systems",
    description: "Paging mechanisms, TLB hardware execution, page fault handling, and frame allocation strategies.",
    duration: "48 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=Virtual+Memory+Paging+Page+Replacement+OS",
    searchTopic: "Virtual Memory"
  },
  {
    id: "yt-os-4",
    title: "File Systems Architecture & Disk Scheduling (SCAN, C-SCAN)",
    subject: "Operating Systems",
    description: "Inodes, block allocation methods, directory structures, and disk head seek time optimization algorithms.",
    duration: "30 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=Disk+Scheduling+Algorithms+Operating+Systems",
    searchTopic: "File Systems"
  },

  // Computer Networks
  {
    id: "yt-cn-1",
    title: "TCP/IP Protocol Suite & 3-Way Handshake Deep Dive",
    subject: "Computer Networks",
    description: "Flow control, sliding window protocol, TCP segment structure, and reliable connection establishment.",
    duration: "36 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=TCP+IP+3+Way+Handshake+Computer+Networks",
    searchTopic: "TCP/IP"
  },
  {
    id: "yt-cn-2",
    title: "OSI 7-Layer Model Architectural Breakdown",
    subject: "Computer Networks",
    description: "Layer-by-layer responsibilities from Physical to Application layer with practical data encapsulation.",
    duration: "25 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=OSI+7+Layer+Model+Computer+Networks",
    searchTopic: "OSI Model"
  },
  {
    id: "yt-cn-3",
    title: "Routing Algorithms (Distance Vector vs. Link State)",
    subject: "Computer Networks",
    description: "Bellman-Ford algorithm, Dijkstra's link state routing, OSPF, and RIP protocol implementation.",
    duration: "44 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=Routing+Algorithms+Distance+Vector+Link+State",
    searchTopic: "Routing Algorithms"
  },
  {
    id: "yt-cn-4",
    title: "HTTP, HTTPS & SSL/TLS Security Handshake",
    subject: "Computer Networks",
    description: "Web protocol request/response cycles, status codes, public key infrastructure, and SSL certificate validation.",
    duration: "30 mins",
    youtubeUrl: "https://www.youtube.com/results?search_query=HTTP+HTTPS+TLS+Handshake+Computer+Networks",
    searchTopic: "HTTP and HTTPS"
  }
];

export function getVideoSuggestions(query: string): YouTubeVideoSuggestion[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return curatedYouTubeVideos;

  return curatedYouTubeVideos.filter(
    (v) =>
      v.title.toLowerCase().includes(normalizedQuery) ||
      v.subject.toLowerCase().includes(normalizedQuery) ||
      v.searchTopic.toLowerCase().includes(normalizedQuery) ||
      v.description.toLowerCase().includes(normalizedQuery)
  );
}

export function getYouTubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`;
}

// ---------------------------------------------------------------------------
// 2. STATIC DIGITAL LIBRARY MATERIALS DATASET
// ---------------------------------------------------------------------------

const staticLibraryMaterials: LibraryItem[] = [
  {
    id: "lib-1",
    title: "Database Management Systems - Chapter 4 Relational Algebra Notes",
    course: "CS302 - DBMS",
    type: "pdf",
    size: "2.4 MB",
    date: "Oct 12, 2026",
    description: "Comprehensive notes covering tuple relational calculus, domain relational calculus, and query optimization.",
    uploadedBy: "Prof. Rahul Kumar"
  },
  {
    id: "lib-2",
    title: "Data Structures - Trees & Graphs Comprehensive Lecture",
    course: "CS201 - Data Structures",
    type: "video",
    size: "45 mins",
    date: "Oct 10, 2026",
    description: "Detailed video walkthrough of AVL tree rotations, Dijkstra's algorithm, and topological sorting.",
    uploadedBy: "Prof. Priya Sharma"
  },
  {
    id: "lib-3",
    title: "Operating Systems - Past Midterm Examination & Detailed Solutions",
    course: "CS305 - OS",
    type: "past_paper",
    size: "1.1 MB",
    date: "Oct 08, 2026",
    description: "Previous year midterm question paper with step-by-step solutions for CPU scheduling & semaphores.",
    uploadedBy: "Department Exam Cell"
  },
  {
    id: "lib-4",
    title: "Computer Networks - Subnetting & IP Addressing Cheatsheet",
    course: "CS401 - Networks",
    type: "pdf",
    size: "0.8 MB",
    date: "Oct 05, 2026",
    description: "Quick reference guide for CIDR notation, variable length subnet masking (VLSM), and IPv6 headers.",
    uploadedBy: "Prof. Vikram Das"
  },
  {
    id: "lib-5",
    title: "SQL Joins & Complex Subqueries Deep-Dive Walkthrough",
    course: "CS302 - DBMS",
    type: "video",
    size: "32 mins",
    date: "Oct 03, 2026",
    description: "Visual breakdown of INNER, LEFT, RIGHT, FULL OUTER joins and correlated subqueries with practical DB examples.",
    uploadedBy: "Prof. Rahul Kumar"
  },
  {
    id: "lib-6",
    title: "DBMS End Semester Examination 2025 Solved Paper",
    course: "CS302 - DBMS",
    type: "past_paper",
    size: "1.8 MB",
    date: "Sep 28, 2026",
    description: "Complete official 2025 end-term exam paper with solution key covering B+ Trees, 3NF/BCNF, and ACID properties.",
    uploadedBy: "Academic Cell"
  },
  {
    id: "lib-7",
    title: "Operating Systems - Process Synchronization & Semaphore Handouts",
    course: "CS305 - OS",
    type: "pdf",
    size: "3.2 MB",
    date: "Sep 25, 2026",
    description: "Lecture handouts explaining Readers-Writers problem, Dining Philosophers problem, and mutex implementation.",
    uploadedBy: "Prof. Ananya Roy"
  },
  {
    id: "lib-8",
    title: "Virtual Memory & Paging Mechanisms Video Masterclass",
    course: "CS305 - OS",
    type: "video",
    size: "50 mins",
    date: "Sep 20, 2026",
    description: "In-depth video explanation of Page Tables, TLB hits/misses, FIFO/LRU page replacement algorithms.",
    uploadedBy: "Prof. Ananya Roy"
  },
  {
    id: "lib-9",
    title: "Data Structures & Algorithms Final Exam 2024 Past Paper",
    course: "CS201 - Data Structures",
    type: "past_paper",
    size: "2.0 MB",
    date: "Sep 15, 2026",
    description: "2024 final examination paper with code snippets, time complexity analysis, and tree traversal problems.",
    uploadedBy: "Department Exam Cell"
  }
];

const quickSearchTopics = [
  "DBMS Normalization",
  "SQL Joins",
  "Binary Trees",
  "Graph Algorithms",
  "Deadlocks",
  "Process Scheduling",
  "TCP/IP",
  "OSI Model"
];

// Helper to convert LibraryItem into unified SelectedResource format
function libraryItemToSelectedResource(item: LibraryItem): SelectedResource {
  return {
    id: item.id,
    title: item.title,
    course: item.course,
    type: item.type,
    size: item.size,
    date: item.date,
    description: item.description || "Study material available in CampusOS Digital Library.",
    uploadedBy: item.uploadedBy || "Faculty Uploader"
  };
}

// Helper to convert YouTubeVideoSuggestion into unified SelectedResource format
function youtubeToSelectedResource(yt: YouTubeVideoSuggestion): SelectedResource {
  return {
    id: yt.id,
    title: yt.title,
    course: `Subject: ${yt.subject}`,
    type: "youtube",
    duration: yt.duration,
    description: yt.description,
    uploadedBy: "YouTube Video Suggestion",
    youtubeUrl: yt.youtubeUrl
  };
}

export default function LibraryPage() {
  const { materials: userUploadedMaterials } = useCampus();
  const [activeCategory, setActiveCategory] = useState<LibraryCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // SINGLE PERSISTENT SOURCE OF TRUTH for central resource detail viewer
  const [selectedResource, setSelectedResource] = useState<SelectedResource | null>(
    libraryItemToSelectedResource(staticLibraryMaterials[0])
  );

  // Map user uploaded materials from CampusContext into LibraryItem format
  const formattedUserMaterials: LibraryItem[] = (userUploadedMaterials || []).map((m) => {
    let itemType: "pdf" | "video" | "past_paper" = "pdf";
    const typeLower = (m.fileType || "").toLowerCase();
    const nameLower = (m.fileName || "").toLowerCase();
    if (typeLower.includes("video") || nameLower.endsWith(".mp4") || nameLower.endsWith(".mkv")) {
      itemType = "video";
    } else if (typeLower.includes("paper") || nameLower.includes("exam") || nameLower.includes("past")) {
      itemType = "past_paper";
    }

    return {
      id: m.id,
      title: m.fileName || "Uploaded Material",
      course: m.subject ? `Subject: ${m.subject}` : "General Study",
      type: itemType,
      size: m.fileSize ? `${(m.fileSize / (1024 * 1024)).toFixed(1)} MB` : "1.5 MB",
      date: new Date(m.uploadedAt || Date.now()).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      description: m.description || "Uploaded by student into CampusOS storage.",
      uploadedBy: m.uploadedBy || "Student Upload"
    };
  });

  const allCombinedMaterials = useMemo(
    () => [...staticLibraryMaterials, ...formattedUserMaterials],
    [userUploadedMaterials]
  );

  // Dynamically compute resource counts per category
  const counts = useMemo(
    () => ({
      all: allCombinedMaterials.length,
      pdf: allCombinedMaterials.filter((m) => m.type === "pdf").length,
      video: allCombinedMaterials.filter((m) => m.type === "video").length,
      past_paper: allCombinedMaterials.filter((m) => m.type === "past_paper").length
    }),
    [allCombinedMaterials]
  );

  // Filter materials reactively by category AND search query
  const filteredMaterials = useMemo(() => {
    return allCombinedMaterials.filter((m) => {
      const matchesCategory = activeCategory === "all" || m.type === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        m.title.toLowerCase().includes(query) ||
        m.course.toLowerCase().includes(query) ||
        (m.description && m.description.toLowerCase().includes(query)) ||
        (m.uploadedBy && m.uploadedBy.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [allCombinedMaterials, activeCategory, searchQuery]);

  // Get matching YouTube Video suggestions for Video Lectures view
  const videoSuggestions = useMemo(
    () => getVideoSuggestions(searchQuery),
    [searchQuery]
  );

  // Keep selectedResource gracefully synchronized when category or search changes
  useEffect(() => {
    if (!selectedResource) return;

    let isStillVisible = false;
    if (activeCategory === "video") {
      const inVideos = filteredMaterials.some((m) => m.id === selectedResource.id);
      const inYt = videoSuggestions.some((v) => v.id === selectedResource.id);
      isStillVisible = inVideos || inYt;
    } else {
      isStillVisible = filteredMaterials.some((m) => m.id === selectedResource.id);
    }

    if (!isStillVisible) {
      if (activeCategory === "video" && videoSuggestions.length > 0) {
        setSelectedResource(youtubeToSelectedResource(videoSuggestions[0]));
      } else if (filteredMaterials.length > 0) {
        setSelectedResource(libraryItemToSelectedResource(filteredMaterials[0]));
      }
    }
  }, [activeCategory, searchQuery]);

  // Category Configuration Card Definitions
  const categories: {
    id: LibraryCategory;
    title: string;
    icon: typeof BookOpen;
    count: number;
    gradient: string;
    activeBorder: string;
    badgeBg: string;
  }[] = [
    {
      id: "all",
      title: "All Materials",
      icon: Layers,
      count: counts.all,
      gradient: "from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg shadow-indigo-500/25",
      activeBorder: "border-indigo-500 ring-2 ring-indigo-400/40",
      badgeBg: "bg-white/20 text-white"
    },
    {
      id: "pdf",
      title: "PDF Notes",
      icon: FileText,
      count: counts.pdf,
      gradient: "from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/25",
      activeBorder: "border-rose-500 ring-2 ring-rose-400/40",
      badgeBg: "bg-white/20 text-white"
    },
    {
      id: "video",
      title: "Video Lectures",
      icon: Video,
      count: counts.video,
      gradient: "from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-500/25",
      activeBorder: "border-sky-500 ring-2 ring-sky-400/40",
      badgeBg: "bg-white/20 text-white"
    },
    {
      id: "past_paper",
      title: "Past Papers",
      icon: FileCheck,
      count: counts.past_paper,
      gradient: "from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25",
      activeBorder: "border-emerald-500 ring-2 ring-emerald-400/40",
      badgeBg: "bg-white/20 text-white"
    }
  ];

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-7xl mx-auto">
        {/* Header & Title */}
        <PageHeader
          title="Digital Library"
          subtitle="Access curated lecture notes, YouTube video lectures, and previous examination papers"
          badge="CampusOS Repository"
        />

        {/* Search Bar & Category Controls Header */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={
                activeCategory === "video"
                  ? "Search video lectures or topics (e.g. DBMS Normalization, Deadlocks)..."
                  : "Search by title, subject, course code, or professor..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all shadow-2xs font-medium"
              aria-label="Search study materials"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 self-center">
              <span>Showing results for</span>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold border border-indigo-200">
                "{searchQuery}"
              </span>
            </div>
          )}
        </div>

        {/* CATEGORY FEATURE CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const CategoryIcon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`group relative p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden ${
                  isActive
                    ? `bg-gradient-to-br ${cat.gradient} ${cat.activeBorder} scale-[1.02]`
                    : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700/80 hover:border-indigo-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
                }`}
                aria-pressed={isActive}
              >
                {isActive && (
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                )}

                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isActive
                        ? "bg-white/20 backdrop-blur-md text-white"
                        : cat.id === "pdf"
                        ? "bg-rose-50 text-rose-600"
                        : cat.id === "video"
                        ? "bg-sky-50 text-sky-600"
                        : cat.id === "past_paper"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    <CategoryIcon className="w-5 h-5" />
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      isActive
                        ? cat.badgeBg
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {cat.count} {cat.count === 1 ? "resource" : "resources"}
                  </span>
                </div>

                <div className="font-extrabold text-sm sm:text-base leading-snug">
                  {cat.title}
                </div>
                <div
                  className={`text-xs mt-1 font-medium ${
                    isActive ? "text-white/80" : "text-slate-400"
                  }`}
                >
                  {cat.id === "all"
                    ? "Complete repository"
                    : cat.id === "pdf"
                    ? "Read & download"
                    : cat.id === "video"
                    ? "YouTube & lectures"
                    : "Exam preparation"}
                </div>
              </button>
            );
          })}
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* TWO-COLUMN LAYOUT: LEFT RESOURCE LIST / RIGHT PERSISTENT CENTRAL DETAIL VIEWER */}
        {/* ------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT / MAIN COLUMN: RESOURCE LIST & CATEGORY CONTENT (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {activeCategory === "video" ? (
              <div className="space-y-6">
                {/* Quick Topic Chips for Fast Search */}
                <div className="glass-card p-4 rounded-2xl border border-sky-100/90 shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <YoutubeIcon className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Quick Search Topics:
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {quickSearchTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setSearchQuery(topic)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                          searchQuery.toLowerCase().trim() === topic.toLowerCase()
                            ? "bg-red-600 text-white font-bold shadow-2xs"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                        }`}
                      >
                        <span>{topic}</span>
                      </button>
                    ))}
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        Clear Filter
                      </button>
                    )}
                  </div>
                </div>

                {/* Internal Video Recordings */}
                {filteredMaterials.length > 0 && (
                  <div className="glass-card rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="p-4 sm:px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-sky-600" />
                        <h2 className="font-bold text-slate-800 text-sm">
                          Faculty Recordings ({filteredMaterials.length})
                        </h2>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {filteredMaterials.map((item) => {
                        const isSelected = selectedResource?.id === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedResource(libraryItemToSelectedResource(item))}
                            className={`p-4 flex items-center justify-between gap-3 transition cursor-pointer ${
                              isSelected
                                ? "bg-sky-50/90 border-l-4 border-sky-500"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                                <Play className="w-4 h-4 fill-current" />
                              </div>
                              <div className="truncate">
                                <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded mr-2">
                                  {item.course}
                                </span>
                                <h3 className="text-xs font-bold text-slate-800 truncate inline">{item.title}</h3>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-sky-600 shrink-0">Select →</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* YouTube Video Suggestions Header */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <YoutubeIcon className="w-5 h-5 text-red-600" />
                    <h2 className="text-sm font-bold text-slate-800">
                      YouTube Video Suggestions
                    </h2>
                  </div>

                  {searchQuery && (
                    <a
                      href={getYouTubeSearchUrl(searchQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
                    >
                      <span>Search YouTube ↗</span>
                    </a>
                  )}
                </div>

                {/* Video Suggestion Cards List */}
                {videoSuggestions.length > 0 ? (
                  <div className="space-y-3">
                    {videoSuggestions.map((video) => {
                      const isSelected = selectedResource?.id === video.id;
                      return (
                        <div
                          key={video.id}
                          onClick={() => setSelectedResource(youtubeToSelectedResource(video))}
                          className={`glass-card p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                            isSelected
                              ? "border-red-500 bg-red-50/40 ring-2 ring-red-400/30 shadow-xs"
                              : "border-slate-200 hover:border-red-300 hover:shadow-2xs"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {video.subject}
                              </span>
                              {video.duration && (
                                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {video.duration}
                                </span>
                              )}
                            </div>

                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug flex items-center gap-1.5">
                              <YoutubeIcon className="w-4 h-4 text-red-600 shrink-0" />
                              <span className="truncate">{video.title}</span>
                            </h3>

                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {video.description}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="text-xs font-bold text-red-600">Select →</span>
                            <a
                              href={video.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 transition"
                            >
                              <span>YouTube</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* SEARCH FALLBACK FOR ARBITRARY QUERY */
                  <div className="p-6 text-center glass-card rounded-2xl border border-red-200 bg-red-50/20 flex flex-col items-center justify-center">
                    <YoutubeIcon className="w-8 h-8 text-red-600 mb-2" />
                    <h3 className="text-sm font-bold text-slate-800 mb-1">
                      No pre-indexed lecture for "{searchQuery}"
                    </h3>
                    <p className="text-xs text-slate-600 mb-4">
                      Search YouTube directly for video lectures and tutorials on "{searchQuery}".
                    </p>
                    <a
                      href={getYouTubeSearchUrl(searchQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 transition"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search YouTube for "{searchQuery}"</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* STANDARD MATERIALS LIST (ALL MATERIALS, PDF NOTES, PAST PAPERS) */
              <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {activeCategory === "all"
                        ? "All Study Materials"
                        : categories.find((c) => c.id === activeCategory)?.title}
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {filteredMaterials.length} items
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredMaterials.map((item) => {
                    const isPdf = item.type === "pdf";
                    const isVideo = item.type === "video";
                    const isPastPaper = item.type === "past_paper";
                    const isSelected = selectedResource?.id === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedResource(libraryItemToSelectedResource(item))}
                        className={`p-4 flex items-center justify-between gap-4 transition cursor-pointer ${
                          isSelected
                            ? "bg-indigo-50/90 dark:bg-indigo-950/40 border-l-4 border-indigo-600"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              isPdf
                                ? "bg-rose-50 text-rose-600"
                                : isVideo
                                ? "bg-sky-50 text-sky-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}
                          >
                            {isPdf && <FileText className="w-4 h-4" />}
                            {isVideo && <Video className="w-4 h-4" />}
                            {isPastPaper && <FileCheck className="w-4 h-4" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                {item.course}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{item.size}</span>
                            </div>
                            <h3 className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-indigo-900 dark:text-indigo-200 font-extrabold' : 'text-slate-800 dark:text-slate-200'}`}>
                              {item.title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                            {isSelected ? 'Active ✓' : 'Select →'}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {filteredMaterials.length === 0 && (
                    <div className="p-8 text-center flex flex-col items-center justify-center bg-white dark:bg-slate-900">
                      <BookOpen className="w-8 h-8 text-indigo-400 mb-2" />
                      <h3 className="text-sm font-bold text-slate-800 mb-1">No materials found</h3>
                      <p className="text-xs text-slate-500 mb-3">Try adjusting your search query or category filter.</p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition"
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: SINGLE PERSISTENT CENTRAL RESOURCE DETAIL VIEWER (lg:col-span-5) */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            <div className="glass-card rounded-2xl border border-indigo-100/90 dark:border-slate-800 shadow-md p-5 sm:p-6 space-y-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Resource Viewer
                  </span>
                </div>
                {selectedResource && (
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      selectedResource.type === "youtube"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : selectedResource.type === "video"
                        ? "bg-sky-100 text-sky-700 border border-sky-200"
                        : selectedResource.type === "past_paper"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-rose-100 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {selectedResource.type === "youtube"
                      ? "YouTube Lecture"
                      : selectedResource.type === "video"
                      ? "Video Recording"
                      : selectedResource.type === "past_paper"
                      ? "Past Paper"
                      : "PDF Notes"}
                  </span>
                )}
              </div>

              {selectedResource ? (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 inline-block mb-2">
                      {selectedResource.course}
                    </span>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                      {selectedResource.title}
                    </h2>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedResource.description}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Size / Duration</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200 mt-0.5 block">
                        {selectedResource.size || selectedResource.duration || "Standard Resource"}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Source / Author</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200 mt-0.5 block truncate">
                        {selectedResource.uploadedBy || "Faculty Uploader"}
                      </span>
                    </div>
                  </div>

                  {/* ACTION BUTTONS BASED ON RESOURCE TYPE */}
                  <div className="pt-2">
                    {selectedResource.type === "youtube" && selectedResource.youtubeUrl ? (
                      <a
                        href={selectedResource.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/30 cursor-pointer text-xs sm:text-sm"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-4 h-4 text-red-200" />
                      </a>
                    ) : selectedResource.type === "video" ? (
                      <button
                        onClick={() => {
                          if (selectedResource.youtubeUrl) {
                            window.open(selectedResource.youtubeUrl, "_blank", "noopener,noreferrer");
                          } else {
                            window.open(getYouTubeSearchUrl(selectedResource.title), "_blank", "noopener,noreferrer");
                          }
                        }}
                        className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/30 cursor-pointer text-xs sm:text-sm"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Watch Video Recording ↗</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Downloading ${selectedResource.title}...`)}
                        className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span>{selectedResource.type === "past_paper" ? "Download Past Paper" : "Download PDF Notes"}</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold">Select any resource from the list to view details.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
