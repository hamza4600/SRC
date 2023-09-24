import { isMobile } from "react-device-detect";
import { useDynamicShowroom } from "../../../../../providers/DynamicShowrooomProvider/DynamicShowroomProvider";
import BlockerModal from '../BlockerModal/BlockerModal';
import ObjectModal from '../ObjectModal/ObjectModal';
import TargetModal from '../TargetModal/TargetModal';
import JoystickModal from '../JoystickModal/JoystickModal';

const MainModal = () => {
  const [ dynamicShowroomState, ] = useDynamicShowroom();
  const { selectedModel, isPointerLocked, isJoystickPresent } = dynamicShowroomState;

  if (selectedModel) return <ObjectModal />
  
  if (!isMobile && !isPointerLocked) return <BlockerModal />
    
  return (
    <>
      {!isMobile && <TargetModal />}
      {isJoystickPresent && <JoystickModal />}
    </>
  )
}

export default MainModal;
