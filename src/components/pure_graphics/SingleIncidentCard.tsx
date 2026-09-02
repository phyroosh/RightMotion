import React from "react";
import { AlertCircle, Clock } from "lucide-react";

export const SingleIncidentCard: React.FC = () => {
  return (
    <div className="w-full max-w-[980px] rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl shadow-[0_30px_70px_rgba(244,63,94,0.14)] border-[4px] border-rose-300/80 flex flex-col items-center gap-6 text-center">
      <div className="px-8 py-3 rounded-full bg-rose-50 border-2 border-rose-300 text-rose-700 font-mono font-black text-2xl uppercase tracking-widest flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-rose-600" />
        THE INITIAL TRIGGER
      </div>

      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-500 text-white flex items-center justify-center font-black text-4xl shadow-xl shrink-0">
          1x
        </div>
        <div className="text-left">
          <div className="text-4xl md:text-5xl font-black text-slate-950 leading-tight">
            They Hurt You Once.
          </div>
          <div className="text-2xl font-bold text-slate-500 flex items-center gap-2.5 mt-1.5">
            <Clock className="w-6 h-6 text-rose-500 shrink-0" />
            A single passing moment in time
          </div>
        </div>
      </div>
    </div>
  );
};
