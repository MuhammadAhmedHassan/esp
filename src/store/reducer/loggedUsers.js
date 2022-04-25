const initialState = {
  user: {
    accessToken: '',
    refreshToken: '',
    authdata: '',
    role: [],
    userName: '',
    userId: undefined,
  },
};

const checkUserRole = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_REMOTE_DATA_SUCCESS': return {
      ...state,
      user: action.payload.users.data,
    };
    default: return state;
  }
};

export default checkUserRole;
