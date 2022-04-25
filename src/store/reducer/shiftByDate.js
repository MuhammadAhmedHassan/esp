import * as actions from "../action/actionTypes";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    currentUserList: [],
    targetUserList: []
};
export const shiftByDateList = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCH_SHIFT_BY_DATE_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false
            };
        case actions.FETCH_SHIFT_BY_DATE_SUCCESS:
            const { shiftsList } = action.payload
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                ...shiftsList
            };
        case actions.FETCH_SHIFT_BY_DATE_ERROR:
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

export default shiftByDateList;