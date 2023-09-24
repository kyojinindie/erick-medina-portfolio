import * as THREE from "three";
import React, { Suspense, useMemo, useState } from "react";
import { Text as TextComp} from '@react-three/drei'
import { Canvas } from "@react-three/fiber";
import { Physics, usePlane, useConvexPolyhedron } from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { Geometry } from "three-stdlib";
import './App.css'
import Text, { Media } from "./components/text"
import {textConfig} from "./config/textConfig";

/**
 * Returns legacy geometry vertices, faces for ConvP
 * @param {THREE.BufferGeometry} bufferGeometry
 */
function toConvexProps(bufferGeometry) {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry);
  // Merge duplicate vertices resulting from glTF export.
  // Cannon assumes contiguous, closed meshes to work
  geo.mergeVertices();
  return [geo.vertices.map((v) => [v.x, v.y, v.z]), geo.faces.map((f) => [f.a, f.b, f.c]), []]; // prettier-ignore
}

function Diamond(props) {
  const { nodes } = useGLTF("/diamond.glb");
  const geo = useMemo(() => toConvexProps(nodes.Cylinder.geometry), [nodes]);
  const [ref] = useConvexPolyhedron(() => ({ mass: 100, ...props, args: geo }));
  return (
    <mesh
      castShadow
      receiveShadow
      ref={ref}
      geometry={nodes.Cylinder.geometry}
      {...props}
    >
      <meshStandardMaterial wireframe color="white" />
    </mesh>
  );
}

// A cone is a convex shape by definition...
function Cone({ sides, ...props }) {
  const geo = useMemo(
    () => toConvexProps(new THREE.ConeGeometry(0.7, 0.7, sides, 1)),
    []
  );
  const [ref] = useConvexPolyhedron(() => ({ mass: 100, ...props, args: geo }));
  return (
    <mesh castShadow ref={ref} {...props}>
      <coneGeometry args={[0.7, 0.7, sides, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
}

// ...And so is a cube!
function Cube({ size, ...props }) {
  // note, this is wildly inefficient vs useBox
  const geo = useMemo(
    () => toConvexProps(new THREE.BoxGeometry(size, size, size)),
    []
  );
  const [ref] = useConvexPolyhedron(() => ({ mass: 100, ...props, args: geo }));
  return (
    <mesh castShadow receiveShadow ref={ref} {...props} geometry={geo}>
      <boxGeometry args={[size, size, size]} />
      <meshNormalMaterial/>
    </mesh>
  );
}

function Plane(props) {
  const [ref] = usePlane(() => ({ type: "Static", ...props }));
  return (
    <mesh ref={ref} receiveShadow >
      <planeGeometry args={[10, 10]} />
      <shadowMaterial color="#171717" />
    </mesh>
  );
}

export default () => {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{position: [0, 0, 6], fov: 50}}>
      <color attach="background" args={["#7d2948"]}/>
      <ambientLight intensity={0.5}/>
      <spotLight
        position={[15, 15, 15]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Suspense fallback={null}>
        <Physics>
          <Plane rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}/>
          <Diamond position={[1, 4, 0]} rotation={[0.4, 0.1, 0.1]}/>
          <Cone position={[-1, 4, 0.5]} rotation={[0.1, 0.2, 0.1]} sides={6}/>
          <Cone position={[-1, 5, 0]} rotation={[0.5, 0.1, 0.1]} sides={8}/>
          <Cube position={[2, 2, -0.3]} rotation={[0.5, 0.4, -1]} size={0.4}/>
          <Cone position={[-0.3, 6, 1]} rotation={[1, 0.4, 0.1]} sides={7}/>
        </Physics>
      </Suspense>
      {
        textConfig.map((item, index) => {
          return <Text key={index} {...item}/>
        })
      }
      {/* GitHub button */}

      <Media
        position={[-2, 2.5, 0]}
        url="https://github.com/kyojinindie"
        text="GitHub"
      />
      {/* LinkedIn button */}
      <Media
        position={[0, 2.5, 0]}
        url="https://www.linkedin.com/in/erick-medina-613593124/"
        text="LinkedIn"
      />
      {/* Twitter button */}
      <Media
        position={[2, 2.5, 0]}
        url="https://twitter.com/kyojinindie"
        text="Twitter"
      />
      {
        textConfig.map((item, index) => {
          return <Text key={index} {...item}/>
        })
      }

      <TextComp
        position={[0, -3, -2]}
        color="#0e0b29"
        anchorX="center"
        anchorY="middle"
        fontSize="0.2"
        fillOpacity="0.5"
      >
        Hi, my name is Erick Medina, I'm building serverless solutions for Alegra.com
        and working on AI projects at night.
      </TextComp>
    </Canvas>
  );
};