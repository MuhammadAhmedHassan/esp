import * as actions from "../action/actionTypes";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  allLeaveTypesData: {},
};

export const allLeavesTypes = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_LEAVE_TYPES_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.FETCH_LEAVE_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        allLeaveTypesData: { ...action.payload.response },
      };
    case actions.FETCH_LEAVE_TYPES_ERROR:
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

export default allLeavesTypes;
