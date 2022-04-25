import { combineReducers } from 'redux';
import checkUserRole from './loggedUsers';
import allCountryList from './allCountryList';
import statesByCountryList from './statesByCountry';
import cityByStateList from './cityByState';
import divisionsByOrganisationList from './divisionsByOrganisation';
import businessUnitByDivisionList from './businessUnitByDivision';
import departmentByBusinessList from './departmentByBusiness';
import teamsByDepartmentList from './teamsByDepartment';
import managerByTeamList from './managerByTeam';
import userByManagerList from './userByManager';
import workLocationList from './workLocation';
import timeSheetList from './timeSheet';
import deleteTimeSheet from './deleteTimeSheet';
import downloadTimeSheetStatus from './downloadTimeSheet';
import teamMatesList from './teamMates';
import shiftByDateList from './shiftByDate';
import swapShift from './swapShift';
import profileDataList from './profileData';
import overTime from './overTime';
import punchTime from './punchTime';
import userTimerList from './userTimer';
import openShiftData from './openShift';
import swapTimeList from './swapTime';
import scheduleData from './scheduleShift';
import hoursWorkedList from './hoursWorked';
import downloadHoursWorkedList from './downloadHoursWorked';
import exceptionReport from './exceptionReport';
import downloadExceptionReport from './downloadExceptionReport';
import exceptionByShiftRecurrenceId from './fetchExceptionByShift';
import fetchAllException from './fetchAllException';
import overTimeReport from './overTimeReport';
import downloadOTReportM from './downloadOverTimeManager';
import leaveBalanceReducer from './leaveBalanceReport';
import downloadLeaveBalanceReport from './downloadLeaveReport';
import allLeavesTypes from './fetchAllLeaves';

const rootReducer = combineReducers({
  checkUserRole,
  teamMatesList,
  shiftByDateList,
  swapShift,
  allCountryList,
  statesByCountryList,
  cityByStateList,
  divisionsByOrganisationList,
  businessUnitByDivisionList,
  departmentByBusinessList,
  teamsByDepartmentList,
  managerByTeamList,
  workLocationList,
  userByManagerList,
  timeSheetList,
  deleteTimeSheet,
  downloadTimeSheetStatus,
  profileDataList,
  overTime,
  punchTime,
  userTimerList,
  openShiftData,
  swapTimeList,
  scheduleData,
  hoursWorkedList,
  downloadHoursWorkedList,
  exceptionReport,
  downloadExceptionReport,
  exceptionByShiftRecurrenceId,
  fetchAllException,
  overTimeReport,
  downloadOTReportM,
  leaveBalanceReducer,
  downloadLeaveBalanceReport,
  allLeavesTypes,
});

export default rootReducer;
