const userLoggedin = users => ({
  type: 'FETCH_REMOTE_DATA_SUCCESS',
  payload: { users },
});

export default userLoggedin;
