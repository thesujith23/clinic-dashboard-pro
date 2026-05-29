import { DoctorCard, doctors } from "@/componentss/doctor-card";

export default function DoctorsPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Doctors & Availability</h1>
        <p className="text-sm text-muted-foreground">Weekly schedules for our dental team.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((d) => (
          <DoctorCard key={d.name} doctor={d} />
        ))}
      </div>
    </div>
  );
}
