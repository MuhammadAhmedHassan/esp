/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getProfileDataError, getProfileDataSuccess } from '../action';
import Api from '../../components/common/Api';
import { userService } from '../../services';
import axiosCall from '../apiServices';

export function* getUserProfileData(action) {
  try {
    const token = userService.getToken();
    const id = userService.getUserId();
    const email = userService.getUserEmail();
    const url = `${Api.userDetail}`;
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });
    if (response.data.statusCode === 200) {
      yield put(getProfileDataSuccess({ response: response.data.data }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getUserProfileData(action);
      });
    } else {
      yield put(getProfileDataError({ error: 'Invalid  details' }));
    }
  } catch (error) {
    yield put(getProfileDataError({ error: 'Invalid  details' }));
  }
}
