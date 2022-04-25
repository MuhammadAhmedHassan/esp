import * as actionTypes from './actionTypes';

const userLoggedin = users => ({
  type: 'FETCH_REMOTE_DATA_SUCCESS',
  payload: { users },
});

export default userLoggedin;


export const getTeamMatesRequest = id => ({
  type: actionTypes.FETCH_TEAM_MATES_REQUEST,
  payload: { id },
});

export const getTeamMatesSuccess = teamsList => ({
  type: actionTypes.FETCH_TEAM_MATES_SUCCESS,
  payload: { teamsList },
});

export const getTeamMatesError = error => ({
  type: actionTypes.FETCH_TEAM_MATES_ERROR,
  payload: { error },
});

export const getShiftByDateRequest = ({
  userId, date, requestType, selectedShiftId,
}) => ({
  type: actionTypes.FETCH_SHIFT_BY_DATE_REQUEST,
  payload: {
    userId, date, requestType, selectedShiftId,
  },
});

export const getShiftByDateSuccess = shiftsList => ({
  type: actionTypes.FETCH_SHIFT_BY_DATE_SUCCESS,
  payload: { shiftsList },
});

export const getShiftByDateError = error => ({
  type: actionTypes.FETCH_SHIFT_BY_DATE_ERROR,
  payload: { error },
});


export const swapShiftRequest = ({
  languageId, requestShiftId, requestUserId, targetShiftId, targetShiftUserId, requestNotes,
}) => ({
  type: actionTypes.SWAP_SHIFT_REQUEST,
  payload: {
    languageId,
    requestShiftId,
    requestUserId,
    targetShiftId,
    targetShiftUserId,
    requestNotes,
  },
});

export const swapShiftSuccess = swapShiftDetails => ({
  type: actionTypes.SWAP_SHIFT_SUCCESS,
  payload: { swapShiftDetails },
});

export const swapShiftError = error => ({
  type: actionTypes.SWAP_SHIFT_ERROR,
  payload: {
    error,
  },
});

export const getCountryListRequest = ({ id, languageId, showUnpublished }) => ({
  type: actionTypes.FETCH_ALL_COUNTRY_REQUEST,
  payload: {
    id,
    languageId,
    showUnpublished,
  },
});

export const getCountryListSuccess = countryList => ({
  type: actionTypes.FETCH_ALL_COUNTRY_SUCCESS,
  payload: {
    countryList,
  },
});

export const getCountryListError = error => ({
  type: actionTypes.FETCH_ALL_COUNTRY_ERROR,
  payload: {
    error,
  },
});

export const getStatesByCountryIdRequest = ({ countryId }) => ({
  type: actionTypes.FETCH_STATES_BY_COUNTRYID_REQUEST,
  payload: {
    id: countryId,
  },
});

export const getStatesByCountryIdSuccess = statesList => ({
  type: actionTypes.FETCH_STATES_BY_COUNTRYID_SUCCESS,
  payload: {
    statesList,
  },
});

export const getStatesByCountryIdError = error => ({
  type: actionTypes.FETCH_STATES_BY_COUNTRYID_ERROR,
  payload: {
    error,
  },
});


export const getCityByStateIdRequest = ({ stateId }) => ({
  type: actionTypes.FETCH_CITY_BY_STATEID_REQUEST,
  payload: {
    id: stateId,
  },
});

export const getCityByStateIdSuccess = cityList => ({
  type: actionTypes.FETCH_CITY_BY_STATEID_SUCCESS,
  payload: {
    cityList,
  },
});

export const getCityByStateIdError = error => ({
  type: actionTypes.FETCH_CITY_BY_STATEID_ERROR,
  payload: {
    error,
  },
});

export const getDivisionsByOrganisationRequest = ({ organisationId, languageId }) => ({
  type: actionTypes.FETCH_DIVISIONS_BY_ORGANISATIONID_REQUEST,
  payload: {
    id: organisationId,
    languageId,
  },
});

