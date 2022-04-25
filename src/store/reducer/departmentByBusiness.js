import * as actions from "../action/actionTypes";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    departmentList: [{ id: '0', name: 'All' }]
};

export const departmentByBusinessList = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCH_DEPARTMENTS_BY_BUSINESSUNIT_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false
            };
        case actions.FETCH_DEPARTMENTS_BY_BUSINESSUNIT_SUCCESS:
            const { departmentList } = action.payload
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                departmentList: [{ id: 0, name: 'All' }, ...departmentList]
            };
        case actions.FETCH_DIVISIONS_BY_ORGANISATIONID_ERROR:
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

export default departmentByBusinessList;