import { useHistory } from "react-router";
import { Switch, Route } from "react-router-dom";

import urls from "../../constants/urls";
import SignUpForm from "./forms/SignUpForm";
import SignButton from '../../components/SignButton/SignButton'
import ConfirmEmailForm from "./forms/ConfirmEmailForm";
import * as S from './styles'

const SignUpPage = () => {
  const history = useHistory();

  const handleSignInAsAGuestClick = () => {
    history.push(urls.signInGuestPage.path)
  }

  return (
    <S.Wrapper>
      <h1>Sign Up</h1>
      <Switch>
        <Route {...urls.signUpPage}>
          <SignUpForm />
        </Route>
        <Route {...urls.confirmEmailPage}>
          <ConfirmEmailForm />
        </Route>
      </Switch>
      <SignButton onClick={handleSignInAsAGuestClick}>Join as a guest</SignButton>
    </S.Wrapper>
  );
};

export default SignUpPage;
