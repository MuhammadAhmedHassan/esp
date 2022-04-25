import { put, call } from "redux-saga/effects";
import { downloadLeaveReportSuccess, downloadLeaveReportError } from "../action";
import axiosCall from "../apiServices";
import Api from "../../components/common/Api";
import { userService } from "../../services";


export function* downloadLeaveReport(action) {
    try {
        const url = `${Api.leaveBalanceReport.downloadLeaveReport}`;
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
        link.download = "LeaveBalanceReport.xlsx";
        link.click();

        if (response.data) {
            yield put(downloadLeaveReportSuccess([...response.data.data]));
        } else {
            yield put(downloadLeaveReportError({ error: { ...response.data.error } }));
        }

    } catch (error) {
        yield put(downloadLeaveReportError({ error: error.message }));
    }
}