export const getDivisionsByOrganisationSuccess = divisionsList => ({
  type: actionTypes.FETCH_DIVISIONS_BY_ORGANISATIONID_SUCCESS,
  payload: {
    divisionsList,
  },
});

export const getDivisionsByOrganisationError = error => ({
  type: actionTypes.FETCH_DIVISIONS_BY_ORGANISATIONID_ERROR,
  payload: {
    error,
  },
});

export const getBusinessUnitByDivisionRequest = ({ divisionsId, languageId }) => ({
  type: actionTypes.FETCH_BUSINESSUNIT_BY_DIVISIONS_REQUEST,
  payload: {
    id: divisionsId,
    languageId,
  },
});

export const getBusinessUnitByDivisionSuccess = businessUnitList => ({
  type: actionTypes.FETCH_BUSINESSUNIT_BY_DIVISIONS_SUCCESS,
  payload: {
    businessUnitList,
  },
});

export const getBusinessUnitByDivisionError = error => ({
  type: actionTypes.FETCH_BUSINESSUNIT_BY_DIVISIONS_ERROR,
  payload: {
    error,
  },
});


export const getDepartmentByBusinessUnitRequest = ({ businessUnitId }) => ({
  type: actionTypes.FETCH_DEPARTMENTS_BY_BUSINESSUNIT_REQUEST,
  payload: {
    id: businessUnitId,
  },
});


export const getDepartmentByBusinessUnitSuccess = departmentList => ({
  type: actionTypes.FETCH_DEPARTMENTS_BY_BUSINESSUNIT_SUCCESS,
  payload: {
    departmentList,
  },
});

export const getDepartmentByBusinessUnitError = error => ({
  type: actionTypes.FETCH_DIVISIONS_BY_ORGANISATIONID_ERROR,
  payload: {
    error,
  },
});

export const getTeamsByDepartmentRequest = ({ departmentId }) => ({
  type: actionTypes.FETCH_TEAMS_BY_DEPARTMENT_REQUEST,
  payload: {
    id: departmentId,
  },
});

export const getTeamsByDepartmentSuccess = teamsList => ({
  type: actionTypes.FETCH_TEAMS_BY_DEPARTMENT_SUCCESS,
  payload: {
    teamsList,
  },
});

export const getTeamsByDepartmentError = error => ({
  type: actionTypes.FETCH_TEAMS_BY_DEPARTMENT_ERROR,
  payload: {
    error,
  },
});

export const getManagerByTeamRequest = ({ teamId }) => ({
  type: actionTypes.FETCH_MANAGER_BY_TEAM_REQUEST,
  payload: {
    id: teamId,
  },
});

export const getManagerByTeamSuccess = managerList => ({
  type: actionTypes.FETCH_MANAGER_BY_TEAM_SUCCESS,
  payload: {
    managerList,
  },
});

export const getManagerByTeamError = error => ({
  type: actionTypes.FETCH_MANAGER_BY_TEAM_ERROR,
  payload: {
    error,
  },
});

export const getWorkLocationRequest = ({ cityId, stateId, languageId }) => ({
  type: actionTypes.FETCH_WORK_LOCATION_REQUEST,
  payload: {
    id: cityId,
    stateId,
    languageId,
  },
});

export const getWorkLocationSuccess = workLocationList => ({
  type: actionTypes.FETCH_WORK_LOCATION_SUCCESS,
  payload: {
    workLocationList,
  },
});

export const getWorkLocationError = error => ({
  type: actionTypes.FETCH_WORK_LOCATION_ERROR,
  payload: {
    error,
  },
});

export const getUserByManagerRequest = ({ managerId }) => ({
  type: actionTypes.FETCH_USER_BY_MANAGER_REQUEST,
  payload: {
    id: managerId,
  },
});

export const getUserByManagerSuccess = userList => ({
  type: actionTypes.FETCH_USER_BY_MANAGER_SUCCESS,
  payload: {
    userList,
  },
});

export const getUserByManagerError = error => ({
  type: actionTypes.FETCH_USER_BY_MANAGER_ERROR,
  payload: {
    error,
  },
});

