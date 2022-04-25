/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getStatesByCountryIdSuccess, getStatesByCountryIdError } from '../action';
import axiosCall from '../apiServices';
import Api from '../../components/common/Api';
import { userService } from '../../services';

export function* getStatesByCountry(action) {
  try {
    const url = Api.manageEmp.getstatesbycountryid;
    const token = userService.getToken();
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getStatesByCountryIdSuccess([...response.data.data]));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getStatesByCountry(action);
      });
    } else {
      yield put(getStatesByCountryIdError({ error: { ...response.data.error } }));
    }
  } catch (error) {
    yield put(getStatesByCountryIdError({ error: error.message }));
  }
}
