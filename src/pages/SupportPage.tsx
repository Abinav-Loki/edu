import { useState } from "react";
import { useCampus } from "../context/CampusContext";
import PageHeader from "../components/PageHeader";
import MobileHeader from "../components/MobileHeader";
import { Ticket, Search, CheckCircle2, ShieldAlert } from "lucide-react";

export default function SupportPage() {
  const { supportTickets, addSupportTicket, activeRole } = useCampus();
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<any>("Academic");
  const [status, setStatus] = useState("idle");

  const myTickets = activeRole === "student" 
    ? supportTickets.filter(t => t.creatorId === "s1")
    : supportTickets;

  function handleSubmit() {
    if (!desc) return;
    addSupportTicket({
      creatorId: "s1", // Hardcoded to student for demo
      category,
      description: desc
    });
    setDesc("");
    setStatus("success");
    setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-4xl mx-auto">
        <PageHeader
          title="Campus Support"
          subtitle="Universal support ticket system"
          badge="AI Classified"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-slate-800">Support Tickets</h2>
            {myTickets.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-500">
                No active tickets.
              </div>
            ) : (
              <div className="space-y-3">
                {myTickets.map(ticket => (
                  <div key={ticket.id} className="glass-card p-4 flex gap-4 border-l-4 border-indigo-400">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex gap-2 items-center">
                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{ticket.category}</span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${ticket.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 mt-2 font-medium">{ticket.description}</p>
                      <p className="text-[10px] text-slate-400 mt-2">ID: {ticket.id} • {new Date(ticket.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card p-5">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Create Ticket</h2>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-400 outline-none mb-3 bg-white"
              >
                <option>Academic</option>
                <option>Mentor</option>
                <option>Technical</option>
                <option>Facilities</option>
                <option>Other</option>
              </select>
              <textarea 
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm min-h-[120px] focus:ring-2 focus:ring-indigo-400 outline-none mb-3"
              />
              <button 
                onClick={handleSubmit}
                disabled={!desc}
                className="w-full btn-primary disabled:opacity-50"
              >
                Submit Ticket
              </button>
              {status === "success" && (
                <p className="text-xs text-emerald-600 font-bold mt-2 text-center">Ticket created!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
