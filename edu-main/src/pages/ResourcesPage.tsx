import { useState } from "react";
import { FileText, Play, BookOpen, Download, Clock } from "lucide-react";
import { resources as defaultResources } from "../data/mock";
import { useCampus } from "../context/CampusContext";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";

const typeConfig: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  PDF: {
    icon: <FileText className="w-4 h-4" />,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  Video: {
    icon: <Play className="w-4 h-4" />,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  Article: {
    icon: <BookOpen className="w-4 h-4" />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
};

const filters = ["All", "PDF", "Video", "Article", "Database", "OS"];

export default function ResourcesPage() {
  const { materials } = useCampus();
  const [activeFilter, setActiveFilter] = useState("All");

  const combinedResources = [
    ...(materials && materials.length > 0
      ? materials.map((m) => ({
          id: m.id,
          title: m.fileName,
          type: (m.fileType?.toUpperCase().includes("PDF") ? "PDF" : m.fileType?.toUpperCase().includes("MP4") || m.fileType?.toUpperCase().includes("VIDEO") ? "Video" : "Article") as "PDF" | "Video" | "Article",
          subject: m.subject || "General",
          duration: m.fileSize ? `${Math.round(m.fileSize / 1024)} KB` : "15 mins",
          pages: m.fileType?.toUpperCase().includes("PDF") ? 8 : undefined
        }))
      : []),
    ...defaultResources
  ];

  const filteredResources = activeFilter === "All"
    ? combinedResources
    : combinedResources.filter(r => r.type === activeFilter || r.subject.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content">
        <PageHeader
          title="Study Resources"
          subtitle="Curated materials based on your weak topics"
          badge="Personalized"
        />

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition min-h-[36px] ${
                activeFilter === f
                  ? "primary-gradient text-white"
                  : "bg-white/70 border border-white/80 text-slate-600 hover:bg-white hover:text-indigo-600"
              }`}
              aria-pressed={activeFilter === f}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Resource grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => {
            const conf = typeConfig[resource.type] || typeConfig.PDF;
            return (
              <GlassCard
                key={resource.id}
                hover
                className="flex flex-col gap-3"
                as="article"
                aria-label={resource.title}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${conf.bg} ${conf.color} flex items-center justify-center shrink-0`}
                    aria-hidden="true"
                  >
                    {conf.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${conf.color}`}
                    >
                      {resource.type}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-800 leading-snug mt-0.5">
                      {resource.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {resource.duration}
                  </span>
                  {resource.pages && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>{resource.pages} pages</span>
                    </>
                  )}
                </div>

                <div className="text-[10px] font-semibold text-indigo-600/70 bg-indigo-50 rounded-lg px-2 py-0.5 self-start">
                  {resource.subject}
                </div>

                <button
                  onClick={() => {
                    const raw = materials?.find((m) => m.id === resource.id);
                    if (raw?.fileUrl) {
                      window.open(raw.fileUrl, "_blank");
                    } else {
                      window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(resource.title)}`, "_blank");
                    }
                  }}
                  className="btn-secondary !text-xs !py-2 mt-auto cursor-pointer"
                  aria-label={`Open ${resource.title}`}
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  {resource.type === "Video" ? "Watch Now" : "Read Now"}
                </button>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </>
  );
}
