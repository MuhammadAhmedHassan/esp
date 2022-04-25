/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import { put, call } from 'redux-saga/effects';
import { getCountryListSuccess, getCountryListError } from '../action';
import axiosCall from '../apiServices';
import Api from '../../components/common/Api';
import { userService } from '../../services';

export function* getCountryList(action) {
  try {
    const url = Api.manageEmp.getallcountries;
    const token = userService.getToken();
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getCountryListSuccess([...response.data.data]));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getCountryList(action);
      });
    } else {
      yield put(getCountryListError({ error: { ...response.data.error } }));
    }
  } catch (error) {
    yield put(getCountryListError({ error: error.message }));
  }
}
