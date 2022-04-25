import { put, call } from 'redux-saga/effects';
import { getCityByStateIdSuccess, getCityByStateIdError } from '../action';
import axiosCall from '../apiServices';
import Api from '../../components/common/Api';
import { userService } from '../../services';

// eslint-disable-next-line import/prefer-default-export
export function* getCityByState(action) {
  try {
    const url = Api.manageEmp.getcitiesbystatesid;
    const token = userService.getToken();
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getCityByStateIdSuccess([...response.data.data]));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getCityByState(action);
      });
    } else {
      yield put(getCityByStateIdError({ error: { ...response.data.error } }));
    }
  } catch (error) {
    yield put(getCityByStateIdError({ error: error.message }));
  }
}
