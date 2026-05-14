import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  MeshWobbleMaterial, 
  Stars,
  PerspectiveCamera,
  ContactShadows,
  Float as DreiFloat,
  Environment,
  Html,
  Sparkles,
  useScroll
} from '@react-three/drei';
import * as THREE from 'three';

const Rig = ({ children }) => {
  const group = useRef();
  const { mouse, camera } = useThree();
  
  useFrame((state) => {
    // Parallax effect: follow mouse with smoothing
    const targetX = (mouse.x * 2);
    const targetY = (mouse.y * 2);
    
    // Smooth camera movement
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX * 0.5, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY * 0.5 + 1, 0.05);
    camera.lookAt(0, 0, 0);

    // Subtle parallax for the group itself
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX * 0.1, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY * 0.1, 0.05);
    }
  });

  return <group ref={group}>{children}</group>;
};

const RoboticHUD = () => {
  const ringRef = useRef();
  const ringRef2 = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -t * 0.8;
    }
  });

  return (
    <group>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ringRef2} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.1, 0.005, 16, 100]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

const NextGenRobot = () => {
  const coreRef = useRef();
  const armorRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 1.5;
      // coreRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.05);
    }
    if (armorRef.current) {
      armorRef.current.rotation.y = -t * 0.3;
    }
  });

  return (
    <group scale={0.75}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <MeshWobbleMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={5} factor={0.4} speed={2} />
      </mesh>

      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial color="#05080c" metalness={0.9} roughness={0.1} transmission={0.6} thickness={1.5} transparent opacity={0.9} />
      </mesh>

      <group ref={armorRef}>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[Math.cos(i * Math.PI / 4) * 1.2, 0, Math.sin(i * Math.PI / 4) * 1.2]} rotation={[0, -i * Math.PI / 4, 0]}>
            <boxGeometry args={[0.1, 0.6, 0.4]} />
            <meshStandardMaterial color="#111" metalness={1} roughness={0.2} />
            <mesh position={[0.06, 0, 0]}>
              <boxGeometry args={[0.01, 0.55, 0.38]} />
              <meshBasicMaterial color="#00d4ff" />
            </mesh>
          </mesh>
        ))}
      </group>

      <mesh position={[0, 0.2, 0.8]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[1.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={10} />
      </mesh>

      <RoboticHUD />
    </group>
  );
};

const CyberScene = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '600px', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 1, 7], fov: 45 }}>
        <color attach="background" args={['#000000']} />
        
        <Rig>
          <NextGenRobot />
          
          {/* Next Level Stars / Particles with Parallax */}
          <group>
            <Sparkles count={200} scale={20} size={2} speed={0.4} color="#00d4ff" opacity={0.5} />
            <Sparkles count={100} scale={15} size={4} speed={0.2} color="#ffffff" opacity={0.3} />
            <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          </group>
        </Rig>

        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00d4ff" />
        <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} color="#ffffff" />
        
        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.6} 
          scale={15} 
          blur={2.5} 
          far={5} 
          color="#00d4ff" 
        />

        <Environment preset="night" />
      </Canvas>
    </div>
  );
};

export default CyberScene;
