/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getUserTimerSuccess, getUserTimerError } from '../action';
import Api from '../../components/common/Api';
import { userService } from '../../services';
import axiosCall from '../apiServices';

export function* getUserTimer(action) {
  try {
    const token = userService.getToken();
    const url = `${Api.getClockInOutStatus}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });
    if (response.data.statusCode === 200) {
      yield put(getUserTimerSuccess({ response: response.data.data }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getUserTimer(action);
      });
    } else {
      yield put(getUserTimerError({ error: 'Invalid  details' }));
    }
  } catch (error) {
    yield put(getUserTimerError({ error: 'Invalid  details' }));
  }
}
