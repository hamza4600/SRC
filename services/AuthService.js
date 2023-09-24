import axios from "axios";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';

import { eraseCookie, getCookie } from './Cookie/CookieService'

const validateCognitoInfo = (userPoolId, clientId) => {
  console.log('validateCognitoInfo');
  if (!userPoolId) {
    throw new Error('Failed to load REACT_APP_COGNITO_POOL_ID (userPoolId) from .env')
  }

  if (!clientId) {
    throw new Error('Failed to load REACT_APP_COGNITO_CLIENT_ID (clientId) from .env')
  }
}

const getUserPool = () => {
  console.log('getUserPool');
  const userPoolId = process.env.REACT_APP_COGNITO_POOL_ID;
  const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;

  validateCognitoInfo(userPoolId, clientId);

  return new CognitoUserPool({
    UserPoolId: userPoolId,
    ClientId: clientId,
    // Storage: new CookieStorage({domain}),
  });
}

export const getCognitoUserByEmail = (email) => {
  const userPool = getUserPool();
  return new CognitoUser({
    Username: email,
    Pool: userPool,
    // Storage: new CookieStorage({domain}),
  });
}

export const getCurrentCognitoUser = () => {
  const userPool = getUserPool();
  return userPool.getCurrentUser();
}

export async function SignIn(email, password) {
  const cognitoUser = getCognitoUserByEmail(email);
  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (userSession) => {
        cognitoUser.getUserAttributes(function (err, result) {
          if (err) {
            reject(err);
            return;
          }
          const attributes = {}
          for (let i = 0; i < result.length; i++) {
            attributes[result[i].getName()] = result[i].getValue();
          }
          axios.defaults.headers.common.Authorization = userSession.accessToken.jwtToken;
          resolve({
            userSession,
            attributes,
          });
        });
      },
      onFailure: reject,
    });
  });
}

export const SignOut = () => {
  if (getCookie("token")) {
    eraseCookie("token")
    eraseCookie("fullName")
    return
  }

  const cognitoUser = getCurrentCognitoUser();
  delete axios.defaults.headers.common.Authorization;
  cognitoUser.signOut();
}

export const ConfirmEmail = (email, code) => {
  console.log('ConfirmEmail');
  const userPool = getUserPool();
  const user = new CognitoUser({
    Username: email,
    Pool: userPool
  });
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err, response) => {
      console.log('err/response', err, response);
      err ? reject(err) : resolve(response);
    });
  });
}

export async function SignUp(fullName, phoneNumber, email, password) {
  console.log('SignUp');
  const userPool = getUserPool();
  const attrList = [
    new CognitoUserAttribute({
      Name: 'name',
      Value: fullName,
    }),
    new CognitoUserAttribute({
      Name: 'phone_number',
      Value: phoneNumber,
    })
  ]
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attrList, null, (err, result) => {
      console.log('err/result', err, result);
      // InvalidParameterException: Invalid phone number format.
      // UsernameExistsException: An account with the given email already exists.
      // codeDeliveryDetails:
      // AttributeName: "email"
      // DeliveryMedium: "EMAIL"
      // Destination: "a***@r***.ca"
      err ? reject(err) : resolve(result);
    });
  });
}

export const requestPasswordReset = (email) => {
  console.log('requestPasswordReset');
  const cognitoUser = getCognitoUserByEmail(email);
  return new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: function (data) {
        // successfully initiated reset password request
        resolve(data);
      },
      onFailure: function (err) {
        reject(err);
      },
    });
  });
}

export const resetPassword = (email, verificationCode, newPassword) => {
  console.log('resetRequestedPassword');
  const cognitoUser = getCognitoUserByEmail(email);
  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess() {
        resolve();
      },
      onFailure(err) {
        reject(err);
      },
    });
  });
}

export const getSession = async () => {
  console.log('getSession');
  const cognitoUser = getCurrentCognitoUser();

  if (cognitoUser === null) return null;

  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err, userSession) => {
      if (err) {
        reject(err);
        return;
      }
      cognitoUser.getUserAttributes(function (err, result) {
        if (err) {
          reject(err);
          return;
        }
        const attributes = {}
        for (let i = 0; i < result.length; i++) {
          attributes[result[i].getName()] = result[i].getValue();
        }
        axios.defaults.headers.common.Authorization = userSession.accessToken.jwtToken;
        resolve({
          userSession,
          attributes,
        });
      })
    })
  })
}

export const updatePassword = (oldPassword, newPassword) => {
  console.log('updatePassword');
  const cognitoUser = getCurrentCognitoUser();

  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }
      cognitoUser.changePassword(oldPassword, newPassword, (err, response) => {
        console.log('err/response', err, response);
        err ? reject(err) : resolve(response);
      });
    });
  });
}

export const resendConfirmation = ({email}) => {
  return new Promise((resolve, reject) => {
    const cognitoUser = getCognitoUserByEmail(email);
    cognitoUser.resendConfirmationCode(function (err, response) {
      console.log('err/response', err, response);
      err ? reject(err) : resolve(response);
    });
  });
}
