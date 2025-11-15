

import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";


export function Walk(props: JSX.IntrinsicElements["group"]) {
  const group = React.useRef<THREE.Group>(null);

  // Load GLB
  const { scene, animations } = useGLTF("/models/walk.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Extract nodes/materials
  const { nodes, materials } = useGraph(clone);

  // Hook up animations
  const { actions } = useAnimations(animations, group);

  // Debugging — check what we actually have
  React.useEffect(() => {
    console.log("GLTF Loaded ✅", { scene, nodes, materials, animations });
    if (actions) {
      console.log("Available Actions 🎬", Object.keys(actions));
    }
  }, [scene, nodes, materials, animations, actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          {/* Make sure these nodes exist before rendering */}
          {"mixamorigHips" in nodes && (
            <primitive object={(nodes as any).mixamorigHips} />
          )}

          {"Alpha_Joints" in nodes && (
            <skinnedMesh
              name="Alpha_Joints"
              geometry={(nodes as any).Alpha_Joints.geometry}
              material={(materials as any).Alpha_Joints_MAT}
              skeleton={(nodes as any).Alpha_Joints.skeleton}
            />
          )}

          {"Alpha_Surface" in nodes && (
            <skinnedMesh
              name="Alpha_Surface"
              geometry={(nodes as any).Alpha_Surface.geometry}
              material={(materials as any).Alpha_Body_MAT}
              skeleton={(nodes as any).Alpha_Surface.skeleton}
            />
          )}
        </group>
      </group>
    </group>
  );
}

// Preload the model for faster rendering
useGLTF.preload("/models/walk.glb");
