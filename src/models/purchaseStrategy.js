import { loadingReducer, loadingState } from '@/utils/commonReducer';
import {
  removeStrategyTableItem
} from '../services/strategy';
import { message } from 'antd';
export default {
  namespace: "purchaseStrategy",
  state: {
    ...loadingState
  },
  effects: {
    *remove({ payload, cb }, { call }) {
      const { data: response } = yield call(removeStrategyTableItem,payload);
      if(response.success) {
        cb()
        message.success(response.message)
      }
    }
  },
  reducers: {
    ...loadingReducer
  }
}