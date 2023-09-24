import {Plane} from "@react-three/drei";
import {DoubleSide} from "three";

const PositionHotspot = ({ onClick, icon, position, rotation, scale }) => {
  return (
    <group>
      <Plane position={position} rotation={rotation} scale={scale} onClick={onClick}>
        <meshBasicMaterial attach="material" map={icon} side={DoubleSide} transparent={true}/>
      </Plane>
    </group>
  );
}

export default PositionHotspot;