export const getTimeSheetRequest = payload => ({
  type: actionTypes.FETCH_TIMESHEET_REQUEST,
  payload: {
    ...payload,
  },
});

export const getTimeSheetSuccess = timeSheet => ({
  type: actionTypes.FETCH_TIMESHEET_SUCCESS,
  payload: {
    timeSheet,
  },
});

export const getTimeSheetError = error => ({
  type: actionTypes.FETCH_TIMESHEET_ERROR,
  payload: {
    error,
  },
});


export const deleteTimeSheetRequest = payload => ({
  type: actionTypes.DELETE_TIMESHEET_REQUEST,
  payload: {
    ...payload,
  },
});


export const deleteTimeSheetSuccess = result => ({
  type: actionTypes.DELETE_TIMESHEET_SUCCESS,
  payload: {
    ...result,
  },
});

export const deleteTimeSheetError = error => ({
  type: actionTypes.DELETE_TIMESHEET_ERROR,
  payload: {
    ...error,
  },
});

export const downloadTimeSheetRequest = payload => ({
  type: actionTypes.DOWNLOAD_TIMESHEET_REQUEST,
  payload: {
    ...payload,
  },
});

export const downloadTimeSheetSuccess = details => ({
  type: actionTypes.DOWNLOAD_TIMESHEET_SUCCESS,
  payload: {
    details,
  },
});

export const downloadTimeSheetError = error => ({
  type: actionTypes.DOWNLOAD_TIMESHEET_ERROR,
  payload: {
    error,
  },
});

export const getProfileDataRequest = email => ({
  type: actionTypes.FETCH_PROFILE_DATA_REQUEST,
  payload: { email },
});

export const getProfileDataSuccess = profileData => ({
  type: actionTypes.FETCH_PROFILE_DATA_SUCCESS,
  payload: { profileData },
});

export const getProfileDataError = error => ({
  type: actionTypes.FETCH_PROFILE_DATA_ERROR,
  payload: { error },
});

export const overTimeRequest = ({
  languageId,
  userId,
  shiftRecurrenceId,
  overTimeInHours,
  overTimeInMinutes,
  userNotes,

}) => ({
  type: actionTypes.OVER_TIME_REQUEST,
  payload: {
    languageId,
    userId,
    shiftRecurrenceId,
    overTimeInHours,
    overTimeInMinutes,
    userNotes,
  },
});

export const overTimeSuccess = overTimeDetails => ({
  type: actionTypes.OVER_TIME_SUCCESS,
  payload: { overTimeDetails },
});

export const overTimeError = error => ({
  type: actionTypes.OVER_TIME_ERROR,
  payload: { error },
});

export const getClockInRequest = ({
  languageId,
  userId,
  isClockIn,
  sourceGuid,
  geoCoordinates,
  isForced,

}) => ({
  type: actionTypes.PUNCH_TIME_REQUEST,
  payload: {
    languageId,
    userId,
    isClockIn,
    sourceGuid,
    geoCoordinates,
    isForced,
  },
});

export const getClockInSuccess = clockInDetails => ({
  type: actionTypes.PUNCH_TIME_SUCCESS,
  payload: { clockInDetails },
});

export const getClockInError = error => ({
  type: actionTypes.PUNCH_TIME_ERROR,
  payload: { error },
});

export const getUserTimerRequest = id => ({
  type: actionTypes.USER_TIMER_REQUEST,
  payload: { id },

});

export const getUserTimerSuccess = timerList => ({
  type: actionTypes.USER_TIMER_SUCCESS,
  payload: { timerList },
});

export const getUserTimerError = error => ({
  type: actionTypes.USER_TIMER_ERROR,
  payload: { error },
});

export const getSourceGuidRequest = ({
  languageId,
  userId,
}) => ({
  type: actionTypes.SOURCEGUID_REQUEST,
  payload: {
    languageId,
    userId,
  },
});

export const getSourceGuidSuccess = sourceGuidDetails => ({
  type: actionTypes.SOURCEGUID_SUCCESS,
  payload: { sourceGuidDetails },
});

