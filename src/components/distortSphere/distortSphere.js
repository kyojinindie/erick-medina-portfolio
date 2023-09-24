import {MeshDistortMaterial} from "@react-three/drei"

export default function DistortSphere({color, position}){
  return(
      <mesh position={position}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
            attach="material"
            color={color}
            distort={0.5} // Strength, 0 disables the effect (default=1)
            speed={3} // Speed (default=1)
        />
      </mesh>
  )
}