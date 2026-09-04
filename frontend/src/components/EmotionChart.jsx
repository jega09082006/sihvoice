import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { MOCK_EMOTION_DISTRIBUTION } from '../data/mockAnalytics';
import { HeartPulse } from 'lucide-react';

export default function EmotionChart() {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-[#6c63ff]" />
          <h3 className="text-lg font-bold text-white">Emotion Distribution</h3>
        </div>
        <span className="text-xs text-gray-400">Live Breakdown</span>
      </div>

      <div className="relative w-full h-64 flex items-center justify-center my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={MOCK_EMOTION_DISTRIBUTION}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              animationBegin={200}
              animationDuration={1200}
            >
              {MOCK_EMOTION_DISTRIBUTION.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0a0a0f" strokeWidth={3} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 15, 0.95)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value}%`, 'Percentage']}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Metric Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-white">75%</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Positive / Neutral</span>
        </div>
      </div>

      {/* Custom Legend Cards */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
        {MOCK_EMOTION_DISTRIBUTION.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-xs font-semibold text-gray-300">{item.name}</span>
            </div>
            <span className="text-xs font-bold text-white">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
