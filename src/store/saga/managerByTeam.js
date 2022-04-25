/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getManagerByTeamSuccess, getManagerByTeamError } from '../action';
import axiosCall from '../apiServices';
import Api from '../../components/common/Api';
import { userService } from '../../services';

export function* getManagerByTeam(action) {
  try {
    const url = Api.manageEmp.getmanagersbyteamid;
    const token = userService.getToken();
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getManagerByTeamSuccess([...response.data.data]));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getManagerByTeam(action);
      });
    } else {
      yield put(getManagerByTeamError({ error: { ...response.data.error } }));
    }
  } catch (error) {
    yield put(getManagerByTeamError({ error: error.message }));
  }
}
