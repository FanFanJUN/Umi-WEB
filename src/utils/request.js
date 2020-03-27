import { utils } from 'suid';
import constants from './constants.js';
import { userUtils } from '@/utils';

const { getAuthorization } = userUtils;

const { request } = utils;

request.defaults.baseURL = constants.BASE_URL;
request.interceptors.request.use(function (config) {
    config.headers["Authorization"] = getAuthorization();
    return config
})

export default request;
