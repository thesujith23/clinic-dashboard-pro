import { DashboardHeader } from "@/componentss/dashboard-header";
import { DoctorCard, doctors } from "@/componentss/doctor-card";
import { CallLogsTable } from "@/componentss/call-logs-table";
import { Stethoscope, Phone } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader />

      <div className="grid gap-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600 shadow-sm">
                <Stethoscope className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-800">Doctors & Availability</h2>
                <p className="text-[13px] text-slate-500 font-medium">Manage schedules and blocks</p>
              </div>
            </div>
            <span className="text-xs text-blue-700 font-bold bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">{doctors.length} on staff</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <DoctorCard key={d.name} doctor={d} />
            ))}
          </div>
        </section>
        
        <section className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-600 shadow-sm">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-800">Call Activity</h2>
                <p className="text-[13px] text-slate-500 font-medium">View live incoming and outgoing calls</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live
              </span>
            </div>
          </div>
          <CallLogsTable />
        </section>
      </div>
    </div>
  );
}
