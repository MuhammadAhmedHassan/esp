import * as actions from '../action/actionTypes';

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  list: {},
};

export const profileDataList = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_PROFILE_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        isError: false,
      };
    case actions.FETCH_PROFILE_DATA_SUCCESS:
      const { profileData } = action.payload
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
        isError: false,
        list: profileData.response,
      };
    case actions.FETCH_PROFILE_DATA_ERROR:
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

export default profileDataList;
