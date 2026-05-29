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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
          <Stethoscope className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
            Biomed Clinic
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Doctor availability & call activity at a glance
          </p>
        </div>
      </div>
    </div>
  );
}
