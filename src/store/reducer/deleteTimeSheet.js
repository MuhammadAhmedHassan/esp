import * as actions from "../action/actionTypes";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
};

export const deleteTimeSheet = (state = initialState, action) => {
    switch (action.type) {
        case actions.DELETE_TIMESHEET_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false
            };
        case actions.DELETE_TIMESHEET_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                ...action.payload
            };
        case actions.DELETE_TIMESHEET_ERROR:
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

export default deleteTimeSheet;