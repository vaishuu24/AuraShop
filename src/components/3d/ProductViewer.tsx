'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  OrbitControls,
  MeshDistortMaterial,
  Float,
  Text3D,
  Center,
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap, ScrollTrigger } from '@/lib/gsap';

// ─────────────────────────────────────────────────
// Procedural 3D product — a stylised torus-knot
// Replace with <useGLTF> once a real .glb model is ready
// ─────────────────────────────────────────────────

function ProductMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  // Auto-rotation
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.25;
    meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
  });

  // GSAP scroll-driven full rotation
  useEffect(() => {
    if (!groupRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: '#product-viewer',
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 2,
      onUpdate: (self) => {
        if (groupRef.current) {
          groupRef.current.rotation.y = self.progress * Math.PI * 2;
        }
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <group ref={groupRef}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={meshRef} castShadow>
          <torusKnotGeometry args={[1.2, 0.38, 256, 32, 2, 3]} />
          <MeshDistortMaterial
            color="#000000"
            roughness={0.05}
            metalness={0.95}
            distort={0.15}
            speed={1.5}
          />
        </mesh>

        {/* Accent ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2, 0.008, 4, 128]} />
          <meshBasicMaterial color="#EB3333" transparent opacity={0.6} />
        </mesh>
      </Float>
    </group>
  );
}

function SceneEnvironment() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-10, -5, -5]} intensity={0.5} color="#EB3333" />
      <Environment preset="city" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI * 0.65}
        minPolarAngle={Math.PI * 0.35}
      />
    </>
  );
}

// ─────────────────────────────────────────────────
// Public component — ssr: false via dynamic import
// ─────────────────────────────────────────────────

export function ProductViewer() {
  return (
    <section
      id="product-viewer"
      className="relative w-full h-[70vh] my-4 border-t border-b border-black/10 overflow-hidden flex items-center"
      aria-label="3D product showcase"
    >
      {/* HUD overlay */}
      <div className="absolute top-6 left-6 z-10 monospace text-[9px] text-muted flex flex-col gap-1 pointer-events-none">
        <span className="text-secondary font-bold">3D_SHOWCASE.ACTIVE</span>
        <span>DRAG TO ROTATE · SCROLL TO SPIN</span>
        <span>RENDERER: WebGL 2.0</span>
      </div>

      <div className="absolute top-6 right-6 z-10 monospace text-right text-[9px] text-muted flex flex-col gap-1 pointer-events-none">
        <span className="text-primary font-bold">NEURAL_UNIT.02</span>
        <span>MODEL: TorusKnot_v2.5</span>
        <span>POLYS: 8,192</span>
      </div>

      {/* Corner brackets */}
      <div className="absolute inset-6 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-secondary" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary" />
      </div>

      {/* Product label bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-[1px] h-12 bg-secondary/40" />
        <span className="monospace text-[9px] text-secondary font-bold">CORE_ARTIFACT</span>
        <span className="monospace text-[8px] text-muted">WINTER COLLECTION 2025</span>
      </div>

      {/* R3F Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
        aria-hidden="true"
      >
        <SceneEnvironment />
        <Suspense fallback={null}>
          <ProductMesh />
        </Suspense>
      </Canvas>
    </section>
  );
}
