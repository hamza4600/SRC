import RequestPasswordResetForm from "./forms/RequestPasswordResetForm";
import {Route, Switch} from "react-router-dom";
import urls from "../../constants/urls";
import ResetPasswordForm from "./forms/ResetPasswordForm";

const RecoverPasswordPage = () => {
  return (
    <>
      <h1>Reset password</h1>
      <Switch>
        <Route {...urls.requestPasswordReset}>
          <RequestPasswordResetForm/>
        </Route>
        <Route {...urls.resetPassword}>
          <ResetPasswordForm/>
        </Route>
      </Switch>
    </>
  );
}

export default RecoverPasswordPage;
