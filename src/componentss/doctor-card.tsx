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

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-slate-200">
      <CardHeader className="flex flex-row items-center gap-3 pb-2 pt-5">
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
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Available days
          </p>
          <div className="flex flex-wrap gap-1.5">
            {doctor.days.map((day) => (
              <Badge
                key={day}
                variant="secondary"
                className="bg-primary/5 text-primary hover:bg-primary/10"
              >
                {dayShort[day] || day}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Time slots
          </p>
          <div className="space-y-1.5">
            {doctor.slots.map((slot) => (
              <div
                key={slot}
                className="flex items-center text-sm text-muted-foreground"
              >
                <Clock className="mr-2 h-3.5 w-3.5" />
                {slot}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
