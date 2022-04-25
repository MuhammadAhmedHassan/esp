import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { userService } from '../../../services';
import {
  primaryHeader,
  secondaryHeader,
  checkUserRoleType,
} from './util';
import UserDetails from './user';
import ManagerDetails from './manager';
import Notes from './notes/AddNotesModal';
import AdminDetails from './admin';
import TimeSheetTable from './table';
import Api from '../../common/Api';
import PostApiCall, { sendApiRequest } from '../../common/serviceCall/PostApiCall';
import ApiResponsePopup from '../../shared/Common/ApiResponsePopup';

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
  getTimeSheetRequest,
  downloadTimeSheetRequest,
} from '../../../store/action';
import './style.scss';

const { getUser } = userService;


const TimeSheet = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const selectedTab = new URLSearchParams(props.location.search).get('tab');
  const [managerKey, setManagerKey] = useState(selectedTab || 'myteam');
  // eslint-disable-next-line react/destructuring-assignment
  useEffect(() => {
    setManagerKey(selectedTab || 'myteam');
    // eslint-disable-next-line no-use-before-define
    setFilters(prevState => ({
      ...prevState,
      rowId: 0,
      startTime: null,
      endTime: null,
      isStartDateEmpty: false,
      isEndDateEmpty: false,
    }));
  // eslint-disable-next-line react/destructuring-assignment
  }, [props.location]);
  const [editRequestShift, setRequestShiftData] = useState({
    shiftRecurrenceId: 0,
    userId: 0,
    notes: '',
    openModel: false,
    isEmptyNote: false,
  });

  const [userRolesDetails, setUserRolesDetails] = useState({
    roleType: '',
    roleIds: '',
    userId: '',
  });
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalRecords: 50,
    isPaginationChanged: false,
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [headerDetails, setHeaderDetails] = useState([]);
  const [clearFilterManagerTeamStatus, setClearFilterManagerTeamStatus] = useState(true);
  const [clearFilterAdminTeamStatus, setClearFilterAdminTeamStatus] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [body, setResponseBody] = useState(false);

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
    rowId: 0,
    startTime: null,
    endTime: null,
    isStartDateEmpty: false,
    isEndDateEmpty: false,
    isFilterStartDateEmpty: false,
    isFilterEndDateEmpty: false,
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
  const timeSheetList = useSelector(state => state.timeSheetList);
  const [employeeByShiftManager, setEmployeeByShiftManager] = useState([]);
  // const userRoles = useSelector((state) => state.checkUserRole.user)
  const user = getUser();
  const [userRoles, setUserRoles] = useState({ ...user });

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (Object.keys(userRoles).length === 0) {
      setUserRoles({ ...user });
    }
  }, [user]);

  const getAllUrls = async (departmentId) => {
    const token = userService.getToken();
    const urls = [`${Api.getManagersByDepartmentId}`, `${Api.getUsersByDepartmentId}`];
    try {
      const response = await Promise.all(
        urls.map(
          url => fetch(url, {
            method: 'POST',
            headers: new Headers({
              Token: `${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ id: Number(departmentId), languageId: 1 }),
            // eslint-disable-next-line no-shadow
          }).then(response => response.json()),
        ),
      );
      primaryManager.managerList = [{ id: '0', firstName: 'All' }].concat(response[0].data);
      emp.userList = [{ id: 0, firstName: 'All' }].concat(response[1].data);
      return (response);
    } catch (error) {
      return (error);
    }
  };

  const fetchEmployeeByShiftManagerId = async () => {
    // eslint-disable-next-line no-shadow
    const body = {
      languageId: 1,
      id: userService.getUserId(),
    };
    try {
      const response = await sendApiRequest(Api.manageEmp.getEmployeeByShiftManagerId, 'POST', body);
      if (response.statusCode === 200) {
        setEmployeeByShiftManager(response.data);
      }else if (response.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          fetchEmployeeByShiftManagerId();
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchEmployeeByShiftManagerId(); }, []);

  useEffect(() => {
    setPagination(prevState => ({
      ...prevState,
      pageSize: timeSheetList.timeSheet.pageSize,
      pageIndex: timeSheetList.timeSheet.pageIndex,
      totalRecords: timeSheetList.timeSheet.totalRecords,
    }));
  }, [timeSheetList]);

  useEffect(() => {
    if (userRolesDetails.userId && pagination.isPaginationChanged) {
      const isOwnTimeSheet = userRolesDetails.roleType === 'user' ? true : managerKey === 'mytimesheet';
      // eslint-disable-next-line no-use-before-define
      getTimeSheet(userRolesDetails.userId, userRolesDetails.roleIds, isOwnTimeSheet);
    }
  }, [pagination]);

  useEffect(() => {
    const userRoleTypes = checkUserRoleType(userRoles.role);
    const isOwnTimeSheet = userRolesDetails.roleType === 'user' ? true : managerKey === 'mytimesheet';
    if (userRoleTypes) {
      if (userRoleTypes.roleType === 'admin') {
        setHeaderDetails([...primaryHeader]);
        dispatch(getDivisionsByOrganisationRequest({ id: 0, languageId: 1 }));
        dispatch(getCountryListRequest({ id: 0, languageId: 1, showUnpublished: false }));
        // eslint-disable-next-line no-use-before-define
        getTimeSheet(userRoles.userId, userRoleTypes.userRoleIds, isOwnTimeSheet);
      } else if (userRoleTypes.roleType === 'manager') {
        setHeaderDetails([...primaryHeader]);
        dispatch(getUserByManagerRequest({ managerId: parseInt(userRoles.userId, 10) }));
        dispatch(getCountryListRequest({ id: 0, languageId: 1, showUnpublished: false }));
        // eslint-disable-next-line no-use-before-define
        getTimeSheet(userRoles.userId, userRoleTypes.userRoleIds, isOwnTimeSheet);
      } else if (userRoleTypes.roleType === 'user') {
        setHeaderDetails([...secondaryHeader]);
        const isOwnTimeSheet = true;
        // eslint-disable-next-line no-use-before-define
        getTimeSheet(userRoles.userId, userRoleTypes.userRoleIds, isOwnTimeSheet);
      }

      setUserRolesDetails(prevState => ({
        // eslint-disable-next-line max-len
        ...prevState, userId: userRoles.userId, roleType: userRoleTypes.roleType, roleIds: userRoleTypes.userRoleIds,
      }));
    }
  }, [userRoles.role]);

  useEffect(() => {
    if (userRolesDetails.userId) {
      // eslint-disable-next-line max-len
      
      setPagination(prevState => ({ ...prevState, pageIndex: 1, isPaginationChanged: true }));
      // () => getTimeSheet(userRolesDetails.userId, userRolesDetails.roleIds, isOwnTimeSheet)
    }
  }, [managerKey]);

  const getTimeSheet = async (id, userRole, isOwnTimeSheet, isDownload = false) => {
    const payload = {
      id,
      languageId: 1,
      offset: null,
      role: null,
      isActive: true,
      roleIds: userRole,
      publicKey: null,
      totalRecords: pagination.totalRecords,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      // eslint-disable-next-line radix
      organisationId: parseInt(filters.organisationId),
      divisionId: parseInt(filters.divisionId, 10),
      // eslint-disable-next-line radix
      businessUnitId: parseInt(filters.businessUnitId),
      departmentId: parseInt(filters.departmentId, 10),
      teamId: parseInt(filters.teamId, 10),
      managerId: isOwnTimeSheet ? 0 : parseInt(filters.managerId, 10),
      userId: isOwnTimeSheet ? id : parseInt(filters.employeesId, 10),
      contractTypeId: 0,
      countryId: parseInt(filters.countryId, 10),
      stateId: parseInt(filters.stateId, 10),
      city: filters.cityId,
      workLocationId: parseInt(filters.locationId, 10),
      userRoleIds: userRole,
      startDate: startDate ? moment(startDate).format('YYYY-MM-DDTHH:mm:ss') : null,
      endDate: endDate ? moment(endDate).format('YYYY-MM-DDTHH:mm:ss') : null,
    };
    if (!isDownload) {
      setPagination(prevState => ({ ...prevState, isPaginationChanged: false }));
      await dispatch(getTimeSheetRequest({
        ...payload,
      }));
    } else {
      await dispatch(downloadTimeSheetRequest({
        ...payload,
      }));
    }
  };

  const getAllTimeSheetData = async (id, userRole, isOwnTimeSheet) => {
    const payload = {
      id,
      languageId: 1,
      offset: null,
      role: null,
      isActive: true,
      roleIds: userRole,
      publicKey: null,
      totalRecords: pagination.totalRecords,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      organisationId: 0,
      divisionId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      managerId: 0,
      userId: isOwnTimeSheet ? userService.getUserId() : 0,
      contractTypeId: 0,
      countryId: 0,
      stateId: 0,
      city: '',
      workLocationId: 0,
      userRoleIds: userRole,
      startDate: null,
      endDate: null,
    };
    await dispatch(getTimeSheetRequest({
      ...payload,
    }));
  };

  const updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      setPagination(prevState => ({
        ...prevState,
        pageIndex: pageNum,
        isPaginationChanged: true,
      }));
    }
  };

  const clearFilterChange = () => {
    setStartDate(null);
    setEndDate(null);
    const isOwnTimeSheet = userRolesDetails.roleType === 'user' ? true : managerKey === 'mytimesheet';
    getAllTimeSheetData(userRolesDetails.userId, userRolesDetails.roleIds, isOwnTimeSheet);
  };

  const editEmployeeShift = (rowId, startTime, endTime) => {
    const startDateTime = startTime ? moment.utc(startTime).local().format() : null;
    const endDateTime = endTime ? moment.utc(endTime).local().format() : null;
    setFilters(prevState => ({
      ...prevState,
      rowId,
      startTime: startTime ? new Date(startDateTime) : null,
      endTime: startTime ? new Date(endDateTime) : null,
      isStartDateEmpty: false,
      isEndDateEmpty: false,
    }));
  };

  const closeModel = () => {
    setRequestShiftData(prevState => ({
      ...prevState,
      openModel: false,
    }));
  };

  const handleChangeAction = (e) => {
    const { value } = e.target;
    setRequestShiftData(prevState => ({
      ...prevState,
      notes: value,
      isEmptyNote: value === '',
    }));
  };

  const handleSubmitAction = async () => {
    if (editRequestShift.notes) {
      const data = {
        languageId: 1,
        userId: editRequestShift.userId,
        shiftRecurrenceId: editRequestShift.shiftRecurrenceId,
        description: editRequestShift.notes,
      };
      try {
        const token = userService.getToken();
        await PostApiCall(`${Api.timesheet.requestCorrection}`, data, token);
        // eslint-disable-next-line no-alert
        setResponseBody('Shift Request send successfully');
        setShowModel(true);
        getTimeSheet(userRolesDetails.userId, userRolesDetails.roleIds, false);
        setRequestShiftData(() => ({
          shiftRecurrenceId: 0,
          userId: 0,
          notes: '',
          openModel: false,
          isEmptyNote: false,
        }));
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert(err);
      }
    } else {
      setRequestShiftData(prevState => ({
        ...prevState,
        isEmptyNote: true,
      }));
    }
  };

  const requestShiftTime = async (shiftRecurrenceId, userId) => {
    setRequestShiftData(prevState => ({
      ...prevState,
      shiftRecurrenceId,
      notes: '',
      isEmptyNote: false,
      userId,
      openModel: true,
    }));
  };

  const updateEmployeeShift = async (rowId) => {
    let isValid = true;
    let isStartDateEmpty = false;
    let isEndDateEmpty = false;

    if (filters.startTime === null) {
      isStartDateEmpty = true;
      isValid = false;
    }
    if (filters.endTime === null) {
      isEndDateEmpty = true;
      isValid = false;
    }

    if (isValid) {
      const data = {
        languageId: 1,
        userId: userService.getUserId(),
        shiftRecurrenceId: rowId,
        startDateTime: filters.startTime,
        endDateTime: filters.endTime,
      };
      const token = userService.getToken();
      fetch(`${Api.timesheet.shiftCorrection}`, {
        method: 'POST',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Token: `Bearer ${token}`,
        }),
        body: JSON.stringify(data),
      }).then(response => response.json())
        .then(async (response) => {
          if (response.statusCode === 200) {
            // eslint-disable-next-line no-alert
            setResponseBody('Timesheet updated successfully');
            setShowModel(true);
            const isOwnTimeSheet = userRolesDetails.roleType === 'user' ? true : managerKey === 'mytimesheet';
            getTimeSheet(userRolesDetails.userId, userRolesDetails.roleIds, isOwnTimeSheet);
            setFilters(prevState => ({
              ...prevState,
              rowId: 0,
              startTime: null,
              endTime: null,
              isStartDateEmpty: false,
              isEndDateEmpty: false,
            }));
          }else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              updateEmployeeShift(rowId);
            });
          } else {
            setResponseBody(response.message);
            setShowModel(true);
          }
        }).catch((err) => {
          setResponseBody(err);
          setShowModel(true);
        });
    } else {
      setFilters(prevState => ({
        ...prevState,
        isStartDateEmpty,
        isEndDateEmpty,
      }));
    }
  };


  const handleStartDateChange = (startTime) => {
    setFilters(prevState => ({
      ...prevState,
      startTime,
      isStartDateEmpty: false,
    }));
  };

  const handleEndDateChange = (endTime) => {
    setFilters(prevState => ({
      ...prevState,
      endTime,
      isEndDateEmpty: false,
    }));
  };

  const updatePageCount = (pageCount) => {
    setPagination(prevState => ({
      ...prevState,
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
      isPaginationChanged: true,
    }));
  };

  const handleFilterChange = async (event) => {
    const { target } = event;
    const { name, value } = target;

    setFilters(prevState => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'divisionId') {
      if (value === '0') {
        businessUnit.businessUnitList = [];
        businessUnit.businessUnitList.push({ id: 0, name: 'All' });
        department.departmentList = [];
        department.departmentList.push({ id: 0, name: 'All' });
        team.teamsList = [];
        team.teamsList.push({ id: 0, name: 'All' });
        primaryManager.managerList = [];
        primaryManager.managerList.push({ id: 0, firstName: 'All' });
        emp.userList = [];
        emp.userList.push({ id: 0, firstName: 'All' });
        setFilters(prevState => ({
          ...prevState,
          businessUnitId: 0,
          departmentId: 0,
          teamId: 0,
          managerId: 0,
          employeesId: 0,
        }));
      } else {
        dispatch(getBusinessUnitByDivisionRequest({ divisionsId: parseInt(value, 10) }));
      }
    } else if (name === 'businessUnitId') {
      if (value === '0') {
        department.departmentList = [];
        department.departmentList.push({ id: 0, name: 'All' });
        team.teamsList = [];
        team.teamsList.push({ id: 0, name: 'All' });
        primaryManager.managerList = [];
        primaryManager.managerList.push({ id: 0, firstName: 'All' });
        emp.userList = [];
        emp.userList.push({ id: 0, firstName: 'All' });
        setFilters(prevState => ({
          ...prevState,
          departmentId: 0,
          teamId: 0,
          managerId: 0,
          employeesId: 0,
        }));
      } else {
        dispatch(getDepartmentByBusinessUnitRequest({ businessUnitId: parseInt(value, 10) }));
      }
    } else if (name === 'departmentId') {
      if (value === '0') {
        team.teamsList = [];
        team.teamsList.push({ id: 0, name: 'All' });
        primaryManager.managerList = [];
        primaryManager.managerList.push({ id: 0, firstName: 'All' });
        emp.userList = [];
        emp.userList.push({ id: 0, firstName: 'All' });
        setFilters(prevState => ({
          ...prevState,
          teamId: 0,
          managerId: 0,
          employeesId: 0,
        }));
      } else {
        getAllUrls(parseInt(value, 10));
        dispatch(getTeamsByDepartmentRequest({ departmentId: parseInt(value, 10) }));
      }
    } else if (name === 'teamId') {
      if (value === '0') {
        primaryManager.managerList = [];
        primaryManager.managerList.push({ id: 0, firstName: 'All' });
        emp.userList = [];
        emp.userList.push({ id: 0, firstName: 'All' });
        setFilters(prevState => ({
          ...prevState,
          managerId: 0,
          employeesId: 0,
        }));
      } else {
        dispatch(getManagerByTeamRequest({ teamId: parseInt(value, 10) }));
      }
    } else if (name === 'managerId') {
      if (value === '0') {
        emp.userList = [];
        emp.userList.push({ id: 0, firstName: 'All' });
        setFilters(prevState => ({
          ...prevState,
          employeesId: 0,
        }));
      } else {
        dispatch(getUserByManagerRequest({ managerId: parseInt(value, 10) }));
      }
    } else if (name === 'countryId') {
      dispatch(getStatesByCountryIdRequest({ countryId: parseInt(value, 10) }));
    } else if (name === 'stateId') {
      dispatch(getCityByStateIdRequest({ stateId: parseInt(value, 10) }));
    } else if (name === 'cityId') {
      dispatch(getWorkLocationRequest({
        id: parseInt(value, 10),
        stateId: parseInt(filters.stateId, 10),
        city: value,
        languageId: 1,
      }));
    }
  };

  const handleSearchTimeSheet = () => {
    let isValid = true;
    let isFilterStartDateEmpty = false;
    let isFilterEndDateEmpty = false;
    if (startDate === null) {
      isFilterStartDateEmpty = true;
      isValid = false;
    }
    if (endDate === null) {
      isFilterEndDateEmpty = true;
      isValid = false;
    }
    if (isValid) {
      setPagination(prevState => ({ ...prevState, pageIndex: 1, isPaginationChanged: true }));
      // const isOwnTimeSheet = userRolesDetails.roleType === 'user' ? true : managerKey === 'mytimesheet';
      // getTimeSheet(userRolesDetails.userId, userRolesDetails.roleIds, isOwnTimeSheet);
    }

    setFilters(prevState => ({
      ...prevState,
      isFilterStartDateEmpty,
      isFilterEndDateEmpty,
    }));
  };

  const handleSearchManagerTeamTimeSheet = () => {
    // const isOwnTimeSheet = userRolesDetails.roleType === 'user' ? true : managerKey === 'mytimesheet';
    // getTimeSheet(userRolesDetails.userId, userRolesDetails.roleIds, isOwnTimeSheet);
    setPagination(prevState => ({ ...prevState, pageIndex: 1, isPaginationChanged: true }));
    setClearFilterManagerTeamStatus(false);
  };

  const clearManagerTeamFilterChange = () => {
    setStartDate(null);
    setEndDate(null);
    setFilters(prevState => ({
      ...prevState,
      employeesId: 0,
      countryId: 0,
      stateId: 0,
      city: '',
      workLocationId: 0,
    }));
    getAllTimeSheetData(userRolesDetails.userId, userRolesDetails.roleIds);
    setClearFilterManagerTeamStatus(true);
  };

  const clearAdminTeamFilterChange = () => {
    setStartDate(null);
    setEndDate(null);
    setFilters(prevState => ({
      ...prevState,
      employeesId: 0,
      countryId: 0,
      stateId: 0,
      city: '',
      workLocationId: 0,
      organisationId: 0,
      divisionId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      managerId: 0,
    }));
    getAllTimeSheetData(userRolesDetails.userId, userRolesDetails.roleIds);
    setClearFilterAdminTeamStatus(true);
  };

  const handleSearchAdminTeamTimeSheet = () => {
    // const isOwnTimeSheet = userRolesDetails.roleType === 'user' ? true : managerKey === 'mytimesheet';
    // getTimeSheet(userRolesDetails.userId, userRolesDetails.roleIds, isOwnTimeSheet);
    setPagination(prevState => ({ ...prevState, pageIndex: 1, isPaginationChanged: true }));
    setClearFilterAdminTeamStatus(false);
  };

  const handleDownloadTimeSheet = (key) => {
    if (key === '' || key === 'mytimesheet') {
      getTimeSheet(userRolesDetails.userId, userRolesDetails.roleIds, true, true);
    } else {
      getTimeSheet(userRolesDetails.userId, userRolesDetails.roleIds, false, true);
    }
  };
 
  const closeResponseModel = () => {
    setShowModel(false);
  };

  return (
    <div className="container-fluid">
      <div className="card_layout">
        {userRolesDetails.roleType === 'admin'
          && (
            <AdminDetails
              isAdmin
              pagination={pagination}
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleSearchAdminTeamTimeSheet={handleSearchAdminTeamTimeSheet}
              clearAdminTeamFilterChange={clearAdminTeamFilterChange}
              handleDownloadTimeSheet={handleDownloadTimeSheet}
              handleSearchTimeSheet={handleSearchTimeSheet}
              clearFilterChange={clearFilterChange}
              managerKey={managerKey}
              setManagerKey={setManagerKey}
              clearFilterAdminTeamStatus={clearFilterAdminTeamStatus}
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
              }
              }
            />
          )}
        {userRolesDetails.roleType === 'manager'
          && (
            <ManagerDetails
              isManager
              pagination={pagination}
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleSearchManagerTeamTimeSheet={handleSearchManagerTeamTimeSheet}
              clearManagerTeamFilterChange={clearManagerTeamFilterChange}
              handleDownloadTimeSheet={handleDownloadTimeSheet}
              handleSearchTimeSheet={handleSearchTimeSheet}
              clearFilterChange={clearFilterChange}
              filterdates={{
                startDate, setStartDate, endDate, setEndDate,
              }}
              managerKey={managerKey}
              setManagerKey={setManagerKey}
              clearFilterManagerTeamStatus={clearFilterManagerTeamStatus}
              filtersList={{
                divisionsList: [],
                businessUnitList: [],
                departmentList: [],
                teamsList: [],
                managerList: [],
                countryList: allCountry.countryList,
                statesList: allState.statesList,
                cityList: cityList.cityList,
                workLocationList: allLocation.workLocationList,
                userList: employeeByShiftManager,
              }
              }
            />
          )}
        <div ref={componentRef}>
          {userRolesDetails.roleType === 'user'
            && (
              <UserDetails
                isUser
                pagination={pagination}
                filters={filters}
                handleFilterChange={handleFilterChange}
                handleSearchTimeSheet={handleSearchTimeSheet}
                handleDownloadTimeSheet={handleDownloadTimeSheet}
                handlePrint={handlePrint}
                clearFilterChange={clearFilterChange}
                filterdates={{
                  startDate, setStartDate, endDate, setEndDate,
                }}
                filtersList={{
                  divisionsList: [],
                  businessUnitList: [],
                  departmentList: [],
                  teamsList: [],
                  managerList: [],
                  countryList: [],
                  statesList: [],
                  cityList: [],
                  workLocationList: [],
                  userList: [],
                }
                }
              />
            )}
          {
            userRolesDetails.userId && managerKey
            && (
              <TimeSheetTable
                userRole={{
                  isUser: userRolesDetails.roleType === 'user',
                  isAdmin: userRolesDetails.roleType === 'admin',
                  isManager: userRolesDetails.roleType === 'manager',
                }}
                header={headerDetails}
                data={timeSheetList.timeSheet.data}
                pagination={pagination}
                updatePageNum={updatePageNum}
                updatePageCount={updatePageCount}
                editEmployeeShift={editEmployeeShift}
                updateEmployeeShift={updateEmployeeShift}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                requestShiftTime={requestShiftTime}
                filters={filters}
                managerKey={managerKey}
              />
            )
          }
          {
            <Notes
              isOpenModel={editRequestShift.openModel}
              closeModel={closeModel}
              handleChangeAction={handleChangeAction}
              handleSubmitAction={handleSubmitAction}
              notes={editRequestShift.notes}
              isEmptyNote={editRequestShift.isEmptyNote}
            />
          }
          {showModel && (
          <ApiResponsePopup
            body={body}
            closeResponseModel={closeResponseModel}
          />
          ) }

        </div>
      </div>
    </div>
  );
};

export default withTranslation()(TimeSheet);
