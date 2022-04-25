import * as actions from "../action/actionTypes";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    cityList: [{ id: '0', name: 'All' }]
};

export const cityByStateList = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCH_CITY_BY_STATEID_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false
            };
        case actions.FETCH_CITY_BY_STATEID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                cityList: [{ id: '0', name: 'All' }, ...action.payload.cityList]
            };
        case actions.FETCH_CITY_BY_STATEID_ERROR:
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

export default cityByStateList;