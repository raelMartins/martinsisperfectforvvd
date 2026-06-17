"use client";

import { Canvas } from "@react-three/fiber";
import SceneContent from "./SceneContent";

export default function BackgroundScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 7], fov: 42, near: 0.1, far: 30 }}
      performance={{ min: 0.75 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <SceneContent />
    </Canvas>
  );
}
