import React, { useState } from 'react';
import { MOCK_HEATMAP_GRID } from '../data/mockAnalytics';
import { Calendar, Flame } from 'lucide-react';

export default function HeatmapGrid() {
  const [hoveredCell, setHoveredCell] = useState(null);

  const getIntensityColor = (volume) => {
    if (volume > 70) return 'bg-[#ff4757] shadow-[0_0_8px_rgba(255,71,87,0.5)]'; // High peak
    if (volume > 45) return 'bg-[#ffb703]'; // Medium high
    if (volume > 25) return 'bg-[#6c63ff]'; // Medium
    if (volume > 10) return 'bg-[#00d4ff]/60'; // Low
    return 'bg-white/5'; // Quiet
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#ffb703]" />
          <h3 className="text-lg font-bold text-white">Call Volume Heatmap</h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span>Low</span>
          <span className="w-3 h-3 rounded bg-white/10 inline-block"></span>
          <span className="w-3 h-3 rounded bg-[#00d4ff]/60 inline-block"></span>
          <span className="w-3 h-3 rounded bg-[#6c63ff] inline-block"></span>
          <span className="w-3 h-3 rounded bg-[#ffb703] inline-block"></span>
          <span className="w-3 h-3 rounded bg-[#ff4757] inline-block"></span>
          <span>Peak</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="space-y-2 overflow-x-auto pb-2">
        {MOCK_HEATMAP_GRID.map((row) => (
          <div key={row.day} className="flex items-center gap-2 min-w-[500px]">
            <span className="w-10 text-xs font-bold text-gray-400 shrink-0">{row.day}</span>
            <div className="grid grid-cols-24 gap-1 flex-1">
              {row.hours.map((cell) => (
                <div
                  key={cell.hour}
                  onMouseEnter={() => setHoveredCell({ day: row.day, hour: cell.hour, volume: cell.volume })}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`h-6 rounded-md transition-all duration-200 cursor-pointer ${getIntensityColor(cell.volume)} hover:scale-125 hover:z-20`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Hover Info Banner */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
        {hoveredCell ? (
          <span className="text-[#00d4ff] font-semibold">
            {hoveredCell.day} at {hoveredCell.hour}:00 — <strong className="text-white">{hoveredCell.volume} calls</strong> processed
          </span>
        ) : (
          <span className="text-gray-500">Hover over any grid cell to view hourly call density</span>
        )}
        <span className="text-gray-400">Peak Hours: 10:00 - 16:00</span>
      </div>
    </div>
  );
}
