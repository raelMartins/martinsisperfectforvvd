"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  Points,
  PointsMaterial,
  TorusKnotGeometry,
} from "three";
import { useMotion } from "@/context/MotionContext";
import type { Theme } from "@/context/ThemeContext";
import { useTheme } from "@/context/ThemeContext";

const PARTICLE_COUNT = 240;

type ScenePalette = {
  particle: string;
  particleOpacity: number;
  meshPrimary: string;
  meshPrimaryOpacity: number;
  meshAccent: string;
  meshAccentOpacity: number;
  blending: typeof NormalBlending | typeof AdditiveBlending;
};

const PALETTES: Record<Theme, ScenePalette> = {
  dark: {
    particle: "#5ac8fa",
    particleOpacity: 0.3,
    meshPrimary: "#0a84ff",
    meshPrimaryOpacity: 0.075,
    meshAccent: "#bf5af2",
    meshAccentOpacity: 0.05,
    blending: AdditiveBlending,
  },
  light: {
    particle: "#007aff",
    particleOpacity: 0.18,
    meshPrimary: "#007aff",
    meshPrimaryOpacity: 0.05,
    meshAccent: "#5856d6",
    meshAccentOpacity: 0.035,
    blending: NormalBlending,
  },
};

function lerp(current: number, target: number, alpha: number) {
  return current + (target - current) * alpha;
}

function useScenePalette() {
  const { theme } = useTheme();
  const paletteRef = useRef({
    particle: new Color(PALETTES.dark.particle),
    meshPrimary: new Color(PALETTES.dark.meshPrimary),
    meshAccent: new Color(PALETTES.dark.meshAccent),
    particleOpacity: PALETTES.dark.particleOpacity,
    meshPrimaryOpacity: PALETTES.dark.meshPrimaryOpacity,
    meshAccentOpacity: PALETTES.dark.meshAccentOpacity,
    blending: PALETTES.dark.blending,
  });

  useFrame(() => {
    const target = PALETTES[theme];
    const palette = paletteRef.current;
    const alpha = 0.06;

    palette.particle.lerp(new Color(target.particle), alpha);
    palette.meshPrimary.lerp(new Color(target.meshPrimary), alpha);
    palette.meshAccent.lerp(new Color(target.meshAccent), alpha);
    palette.particleOpacity = lerp(
      palette.particleOpacity,
      target.particleOpacity,
      alpha,
    );
    palette.meshPrimaryOpacity = lerp(
      palette.meshPrimaryOpacity,
      target.meshPrimaryOpacity,
      alpha,
    );
    palette.meshAccentOpacity = lerp(
      palette.meshAccentOpacity,
      target.meshAccentOpacity,
      alpha,
    );
    palette.blending = target.blending;
  });

  return paletteRef;
}

function ParticleField({
  paletteRef,
}: {
  paletteRef: ReturnType<typeof useScenePalette>;
}) {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<PointsMaterial>(null);
  const { motionRef } = useMotion();

  const positions = useMemo(() => {
    const data = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const radius = 2.8 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      data[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      data[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      data[i * 3 + 2] = radius * Math.cos(phi) - 1.5;
    }
    return data;
  }, []);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    if (!points || !material) return;

    const motion = motionRef.current;
    const speed = motion.reducedMotion ? 0.15 : 1;
    const time = state.clock.elapsedTime;
    const scroll = motion.scrollProgress;

    points.rotation.y += delta * 0.04 * speed;
    points.rotation.x = motion.mouse.y * 0.12;
    points.rotation.z = motion.mouse.x * 0.08;
    points.position.y = scroll * 0.65 - 0.2;

    const palette = paletteRef.current;
    material.color.copy(palette.particle);
    material.opacity = palette.particleOpacity;
    if (material.blending !== palette.blending) {
      material.blending = palette.blending;
      material.needsUpdate = true;
    }

    const positionsAttr = points.geometry.attributes.position;
    if (!positionsAttr) return;

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const ix = i * 3;
      const baseX = positions[ix];
      const baseY = positions[ix + 1];
      const baseZ = positions[ix + 2];
      const wave = Math.sin(time * 0.35 * speed + i * 0.15) * 0.018;

      positionsAttr.array[ix] = baseX + motion.mouse.x * 0.08 + wave;
      positionsAttr.array[ix + 1] =
        baseY + scroll * 0.25 + Math.cos(time * 0.28 * speed + i) * 0.02;
      positionsAttr.array[ix + 2] = baseZ + motion.mouse.y * 0.06;
    }

    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.028}
        transparent
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function MorphingMeshes({
  paletteRef,
}: {
  paletteRef: ReturnType<typeof useScenePalette>;
}) {
  const primaryRef = useRef<Mesh>(null);
  const accentRef = useRef<Mesh>(null);
  const primaryMaterialRef = useRef<MeshBasicMaterial>(null);
  const accentMaterialRef = useRef<MeshBasicMaterial>(null);
  const { motionRef } = useMotion();

  const primaryGeometry = useMemo(
    () => new IcosahedronGeometry(2.4, 1),
    [],
  );
  const accentGeometry = useMemo(
    () => new TorusKnotGeometry(1.15, 0.22, 64, 8),
    [],
  );

  useFrame((state, delta) => {
    const motion = motionRef.current;
    const speed = motion.reducedMotion ? 0.2 : 1;
    const time = state.clock.elapsedTime;
    const scroll = motion.scrollProgress;

    const palette = paletteRef.current;

    if (primaryRef.current) {
      primaryRef.current.rotation.x =
        time * 0.06 * speed + motion.mouse.y * 0.22 + scroll * 0.35;
      primaryRef.current.rotation.y =
        time * 0.04 * speed + motion.mouse.x * 0.28;
      const pulse = 1 + Math.sin(time * 0.45 * speed) * 0.035;
      primaryRef.current.scale.setScalar(pulse);
      primaryRef.current.position.y = scroll * 0.4 - 0.15;
    }

    if (accentRef.current) {
      accentRef.current.rotation.x =
        -time * 0.05 * speed + motion.mouse.y * 0.15;
      accentRef.current.rotation.z =
        time * 0.07 * speed + motion.mouse.x * 0.18 + scroll * 0.25;
      accentRef.current.position.y = -scroll * 0.25 + 0.1;
    }

    if (primaryMaterialRef.current) {
      primaryMaterialRef.current.color.copy(palette.meshPrimary);
      primaryMaterialRef.current.opacity = palette.meshPrimaryOpacity;
    }

    if (accentMaterialRef.current) {
      accentMaterialRef.current.color.copy(palette.meshAccent);
      accentMaterialRef.current.opacity = palette.meshAccentOpacity;
    }
  });

  return (
    <group position={[0.35, 0, -2.2]}>
      <mesh ref={primaryRef} geometry={primaryGeometry}>
        <meshBasicMaterial
          ref={primaryMaterialRef}
          wireframe
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh ref={accentRef} geometry={accentGeometry}>
        <meshBasicMaterial
          ref={accentMaterialRef}
          wireframe
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function SceneContent() {
  const paletteRef = useScenePalette();
  const { motionRef } = useMotion();
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const motion = motionRef.current;
    const speed = motion.reducedMotion ? 0.25 : 1;

    group.position.x = motion.mouse.x * 0.35;
    group.position.y = motion.mouse.y * 0.22 - motion.scrollProgress * 0.2;
    group.rotation.y += delta * 0.015 * speed;
  });

  return (
    <group ref={groupRef}>
      <ParticleField paletteRef={paletteRef} />
      <MorphingMeshes paletteRef={paletteRef} />
    </group>
  );
}
