import axios from "axios";
import { getApiUrl } from "./common";
import { apiUrls } from "../constants/urls";

export const showrooms = async () => {
  const url = getApiUrl();
  return axios.get(`${url}${apiUrls.showroomIndex}`).then((res) => res.data);
};

export const showroom = async (id) => {
  const url = getApiUrl();
  const response = await axios
    .get(`${url}${apiUrls.showroomDetails(id)}`)
    .then((res) => res.data)
    .catch((err) => console.log(err))
  return response;
};
