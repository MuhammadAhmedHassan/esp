import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';
import EmployeeTable from './employee';
import ManagerTable from './manager';
import AdminTable from './admin';

import {
  getCountryListRequest,
  getDivisionsByOrganisationRequest,
  getUserByManagerRequest,
  getOverTimeReportRequest,
  downloadOverTimeReportRequest,
} from '../../../../store/action';

import { checkUserRoleType } from './util';

const OverTimeReports = () => {
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
    overTimeStatus: 0,
    year: 0,
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
  const hoursWorkedData = useSelector(state => state.hoursWorkedList.hoursWorked);
  const isOverTimeTableLoading = useSelector(state => state.overTimeReport.isLoading);
  const overTimeData = useSelector(state => state.overTimeReport.overTimeData);


  const payloadUseEffect = {
    id: userRoles.userId,
    languageId: 0,
    offset: null,
    isActive: true,
    totalRecords: 50,
    pageIndex: 1,
    pageSize: 10,
    managerId: 0,
    userId: userRoles.userId,
    year: ((new Date()).getFullYear()),
    startDate: moment().subtract(1, 'months'),
    endDate: moment(),
    overTimeStatus: 0,
  };

  const payloadFilter = {
    id: userRolesDetails.userId,
    languageId: 0,
    offset: null,
    isActive: true,
    totalRecords: pagination.totalRecords,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    managerId: userRolesDetails.userId,
    userId: parseInt(filters.employeesId),
    year: parseInt(filters.year),
    startDate,
    endDate,
    overTimeStatus: parseInt(filters.overTimeStatus),
  };

  const overTimeTableDownloadRequest = () => {
    dispatch(
      downloadOverTimeReportRequest({
        ...payloadFilter,
      }),
    );
  };

  const handleSearchReport = (e) => {
    e.preventDefault();
    const userRoleTypes = checkUserRoleType(userRoles.role);
    if (userRoleTypes.roleType === 'admin') {
      
    } else if (userRoleTypes.roleType === 'manager') {
      dispatch(
        getOverTimeReportRequest({
          ...payloadFilter,
        }),
      );
    } else if (userRoleTypes.roleType === 'user') {
      dispatch(
        getOverTimeReportRequest({
          ...payloadFilter,
          managerId: 0,
          userId: userRolesDetails.userId,
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
        dispatch(getUserByManagerRequest({ managerId: parseInt(userRoles.userId, 10) }));
        dispatch(getOverTimeReportRequest({ ...payloadUseEffect }));
      } else if (userRoleTypes.roleType === 'user') {
        dispatch(
          getOverTimeReportRequest({
            ...payloadUseEffect,
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
          getOverTimeReportRequest({
            ...payloadFilter,
          }),
        );
      } else if (userRoleTypes.roleType === 'user') {
        dispatch(
          getOverTimeReportRequest({
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
        {userRolesDetails.roleType === 'admin' && (
          <div />

        )}
        {userRolesDetails.roleType === 'manager' && (
          <ManagerTable
            isOverTimeTableLoading={isOverTimeTableLoading}
            overTimeTableDownloadRequest={overTimeTableDownloadRequest}

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
            
            overTimeData={overTimeData}

            pagination={pagination}
            updatePageNum={updatePageNum}
            updatePageCount={updatePageCount}
            isManager
          />
        )}
        {userRolesDetails.roleType === 'user' && (
          <EmployeeTable
            isOverTimeTableLoading={isOverTimeTableLoading}
            overTimeTableDownloadRequest={overTimeTableDownloadRequest}
            

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
            
            overTimeData={overTimeData}

            pagination={pagination}
            updatePageNum={updatePageNum}
            updatePageCount={updatePageCount}
            isManager={false}
          />
        )}
      </div>
    </>
  );
};

export default OverTimeReports;
