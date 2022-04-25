import * as actions from "../action/actionTypes";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    statesList: [{ id: '0', name: 'All' }]
};

export const statesByCountryList = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCH_STATES_BY_COUNTRYID_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false
            };
        case actions.FETCH_STATES_BY_COUNTRYID_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                statesList: [{ id: '0', name: 'All' }, ...action.payload.statesList]
            };
        case actions.FETCH_STATES_BY_COUNTRYID_ERROR:
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

export default statesByCountryList;