/* eslint-disable import/prefer-default-export */
import { put, call } from 'redux-saga/effects';
import { getDivisionsByOrganisationSuccess, getDivisionsByOrganisationError } from '../action';
import axiosCall from '../apiServices';
import Api from '../../components/common/Api';
import { userService } from '../../services';

export function* getDivisionsByOrganisation(action) {
  try {
    const url = Api.manageEmp.getdivisionsbyorganisationid;
    const token = userService.getToken();
    const headers = {
      token: `${token}`,
      'Content-Type': 'application/json',
    };

    const response = yield call(axiosCall, 'POST', url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getDivisionsByOrganisationSuccess([...response.data.data]));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getDivisionsByOrganisation(action);
      });
    } else {
      yield put(getDivisionsByOrganisationError({ error: { ...response.data.error } }));
    }
  } catch (error) {
    yield put(getDivisionsByOrganisationError({ error: error.message }));
  }
}
