import { AppointmentsTable } from "@/componentss/appointments-table";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
            Appointments
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage your patient bookings and consultations.
          </p>
        </div>
      </div>
      <AppointmentsTable />
    </div>
  );
}
