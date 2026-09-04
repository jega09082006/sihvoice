import React, { useState } from 'react';
import { Sliders, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EscalationMeter() {
  const [sentiment, setSentiment] = useState(42);
  const [anger, setAnger] = useState(6);
  const [silence, setSilence] = useState(35);
  const [duration, setDuration] = useState(7);

  const [predictedRisk, setPredictedRisk] = useState(null);

  const handlePredict = () => {
    // Formula for probability score (0 to 100)
    let score = Math.round(
      (100 - sentiment) * 0.35 +
      anger * 5 +
      silence * 0.25 +
      (duration > 8 ? 15 : duration * 1.2)
    );
    score = Math.min(99, Math.max(5, score));
    setPredictedRisk(score);
  };

  const getRiskCategory = (score) => {
    if (score >= 65) return { label: 'High Escalation Risk', color: '#ff4757', border: 'border-[#ff4757]' };
    if (score >= 35) return { label: 'Medium Escalation Risk', color: '#ffb703', border: 'border-[#ffb703]' };
    return { label: 'Low Escalation Risk', color: '#00ff88', border: 'border-[#00ff88]' };
  };

  const currentScore = predictedRisk !== null ? predictedRisk : Math.round(
    (100 - sentiment) * 0.35 + anger * 5 + silence * 0.25 + (duration > 8 ? 15 : duration * 1.2)
  );
  const riskInfo = getRiskCategory(currentScore);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#ffb703]" />
            <h3 className="text-lg font-bold text-white">CatBoost Escalation Predictor</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
            ML Simulation Model
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Sentiment Score: <strong className="text-white">{sentiment}%</strong></span>
              <span className="text-gray-500">0 - 100%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sentiment}
              onChange={(e) => setSentiment(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#6c63ff]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Vocal Anger Level: <strong className="text-[#ff4757]">{anger}/10</strong></span>
              <span className="text-gray-500">0 - 10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={anger}
              onChange={(e) => setAnger(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff4757]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Silence Ratio: <strong className="text-white">{silence}%</strong></span>
              <span className="text-gray-500">0 - 100%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={silence}
              onChange={(e) => setSilence(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00d4ff]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Call Duration: <strong className="text-white">{duration} mins</strong></span>
              <span className="text-gray-500">1 - 15 mins</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
            />
          </div>
        </div>

        {/* Predict Action Button */}
        <button
          onClick={handlePredict}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffb703] to-[#ff4757] text-white font-bold text-sm shadow-[0_0_15px_rgba(255,183,3,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mb-6"
        >
          <Sliders className="w-4 h-4" />
          Run CatBoost Model Prediction
        </button>
      </div>

      {/* Arc Gauge Meter Result Card */}
      <div className={`p-4 rounded-xl bg-white/5 border ${riskInfo.border} flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          {/* Animated Meter Circle */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="transparent" />
              <motion.circle
                cx="32"
                cy="32"
                r="26"
                stroke={riskInfo.color}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="163"
                initial={{ strokeDashoffset: 163 }}
                animate={{ strokeDashoffset: 163 - (163 * currentScore) / 100 }}
                transition={{ duration: 0.8 }}
              />
            </svg>
            <span className="absolute text-sm font-extrabold text-white">{currentScore}%</span>
          </div>

          <div>
            <div className="text-xs text-gray-400">Escalation Probability</div>
            <div className="text-base font-bold" style={{ color: riskInfo.color }}>
              {riskInfo.label}
            </div>
          </div>
        </div>

        <div className="text-right text-xs text-gray-400">
          <div>Confidence: <strong className="text-white">98.4%</strong></div>
          <div>Latency: <strong className="text-[#00ff88]">6ms</strong></div>
        </div>
      </div>
    </div>
  );
}
