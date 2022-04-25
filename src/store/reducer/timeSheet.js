import * as actions from '../action/actionTypes';

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  timeSheet: [],
};

export const timeSheetList = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_TIMESHEET_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.FETCH_TIMESHEET_SUCCESS:
      const { timeSheet } = action.payload;
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        timeSheet: timeSheet.response,
      };
    case actions.FETCH_TIMESHEET_ERROR:
      return {
        isLoading: false,
        isSuccess: false,
        isError: true,
        timeSheet: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default timeSheetList;
