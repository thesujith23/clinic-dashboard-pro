import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/componentss/ui/sheet";
import { Badge } from "@/componentss/ui/badge";
import { Button } from "@/componentss/ui/button";
import { CalendarDays, Clock, User, Stethoscope, Mail, Phone, X, Building, MapPin, CreditCard, Cake } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0 [&>[data-sheet-overlay]]:bg-black/30">
        <VisuallyHidden>
          <SheetTitle>Appointment Details</SheetTitle>
          <SheetDescription>
            View and edit appointment information including patient details, date, time, and status
          </SheetDescription>
        </VisuallyHidden>
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-xl font-semibold">Appointment Details</h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Appointment Date and Time */}
          <div className="flex items-start gap-3">
            <CalendarDays className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Appointment Date and Time</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' })} - {appointment.slot}
              </p>
            </div>
          </div>

          {/* Patient Name */}
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Patient Name</p>
              <p className="text-sm font-medium text-blue-600">
                {appointment.patient}
              </p>
            </div>
          </div>

          {/* Visit Type */}
          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Visit Type</p>
              <p className="text-sm font-medium text-gray-900">{appointment.type}</p>
            </div>
          </div>

          {/* Assigned Provider */}
          <div className="flex items-start gap-3">
            <Stethoscope className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Assigned Provider</p>
              <p className="text-sm font-medium text-gray-900">
                {appointment.doctor}
              </p>
            </div>
          </div>

          {/* Patient Email */}
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Patient Email</p>
              <p className="text-sm font-medium text-gray-900">patient@email.com</p>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="flex items-start gap-3">
            <Cake className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="text-sm font-medium text-gray-900">03-15-1990</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-sm font-medium text-gray-900">Biomed Clinic, 45 Health Avenue</p>
              <p className="text-sm text-gray-500">Hyderabad, Telangana</p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Payment</p>
              <p className="text-sm font-medium text-amber-600">Pending</p>
            </div>
          </div>
        </div>

        {/* Status Section - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex items-center gap-2">
              {appointment.status === "confirmed" && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0">Confirmed</Badge>}
              {appointment.status === "pending" && <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0">Pending</Badge>}
              {appointment.status === "cancelled" && <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-0 shadow-none">Cancelled</Badge>}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
