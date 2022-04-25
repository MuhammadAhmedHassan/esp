/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getWorkLocationSuccess, getWorkLocationError } from '../action';
import axiosCall from '../apiServices';
import Api from '../../components/common/Api';
import { userService } from '../../services';

export function* getWorkLocation(action) {
  try {
    const url = Api.manageEmp.searchworklocation;
    const token = userService.getToken();
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getWorkLocationSuccess([...response.data.data]));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getWorkLocation(action);
      });
    } else {
      yield put(getWorkLocationError({ error: { ...response.data.error } }));
    }
  } catch (error) {
    yield put(getWorkLocationError({ error: error.message }));
  }
}
