/* eslint-disable quotes */
import { put, call } from "redux-saga/effects";
import { getBusinessUnitByDivisionSuccess, getBusinessUnitByDivisionError } from "../action";
import axiosCall from "../apiServices";
import Api from "../../components/common/Api";
import { userService } from "../../services";

// eslint-disable-next-line import/prefer-default-export
export function* getBusinessByDivision(action) {
  try {
    const url = Api.manageEmp.getbusinessunitbydivisionid;
    const token = userService.getToken();
    const headers = {
      token: `${token}`,
      "Content-Type": "application/json",
    };

    const response = yield call(axiosCall, "POST", url, action.payload, {
      headers,
    });

    if (response.data.statusCode === 200) {
      yield put(getBusinessUnitByDivisionSuccess([...response.data.data]));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        getBusinessByDivision(action);
      });
    } else {
      yield put(getBusinessUnitByDivisionError({ error: { ...response.data.error } }));
    }
  } catch (error) {
    yield put(getBusinessUnitByDivisionError({ error: error.message }));
    // eslint-disable-next-line indent
    }
}
