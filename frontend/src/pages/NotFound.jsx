import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import * as THREE from 'three';

function FloatingKnotMesh() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
  });

  return (
    <group scale={[1.8, 1.8, 1.8]}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.2, 0.3, 100, 16]} />
        <meshStandardMaterial
          color="#1a73e8"
          wireframe
          emissive="#1a73e8"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-84px)] bg-[#0a0a0f] text-gray-100 flex items-center justify-center overflow-hidden p-6 font-mono">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#1a73e8" />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <FloatingKnotMesh />
          </Float>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        </Canvas>
      </div>

      <div className="relative z-10 max-w-lg mx-auto text-center bg-black/80 p-8 rounded-3xl border border-[#1a73e8]/40 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-[#1a73e8]/20 border border-[#1a73e8]/40 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-[#1a73e8]" />
        </div>

        <div className="px-3 py-1 rounded bg-[#f59e0b]/20 text-[#f59e0b] font-bold text-xs inline-block mb-3 border border-[#f59e0b]/50">
          PAGE NOT FOUND
        </div>

        <h1 className="text-5xl font-black text-white mb-2 tracking-tight">404</h1>
        <h2 className="text-base font-bold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-xs text-gray-400 mb-8 leading-relaxed">
          This page does not exist in the Voice Recognizer and Management Platform. Please use the navigation above.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1a73e8]/20 hover:bg-[#1a73e8]/30 border border-[#1a73e8]/50 text-[#1a73e8] font-bold text-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upload &amp; Analyze
        </Link>
      </div>
    </div>
  );
}
