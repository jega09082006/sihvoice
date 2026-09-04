import React from 'react';
import { MOCK_CALLS } from '../data/mockCalls';
import { MessageSquare, User, Bot, Smile, Frown, AlertCircle } from 'lucide-react';

export default function TranscriptViewer() {
  const call = MOCK_CALLS[0];

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
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#6c63ff]" />
          <h3 className="text-lg font-bold text-white">Interactive Call Transcript</h3>
        </div>
        <span className="text-xs text-gray-400">Call ID: {call.id}</span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] pr-1">
        {call.transcript.map((u, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition-all ${
              u.speaker === 'Customer'
                ? 'bg-[#00d4ff]/5 border-[#00d4ff]/20 ml-2'
                : 'bg-[#6c63ff]/5 border-[#6c63ff]/20 mr-2'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {u.speaker === 'Customer' ? (
                  <User className="w-4 h-4 text-[#00d4ff]" />
                ) : (
                  <Bot className="w-4 h-4 text-[#6c63ff]" />
                )}
                <span className="text-xs font-bold text-white">{u.speaker}</span>
                <span className="text-[10px] text-gray-400">· {u.time}</span>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getEmotionBadge(u.emotion)}`}>
                {u.emotion}
              </span>
            </div>

            <p className="text-sm text-gray-200 leading-relaxed font-light">{u.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
