import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import PipelineNode from './PipelineNode';

// 12 Nodes definition with positions, types, colors & metadata
export const PIPELINE_NODES = [
  {
    id: 1,
    step: 1,
    name: "Call Recording",
    title: "Audio Stream Ingestion",
    type: "input",
    description: "Captures 16kHz PCM audio stream via WebRTC / SIP trunks from PBX contact centers.",
    latency: "5ms",
    accuracy: "100%",
    position: [0, 15, 0]
  },
  {
    id: 2,
    step: 2,
    name: "Audio Preprocessing",
    title: "Noise Suppression & Normalization",
    type: "processing",
    description: "Applies spectral subtraction, gain control, and bandpass filtering to clean raw audio.",
    latency: "8ms",
    accuracy: "99.1%",
    position: [0, 12.2, 0]
  },
  {
    id: 3,
    step: 3,
    name: "Whisper (STT)",
    title: "Speech-to-Text Transcription",
    type: "processing",
    description: "OpenAI Whisper Large-v3 model transcribes spoken dialogue into punctuated text.",
    latency: "18ms",
    accuracy: "98.7%",
    position: [0, 9.4, 0]
  },
  {
    id: 4,
    step: 4,
    name: "Transcript + Timestamps",
    title: "Word-Level Alignment",
    type: "processing",
    description: "Generates high-precision millisecond word timestamps and sentence boundaries.",
    latency: "4ms",
    accuracy: "99.8%",
    position: [0, 6.6, 0]
  },
  {
    id: 5,
    step: 5,
    name: "Speaker Diarization",
    title: "Pyannote Audio Overlap Split",
    type: "processing",
    description: "Identifies speaker turns and isolates distinct acoustic voice signatures.",
    latency: "12ms",
    accuracy: "97.5%",
    position: [0, 3.8, 0]
  },
  {
    id: 6,
    step: 6,
    name: "Customer / Agent Split",
    title: "Dual Channel Routing",
    type: "processing",
    description: "Branches audio into parallel execution tracks for acoustic feature and voice emotion modeling.",
    latency: "2ms",
    accuracy: "100%",
    position: [0, 1.0, 0]
  },
  {
    id: 7,
    step: 7,
    name: "Wav2Vec2 — Voice Emotion",
    title: "Neural Prosody Classifier",
    type: "ml",
    description: "Fine-tuned Wav2Vec2 transformer classifies vocal emotion state from raw waveforms.",
    latency: "15ms",
    accuracy: "96.4%",
    position: [-2.6, -1.8, 0] // Left Branch
  },
  {
    id: 8,
    step: 8,
    name: "openSMILE — Features",
    title: "Acoustic Feature Extractor",
    type: "ml",
    description: "Extracts eGeMAPS acoustic set: pitch, shimmer, jitter, loudness, and MFCC coefficients.",
    latency: "10ms",
    accuracy: "99.2%",
    position: [2.6, -1.8, 0] // Right Branch
  },
  {
    id: 9,
    step: 9,
    name: "CatBoost (ML Model)",
    title: "Multimodal Fusion Classifier",
    type: "ml",
    description: "Merges acoustic features, emotion probabilities, and transcript sentiment for risk scoring.",
    latency: "7ms",
    accuracy: "97.9%",
    position: [0, -4.6, 0] // Rejoin Merge Node
  },
  {
    id: 10,
    step: 10,
    name: "Emotion / Escalation Risk",
    title: "Real-time Risk & Sentiment",
    type: "output",
    description: "Computes final call sentiment percentage and triggers supervisor alerts if escalation risk is high.",
    latency: "3ms",
    accuracy: "98.5%",
    position: [0, -7.4, 0]
  },
  {
    id: 11,
    step: 11,
    name: "Firebase Store",
    title: "Real-time Database & Logs",
    type: "storage",
    description: "Persists call metadata, transcripts, and emotion timeline segments to Firebase Firestore.",
    latency: "14ms",
    accuracy: "100%",
    position: [0, -10.2, 0]
  },
  {
    id: 12,
    step: 12,
    name: "Analytics Dashboard",
    title: "Live UI Stream",
    type: "output",
    description: "Pushes real-time call telemetry to web dashboards and agent performance analytics.",
    latency: "2ms",
    accuracy: "100%",
    position: [0, -13.0, 0]
  }
];

// Flowing particles along connecting paths
function FlowingParticlePath({ start, end, color = "#00d4ff" }) {
  const particleRef = useRef();

  useFrame(({ clock }) => {
    if (!particleRef.current) return;
    const t = (clock.getElapsedTime() * 0.8) % 1;
    const currentPos = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
      t
    );
    particleRef.current.position.copy(currentPos);
  });

  return (
    <group>
      {/* Static Connection Line */}
      <Line
        points={[start, end]}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.4}
      />
      {/* Moving Glowing Particle along line */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

export default function Pipeline3D({ selectedNode, onSelectNode }) {
  // Construct paths between consecutive nodes, including branching logic
  const connectionPaths = useMemo(() => {
    const paths = [];

    // Main vertical path 1 -> 6
    for (let i = 0; i < 5; i++) {
      paths.push({
        start: PIPELINE_NODES[i].position,
        end: PIPELINE_NODES[i + 1].position,
        color: "#6c63ff"
      });
    }

    // Branch from Split (Node 6) -> Wav2Vec2 (Node 7 Left) & openSMILE (Node 8 Right)
    paths.push({
      start: PIPELINE_NODES[5].position,
      end: PIPELINE_NODES[6].position,
      color: "#ffb703"
    });
    paths.push({
      start: PIPELINE_NODES[5].position,
      end: PIPELINE_NODES[7].position,
      color: "#ffb703"
    });

    // Merge from Wav2Vec2 (Node 7) & openSMILE (Node 8) -> CatBoost (Node 9)
    paths.push({
      start: PIPELINE_NODES[6].position,
      end: PIPELINE_NODES[8].position,
      color: "#ffb703"
    });
    paths.push({
      start: PIPELINE_NODES[7].position,
      end: PIPELINE_NODES[8].position,
      color: "#ffb703"
    });

    // Path 9 -> 10 -> 11 -> 12
    for (let i = 8; i < 11; i++) {
      paths.push({
        start: PIPELINE_NODES[i].position,
        end: PIPELINE_NODES[i + 1].position,
        color: i === 9 ? "#00ff88" : i === 10 ? "#3b82f6" : "#00ff88"
      });
    }

    return paths;
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 1, 24], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 20, 15]} intensity={1.2} color="#6c63ff" />
        <pointLight position={[-10, -20, 15]} intensity={1.2} color="#00d4ff" />

        {/* Render 12 3D Nodes */}
        {PIPELINE_NODES.map((node) => (
          <PipelineNode
            key={node.id}
            node={node}
            isSelected={selectedNode?.id === node.id}
            onSelect={onSelectNode}
          />
        ))}

        {/* Flowing connection lines */}
        {connectionPaths.map((path, idx) => (
          <FlowingParticlePath
            key={idx}
            start={path.start}
            end={path.end}
            color={path.color}
          />
        ))}

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          maxDistance={35}
          minDistance={10}
        />
      </Canvas>
    </div>
  );
}
