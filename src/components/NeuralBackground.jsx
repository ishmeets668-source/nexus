import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const NeuralNodes = ({ count = 1000 }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, [count]);

  const ref = useRef();
  const { mouse } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.08;
      ref.current.rotation.x = t * 0.04;
      
      // Dynamic scaling disabled for stability
      // ref.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.1);
      
      // Subtle mouse follow
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mouse.x * 1.5, 0.05);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, mouse.y * 1.5, 0.05);
    }
  });

  return (
    <group>
      <Points ref={ref} positions={points} stride={3}>
        <PointMaterial
          transparent
          color="#00f0ff"
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      <Sparkles count={200} scale={15} size={2} speed={0.5} color="#00d4ff" opacity={0.6} />
    </group>
  );
};

const NeuralBackground = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={['#00050a']} />
        <NeuralNodes />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
};

export default NeuralBackground;
