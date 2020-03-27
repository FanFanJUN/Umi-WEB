import router from "umi/router";
import { stringify } from "qs";
import { message } from "antd";
import { userUtils } from '@/utils';
import { login } from "@/services/api";

const { clearUserInfo, getCurrentLocale, setCurrentLocale, setCurrentUser } = userUtils;

const locale = getCurrentLocale() || 'zh-CN';

export default {
  namespace: "global",
  state: {
    showTenant: false,
    userAuthLoaded: false,
    locationPathName: "/",
    locationQuery: {},
    locale: locale,
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: "updateState",
          payload: {
            locationPathName: location.pathname,
            locationQuery: location.query
          }
        });
      });
    }
  },
  effects: {
    * redirectLogin({ payload }, { call, put, select }) {
      const global = yield select(_ => _.global);
      const { locationPathName, locationQuery } = global;
      let location = locationPathName;
      if (location.indexOf("/user/login") !== -1) {
        location = locationQuery.from || "/";
      }
      router.replace({
        pathname: "/user/login",
        search: stringify({
          from: location
        })
      });
    },
    * login({ payload }, { call, select,put }) {
      const { locationQuery } = yield select(_ => _.global);
      const res = yield call(login, payload);
      message.destroy();
      clearUserInfo();
      if(res.data.loginStatus === 'multiTenant'){
        yield put({
          type: 'updateState',
          payload: {
            showTenant:true
          }
        });
        return
      }
      if (res.data.loginStatus !== 'failure') {
        message.success("登录成功");
        setCurrentUser(res.data);
        const { from } = locationQuery;
        if (from && from.indexOf("/user/login") === -1) {
          if (from === "/") {
            router.push("/dashboard");
          }
          else {
            router.push(from);
          }
        } else {
          router.push("/");
        }
      } else {
        message.error("登录失败");
      }
    },
    * changeLocale({ payload }, { put, select }) {
      const { locale } = payload;
      const { locationQuery } = yield select(_ => _.global);
      setCurrentLocale(locale);
      yield put({
        type: 'updateState',
        payload: {
          locale
        }
      });
      router.replace({
        pathname: "/user/login",
        search: stringify({
          from: locationQuery.from
        })
      });
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
