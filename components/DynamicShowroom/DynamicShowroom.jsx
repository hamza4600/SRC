import { useEffect } from 'react'
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useParams } from "react-router-dom";

const DynamicShowroom = ({ apiData }) => {
  const { camera, set } = useThree();
  const { roomId } = useParams();

  const selectedRoom =  apiData.rooms.filter((room) => room.id === roomId)[0];
  const models =  apiData.models || []
  console.log(models)

  const { scene } = useGLTF(apiData.dynamicShowroom);

  useEffect(() => {
    const newCamera = camera.clone()
    newCamera.position.set(selectedRoom.initialPosition[0], selectedRoom.initialPosition[1], selectedRoom.initialPosition[2]);
    newCamera.rotation.set(selectedRoom.initialRotation[0], selectedRoom.initialRotation[1], selectedRoom.initialRotation[2]);
    newCamera.updateMatrixWorld();
    newCamera.updateProjectionMatrix();
    set({ camera: newCamera })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom]);

  return (
    <group is="model-group">
      <primitive object={scene} is="scene" />
    </group>
  )
}

export default DynamicShowroom;
