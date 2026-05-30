import { DoctorCard, doctors } from "@/componentss/doctor-card";
import { CallLogsTable } from "@/componentss/call-logs-table";
import { StatsRow } from "@/componentss/stats-row";
import { Stethoscope, Phone } from "lucide-react";
import { useUser } from "@/context/user-context";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const username = useUser();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Message */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {getGreeting()}, {username} 👋
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Here's an overview of today's clinic activity.
        </p>
      </div>

      <div className="grid gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shadow-sm">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Doctors & Availability</h2>
                <p className="text-sm text-slate-500">Manage schedules and blocks</p>
              </div>
            </div>
            <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">{doctors.length} on staff</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <DoctorCard key={d.name} doctor={d} />
            ))}
          </div>
        </section>

        {/* Stats row */}
        <StatsRow />

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center border border-emerald-200 text-emerald-600 shadow-sm">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Call Activity</h2>
                <p className="text-sm text-slate-500">View live incoming and outgoing calls</p>
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
