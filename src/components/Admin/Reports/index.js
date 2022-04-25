/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
import React, { useState } from 'react';
import './style.scss';
import moment from 'moment';
import { userService } from '../../../services';
import { sendApiRequest } from '../../common/serviceCall/PostApiCall';
import apis from '../../common/Api';
import EmployeeReport from './EmployeeReport';
import ManagerReport from './ManagerReport';
import AdminReport from './AdminReport';
import { checkUserRoleType } from './util';
import { commonService } from '../../../services/common.service';

const { localizedDate, localizedDateFormat } = commonService;

// function localizedDate(date) {
//   const lang = navigator.languages ? navigator.languages : navigator.language;
//   const format = moment().locale(lang).localeData()._longDateFormat.L;
//   return moment.utc(date).local().format(format);
// }

const {
  isEmployee, isManager, isAdmin, getUser, getUserId,
} = userService;

function Reports() {
  const [isEmployeeUser] = useState(isEmployee());
  const [isManagerUser] = useState(isManager());
  const [isAdminUser] = useState(isAdmin());
  const [loading, setLoading] = useState(false);
  const [filteredDataByShiftId, setFilteredDataByShiftId] = useState({});
  const [shiftViaHoursData, setShiftViaHoursData] = useState();
  const [shiftTypes, setShiftTypes] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [employeeName, setEmployeeName] = useState('');
  // new States
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredByShiftIdAndUtcStartDate, setFilteredByShiftIdAndUtcStartDate] = useState({});
  const [dateViaHoursDataObj, setDateViaHoursDataObj] = useState();

  const [isAllScheduleSelected, setIsAllScheduleSelected] = useState(true);
  const [isAllShiftTypeSelected, setIsAllShiftTypeSelected] = useState(true);

  // const getShiftIdAndUtcStartDateDataKey = doc => `${doc.shiftId}-${localizedDate(doc.startDateTimeUtc)}`;
  
  const getLocalDate = dateTimeUtc => (typeof dateTimeUtc === 'string' ? moment(dateTimeUtc).local().format(localizedDateFormat()) : '');
  // const getShiftIdAndUtcStartDateDataKey = doc => `${doc.shiftId}-${doc.startDateTimeUtc ? localizedDate(doc.startDateTimeUtc) : ''}`;
  const getShiftIdAndUtcStartDateDataKey = doc => `${doc.shiftId}-${doc.startDateTimeUtc ? getLocalDate(doc.startDateTimeUtc) : ''}`;
  const getLocalDateForDatePicker = dateTime => (typeof dateTime === 'object' ? moment(dateTime).local() : '');


  const fetchFiltersData = async (scheduleListParams = {}) => {
    try {
      const shiftTypeUrl = apis.shift.getShiftType;
      const scheduleListUrl = apis.schedule.scheduleList;
      const [shiftTypeRes, scheduleListRes] = await Promise.all([sendApiRequest(shiftTypeUrl, 'POST', { languageId: 1 }),
        sendApiRequest(scheduleListUrl, 'POST', {
          languageId: 1,
          userId: parseInt(getUserId(), 10),
          showUnpublishedSchedules: false,
          showPastSchedules: true,
          showAssignedSchedules: true,
          ...scheduleListParams,
        })]);

      if (shiftTypeRes.statusCode === 200) {
        setShiftTypes(shiftTypeRes.data);
      }
      if (scheduleListRes.statusCode === 200) {
        setSchedules(scheduleListRes.data);
      } else if (shiftTypeRes.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          fetchFiltersData();
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   fetchFiltersData();
  // }, []);

  const resetTableFilters = () => {
    setFilteredDataByShiftId({});
    setShiftViaHoursData(null);
    setEmployeeName('');

    // new States
    setStartDate(null);
    setEndDate(null);
    setDateViaHoursDataObj(null);
    setFilteredByShiftIdAndUtcStartDate({});
  };

  const getTimesheet = async (reqBody, userName) => {
    if (!Object.keys(reqBody).length) return;
    // New States update
    // setStartDate(localizedDate(reqBody.startDate));
    // setEndDate(localizedDate(reqBody.endDate));
    setStartDate(getLocalDateForDatePicker(reqBody.startDate));
    setEndDate(getLocalDateForDatePicker(reqBody.endDate));
    setIsAllScheduleSelected(parseInt(reqBody.scheduleId, 10) === 0);
    setIsAllShiftTypeSelected(parseInt(reqBody.shiftId, 10) === 1);

    if (userName) setEmployeeName(userName);
    else setEmployeeName('');
    const userRoles = getUser();
    const userRoleTypes = checkUserRoleType(userRoles.role);
    const userRolesDetails = {
      userId: userRoles.userId,
      roleType: userRoleTypes.roleType,
      roleIds: userRoleTypes.userRoleIds,
    };
    const reqObj = {
      id: userRolesDetails.userId,
      languageId: 1,
      roleIds: userRolesDetails.roleIds,
      pageIndex: 1,
      pageSize: 2147483644,
      contractTypeId: 0,
      scheduleId: 0,
      shiftId: 0,
      userRoleIds: userRolesDetails.userRoleIds,
      ...reqBody,
    };

    try {
      setLoading(true);
      const res = await sendApiRequest(
        apis.timesheet.hoursWorkedReport,
        'POST',
        reqObj,
      );

      if (res.statusCode === 200) {
        const { data, dateWiseHoursData, shiftWiseHoursData } = res.data;
        // New sates update
        const dateViaData = dateWiseHoursData.reduce((prv, cur) => {
          // prv[`${localizedDate(cur.date)}`] = cur;
          prv[`${getLocalDate(cur.date)}`] = cur;
          return prv;
        }, {});
        setDateViaHoursDataObj(dateViaData);
        const shiftIdAndUtcDateViaData = data.reduce((prv, cur) => {
          prv[getShiftIdAndUtcStartDateDataKey(cur)] = cur;
          return prv;
        }, {});
        setFilteredByShiftIdAndUtcStartDate(shiftIdAndUtcDateViaData);
        setShiftViaHoursData(shiftWiseHoursData);

        const filteredData = data.reduce((prv, cur) => {
          if (!(cur.shiftId in prv)) {
            prv[`${cur.shiftId}`] = [];
          }
          prv[`${cur.shiftId}`].push(cur);
          return prv;
        }, {});
        
        setFilteredDataByShiftId(filteredData);
      } else if (res.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          getTimesheet();
        });
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isEmployeeUser) {
    return (
      <EmployeeReport
        loading={loading}
        filteredDataByShiftId={filteredDataByShiftId}
        employeeName={employeeName}
        resetTableFilters={resetTableFilters}
        getTimesheet={getTimesheet}
        shiftViaHoursData={shiftViaHoursData}
        shiftTypes={shiftTypes}
        schedules={schedules}
      // New states
        fromDate={startDate}
        toDate={endDate}
        filteredByShiftIdAndUtcStartDate={filteredByShiftIdAndUtcStartDate}
        dateViaHoursDataObj={dateViaHoursDataObj}
        fetchFiltersData={fetchFiltersData}
        //
        isAllScheduleSelected={isAllScheduleSelected}
        isAllShiftTypeSelected={isAllShiftTypeSelected}
      />
    );
  }
  if (isManagerUser) {
    return (
      <ManagerReport
        loading={loading}
        filteredDataByShiftId={filteredDataByShiftId}
        employeeName={employeeName}
        resetTableFilters={resetTableFilters}
        getTimesheet={getTimesheet}
        shiftViaHoursData={shiftViaHoursData}
        shiftTypes={shiftTypes}
        schedules={schedules}
      // New states
        fromDate={startDate}
        toDate={endDate}
        filteredByShiftIdAndUtcStartDate={filteredByShiftIdAndUtcStartDate}
        dateViaHoursDataObj={dateViaHoursDataObj}
        fetchFiltersData={fetchFiltersData}
        //
        isAllScheduleSelected={isAllScheduleSelected}
        isAllShiftTypeSelected={isAllShiftTypeSelected}
      />
    );
  }

  if (isAdminUser) {
    return (
      <AdminReport
        loading={loading}
        filteredDataByShiftId={filteredDataByShiftId}
        employeeName={employeeName}
        resetTableFilters={resetTableFilters}
        getTimesheet={getTimesheet}
        shiftViaHoursData={shiftViaHoursData}
        shiftTypes={shiftTypes}
        schedules={schedules}
        // New states
        fromDate={startDate}
        toDate={endDate}
        filteredByShiftIdAndUtcStartDate={filteredByShiftIdAndUtcStartDate}
        dateViaHoursDataObj={dateViaHoursDataObj}
        fetchFiltersData={fetchFiltersData}
        //
        isAllScheduleSelected={isAllScheduleSelected}
        isAllShiftTypeSelected={isAllShiftTypeSelected}
      />
    );
  }
  return null;
}

export default Reports;
