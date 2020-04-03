import { loadingReducer } from '@/utils/commonReducer';

export default {
  namespace: "strategyDetail",
  state: {
    loading: false
  },
  subscriptions: {
    init({ dispatch, history }) {
      history.listen(({ pathname, ...other })=> {
        console.log(pathname)
        console.log(other)
      })
    }
  },
  effects: {},
  reducers: {
    ...loadingReducer
  }
}