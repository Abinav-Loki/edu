import { Link } from "react-router-dom";
import { ArrowRight, Bot, MessageSquare } from "lucide-react";

export default function AIRobotCard() {
  return (
    <div
      className="glass-card flex flex-col p-6 border-white/60 dark:border-slate-800/80 shadow-md shadow-violet-500/5 bg-gradient-to-br from-indigo-50/70 to-purple-50/70 dark:from-slate-900/80 dark:to-indigo-950/50"
      role="complementary"
      aria-label="AI Tutor Preview"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200 dark:border-indigo-800">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">AI Tutor</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Let's learn, not just get answers.</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 mb-6">
        {/* AI Message */}
        <div className="flex items-start gap-2 max-w-[90%]">
          <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 mt-1">
            <Bot className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/80 dark:border-slate-700/80 p-3 rounded-2xl rounded-tl-sm text-[13px] text-slate-700 dark:text-slate-200 font-medium shadow-sm">
            Which concept do you think this problem is testing?
          </div>
        </div>

        {/* Student Message */}
        <div className="flex flex-col items-end gap-1">
          <div className="bg-sky-500 text-white p-3 rounded-2xl rounded-tr-sm text-[13px] font-medium shadow-md shadow-sky-500/20 max-w-[85%]">
            I think it's about SQL joins.
          </div>
        </div>

        {/* AI Message 2 */}
        <div className="flex items-start gap-2 max-w-[90%]">
          <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 mt-1">
            <Bot className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/80 dark:border-slate-700/80 p-3 rounded-2xl rounded-tl-sm text-[13px] text-slate-700 dark:text-slate-200 font-medium shadow-sm">
            Great! Let's explore why.
          </div>
        </div>
      </div>

      <Link
        to="/tutor"
        className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-white/70 dark:bg-slate-800/80 hover:bg-white/90 dark:hover:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 transition-all shadow-sm hover:shadow"
        aria-label="Continue with AI Tutor"
      >
        <MessageSquare className="w-4 h-4" />
        Continue with AI Tutor
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
