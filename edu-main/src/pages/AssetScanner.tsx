import { useState } from "react";
import { useCampus } from "../context/CampusContext";
import { calculateMaintenancePrediction } from "../engines/maintenancePrediction";
import PageHeader from "../components/PageHeader";
import MobileHeader from "../components/MobileHeader";
import { QrCode, Server, Activity, Wrench, ShieldAlert } from "lucide-react";

export default function AssetScanner() {
  const { assets, addMaintenanceTicket } = useCampus();
  const [scannedAssetId, setScannedAssetId] = useState<string | null>(null);
  const [issueDesc, setIssueDesc] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<"idle" | "success">("idle");

  const asset = scannedAssetId ? assets.find(a => a.id === scannedAssetId) : null;
  const prediction = asset ? calculateMaintenancePrediction(asset) : null;

  function handleReportSubmit() {
    if (!asset || !issueDesc) return;
    
    addMaintenanceTicket({
      assetId: asset.id,
      description: issueDesc,
      priority: prediction?.riskLevel === "CRITICAL" ? "urgent" : "medium"
    });
    
    setTicketStatus("success");
    setIsReporting(false);
    setTimeout(() => {
      setTicketStatus("idle");
      setIssueDesc("");
    }, 3000);
  }

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-3xl mx-auto">
        <PageHeader
          title="QR Asset Scanner"
          subtitle="Scan campus assets to view profile or report issues"
          badge="Smart Campus"
        />

        {!asset && (
          <div className="glass-card p-10 flex flex-col items-center justify-center text-center mb-6 border-dashed border-2 border-slate-300 bg-slate-50/50">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-500 flex items-center justify-center mb-4">
              <QrCode className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">Simulate QR Scan</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-xs">Select a demo asset below to simulate scanning its QR code on campus.</p>
            
            <div className="flex gap-3">
              {assets.map(a => (
                <button 
                  key={a.id}
                  onClick={() => setScannedAssetId(a.id)}
                  className="px-4 py-2 bg-white border border-indigo-200 text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-50 transition shadow-sm"
                >
                  Scan {a.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {asset && prediction && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <button 
              onClick={() => { setScannedAssetId(null); setIsReporting(false); }}
              className="text-sm font-bold text-indigo-600 mb-4 hover:underline"
            >
              ← Scan another asset
            </button>

            <div className="glass-card overflow-hidden border border-white/80 shadow-lg shadow-black/5">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{asset.name}</h2>
                  <p className="text-slate-400 font-medium text-sm mt-1">{asset.category} • {asset.building} / Room {asset.room}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Server className="w-6 h-6 text-sky-400" />
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Health Score
                    </p>
                    <p className={`text-2xl font-black mt-1 ${prediction.healthScore > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {prediction.healthScore}/100
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Prediction
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {prediction.predictionWindow}
                    </p>
                  </div>
                </div>

                <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100">
                  <h3 className="font-bold text-slate-800 text-sm mb-2">AI Health Insights</h3>
                  <ul className="space-y-1">
                    {prediction.explanation.map((exp, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-sky-400 mt-0.5">•</span> {exp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-sm text-slate-500 font-medium grid grid-cols-2 gap-2">
                  <p>Operating Hours: <span className="text-slate-800">{asset.operatingHours}h</span></p>
                  <p>Last Service: <span className="text-slate-800">{asset.lastService}</span></p>
                </div>

                {ticketStatus === "success" && (
                  <div className="p-3 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-200 text-center">
                    Maintenance ticket submitted successfully!
                  </div>
                )}

                {!isReporting && ticketStatus !== "success" ? (
                  <button 
                    onClick={() => setIsReporting(true)}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-4 h-4" />
                    Report Issue
                  </button>
                ) : isReporting && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-[fadeIn_0.2s]">
                    <h3 className="font-bold text-slate-800 text-sm mb-3">Report Maintenance Issue</h3>
                    <textarea 
                      value={issueDesc}
                      onChange={e => setIssueDesc(e.target.value)}
                      placeholder="Describe the issue (e.g. Projector lamp is flickering)"
                      className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3 min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <button onClick={handleReportSubmit} disabled={!issueDesc} className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm font-bold disabled:opacity-50 hover:bg-indigo-700 transition">
                        Submit Ticket
                      </button>
                      <button onClick={() => setIsReporting(false)} className="flex-1 bg-white border border-slate-200 text-slate-700 rounded-lg py-2 text-sm font-bold hover:bg-slate-100 transition">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