export const getSourceGuidError = error => ({
  type: actionTypes.SOURCEGUID_ERROR,
  payload: { error },
});

export const getOpenShiftRequest = ({
  languageId,
  startDateTime,
  endDateTime,
  requestByUserId,
  userIds,
}) => ({
  type: actionTypes.OPEN_SHIFT_REQUEST,
  payload: {
    languageId,
    startDateTime,
    endDateTime,
    requestByUserId,
    userIds,
  },
});

export const getOpenShiftSuccess = openShiftList => ({
  type: actionTypes.OPEN_SHIFT_SUCCESS,
  payload: { openShiftList },

});

export const getOpenShiftError = error => ({
  type: actionTypes.OPEN_SHIFT_ERROR,
  payload: { error },
});

export const getSwapTimeRequest = ({
  languageId,
  pageIndex,
  pageSize,
  id,
  requestTypeId,
  searchStatusId,
}) => ({
  type: actionTypes.SWAP_TIME_REQUEST,
  payload: {
    languageId,
    pageIndex,
    pageSize,
    id,
    requestTypeId,
    searchStatusId,
  },
});

export const getSwapTimeSuccess = swapTimedata => ({
  type: actionTypes.SWAP_TIME_SUCCESS,
  payload: { swapTimedata },
});

export const getSwapTimeError = error => ({
  type: actionTypes.SWAP_TIME_ERROR,
  payload: { error },
});

export const getScheduleRequest = ({
  
  id,
  languageId,
  offset,
  isActive,
  totalRecords,
  pageIndex,
  pageSize,
}) => ({
  type: actionTypes.SCHEDULE_REQUEST,
  payload: {
    id,
    languageId,
    offset,
    isActive,
    totalRecords,
    pageIndex,
    pageSize,
  },
});

export const getScheduleSuccess = scheduleDataList => ({
  type: actionTypes.SCHEDULE_SUCCESS,
  payload: { scheduleDataList },

});

export const getScheduleError = error => ({
  type: actionTypes.SCHEDULE_ERROR,
  payload: { error },
});

export const getHoursReportRequest = payload => ({
  type: actionTypes.FETCH_HOURS_WORKED_REQUEST,
  payload: {
    ...payload,
  },
});

export const getHoursReportSuccess = success => ({
  type: actionTypes.FETCH_HOURS_WORKED_SUCCESS,
  payload: {
    ...success,
  },
});

export const getHoursReportError = error => ({
  type: actionTypes.FETCH_HOURS_WORKED_SUCCESS,
  payload: {
    error,
  },
});

export const downloadHoursReportRequest = payload => ({
  type: actionTypes.DOWNLOAD_HOURS_WORKED_REQUEST,
  payload: {
    ...payload,
  },
});

export const downloadHoursReportSuccess = success => ({
  type: actionTypes.DOWNLOAD_HOURS_WORKED_SUCCESS,
  payload: {
    ...success,
  },
});

export const downloadHoursReportError = error => ({
  type: actionTypes.DOWNLOAD_HOURS_WORKED_ERROR,
  payload: {
    error,
  },
});


export const getExceptionReportRequest = payload => ({
  type: actionTypes.FETCH_EXCEPTION_REPORT_REQUEST,
  payload: {
    ...payload,
  },
});

export const getExceptionReportSuccess = success => ({
  type: actionTypes.FETCH_EXCEPTION_REPORT_SUCCESS,
  payload: {
    ...success,
  },
});

export const getExceptionReportError = error => ({
  type: actionTypes.FETCH_EXCEPTION_REPORT_ERROR,
  payload: {
    error,
  },
});

export const downloadExceptionReportRequest = payload => ({
  type: actionTypes.DOWNLOAD_EXCEPTION_REPORT_REQUEST,
  payload: {
    ...payload,
  },
});

export const downloadExceptionReportSuccess = success => ({
  type: actionTypes.DOWNLOAD_EXCEPTION_REPORT_SUCCESS,
  payload: {
    ...success,
  },
});

