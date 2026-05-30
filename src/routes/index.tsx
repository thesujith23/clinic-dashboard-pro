import { DashboardHeader } from "@/componentss/dashboard-header";
import { DoctorCard, doctors } from "@/componentss/doctor-card";
import { CallLogsTable } from "@/componentss/call-logs-table";
import { AppointmentsTable } from "@/componentss/appointments-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/componentss/ui/tabs";
import { Stethoscope, Phone, CalendarDays, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-8 p-1.5 bg-slate-100/80 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="appointments" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-2 flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Appointments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
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
        </TabsContent>

        <TabsContent value="appointments" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <AppointmentsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
