import { DashboardHeader } from "@/componentss/dashboard-header";
import { DoctorCard, doctors } from "@/componentss/doctor-card";
import { CallLogsTable } from "@/componentss/call-logs-table";

export default function DashboardPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-slate-50/50 overflow-hidden -mx-8 -my-6 px-8 py-6">
      {/* Premium Background Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[35%] h-[35%] rounded-full bg-emerald-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-400/15 blur-[120px] pointer-events-none" />

      <div className="relative space-y-10 max-w-[1600px] mx-auto pb-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <DashboardHeader />

        <div className="grid gap-10">
          <section className="space-y-5">
            <div className="flex items-center justify-between px-1 bg-white/40 backdrop-blur-xl border border-white/60 p-4 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100/80 flex items-center justify-center border border-blue-200/50 text-blue-600 font-bold shadow-sm">
                  D
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Doctors & Availability</h2>
                  <p className="text-xs font-medium text-slate-500">Manage schedules and blocks</p>
                </div>
              </div>
              <span className="text-sm text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">{doctors.length} on staff</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((d) => (
                <DoctorCard key={d.name} doctor={d} />
              ))}
            </div>
          </section>
          
          <section className="space-y-5 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between px-1 bg-white/40 backdrop-blur-xl border border-white/60 p-4 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-100/80 flex items-center justify-center border border-indigo-200/50 text-indigo-600 font-bold shadow-sm">
                  C
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Call Activity</h2>
                  <p className="text-xs font-medium text-slate-500">View live incoming and outgoing calls</p>
                </div>
              </div>
              <span className="text-sm text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                Auto-refreshes 60s
              </span>
            </div>
            <CallLogsTable />
          </section>
        </div>
      </div>
    </div>
  );
}
