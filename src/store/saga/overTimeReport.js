/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getOverTimeReportSuccess, getOverTimeReportError } from '../action';
import Api from '../../components/common/Api';
import { userService } from '../../services';
import axiosCall from '../apiServices';

export function* overTimeReportSaga(action) {
  try {
    const token = userService.getToken();
    const id = userService.getUserId();
    const url = `${Api.overTime.employeeOverTime}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getOverTimeReportSuccess({ response: response.data }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        overTimeReportSaga(action);
      });
    } else {
      yield put(getOverTimeReportError({ error: 'Invalid  details' }));
    }
  } catch (error) {
    yield put(getOverTimeReportError({ error: 'Invalid  details' }));
  }
}
