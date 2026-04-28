"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

function LoadingBox() {
  return (
    <mesh rotation={[0.5, 0.5, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

interface ModelViewerProps {
  modelUrl: string;
  onClose: () => void;
}

export default function ModelViewer({ modelUrl, onClose }: ModelViewerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-4 w-80 h-96 relative border border-gray-700">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl z-10"
        >
          ✕
        </button>

        <p className="text-center text-orange-400 text-sm mb-2 font-medium">
          Drag to rotate • Scroll to zoom
        </p>

        <div className="w-full h-72 rounded-xl overflow-hidden">
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={<LoadingBox />}>
              <Model url={modelUrl} />
              <Environment preset="city" />
            </Suspense>
            <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={2} />
          </Canvas>
        </div>

      </div>
    </div>
  );
}