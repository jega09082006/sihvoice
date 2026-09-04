import React from 'react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

export default function KPICard({ title, value, numericVal, unit = '', change, isPositive, icon: Icon, glowColor = 'purple', sparklineData }) {
  const animatedValue = useAnimatedCounter(numericVal || 100);

  const glowStyles = {
    purple: 'border-[#6c63ff]/40 shadow-[0_0_20px_rgba(108,99,255,0.25)] text-[#6c63ff]',
    cyan: 'border-[#00d4ff]/40 shadow-[0_0_20px_rgba(0,212,255,0.25)] text-[#00d4ff]',
    green: 'border-[#00ff88]/40 shadow-[0_0_20px_rgba(0,255,136,0.25)] text-[#00ff88]',
    orange: 'border-[#ffb703]/40 shadow-[0_0_20px_rgba(255,183,3,0.25)] text-[#ffb703]',
  };

  const strokeColors = {
    purple: '#6c63ff',
    cyan: '#00d4ff',
    green: '#00ff88',
    orange: '#ffb703',
  };

  return (
    <div className={`glass-panel p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${glowStyles[glowColor]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</span>
        <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${glowStyles[glowColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {typeof numericVal === 'number' ? animatedValue.toLocaleString() : value}
            {unit && <span className="text-xl ml-1 text-gray-300">{unit}</span>}
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isPositive ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-[#ff4757]/10 text-[#ff4757]'
              }`}
            >
              {change}
            </span>
            <span className="text-[11px] text-gray-400">vs last week</span>
          </div>
        </div>

        {/* Sparkline mini chart */}
        {sparklineData && (
          <div className="w-24 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="val"
                  stroke={strokeColors[glowColor]}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
