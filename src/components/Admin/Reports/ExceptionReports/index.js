import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';
import moment from 'moment';
import * as cloneDeep from 'lodash/cloneDeep';
import EmployeeTable from './employee';
import ManagerTable from './manager';
import AdminTable from './admin';

import {
  getUserByManagerRequest,
  getHoursReportRequest,
  downloadHoursReportRequest,
  getExceptionReportRequest,
  downloadExceptionReportRequest,
  fetchAllExceptionRequest,
  fetchExceptionByShiftRequest,
} from '../../../../store/action';
import { checkUserRoleType } from './util';

const ExceptionReports = () => {
  const [userRolesDetails, setUserRolesDetails] = useState({
    roleType: '',
    roleIds: '',
    userId: '',
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filters, setFilters] = useState({
    organisationId: 0,
    divisionId: 0,
    businessUnitId: 0,
    departmentId: 0,
    teamId: 0,
    managerId: 0,
    employeesId: 0,
    countryId: 0,
    stateId: 0,
    cityId: '',
    offset: 'en-us',
    publicKey: null,
    role: null,
    contractTypeId: 0,
    roleIds: '',
    userRoleIds: '',
    locationId: 0,
    exceptionType: 0,
  });

  const dispatch = useDispatch();
  const emp = useSelector(state => state.userByManagerList);
  const userRoles = useSelector(state => state.checkUserRole.user);
  const hoursWorkedData = useSelector(state => state.exceptionReport.exceptionReportData);
  const isHoursTableLoading = useSelector(state => state.exceptionReport.isLoading);
  const allExceptionData = useSelector(state => state.fetchAllException.exceptionReportData.data);

  const multipleShiftRequest = (shiftId) => {
    dispatch(fetchExceptionByShiftRequest({ shiftRecurrenceId: shiftId }));
  };

  const hoursTableDownloadRequest = () => {
    dispatch(
      downloadExceptionReportRequest({
        id: userRoles.userId,
        languageId: 0,
        offset: null,
        role: null,
        isActive: true,
        roleIds: userRolesDetails.roleIds,
        publicKey: null,
        totalRecords: 0,
        pageIndex: 0,
        pageSize: 0,
        divisionId: 0,
        businessUnitId: 0,
        departmentId: 0,
        teamId: 0,
        managerId: 0,
        userId: userRoles.userId,
        contractTypeId: 0,
        countryId: 0,
        stateId: 0,
        city: '',
        workLocationId: 0,
        userRoleIds: userRolesDetails.userRoleIds,
        startDate: moment().subtract(1, 'months'),
        endDate: moment(),
        exceptionType: 0,
      }),
    );
  };

  const handleSearchReport = (e) => {
    e.preventDefault();
    const userRoleTypes = checkUserRoleType(userRoles.role);
    if (userRoleTypes.roleType === 'admin' || userRoleTypes.roleType === 'manager') {
      dispatch(getExceptionReportRequest({
        id: userRoles.userId,
        languageId: 0,
        offset: null,
        role: null,
        isActive: true,
        roleIds: userRoleTypes.userRoleIds,
        publicKey: null,
        totalRecords: 0,
        pageIndex: 0,
        pageSize: 0,
        divisionId: 0,
        businessUnitId: 0,
        departmentId: 0,
        teamId: 0,
        managerId: 0,
        userId: parseInt(filters.employeesId),
        contractTypeId: 0,
        countryId: 0,
        stateId: 0,
        city: '',
        workLocationId: 0,
        userRoleIds: userRoleTypes.userRoleIds,
        startDate,
        endDate,
        exceptionType: parseInt(filters.exceptionType),
      }));
    } else if (userRoleTypes.roleType === 'user') {
      dispatch(getExceptionReportRequest({
        id: userRoles.userId,
        languageId: 0,
        offset: null,
        role: null,
        isActive: true,
        roleIds: userRoleTypes.userRoleIds,
        publicKey: null,
        totalRecords: 0,
        pageIndex: 0,
        pageSize: 0,
        divisionId: 0,
        businessUnitId: 0,
        departmentId: 0,
        teamId: 0,
        managerId: 0,
        userId: userRoles.userId,
        contractTypeId: 0,
        countryId: 0,
        stateId: 0,
        city: '',
        workLocationId: 0,
        userRoleIds: userRoleTypes.userRoleIds,
        startDate,
        endDate,
        exceptionType: parseInt(filters.exceptionType),
      }));
    }
  };

  useEffect(() => {
    const userRoleTypes = checkUserRoleType(userRoles.role);
    if (userRoleTypes) {
      if (userRoleTypes.roleType === 'admin' || userRoleTypes.roleType === 'manager') {
        dispatch(
          getUserByManagerRequest({ managerId: parseInt(userRoles.userId, 10) }),
        );
        dispatch(fetchAllExceptionRequest({}));
        dispatch(getExceptionReportRequest({
          id: userRoles.userId,
          languageId: 0,
          offset: null,
          role: null,
          isActive: true,
          roleIds: userRoleTypes.userRoleIds,
          publicKey: null,
          totalRecords: 0,
          pageIndex: 0,
          pageSize: 0,
          divisionId: 0,
          businessUnitId: 0,
          departmentId: 0,
          teamId: 0,
          managerId: 0,
          userId: userRoles.userId,
          contractTypeId: 0,
          countryId: 0,
          stateId: 0,
          city: '',
          workLocationId: 0,
          userRoleIds: userRoleTypes.userRoleIds,
          startDate: moment().subtract(1, 'months'),
          endDate: moment(),
          exceptionType: 0,
        }));
      } else if (userRoleTypes.roleType === 'user') {
        dispatch(getExceptionReportRequest({
          id: userRoles.userId,
          languageId: 0,
          offset: null,
          role: null,
          isActive: true,
          roleIds: userRoleTypes.userRoleIds,
          publicKey: null,
          totalRecords: 0,
          pageIndex: 0,
          pageSize: 0,
          divisionId: 0,
          businessUnitId: 0,
          departmentId: 0,
          teamId: 0,
          managerId: 0,
          userId: userRoles.userId,
          contractTypeId: 0,
          countryId: 0,
          stateId: 0,
          city: '',
          workLocationId: 0,
          userRoleIds: userRoleTypes.userRoleIds,
          startDate: moment().subtract(1, 'months'),
          endDate: moment(),
          exceptionType: 0,
        }));
      }
      setUserRolesDetails(prevState => ({
        ...prevState,
        userId: userRoles.userId,
        roleType: userRoleTypes.roleType,
        roleIds: userRoleTypes.userRoleIds,
      }));
    }
  }, [userRoles.role]);

  const handleFilterChange = async (event) => {
    const { target } = event;
    const { name, value } = target;
    
    setFilters(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  const combineByWeekData = (data) => {
    const weekDetails = [];
    if (data) {
      data.forEach((object) => {
        if (weekDetails.length > 0) {
          let flag = true;
          weekDetails.forEach((val) => {
            if (val.weekStartDate == object.weekStartDate) {
              val.days.push({
                ...object,
                date: object.weekDates.substring(8, 10),
              });
              flag = false;
            }
          });
          if (flag === true) {
            weekDetails.push({
              weekStartDate: object.weekStartDate,
              weekNumber: object.weekNumber,
              days: [
                {
                  ...object,
                  date: object.weekDates.substring(8, 10),
                },
              ],
            });
          }
        } else {
          weekDetails.push({
            weekStartDate: object.weekStartDate,
            weekNumber: object.weekNumber,
            days: [
              {
                ...object,
                date: object.weekDates.substring(8, 10),
              },
            ],
          });
        }
      });
    }
    return weekDetails;
  };
  const uniqueDateByWeekData = (weekWiseData) => {
    const uniqueDateData = [];
    weekWiseData.map((week) => {
      uniqueDateData.push({
        weekStartDate: week.weekStartDate,
        weekNumber: week.weekNumber,
        days: week.days.filter((dayData, index) => (!(index > 0 && week.days[index].weekDates === week.days[index - 1].weekDates))),
      });
    });
    return uniqueDateData;
  };
  const sameDateAddition = (byShiftLabel) => {
    const uniqueDateData = [];
    byShiftLabel.map((shift) => {
      uniqueDateData.push({
        shiftLabel: shift.shiftLabel,
        userName: shift.userName,
        shiftId: shift.shiftId,
        days: shift.days.map(week => ({
          weekStartDate: week.weekStartDate,
          weekNumber: week.weekNumber,
          days: week.days.filter((dataDay, index) => {
            if (index > 0 && week.days[index].weekDates === week.days[index - 1].weekDates
                && week.days[index].shiftLabel === week.days[index - 1].shiftLabel) {
              const a = (week.days[index].calculatedTime).split(':');
              const b = (week.days[index - 1].calculatedTime).split(':');
              let x = parseInt(a[0]) + parseInt(b[0]);
              let y = parseInt(a[1]) + parseInt(b[1]);
              if (y > 60) {
                x += Math.round(y / 60);
                y %= 60;
              }
              week.days[index - 1].calculatedTime = `${x}:${y}`;
                  
              return false;
            }
              
            return true;
          }),
        })),
      });
    });
    return uniqueDateData;
  };

  const combineByshiftLabel = (data, weekWiseData) => {
    const weekDetails = [];
    if (data) {
      data.forEach((object) => {
        if (weekDetails.length > 0) {
          let flag = true;
          weekDetails.forEach((val) => {
            if (val.shiftLabel === object.shiftLabel) {
              flag = false;
            }
          });
          if (flag === true) {
            weekDetails.push({
              shiftLabel: object.shiftLabel,
              userName: object.userName,
              shiftId: object.shiftId,
              days: [],
            });
          }
        } else {
          weekDetails.push({
            shiftLabel: object.shiftLabel,
            shiftId: object.shiftId,
            userName: object.userName,
            days: [],
          });
        }
      });
    }
    weekDetails.forEach((object) => {
      weekWiseData.forEach((val) => {
        object.days.push({
          weekStartDate: val.weekStartDate,
          weekNumber: val.weekNumber,
          days: val.days.map((v) => {
            if (v.shiftLabel) {
              return {
                ...v,
              };
            }
            return {
              ...v,
            };
          }),
        });
      });
    });
    return weekDetails;
  };
  const combineForWeekWise = (data, shiftWiseData) => {
    const totalWiseData = cloneDeep(shiftWiseData);
    if (data) {
      if (data.dateWiseHoursData) {
        data.dateWiseHoursData.map((obj) => {
          if (obj) {
            totalWiseData.forEach((labels) => {
              labels.days.forEach((week) => {
                week.days.forEach((v) => {
                  if (v) {
                    if (v.fullDate === obj.date) {
                      v.calculatedTime = obj.totalCalculatedHours;
                      v.requiredHours = obj.totalRequiredHours;
                      v.totalVariance = obj.totalVariance;
                    }
                  }
                });
              });
            });
          }
        });
      }
    }
    return totalWiseData;
  };

  return (
    <>
      <div className="backgroundContainer">
        {(userRolesDetails.roleType === 'admin' || userRolesDetails.roleType === 'manager') && (
        <ManagerTable
          handleSearchReport={handleSearchReport}
          isHoursTableLoading={isHoursTableLoading}
          filters={filters}
          setFilters={setFilters}
          handleFilterChange={handleFilterChange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          hoursTableDownloadRequest={hoursTableDownloadRequest}
          hoursWorkedData={hoursWorkedData}
          combineByshiftLabel={combineByshiftLabel}
          combineByWeekData={combineByWeekData}
          combineForWeekWise={combineForWeekWise}
          emp={emp}
          uniqueDateByWeekData={uniqueDateByWeekData}
          sameDateAddition={sameDateAddition}
          allExceptionData={allExceptionData}
          multipleShiftRequest={multipleShiftRequest}
        />
        )}
        {userRolesDetails.roleType === 'user' && (
          <EmployeeTable
            handleSearchReport={handleSearchReport}
            isHoursTableLoading={isHoursTableLoading}
            filters={filters}
            setFilters={setFilters}
            handleFilterChange={handleFilterChange}
            filterdates={{
              startDate, setStartDate, endDate, setEndDate,
            }}
            hoursWorkedData={hoursWorkedData}
            combineByshiftLabel={combineByshiftLabel}
            combineByWeekData={combineByWeekData}
            combineForWeekWise={combineForWeekWise}
            emp={emp}
            uniqueDateByWeekData={uniqueDateByWeekData}
            sameDateAddition={sameDateAddition}
            allExceptionData={allExceptionData}
            multipleShiftRequest={multipleShiftRequest}
          />
        )}
      </div>
    </>
  );
};

export default ExceptionReports;
