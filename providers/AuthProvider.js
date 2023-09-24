import { createContext, useContext, useEffect, useReducer } from "react";
import { useCookies } from "react-cookie";
import PageSpinner from "../components/PageSpinner";
import { getSession } from "../services/AuthService";
import { getCookie } from '../services/Cookie/CookieService'

export const initialState = {
  isAuthenticated: false,
  isGuest: false,
  verified: false,
  error: null,
  userSession: null,
  attributes: null,
};

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error("useAuthState must be within AuthProvider");
  }

  return context;
};

export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (!context) {
    throw new Error("useAuthDispatch must be within AuthProvider");
  }

  return context;
};

export const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case "user_not_signed_in":
      return {
        ...initialState,
        verified: true,
        isAuthenticated: false,
        isGuest: false,
        userSession: null,
        attributes: null,
      };
    case "user_as_a_guest": {
      const { attributes } = action.payload;
      return {
        ...initialState,
        verified: true,
        isAuthenticated: false,
        isGuest: true,
        userSession: null,
        attributes,
      };
    }
    case "login_success":
      const { userSession, attributes } = action.payload;
      return {
        ...initialState,
        verified: true,
        isAuthenticated: true,
        isGuest: false,
        userSession,
        attributes,
      };
    case "login_error":
      const { error } = action.payload;
      return {
        ...initialState,
        verified: true,
        isAuthenticated: false,
        isGuest: false,
        error: error,
        userSession: null,
        attributes: null,
      };
    case "logout_success":
      return {
        ...initialState,
        verified: true,
        isAuthenticated: false,
        isGuest: false,
        userSession: null,
        attributes: null,
      };
    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
};

const AuthProvider = ({ children }) => {
  // TODO: Move to its own "AppLoader" to handle cookies, auth, content
  const [authCookies] = useCookies();
  const [authState, authDispatch] = useReducer(AuthReducer, initialState);
  useEffect(() => {
    if (!authState.verified) {
      (async () => {
        try {
          const token = getCookie('token')
          if (token) {
            const fullname = getCookie('fullName')

            return authDispatch({
              type: "user_as_a_guest",
              payload: {
                attributes: {
                  name: fullname,
                },
              },
            });
          }

          const authInfo = await getSession();
          if (authInfo === null) {
            authDispatch({ type: "user_not_signed_in" });
          } else {
            authDispatch({
              type: "login_success",
              payload: authInfo,
            });
          }
        } catch (e) {
          console.error("failed to load current session");
          throw e;
        }
      })();
    }
  }, [authState, authCookies]);

  let content = authState.verified ? children : <PageSpinner />;

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthDispatchContext.Provider value={authDispatch}>
        {content}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export default AuthProvider;
