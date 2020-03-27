import { utils } from 'suid';

const { CONST_GLOBAL } = utils.constants;
const { CURRENT_USER, TOKEN_KEY, CURRENT_LOCALE } = CONST_GLOBAL;

/** 用户信息保存到session */
export const setCurrentUser = user => {
  sessionStorage.removeItem('Authorization');
  sessionStorage.removeItem('app_current_user');
  sessionStorage.setItem('Authorization', JSON.stringify(user));
  sessionStorage.setItem("app_current_user", user.accessToken);
};

export const getAuthorization = () => sessionStorage.getItem("app_current_user");

/** 获取当前用户信息 */
export const getCurrentUser = () => JSON.parse(sessionStorage.getItem("Authorization")||"");

export const getCurrentLocale = () => "";

export const setCurrentLocale = locale => {
  localStorage.setItem(CURRENT_LOCALE, locale);
};

/** 根据键清空 */
export const clearUserInfo = () => sessionStorage.clear([CURRENT_USER, TOKEN_KEY]);
