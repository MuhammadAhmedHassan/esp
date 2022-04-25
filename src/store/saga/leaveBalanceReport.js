/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getLeaveBalanceReportSuccess, getLeaveBalanceReportError } from '../action';
import Api from '../../components/common/Api';
import { userService } from '../../services';
import axiosCall from '../apiServices';

export function* leaveBalanceReportSaga(action) {
  try {
    const token = userService.getToken();
    const id = userService.getUserId();
    const url = `${Api.leaveBalanceReport.getLeaveReport}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getLeaveBalanceReportSuccess({ response: response.data }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        leaveBalanceReportSaga(action);
      });
    } else {
      yield put(getLeaveBalanceReportError({ error: 'Invalid  details' }));
    }
  } catch (error) {
    yield put(getLeaveBalanceReportError({ error: 'Invalid  details' }));
  }
}
