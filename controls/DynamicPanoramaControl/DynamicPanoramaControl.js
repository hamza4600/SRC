import { useFrame, useThree, extend } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import { useHistory, useParams } from 'react-router-dom'
import { CustomControls } from '../CustomControls/CustomControls';
import { useDynamicShowroom } from "../../providers/DynamicShowrooomProvider/DynamicShowroomProvider";
import { showroomSetOptions } from "../../providers/ShowroomProvider/ShowroomSetOptions";

extend({ CustomControls })

const DynamicPanoramaControl = props => {
  const history = useHistory();
  const { showroomId } = useParams();
  const { camera, gl, scene } = useThree();

  const [ dynamicShowroomState, dynamicShowroomDispatch ] = useDynamicShowroom();
  const { isPointerLocked } = dynamicShowroomState;

  const ref = useRef();

  useFrame((state, delta) => ref.current.update(delta, isPointerLocked, camera))

  useEffect(() => {
    scene.add(ref.current.object)
    console.log(ref.current)
    ref.current.dispatchSetSelectedModel = (id) => {
      dynamicShowroomDispatch({
        type: showroomSetOptions.setSelectedModel,
        payload: id,
      });
    };
    ref.current.dispatchSetPointerLock = (lock) => {
      dynamicShowroomDispatch({
        type: showroomSetOptions.setPointerLock,
        payload: lock,
      });
    }
    ref.current.dispatchSetJoystickPresent = (value) => {
      dynamicShowroomDispatch({
        type: showroomSetOptions.setJoystickPresent,
        payload: value,
      });
    }
    ref.current.dispatchSetJoystickPosition = (pos) => {
      dynamicShowroomDispatch({
        type: showroomSetOptions.setJoystickPosition,
        payload: pos,
      });
    }
    ref.current.dispatchSetJoystickDirection = (dir) => {
      dynamicShowroomDispatch({
        type: showroomSetOptions.setJoystickDirection,
        payload: dir,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current])

  return (
    <customControls
      ref={ref}
      args={[camera, gl.domElement, scene, isMobile, showroomId, history]}
      {...props} />
  )
}

export default DynamicPanoramaControl;
