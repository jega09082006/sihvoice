import React from 'react';
import { MOCK_AGENTS } from '../data/mockAgents';
import { Trophy, Award, Star } from 'lucide-react';

export default function AgentLeaderboard() {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#ffb703]" />
          <h3 className="text-lg font-bold text-white">Agent Leaderboard</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#ffb703]/10 text-[#ffb703] border border-[#ffb703]/30">
          Top Performers
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {MOCK_AGENTS.map((agent, index) => (
          <div
            key={agent.id}
            className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-[#6c63ff] overflow-hidden">
                  <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black border border-white/20 text-[10px] font-bold text-white flex items-center justify-center">
                  #{index + 1}
                </span>
              </div>

              <div>
                <div className="font-bold text-sm text-white">{agent.name}</div>
                <div className="text-xs text-gray-400">
                  {agent.callsHandled} calls · Escalation: {agent.escalationRate}
                </div>
              </div>
            </div>

            {/* Score & Progress Bar */}
            <div className="text-right w-32">
              <div className="flex items-center justify-end gap-1 mb-1">
                <Star className="w-3.5 h-3.5 text-[#00ff88] fill-[#00ff88]" />
                <span className="text-sm font-extrabold text-[#00ff88]">{agent.sentimentScore}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#6c63ff] to-[#00ff88] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${agent.sentimentScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
