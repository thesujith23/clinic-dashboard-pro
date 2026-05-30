import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/componentss/ui/card"
import { Button } from "@/componentss/ui/button"
import { Input } from "@/componentss/ui/input"
import { Label } from "@/componentss/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/componentss/ui/select"
import { Switch } from "@/componentss/ui/switch"
import { Badge } from "@/componentss/ui/badge"
import { Clock, Calendar as CalendarIcon, User, Save, MapPin, Loader2, X, ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react"
import { doctors } from "@/componentss/doctor-card"
import { toast } from "sonner"
import { useLocation, Link } from "react-router-dom"

const defaultSchedule = [
  { day: "Sun", isOpen: false, startTime: "09:00", endTime: "17:00" },
  { day: "Mon", isOpen: true, startTime: "09:00", endTime: "17:00" },
  { day: "Tue", isOpen: true, startTime: "09:00", endTime: "17:00" },
  { day: "Wed", isOpen: true, startTime: "09:00", endTime: "17:00" },
  { day: "Thu", isOpen: true, startTime: "09:00", endTime: "17:00" },
  { day: "Fri", isOpen: true, startTime: "09:00", endTime: "17:00" },
  { day: "Sat", isOpen: false, startTime: "09:00", endTime: "17:00" },
];

export default function ScheduleDummyPage() {
  const location = useLocation();
  const initialDoctorName = location.state?.doctorName || doctors[0].name;
  
  const [selectedDoctorId, setSelectedDoctorId] = React.useState<string>(initialDoctorName);
  const [schedule, setSchedule] = React.useState(defaultSchedule);
  const [duration, setDuration] = React.useState(30);
  const [durationUnit, setDurationUnit] = React.useState("minutes");
  
  // Custom multi-calendar state for Blocked Dates
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [blockedDates, setBlockedDates] = React.useState<Set<string>>(new Set());
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(new Date());

  // Fallback to first doctor if invalid name somehow gets passed
  const selectedDoctor = doctors.find(d => d.name === selectedDoctorId) || doctors[0];

  // 1. Sync state from doctor when selected doctor changes
  React.useEffect(() => {
    const doctor = doctors.find(d => d.name === selectedDoctorId) || doctors[0];
    const fullDays: Record<string, string> = {
      Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", 
      Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday"
    };
    
    let defaultStart = "09:00";
    let defaultEnd = "17:00";
    if (doctor.slots && doctor.slots.length > 0) {
      const timeMatch = doctor.slots[0].match(/(\d{1,2}:\d{2}\s*[AP]M)\s*[–-]\s*(\d{1,2}:\d{2}\s*[AP]M)/i);
      if (timeMatch) {
         const parseTime = (timeStr: string) => {
            const [time, modifier] = timeStr.trim().split(' ');
            let [hours, minutes] = time.split(':');
            if (hours === '12') { hours = '00'; }
            if (modifier.toUpperCase() === 'PM') { hours = (parseInt(hours, 10) + 12).toString(); }
            return `${hours.padStart(2, '0')}:${minutes}`;
         };
         try {
           defaultStart = parseTime(timeMatch[1]);
           defaultEnd = parseTime(timeMatch[2]);
         } catch(e) {}
      }
    }

    const newSchedule = Object.keys(fullDays).map(shortDay => {
      const fullDayName = fullDays[shortDay];
      const isOpen = doctor.days.includes(fullDayName);
      return {
        day: shortDay,
        isOpen,
        startTime: defaultStart,
        endTime: defaultEnd
      };
    });
    setSchedule(newSchedule);
  }, [selectedDoctorId]);

  // 2. Real-time sync changes back to the doctor array
  React.useEffect(() => {
    const doctor = doctors.find(d => d.name === selectedDoctorId);
    if (!doctor) return;

    setIsSaving(true);

    const fullDays: Record<string, string> = {
      Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", 
      Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday"
    };
    
    doctor.days = schedule.filter(s => s.isOpen).map(s => fullDays[s.day]);
    
    const formatTime = (time24: string) => {
      const [hoursStr, minutes] = time24.split(":");
      let hours = parseInt(hoursStr, 10);
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    };
    
    const uniqueSlots = new Set<string>();
    const newScheduleMap: { day: string; time: string }[] = [];
    
    schedule.filter(s => s.isOpen).forEach(s => {
      const timeStr = `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`;
      uniqueSlots.add(timeStr);
      newScheduleMap.push({ day: s.day, time: timeStr });
    });
    
    doctor.slots = Array.from(uniqueSlots);
    doctor.scheduleMap = newScheduleMap;

    // Simulate network delay for real-time auto-saving feel
    const timer = setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 400);

    return () => clearTimeout(timer);
  }, [schedule, selectedDoctorId]);

  const handleScheduleChange = (index: number, field: string, value: any) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (number | null)[] = [];
    
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push(new Date(year, month, 0).getDate() - i);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push(i);
    }
    return { days, startingDay, daysInMonth };
  };

  const toggleDate = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const clickedDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (clickedDate < today) return;
    
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const newSelected = new Set(blockedDates);
    if (newSelected.has(dateStr)) {
      newSelected.delete(dateStr);
    } else {
      newSelected.add(dateStr);
    }
    setBlockedDates(newSelected);
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
    }, 400);
  };

  const { days, startingDay, daysInMonth } = getDaysInMonth(currentMonth);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-slate-50">
      <div className="relative flex flex-col min-h-0 w-full max-w-[1000px] mx-auto p-4 md:px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-6 shrink-0 bg-white border border-slate-200 px-5 py-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="h-8 w-8 shrink-0 rounded-lg bg-white border-slate-200 hover:bg-slate-50">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 text-slate-700" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Doctor Schedule Settings</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Configure availabilities, time slots, and blocked dates</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100 transition-all duration-300">
            {isSaving ? (
              <><Loader2 className="h-3.5 w-3.5 text-blue-600 animate-spin" /> <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Syncing</span></>
            ) : (
              <><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Saved</span></>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        
        {/* Left Column: General Settings & Weekly Schedule */}
        <div className="flex flex-col gap-6">
          
          <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 pb-3 pt-4 px-5">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-md"><User className="h-3.5 w-3.5 text-blue-600" /></div>
                Assigned Doctor
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-5 pb-5">
              <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                <SelectTrigger className="w-full h-10 bg-white border-slate-200 shadow-sm text-sm transition-all rounded-lg">
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doc => (
                    <SelectItem key={doc.name} value={doc.name} className="py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${doc.accent} flex items-center justify-center text-xs text-white font-bold`}>
                          {doc.name.replace("Dr. ", "").substring(0,2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 leading-none mb-1">{doc.name}</span>
                          <span className="text-xs text-slate-500 leading-none">{doc.specialty}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 pb-3 pt-4 px-5">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 rounded-md"><Clock className="h-3.5 w-3.5 text-indigo-600" /></div>
                Weekly Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-5 pb-5 space-y-3">
              {schedule.map((day, index) => (
                <div key={day.day} className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 gap-3
                  ${day.isOpen ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-80'}`}>
                  <div className="flex items-center gap-3 w-[100px]">
                    <Switch
                      checked={day.isOpen}
                      onCheckedChange={(checked) => handleScheduleChange(index, "isOpen", checked)}
                      className="data-[state=checked]:bg-indigo-600 scale-90"
                    />
                    <Label className={`font-semibold text-sm ${day.isOpen ? 'text-slate-800' : 'text-slate-400'}`}>
                      {day.day}
                    </Label>
                  </div>
                  
                  {day.isOpen ? (
                    <div className="flex items-center gap-2 flex-1 justify-end animate-in fade-in duration-200">
                      <div className="flex items-center bg-white border border-slate-200 rounded-md overflow-hidden">
                        <Input
                          type="time"
                          value={day.startTime}
                          onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
                          className="w-24 h-8 border-0 bg-transparent text-[13px] font-medium text-slate-700 px-2"
                        />
                      </div>
                      <span className="text-slate-400 font-medium text-[11px] uppercase">to</span>
                      <div className="flex items-center bg-white border border-slate-200 rounded-md overflow-hidden">
                        <Input
                          type="time"
                          value={day.endTime}
                          onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)}
                          className="w-24 h-8 border-0 bg-transparent text-[13px] font-medium text-slate-700 px-2"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex justify-end">
                      <Badge variant="outline" className="text-slate-400 bg-slate-50 border-slate-200 font-medium px-2 py-0 text-[11px]">Closed</Badge>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Duration, Blocked Dates, Details */}
        <div className="flex flex-col gap-6">
          
          <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 pb-3 pt-4 px-5">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="p-1.5 bg-orange-50 rounded-md"><CalendarIcon className="h-3.5 w-3.5 text-orange-600" /></div>
                Blocked Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-5 pb-5">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 shadow-sm w-full">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-200"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-bold text-slate-800 text-sm">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <Button
                    variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-slate-200"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {weekDays.map((d) => (
                    <div key={d} className="text-[11px] font-bold text-slate-400 py-1 uppercase">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {days.map((day, i) => {
                    const isCurrentMonth = i >= startingDay && i < startingDay + daysInMonth;
                    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isSelected = isCurrentMonth && day && blockedDates.has(dateStr);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const cellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day || 1);
                    const isPastDate = isCurrentMonth && day && cellDate < today;
                    
                    return (
                      <button
                        key={i}
                        onClick={() => toggleDate(day || 0, isCurrentMonth)}
                        disabled={!isCurrentMonth || isPastDate}
                        className={`aspect-square w-full sm:max-w-[48px] text-sm rounded-full flex items-center justify-center font-semibold transition-all mx-auto
                          ${!isCurrentMonth ? "text-transparent" : ""}
                          ${isCurrentMonth && !isPastDate && !isSelected ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900" : ""}
                          ${isSelected ? "bg-orange-500 text-white shadow-lg hover:bg-orange-600 scale-105 ring-4 ring-orange-50" : ""}
                          ${isPastDate && !isSelected ? "text-slate-300 cursor-not-allowed font-normal" : ""}
                        `}
                      >
                        {isCurrentMonth ? day : ""}
                      </button>
                    );
                  })}
                </div>
              </div>

              {blockedDates.size > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <Label className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider block">Selected ({blockedDates.size})</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(blockedDates).sort().map((dateStr) => {
                      const date = new Date(dateStr);
                      const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                      return (
                        <Badge key={dateStr} variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 pl-2 pr-1 py-0.5 gap-1 text-[11px] font-semibold">
                          {formatted}
                          <div
                            className="bg-orange-200 hover:bg-orange-500 hover:text-white rounded-md p-0.5 cursor-pointer transition-colors"
                            onClick={() => {
                              const newSelected = new Set(blockedDates);
                              newSelected.delete(dateStr);
                              setBlockedDates(newSelected);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </div>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 bg-white overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100 pb-3 pt-4 px-5">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 rounded-md"><Clock className="h-3.5 w-3.5 text-emerald-600" /></div>
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-5 pb-5">
              <div className="space-y-2">
                <Label className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Duration per slot</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => {
                      setDuration(parseInt(e.target.value) || 0);
                      setIsSaving(true);
                      setTimeout(() => { setIsSaving(false); setLastSaved(new Date()); }, 400);
                    }}
                    className="w-20 bg-white border-slate-200 h-9 text-sm font-medium text-center"
                    min={1}
                  />
                  <Select 
                    value={durationUnit} 
                    onValueChange={(v) => {
                      setDurationUnit(v);
                      setIsSaving(true);
                      setTimeout(() => { setIsSaving(false); setLastSaved(new Date()); }, 400);
                    }}
                  >
                    <SelectTrigger className="flex-1 bg-white border-slate-200 h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
    </div>
  )
}
