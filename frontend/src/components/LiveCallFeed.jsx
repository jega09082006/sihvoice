import React, { useState } from 'react';
import { MOCK_CALLS } from '../data/mockCalls';
import { PhoneCall, User, Clock, AlertTriangle, ChevronRight, X, Sparkles, MessageSquare, Volume2 } from 'lucide-react';

export default function LiveCallFeed() {
  const [selectedCall, setSelectedCall] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCalls = MOCK_CALLS.filter(call =>
    call.caller.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEmotionBadge = (emotion) => {
    switch (emotion) {
      case 'Happy':
        return 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30';
      case 'Neutral':
        return 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/30';
      case 'Frustrated':
        return 'bg-[#ffb703]/10 text-[#ffb703] border-[#ffb703]/30';
      case 'Angry':
        return 'bg-[#ff4757]/10 text-[#ff4757] border-[#ff4757]/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'Low':
        return 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30';
      case 'Medium':
        return 'bg-[#ffb703]/10 text-[#ffb703] border-[#ffb703]/30';
      case 'High':
        return 'bg-[#ff4757]/10 text-[#ff4757] border-[#ff4757]/30 shadow-[0_0_10px_rgba(255,71,87,0.3)]';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-[#00d4ff]" />
          <h3 className="text-lg font-bold text-white">Live Call Stream</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping"></span>
          {MOCK_CALLS.length} Active
        </span>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Filter calls by agent, caller or ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00d4ff] mb-4"
      />

      {/* Scrollable Call List */}
      <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] pr-1">
        {filteredCalls.map((call) => (
          <div
            key={call.id}
            onClick={() => setSelectedCall(call)}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#00d4ff]/50 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 overflow-hidden shrink-0">
                <img src={call.agentAvatar} alt={call.agent} className="w-full h-full object-cover" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white group-hover:text-[#00d4ff] transition-colors">
                    {call.id}
                  </span>
                  <span className="text-xs text-gray-400">· {call.caller}</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-3 mt-1">
                  <span>Agent: {call.agent}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {call.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getEmotionBadge(call.emotion)}`}>
                {call.emotion}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getRiskBadge(call.escalationRisk)}`}>
                {call.escalationRisk} Risk
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Call Details Drawer Modal */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-end animate-fadeIn">
          <div className="w-full max-w-xl bg-[#0d0d15] border-l border-white/10 h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h4 className="text-xl font-bold text-white flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-[#00d4ff]" />
                    {selectedCall.id} Details
                  </h4>
                  <p className="text-xs text-gray-400">{selectedCall.timestamp} · Department: {selectedCall.department}</p>
                </div>
                <button
                  onClick={() => setSelectedCall(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Call Overview Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                  <div className="text-[11px] text-gray-400 mb-1">Sentiment Score</div>
                  <div className="text-2xl font-extrabold text-[#00ff88]">{selectedCall.sentimentScore}%</div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                  <div className="text-[11px] text-gray-400 mb-1">Emotion State</div>
                  <div className={`text-sm font-bold mt-1.5 px-2 py-0.5 rounded-full inline-block border ${getEmotionBadge(selectedCall.emotion)}`}>
                    {selectedCall.emotion}
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                  <div className="text-[11px] text-gray-400 mb-1">Escalation Risk</div>
                  <div className={`text-sm font-bold mt-1.5 px-2 py-0.5 rounded-full inline-block border ${getRiskBadge(selectedCall.escalationRisk)}`}>
                    {selectedCall.escalationRisk}
                  </div>
                </div>
              </div>

              {/* Audio Metrics */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6 space-y-2">
                <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-[#6c63ff]" /> Acoustic Telemetry
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-300">
                  <div>Silence Ratio: <span className="font-bold text-white">{Math.round(selectedCall.silenceRatio * 100)}%</span></div>
                  <div>Speech Rate: <span className="font-bold text-white">{selectedCall.speechRate}</span></div>
                  <div>Pitch Mean: <span className="font-bold text-white">{selectedCall.avgPitch}</span></div>
                </div>
              </div>

              {/* Full Transcript Segment */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-[#00d4ff]" /> Call Transcript
                </div>
                {selectedCall.transcript.map((utterance, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl text-xs space-y-1 ${
                      utterance.speaker === 'Customer'
                        ? 'bg-[#00d4ff]/10 border border-[#00d4ff]/20 ml-4'
                        : 'bg-[#6c63ff]/10 border border-[#6c63ff]/20 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                      <span className="font-bold text-white">{utterance.speaker} ({utterance.time})</span>
                      <span className={`px-2 py-0.5 rounded border ${getEmotionBadge(utterance.emotion)}`}>
                        {utterance.emotion}
                      </span>
                    </div>
                    <p className="text-gray-200">{utterance.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedCall(null)}
              className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
