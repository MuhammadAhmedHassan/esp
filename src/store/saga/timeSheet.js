/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getTimeSheetSuccess, getTimeSheetError } from '../action';
import Api from '../../components/common/Api';
import { userService } from '../../services';
import axiosCall from '../apiServices';

export function* getTimeSheet(action) {
  try {
    const token = userService.getToken();
    const id = userService.getUserId();
    const url = `${Api.timesheet.search}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };
    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getTimeSheetSuccess({ response: response.data }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getTimeSheet(action);
      });
    } else {
      yield put(getTimeSheetError({ error: 'Invalid  details' }));
    }
  } catch (error) {
    yield put(getTimeSheetError({ error: 'Invalid  details' }));
  }
}
