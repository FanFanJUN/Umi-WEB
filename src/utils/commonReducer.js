export const loadingReducer = {
  /** 在model中增加 loading state */
  showLoading(state) {
    return {
      ...state,
      loading: true
    }
  },
  hideLoading(state) {
    return {
      ...state,
      loading: false
    }
  }
}
export const loadingState = {
  loading: false
}