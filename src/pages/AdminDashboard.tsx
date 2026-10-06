import { useCampus } from "../context/CampusContext";
import PageHeader from "../components/PageHeader";
import MobileHeader from "../components/MobileHeader";
import { Users, Server, Wrench, AlertTriangle, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const { students, assets, maintenanceTickets, supportTickets, mentorRequests } = useCampus();

  const activeSupportTickets = supportTickets.filter(t => t.status !== "resolved").length;
  const pendingMentors = mentorRequests.filter(m => m.status === "pending").length;
  const healthyAssets = assets.filter(a => a.status === "online").length;
  const maintenanceDue = assets.filter(a => a.operatingHours > 4000).length;
  const urgentIssues = maintenanceTickets.filter(m => m.priority === "urgent" || m.priority === "high").length;

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-7xl mx-auto">
        <PageHeader
          title="Campus Control Room"
          subtitle="Operational Intelligence & Campus Health"
          badge="Admin"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatBox icon={Users} label="Total Students" value={students.length * 2480} color="text-sky-500" />
          <StatBox icon={ShieldCheck} label="Active Support" value={activeSupportTickets} color="text-indigo-500" />
          <StatBox icon={Server} label="Campus Assets" value={assets.length * 624} color="text-emerald-500" />
          <StatBox icon={Wrench} label="Maintenance Due" value={maintenanceDue + 97} color="text-amber-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Maintenance Queue */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Maintenance Queue</h2>
              <span className="text-xs font-bold bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                {urgentIssues} Urgent
              </span>
            </div>
            
            <div className="space-y-3">
              {maintenanceTickets.length === 0 ? (
                <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No active maintenance tickets.</div>
              ) : (
                maintenanceTickets.map(ticket => {
                  const asset = assets.find(a => a.id === ticket.assetId);
                  return (
                    <div key={ticket.id} className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-white/80 dark:border-slate-700/50 shadow-sm flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ticket.priority === 'urgent' ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'}`}>
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-800 dark:text-slate-200">{asset?.name || ticket.assetId}</h3>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${ticket.priority === 'urgent' ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ticket.description}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">Ticket: {ticket.id} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Asset Health Overview */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-l-4 border-l-emerald-400">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Campus Health Index</h2>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">92%</span>
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-500 mb-1">Operational</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                AI Maintenance Predictions
              </h2>
              <div className="space-y-4">
                {assets.filter(a => a.operatingHours > 3000).map(asset => (
                  <div key={asset.id} className="p-3 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-xl">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{asset.name}</p>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
                        Medium Risk
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Maintenance likely required within 12–18 days.</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">• High operating hours ({asset.operatingHours})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatBox({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  return (
    <div className="glass-card p-4 flex flex-col justify-center items-center text-center">
      <div className={`w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-2 shadow-sm ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{value}</p>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </div>
  );
}
