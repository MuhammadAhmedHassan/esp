import * as actions from "../action/actionTypes";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    divisionsList: [{ id: '0', name: 'All' }]
};

export const divisionsByOrganisationList = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCH_DIVISIONS_BY_ORGANISATIONID_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false
            };
        case actions.FETCH_DIVISIONS_BY_ORGANISATIONID_SUCCESS:
            const { divisionsList } = action.payload
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                divisionsList: [{ id: 0, name: 'All' }, ...divisionsList]
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

export default divisionsByOrganisationList;