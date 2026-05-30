import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
} from "@/componentss/ui/sheet";
import { X, Play, Pause, Phone, Calendar, Clock, RotateCcw, ChevronDown, Loader2 } from "lucide-react";
import { format } from "date-fns";

export interface CallLog {
  call_uuid: string;
  answer_time?: string;
  initiation_time?: string;
  from_number?: string;
  from?: string;
  call_direction?: string;
  call_duration?: string | number;
  recording_url?: string | null;
  recording_id?: string | null;
  summary?: string | null;
  transcript?: string | null;
  actionTrigger?: string;
}

interface CallLogSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  log: CallLog | null;
}

const formatAudioTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function CallLogSidePanel({ isOpen, onClose, log }: CallLogSidePanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(true);

  // Reset playback when panel opens or log changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    // Parse the duration string (e.g. "03:26" or "196") into seconds
    if (log?.call_duration) {
        if (typeof log.call_duration === "string" && log.call_duration.includes(":")) {
            const [min, sec] = log.call_duration.split(":");
            setAudioDuration(parseInt(min) * 60 + parseInt(sec));
        } else {
            setAudioDuration(Number(log.call_duration));
        }
    } else {
        setAudioDuration(0);
    }
  }, [log?.call_uuid, isOpen]);

  const [liveTranscript, setLiveTranscript] = useState<string | null>(null);
  const [transcriptionStatus, setTranscriptionStatus] = useState<string>("none");

  // Fetch or trigger transcription when opened
  useEffect(() => {
    if (!isOpen || !log) return;
    
    setLiveTranscript(log.transcript || null);
    setTranscriptionStatus("none");

    if (log.recording_id && !log.transcript) {
      const fetchTranscription = async () => {
        setTranscriptionStatus("loading");
        try {
          const res = await fetch(`/api/plivo-transcribe?recording_id=${log.recording_id}&call_uuid=${log.call_uuid}`);
          const data = await res.json();
          if (data.status === "completed" && data.text) {
            setLiveTranscript(data.text);
            setTranscriptionStatus("completed");
          } else if (data.status === "queued") {
            setTranscriptionStatus("queued");
          } else {
            setTranscriptionStatus("error");
          }
        } catch (e) {
          setTranscriptionStatus("error");
        }
      };
      fetchTranscription();
    }
  }, [log?.call_uuid, isOpen]);

  if (!log) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Audio play failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const onAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const onProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || audioDuration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * audioDuration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercent = audioDuration > 0
      ? Math.min(100, Math.max(0, (currentTime / audioDuration) * 100))
      : 0;

  const timeStr = log.answer_time || log.initiation_time;
  let formattedDate = "Unknown Date";
  let formattedTime = "Unknown Time";
  if (timeStr) {
    try {
      const date = new Date(timeStr);
      formattedDate = format(date, "MMM d, yyyy");
      formattedTime = format(date, "h:mm a");
    } catch (e) {}
  }

  const fromNumber = log.from_number || log.from || "Unknown Number";
  
  // Format phone number nicely
  const formattedPhone = fromNumber.replace(/\D/g, "").length >= 10 
    ? fromNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3") 
    : fromNumber;

  const displayDuration = log.call_duration 
    ? (typeof log.call_duration === "number" ? formatAudioTime(log.call_duration) : log.call_duration)
    : "0:00";

  let summaryContent = null;

  const renderChat = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    return (
      <div className="mt-3 rounded-lg border border-gray-200 bg-slate-50/50 p-4 max-h-[300px] overflow-y-auto flex flex-col gap-4">
        {lines.map((line, i) => {
          const match = line.match(/^(Speaker \d+):\s*(.*)/i);
          let speaker = "Patient";
          let content = line;
          let isAgent = false;

          if (match) {
            const rawSpeaker = match[1].toLowerCase();
            content = match[2];
            if (rawSpeaker === "speaker 0") {
              speaker = "AI Agent";
              isAgent = true;
            } else {
              speaker = "Patient";
            }
          } else {
            // Fallback if no colon is found, we guess based on previous or just assume Patient
            if (line.toLowerCase().startsWith("speaker 0")) {
              speaker = "AI Agent";
              isAgent = true;
              content = line.replace(/speaker 0/i, "").trim();
            }
          }

          return (
            <div key={i} className={`flex flex-col max-w-[90%] ${isAgent ? 'self-start' : 'self-end'}`}>
              <span className={`text-[10px] font-bold mb-1 uppercase tracking-wide ${isAgent ? 'text-blue-600' : 'text-emerald-600 self-end'}`}>
                {speaker}
              </span>
              <div className={`px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${isAgent ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm' : 'bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-tr-sm'}`}>
                {content}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (liveTranscript) {
    summaryContent = renderChat(liveTranscript);
  } else if (transcriptionStatus === "loading") {
    summaryContent = (
      <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500 flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Fetching transcription...
      </div>
    );
  } else if (transcriptionStatus === "queued") {
    summaryContent = (
      <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-5 w-5 animate-spin mb-2 text-blue-500" />
        Transcription is currently queued by Plivo.<br/>It may take a few moments to complete.
      </div>
    );
  } else if (log.transcript) {
    summaryContent = renderChat(log.transcript);
  } else {
    summaryContent = (
      <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500 text-center italic">
        No transcript available for this call.
      </div>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-[540px] p-0 flex flex-col bg-white [&>button]:hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex items-start justify-between border-b border-gray-200 bg-white px-5 py-4 shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Call Logs</h2>
          <button
            onClick={onClose}
            className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-600 hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Caller Info Card */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 leading-snug">
                    {formattedPhone}
                  </h3>
                  <p className="text-xs text-gray-500">Caller</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                <span>{displayDuration}</span>
              </div>
            </div>
          </div>

          {log.actionTrigger && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Action Trigger</h3>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                <span className="text-sm text-gray-800">{log.actionTrigger}</span>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Call Recording</h3>
            <div className="rounded-xl border border-gray-200 bg-[#f8f9fa] px-3 py-2.5 flex items-center gap-3">
              <button
                onClick={togglePlay}
                disabled={!log.recording_url}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${log.recording_url ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-100 cursor-not-allowed'}`}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="h-4 w-4 ml-1 fill-current" />
                )}
              </button>
              
              {log.recording_url && (
                <audio
                  ref={audioRef}
                  src={log.recording_url}
                  preload="metadata"
                  onTimeUpdate={onTimeUpdate}
                  onLoadedMetadata={onLoadedMetadata}
                  onEnded={onAudioEnded}
                  className="hidden"
                />
              )}
              
              <button 
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    setCurrentTime(0);
                  }
                }}
                disabled={!log.recording_url}
                className="text-gray-600 hover:text-gray-900 shrink-0 disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <div 
                className={`relative flex-1 flex items-center ml-1 h-4 ${log.recording_url ? 'cursor-pointer group' : 'opacity-50 pointer-events-none'}`}
                onClick={onProgressClick}
              >
                {/* The track */}
                <div className="h-1.5 w-full rounded-full bg-[#e2e8f0]">
                  {/* The filled part (blue) */}
                  <div 
                    className="h-full rounded-full bg-blue-600 transition-all duration-100" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {/* The playhead/thumb */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-blue-600 bg-white shadow-sm transition-all duration-100 group-hover:scale-110" 
                  style={{ 
                    left: `${progressPercent}%`,
                    transform: `translate(-50%, -50%)`
                  }}
                />
              </div>

              <div className="text-[11px] font-medium text-gray-500 shrink-0 tabular-nums">
                {formatAudioTime(currentTime)} / {formatAudioTime(audioDuration || 0)}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setSummaryOpen((prev) => !prev)}
              className="flex w-full items-center justify-between text-left hover:opacity-80 transition-opacity"
            >
              <h3 className="text-sm font-semibold text-gray-700">Transcript</h3>
              <ChevronDown
                className={
                  "text-gray-500 " + 
                  (summaryOpen ? "h-4 w-4 rotate-180 transform" : "h-4 w-4")
                }
              />
            </button>
            {summaryOpen && summaryContent}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
