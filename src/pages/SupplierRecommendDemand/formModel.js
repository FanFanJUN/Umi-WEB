export const initialState = {

}

export const reducers = (state, action) => {
  const { payload, type } = action;
  switch (type) {
    case 'saveSometing':
      return {
        ...state,
        payload
      }
  }
}

export const effects = (dispatch, payload) => {}