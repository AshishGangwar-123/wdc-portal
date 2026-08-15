/* ==========================================================================
   CodeFuel — Three.js Tunnel Scene
   Infinite neon tunnel, particles, and spaceship rendered in WebGL
   ========================================================================== */

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// ── Tunnel Rings ──────────────────────────────────────────────────────────
function TunnelRings({ speed, colors, ringCount = 40, depth = 120 }) {
  const groupRef = useRef();
  const ringsData = useMemo(() => {
    return Array.from({ length: ringCount }, (_, i) => ({
      z: -(i / ringCount) * depth,
      rotZ: Math.random() * Math.PI * 2,
      scale: 0.85 + Math.random() * 0.3,
    }));
  }, [ringCount, depth]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const children = groupRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const ring = children[i];
      ring.position.z += speed * delta * 18;
      ring.rotation.z += delta * 0.15 * (i % 2 === 0 ? 1 : -1);

      // Recycle rings that pass the camera
      if (ring.position.z > 5) {
        ring.position.z -= depth;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {ringsData.map((rd, i) => {
        const color = colors[i % colors.length];
        return (
          <mesh key={i} position={[0, 0, rd.z]} rotation={[0, 0, rd.rotZ]} scale={rd.scale}>
            <torusGeometry args={[4.5, 0.04, 8, 64]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.35 + (i % 3) * 0.15}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ── Speed Particles (code-like fragments flying past) ─────────────────────
function SpeedParticles({ speed, color, count = 600 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;     // x
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      arr[i * 3 + 2] = -Math.random() * 120;        // z
    }
    return arr;
  }, [count]);

  const sizes = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = 0.02 + Math.random() * 0.06;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 2] += speed * delta * 25;
      if (pos.array[i * 3 + 2] > 5) {
        pos.array[i * 3 + 2] = -120;
        pos.array[i * 3] = (Math.random() - 0.5) * 20;
        pos.array[i * 3 + 1] = (Math.random() - 0.5) * 20;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.06}
        transparent
        opacity={0.7}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

// ── Spaceship ─────────────────────────────────────────────────────────────
function Spaceship({ combo, fuelPercent }) {
  const groupRef = useRef();
  const engineRef = useRef();
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.y = Math.sin(timeRef.current * 1.5) * 0.08;
      groupRef.current.position.x = Math.sin(timeRef.current * 0.7) * 0.05;
      groupRef.current.rotation.z = Math.sin(timeRef.current * 1.2) * 0.03;
    }
    if (engineRef.current) {
      // Engine glow intensity based on combo
      const intensity = 0.5 + Math.min(combo, 5) * 0.15;
      engineRef.current.material.emissiveIntensity = intensity + Math.sin(timeRef.current * 8) * 0.2;
    }
  });

  const shipColor = fuelPercent > 25 ? '#00f2fe' : fuelPercent > 12 ? '#f59e0b' : '#ff4d6d';

  return (
    <group ref={groupRef} position={[0, -0.3, -2]} scale={0.35}>
      {/* Ship body — sleek octahedron */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={shipColor}
          emissive={shipColor}
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Engine glow */}
      <mesh ref={engineRef} position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.2, 0.5, 8]} />
        <meshStandardMaterial
          color="#00f2fe"
          emissive="#00f2fe"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Wing tips */}
      <mesh position={[0.5, 0, 0.2]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.6, 0.04, 0.3]} />
        <meshStandardMaterial color={shipColor} emissive={shipColor} emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.5, 0, 0.2]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.6, 0.04, 0.3]} />
        <meshStandardMaterial color={shipColor} emissive={shipColor} emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Point light from ship */}
      <pointLight color={shipColor} intensity={2} distance={8} />
    </group>
  );
}

// ── Energy Trail (visible at combo 3+) ────────────────────────────────────
function EnergyTrail({ combo, speed }) {
  const ref = useRef();
  const count = 100;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.5;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.5 - 0.3;
      arr[i * 3 + 2] = -2 + Math.random() * 5;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current || combo < 3) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 2] += speed * delta * 15;
      if (pos.array[i * 3 + 2] > 10) {
        pos.array[i * 3] = (Math.random() - 0.5) * 0.3;
        pos.array[i * 3 + 1] = (Math.random() - 0.5) * 0.3 - 0.3;
        pos.array[i * 3 + 2] = -2 + Math.random() * 2;
      }
    }
    pos.needsUpdate = true;
  });

  if (combo < 3) return null;

  const trailColor = combo >= 5 ? '#ff007a' : '#f59e0b';

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={trailColor}
        size={0.05}
        transparent
        opacity={0.6}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

// ── Main Scene ────────────────────────────────────────────────────────────
function Scene({ speed, combo, fuelPercent, tunnelColors, particleColor, isMobile }) {
  return (
    <>
      {/* Ambient + Directional lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[0, 5, 5]} intensity={0.3} color="#4facfe" />
      <fog attach="fog" args={['#030308', 1, 50]} />

      {/* Star field background */}
      <Stars radius={80} depth={60} count={isMobile ? 800 : 2000} factor={3} saturation={0.5} fade speed={1} />

      {/* Tunnel rings */}
      <TunnelRings speed={speed} colors={tunnelColors} ringCount={isMobile ? 25 : 40} />

      {/* Speed particles */}
      <SpeedParticles speed={speed} color={particleColor} count={isMobile ? 300 : 600} />

      {/* Spaceship */}
      <Spaceship combo={combo} fuelPercent={fuelPercent} />

      {/* Energy trail at high combo */}
      <EnergyTrail combo={combo} speed={speed} />
    </>
  );
}

// ── Canvas Wrapper (exported) ────────────────────────────────────────────
export default function TunnelScene({ speed = 1, combo = 0, fuelPercent = 100, tunnelColors, particleColor }) {
  const isMobile = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000 }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 65 + Math.min(speed, 3) * 5, near: 0.1, far: 200 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !isMobile, alpha: false, powerPreference: 'high-performance' }}
        style={{ background: '#030308' }}
      >
        <Scene
          speed={speed}
          combo={combo}
          fuelPercent={fuelPercent}
          tunnelColors={tunnelColors || ['#00f2fe', '#7928ca', '#4facfe', '#ff007a']}
          particleColor={particleColor || '#00f2fe'}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
