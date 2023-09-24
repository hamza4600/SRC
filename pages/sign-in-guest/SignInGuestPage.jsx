import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";

import SignButton from "../../components/SignButton/SignButton";
import FormSignInGuest from "./components/FormSignInGuest/FormSignInGuest";
import urls from '../../constants/urls'
import * as S from './styles'

const SignInGuestPage = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)

  const callbackUrl = queryParams.get('url')

  const handleSignInClick = () => {
    history.push(urls.signInPage.path + `?url=${callbackUrl}`)
  }

  const handleSignUpClick = () => {
    history.push(urls.signUpPage.path + `?url=${callbackUrl}`)
  }

  return (
    <>
      <FormSignInGuest />
      <S.SignWrapper>
        <SignButton onClick={handleSignInClick}>Sign in</SignButton>
        <SignButton onClick={handleSignUpClick}>Sign up</SignButton>
      </S.SignWrapper>
    </>
  );
};

export default SignInGuestPage;
