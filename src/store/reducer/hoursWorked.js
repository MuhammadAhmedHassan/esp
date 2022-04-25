import * as actions from "../action/actionTypes";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  hoursWorked: {},
};

export const hoursWorkedList = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_HOURS_WORKED_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.FETCH_HOURS_WORKED_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        hoursWorked: { ...action.payload.response },
      };
    case actions.FETCH_HOURS_WORKED_ERROR:
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

export default hoursWorkedList;
