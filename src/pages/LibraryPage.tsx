import { BookOpen, FileText, Video, Download, Search, Play, FileCheck } from "lucide-react";
import TopBar from "../components/TopBar";
import { useState } from "react";

const mockMaterials = [
  {
    id: 1,
    title: "Database Management Systems - Chapter 4 Notes",
    course: "CS302 - DBMS",
    type: "pdf",
    icon: FileText,
    color: "text-rose-500",
    bg: "bg-rose-100",
    size: "2.4 MB",
    date: "Oct 12, 2026"
  },
  {
    id: 2,
    title: "Data Structures - Trees & Graphs Lecture",
    course: "CS201 - Data Structures",
    type: "video",
    icon: Video,
    color: "text-indigo-500",
    bg: "bg-indigo-100",
    size: "45 mins",
    date: "Oct 10, 2026"
  },
  {
    id: 3,
    title: "Operating Systems - Past Midterm Solutions",
    course: "CS305 - OS",
    type: "document",
    icon: FileCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-100",
    size: "1.1 MB",
    date: "Oct 08, 2026"
  },
  {
    id: 4,
    title: "Computer Networks - Subnetting Cheatsheet",
    course: "CS401 - Networks",
    type: "pdf",
    icon: FileText,
    color: "text-amber-500",
    bg: "bg-amber-100",
    size: "0.8 MB",
    date: "Oct 05, 2026"
  }
];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMaterials = mockMaterials.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
      <TopBar title="Digital Library" />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Study Materials</h1>
              <p className="text-sm font-medium text-slate-500">Access your notes, past papers, and recorded lectures.</p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search materials..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['All Materials', 'PDF Notes', 'Video Lectures', 'Past Papers'].map((cat, idx) => (
              <button 
                key={cat}
                className={`p-4 rounded-2xl border text-left transition-all ${idx === 0 ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'}`}
              >
                <BookOpen className={`w-6 h-6 mb-2 ${idx === 0 ? 'text-indigo-200' : 'text-indigo-500'}`} />
                <div className="font-bold">{cat}</div>
                <div className={`text-xs mt-1 ${idx === 0 ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {idx === 0 ? '42 files' : 'Explore category'}
                </div>
              </button>
            ))}
          </div>

          {/* Materials List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-bold text-slate-800">Recent Uploads</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredMaterials.map((material) => (
                <div key={material.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${material.bg} ${material.color}`}>
                    <material.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 truncate">{material.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
                      <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{material.course}</span>
                      <span>{material.size}</span>
                      <span>Added {material.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {material.type === 'video' ? (
                      <button className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 hover:scale-105 transition-all">
                        <Play className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="w-9 h-9 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-slate-100 hover:text-indigo-600 hover:scale-105 transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredMaterials.length === 0 && (
                <div className="p-8 text-center text-slate-500 font-medium">
                  No materials found matching your search.
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
