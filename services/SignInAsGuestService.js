import axios from 'axios'
import { getApiUrl } from './common';
import { setCookie } from './Cookie/CookieService'

const API = getApiUrl();

export const SignInAsGuestService = async (data) => {
  try {
    const URL = "/accounts/guest"
    const response = await axios({
      baseURL: API,
      method: "POST",
      url: URL,
      data: {
        fullName: data.fullName
      }
    })

    const token = response.data.token

    addTokenToAuthHeader(token)
    addItemsToCookies(token, data.fullName)

    return response.data
  } catch (err) {
    return err.msg
  }
}

const addTokenToAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = token
}

const addItemsToCookies = (token, fullName) => {
  setCookie("token", token, 1)
  setCookie("fullName", fullName, 1)
}