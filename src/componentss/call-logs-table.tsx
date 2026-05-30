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
    <Card className="shadow-sm border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-slate-500" />
          <h2 className="text-base font-bold text-slate-800 tracking-tight">Recent Calls</h2>
          <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 font-bold text-[9px] uppercase px-1.5 py-0 ml-1 tracking-wider">
            Live
          </Badge>
          {isDemoMode && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium ml-2 text-[10px] py-0 px-1.5">
              Demo
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => refetch()} className="text-slate-500 hover:text-slate-800 font-medium h-8 text-xs px-2">
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors gap-4 cursor-pointer"
                  onClick={() => setSelectedLog(log as CallLog)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm border ${isIncoming ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {isIncoming ? <PhoneIncoming className="h-4 w-4" /> : <PhoneOutgoing className="h-4 w-4" />}
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-sm text-slate-800">{fromNumber}</span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <span>{isIncoming ? "Incoming" : "Outgoing"}</span>
                        <span className="text-slate-300">•</span>
                        <span>{timeStr ? formatTimeAgo(timeStr) : "Unknown time"}</span>
                        <span className="text-slate-300">•</span>
                        <span>{duration}</span>
                      </div>

                      <div className="mt-1 flex items-center gap-2 rounded-md bg-white p-1 border border-slate-200 w-fit">
                        <Badge variant="secondary" className="text-[9px] uppercase font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 py-0">Rec</Badge>
                        {recordUrl ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            <audio controls src={String(recordUrl)} className="h-6 w-[180px] sm:w-[220px] outline-none" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 px-1 font-medium">No recording</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="shrink-0 flex items-center gap-1.5 font-semibold shadow-sm w-full sm:w-auto mt-2 sm:mt-0 h-8 text-xs border-slate-200" onClick={(e) => { e.stopPropagation(); /* Call back logic */ }}>
                    <Phone className="h-3 w-3 text-slate-500" />
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
