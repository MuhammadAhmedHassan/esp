import * as actions from "../action/actionTypes";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  list: []
};
export const teamMatesList = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_TEAM_MATES_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false
      };
    case actions.FETCH_TEAM_MATES_SUCCESS:
      const { teamsList } = action.payload
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        list: [...teamsList.response]
      };
    case actions.FETCH_TEAM_MATES_ERROR:
      return {
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default teamMatesList;