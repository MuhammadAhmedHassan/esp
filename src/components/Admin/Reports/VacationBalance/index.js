import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import EmployeeTable from './employee';
import ManagerTable from './manager';

import {
  getUserByManagerRequest,
  getLeaveBalanceReportRequest,
  downloadLeaveReportRequest,
  fetchLeaveAllRequest,
} from '../../../../store/action';

import { checkUserRoleType } from './util';

const VacationBalance = () => {
  const updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      setPagination(prevState => ({
        ...prevState,
        pageIndex: pageNum,
      }));
    }
  };

  const updatePageCount = (pageCount) => {
    setPagination(prevState => ({
      ...prevState,
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
    }));
  };

  const [userRolesDetails, setUserRolesDetails] = useState({
    roleType: '',
    roleIds: '',
    userId: '',
  });

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [managerKey, setManagerKey] = useState('myTeam');

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalRecords: 50,
  });

  const [pageLength, setPageLength] = useState(5);

  const [filters, setFilters] = useState({
    managerId: 0,
    employeesId: 0,
    leaveType: 0,
    year: 0,
  });

  const dispatch = useDispatch();
  const emp = useSelector(state => state.userByManagerList);
  const userRoles = useSelector(state => state.checkUserRole.user);
  const isLeaveBalanceLoading = useSelector(
    state => state.leaveBalanceReducer.isLoading,
  );
  const leaveBalanceReport = useSelector(
    state => state.leaveBalanceReducer.leaveBalanceReportData,
  );
  const allLeavesTypes = useSelector(state => state.allLeavesTypes.allLeaveTypesData);

  const payloadUseEffect = {
    id: userRoles.userId,
    languageId: 0,
    offset: null,
    isActive: true,
    totalRecords: 50,
    pageIndex: 1,
    pageSize: 10,
    organisationId: 0,
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
    userRoleIds: '',
    leaveCategoryId: 0,
    year: new Date().getFullYear(),
    startDate: moment().subtract(1, 'months'),
    endDate: moment(),
  };

  const payloadFilter = {
    id: userRolesDetails.userId,
    languageId: 0,
    offset: null,
    isActive: true,
    totalRecords: pagination.totalRecords,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    organisationId: 0,
    divisionId: 0,
    businessUnitId: 0,
    departmentId: 0,
    teamId: 0,
    managerId: userRolesDetails.userId,
    userId: parseInt(filters.employeesId),
    contractTypeId: 0,
    countryId: 0,
    stateId: 0,
    city: '',
    workLocationId: 0,
    userRoleIds: userRolesDetails.userRoleIds,
    leaveCategoryId: parseInt(filters.leaveType),
    year: parseInt(filters.year),
    startDate,
    endDate,
  };

  const leaveReportDownloadRequest = () => {
    dispatch(
      downloadLeaveReportRequest({
        ...payloadFilter,
      }),
    );
  };

  const handleSearchReport = (e) => {
    e.preventDefault();
    const userRoleTypes = checkUserRoleType(userRoles.role);
    if (
      userRoleTypes.roleType === 'admin'
      || userRoleTypes.roleType === 'manager'
    ) {
      dispatch(
        getLeaveBalanceReportRequest({
          ...payloadFilter,
        }),
      );
    } else if (userRoleTypes.roleType === 'user') {
      dispatch(
        getLeaveBalanceReportRequest({
          ...payloadFilter,
          managerId: 0,
          userId: userRolesDetails.userId,
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(fetchLeaveAllRequest({}));
    const userRoleTypes = checkUserRoleType(userRoles.role);
    if (userRoleTypes) {
      if (
        userRoleTypes.roleType === 'admin'
        || userRoleTypes.roleType === 'manager'
      ) {
        dispatch(
          getUserByManagerRequest({
            managerId: parseInt(userRoles.userId, 10),
          }),
        );

        dispatch(
          getLeaveBalanceReportRequest({
            ...payloadUseEffect,
            userRoleIds: userRoleTypes.userRoleIds,
          }),
        );
      } else if (userRoleTypes.roleType === 'user') {
        dispatch(
          getLeaveBalanceReportRequest({
            ...payloadUseEffect,
            userRoleIds: userRoleTypes.userRoleIds,
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

  useEffect(() => {
    const userRoleTypes = checkUserRoleType(userRoles.role);
    if (userRoleTypes && userRoleTypes.roleType) {
      if (userRoleTypes.roleType === 'manager') {
        dispatch(
          getLeaveBalanceReportRequest({
            ...payloadFilter,
          }),
        );
      } else if (userRoleTypes.roleType === 'user') {
        dispatch(
          getLeaveBalanceReportRequest({
            ...payloadFilter,
            managerId: 0,
            userId: userRolesDetails.userId,
          }),
        );
      }
    }
  }, [pagination]);

  const handleFilterChange = async (event) => {
    const { target } = event;
    const { name, value } = target;

    setFilters(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="backgroundContainer">
        {(userRolesDetails.roleType === 'manager'
          || userRolesDetails.roleType === 'admin') && (
          <ManagerTable
            isLeaveBalanceLoading={isLeaveBalanceLoading}
            overTimeTableDownloadRequest={leaveReportDownloadRequest}
            handleSearchReport={handleSearchReport}
            filters={filters}
            setFilters={setFilters}
            handleFilterChange={handleFilterChange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            userRolesDetails={userRolesDetails}
            emp={emp}
            pagination={pagination}
            updatePageNum={updatePageNum}
            updatePageCount={updatePageCount}
            isManager
            leaveBalanceReport={leaveBalanceReport}
            allLeavesTypes={allLeavesTypes}

          />
        )}
        {userRolesDetails.roleType === 'user' && (
          <EmployeeTable
            isLeaveBalanceLoading={isLeaveBalanceLoading}
            overTimeTableDownloadRequest={leaveReportDownloadRequest}
            handleSearchReport={handleSearchReport}
            filters={filters}
            setFilters={setFilters}
            handleFilterChange={handleFilterChange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            userRolesDetails={userRolesDetails}
            emp={emp}
            pagination={pagination}
            updatePageNum={updatePageNum}
            updatePageCount={updatePageCount}
            isManager={false}
            leaveBalanceReport={leaveBalanceReport}
          />
        )}
      </div>
    </>
  );
};

export default VacationBalance;
