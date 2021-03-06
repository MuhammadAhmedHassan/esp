import { all, takeLatest } from 'redux-saga/effects';
import * as actions from '../action/actionTypes';
import { getUserTeamMates } from './teamMates';
import { getHoursReport } from './hoursWorked';
import { downloadHoursReport } from './downloadHoursWorked';
import { getShiftByDates } from './shiftByDate';
import { swapShift } from './swapShift';
import { getUserProfileData } from './profileData';
import { overTime } from './overTime';
import { punchTime } from './punchTime';
import { getUserTimer } from './userTimer';
import { getOpenShiftData } from './openShift';
import { getSwapTime } from './swapTime';
import { getScheduleShift } from './scheduleData';
import { getCountryList } from './allCountryList';
import { getStatesByCountry } from './statesByCountry';
import { getCityByState } from './cityByState';
import { getDivisionsByOrganisation } from './divisionsByOrganisation';
import { getBusinessByDivision } from './businessUnitByDivision';
import { getDepartmentByBusiness } from './departmentByBusiness';
import { getTeamsByDepartment } from './teamsByDepartment';
import { getManagerByTeam } from './managerByTeam';
import { getWorkLocation } from './workLocation';
import { getUserByManager } from './userByManager';
import { getTimeSheet } from './timeSheet';
import { deleteTimeSheet } from './deleteTimeSheet';
import { downloadTimeSheet } from './downloadTimeSheet';
import { getExceptionReport } from './exceptionReport';
import { downloadExceptionReportSaga } from './downloadExceptionReport';
import { getExceptionByShiftSaga } from './fetchExceptionByShift';
import { fetchAllExceptionSaga } from './fetchAllException';
import { overTimeReportSaga } from './overTimeReport';
import { downloadOTReportSaga } from './downloadOverTimeManager';
import { leaveBalanceReportSaga } from './leaveBalanceReport';
import { downloadLeaveReport } from './downloadLeaveReport';
import { allLeavesTypesSaga } from './fetchAllLeaves';

function* watchAllSaga() {
  yield takeLatest(actions.FETCH_TEAM_MATES_REQUEST, getUserTeamMates);
  yield takeLatest(actions.FETCH_SHIFT_BY_DATE_REQUEST, getShiftByDates);
  yield takeLatest(actions.SWAP_SHIFT_REQUEST, swapShift);
  yield takeLatest(actions.FETCH_PROFILE_DATA_REQUEST, getUserProfileData);
  yield takeLatest(actions.OVER_TIME_REQUEST, overTime);
  yield takeLatest(actions.PUNCH_TIME_REQUEST, punchTime);
  yield takeLatest(actions.USER_TIMER_REQUEST, getUserTimer);
  yield takeLatest(actions.OPEN_SHIFT_REQUEST, getOpenShiftData);
  yield takeLatest(actions.SWAP_TIME_REQUEST, getSwapTime);
  yield takeLatest(actions.SCHEDULE_REQUEST, getScheduleShift);
  yield takeLatest(actions.FETCH_ALL_COUNTRY_REQUEST, getCountryList);
  yield takeLatest(actions.FETCH_STATES_BY_COUNTRYID_REQUEST, getStatesByCountry);
  yield takeLatest(actions.FETCH_CITY_BY_STATEID_REQUEST, getCityByState);
  yield takeLatest(actions.FETCH_DIVISIONS_BY_ORGANISATIONID_REQUEST, getDivisionsByOrganisation);
  yield takeLatest(actions.FETCH_BUSINESSUNIT_BY_DIVISIONS_REQUEST, getBusinessByDivision);
  yield takeLatest(actions.FETCH_DEPARTMENTS_BY_BUSINESSUNIT_REQUEST, getDepartmentByBusiness);
  yield takeLatest(actions.FETCH_TEAMS_BY_DEPARTMENT_REQUEST, getTeamsByDepartment);
  yield takeLatest(actions.FETCH_MANAGER_BY_TEAM_REQUEST, getManagerByTeam);
  yield takeLatest(actions.FETCH_WORK_LOCATION_REQUEST, getWorkLocation);
  yield takeLatest(actions.FETCH_USER_BY_MANAGER_REQUEST, getUserByManager);
  yield takeLatest(actions.FETCH_TIMESHEET_REQUEST, getTimeSheet);
  yield takeLatest(actions.DELETE_TIMESHEET_REQUEST, deleteTimeSheet);
  yield takeLatest(actions.DOWNLOAD_TIMESHEET_REQUEST, downloadTimeSheet);
  yield takeLatest(actions.FETCH_HOURS_WORKED_REQUEST, getHoursReport);
  yield takeLatest(actions.DOWNLOAD_HOURS_WORKED_REQUEST, downloadHoursReport);
  yield takeLatest(actions.FETCH_EXCEPTION_REPORT_REQUEST, getExceptionReport);
  yield takeLatest(actions.DOWNLOAD_EXCEPTION_REPORT_REQUEST, downloadExceptionReportSaga);
  yield takeLatest(actions.FETCH_MULTIPLE_EXCEPTION_BY_SHIFT_REQUEST, getExceptionByShiftSaga);
  yield takeLatest(actions.FETCH_ALL_EXCEPTION_REQUEST, fetchAllExceptionSaga);
  yield takeLatest(actions.FETCH_OVERTIME_REPORT_REQUEST, overTimeReportSaga);
  yield takeLatest(actions.DOWNLOAD_OVERTIME_REPORT_REQUEST, downloadOTReportSaga);
  yield takeLatest(actions.FETCH_LEAVE_BALANCE_REPORT_REQUEST, leaveBalanceReportSaga);
  yield takeLatest(actions.DOWNLOAD_LEAVE_REPORT_REQUEST, downloadLeaveReport);
  yield takeLatest(actions.FETCH_LEAVE_TYPES_REQUEST, allLeavesTypesSaga);
}
export default function* rootSaga() {
  yield all([watchAllSaga()]);
}
