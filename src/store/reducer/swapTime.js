import * as actions from '../action/actionTypes';

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  list: [],
};
export const swapTimeList = (state = initialState, action) => {
  switch (action.type) {
    case actions.SWAP_TIME_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.SWAP_TIME_SUCCESS:
      const { swapTimedata } = action.payload;
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        list: [...swapTimedata.response],
      };
    case actions.SWAP_TIME_ERROR:
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

export default swapTimeList;
