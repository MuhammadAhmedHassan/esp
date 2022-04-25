/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getSwapTimeSuccess, getSwapTimeError } from '../action';
import Api from '../../components/common/Api';
import { userService } from '../../services';
import axiosCall from '../apiServices';

export function* getSwapTime(action) {
  try {
    const token = userService.getToken();
    const id = userService.getUserId();
    const url = `${Api.getSwapRequest}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getSwapTimeSuccess({ response: response.data.data }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getSwapTime(action);
      });
    } else {
      yield put(getSwapTimeError({ error: 'Invalid  details' }));
    }
  } catch (error) {
    yield put(getSwapTimeError({ error: 'Invalid  details' }));
  }
}
