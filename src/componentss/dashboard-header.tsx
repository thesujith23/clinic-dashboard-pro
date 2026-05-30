import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";

export function DashboardHeader() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white px-6 py-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Biomed Clinic Dashboard
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Doctor availability & call activity at a glance
          </p>
        </div>
      </div>
      
      {now && (
        <div className="hidden sm:flex flex-col items-end text-sm text-slate-500 font-medium">
          <span>{now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          <span className="text-xs">{now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}
    </div>
  );
}
