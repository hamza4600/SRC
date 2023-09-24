import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";

import SignInForm from "./forms/SignInForm";
import SignButton from '../../components/SignButton/SignButton'
import urls from '../../constants/urls'
import * as S from './styles'

const SignInPage = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)

  const handleSignInAsAGuestClick = () => {
    const callbackUrl = queryParams.get('url') || '' 
    history.push(urls.signInGuestPage.path + `?url=${callbackUrl}`)
  }

  return (
    <S.Wrapper>
      <h1>Sign in</h1>
      <SignInForm />
      <SignButton onClick={handleSignInAsAGuestClick}>Join as a Guest</SignButton>
    </S.Wrapper>
  );
};

export default SignInPage;
