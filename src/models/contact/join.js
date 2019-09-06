import { message } from 'antd';
import { fetchTable, handleDelete } from '@/services/contact/join';

export default {
  namespace: 'join',
  state: {
    tableData: [],
    pagination: {},
    loading: false,
    search: {},
  },
  effects: {
    *fetch({ payload = { pageNum: 1, pageSize: 10 } }, { call, put }) {
      yield put({ type: 'changeTableLoading', payload: true });
      const response = yield call(fetchTable, { ...payload });
      if (response.code === 0) {
        yield put({
          type: 'changeTableData',
          payload: {
            tableData: response.data.list,
            pagination: {
              current: payload.pageNum,
              pageSize: payload.pageSize,
              total: response.total,
            },
          },
        });
        yield put({ type: 'changeTableLoading', payload: false });
      }
    },
    *handleDelete({ payload, pagination }, { call, put }) {
      const response = yield call(handleDelete, payload);
      if (response.code === 0) {
        message.success(response.msg);
        yield put({
          type: 'fetch',
          payload: { pageSize: pagination.pageSize, pageNum: pagination.current },
        });
      }
    },
  },
  reducers: {
    changeTableData(state, { payload }) {
      return { ...state, tableData: payload.tableData, pagination: payload.pagination };
    },
    changeTableLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
  },
};
