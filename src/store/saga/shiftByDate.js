/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getShiftByDateSuccess, getShiftByDateError } from '../action';
import Api from '../../components/common/Api';
import { userService } from '../../services';
import axiosCall from '../apiServices';

export function* getShiftByDates(action) {
  try {
    const payload = {
      userId: action.payload.userId,
      date: action.payload.date,
      selectedShiftId: action.payload.selectedShiftId,
    };
    const token = userService.getToken();
    const id = userService.getUserId();
    const url = `${Api.getUserShiftByDate}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };
    const response = yield call(axiosCall, 'POST', url, payload, {
      headers,
    });
    if (response.data.statusCode === 200) {
      const list = {};
      if (action.payload.requestType === 'currentUserDate') {
        list.currentUserList = response.data.data;
      } else if (action.payload.requestType === 'targetUserDate') {
        list.targetUserList = response.data.data;
      }

      yield put(getShiftByDateSuccess({ ...list }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getShiftByDates(action);
      });
    } else {
      yield put(getShiftByDateError({ error: 'Invalid  details' }));
    }
  } catch (error) {
    yield put(getShiftByDateError({ error: 'Invalid  details' }));
  }
}
