import React, { useState, useEffect } from 'react';
import KPICard from '../components/KPICard';
import LiveCallFeed from '../components/LiveCallFeed';
import EmotionChart from '../components/EmotionChart';
import HeatmapGrid from '../components/HeatmapGrid';
import AgentLeaderboard from '../components/AgentLeaderboard';
import { MOCK_SENTIMENT_7DAYS } from '../data/mockAnalytics';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PhoneCall, HeartPulse, AlertOctagon, Clock, Filter, Calendar, Users, Building, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [department, setDepartment] = useState('All');
  const [selectedAgent, setSelectedAgent] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const sparkline1 = [{ val: 120 }, { val: 180 }, { val: 240 }, { val: 310 }, { val: 285 }, { val: 340 }, { val: 390 }];
  const sparkline2 = [{ val: 65 }, { val: 68 }, { val: 74 }, { val: 71 }, { val: 79 }, { val: 84 }, { val: 88 }];
  const sparkline3 = [{ val: 12.5 }, { val: 11.2 }, { val: 9.8 }, { val: 10.4 }, { val: 8.9 }, { val: 8.5 }, { val: 8.3 }];
  const sparkline4 = [{ val: 320 }, { val: 310 }, { val: 290 }, { val: 280 }, { val: 275 }, { val: 272 }, { val: 272 }];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0f] p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-16 bg-white/5 rounded-2xl border border-white/10"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-36 bg-white/5 rounded-2xl border border-white/10"></div>
          <div className="h-36 bg-white/5 rounded-2xl border border-white/10"></div>
          <div className="h-36 bg-white/5 rounded-2xl border border-white/10"></div>
          <div className="h-36 bg-white/5 rounded-2xl border border-white/10"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
          <div className="bg-white/5 rounded-2xl border border-white/10"></div>
          <div className="bg-white/5 rounded-2xl border border-white/10"></div>
          <div className="bg-white/5 rounded-2xl border border-white/10"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-80px)] bg-[#0a0a0f] text-gray-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8"
    >
      {/* TOP FILTER BAR */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#6c63ff]/20 border border-[#6c63ff]/40 text-[#6c63ff]">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Call Intelligence Dashboard</h2>
            <p className="text-xs text-gray-400">Real-time metrics, emotion breakdown & agent telemetry</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Date Range Picker */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
            <Calendar className="w-4 h-4 text-[#00d4ff]" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-white font-semibold cursor-pointer"
            >
              <option value="24h" className="bg-[#0a0a0f] text-white">Last 24 Hours</option>
              <option value="7d" className="bg-[#0a0a0f] text-white">Last 7 Days</option>
              <option value="30d" className="bg-[#0a0a0f] text-white">Last 30 Days</option>
            </select>
          </div>

          {/* Department Dropdown */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
            <Building className="w-4 h-4 text-[#6c63ff]" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-white font-semibold cursor-pointer"
            >
              <option value="All" className="bg-[#0a0a0f] text-white">All Departments</option>
              <option value="Billing" className="bg-[#0a0a0f] text-white">Billing</option>
              <option value="Support" className="bg-[#0a0a0f] text-white">Support</option>
              <option value="Sales" className="bg-[#0a0a0f] text-white">Sales</option>
              <option value="Technical" className="bg-[#0a0a0f] text-white">Technical</option>
            </select>
          </div>

          {/* Agent Selector */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
            <Users className="w-4 h-4 text-[#00ff88]" />
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-white font-semibold cursor-pointer"
            >
              <option value="All" className="bg-[#0a0a0f] text-white">All Agents</option>
              <option value="Sarah Connor" className="bg-[#0a0a0f] text-white">Sarah Connor</option>
              <option value="Alex Mercer" className="bg-[#0a0a0f] text-white">Alex Mercer</option>
              <option value="Elena Rostova" className="bg-[#0a0a0f] text-white">Elena Rostova</option>
              <option value="David Chen" className="bg-[#0a0a0f] text-white">David Chen</option>
            </select>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
            }}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TOP 4 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Calls Today"
          value="1,284"
          numericVal={1284}
          change="+14.2%"
          isPositive={true}
          icon={PhoneCall}
          glowColor="cyan"
          sparklineData={sparkline1}
        />
        <KPICard
          title="Avg Sentiment Score"
          value="72"
          numericVal={72}
          unit="%"
          change="+4.8%"
          isPositive={true}
          icon={HeartPulse}
          glowColor="green"
          sparklineData={sparkline2}
        />
        <KPICard
          title="Escalation Rate"
          value="8.3"
          numericVal={8.3}
          unit="%"
          change="-2.1%"
          isPositive={true}
          icon={AlertOctagon}
          glowColor="orange"
          sparklineData={sparkline3}
        />
        <KPICard
          title="Avg Handle Time"
          value="4m 32s"
          numericVal={272}
          change="-18s"
          isPositive={true}
          icon={Clock}
          glowColor="purple"
          sparklineData={sparkline4}
        />
      </div>

      {/* MAIN DASHBOARD GRID (3 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Live Call Feed (5 cols) */}
        <div className="lg:col-span-5 h-[520px]">
          <LiveCallFeed />
        </div>

        {/* Center Panel: Emotion Donut Chart (3 cols) */}
        <div className="lg:col-span-3 h-[520px]">
          <EmotionChart />
        </div>

        {/* Right Panel: 7-Day Sentiment Trend Line Chart (4 cols) */}
        <div className="lg:col-span-4 h-[520px] glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-[#00ff88]" />
              7-Day Sentiment Trend
            </h3>
            <span className="text-xs text-gray-400">Score Out of 100</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_SENTIMENT_7DAYS}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#9ca3af" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 10, 15, 0.95)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#00ff88"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#00ff88' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between text-xs text-gray-400">
            <span>Peak Day: <strong className="text-white">Sunday (88%)</strong></span>
            <span>Weekly Avg: <strong className="text-[#00ff88]">76.5%</strong></span>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION (2 COLUMNS: Heatmap & Leaderboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-[360px]">
          <HeatmapGrid />
        </div>
        <div className="lg:col-span-5 h-[360px]">
          <AgentLeaderboard />
        </div>
      </div>
    </motion.div>
  );
}
