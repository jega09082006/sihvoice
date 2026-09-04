import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleWave({ count = 600 }) {
  const pointsRef = useRef();

  // Create initial positions and colors array for 500+ particles in a 3D grid waveform shape
  const [positions, colors] = useMemo(() => {
    const posArr = new Float32Array(count * 3);
    const colArr = new Float32Array(count * 3);

    const color1 = new THREE.Color("#6c63ff");
    const color2 = new THREE.Color("#00d4ff");
    const color3 = new THREE.Color("#00ff88");

    const rows = 25;
    const cols = Math.floor(count / rows);

    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * 0.4;
        const z = (r - rows / 2) * 0.4 - 3;
        const y = Math.sin(x * 0.5) * Math.cos(z * 0.5);

        posArr[i * 3] = x;
        posArr[i * 3 + 1] = y;
        posArr[i * 3 + 2] = z;

        const mixedColor = color1.clone().lerp(color2, (c / cols)).lerp(color3, (r / rows) * 0.3);
        colArr[i * 3] = mixedColor.r;
        colArr[i * 3 + 1] = mixedColor.g;
        colArr[i * 3 + 2] = mixedColor.b;

        i++;
      }
    }

    return [posArr, colArr];
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position;

    let i = 0;
    const rows = 25;
    const cols = Math.floor(count / rows);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * 0.4;
        const z = (r - rows / 2) * 0.4 - 3;
        const wave = Math.sin(x * 1.2 + time * 2.5) * Math.cos(z * 0.8 + time * 1.8) * 0.6;
        positionAttr.setY(i, wave - 2);
        i++;
      }
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}
