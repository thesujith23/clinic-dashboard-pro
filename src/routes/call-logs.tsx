import { CallLogsTable } from "@/componentss/call-logs-table";

export default function CallLogsPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Call Logs</h1>
        <p className="text-sm text-muted-foreground">
          All call records fetched from the system.
        </p>
      </div>
      <CallLogsTable />
    </div>
  );
}
