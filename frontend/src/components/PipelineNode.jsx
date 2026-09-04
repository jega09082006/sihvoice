import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function PipelineNode({ node, isSelected, onSelect }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Map category to color
  const colorMap = {
    input: '#00d4ff',       // Cyan
    processing: '#6c63ff',  // Purple
    ml: '#ffb703',          // Orange
    output: '#00ff88',      // Green
    storage: '#3b82f6',     // Blue
  };

  const nodeColor = colorMap[node.type] || '#6c63ff';

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Pulse scale slightly if hovered or selected
    const baseScale = hovered || isSelected ? 1.15 : 1.0;
    const pulse = Math.sin(t * 3 + node.id) * 0.03;
    meshRef.current.scale.setScalar(baseScale + pulse);
  });

  return (
    <group position={node.position}>
      {/* Glowing Outer Wireframe Halo */}
      <mesh>
        <boxGeometry args={[3.2, 1.2, 0.6]} />
        <meshBasicMaterial
          color={nodeColor}
          wireframe
          transparent
          opacity={hovered || isSelected ? 0.8 : 0.25}
        />
      </mesh>

      {/* 3D RoundedBox Core */}
      <RoundedBox
        ref={meshRef}
        args={[3.0, 1.0, 0.5]}
        radius={0.15}
        smoothness={4}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshStandardMaterial
          color={nodeColor}
          roughness={0.2}
          metalness={0.8}
          emissive={nodeColor}
          emissiveIntensity={hovered || isSelected ? 0.7 : 0.3}
        />
      </RoundedBox>

      {/* HTML Overlay for Crisp 3D Node Label & Hover Tooltip */}
      <Html
        position={[0, 0, 0.3]}
        center
        distanceFactor={12}
        className="pointer-events-none select-none"
      >
        <div className={`flex flex-col items-center justify-center text-center transition-all duration-300 ${hovered || isSelected ? 'scale-110' : 'scale-100'}`}>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/20 shadow-lg">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: nodeColor }}></span>
            <span className="text-xs font-bold tracking-wide text-white whitespace-nowrap">
              {node.step}. {node.name}
            </span>
          </div>

          {/* Hover Tooltip Card */}
          {(hovered || isSelected) && (
            <div className="mt-2 p-2.5 rounded-lg bg-[#0a0a0f]/95 border border-[#00d4ff]/40 shadow-[0_0_20px_rgba(0,212,255,0.4)] w-56 text-left animate-fadeIn z-50 pointer-events-auto">
              <div className="text-[10px] uppercase font-semibold text-[#00d4ff] mb-0.5">
                {node.type} Module
              </div>
              <div className="text-xs font-bold text-white mb-1">{node.title}</div>
              <div className="text-[11px] text-gray-300 leading-tight">{node.description}</div>
              <div className="mt-1.5 text-[10px] text-gray-400 border-t border-white/10 pt-1 flex justify-between">
                <span>Latency: {node.latency}</span>
                <span>Accuracy: {node.accuracy}</span>
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
