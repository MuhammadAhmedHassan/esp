import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';
import moment from 'moment';
import * as cloneDeep from 'lodash/cloneDeep';
import EmployeeTable from './employee';
import ManagerTable from './manager';
import AdminTable from './admin';

import {
  getCityByStateIdRequest,
  getCountryListRequest,
  getStatesByCountryIdRequest,
  getDivisionsByOrganisationRequest,
  getBusinessUnitByDivisionRequest,
  getDepartmentByBusinessUnitRequest,
  getTeamsByDepartmentRequest,
  getManagerByTeamRequest,
  getWorkLocationRequest,
  getUserByManagerRequest,
  getHoursReportRequest,
  downloadHoursReportRequest,
} from '../../../store/action';
import { checkUserRoleType } from './util';

const Reports = () => {
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
  });

  const dispatch = useDispatch();
  const allCountry = useSelector(state => state.allCountryList);
  const allState = useSelector(state => state.statesByCountryList);
  const cityList = useSelector(state => state.cityByStateList);
  const divisions = useSelector(state => state.divisionsByOrganisationList);
  const businessUnit = useSelector(state => state.businessUnitByDivisionList);
  const department = useSelector(state => state.departmentByBusinessList);
  const team = useSelector(state => state.teamsByDepartmentList);
  const primaryManager = useSelector(state => state.managerByTeamList);
  const allLocation = useSelector(state => state.workLocationList);
  const emp = useSelector(state => state.userByManagerList);
  const userRoles = useSelector(state => state.checkUserRole.user);
  const hoursWorkedData = useSelector(
    state => state.hoursWorkedList.hoursWorked,
  );
  const isHoursTableLoading = useSelector(
    state => state.hoursWorkedList.isLoading,
  );

  const hoursTableDownloadRequest = () => {
    dispatch(
      downloadHoursReportRequest({
        id: userRolesDetails.userId,
        languageId: 0,
        offset: null,
        role: null,
        isActive: true,
        roleIds: userRolesDetails.roleIds,
        publicKey: null,
        totalRecords: 0,
        pageIndex: 0,
        pageSize: 0,
        divisionId: parseInt(filters.divisionId, 10),
        businessUnitId: parseInt(filters.businessUnitId, 10),
        departmentId: parseInt(filters.departmentId, 10),
        teamId: parseInt(filters.teamId, 10),
        managerId: parseInt(filters.managerId, 10),
        userId: parseInt(filters.employeesId, 10),
        contractTypeId: 0,
        countryId: parseInt(filters.countryId, 10),
        stateId: parseInt(filters.stateId, 10),
        city: filters.cityId,
        workLocationId: filters.workLocationId,
        scheduleId: 0,
        shiftId: 0,
        userRoleIds: userRolesDetails.userRoleIds,
        startDate,
        endDate,
        isOpenShift: null,
        isOnCallShift: null,
        isOverTimeShift: null,
      }),
    );
  };

  const handleSearchReport = (e) => {
    e.preventDefault();
    const userRoleTypes = checkUserRoleType(userRoles.role);
    if (userRoleTypes.roleType === 'admin') {
      dispatch(
        getHoursReportRequest({
          id: userRolesDetails.userId,
          languageId: 0,
          offset: null,
          role: null,
          isActive: true,
          roleIds: userRolesDetails.roleIds,
          publicKey: null,
          totalRecords: 0,
          pageIndex: 0,
          pageSize: 0,
          divisionId: parseInt(filters.divisionId, 10),
          businessUnitId: parseInt(filters.businessUnitId, 10),
          departmentId: parseInt(filters.departmentId, 10),
          teamId: parseInt(filters.teamId, 10),
          managerId: parseInt(filters.managerId, 10),
          userId: parseInt(filters.employeesId, 10),
          contractTypeId: 0,
          countryId: parseInt(filters.countryId, 10),
          stateId: parseInt(filters.stateId, 10),
          city: filters.cityId,
          workLocationId: parseInt(filters.locationId, 10),
          scheduleId: 0,
          shiftId: 0,
          userRoleIds: userRolesDetails.userRoleIds,
          startDate,
          endDate,
          isOpenShift: null,
          isOnCallShift: null,
          isOverTimeShift: null,
        }),
      );
    } else if (userRoleTypes.roleType === 'manager') {
      dispatch(
        getHoursReportRequest({
          id: userRolesDetails.userId,
          languageId: 0,
          offset: null,
          role: null,
          isActive: true,
          roleIds: userRolesDetails.roleIds,
          publicKey: null,
          totalRecords: 0,
          pageIndex: 0,
          pageSize: 0,
          divisionId: parseInt(filters.divisionId, 10),
          businessUnitId: parseInt(filters.businessUnitId, 10),
          departmentId: parseInt(filters.departmentId, 10),
          teamId: parseInt(filters.teamId, 10),
          managerId: userRolesDetails.userId,
          userId: parseInt(filters.employeesId, 10),
          contractTypeId: 0,
          countryId: parseInt(filters.countryId, 10),
          stateId: parseInt(filters.stateId, 10),
          city: filters.cityId,
          workLocationId: filters.workLocationId,
          scheduleId: 0,
          shiftId: 0,
          userRoleIds: userRolesDetails.userRoleIds,
          startDate,
          endDate,
          isOpenShift: null,
          isOnCallShift: null,
          isOverTimeShift: null,
        }),
      );
    } else if (userRoleTypes.roleType === 'user') {
      dispatch(
        getHoursReportRequest({
          id: userRolesDetails.userId,
          languageId: 0,
          offset: null,
          role: null,
          isActive: true,
          roleIds: userRolesDetails.roleIds,
          publicKey: null,
          totalRecords: 0,
          pageIndex: 0,
          pageSize: 0,
          divisionId: parseInt(filters.divisionId, 10),
          businessUnitId: parseInt(filters.businessUnitId, 10),
          departmentId: parseInt(filters.departmentId, 10),
          teamId: parseInt(filters.teamId, 10),
          managerId: parseInt(filters.managerId, 10),
          userId: filters.userRolesDetails,
          contractTypeId: 0,
          countryId: parseInt(filters.countryId, 10),
          stateId: parseInt(filters.stateId, 10),
          city: filters.cityId,
          workLocationId: filters.workLocationId,
          scheduleId: 0,
          shiftId: 0,
          userRoleIds: userRolesDetails.userRoleIds,
          startDate,
          endDate,
          isOpenShift: null,
          isOnCallShift: null,
          isOverTimeShift: null,
        }),
      );
    }
  };

  useEffect(() => {
    const userRoleTypes = checkUserRoleType(userRoles.role);
    if (userRoleTypes) {
      if (userRoleTypes.roleType === 'admin') {
        dispatch(getDivisionsByOrganisationRequest({ id: 0, languageId: 1 }));
        dispatch(
          getCountryListRequest({
            id: 0,
            languageId: 1,
            showUnpublished: false,
          }),
        );
      } else if (userRoleTypes.roleType === 'manager') {
        dispatch(
          getUserByManagerRequest({ managerId: parseInt(userRoles.userId, 10) }),
        );
        dispatch(
          getHoursReportRequest({
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
            scheduleId: 0,
            shiftId: 0,
            userRoleIds: userRoleTypes.userRoleIds,
            startDate: moment().subtract(1, 'months'),
            endDate: moment(),
            isOpenShift: null,
            isOnCallShift: null,
            isOverTimeShift: null,
          }),
        );
      } else if (userRoleTypes.roleType === 'user') {
        dispatch(
          getHoursReportRequest({
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
            scheduleId: 0,
            shiftId: 0,
            userRoleIds: userRoleTypes.userRoleIds,
            startDate: moment().subtract(1, 'months'),
            endDate: moment(),
            isOpenShift: null,
            isOnCallShift: null,
            isOverTimeShift: null,
          }),
        );
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

    if (name === 'divisionId') {
      dispatch(
        getBusinessUnitByDivisionRequest({ divisionsId: parseInt(value, 10) }),
      );
    } else if (name === 'businessUnitId') {
      dispatch(
        getDepartmentByBusinessUnitRequest({
          businessUnitId: parseInt(value, 10),
        }),
      );
    } else if (name === 'departmentId') {
      dispatch(
        getTeamsByDepartmentRequest({ departmentId: parseInt(value, 10) }),
      );
    } else if (name === 'teamId') {
      dispatch(getManagerByTeamRequest({ teamId: parseInt(value, 10) }));
    } else if (name === 'managerId') {
      dispatch(getUserByManagerRequest({ managerId: parseInt(value, 10) }));
    } else if (name === 'countryId') {
      dispatch(getStatesByCountryIdRequest({ countryId: parseInt(value, 10) }));
    } else if (name === 'stateId') {
      dispatch(getCityByStateIdRequest({ stateId: parseInt(value, 10) }));
    } else if (name === 'cityId') {
      dispatch(
        getWorkLocationRequest({
          id: parseInt(value, 10),
          stateId: parseInt(filters.stateId, 10),
          city: value,
          languageId: 1,
        }),
      );
    }
  };
  const combineByWeekData = (data) => {
    const weekDetails = [];
    if (data) {
      data.forEach((object) => {
        if (weekDetails.length > 0) {
          let flag = true;
          weekDetails.forEach((val) => {
            if (val.weekStartDate === object.weekStartDate) {
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
        {userRolesDetails.roleType === 'admin' && (
          <AdminTable
            isAdmin
            handleFilterChange={handleFilterChange}
            filterdates={{
              startDate, setStartDate, endDate, setEndDate,
            }}
            filtersList={{
              divisionsList: divisions.divisionsList,
              businessUnitList: businessUnit.businessUnitList,
              departmentList: department.departmentList,
              teamsList: team.teamsList,
              managerList: primaryManager.managerList,
              countryList: allCountry.countryList,
              statesList: allState.statesList,
              cityList: cityList.cityList,
              workLocationList: allLocation.workLocationList,
              userList: emp.userList,
            }}
            hoursWorkedData={hoursWorkedData}
            handleSearchReport={handleSearchReport}
            combineByWeekData={combineByWeekData}
            combineByshiftLabel={combineByshiftLabel}
            combineForWeekWise={combineForWeekWise}
            isHoursTableLoading={isHoursTableLoading}
            uniqueDateByWeekData={uniqueDateByWeekData}
            sameDateAddition={sameDateAddition}
          />
        )}
        {userRolesDetails.roleType === 'manager' && (
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
            userRolesDetails={userRolesDetails}
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
          />
        )}
      </div>
    </>
  );
};

export default Reports;
