import * as actions from "../action/actionTypes";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    businessUnitList: [{ id: '0', name: 'All' }]
};

export const businessUnitByDivisionList = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCH_BUSINESSUNIT_BY_DIVISIONS_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false
            };
        case actions.FETCH_BUSINESSUNIT_BY_DIVISIONS_SUCCESS:
            const { businessUnitList } = action.payload
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                businessUnitList: [{ id: 0, name: 'All' }, ...businessUnitList]
            };
        case actions.FETCH_BUSINESSUNIT_BY_DIVISIONS_ERROR:
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

export default businessUnitByDivisionList;