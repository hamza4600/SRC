import { useDynamicShowroom } from '../../../../../providers/DynamicShowrooomProvider/DynamicShowroomProvider';
import * as S from './styles';

export default function JoystickModal() {
  const [ dynamicShowroomState ] = useDynamicShowroom();
  const { joystickPosition, joystickDirection } = dynamicShowroomState;
  return (
    <>
      <S.Center style={{
        left: `${joystickPosition.x}px`,
        top: `${joystickPosition.y}px`,
      }} >
      </S.Center>
      <S.Direction style={{
        left: `${joystickPosition.x + joystickDirection.x * 35}px`,
        top: `${joystickPosition.y + joystickDirection.y * 35}px`,
      }} />
    </>
  )
}