/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { swapShiftSuccess, swapShiftError } from '../action';
import Api from '../../components/common/Api';
import { userService } from '../../services';
import axiosCall from '../apiServices';

export function* swapShift(action) {
  try {
    const token = userService.getToken();
    const id = userService.getUserId();
    const url = `${Api.updateShiftSwap}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(swapShiftSuccess({ response: response.data.data, message: response.data.message }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        swapShift(action);
      });
    } else {
      yield put(swapShiftError({ error: response.data.message }));
    }
  } catch (error) {
    yield put(swapShiftError({ error: 'Invalid  details' }));
  }
}
