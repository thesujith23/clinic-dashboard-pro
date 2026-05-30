import { useQuery } from "@tanstack/react-query";
import { Card } from "@/componentss/ui/card";
import { Badge } from "@/componentss/ui/badge";
import { Button } from "@/componentss/ui/button";
import { PhoneIncoming, PhoneOutgoing, Phone, RefreshCw, Loader2, History } from "lucide-react";
import { ScrollArea } from "@/componentss/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import React, { useState } from "react";
import { CallLogSidePanel, CallLog } from "./call-log-side-panel";

const DEMO_LOGS: any[] = [
  { call_uuid: "demo-1", answer_time: new Date(Date.now() - 25 * 60000).toISOString(), from_number: "917892251871", call_direction: "inbound", call_duration: "03:26", recording_url: "https://plivo.com/recording/1.mp3" },
  { call_uuid: "demo-2", answer_time: new Date(Date.now() - 120 * 60000).toISOString(), from_number: "sip:22477884621592458@app.plivo.com", call_direction: "outbound", call_duration: "02:31", recording_url: "https://plivo.com/recording/2.mp3" },
  { call_uuid: "demo-3", answer_time: new Date(Date.now() - 130 * 60000).toISOString(), from_number: "sip:22477884621592458@app.plivo.com", call_direction: "outbound", call_duration: "03:49", recording_url: "https://plivo.com/recording/3.mp3" },
  { call_uuid: "demo-4", answer_time: new Date(Date.now() - 240 * 60000).toISOString(), from_number: "918884615615", call_direction: "outbound", call_duration: "00:23", recording_url: null },
  { call_uuid: "demo-5", answer_time: new Date(Date.now() - 23 * 3600 * 1000).toISOString(), from_number: "sip:61360911822999801@app.plivo.com", call_direction: "outbound", call_duration: "01:50", recording_url: "https://plivo.com/recording/5.mp3" },
];

function formatTimeAgo(dateStr: string) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const distance = formatDistanceToNow(date);
    return distance.replace("about ", "").replace(" hours", "h").replace(" hour", "h").replace(" minutes", "m").replace(" minute", "m") + " ago";
  } catch (e) {
    return dateStr;
  }
}

function formatDuration(seconds: any): string {
  if (seconds === undefined || seconds === null) return "00:00";
  const num = parseInt(String(seconds), 10);
  if (isNaN(num)) return String(seconds); // fallback if it's already a string like "03:26"
  const m = Math.floor(num / 60);
  const s = num % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function CallLogsTable() {
  const fetchLogs = async () => {
    const res = await fetch("/api/plivo-logs");
    if (!res.ok) throw new Error("Failed to fetch logs");
    return res.json();
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["plivo-call-logs"],
    queryFn: fetchLogs,
    refetchInterval: 60_000,
  });

  const logs = data?.logs ?? [];
  const isDemoMode = isError || !!data?.error || logs.length === 0;
  const displayLogs = isDemoMode ? DEMO_LOGS : logs;

  const filteredLogs = displayLogs.filter(log => {
    const targetNumber = "918031336259";
    const fromStr = String(log.from_number || log.from || "").replace(/\D/g, "");
    const toStr = String(log.to_number || log.to || "").replace(/\D/g, "");
    return fromStr.includes(targetNumber) || toStr.includes(targetNumber);
  });

  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);

  return (
    <>
    <Card className="glass-card shadow-lg shadow-blue-900/5 border-white/60 bg-white/60 backdrop-blur-xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/60 bg-white/40">
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recent Calls</h2>
          <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-0 font-bold text-[10px] uppercase px-2 py-0.5 ml-1 tracking-wider">
            Live
          </Badge>
          {isDemoMode && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium ml-2">
              Demo Mode
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => refetch()} className="text-slate-600 hover:text-slate-900 font-medium">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading recent calls...
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="py-24 text-center text-sm text-slate-500">
          No call logs found for +91 80 3133 6259.
        </div>
      ) : (
        <ScrollArea className="w-full">
          <div className="max-h-[700px] flex flex-col">
            {filteredLogs.map((log, i) => {
              // Handle fallback mapping since API sometimes returns `from` instead of `from_number`
              const fromNumber = log.from_number || log.from;
              const direction = String(log.call_direction || "").toLowerCase();
              const isIncoming = direction === "inbound" || direction === "incoming";
              const timeStr = log.answer_time || log.initiation_time;
              const duration = formatDuration(log.call_duration);
              const recordUrl = log.recording_url;

              return (
                <div 
                  key={(log.call_uuid as string) ?? i} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors gap-4 cursor-pointer"
                  onClick={() => setSelectedLog(log as CallLog)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm border ${isIncoming ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {isIncoming ? <PhoneIncoming className="h-5 w-5" /> : <PhoneOutgoing className="h-5 w-5" />}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="font-semibold text-slate-900">{fromNumber}</span>
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <span>{isIncoming ? "Incoming" : "Outgoing"}</span>
                        <span className="text-slate-300">•</span>
                        <span>{timeStr ? formatTimeAgo(timeStr) : "Unknown time"}</span>
                        <span className="text-slate-300">•</span>
                        <span>{duration}</span>
                      </div>

                      <div className="mt-1 flex items-center gap-3 rounded-lg bg-slate-100/70 p-1.5 border border-slate-200 w-fit">
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold text-slate-500 bg-slate-200/80 hover:bg-slate-300/50">Rec</Badge>
                        {recordUrl ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            <audio controls src={String(recordUrl)} className="h-7 w-[200px] sm:w-[260px] outline-none" />
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 px-2 font-medium">No recording available</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="shrink-0 flex items-center gap-2 font-semibold shadow-sm w-full sm:w-auto mt-2 sm:mt-0" onClick={(e) => { e.stopPropagation(); /* Call back logic */ }}>
                    <Phone className="h-4 w-4" />
                    Call back
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </Card>
    
    <CallLogSidePanel 
      isOpen={selectedLog !== null}
      onClose={() => setSelectedLog(null)}
      log={selectedLog}
    />
    </>
  );
}
