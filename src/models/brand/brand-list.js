import { message } from 'antd'
import {
  fetchTable,
  handleUpdate,
  handleDelete,
  handleUpdateProduct,
  handleDeleteProduct,
  getBrandList,
} from '@/services/brand/brand-list'

export default {
  namespace: 'brand-list',
  state: {
    tableData: [],
    pagination: {},
    loading: false,
    search: {},
    drawerShow: false,
    drawerShowProduct: false,
    brandList: [],
  },
  effects: {
    * fetch ({ payload = { pageNum: 1, pageSize: 10 } }, { call, put }) {
      yield put({ type: 'changeTableLoading', payload: true })
      const response = yield call(fetchTable, payload)
      if (response.code === 0) {
        const { data } = response
        yield put({
          type: 'changeTableData',
          payload: {
            tableData: data.list,
            pagination: { current: data.pageNum, pageSize: data.pageSize, total: data.total },
          },
        })
        yield put({ type: 'changeTableLoading', payload: false })
      }
    },
    * showDrawerAction (_, { _, put }) {
      yield put({ type: 'changeShowDrawerStatus' })
    },
    * handleUpdate ({ payload, pagination }, { call, put }) {
      const response = yield call(handleUpdate, payload)
      if (response.code === 0) {
        yield put({ type: 'changeShowDrawerStatus' })
        message.success(response.msg)
        yield put({
          type: 'fetch',
          payload: { pageSize: pagination.pageSize, pageNum: pagination.current },
        })
      }
    },
    * handleUpdateStatus ({ payload, pagination }, { call, put }) {
      const response = yield call(handleUpdate, payload)
      if (response.code === 0) {
        message.success(response.msg)
        yield put({
          type: 'fetch',
          payload: { pageSize: pagination.pageSize, pageNum: pagination.current },
        })
      }
    },
    * handleDelete ({ payload, pagination }, { call, put }) {
      const response = yield call(handleDelete, payload)
      if (response.code === 0) {
        message.success(response.msg)
        yield put({
          type: 'fetch',
          payload: { pageSize: pagination.pageSize, pageNum: pagination.current },
        })
      }
    },
    * handleDeleteProduct ({ payload, pagination }, { call, put }) {
      const response = yield call(handleDeleteProduct, payload)
      if (response.code === 0) {
        message.success(response.msg)
        yield put({
          type: 'fetch',
          payload: { pageSize: pagination.pageSize, pageNum: pagination.current },
        })
      }
    },
    * showDrawerActionProduct (_, { _, put }) {
      yield put({ type: 'changeShowDrawerStatusProduct' })
    },
    * handleUpdateProduct ({ payload, pagination }, { call, put }) {
      const response = yield call(handleUpdateProduct, payload)
      if (response.code === 0) {
        yield put({ type: 'changeShowDrawerStatusProduct' })
        message.success(response.msg)
        yield put({
          type: 'fetch',
          payload: { pageSize: pagination.pageSize, pageNum: pagination.current },
        })
      }
    },
    * getBrandList (_, { call, put }) {
      const response = yield call(getBrandList)
      if (response.code === 0) {
        yield put({ type: 'changeBrandList', payload: { brandList: response.data } })
      }
    },
  },
  reducers: {
    changeTableData (state, { payload }) {
      return { ...state, tableData: payload.tableData, pagination: payload.pagination }
    },
    changeTableLoading (state, { payload }) {
      return { ...state, loading: payload }
    },
    changeShowDrawerStatus (state) {
      return { ...state, drawerShow: !state.drawerShow }
    },
    changeShowDrawerStatusProduct (state) {
      return { ...state, drawerShowProduct: !state.drawerShowProduct }
    },
    changeBrandList (state, { payload }) {
      return { ...state, brandList: payload.brandList }
    },
  },
}
