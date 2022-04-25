/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getTeamMatesSuccess, getTeamMatesError } from '../action';
import Api from '../../components/common/Api';
import { userService } from '../../services';
import axiosCall from '../apiServices';

export function* getUserTeamMates(action) {
  try {
    const token = userService.getToken();
    const id = userService.getUserId();
    const url = `${Api.getTeamMates}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getTeamMatesSuccess({ response: response.data.data }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getUserTeamMates(action);
      });
    } else {
      yield put(getTeamMatesError({ error: 'Invalid  details' }));
    }
  } catch (error) {
    yield put(getTeamMatesError({ error: 'Invalid  details' }));
  }
}
