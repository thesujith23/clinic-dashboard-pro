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
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-50/50">
      {/* Premium Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col min-h-0 w-full max-w-[1400px] mx-auto p-4 md:px-8 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
        <div className="flex items-center justify-between mb-8 shrink-0 bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild className="h-10 w-10 shrink-0 rounded-full bg-white/60 border-slate-200 hover:bg-white">
              <Link to="/">
                <ArrowLeft className="h-5 w-5 text-slate-700" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Doctor Schedule Settings</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">Configure availabilities, time slots, and blocked dates in real-time.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-200/60 shadow-sm transition-all duration-300">
            {isSaving ? (
              <><Loader2 className="h-4 w-4 text-blue-500 animate-spin" /> <span className="text-sm font-medium text-slate-600">Syncing changes...</span></>
            ) : (
              <><div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> <span className="text-sm font-medium text-slate-600">Saved just now</span></>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-12">
        
        {/* Left Column: General Settings & Weekly Schedule */}
        <div className="xl:col-span-7 flex flex-col gap-8">
          
          <Card className="glass-card shadow-lg shadow-blue-900/5 border-white/60 bg-white/60 backdrop-blur-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            <CardHeader className="bg-white/40 border-b border-white/60 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg"><User className="h-4 w-4 text-blue-600" /></div>
                Assigned Doctor
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">Select Doctor to Configure</Label>
              <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                <SelectTrigger className="w-full h-14 bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm text-base transition-all focus:ring-2 focus:ring-blue-500/20 rounded-xl">
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

          <Card className="glass-card shadow-lg shadow-indigo-900/5 border-white/60 bg-white/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-white/40 border-b border-white/60 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-indigo-100 rounded-lg"><Clock className="h-4 w-4 text-indigo-600" /></div>
                Booking Time Frame
              </CardTitle>
              <CardDescription className="font-medium text-slate-500">Set the weekly availability and working hours.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {schedule.map((day, index) => (
                <div key={day.day} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all duration-300 gap-4
                  ${day.isOpen ? 'bg-white/80 border-slate-200/60 shadow-sm hover:shadow-md' : 'bg-slate-50/50 border-slate-100 opacity-80'}`}>
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <Switch
                      checked={day.isOpen}
                      onCheckedChange={(checked) => handleScheduleChange(index, "isOpen", checked)}
                      className="data-[state=checked]:bg-indigo-500"
                    />
                    <Label className={`font-semibold text-base ${day.isOpen ? 'text-slate-900' : 'text-slate-400'}`}>
                      {day.day}
                    </Label>
                  </div>
                  
                  {day.isOpen ? (
                    <div className="flex items-center gap-3 flex-1 sm:justify-end animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <Input
                          type="time"
                          value={day.startTime}
                          onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
                          className="w-32 h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm font-medium text-slate-700"
                        />
                      </div>
                      <span className="text-slate-400 font-medium text-sm px-1">to</span>
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <Input
                          type="time"
                          value={day.endTime}
                          onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)}
                          className="w-32 h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm font-medium text-slate-700"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex sm:justify-end">
                      <Badge variant="outline" className="text-slate-400 bg-slate-50 border-slate-200 font-medium px-4 py-1 text-sm">Closed</Badge>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Duration, Blocked Dates, Details */}
        <div className="xl:col-span-5 flex flex-col gap-8">
          
          <Card className="glass-card shadow-lg shadow-orange-900/5 border-white/60 bg-white/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-white/40 border-b border-white/60 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg"><CalendarIcon className="h-4 w-4 text-orange-600" /></div>
                Blocked Dates
              </CardTitle>
              <CardDescription className="font-medium text-slate-500">Select specific dates when the doctor is unavailable.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="border border-white/60 rounded-3xl p-6 bg-white/80 shadow-sm w-full backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-100"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <span className="font-bold text-slate-800 text-lg">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <Button
                    variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-slate-100"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {weekDays.map((d) => (
                    <div key={d} className="text-sm font-semibold text-slate-400 py-2">{d}</div>
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
                <div className="mt-8 animate-in fade-in duration-300 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <Label className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider block">Selected Blocked Dates ({blockedDates.size})</Label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(blockedDates).sort().map((dateStr) => {
                      const date = new Date(dateStr);
                      const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                      return (
                        <Badge key={dateStr} variant="secondary" className="bg-white text-orange-700 hover:bg-orange-50 border border-orange-200 shadow-sm pl-3 pr-1.5 py-1.5 gap-2 text-sm font-medium">
                          {formatted}
                          <div
                            className="bg-orange-100 hover:bg-orange-500 hover:text-white rounded-full p-1 cursor-pointer transition-colors"
                            onClick={() => {
                              const newSelected = new Set(blockedDates);
                              newSelected.delete(dateStr);
                              setBlockedDates(newSelected);
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </div>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card shadow-lg shadow-emerald-900/5 border-white/60 bg-white/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-white/40 border-b border-white/60 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg"><Clock className="h-4 w-4 text-emerald-600" /></div>
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">Appointment Duration</Label>
                <div className="flex items-center gap-3 bg-white/80 p-2 rounded-2xl border border-white/60 shadow-sm">
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => {
                      setDuration(parseInt(e.target.value) || 0);
                      setIsSaving(true);
                      setTimeout(() => { setIsSaving(false); setLastSaved(new Date()); }, 400);
                    }}
                    className="w-24 bg-transparent border-slate-200/60 h-12 text-base font-medium text-center rounded-xl"
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
                    <SelectTrigger className="flex-1 bg-transparent border-slate-200/60 h-12 text-base rounded-xl">
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
