import * as actions from '../action/actionTypes';

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  data: {},
};

export const overTime = (state = initialState, action) => {
  switch (action.type) {
    case actions.OVER_TIME_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.OVER_TIME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        data: {
          ...action.payload.response,
        },
        message: action.payload.overTimeDetails.message,
      };
    case actions.OVER_TIME_ERROR:
      return {
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: { ...action.payload.error },
      };
    default:
      return state;
  }
};

export default overTime;
