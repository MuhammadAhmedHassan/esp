import * as actions from "../action/actionTypes";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  exceptionReportData: {},
};

export const fetchAllException = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_ALL_EXCEPTION_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.FETCH_ALL_EXCEPTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        exceptionReportData: { ...action.payload.response },
      };
    case actions.FETCH_ALL_EXCEPTION_ERROR:
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

export default fetchAllException;
