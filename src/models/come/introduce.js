import { message } from 'antd';
import { fetch, handleUpdate } from '@/services/come/introduce';

export default {
  namespace: 'introduce',
  state: {
    listData: [],
    loading: false,
    drawerShow: false,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'changeTableLoading', payload: true });
      const response = yield call(fetch, payload);
      if (response.code === 0) {
        const { data } = response;
        yield put({ type: 'changeListData', payload: { listData: data } });
        yield put({ type: 'changeTableLoading', payload: false });
      }
    },
    *showDrawerAction(_, { put }) {
      yield put({ type: 'changeShowDrawerStatus' });
    },
    *handleUpdate({ payload }, { call, put }) {
      const response = yield call(handleUpdate, payload);
      if (response.code === 0) {
        yield put({ type: 'changeShowDrawerStatus' });
        message.success(response.msg);
        yield put({ type: 'fetch' });
      }
    },
  },
  reducers: {
    changeListData(state, { payload }) {
      return { ...state, listData: payload.listData };
    },
    changeTableLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    changeShowDrawerStatus(state) {
      return { ...state, drawerShow: !state.drawerShow };
    },
  },
};
