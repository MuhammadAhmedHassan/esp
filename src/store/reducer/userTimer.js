import * as actions from "../action/actionTypes";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  list: {},
};
export const userTimerList = (state = initialState, action) => {
  switch (action.type) {
    case actions.USER_TIMER_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.USER_TIMER_SUCCESS:
      const { timerList } = action.payload
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        list: timerList.response,
      };
    case actions.USER_TIMER_ERROR:
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

export default userTimerList;
