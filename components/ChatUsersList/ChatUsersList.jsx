import { PersonCircle } from 'react-bootstrap-icons';
import * as S from './styles';

const ChatUsersList = ({ users }) => {
    return (
      <S.Wrapper>
        <S.Title>Connected Users:</S.Title>
         {!!users && users.map((user, index) => {
            return (
                <S.MessageBox key={index}>
                    <PersonCircle />
                    <S.Message>{user.fullName}</S.Message>
                </S.MessageBox>
            ) 
         })}
      </S.Wrapper>
    )
  }
  
  export default ChatUsersList;