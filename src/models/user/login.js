import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { message } from 'antd';
import {
  fakeAccountLogin,
  getFakeCaptcha,
  handleUpdatePassword,
  fakeAccountLogout,
} from '@/services/user/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.code === 0) {
        window.sessionStorage.setItem('userInfo', JSON.stringify(response.data));
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }

        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { call, put }) {
      const response = yield call(fakeAccountLogout);
      if (response.code === 0) {
        const { redirect } = getPageQuery(); // redirect
        if (window.location.pathname !== '/user/login' && !redirect) {
          // window.sessionStorage.clear()
          yield put(
            routerRedux.replace({
              pathname: '/user/login',
              search: stringify({
                redirect: window.location.href,
              }),
            }),
          );
        }
      }
    },
    *handleUpdatePassword({ payload }, { call }) {
      const response = yield call(handleUpdatePassword, payload);
      if (response.code === 0) {
        message.success(response.msg);
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
