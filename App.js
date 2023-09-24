import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import Home from "./pages/Home";
import SignInPage from "./pages/sign-in/SignInPage";
import SignUpPage from "./pages/sign-up/SignUpPage";
import Header from "./components/Header/Header";
import GoogleAnalytics from "./components/GoogleAnalytics/GoogleAnalytics";
import urls from "./constants/urls";
import VHCentered from "./layouts/VHCentered";
import ShowroomLayout from "./layouts/ShowroomLayout";
import RecoverPasswordPage from "./pages/recover-password/RecoverPasswordPage";
import UpdatePasswordPage from "./pages/update-password/UpdatePasswordPage";
import ShowroomDetailsPage from "./pages/admin/ShowroomDetailsPage";
import ShowroomIndexPage from "./pages/admin/ShowroomIndexPage";
import AddTenantsPage from "./pages/admin/AddTenantsPage";
import ShowroomPage from "./pages/public/ShowroomPage";
import ShowroomProvider from "./providers/ShowroomProvider/ShowroomProvider";
import GlobalStyles from './styles/global';
import Beforeunload from "./common/listeners/BeforeUnload/BeforeUnload";
import { closingCode } from "./common/services/ClosingCode";
import ForbiddenPage from "./pages/forbidden/ForbiddenPage";
import SignInGuestPage from './pages/sign-in-guest/SignInGuestPage';
import DynamicShowroomPage from './pages/public/DynamicShowroomPage/DynamicShowroomPage'
import DynamicShowroomProvider, { useDynamicShowroomReducer } from "./providers/DynamicShowrooomProvider/DynamicShowroomProvider";

const TRACKING_ID = process.env.REACT_APP_TRACKING_ID

if (
  process.env.REACT_APP_SENTRY_DSN &&
  process.env.REACT_APP_NODE_ENV &&
  ["prod", "dev"].indexOf(process.env.REACT_APP_NODE_ENV) !== -1
) {
  const appVersion = process.env.REACT_APP_VERSION;
  const env = process.env.REACT_APP_NODE_ENV;
  console.log(`init sentry: ${appVersion} ${env}`);
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    environment: env,

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    initialScope: {
      tags: { "app-version": appVersion },
    },
  });
} else {
  const appVersion = process.env.REACT_APP_VERSION;
  const env = process.env.REACT_APP_NODE_ENV;
  console.log(`skipping sentry init: ${appVersion} ${env}`);
}

function App() {
  const reducer = useDynamicShowroomReducer();
  return (
    <div id="mantis-app" className="d-flex align-items-center justify-content-center">
      <Router>
        <GoogleAnalytics trackingIds={[TRACKING_ID]}/>
        <Beforeunload onBeforeunload={() => closingCode()}>
          <ShowroomLayout>
            <GlobalStyles />
            <ShowroomProvider>
              <DynamicShowroomProvider reducer={reducer}>
                <Route path="*">
                  <VHCentered>
                    <Route path="/showrooms/*">
                      <Switch>
                        <Route path={urls.showroomView.path} component={ShowroomPage} />
                      </Switch>
                    </Route>
                    <Route path="/dynamic-showrooms/*">
                      <Switch>
                        <Route path={urls.dynamicShowroomView.path} component={DynamicShowroomPage} />
                      </Switch>
                    </Route>
                    <Route {...urls.homePage} component={Home} />
                    <Route exact path={urls.forbiddenPage.path} component={ForbiddenPage} />
                    <Route {...urls.signInPage} component={SignInPage} />
                    <Route {...urls.updatePassword} component={UpdatePasswordPage} />
                    <Route exact path={[urls.requestPasswordReset.path, urls.resetPassword.path ]} component={RecoverPasswordPage} />
                    <Route
                      exact
                      path={[urls.signUpPage.path, urls.confirmEmailPage.path]}
                      component={SignUpPage}
                    />
                    <Route exact path={[urls.addTentant.path]} component={AddTenantsPage} />
                    <Route exact path={[urls.showroomIndex.path]} component={ShowroomIndexPage} />
                    <Route exact path={[urls.showroomAdminView.path]} component={ShowroomDetailsPage} />
                    <Route {...urls.signInGuestPage} component={SignInGuestPage} />
                  </VHCentered>
                </Route>
                <Header />
              </DynamicShowroomProvider>
            </ShowroomProvider>
          </ShowroomLayout>
        </Beforeunload>
      </Router>
    </div>
  );
}

export default App;
