import { message } from 'antd';
import {
  fetchTable,
  handleUpdate,
  handleDelete,
  handleUpdateStatus,
  changeDisplayStatus,
  getAllColumn,
} from '@/services/company/news';

export default {
  namespace: 'news',
  state: {
    tableData: [],
    pagination: {},
    loading: false,
    search: {},
    drawerShow: false,
    columnList: [],
  },
  effects: {
    *fetch({ payload = { pageNum: 1, pageSize: 10 } }, { call, put }) {
      yield put({ type: 'changeTableLoading', payload: true });
      const response = yield call(fetchTable, payload);
      if (response.code === 0) {
        const { data } = response;
        yield put({
          type: 'changeTableData',
          payload: {
            tableData: data.list,
            pagination: { current: data.pageNum, pageSize: data.pageSize, total: data.total },
          },
        });
        yield put({ type: 'changeTableLoading', payload: false });
      }
    },
    *showDrawerAction(_, { put }) {
      yield put({ type: 'changeShowDrawerStatus' });
    },
    *handleUpdate({ payload, pagination }, { call, put }) {
      const response = yield call(handleUpdate, payload);
      if (response.code === 0) {
        yield put({ type: 'changeShowDrawerStatus' });
        message.success(response.msg);
        yield put({
          type: 'fetch',
          payload: { pageSize: pagination.pageSize, pageNum: pagination.current },
        });
      }
    },
    *handleUpdateStatus({ payload, pagination }, { call, put }) {
      const response = yield call(handleUpdateStatus, payload);
      if (response.code === 0) {
        message.success(response.msg);
        yield put({
          type: 'fetch',
          payload: { pageSize: pagination.pageSize, pageNum: pagination.current },
        });
      }
    },
    *changeDisplayStatus({ payload, pagination }, { call, put }) {
      const response = yield call(changeDisplayStatus, payload);
      if (response.code === 0) {
        message.success(response.msg);
        yield put({
          type: 'fetch',
          payload: { pageSize: pagination.pageSize, pageNum: pagination.current },
        });
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
    *getAllColumn(_, { call, put }) {
      const response = yield call(getAllColumn);
      if (response.code === 0) {
        yield put({ type: 'changeColumnList', payload: { columnList: response.data } });
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
    changeShowDrawerStatus(state) {
      return { ...state, drawerShow: !state.drawerShow };
    },
    changeColumnList(state, { payload }) {
      return { ...state, columnList: payload.columnList };
    },
  },
};
