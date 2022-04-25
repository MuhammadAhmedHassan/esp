/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { deleteTimeSheetSuccess, deleteTimeSheetError } from '../action';
import axiosCall from '../apiServices';
import Api from '../../components/common/Api';
import { userService } from '../../services';

export function* deleteTimeSheet(action) {
  try {
    const url = Api.timesheet.delete;
    const token = userService.getToken();
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(deleteTimeSheetSuccess([...response.data.data]));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        deleteTimeSheet(action);
      });
    } else {
      yield put(deleteTimeSheetError({ error: { ...response.data.error } }));
    }
  } catch (error) {
    yield put(deleteTimeSheetError({ error: error.message }));
  }
}
