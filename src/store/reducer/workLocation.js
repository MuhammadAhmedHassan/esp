import * as actions from "../action/actionTypes";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    workLocationList: [{ id: 0, name: 'All' }]
};

export const workLocationList = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCH_WORK_LOCATION_REQUEST:
            return {
                ...state,
                isLoading: true,
                isSuccess: false,
                isError: false
            };
        case actions.FETCH_WORK_LOCATION_SUCCESS:
            const { workLocationList } = action.payload
            return {
                ...state,
                isLoading: false,
                isSuccess: true,
                isError: false,
                workLocationList: [{ id: 0, name: 'All' }, ...workLocationList]
            };
        case actions.FETCH_WORK_LOCATION_ERROR:
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

export default workLocationList;