'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface Bottle3DProps {
  textureUrl: string;
}

function BottleMesh({ textureUrl }: Bottle3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Usamos un try-catch implícito via ErrorBoundary o simplemente cargamos la textura
  // Three.js manejará el placeholder por defecto si no carga bien.
  const texture = useLoader(THREE.TextureLoader, textureUrl || '/placeholder.jpg');
  
  // Ajustes para que la textura envuelva correctamente el cilindro
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // Repetir y posicionar la textura
  texture.repeat.set(1, 1);

  // Animación de rotación constante
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.3; // Velocidad de giro
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* Cuerpo de la Botella */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 4, 32]} />
        <meshStandardMaterial 
          map={texture} 
          roughness={0.2} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Cuello de la botella (Cristal Oscuro) */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.3, 1, 1, 32]} />
        <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Pico / Corcho */}
      <mesh position={[0, 3.25, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.5, 32]} />
        <meshStandardMaterial color="#2a0808" roughness={0.3} metalness={0.5} /> {/* Tono vino oscuro */}
      </mesh>
    </group>
  );
}

// Fallback de carga para Suspense
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#B31B1B" wireframe />
    </mesh>
  );
}

export default function Bottle3D({ textureUrl = '/placeholder.jpg' }: { textureUrl?: string }) {
  return (
    <div className="w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 0, 7], fov: 45 }}>
        {/* Iluminación Atmosférica */}
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={1.5} color="#B31B1B" /> {/* Luz de acento roja */}
        
        <Suspense fallback={<Loader />}>
          <BottleMesh textureUrl={textureUrl} />
        </Suspense>
        
        {/* Sombra de contacto suave debajo de la botella */}
        <ContactShadows position={[0, -3, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
        
        {/* Entorno de reflejos para simular un ambiente elegante */}
        <Environment preset="city" />
        
        {/* Controles para que el usuario pueda girarlo manualmente */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}
