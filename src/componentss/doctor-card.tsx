import { Card, CardContent, CardHeader } from "@/componentss/ui/card";
import { Badge } from "@/componentss/ui/badge";
import { Avatar, AvatarFallback } from "@/componentss/ui/avatar";
import { Button } from "@/componentss/ui/button";
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";

export type Doctor = {
  name: string;
  specialty: string;
  days: string[];
  slots: string[];
  scheduleMap?: { day: string; time: string }[];
  accent: string;
};

export const doctors: Doctor[] = [
  {
    name: "Dr. Sweekar",
    specialty: "General Medicine",
    days: ["Monday", "Wednesday", "Friday"],
    slots: ["10:00 AM – 12:00 PM", "03:00 PM – 05:00 PM"],
    scheduleMap: [
      { day: "Mon", time: "10:00 AM – 12:00 PM" },
      { day: "Wed", time: "10:00 AM – 12:00 PM" },
      { day: "Fri", time: "03:00 PM – 05:00 PM" },
    ],
    accent: "from-sky-400 to-blue-500",
  },
  {
    name: "Dr. Yogesh",
    specialty: "Cardiology",
    days: ["Tuesday", "Thursday", "Saturday"],
    slots: ["11:00 AM – 01:00 PM", "04:00 PM – 06:00 PM"],
    scheduleMap: [
      { day: "Tue", time: "11:00 AM – 01:00 PM" },
      { day: "Thu", time: "11:00 AM – 01:00 PM" },
      { day: "Sat", time: "04:00 PM – 06:00 PM" },
    ],
    accent: "from-cyan-400 to-teal-500",
  },
  {
    name: "Dr. Sujith",
    specialty: "Neurology",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    slots: ["02:00 PM – 06:00 PM"],
    scheduleMap: [
      { day: "Mon", time: "02:00 PM – 06:00 PM" },
      { day: "Tue", time: "02:00 PM – 06:00 PM" },
      { day: "Wed", time: "02:00 PM – 06:00 PM" },
      { day: "Thu", time: "02:00 PM – 06:00 PM" },
      { day: "Fri", time: "02:00 PM – 06:00 PM" },
      { day: "Sat", time: "02:00 PM – 06:00 PM" },
    ],
    accent: "from-indigo-400 to-blue-600",
  },
];

const dayShort: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const initials = doctor.name
    .replace("Dr. ", "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Group the schedule map by time slot
  const slotGroups: Record<string, string[]> = {};
  if (doctor.scheduleMap) {
    doctor.scheduleMap.forEach(item => {
      if (!slotGroups[item.time]) slotGroups[item.time] = [];
      slotGroups[item.time].push(item.day);
    });
  } else {
    // Fallback if scheduleMap is missing
    const fallbackTime = doctor.slots[0] || "No Slots";
    slotGroups[fallbackTime] = doctor.days.map(d => dayShort[d] || d);
  }

  const groupedSlots = Object.entries(slotGroups);

  return (
    <Card className="glass-card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
      <div className={`h-1.5 w-full bg-gradient-to-r ${doctor.accent}`} />
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Avatar className="h-12 w-12 ring-2 ring-primary/10">
          <AvatarFallback
            className={`bg-gradient-to-br ${doctor.accent} text-white font-semibold`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="font-semibold leading-tight truncate">{doctor.name}</h3>
          <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            Schedule
          </p>
          <div className="space-y-2">
            {groupedSlots.map(([time, daysArray]) => (
              <div key={time} className="flex flex-col gap-2 rounded-xl bg-muted/50 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{time}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-6">
                  {daysArray.map((d) => (
                    <Badge
                      key={d}
                      variant="secondary"
                      className="bg-white border-slate-200 text-slate-600 font-medium shadow-sm"
                    >
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-2">
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
            <Link to="/schedule" state={{ doctorName: doctor.name }}>
              <Calendar className="mr-2 h-4 w-4" />
              Manage Schedule
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
