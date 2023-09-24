import axios from "axios";
import {getApiUrl} from './common';
import {apiUrls} from "../constants/urls";

export const users = async () => {
  const url = getApiUrl();
  return axios.get(`${url}${apiUrls.userIndex}`).then(res => res.data);
}
