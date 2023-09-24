import axios from "axios";
import {getApiUrl} from './common';

export const about = async () => {
    const url = getApiUrl();
    return axios.get(`${url}/about`);
}