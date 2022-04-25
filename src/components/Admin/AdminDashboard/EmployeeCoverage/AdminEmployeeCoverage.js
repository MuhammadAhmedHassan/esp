import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Form, Button, Table, Modal, Row, Card,
} from 'react-bootstrap';
import moment from 'moment';
import Spinner from 'react-bootstrap/Spinner';
import './style.scss';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Api from '../../../common/Api';
import { userService } from '../../../../services';
import RightArrow from '../../../../Images/Icons/next_click.svg';
import LeftArrow from '../../../../Images/Icons/prev_click.svg';
import ReloadIcon from '../../../../Images/Icons/reload.svg';
import Loaders from '../../../shared/Loaders';
import PaginationAndPageNumber from '../../../shared/Pagination';

class AdminEmployeeCoverage extends React.Component {
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
      employees: [],
      allCountry: [{ id: '0', name: 'All' }],
      countryId: 0,
      allState: [{ id: '0', name: 'All' }],
      stateId: 0,
      allCity: [{ id: '0', name: 'All' }],
      allLocation: [{ id: '0', name: 'All' }],
      totalRecords: 0,
      pageIndex: 1,
      pageSize: 10,
      contractTypeId: 0,
      todayText: 'Today',
      city: '',
      organisationId: 0,
      locationId: 0,
      empTypeById: 0,
      errorMessage: '',
      modelUpdate: false,
      employeesId: 0,
      disabledLeft: false,
      disabledRight: false,
    };
  }

  componentDidMount() {
    this.getDivisionsByOrganisationId();
    // this.getAllUserRole();
    this.getAllCountries();
  }

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      const { todayText } = this.state;
      this.setState({
        pageIndex: pageNum,
        loading: false,
      }, () => {
        if (todayText === 'Yesterday') {
          const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
          dt.setDate(dt.getDate() - 1);
          this.getEmployees(true, dt);
        } else if (todayText === 'Tommorrow') {
          const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
          dt.setDate(dt.getDate() + 1);
          this.getEmployees(true, dt);
        } else {
          this.getEmployees();
        }
      });
    }
  }

  updatePageCount = (pageCount) => {
    const { todayText } = this.state;
    this.setState({
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
      loading: false,
    }, () => {
      if (todayText === 'Yesterday') {
        const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
        dt.setDate(dt.getDate() - 1);
        this.getEmployees(true, dt);
      } else if (todayText === 'Tommorrow') {
        const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
        dt.setDate(dt.getDate() + 1);
        this.getEmployees(true, dt);
      } else {
        this.getEmployees();
      }
    });
  }

  bindSubDropDowns = (ddlName, ddlValue) => {
    const defaultSelection = '0';
    const {
      departmentId, teamId,
    } = this.state;
    if (ddlName === 'divisionId') {
      if (ddlValue === defaultSelection) {
        this.setState({
          businessUnit: [{ id: '0', name: 'All' }],
          businessUnitId: 0,
          department: [{ id: '0', name: 'All' }],
          departmentId: 0,
          team: [{ id: '0', name: 'All' }],
          teamId: 0,
          primaryManager: [{ id: '0', firstName: 'All', lastName: '' }],
          managerId: 0,
          emp: [{ id: '0', firstName: 'All', lastName: '' }],
        });
      } else {
        this.getBusinessUnitByDivisionId(ddlValue);
      }
    } else if (ddlName === 'businessUnitId') {
      if (ddlValue === defaultSelection) {
        this.setState({
          department: [{ id: '0', name: 'All' }],
          departmentId: 0,
          team: [{ id: '0', name: 'All' }],
          teamId: 0,
          primaryManager: [{ id: '0', firstName: 'All', lastName: '' }],
          managerId: 0,
          emp: [{ id: '0', firstName: 'All', lastName: '' }],
        });
      } else {
        this.getDepartmentByBusinessUnitId(ddlValue);
      }
    } else if (ddlName === 'departmentId') {
      if (ddlValue === defaultSelection) {
        this.setState({
          team: [{ id: '0', name: 'All' }],
          teamId: 0,
          primaryManager: [{ id: '0', firstName: 'All', lastName: '' }],
          managerId: 0,
          emp: [{ id: '0', firstName: 'All', lastName: '' }],
        });
      } else {
        this.getTeamsByDepartmentId(ddlValue);
        this.getManagerByDepartmentId(ddlValue);
        this.getEmployeeByDepartmentId(ddlValue);
      }
    } else if (ddlName === 'teamId') {
      if (ddlValue === defaultSelection) {
        this.setState({
          primaryManager: [{ id: '0', firstName: 'All', lastName: '' }],
          managerId: 0,
          emp: [{ id: '0', firstName: 'All', lastName: '' }],
        });
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
      if (ddlValue === defaultSelection) {
        this.setState({
          allLocation: [{ id: '0', name: 'All' }],
          allState: [{ id: '0', name: 'All' }],
          stateId: 0,
          allCity: [{ id: '0', name: 'All' }],
        });
      } else {
        this.getStatesByCountryId(ddlValue);
      }
    } else if (ddlName === 'stateId') {
      if (ddlValue === defaultSelection) {
        this.setState({
          allCity: [{ id: '0', name: 'All' }],
          allLocation: [{ id: '0', name: 'All' }],
        });
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
          this.getEmployees();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getDivisionsByOrganisationId());
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
          this.setState({ allCountry: [{ id: '0', firstname: 'All' }].concat(response.data), countryId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAllCountries());
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
          this.setState({ allState: [{ id: '0', firstname: 'All' }].concat(response.data), stateId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getStatesByCountryId(stateId));
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
          this.setState({ allCity: [{ id: '0', firstname: 'All' }].concat(response.data), cityId: 0 });
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
      body: JSON.stringify({
        city: cityId,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          const { data } = response;
          this.setState({
            allLocation: [{ id: '0', firstname: 'All' }].concat(data),
            locationId: 0,
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

  getEmployees = (isNotToday, date, pageIndexTrue) => {
    const {
      token, divisionId, businessUnitId, departmentId, teamId, modelMessage,
      managerId, countryId, stateId, totalRecords, locationId, employeesId,
      pageIndex, pageSize, organisationId, city, userId,
    } = this.state;
    const data = {
      id: 0,
      languageId: 1,
      offset: '',
      isActive: true,
      totalRecords,
      pageIndex: pageIndexTrue ? 1 : (pageSize) * (pageIndex - 1) + 1,
      pageSize,
      organisationId: parseInt(organisationId, 10),
      divisionId: parseInt(divisionId, 10),
      businessUnitId: parseInt(businessUnitId, 10),
      departmentId: parseInt(departmentId, 10),
      teamId: parseInt(teamId, 10),
      managerId: Number(managerId) || 0,
      contractTypeId: 0,
      userId: Number(employeesId) || 0,
      countryId: parseInt(countryId, 10),
      stateId: parseInt(stateId, 10),
      city,
      workLocationId: parseInt(locationId, 0),
      date: isNotToday ? date : moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate(),
    };

    fetch(`${Api.getEmployeeCoverage}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            loading: false,
            employees: response.data,
            pageIndex: Math.floor(response.pageIndex / response.pageSize) + 1 || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmployees(isNotToday, date));
          });
        } else {
          this.handleClose();
          this.setState({
            loading: false,
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })

      .catch((err) => {
        console.error(err.toString());
        this.setState({
          loading: false,
        });
      });
  }

  handleClose = () => {
    this.setState({
      modelUpdate: false,
    });
  };

  resetFilter = () => {
    const { todayText } = this.state;
    this.setState({
      divisionId: 0,
      countryId: 0,
      managerId: 0,
      userId: 0,
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
    },
    () => {
      if (todayText === 'Yesterday') {
        const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
        dt.setDate(dt.getDate() - 1);
        this.getEmployees(true, dt, true);
      } else if (todayText === 'Tommorrow') {
        const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
        dt.setDate(dt.getDate() + 1);
        this.getEmployees(true, dt, true);
      } else { this.getEmployees(null, null, true); }
    });
  }

  handleTime = (time) => {
    const punch = new Date(time);
    return punch.getMinutes() < 10 ? `${punch.getHours()}:0${punch.getMinutes()}` : `${punch.getHours()}:${punch.getMinutes()}`;
  }

  submitRequest() {
    const { todayText } = this.state;
    this.setState({ loading: true },
      () => {
        if (todayText === 'Yesterday') {
          const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
          dt.setDate(dt.getDate() - 1);
          this.getEmployees(true, dt, true);
        } else if (todayText === 'Tommorrow') {
          const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
          dt.setDate(dt.getDate() + 1);
          this.getEmployees(true, dt, true);
        } else { this.getEmployees(null, null, true); }
      });
  }

  handleChange(event) {
    const { target } = event;
    const { name } = target;
    this.setState({ [name]: target.value }, () => this.bindSubDropDowns(name, target.value));
  }

  handleRefresh() {
    const { todayText } = this.state;
    this.setState({ employees: [], loading: true });
    if (todayText === 'Yesterday') {
      this.handleLeftArrow();
    } else if (todayText === 'Tommorrow') {
      this.handleRightArrow();
    } else {
      this.getEmployees();
    }
  }

  handleToday() {
    this.setState({ disabledLeft: false, disabledRight: false });
    this.getEmployees();
  }

  handleLeftArrow() {
    const { disabledRight, pageIndex } = this.state;
    if (disabledRight) {
      this.setState({
        employees: [], disabledRight: false, disabledLeft: false, todayText: 'Today', pageIndex: 1, loading: true, totalRecords: 0,
      }, () => this.getEmployees());
    } else {
      this.setState({
        disabledLeft: true, disabledRight: false, todayText: 'Yesterday', totalRecords: 0,
      },
      () => {
        const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
        dt.setDate(dt.getDate() - 1);
        this.getEmployees(true, dt, true);
      });
    }
  }

  handleRightArrow() {
    const { disabledLeft, pageIndex } = this.state;
    if (disabledLeft) {
      this.setState({
        employees: [], disabledRight: false, disabledLeft: false, todayText: 'Today', pageIndex: 1, totalRecords: 0, loading: true,
      }, () => this.getEmployees());
    } else {
      this.setState({
        disabledRight: true, disabledLeft: false, todayText: 'Tommorrow', totalRecords: 0,
      },
      () => {
        const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
        dt.setDate(dt.getDate() + 1);
        this.getEmployees(true, dt, true);
      });
    }
  }

  render() {
    const {
      divisions, businessUnit, department, team, primaryManager, errorMessage, modelUpdate,
      allCountry, allState, allLocation, loading, employees, emp, allCity, divisionId, countryId,
      businessUnitId, departmentId, teamId, managerId, employeesId, stateId, cityId, locationId,
      disabledLeft, disabledRight, todayText, totalRecords, pageSize, pageIndex,
    } = this.state;
    const { t } = this.props;
    const counter = 1;
    const viewMode = true;
    const isEnabled = divisionId > 0 || countryId > 0;
    return (
      <>
        <div className="container-fluid empCoverage">
          <Card className="card_layout">
            <Card.Header className="coverageHeading px-0">
              <h3>Admin Employee Coverage</h3>
            </Card.Header>
            <Form className="row">
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
                <Form.Label>{t('Employee')}</Form.Label>
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
                <Form.Label>{t('Country')}</Form.Label>
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
                  {t('Search')}
                  {' '}
                </Button>
              </div>
              {isEnabled && (
              <div className="d-flex justify-content-center flex-column">
                <Button onClick={() => this.resetFilter()}>Reset Filter</Button>
              </div>
              )}
            </Form>
          </Card>
          <div className="empcoverage">
            <div className="card_layout p-0">
              {loading
                ? (
                  <Loaders />
                )
                : (
                  <>
                    <Row className="reloadBtn">
                      <button type="button" className="arrowBtn mx-2" onClick={() => this.handleRefresh()}><img className="pointer" src={ReloadIcon} alt="reload icon" /></button>
                      <button
                        type="button"
                        className="mx-2 arrowBtn"
                        disabled={disabledLeft}
                        onClick={() => this.handleLeftArrow()}
                      >
                        <img src={LeftArrow} alt="left arrow" />
                      </button>
                      <div>
                        {todayText}
                      </div>
                      <button
                        type="button"
                        className="mx-2 arrowBtn"
                        disabled={disabledRight}
                        onClick={() => this.handleRightArrow()}
                        aria-hidden
                      >
                        <img src={RightArrow} alt="right arrow" />
                      </button>
                    </Row>
                    <Table responsive striped>
                      <thead>
                        <tr>
                          <th>{ t('EmployeeCoverage.Sr')}</th>
                          <th className="text-left">{ t('EmployeeCoverage.EmployeeName')}</th>
                          <th>{ t('EmployeeCoverage.EmployeePicture')}</th>
                          <th className="text-left">{ t('EmployeeCoverage.CurrentStatus')}</th>
                          <th>{ t('EmployeeCoverage.ClockedIn')}</th>
                          <th>{ t('EmployeeCoverage.ClockedOut')}</th>
                          <th className="text-left">{ t('EmployeeCoverage.CurrentShift')}</th>
                          <th className="text-left">{ t('EmployeeCoverage.Geolocations')}</th>
                        </tr>
                      </thead>
                      { employees && (
                      <tbody>
                        {employees.map((data, index) => (
                          <tr>
                            <td>
                              {pageSize * (pageIndex - 1) + index + 1}
                            </td>
                            <td className="text-left">
                              <Link className="linkLine" to={`/profile/${data.userId}/true`}>
                                {data.employeeName}
                              </Link>
                            </td>
                            <td>
                              <div className="profileImage">
                                <img src={data.profileImage} alt="User profile" />
                              </div>
                            </td>
                            <td className="text-left">
                              {data.currentStatus === null ? ' - ' : data.currentStatus}
                            </td>
                            <td>
                              {data.clockInDateTimeUtc === null ? ' - ' : this.handleTime(data.clockInDateTimeUtc)}
                            </td>
                            <td>
                              {data.clockOutDateTimeUtc === null ? ' - ' : this.handleTime(data.clockOutDateTimeUtc)}
                            </td>
                            <td className="text-left">
                              {data.shiftTitle}
                            </td>
                            <td className="text-left">
                              {data.geoLocation}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      )}
                    </Table>
                  </>
                )
            }

              { !loading && employees && employees.length === 0 && (
                <p className="text-center p-3">No data available</p>
              )}
            </div>
          </div>
          {
                    totalRecords > 0 && (
                    <div className="pageDiv">
                      <PaginationAndPageNumber
                        totalPageCount={Math.ceil(totalRecords / pageSize)}
                        totalElementCount={totalRecords}
                        updatePageNum={this.updatePageNum}
                        updatePageCount={this.updatePageCount}
                        currentPageNum={pageIndex}
                        recordPerPage={pageSize}
                      />
                    </div>
                    )
          }
        </div>
      </>
    );
  }
}

export default (withTranslation()(AdminEmployeeCoverage));
