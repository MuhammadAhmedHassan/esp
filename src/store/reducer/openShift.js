import * as actions from '../action/actionTypes';

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  list: {},
}

export const openShiftData = (state = initialState, action) => {
  switch (action.type) {
    case actions.OPEN_SHIFT_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.OPEN_SHIFT_SUCCESS:
      const { openShiftList } = action.payload
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        list: openShiftList.response,
      };
    case actions.OPEN_SHIFT_ERROR:
      return {
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default openShiftData;
