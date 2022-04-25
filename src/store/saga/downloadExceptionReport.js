import { put, call } from "redux-saga/effects";
import { downloadExceptionReportSuccess, downloadExceptionReportError } from "../action";
import axiosCall from "../apiServices";
import Api from "../../components/common/Api";
import { userService } from "../../services";


export function* downloadExceptionReportSaga(action) {
    try {
        const url = `${Api.exceptionRequest.exception.downloadException}`;
        const token = userService.getToken();
        const headers = {
            token: `${token}`,
            "Content-Type": "application/json",
        };
        const response = yield call(axiosCall, "POST", url, action.payload, {
            headers, responseType: 'blob',
        });
        
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "ExceptionReport.xlsx";
        link.click();

        if (response.data) {
            yield put(downloadExceptionReportSuccess([...response.data.data]));
        } else {
            yield put(downloadExceptionReportError({ error: { ...response.data.error } }));
        }

    } catch (error) {
        yield put(downloadExceptionReportError({ error: error.message }));
    }
}

