/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getDepartmentByBusinessUnitSuccess, getDepartmentByBusinessUnitError } from '../action';
import axiosCall from '../apiServices';
import Api from '../../components/common/Api';
import { userService } from '../../services';

export function* getDepartmentByBusiness(action) {
  try {
    const url = Api.manageEmp.getdepartmentbybusinessunitid;
    const token = userService.getToken();
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getDepartmentByBusinessUnitSuccess([...response.data.data]));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getDepartmentByBusiness(action);
      });
    } else {
      yield put(getDepartmentByBusinessUnitError({ error: { ...response.data.error } }));
    }
  } catch (error) {
    yield put(getDepartmentByBusinessUnitError({ error: error.message }));
  }
}
