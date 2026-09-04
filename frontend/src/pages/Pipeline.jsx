import React, { useState } from 'react';
import { PIPELINE_NODES } from '../components/Pipeline3D';
import Pipeline3D from '../components/Pipeline3D';
import { Cpu, CheckCircle2, Zap, RotateCcw, Info, ArrowRight, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Pipeline() {
  const [selectedNode, setSelectedNode] = useState(PIPELINE_NODES[0]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-[#0a0a0f] text-gray-100 flex flex-col lg:flex-row overflow-hidden">
      {/* SIDEBAR: Component List & Filter Selector */}
      <aside className="w-full lg:w-96 glass-panel border-r border-white/10 p-6 flex flex-col z-10 shrink-0 h-auto lg:h-[calc(100vh-80px)] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="p-2.5 rounded-xl bg-[#6c63ff]/20 border border-[#6c63ff]/40 text-[#6c63ff]">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">System Architecture</h2>
            <p className="text-xs text-gray-400">12-Stage Multimodal AI Pipeline</p>
          </div>
        </div>

        {/* Component List */}
        <div className="space-y-2 flex-1">
          {PIPELINE_NODES.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const badgeColorMap = {
              input: 'text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/30',
              processing: 'text-[#6c63ff] bg-[#6c63ff]/10 border-[#6c63ff]/30',
              ml: 'text-[#ffb703] bg-[#ffb703]/10 border-[#ffb703]/30',
              output: 'text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/30',
              storage: 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/30',
            };

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#6c63ff]/30 to-[#00d4ff]/20 border-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.3)] scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-black/40 border border-white/20 text-xs font-bold flex items-center justify-center text-white">
                    {node.step}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-[#00d4ff] transition-colors">
                      {node.name}
                    </div>
                    <div className="text-[10px] text-gray-400">{node.title}</div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${badgeColorMap[node.type]}`}>
                  {node.type}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* CENTER: 3D Interactive Pipeline Viewport */}
      <main className="flex-1 relative h-[600px] lg:h-[calc(100vh-80px)] bg-[#07070b] overflow-hidden">
        {/* Floating Instruction Banner */}
        <div className="absolute top-6 left-6 z-10 glass-panel px-4 py-2 rounded-xl border border-white/10 text-xs text-gray-300 flex items-center gap-3">
          <Info className="w-4 h-4 text-[#00d4ff]" />
          <span>Click & Drag to rotate pipeline · Scroll to zoom · Click nodes for details</span>
        </div>

        {/* 3D Canvas */}
        <Pipeline3D
          selectedNode={selectedNode}
          onSelectNode={(node) => setSelectedNode(node)}
        />
      </main>

      {/* RIGHT/BOTTOM: Selected Module Detail Inspector Card */}
      {selectedNode && (
        <aside className="w-full lg:w-96 glass-panel border-l border-white/10 p-6 flex flex-col justify-between z-10 shrink-0 h-auto lg:h-[calc(100vh-80px)] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs uppercase font-bold text-[#00d4ff] tracking-wider">
                Stage {selectedNode.step} Inspector
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{selectedNode.name}</h3>
              <p className="text-sm font-medium text-[#00d4ff] mb-4">{selectedNode.title}</p>
              <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
                {selectedNode.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-xl border border-white/10 text-center">
                <div className="text-xs text-gray-400 mb-1">Latency</div>
                <div className="text-xl font-extrabold text-[#00ff88]">{selectedNode.latency}</div>
              </div>

              <div className="bg-black/30 p-4 rounded-xl border border-white/10 text-center">
                <div className="text-xs text-gray-400 mb-1">Accuracy</div>
                <div className="text-xl font-extrabold text-[#6c63ff]">{selectedNode.accuracy}</div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Execution Dependencies
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 p-3 rounded-lg border border-white/10">
                <Layers className="w-4 h-4 text-[#ffb703]" />
                <span>Input: {selectedNode.step > 1 ? PIPELINE_NODES[selectedNode.step - 2].name : 'Raw Telephony Stream'}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              onClick={() => {
                const nextStep = (selectedNode.step % 12) + 1;
                setSelectedNode(PIPELINE_NODES.find(n => n.step === nextStep));
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#00d4ff] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(108,99,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              Inspect Next Stage
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
