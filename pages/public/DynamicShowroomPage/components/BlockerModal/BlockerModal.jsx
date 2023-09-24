import { isMobile } from "react-device-detect";

import { useDynamicShowroom } from '../../../../../providers/DynamicShowrooomProvider/DynamicShowroomProvider';
import { showroomSetOptions } from '../../../../../providers/ShowroomProvider/ShowroomSetOptions';
import * as S from './styles';

function BlockerModal() {
  const [, dynamicShowroomDispatch] = useDynamicShowroom()

  return (
    <S.Wrapper>
      <S.Instructions
        id={"instructions"}
        onMouseDown={() => {
          return !isMobile && dynamicShowroomDispatch({
            type: showroomSetOptions.setPointerLock,
            payload: true
          })
        }}
      >
        <p style={{ fontSize: '36px' }}>
          Click to run
        </p>
        <p>
          Move: WASD or ARROWS<br />
          Look: MOUSE
        </p>
      </S.Instructions>
    </S.Wrapper >
  )
}

export default BlockerModal;
