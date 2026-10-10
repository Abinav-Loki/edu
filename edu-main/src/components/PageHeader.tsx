import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  badge,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {badge && (
          <div className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-100 rounded-full px-3 py-1 text-xs font-bold text-sky-600 mb-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" aria-hidden="true" />
            {badge}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
