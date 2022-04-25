import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Form, Button, Table, Tooltip, Col, Row, Modal, OverlayTrigger, Card,
} from 'react-bootstrap';
import Datetime from 'react-datetime';
import FileSaver from 'file-saver';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import DatePicker from 'react-datepicker';
import './style.scss';
import Api from '../../common/Api';
import { userService } from '../../../services';
import ExcelIcon from '../../../Images/Icons/excel.svg';
import PdfIcon from '../../../Images/Icons/pdf.svg';
import DownloadIcon from '../../../Images/Icons/downloadIcon.svg';
import PrintIcon from '../../../Images/Icons/print.svg';
import { commonService } from '../../../services/common.service';

class MonthlyComparison extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.handleChange = this.handleChange.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
    this.state = {
      token: `${token}`,
      userId: `${userId}`,
      loading: false,
      fromDate: moment(`${moment().get('month') + 1}-01-${moment().get('year')}`, 'MM-DD-YYYY').toDate(),
      toDate: new Date(),
      fileDownload: false,
      divisions: [],
      divisionId: 0,
      businessUnit: [{ id: '0', name: 'All' }],
      businessUnitId: 0,
      department: [{ id: '0', name: 'All' }],
      departmentId: 0,
      team: [{ id: '0', name: 'All' }],
      teamId: 0,
      primaryManager: [{ id: '0', firstName: 'All', lastName: '' }],
      emp: [{ id: '0', firstName: 'All', lastName: '' }],
      managerId: 0,
      allCountry: [{ id: '0', name: 'All' }],
      countryId: 0,
      allState: [{ id: '0', name: 'All' }],
      stateId: 0,
      allCity: [{ id: '0', name: 'All' }],
      allLocation: [{ id: '0', name: 'All' }],
      totalRecords: 10,
      pageIndex: 1,
      pageSize: 10,
      contractTypeId: 0,
      year: new Date().getFullYear(),
      comparisons: {},
      organisationId: 0,
      empTypeById: 0,
      errorMessage: '',
      employeesId: 0,
      selectedYear: new Date(),
      isFromDate: false,
      isToDate: false,
      isDivisionId: false,
      isBusinessUnitId: false,
      isDepartmentId: false,
      isTeamId: false,
      isCountryId: false,
      isStateId: false,
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
  }

  componentDidMount() {
    this.getDivisionsByOrganisationId();
    this.getAllCountries();
  }

  bindSubDropDowns = (ddlName, ddlValue) => {
    const defaultSelection = '0';
    const {
      departmentId, teamId,
    } = this.state;
    if (ddlName === 'divisionId') {
      this.setState({ isDivisionId: false });
      if (ddlValue === defaultSelection) {
        this.setState({ businessUnit: [{ id: '0', name: 'All' }], businessUnitId: 0 });
        this.setState({ department: [{ id: '0', name: 'All' }], departmentId: 0 });
        this.setState({ team: [{ id: '0', name: 'All' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'All', lastName: '' }], managerId: 0 });
        this.setState({ emp: [{ id: '0', firstName: 'All', lastName: '' }] });
      } else {
        this.getBusinessUnitByDivisionId(ddlValue);
      }
    } else if (ddlName === 'businessUnitId') {
      this.setState({ isBusinessUnitId: false });
      if (ddlValue === defaultSelection) {
        this.setState({ department: [{ id: '0', name: 'All' }], departmentId: 0 });
        this.setState({ team: [{ id: '0', name: 'All' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'All', lastName: '' }], managerId: 0 });
        this.setState({ emp: [{ id: '0', firstName: 'All', lastName: '' }] });
      } else {
        this.getDepartmentByBusinessUnitId(ddlValue);
      }
    } else if (ddlName === 'departmentId') {
      this.setState({ isDepartmentId: false });
      if (ddlValue === defaultSelection) {
        this.setState({ team: [{ id: '0', name: 'All' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'All', lastName: '' }], managerId: 0 });
        this.setState({ emp: [{ id: '0', firstName: 'All', lastName: '' }] });
      } else {
        this.getTeamsByDepartmentId(ddlValue);
        this.getManagerByDepartmentId(ddlValue);
        this.getEmployeeByDepartmentId(ddlValue);
      }
    } else if (ddlName === 'teamId') {
      this.setState({ isTeamId: false });
      if (ddlValue === defaultSelection) {
        this.setState({ primaryManager: [{ id: '0', firstName: 'All', lastName: '' }], managerId: 0 });
        this.setState({ emp: [{ id: '0', firstName: 'All', lastName: '' }] });
        this.getManagerByDepartmentId(departmentId);
        this.getEmployeeByDepartmentId(departmentId);
      } else {
        this.getManagerByTeamId(ddlValue);
        this.getEmployeeByTeamId(ddlValue);
      }
    } else if (ddlName === 'managerId') {
      if (ddlValue === defaultSelection) {
        this.setState({ emp: [{ id: '0', firstName: 'All', lastName: '' }] });
        if (teamId > 0) {
          this.getEmployeeByTeamId(teamId);
        } else if (departmentId > 0) {
          this.getEmployeeByDepartmentId(departmentId);
        }
      } else {
        this.getEmployeeByManagerId(ddlValue);
      }
    } else if (ddlName === 'countryId') {
      this.setState({ isCountryId: false });
      if (ddlValue === defaultSelection) {
        this.setState({ allLocation: [{ id: '0', name: 'All' }] });
        this.setState({ allState: [{ id: '0', name: 'All' }], stateId: 0 });
        this.setState({ allCity: [{ id: '0', name: 'All' }] });
      } else {
        this.getStatesByCountryId(ddlValue);
      }
    } else if (ddlName === 'stateId') {
      this.setState({ isStateId: false });
      if (ddlValue === defaultSelection) {
        this.setState({ allCity: [{ id: '0', name: 'All' }] });
        this.setState({ allLocation: [{ id: '0', name: 'All' }] });
      } else {
        this.getCitiesByStatesId(ddlValue);
      }
    } else if (ddlName === 'cityId') {
      if (ddlValue === defaultSelection) {
        this.setState({ allLocation: [{ id: '0', name: 'All' }] });
      } else {
        this.searchWorkLocation(ddlValue);
      }
    }
  }

  getDivisionsByOrganisationId = () => {
    const {
      token, modelMessage,
    } = this.state;

    this.setState({ loading: true });
    fetch(`${Api.manageEmp.getdivisionsbyorganisationid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(0, 10),
        languageId: 1,

      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ divisions: [{ id: '0', name: 'All' }].concat(response.data), divisionId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getDivisionsByOrganisationId());
          });
        } else {
          this.handleClose();
          this.setState({
            isDivisionId: false,
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })

      .catch(err => console.error(err.toString()));
  }

  getBusinessUnitByDivisionId = (divisionId) => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.manageEmp.getbusinessunitbydivisionid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(divisionId, 10),
        languageId: 1,

      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ businessUnit: [{ id: '0', name: 'All' }].concat(response.data), businessUnitId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getBusinessUnitByDivisionId(divisionId));
          });
        } else {
          this.handleClose();
          this.setState({
            isBusinessUnitId: false,
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })

      .catch(err => console.error(err.toString()));
  }

  getDepartmentByBusinessUnitId = (businessUnitId) => {
    const {
      token, modelMessage, errorMessage,
    } = this.state;
    fetch(`${Api.manageEmp.getdepartmentbybusinessunitid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(businessUnitId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ department: [{ id: '0', name: 'All' }].concat(response.data), departmentId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getDepartmentByBusinessUnitId(businessUnitId));
          });
        } else {
          this.handleClose();
          this.setState({
            isDepartmentId: false,
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })

      .catch(err => console.error(err.toString()));
  }

  getTeamsByDepartmentId = (departmentId) => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.manageEmp.getteamsbydepartmentid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(departmentId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ team: [{ id: '0', name: 'All' }].concat(response.data), teamId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getTeamsByDepartmentId(departmentId));
          });
        } else {
          this.handleClose();
          this.setState({
            isTeamId: false,
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })

      .catch(err => console.error(err.toString()));
  }

  getManagerByDepartmentId = (departmentId) => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.getManagersByDepartmentId}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(departmentId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ primaryManager: [{ id: '0', firstName: 'All', lastName: '' }].concat(response.data), managerId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getManagerByDepartmentId(departmentId));
          });
        } else {
          this.handleClose();
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }


  getManagerByTeamId = (teamId) => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.manageEmp.getmanagersbyteamid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(teamId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ primaryManager: [{ id: '0', firstName: 'All', lastName: '' }].concat(response.data), managerId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getManagerByTeamId(teamId));
          });
        } else {
          this.handleClose();
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getEmployeeByTeamId = (teamId) => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.getUsersByTeamId}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(teamId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            emp: [{
              id: '0',
              firstName: 'All',
              lastName: '',
            }].concat(response.data),

          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmployeeByTeamId(teamId));
          });
        } else {
          this.handleClose();
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getEmployeeByDepartmentId = (departmentId) => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.getUsersByDepartmentId}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(departmentId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            emp: [{
              id: '0',
              firstName: 'All',
              lastName: '',
            }].concat(response.data),

          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmployeeByDepartmentId(departmentId));
          });
        } else {
          this.handleClose();
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getEmployeeByManagerId = (managerId) => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.manageEmp.getemployeebymanagerid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(managerId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            emp: [{
              id: '0',
              firstName: 'All',
              lastName: '',
            }].concat(response.data),

          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmployeeByManagerId(managerId));
          });
        } else {
          this.handleClose();
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getAllCountries = () => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.manageEmp.getallcountries}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(0, 10),
        languageId: 1,
        showUnpublished: false,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ allCountry: [{ id: '0', name: 'All' }].concat(response.data), stateId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAllCountries());
          });
        } else {
          this.handleClose();
          this.setState({
            isCountryId: false,
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getStatesByCountryId = (stateId) => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.manageEmp.getstatesbycountryid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(stateId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ allState: [{ id: '0', firstname: 'All' }].concat(response.data) });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getStatesByCountryId(stateId));
          });
        } else {
          this.handleClose();
          this.setState({
            isStateId: false,
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getCitiesByStatesId = (cityId) => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.manageEmp.getcitiesbystatesid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(cityId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ allCity: [{ id: '0', firstname: 'All' }].concat(response.data) });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getCitiesByStatesId(cityId));
          });
        } else {
          this.handleClose();
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  searchWorkLocation = (cityId) => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.manageEmp.searchworklocation}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: 0, languageId: 1, city: cityId }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          const { data } = response;
          this.setState({
            allLocation: data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.searchWorkLocation(cityId));
          });
        } else {
          this.handleClose();
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getExcelDownload = () => {
    const {
      token, divisionId, businessUnitId, departmentId, teamId, modelMessage,
      managerId, countryId, stateId, totalRecords, empTypeById, fromDate, toDate,
      pageIndex, pageSize, contractTypeId, organisationId, employeesId, cityId,
    } = this.state;
    fetch(`${Api.timesheet.monthlyComparisonDownloadExcel}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: 0,
        languageId: 0,
        offset: '',
        isActive: true,
        totalRecords,
        pageIndex,
        pageSize,
        organisationId: parseInt(organisationId, 10),
        divisionId: parseInt(divisionId, 10),
        businessUnitId: parseInt(businessUnitId, 10),
        departmentId: parseInt(departmentId, 10),
        teamId: parseInt(teamId, 10),
        managerId: parseInt(managerId, 10),
        userId: managerId !== null ? parseInt(employeesId, 10) : 0,
        contractTypeId: parseInt(contractTypeId, 10),
        countryId: parseInt(countryId, 10),
        stateId: parseInt(stateId, 10),
        city: cityId,
        workLocationId: 1,
        userRoleIds: '',
        overTimeStatus: 10,
        startDate: fromDate,
        endDate: toDate,
        empTypeById: parseInt(empTypeById, 10),
      }),
    }).then(response => response.blob())
      .then((response) => {
        FileSaver.saveAs(response, 'MonthlyOverTimeReport.xlsx');
      })
      .catch(err => console.error(err.toString()));
  }

  getPdfDownload = () => {
    const {
      token, divisionId, businessUnitId, departmentId, teamId, modelMessage,
      managerId, countryId, stateId, totalRecords, empTypeById, fromDate, toDate,
      pageIndex, pageSize, contractTypeId, organisationId, employeesId, cityId,
    } = this.state;
    fetch(`${Api.timesheet.monthlyComparisonDownloadPdf}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: 0,
        languageId: 0,
        offset: '',
        isActive: true,
        totalRecords,
        pageIndex,
        pageSize,
        organisationId: parseInt(organisationId, 10),
        divisionId: parseInt(divisionId, 10),
        businessUnitId: parseInt(businessUnitId, 10),
        departmentId: parseInt(departmentId, 10),
        teamId: parseInt(teamId, 10),
        managerId: parseInt(managerId, 10),
        userId: managerId !== null ? parseInt(employeesId, 10) : 0,
        contractTypeId: parseInt(contractTypeId, 10),
        countryId: parseInt(countryId, 10),
        stateId: parseInt(stateId, 10),
        city: cityId,
        workLocationId: 1,
        userRoleIds: '',
        overTimeStatus: 10,
        startDate: fromDate,
        endDate: toDate,
        empTypeById: parseInt(empTypeById, 10),
      }),
    }).then(response => response.blob())
      .then((response) => {
        FileSaver.saveAs(response, 'MonthlyOverTimeReport.pdf');
      })
      .catch(err => console.error(err.toString()));
  }

  getMonthlyComparison = () => {
    const {
      token, divisionId, businessUnitId, departmentId, teamId, modelMessage,
      managerId, countryId, stateId, totalRecords, empTypeById, fromDate, toDate,
      pageIndex, pageSize, contractTypeId, organisationId, employeesId, cityId,
    } = this.state;

    const userRoles = userService.getRole();
    let isAdministratorRole = false;
    if (userRoles.find(role => role.name === 'Administrators')) {
      isAdministratorRole = true;
    } else {
      isAdministratorRole = false;
    }
    if (fromDate !== null && toDate !== null && divisionId && businessUnitId && departmentId && teamId && countryId && stateId) {
      const data = {
        id: 0,
        languageId: 0,
        offset: '',
        isActive: true,
        totalRecords,
        pageIndex,
        pageSize,
        organisationId: parseInt(organisationId, 10),
        divisionId: parseInt(divisionId, 10),
        businessUnitId: parseInt(businessUnitId, 10),
        departmentId: parseInt(departmentId, 10),
        teamId: parseInt(teamId, 10),
        managerId: parseInt(managerId, 10),
        userId: managerId !== null ? parseInt(employeesId, 10) : 0,
        contractTypeId: parseInt(contractTypeId, 10),
        countryId: parseInt(countryId, 10),
        stateId: parseInt(stateId, 10),
        city: cityId,
        workLocationId: 1,
        userRoleIds: '',
        overTimeStatus: 10,
        startDate: fromDate,
        endDate: toDate,
        empTypeById: parseInt(empTypeById, 10),

      };
      // debugger
      fetch(`${Api.timesheet.monthlyComparison}`, {
        method: 'POST',
        headers: new Headers({
          token,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
      }).then(response => response.json())
        .then((response) => {
          if (response.statusCode === 200) {
            this.setState({ loading: false, comparisons: response.data });
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.getMonthlyComparison());
            });
          } else {
            this.handleClose();
            this.setState({
              modelMessage: !modelMessage,
              errorMessage: response.errors,
            });
          }
        })

        .catch(err => console.error(err.toString()));
    } else {
      this.setState({
        isFromDate: !Number(fromDate),
        isToDate: !Number(toDate),
        isDivisionId: !Number(divisionId),
        isBusinessUnitId: !Number(businessUnitId),
        isDepartmentId: !Number(departmentId),
        isTeamId: !Number(teamId),
        isCountryId: !Number(countryId),
        isStateId: !Number(stateId),
      });
    }
  }

  handleClose = () => {
    this.setState({
      modelUpdate: false,
      showModal: false,
    });
  };


  getMonthWiseData = (array, month, key) => {
    const value = array.filter(data => (month === data.month));
    if (value.length > 0) {
      return value[0][`${key}`];
    }
    return ' ';
  }

  getTotalHours = (array, key) => {
    const allHours = array.map(data => data[key]);
    const totalDuration = allHours.slice(1).reduce((prev, cur) => moment.duration(cur).add(prev), moment.duration(allHours[0]));
    const ms = totalDuration._milliseconds;
    const ticks = ms / 1000;
    const hh = Math.floor(ticks / 3600);
    const mm = Math.floor((ticks % 3600) / 60);
    return moment(`${hh}:${mm}`, 'HH:mm').format('HH:mm');
  }

  getReportData = (array, userId) => {
    const value = array.filter(data => (userId === data.userId));
    return value;
  }

  getTotalData = (array, userId) => {
    const value = array.filter(data => (userId === data.userId));
    if (value.length > 0) {
      return value[0].totalOverTimeHours;
    }
    return ' ';
  }

  resetFilter = () => {
    this.setState({
      divisionId: 0,
      countryId: 0,
      managerId: 0,
      employeesId: 0,
      stateId: 0,
      cityId: 0,
      locationId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      businessUnit: [{ id: '0', name: 'All' }],
      department: [{ id: '0', name: 'All' }],
      team: [{ id: '0', name: 'All' }],
      primaryManager: [{ id: '0', firstName: 'All', lastName: '' }],
      emp: [{ id: '0', firstName: 'All', lastName: '' }],
      allState: [{ id: '0', name: 'All' }],
      allCity: [{ id: '0', name: 'All' }],
      allLocation: [{ id: '0', name: 'All' }],
      year: new Date().getFullYear(),
      selectedYear: '',
      fromDate: moment(`${moment().get('month') + 1}-01-${moment().get('year')}`, 'MM-DD-YYYY').toDate(),
      toDate: new Date(),
      comparisons: [],
    });
  }

  submitRequest() {
    this.setState({ loading: true }, () => this.getMonthlyComparison());
  }

  handleChange(event) {
    const { target } = event;
    const { name } = target;
    this.setState({ [name]: target.value }, () => this.bindSubDropDowns(name, target.value));
  }

  handleFromDateChange(date) {
    const { toDate } = this.state;
    if ((Date.parse(toDate) < Date.parse(date))) {
      this.setState({ fromDateIsGreater: true, toDateIsSmaller: false, invalid: true });
    } else {
      this.setState({ fromDateIsGreater: false, toDateIsSmaller: false, invalid: false });
    }
    this.setState({
      fromDate: date,
      isFromDate: false,
    });
  }


  handleToDateChange(date) {
    const { fromDate } = this.state;
    if ((Date.parse(date) < Date.parse(fromDate))) {
      this.setState({ toDateIsSmaller: true, fromDateIsGreater: false, invalid: true });
    } else {
      this.setState({ toDateIsSmaller: false, fromDateIsGreater: false, invalid: false });
    }
    this.setState({
      toDate: date,
      isToDate: false,
    });
  }

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  handleYear(date) {
    this.setState({ year: date.year(), selectedYear: date });
  }

  render() {
    const {
      divisions, businessUnit, department, team, primaryManager, emp,
      divisionId, countryId, departmentId, teamId, managerId, employeesId, fromDate, comparisons, toDate,
      fromDateIsGreater, toDateIsSmaller, businessUnitId, selectedYear, year, fileDownload, allCountry, stateId,
      allState, cityId, allCity, locationId, allLocation, isFromDate, isToDate, isDivisionId, isTeamId, isDepartmentId,
      isBusinessUnitId, isCountryId, isStateId,
    } = this.state;
    const date = new Date();
    const { t } = this.props;
    const isEnabled = divisionId > 0 || countryId > 0;
    return (
      <>
        <div className="container-fluid shift-Approval">
          <Form>
            <Card className="card_layout">
              <Row className="reloadBtn">
                <button type="button" className="downloadBtn mx-2" aria-hidden onClick={() => this.setState({ fileDownload: true })}><img className="pointer" src={DownloadIcon} alt="download icon" /></button>
              </Row>
              <Row>
                <Col lg={3}>
                  <Form.Label htmlFor={fromDate}>{t('SchedulePage.StartDate')}</Form.Label>
                  <DatePicker
                    name="fromDate"
                    selected={fromDate}
                    onChange={this.handleFromDateChange}
                    placeholderText="MM/DD/YYYY"
                    dateFormat="MM/dd/yyyy"
                    className="form-control cal_icon"
                    pattern="\d{2}\/\d{2}/\d{4}"
                  />
                  {fromDateIsGreater
                    && <div className="text-danger">{t('ApplyPage.FromDateText')}</div>
                  }
                  {isFromDate && (
                    <p className="text-danger validation_message">
                      From date is required
                      {' '}
                      {fromDate}
                    </p>
                  )}
                </Col>

                <Col lg={3}>
                  <Form.Label htmlFor={toDate}>{t('SchedulePage.EndDate')}</Form.Label>
                  <DatePicker
                    selected={toDate}
                    onChange={this.handleToDateChange}
                    name="toDate"
                    dateFormat="MM/dd/yyyy"
                    className="form-control cal_icon"
                    placeholderText="MM/DD/YYYY"
                    pattern="\d{2}\/\d{2}/\d{4}"
                  />
                  {toDateIsSmaller
                    && <div className="text-danger">{t('ApplyPage.ToDateText')}</div>
                  }
                  {isToDate && <p className="text-danger validation_message">To date is required</p>}
                </Col>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                  <Form.Label>{t('ManageEmployeePage.TableHeader_Division')}</Form.Label>
                  <Form.Control name="divisionId" value={divisionId} as="select" onChange={this.handleChange}>
                    {divisions.map(division => (
                      <option
                        key={division.id}
                        value={division.id}
                      >
                        {division.name}
                      </option>
                    ))}

                  </Form.Control>
                  {isDivisionId && <p className="text-danger validation_message">Division is required</p>}
                </Form.Group>

                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                  <Form.Label>{t('ManageEmployeePage.TableHeader_BusinessUnit')}</Form.Label>
                  <Form.Control name="businessUnitId" value={businessUnitId} as="select" onChange={this.handleChange}>
                    {businessUnit.map(business => (
                      <option
                        key={business.id}
                        value={business.id}
                      >
                        {business.name}
                      </option>
                    ))}
                  </Form.Control>
                  {isBusinessUnitId && <p className="text-danger validation_message">BusinessUnit is required</p>}
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                  <Form.Label>{t('ManageEmployeePage.TableHeader_Department')}</Form.Label>
                  <Form.Control name="departmentId" value={departmentId} as="select" onChange={this.handleChange}>
                    {department.map(departmentItem => (
                      <option
                        key={departmentItem.id}
                        value={departmentItem.id}
                      >
                        {departmentItem.name}
                      </option>
                    ))}
                  </Form.Control>
                  {isDepartmentId && <p className="text-danger validation_message">Department is required</p>}
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                  <Form.Label>{t('ManageEmployeePage.TableHeader_Team')}</Form.Label>
                  <Form.Control name="teamId" value={teamId} as="select" onChange={this.handleChange}>
                    {team.map(teams => (
                      <option
                        key={teams.id}
                        value={teams.id}
                      >
                        {teams.name}
                      </option>
                    ))}
                  </Form.Control>
                  {isTeamId && <p className="text-danger validation_message">Team is required</p>}
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                  <Form.Label>{t('ManageEmployeePage.Label_Manager')}</Form.Label>
                  <Form.Control name="managerId" value={managerId} as="select" onChange={this.handleChange}>
                    {primaryManager.map(primaryManagerType => (
                      <option
                        key={primaryManagerType.id}
                        value={primaryManagerType.id}
                      >
                        {primaryManagerType.firstName}
                        {' '}
                        {primaryManagerType.lastName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                  <Form.Label>{t('ManageEmployeePage.Label_Employee')}</Form.Label>
                  <Form.Control name="employeesId" value={employeesId} as="select" onChange={this.handleChange}>
                    {emp.map(empItem => (
                      <option
                        key={empItem.id}
                        value={empItem.id}
                      >
                        {empItem.firstName}
                        {' '}
                        {empItem.lastName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                  <Form.Label>{t('CountryText')}</Form.Label>
                  <Form.Control name="countryId" value={countryId} as="select" onChange={this.handleChange}>
                    {allCountry.map(country => (
                      <option
                        key={country.id}
                        value={country.id}
                      >
                        {country.name}
                      </option>
                    ))}
                  </Form.Control>
                  {isCountryId && <p className="text-danger validation_message">Country  is required</p>}
                </Form.Group>

                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                  <Form.Label>{t('ManageEmployeePage.Label_State')}</Form.Label>
                  <Form.Control name="stateId" value={stateId} as="select" onChange={this.handleChange}>
                    {allState.map(state => (
                      <option
                        key={state.id}
                        value={state.id}
                      >
                        {state.name}
                      </option>
                    ))}
                  </Form.Control>
                  {isStateId && <p className="text-danger validation_message">State is required</p>}
                </Form.Group>

                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                  <Form.Label>{t('ManageEmployeePage.Label_City')}</Form.Label>
                  <Form.Control name="cityId" value={cityId} as="select" onChange={this.handleChange}>
                    {allCity.map(city => (
                      <option
                        key={city.id}
                        value={city.name}
                      >
                        {city.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                  <Form.Label>{t('ManageEmployeePage.Label_Worklocation')}</Form.Label>
                  <Form.Control name="locationId" value={locationId} as="select" onChange={this.handleChange}>
                    {allLocation.map(worklocation => (
                      <option
                        key={worklocation.id}
                        value={worklocation.id}
                      >
                        {worklocation.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <div className="col-lg-3 col-md-6 d-flex justify-content-center flex-column">
                  <Button className="" onClick={() => this.submitRequest()}>
                    {' '}
                    {t('ManageEmployeePage.SearchBtn')}
                    {' '}
                  </Button>
                </div>
                {isEnabled && (
                  <div className="col-lg-3 d-flex justify-content-center flex-column">
                    <Button onClick={() => this.resetFilter()}>Reset Filter</Button>
                  </div>
                )}
              </Row>
            </Card>
            {comparisons && Object.keys(comparisons).length !== 0 && (
              <Card className="card_layout">
                <Row>
                  <Col lg={3}>
                    <Table responsive bordered>
                      <thead>
                        <tr>
                          <th>{t('ManageEmployeePage.Label_Manager')}</th>
                          <th>{t('ManageEmployeePage.Label_Employee')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisons && comparisons.userData && comparisons.userData.map(data => (
                          <tr>
                            <td>{data.managerName}</td>
                            <td>{data.userName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                  <Col lg={9}>
                    <Table responsive bordered>
                      <thead>
                        <tr>
                          <th colSpan="2" />
                          <th className="headText">{t('EmployeePage.Jan')}</th>
                          <th>{t('EmployeePage.Feb')}</th>
                          <th>{t('EmployeePage.Mar')}</th>
                          <th>{t('EmployeePage.April')}</th>
                          <th>{t('EmployeePage.May')}</th>
                          <th>{t('EmployeePage.June')}</th>
                          <th>{t('EmployeePage.July')}</th>
                          <th>{t('EmployeePage.Aug')}</th>
                          <th>{t('EmployeePage.Sept')}</th>
                          <th>{t('EmployeePage.Oct')}</th>
                          <th>{t('EmployeePage.Nov')}</th>
                          <th>{t('EmployeePage.Dec')}</th>
                          <th>{t('EmployeePage.Totals')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          comparisons && comparisons.userData && comparisons.userData.map((data) => {
                            const reportArray = this.getReportData(comparisons.reportData, data.userId);

                            return (
                              <tr>
                                <td colSpan="2" />
                                <td>
                                  {this.getMonthWiseData(reportArray, 1, 'overTimeValue')}
                                </td>
                                <td>
                                  {this.getMonthWiseData(reportArray, 2, 'overTimeValue')}
                                </td>
                                <td>
                                  {this.getMonthWiseData(reportArray, 3, 'overTimeValue')}
                                </td>
                                <td>
                                  {this.getMonthWiseData(reportArray, 4, 'overTimeValue')}
                                </td>
                                <td>
                                  {this.getMonthWiseData(reportArray, 5, 'overTimeValue')}
                                </td>
                                <td>
                                  {this.getMonthWiseData(reportArray, 6, 'overTimeValue')}
                                </td>
                                <td>
                                  {this.getMonthWiseData(reportArray, 7, 'overTimeValue')}
                                </td>
                                <td>
                                  {this.getMonthWiseData(reportArray, 8, 'overTimeValue')}
                                </td>
                                <td>
                                  {this.getMonthWiseData(reportArray, 9, 'overTimeValue')}
                                </td>
                                <td>
                                  {this.getMonthWiseData(reportArray, 10, 'overTimeValue')}
                                </td>
                                <td>
                                  {this.getMonthWiseData(reportArray, 11, 'overTimeValue')}
                                </td>
                                <td>
                                  {this.getMonthWiseData(reportArray, 12, 'overTimeValue')}
                                </td>
                                <td>
                                  {this.getTotalData(comparisons.userWiseData, data.userId)}
                                </td>
                              </tr>
                            );
                          })
                        }
                        <tr>
                          <th colSpan="2">{t('EmployessPage.TotalOvertime')}</th>
                          {comparisons && comparisons.monthWiseDataData && (
                            <>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 1, 'totalOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 2, 'totalOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 3, 'totalOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 4, 'totalOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 5, 'totalOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 6, 'totalOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 7, 'totalOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 8, 'totalOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 9, 'totalOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 10, 'totalOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 11, 'totalOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 12, 'totalOverTimeHours')}
                              </td>
                              <td>
                                {this.getTotalHours(comparisons.monthWiseDataData, 'totalOverTimeHours')}
                              </td>
                            </>
                          )}
                        </tr>
                        <tr>
                          <th colSpan="2">{t('EmployessPage.AverageOvertime')}</th>
                          {comparisons && comparisons.monthWiseDataData && (
                            <>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 1, 'averageOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 2, 'averageOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 3, 'averageOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 4, 'averageOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 5, 'averageOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 6, 'averageOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 7, 'averageOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 8, 'averageOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 9, 'averageOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 10, 'averageOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 11, 'averageOverTimeHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 12, 'averageOverTimeHours')}
                              </td>
                              <td>
                                {this.getTotalHours(comparisons.monthWiseDataData, 'averageOverTimeHours')}
                              </td>
                            </>
                          )}
                        </tr>
                        <tr>
                          <th colSpan="2">{t('EmployessPage.RunningTotal')}</th>
                          {comparisons && comparisons.monthWiseDataData && (
                            <>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 1, 'runningTotalHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 2, 'runningTotalHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 3, 'runningTotalHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 4, 'runningTotalHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 5, 'runningTotalHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 6, 'runningTotalHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 7, 'runningTotalHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 8, 'runningTotalHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 9, 'runningTotalHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 10, 'runningTotalHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 11, 'runningTotalHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 12, 'runningTotalHours')}
                              </td>
                              <td>
                                {this.getTotalHours(comparisons.monthWiseDataData, 'runningTotalHours')}
                              </td>
                            </>
                          )}
                        </tr>
                        <tr>
                          <th colSpan="2">{t('EmployessPage.RunningAverage')}</th>
                          {comparisons && comparisons.monthWiseDataData && (
                            <>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 1, 'runningAverageHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 2, 'runningAverageHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 3, 'runningAverageHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 4, 'runningAverageHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 5, 'runningAverageHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 6, 'runningAverageHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 7, 'runningAverageHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 8, 'runningAverageHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 9, 'runningAverageHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 10, 'runningAverageHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 11, 'runningAverageHours')}
                              </td>
                              <td>
                                {this.getMonthWiseData(comparisons.monthWiseDataData, 12, 'runningAverageHours')}
                              </td>
                              <td>
                                {this.getTotalHours(comparisons.monthWiseDataData, 'runningAverageHours')}
                              </td>
                            </>
                          )}
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card>
            )}
            {fileDownload && (
              <Modal
                show={fileDownload}
                onHide={() => this.setState({ fileDownload: false })}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header>
                  Which file you want to Download ?
                </Modal.Header>
                <Modal.Footer>
                  <button
                    type="button"
                    variant="secondary"
                    onClick={() => this.setState({ fileDownload: false })}
                  >
                    Cancel
                  </button>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 50, hide: 40 }}
                    overlay={this.renderTooltip('Excel File')}
                  >
                    <button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        this.getExcelDownload();
                        this.setState({ fileDownload: false });
                      }}
                    >
                      <img src={ExcelIcon} alt="Excel" />
                    </button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 50, hide: 40 }}
                    overlay={this.renderTooltip('Excel File')}
                  >
                    <button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        this.getPdfDownload();
                        this.setState({ fileDownload: false });
                      }}
                    >
                      <img src={PdfIcon} alt="Pdf" />
                    </button>
                  </OverlayTrigger>
                </Modal.Footer>
              </Modal>
            )}
          </Form>
        </div>
      </>
    );
  }
}

export default (withTranslation()(MonthlyComparison));
