import { put, call } from 'redux-saga/effects';
import { getUserByManagerSuccess, getUserByManagerError } from '../action';
import axiosCall from '../apiServices';
import Api from '../../components/common/Api';
import { userService } from '../../services';

// eslint-disable-next-line import/prefer-default-export
export function* getUserByManager(action) {
  try {
    const url = Api.manageEmp.getemployeebymanagerid;
    const token = userService.getToken();
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });
    if (response.data.statusCode === 200) {
      yield put(getUserByManagerSuccess([...response.data.data]));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getUserByManager(action);
      });
    } else {
      yield put(getUserByManagerError({ error: { ...response.data.error } }));
    }
  } catch (error) {
    yield put(getUserByManagerError({ error: error.message }));
  }
}
