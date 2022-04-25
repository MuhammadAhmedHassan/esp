import * as actions from "../action/actionTypes";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    managerList: [{ id: '0', firstName: 'All' }]
};

export const managerByTeamList = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCH_MANAGER_BY_TEAM_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false
            };
        case actions.FETCH_MANAGER_BY_TEAM_SUCCESS:
            const { managerList } = action.payload
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                managerList: [{ id: '0', firstName: 'All' }, ...managerList]
            };
        case actions.FETCH_MANAGER_BY_TEAM_ERROR:
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

export default managerByTeamList;