export const downloadExceptionReportError = error => ({
  type: actionTypes.DOWNLOAD_EXCEPTION_REPORT_ERROR,
  payload: {
    error,
  },
});

export const fetchExceptionByShiftRequest = payload => ({
  type: actionTypes.FETCH_MULTIPLE_EXCEPTION_BY_SHIFT_REQUEST,
  payload: {
    ...payload,
  },
});

export const fetchExceptionByShiftSuccess = success => ({
  type: actionTypes.FETCH_MULTIPLE_EXCEPTION_BY_SHIFT_SUCCESS,
  payload: {
    ...success,
  },
});

export const fetchExceptionByShiftError = error => ({
  type: actionTypes.FETCH_MULTIPLE_EXCEPTION_BY_SHIFT_ERROR,
  payload: {
    error,
  },
});

export const fetchAllExceptionRequest = payload => ({
  type: actionTypes.FETCH_ALL_EXCEPTION_REQUEST,
  payload: {
    ...payload,
  },
});

export const fetchAllExceptionSuccess = success => ({
  type: actionTypes.FETCH_ALL_EXCEPTION_SUCCESS,
  payload: {
    ...success,
  },
});

export const fetchAllExceptionError = error => ({
  type: actionTypes.FETCH_ALL_EXCEPTION_ERROR,
  payload: {
    error,
  },
});

export const getOverTimeReportRequest = payload => ({
  type: actionTypes.FETCH_OVERTIME_REPORT_REQUEST,
  payload: {
    ...payload,
  },
});

export const getOverTimeReportSuccess = success => ({
  type: actionTypes.FETCH_OVERTIME_REPORT_SUCCESS,
  payload: {
    ...success,
  },
});

export const getOverTimeReportError = error => ({
  type: actionTypes.FETCH_OVERTIME_REPORT_ERROR,
  payload: {
    error,
  },
});

export const downloadOverTimeReportRequest = payload => ({
  type: actionTypes.DOWNLOAD_OVERTIME_REPORT_REQUEST,
  payload: {
    ...payload,
  },
});

export const downloadOverTimeReportSuccess = success => ({
  type: actionTypes.DOWNLOAD_OVERTIME_REPORT_SUCCESS,
  payload: {
    ...success,
  },
});

export const downloadOverTimeReportError = error => ({
  type: actionTypes.DOWNLOAD_OVERTIME_REPORT_ERROR,
  payload: {
    error,
  },
});


export const getLeaveBalanceReportRequest = payload => ({
  type: actionTypes.FETCH_LEAVE_BALANCE_REPORT_REQUEST,
  payload: {
    ...payload,
  },
});

export const getLeaveBalanceReportSuccess = success => ({
  type: actionTypes.FETCH_LEAVE_BALANCE_REPORT_SUCCESS,
  payload: {
    ...success,
  },
});

export const getLeaveBalanceReportError = error => ({
  type: actionTypes.FETCH_LEAVE_BALANCE_REPORT_ERROR,
  payload: {
    error,
  },
});

export const downloadLeaveReportRequest = payload => ({
  type: actionTypes.DOWNLOAD_LEAVE_REPORT_REQUEST,
  payload: {
    ...payload,
  },
});

export const downloadLeaveReportSuccess = success => ({
  type: actionTypes.DOWNLOAD_LEAVE_REPORT_SUCCESS,
  payload: {
    ...success,
  },
});

export const downloadLeaveReportError = error => ({
  type: actionTypes.DOWNLOAD_LEAVE_REPORT_ERROR,
  payload: {
    error,
  },
});

export const fetchLeaveAllRequest = payload => ({
  type: actionTypes.FETCH_LEAVE_TYPES_REQUEST,
  payload: {
    ...payload,
  },
});

export const fetchLeaveAllSuccess = success => ({
  type: actionTypes.FETCH_LEAVE_TYPES_SUCCESS,
  payload: {
    ...success,
  },
});

export const fetchLeaveAllError = error => ({
  type: actionTypes.FETCH_LEAVE_TYPES_ERROR,
  payload: {
    error,
  },
});
