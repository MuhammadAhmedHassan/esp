/* eslint-disable import/prefer-default-export */
/* eslint-disable quotes */
import { put, call } from "@redux-saga/core/effects";
import { overTimeSuccess, overTimeError } from "../action";
import Api from "../../components/common/Api";
import { userService } from "../../services";
import axiosCall from "../apiServices";

export function* overTime(action) {
  try {
    const token = userService.getToken();
    const url = `${Api.overTime.insert}`;
    const headers = {
      token: `${token}`,
      "Content-Type": "application/json",
    };
    const response = yield call(axiosCall, "POST", url, action.payload, {
      headers,
    });
    if (response.data.statusCode === 200) {
      yield put(overTimeSuccess({
        response: response.data.data,
        message: response.data.message,

      }));
    } else if (response.data.statusCode === 401) {
      const refreshToken = userService.getRefreshToken();
      refreshToken.then(() => {
        overTime(action);
      });
    } else {
      yield put(overTimeError({ error: response.data.message }));
    }
  } catch (error) {
    yield put(overTimeError({ error: "Invalid  details" }));
  }
}
