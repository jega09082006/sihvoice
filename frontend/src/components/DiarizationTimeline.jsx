import React from 'react';
import { Mic, UserCheck } from 'lucide-react';

export default function DiarizationTimeline({ segments = [] }) {
  const defaultSegments = [
    { speaker: 'Customer', start: 0, end: 12, emotion: 'Frustrated' },
    { speaker: 'Agent', start: 12, end: 35, emotion: 'Neutral' },
    { speaker: 'Customer', start: 35, end: 60, emotion: 'Angry' },
    { speaker: 'Agent', start: 60, end: 110, emotion: 'Happy' },
    { speaker: 'Customer', start: 110, end: 160, emotion: 'Neutral' },
    { speaker: 'Agent', start: 160, end: 220, emotion: 'Happy' },
    { speaker: 'Customer', start: 220, end: 272, emotion: 'Happy' },
  ];

  const list = segments.length > 0 ? segments : defaultSegments;
  const totalSec = 272; // 4m 32s

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-[#00d4ff]" />
          <h3 className="text-lg font-bold text-white">Speaker Diarization Timeline (5-Min Call)</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#00d4ff]"></span>
            <span className="text-gray-300 font-semibold">Customer Track</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#6c63ff]"></span>
            <span className="text-gray-300 font-semibold">Agent Track</span>
          </div>
        </div>
      </div>

      {/* Track 1: Customer Timeline */}
      <div className="space-y-1">
        <div className="text-xs font-bold text-[#00d4ff]">Customer Voice Channel</div>
        <div className="relative w-full h-8 bg-white/5 rounded-lg overflow-hidden border border-white/10 flex items-center">
          {list
            .filter((s) => s.speaker === 'Customer')
            .map((seg, idx) => {
              const left = (seg.start / totalSec) * 100;
              const width = ((seg.end - seg.start) / totalSec) * 100;
              return (
                <div
                  key={idx}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  className="absolute h-full bg-[#00d4ff]/80 hover:bg-[#00d4ff] border-r border-black/40 flex items-center justify-center text-[10px] font-bold text-black cursor-pointer transition-all"
                  title={`Customer [${seg.start}s - ${seg.end}s] : ${seg.emotion}`}
                >
                  {seg.emotion}
                </div>
              );
            })}
        </div>
      </div>

      {/* Track 2: Agent Timeline */}
      <div className="space-y-1">
        <div className="text-xs font-bold text-[#6c63ff]">Agent Voice Channel</div>
        <div className="relative w-full h-8 bg-white/5 rounded-lg overflow-hidden border border-white/10 flex items-center">
          {list
            .filter((s) => s.speaker === 'Agent')
            .map((seg, idx) => {
              const left = (seg.start / totalSec) * 100;
              const width = ((seg.end - seg.start) / totalSec) * 100;
              return (
                <div
                  key={idx}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  className="absolute h-full bg-[#6c63ff]/80 hover:bg-[#6c63ff] border-r border-black/40 flex items-center justify-center text-[10px] font-bold text-white cursor-pointer transition-all"
                  title={`Agent [${seg.start}s - ${seg.end}s] : ${seg.emotion}`}
                >
                  {seg.emotion}
                </div>
              );
            })}
        </div>
      </div>

      {/* Time markers */}
      <div className="flex justify-between text-[10px] text-gray-500 font-semibold pt-1">
        <span>00:00</span>
        <span>01:00</span>
        <span>02:00</span>
        <span>03:00</span>
        <span>04:32</span>
      </div>
    </div>
  );
}
