import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// Ambient drifting particle field + a couple of slow wireframe shapes —
// a lightweight "living" 3D backdrop for the timeline, not a focal object.
const ParticleField = () => {
  const ref = useRef(null);
  const count = 220;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.02;
    ref.current.rotation.x = Math.sin(t * 0.05) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#CCFF00" size={0.035} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
};

const DriftingShape = ({ position, scale, speed }) => {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed;
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.4;
    ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.4;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#CCFF00" wireframe transparent opacity={0.25} />
    </mesh>
  );
};

export const ExperienceScene = ({ className = "" }) => (
  <div className={`pointer-events-none select-none absolute inset-0 ${className}`}>
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ alpha: true }}>
      <ParticleField />
      <DriftingShape position={[3.2, 1, -1]} scale={0.6} speed={1} />
      <DriftingShape position={[-3.5, -1.5, -2]} scale={0.9} speed={0.7} />
      <DriftingShape position={[2, -2.5, -3]} scale={0.4} speed={1.3} />
    </Canvas>
  </div>
);
