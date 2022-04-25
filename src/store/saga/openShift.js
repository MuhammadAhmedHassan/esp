/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getOpenShiftError, getOpenShiftSuccess } from '../action';
import Api from '../../components/common/Api';
import { userService } from '../../services';
import axiosCall from '../apiServices';

export function* getOpenShiftData(action) {
  try {
    const token = userService.getToken();
    const url = `${Api.shift.openShiftSearch}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });
    if (response.data.statusCode === 200) {
      yield put(getOpenShiftSuccess({ response: response.data.data.shifts }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getOpenShiftData(action);
      });
    } else {
      yield put(getOpenShiftError({ error: 'Invalid  details' }));
    }
  } catch (error) {
    yield put(getOpenShiftError({ error: 'Invalid  details' }));
  }
}
