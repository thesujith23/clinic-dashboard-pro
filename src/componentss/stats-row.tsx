import { CalendarCheck2, CalendarDays, UserCheck, Clock } from "lucide-react";
import { Card, CardContent } from "@/componentss/ui/card";

const stats = [
  {
    label: "Today's Appointments",
    value: "8",
    sub: "3 confirmed · 5 pending",
    icon: CalendarCheck2,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    label: "This Week's Bookings",
    value: "34",
    sub: "↑ 12% vs last week",
    icon: CalendarDays,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    label: "Patients Attended",
    value: "21",
    sub: "Across all doctors this week",
    icon: UserCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    label: "Next Appointment",
    value: "2:30 PM",
    sub: "Michael Johnson · Follow-up",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
];

export function StatsRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-5 flex items-start gap-4">
            <div
              className={`h-10 w-10 shrink-0 rounded-lg ${stat.bg} ${stat.border} border flex items-center justify-center ${stat.color}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-slate-900 leading-tight">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-slate-600 mt-0.5">
                {stat.label}
              </p>
              <p className="text-xs text-slate-400 mt-1 truncate">{stat.sub}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
