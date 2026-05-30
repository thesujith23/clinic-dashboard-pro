import { Card } from "@/componentss/ui/card";
import { Badge } from "@/componentss/ui/badge";
import { Calendar, Clock, User, CalendarDays } from "lucide-react";
import { ScrollArea } from "@/componentss/ui/scroll-area";
import React from "react";

const DEMO_APPOINTMENTS = [
  { id: 1, patient: "John Doe", doctor: "Dr. Sweekar", date: "2026-06-01", slot: "10:30 AM", type: "Checkup", status: "confirmed" },
  { id: 2, patient: "Sarah Smith", doctor: "Dr. Yogesh", date: "2026-06-01", slot: "11:00 AM", type: "Consultation", status: "pending" },
  { id: 3, patient: "Michael Johnson", doctor: "Dr. Sujith", date: "2026-06-02", slot: "02:30 PM", type: "Follow-up", status: "confirmed" },
  { id: 4, patient: "Emily Davis", doctor: "Dr. Sweekar", date: "2026-06-02", slot: "04:00 PM", type: "Emergency", status: "confirmed" },
  { id: 5, patient: "Robert Wilson", doctor: "Dr. Yogesh", date: "2026-06-03", slot: "05:15 PM", type: "Checkup", status: "cancelled" },
];

export function AppointmentsTable() {
  return (
    <Card className="shadow-sm border-slate-200 overflow-hidden glass-card">
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/50 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Upcoming Appointments</h2>
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 font-medium ml-2">
            {DEMO_APPOINTMENTS.length} Total
          </Badge>
        </div>
      </div>

      <ScrollArea className="w-full">
        <div className="max-h-[700px] flex flex-col">
          {DEMO_APPOINTMENTS.map((apt) => (
            <div 
              key={apt.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm border bg-indigo-50 text-indigo-600 border-indigo-100">
                  <User className="h-5 w-5" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-slate-900">{apt.patient}</span>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <span className="text-slate-700">{apt.doctor}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(apt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {apt.slot}</span>
                  </div>

                  <div className="mt-1 flex items-center gap-3">
                    <Badge variant="outline" className="text-xs text-slate-500 border-slate-200">{apt.type}</Badge>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                {apt.status === "confirmed" && <Badge className="bg-emerald-500 hover:bg-emerald-600 shadow-sm text-white border-0">Confirmed</Badge>}
                {apt.status === "pending" && <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0">Pending</Badge>}
                {apt.status === "cancelled" && <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-0 shadow-none">Cancelled</Badge>}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
