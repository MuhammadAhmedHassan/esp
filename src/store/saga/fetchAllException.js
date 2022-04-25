/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { fetchAllExceptionSuccess, fetchAllExceptionError } from '../action';
import Api from '../../components/common/Api';
import { userService } from '../../services';
import axiosCall from '../apiServices';

export function* fetchAllExceptionSaga(action) {
  try {
    const token = userService.getToken();
    const id = userService.getUserId();
    const url = `${Api.exceptionRequest.exception.getAllException}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(fetchAllExceptionSuccess({ response: response.data }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        fetchAllExceptionSaga(action);
      });
    } else {
      yield put(fetchAllExceptionError({ error: 'Invalid  details' }));
    }
  } catch (error) {
    yield put(fetchAllExceptionError({ error: 'Invalid  details' }));
  }
}
