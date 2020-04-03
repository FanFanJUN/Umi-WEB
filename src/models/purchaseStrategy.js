import { loadingReducer, loadingState } from '@/utils/commonReducer';
import { queryStrategyTableList } from '../services/strategy';
export default {
  namespace: "purchaseStrategy",
  state: {
    // 列表数据源
    dataSource: [],
    // 列表分页信息
    pagination: {},
    ...loadingState
  },
  subscriptions: {
    init({ history, dispatch }) {
      history.listen(({ pathname }) => {
        if (pathname === "/purchase/strategy") {
          dispatch({
            type: "queryDataSource",
            payload: {
              rows: 30,
              page: 1
            }
          })
        }
      })
    }
  },
  effects: {
    *queryDataSource({ payload }, { call, put }) {
      yield put({ type: "showLoading" })
      const {data: response} = yield call(queryStrategyTableList, payload);
      const { rows, success, ...pagination } = response;
      if (success) {
        yield put({
          type: "queryDataSourceSuccess",
          payload: rows,
          pagination: {
            total: pagination.total,
            current: pagination.page
          }
        })
        yield put({ type: "hideLoading" })
      }
    }
  },
  reducers: {
    ...loadingReducer,
    queryDataSourceSuccess(state, { payload, pagination }) {
      return {
        ...state,
        dataSource: payload,
        pagination: pagination
      }
    }
  }
}