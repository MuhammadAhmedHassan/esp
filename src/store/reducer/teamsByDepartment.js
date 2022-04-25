import * as actions from "../action/actionTypes";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    teamsList: [{ id: '0', name: 'All' }]
};

export const teamsByDepartmentList = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCH_TEAMS_BY_DEPARTMENT_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false
            };
        case actions.FETCH_TEAMS_BY_DEPARTMENT_SUCCESS:
            const { teamsList } = action.payload
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                teamsList: [{ id: 0, name: 'All' }, ...teamsList]
            };
        case actions.FETCH_TEAMS_BY_DEPARTMENT_ERROR:
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

export default teamsByDepartmentList;