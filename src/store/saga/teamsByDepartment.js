/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getTeamsByDepartmentSuccess, getTeamsByDepartmentError } from '../action';
import axiosCall from '../apiServices';
import Api from '../../components/common/Api';
import { userService } from '../../services';

export function* getTeamsByDepartment(action) {
  try {
    const url = Api.manageEmp.getteamsbydepartmentid;
    const token = userService.getToken();
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getTeamsByDepartmentSuccess([...response.data.data]));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getTeamsByDepartment(action);
      });
    } else {
      yield put(getTeamsByDepartmentError({ error: { ...response.data.error } }));
    }
  } catch (error) {
    yield put(getTeamsByDepartmentError({ error: error.message }));
  }
}
