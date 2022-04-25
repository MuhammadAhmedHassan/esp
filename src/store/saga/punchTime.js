import { put, call } from '@redux-saga/core/effects';
import { getClockInSuccess, getClockInError } from '../action';
import Api from '../../components/common/Api';
import axiosCall from '../apiServices';
import { userService } from '../../services';

export function* punchTime(action) {
  try {
    const token = userService.getToken();
    const url = `${Api.clockIn}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };
    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getClockInSuccess({
        response: response.data.data,
        message: response.data.message,
      }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        punchTime(action);
      });
    } else {
      yield put(getClockInError({ error: response.data.message }));
    }
  } catch (error) {
    yield put(getClockInError({ error: 'Invalid  details' }));
  }
}

export default punchTime;
