import axios from "axios";

axios.defaults.headers.common.Authorization = "";

export const validateApiUrl = (url) => {
    console.log('validateCognitoInfo');
    if (!url) {
        throw new Error('Failed to load REACT_APP_API (url) from .env')
    }
}

export const getApiUrl = () => {
    console.log('getApiUrl');
    const url = process.env.REACT_APP_API
    validateApiUrl(url);

    return url;
}
