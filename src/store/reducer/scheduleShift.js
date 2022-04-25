import * as actions from '../action/actionTypes';

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  list: {},
}

export const scheduleData = (state = initialState, action) => {
  switch (action.type) {
    case actions.SCHEDULE_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.SCHEDULE_SUCCESS:
      const { scheduleDataList } = action.payload
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        list: scheduleDataList.response,
      };
    case actions.SCHEDULE_ERROR:
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

export default scheduleData;
