import React from 'react';
import { Mic, Brain, Zap, Activity, Cpu, Sparkles, ShieldCheck } from 'lucide-react';

export default function FeaturesSection() {
  const nodes = [
    {
      id: "01",
      title: "Speaker Diarization",
      description: "Separates agent and customer speech channels with pinpoint accuracy using neural overlap detection.",
      icon: Mic,
      gradient: "from-[#00d4ff] to-[#6c63ff]",
      glowColor: "rgba(0, 212, 255, 0.6)",
      strokeColor: "#00d4ff",
      badge1: "98.3% accuracy",
      badge2: "Whisper + Pyannote",
      badge1Color: "bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/40 shadow-[0_0_12px_rgba(0,212,255,0.3)]",
      badge2Color: "bg-[#6c63ff]/10 text-[#6c63ff] border-[#6c63ff]/40",
      delay: "0s",
    },
    {
      id: "02",
      title: "Voice Emotion AI",
      description: "Analyzes acoustic prosody frequencies to detect Happy, Neutral, Frustrated, and Angry vocal states.",
      icon: Brain,
      gradient: "from-[#6c63ff] to-[#b5179e]",
      glowColor: "rgba(108, 99, 255, 0.7)",
      strokeColor: "#6c63ff",
      badge1: "<50ms latency",
      badge2: "Wav2Vec2 + openSMILE",
      badge1Color: "bg-[#6c63ff]/10 text-[#6c63ff] border-[#6c63ff]/40 shadow-[0_0_12px_rgba(108,99,255,0.3)]",
      badge2Color: "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/40",
      delay: "0.4s",
    },
    {
      id: "03",
      title: "Escalation Radar",
      description: "CatBoost decision trees predict customer churn and supervisor escalation risk before call completion.",
      icon: Zap,
      gradient: "from-[#00ff88] to-[#00d4ff]",
      glowColor: "rgba(0, 255, 136, 0.6)",
      strokeColor: "#00ff88",
      badge1: "Real-time Alert",
      badge2: "CatBoost ML",
      badge1Color: "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/40 shadow-[0_0_12px_rgba(0,255,136,0.3)]",
      badge2Color: "bg-[#ffb703]/10 text-[#ffb703] border-[#ffb703]/40",
      delay: "0.8s",
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 bg-[#0a0a0f] text-gray-100 overflow-hidden">
      {/* Inline Keyframe Animations */}
      <style>{`
        @keyframes hexagonPulse {
          0%, 100% {
            filter: drop-shadow(0 0 12px var(--glow-color)) drop-shadow(0 0 25px rgba(0, 212, 255, 0.2));
            transform: translateY(0px) scale(1);
          }
          50% {
            filter: drop-shadow(0 0 24px var(--glow-color)) drop-shadow(0 0 45px rgba(108, 99, 255, 0.5));
            transform: translateY(-6px) scale(1.03);
          }
        }

        @keyframes flowDash {
          0% {
            stroke-dashoffset: 40;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes travelDotHorizontal {
          0% {
            cx: 0%;
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            cx: 100%;
            opacity: 0.2;
          }
        }

        @keyframes travelDotVertical {
          0% {
            cy: 0%;
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            cy: 100%;
            opacity: 0.2;
          }
        }

        .hex-node {
          animation: hexagonPulse 4s ease-in-out infinite;
        }

        .pipeline-dash {
          stroke-dasharray: 8 8;
          animation: flowDash 1.2s linear infinite;
        }
      `}</style>

      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-[#6c63ff]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-[#00d4ff]/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Section Header */}
      <div className="text-center space-y-4 mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#00d4ff]/30 text-[#00d4ff] text-xs font-semibold uppercase tracking-widest shadow-[0_0_15px_rgba(0,212,255,0.2)]">
          <Activity className="w-3.5 h-3.5 text-[#00d4ff] animate-pulse" />
          Neural Pipeline Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
          End-to-End Multimodal Call Processing
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-light leading-relaxed">
          Transform raw call audio into actionable business insights with millisecond-latency machine learning pipelines.
        </p>
      </div>

      {/* HORIZONTAL TIMELINE / PIPELINE FLOW */}
      <div className="relative z-10">
        {/* Desktop Pipeline Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 relative items-start">
          
          {/* Connector Line 1 (Node 01 to Node 02) */}
          <div className="absolute top-24 left-[28%] right-[40%] h-12 z-0 pointer-events-none flex items-center">
            <svg className="w-full h-8 overflow-visible">
              <defs>
                <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6c63ff" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glowLine1">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <line
                x1="0"
                y1="16"
                x2="100%"
                y2="16"
                stroke="url(#lineGrad1)"
                strokeWidth="2.5"
                className="pipeline-dash"
                filter="url(#glowLine1)"
              />
              <circle cx="50%" cy="16" r="4.5" fill="#00d4ff" filter="url(#glowLine1)">
                <animate attributeName="cx" values="0%;100%" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Connector Line 2 (Node 02 to Node 03) */}
          <div className="absolute top-24 left-[61%] right-[7%] h-12 z-0 pointer-events-none flex items-center">
            <svg className="w-full h-8 overflow-visible">
              <defs>
                <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6c63ff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00ff88" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glowLine2">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <line
                x1="0"
                y1="16"
                x2="100%"
                y2="16"
                stroke="url(#lineGrad2)"
                strokeWidth="2.5"
                className="pipeline-dash"
                filter="url(#glowLine2)"
              />
              <circle cx="50%" cy="16" r="4.5" fill="#00ff88" filter="url(#glowLine2)">
                <animate attributeName="cx" values="0%;100%" dur="2.2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Render 3 Pipeline Nodes */}
          {nodes.map((node, index) => {
            const IconComponent = node.icon;
            return (
              <div key={node.id} className="flex flex-col items-center text-center relative z-10 group">
                
                {/* Floating Metric Badges Near Hexagon */}
                <div className="relative mb-6 w-full flex justify-center h-48 items-center">
                  
                  {/* Badge 1: Top Left Floating */}
                  <div
                    className={`absolute -top-2 left-2 sm:left-6 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md transition-transform duration-300 group-hover:scale-110 ${node.badge1Color}`}
                  >
                    {node.badge1}
                  </div>

                  {/* Badge 2: Bottom Right Floating */}
                  <div
                    className={`absolute bottom-0 right-2 sm:right-6 px-3 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md transition-transform duration-300 group-hover:scale-110 ${node.badge2Color}`}
                  >
                    {node.badge2}
                  </div>

                  {/* HEXAGON SHAPE NODE */}
                  <div
                    className="hex-node relative w-36 h-40 flex items-center justify-center cursor-pointer"
                    style={{
                      '--glow-color': node.glowColor,
                      animationDelay: node.delay,
                    }}
                  >
                    {/* SVG Hexagon Path */}
                    <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 140 160">
                      <defs>
                        <linearGradient id={`hexGrad-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0a0a0f" />
                          <stop offset="50%" stopColor="#12121e" />
                          <stop offset="100%" stopColor="#1a1a2e" />
                        </linearGradient>
                        <linearGradient id={`hexBorder-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={node.strokeColor} />
                          <stop offset="100%" stopColor="#6c63ff" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>

                      {/* Outer Glow Hexagon Polygon */}
                      <polygon
                        points="70,8 132,43 132,117 70,152 8,117 8,43"
                        fill={`url(#hexGrad-${node.id})`}
                        stroke={`url(#hexBorder-${node.id})`}
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                        className="transition-all duration-300 group-hover:stroke-white"
                      />

                      {/* Inner Dashed Hexagon Ring */}
                      <polygon
                        points="70,20 120,49 120,111 70,140 20,111 20,49"
                        fill="none"
                        stroke={node.strokeColor}
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        opacity="0.5"
                      />
                    </svg>

                    {/* Step Number & Icon inside Hexagon */}
                    <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#9ca3af] bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                        STAGE {node.id}
                      </span>
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${node.gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node Title and 2-Line Description below Hexagon */}
                <div className="max-w-xs space-y-2 px-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#00d4ff] transition-colors">
                    {node.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light line-clamp-2">
                    {node.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile / Tablet Vertical Pipeline Fallback */}
        <div className="lg:hidden flex flex-col space-y-12 relative">
          {nodes.map((node, index) => {
            const IconComponent = node.icon;
            const isLast = index === nodes.length - 1;

            return (
              <div key={node.id} className="relative flex flex-col sm:flex-row items-center gap-6 glass-panel p-6 rounded-2xl border border-white/10">
                {/* Mobile Hexagon Node */}
                <div className="relative shrink-0">
                  <div
                    className="hex-node relative w-28 h-32 flex items-center justify-center"
                    style={{
                      '--glow-color': node.glowColor,
                      animationDelay: node.delay,
                    }}
                  >
                    <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 140 160">
                      <polygon
                        points="70,8 132,43 132,117 70,152 8,117 8,43"
                        fill="#12121e"
                        stroke={node.strokeColor}
                        strokeWidth="3"
                      />
                    </svg>
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="text-[9px] font-bold text-gray-400 mb-1">STAGE {node.id}</span>
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${node.gradient} text-white`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Details */}
                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${node.badge1Color}`}>
                      {node.badge1}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${node.badge2Color}`}>
                      {node.badge2}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{node.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">{node.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
