import React from "react";
import { AlertCircle, Clock } from "lucide-react";

export const SingleIncidentCard: React.FC = () => {
  return (
    <div className="w-full max-w-[940px] rounded-[44px] p-8 bg-white/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(244,63,94,0.12)] border-[3px] border-rose-300/80 flex flex-col items-center gap-5 text-center">
      <div className="px-7 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-mono font-black text-lg uppercase tracking-widest flex items-center gap-2.5">
        <AlertCircle className="w-5 h-5" />
        THE INITIAL TRIGGER
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black text-3xl shadow-lg">
          1x
        </div>
        <div className="text-left">
          <div className="text-3xl font-black text-slate-900 leading-tight">
            They Hurt You Once.
          </div>
          <div className="text-lg font-bold text-slate-500 flex items-center gap-2 mt-0.5">
            <Clock className="w-4 h-4 text-rose-500" />
            Duration: Just a single passing moment
          </div>
        </div>
      </div>
    </div>
  );
};
