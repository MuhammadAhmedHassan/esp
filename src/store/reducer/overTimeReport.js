import * as actions from "../action/actionTypes";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  overTimeData: {},
};

export const overTimeReport = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_OVERTIME_REPORT_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.FETCH_OVERTIME_REPORT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        overTimeData: { ...action.payload.response },
      };
    case actions.FETCH_OVERTIME_REPORT_ERROR:
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default overTimeReport;
