"use client";
import { Suspense, useEffect } from "react";
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

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": any;
    }
  }
}

export default function ModelViewer({ modelUrl, onClose }: ModelViewerProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js";
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0,
      backgroundColor: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: "#111827",
        borderRadius: "16px",
        padding: "16px",
        width: "320px",
        border: "1px solid #374151",
        position: "relative"
      }}>

        <button onClick={onClose} style={{
          position: "absolute", top: "12px", right: "12px",
          background: "none", border: "none", color: "#9CA3AF",
          fontSize: "20px", cursor: "pointer", zIndex: 10
        }}>✕</button>

        <p style={{ textAlign: "center", color: "#FB923C", fontSize: "13px", marginBottom: "8px" }}>
          Drag to rotate • Scroll to zoom
        </p>

        <div style={{ width: "100%", height: "240px", borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
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

        <model-viewer
          src={modelUrl}
          ar
          ar-modes="webxr scene-viewer quick-look"
          style={{ width: "100%", height: "56px", backgroundColor: "transparent" }}
        >
          <button slot="ar-button" style={{
            width: "100%", backgroundColor: "#FB923C",
            color: "#000", fontWeight: "bold",
            padding: "14px", borderRadius: "12px",
            border: "none", cursor: "pointer", fontSize: "14px"
          }}>
            View on Your Table (AR)
          </button>
        </model-viewer>

      </div>
    </div>
  );
}