/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getExceptionReportSuccess, getExceptionReportError } from '../action';
import Api from '../../components/common/Api';
import { userService } from '../../services';
import axiosCall from '../apiServices';

export function* getExceptionByShiftSaga(action) {
  try {
    const token = userService.getToken();
    const id = userService.getUserId();
    const url = `${Api.exceptionRequest.exception.getExceptionByShift}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getExceptionReportSuccess({ response: response.data.data }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getExceptionByShiftSaga(action);
      });
    } else {
      yield put(getExceptionReportError({ error: 'Invalid  details' }));
    }
  } catch (error) {
    yield put(getExceptionReportError({ error: 'Invalid  details' }));
  }
}
