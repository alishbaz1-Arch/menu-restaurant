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
    <mesh>
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
  const fullUrl = typeof window !== "undefined"
    ? `${window.location.origin}${modelUrl}`
    : modelUrl;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.85)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      zIndex: 50, padding: "16px", gap: "12px"
    }}>

      {/* 3D Viewer Box */}
      <div style={{
        backgroundColor: "#111827",
        borderRadius: "16px",
        padding: "16px",
        width: "100%",
        maxWidth: "360px",
        border: "1px solid #374151",
        position: "relative"
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "12px", right: "12px",
          background: "none", border: "none", color: "#9CA3AF",
          fontSize: "20px", cursor: "pointer", zIndex: 10
        }}>✕</button>

        <p style={{ textAlign: "center", color: "#FB923C", fontSize: "13px", marginBottom: "8px", marginTop: "0" }}>
          Drag to rotate • Scroll to zoom
        </p>

        <div style={{ width: "100%", height: "220px", borderRadius: "12px", overflow: "hidden" }}>
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

      {/* AR Button — outside the box */}
      
        href={`https://arvr.google.com/scene-viewer/1.0?file=${fullUrl}&mode=ar_preferred`}
        rel="ar"
        style={{
          display: "block",
          width: "100%",
          maxWidth: "360px",
          backgroundColor: "#FB923C",
          color: "#000",
          fontWeight: "bold",
          padding: "16px",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          textAlign: "center",
          textDecoration: "none",
          boxSizing: "border-box"
        }}
      >
        View on Your Table (AR)
      </a>

    </div>
  );
}