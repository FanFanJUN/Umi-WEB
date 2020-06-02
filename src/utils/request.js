import { utils } from 'suid';
import constants from './constants.js';
import { getAuthorization } from './user';

const { request } = utils;
request.defaults.baseURL = constants.BASE_URL;
request.interceptors.request.use(function (config) {
    config.headers["Authorization"] = getAuthorization();
    return config
})

export default request;