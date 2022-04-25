import * as actions from "../action/actionTypes";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  data: {},
};

export const downloadOTReportM = (state = initialState, action) => {
  switch (action.type) {
    case actions.DOWNLOAD_EXCEPTION_REPORT_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.DOWNLOAD_EXCEPTION_REPORT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        data: { ...action.payload.response },
      };
    case actions.DOWNLOAD_EXCEPTION_REPORT_ERROR:
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

export default downloadOTReportM;
