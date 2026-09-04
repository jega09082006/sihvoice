import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function BrainMesh() {
  const groupRef = useRef();
  const innerMeshRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame(({ clock, pointer }) => {
    const time = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.15 + pointer.x * 0.3;
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1 + pointer.y * 0.2;
    }

    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.y = -time * 0.3;
    }

    if (ring1Ref.current) ring1Ref.current.rotation.z = time * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.x = time * 0.3;
    if (ring3Ref.current) ring3Ref.current.rotation.y = time * 0.5;
  });

  return (
    <group ref={groupRef} scale={[1.8, 1.8, 1.8]}>
      {/* Central Neural Icosahedron Sphere */}
      <mesh ref={innerMeshRef}>
        <icosahedronGeometry args={[1.5, 3]} />
        <meshStandardMaterial
          color="#6c63ff"
          wireframe
          emissive="#00d4ff"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Core Glowing Orb */}
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} />
      </mesh>

      {/* Orbit Ring 1 (Cyan) */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
      </mesh>

      {/* Orbit Ring 2 (Purple) */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.6, 0.015, 16, 100]} />
        <meshBasicMaterial color="#6c63ff" transparent opacity={0.7} />
      </mesh>

      {/* Orbit Ring 3 (Neon Green accent) */}
      <mesh ref={ring3Ref} rotation={[Math.PI / 6, -Math.PI / 4, 0]}>
        <torusGeometry args={[3.0, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
