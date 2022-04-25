import * as actions from "../action/actionTypes";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    countryList: []
};

export const allCountryList = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCH_ALL_COUNTRY_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false
            };
        case actions.FETCH_ALL_COUNTRY_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                countryList: [{ id: 0, name: 'All' }, ...action.payload.countryList]
            };
        case actions.FETCH_ALL_COUNTRY_ERROR:
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

export default allCountryList;