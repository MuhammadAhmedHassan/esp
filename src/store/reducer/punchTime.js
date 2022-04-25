import * as actionss from '../action/actionTypes';

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  data: {},
};

export const punchTime = (state = initialState, action) => {
  switch (action.type) {
    case actionss.PUNCH_TIME_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actionss.PUNCH_TIME_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        data: {
          ...action.payload.response,
        },
        message: action.payload.message,
      };
    case actionss.PUNCH_TIME_ERROR:
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

export default punchTime;
