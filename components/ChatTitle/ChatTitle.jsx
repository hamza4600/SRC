import * as S from './styles';
import { PersonCircle } from 'react-bootstrap-icons';

const ChatTitle = ({ title, dispatch }) => {
  return (
    <S.Wrapper>
      <S.Title>{title}</S.Title>
      <PersonCircle onClick={() => {
        dispatch({
          type: 'userList'
        })
      }}/>
    </S.Wrapper>
  )
}

export default ChatTitle;
