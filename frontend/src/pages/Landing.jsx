import React from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Cpu,
  LayoutDashboard,
  Sparkles,
  BarChart3
} from 'lucide-react';
import BrainMesh from '../components/BrainMesh';
import ParticleWave from '../components/ParticleWave';
import FeaturesSection from '../components/FeaturesSection';

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-gray-100 overflow-hidden">
      {/* 3D HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* 3D Canvas Background */}
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 7], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#6c63ff" />
            <pointLight position={[-10, -10, -10]} intensity={1.2} color="#00d4ff" />

            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
              <BrainMesh />
            </Float>

            <ParticleWave count={700} />

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.8}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 2.5}
            />
          </Canvas>
        </div>

        {/* Ambient Gradient Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6c63ff]/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4ff]/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Overlay Hero Text */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-[#00d4ff]/40 text-[#00d4ff] text-xs font-semibold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
          >
            <Sparkles className="w-4 h-4 text-[#00d4ff] animate-spin" />
            Next-Gen Voice Intelligence Engine v2.4
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-white mb-6"
          >
            AI-Powered <br />
            <span className="bg-gradient-to-r from-white via-[#00d4ff] to-[#6c63ff] bg-clip-text text-transparent glow-text-cyan">
              Call Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed"
          >
            Real-time Emotion Detection <span className="text-[#00d4ff]">·</span> Speaker Diarization <span className="text-[#6c63ff]">·</span> Escalation Prediction
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#00d4ff] text-white font-bold text-lg flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(108,99,255,0.6)] hover:shadow-[0_0_35px_rgba(0,212,255,0.8)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <LayoutDashboard className="w-5 h-5" />
              View Live Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/analytics"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-white font-bold text-lg flex items-center justify-center gap-3 border border-white/20 hover:bg-white/10 hover:border-[#00d4ff]/60 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <BarChart3 className="w-5 h-5 text-[#00d4ff]" />
              Deep Analytics
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURE PIPELINE SECTION */}
      <FeaturesSection />

      {/* METRICS & METERS BANNER */}
      <section className="relative py-16 bg-white/[0.02] border-y border-white/10 z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-white glow-text-purple">1.2M+</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mt-2">Calls Analyzed Daily</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-[#00d4ff] glow-text-cyan">99.4%</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mt-2">Emotion Accuracy</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-[#00ff88]">&lt;45ms</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mt-2">Inference Latency</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-extrabold text-[#ffb703]">4.8x</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mt-2">CSAT Improvement</div>
          </div>
        </div>
      </section>
    </div>
  );
}
