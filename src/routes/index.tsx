import { DashboardHeader } from "@/componentss/dashboard-header";
import { DoctorCard, doctors } from "@/componentss/doctor-card";
import { CallLogsTable } from "@/componentss/call-logs-table";

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-8">
      <DashboardHeader />

      <div className="grid gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Doctors & Availability</h2>
            <span className="text-sm text-slate-500 font-medium">{doctors.length} on staff</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <DoctorCard key={d.name} doctor={d} />
            ))}
          </div>
        </section>
        <section className="space-y-4 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Call Activity</h2>
            <span className="text-sm text-slate-500 flex items-center gap-2 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Auto-refreshes every 60s
            </span>
          </div>
          <CallLogsTable />
        </section>
      </div>
    </div>
  );
}
