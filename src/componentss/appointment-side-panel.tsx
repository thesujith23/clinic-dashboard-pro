import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/componentss/ui/sheet";
import { Badge } from "@/componentss/ui/badge";
import { Button } from "@/componentss/ui/button";
import { Calendar, Clock, User, Stethoscope, Mail, Phone } from "lucide-react";

export type Appointment = {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  slot: string;
  type: string;
  status: string;
};

interface AppointmentSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export function AppointmentSidePanel({ isOpen, onClose, appointment }: AppointmentSidePanelProps) {
  if (!appointment) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md p-0 overflow-y-auto bg-slate-50 border-l border-slate-200">
        <div className="p-6 bg-white border-b border-slate-100">
          <SheetHeader className="text-left space-y-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                Appointment Details
              </SheetTitle>
              {appointment.status === "confirmed" && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0">Confirmed</Badge>}
              {appointment.status === "pending" && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0">Pending</Badge>}
              {appointment.status === "cancelled" && <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0">Cancelled</Badge>}
            </div>
            <SheetDescription className="text-slate-500 font-medium">
              Information about the scheduled visit.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <User className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900">{appointment.patient}</span>
              <span className="text-sm font-medium text-slate-500">New Patient</span>
            </div>
          </div>

          <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Visit Info</h3>
            
            <div className="flex items-start gap-3">
              <Stethoscope className="h-4.5 w-4.5 text-slate-400 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-500">Provider</span>
                <span className="font-semibold text-slate-800">{appointment.doctor}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4.5 w-4.5 text-slate-400 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-500">Date</span>
                <span className="font-semibold text-slate-800">
                  {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-4.5 w-4.5 text-slate-400 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-500">Time Slot</span>
                <span className="font-semibold text-slate-800">{appointment.slot}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="outline" className="text-xs text-indigo-600 border-indigo-200 bg-indigo-50 mt-2">
                {appointment.type}
              </Badge>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
            <Button variant="outline" className="flex-1 bg-white border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50">
              <Mail className="mr-2 h-4 w-4" />
              Message
            </Button>
          </div>
          
          <div className="pt-4 flex justify-center">
             <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600 text-sm font-semibold w-full">
               Cancel Appointment
             </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
