/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getScheduleSuccess, getScheduleError } from '../action';
import Api from '../../components/common/Api';
import { userService } from '../../services';
import axiosCall from '../apiServices';

export function* getScheduleShift(action) {
  try {
    const token = userService.getToken();
    const id = userService.getUserId();
    const url = `${Api.shiftSearchEmp}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getScheduleSuccess({ response: response.data.data }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getScheduleShift(action);
      });
    } else {
      yield put(getScheduleError({ error: 'Invalid  details' }));
    }
  } catch (error) {
    yield put(getScheduleError({ error: 'Invalid  details' }));
  }
}
