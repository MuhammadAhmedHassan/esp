import * as actions from "../action/actionTypes";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    userList: [{}]
};

export const userByManagerList = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCH_USER_BY_MANAGER_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false
            };
        case actions.FETCH_USER_BY_MANAGER_SUCCESS:
            const { userList } = action.payload
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                userList: [...userList]
            };
        case actions.FETCH_USER_BY_MANAGER_ERROR:
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

export default userByManagerList;