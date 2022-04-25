import * as actions from "../action/actionTypes";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    data: {  }
};
export const swapShift = (state = initialState, action) => {
    switch (action.type) {
        case actions.SWAP_SHIFT_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false
            };
        case actions.SWAP_SHIFT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                data: {
                    ...action.payload.response
                },
                message:action.payload.message
            };
        case actions.SWAP_SHIFT_ERROR:
            return {
                isLoading: false,
                isSuccess: false,
                isError: true,
                error:{ ...action.payload.error}
            };
        default:
            return state;
    }
};

export default swapShift;