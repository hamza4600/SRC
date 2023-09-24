import { Button } from 'react-bootstrap';
import * as S from './styles';

const RenewSessionOptions = ({ onRenewSession, onLogout }) => {
  return (
    <S.Wrapper>
      <Button onClick={onRenewSession}>Renew Session</Button>
      <Button onClick={onLogout}>Logout</Button>
    </S.Wrapper>
  )
}

export default RenewSessionOptions;
