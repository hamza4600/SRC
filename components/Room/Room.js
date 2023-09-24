import { BackSide } from "three";

const Room = ({ texture, hotspots = [] }) => {
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereBufferGeometry attach="geometry" args={[500, 60, 40]}/>
      <meshBasicMaterial attach="material" map={texture} side={BackSide}/>
    </mesh>
  )
}

export default Room;