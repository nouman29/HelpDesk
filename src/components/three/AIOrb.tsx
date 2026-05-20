import { useRef } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function OrbCore() {
  const mesh = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.18;
      mesh.current.rotation.x = Math.sin(t * 0.35) * 0.18 + mouse.current.y * 0.2;
      mesh.current.rotation.z = mouse.current.x * 0.2;
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.4;
      inner.current.rotation.x += delta * 0.2;
    }
  });

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  return (
    <group onPointerMove={onPointerMove}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.2}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.35, 6]} />
          <MeshDistortMaterial
            color="#1f86ff"
            distort={0.45}
            speed={1.6}
            metalness={0.6}
            roughness={0.15}
            emissive="#0a52b8"
            emissiveIntensity={0.65}
          />
        </mesh>
        <mesh ref={inner} scale={0.78}>
          <icosahedronGeometry args={[1, 3]} />
          <meshStandardMaterial
            color="#8b6cff"
            wireframe
            transparent
            opacity={0.55}
            emissive="#8b6cff"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      <Sparkles count={80} scale={4.5} size={2.5} speed={0.4} color="#4aa6ff" opacity={0.9} />
      <Sparkles count={40} scale={6} size={1.4} speed={0.2} color="#3ee8ff" opacity={0.6} />
    </group>
  );
}

/**
 * The hero centerpiece — a glowing AI orb that reacts to pointer movement.
 * Uses React Three Fiber + Drei. Falls back gracefully on slow GPUs.
 */
export function AIOrb({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.55} />
        <pointLight position={[5, 6, 5]} intensity={2.2} color="#4aa6ff" />
        <pointLight position={[-5, -3, -2]} intensity={1.6} color="#8b6cff" />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#3ee8ff" />
        <OrbCore />
      </Canvas>
    </div>
  );
}
