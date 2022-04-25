import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Row,
  Table,
  Col,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import './style.scss';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PaginationAndPageNumber from '../../../shared/Pagination';
import Api from '../../../common/Api';
import { userService } from '../../../../services';
import ReloadIcon from '../../../../Images/Icons/reload.svg';
import Loaders from '../../../shared/Loaders';
import { commonService } from '../../../../services/common.service';

class AdminSystemUsage extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    this.handleChange = this.handleChange.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
    this.state = {
      token: `${token}`,
      loading: false,
      totalRecords: 0,
      pageIndex: 1,
      pageSize: 10,
      activityId: 0,
      systemData: [],
      fromDate: moment(`${moment().get('month') + 1}-01-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate(),
      toDate: moment(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate(),
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
      contractTypeId: 0,
      employeesId: 0,
      activities: [{ id: '0', activityTypeName: 'All' }],
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    Promise.all([
      this.getSystemUsage(),
      this.activityType(),
      this.getDivisionsByOrganisationId(),
      this.getAllCountries(),
    ]).then((response) => {
    })
      .catch((error) => {
        console.log(error);
      });
  }
  

  bindSubDropDowns = (ddlName, ddlValue) => {
    const defaultSelection = '0';
    const {
      departmentId, teamId,
    } = this.state;
    if (ddlName === 'activityId') {
      if (ddlValue === defaultSelection) {
        this.setState({ activities: [{ id: '0', activityTypeName: 'All' }], activityId: 0 });
      }
    } else if (ddlName === 'divisionId') {
      if (ddlValue === defaultSelection) {
        this.setState({ businessUnit: [{ id: '0', name: 'All' }], businessUnitId: 0 },
          { department: [{ id: '0', name: 'All' }], departmentId: 0 },
          { team: [{ id: '0', name: 'All' }], teamId: 0 },
          { primaryManager: [{ id: '0', firstName: 'All', lastName: '' }], managerId: 0 },
          { emp: [{ id: '0', firstName: 'All', lastName: '' }] });
      } else {
        this.getBusinessUnitByDivisionId(ddlValue);
      }
    } else if (ddlName === 'businessUnitId') {
      if (ddlValue === defaultSelection) {
        this.setState({ department: [{ id: '0', name: 'All' }], departmentId: 0 },
          { team: [{ id: '0', name: 'All' }], teamId: 0 },
          { primaryManager: [{ id: '0', firstName: 'All', lastName: '' }], managerId: 0 },
          { emp: [{ id: '0', firstName: 'All', lastName: '' }] });
      } else {
        this.getDepartmentByBusinessUnitId(ddlValue);
      }
    } else if (ddlName === 'departmentId') {
      if (ddlValue === defaultSelection) {
        this.setState({ team: [{ id: '0', name: 'All' }], teamId: 0 },
          { primaryManager: [{ id: '0', firstName: 'All', lastName: '' }], managerId: 0 },
          { emp: [{ id: '0', firstName: 'All', lastName: '' }] });
      } else {
        this.getTeamsByDepartmentId(ddlValue);
        this.getManagerByDepartmentId(ddlValue);
        this.getEmployeeByDepartmentId(ddlValue);
      }
    } else if (ddlName === 'teamId') {
      if (ddlValue === defaultSelection) {
        this.setState({ primaryManager: [{ id: '0', firstName: 'All', lastName: '' }], managerId: 0 },
          { emp: [{ id: '0', firstName: 'All', lastName: '' }] });
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
        this.setState({ allLocation: [{ id: '0', name: 'All' }] },
          { allState: [{ id: '0', name: 'All' }], stateId: 0 },
          { allCity: [{ id: '0', name: 'All' }] });
      } else {
        this.getStatesByCountryId(ddlValue);
      }
    } else if (ddlName === 'stateId') {
      if (ddlValue === defaultSelection) {
        this.setState({ allCity: [{ id: '0', name: 'All' }] },
          { allLocation: [{ id: '0', name: 'All' }] });
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

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
        loading: false,
      }, () => this.getSystemUsage());
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
      loading: false,
    }, () => this.getSystemUsage());
  }

  getDivisionsByOrganisationId = () => {
    const {
      token, modelMessage,
    } = this.state;

    this.setState({ loading: true });
    return fetch(`${Api.manageEmp.getdivisionsbyorganisationid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: 0,
        languageId: 1,

      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ divisions: [{ id: '0', name: 'All' }].concat(response.data), divisionId: 0 });
          this.getSystemUsage();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getDivisionsByOrganisationId());
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
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
          this.setState({
            modelMessage: !modelMessage,
          });
        }
      })

      .catch(err => console.error(err.toString()));
  }

  getDepartmentByBusinessUnitId = (businessUnitId) => {
    const {
      token, modelMessage,
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
          this.setState({
            modelMessage: !modelMessage,
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
          this.setState({
            modelMessage: !modelMessage,
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
          this.setState({
            modelMessage: !modelMessage,
            
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
          this.setState({
            modelMessage: !modelMessage,
            
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
          this.setState({
            modelMessage: !modelMessage,
            
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
          this.setState({
            modelMessage: !modelMessage,
            
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
          this.setState({
            modelMessage: !modelMessage,
            
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getAllCountries = () => {
    const {
      token, modelMessage,
    } = this.state;
    return fetch(`${Api.manageEmp.getallcountries}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: 0,
        languageId: 1,
        showUnpublished: false,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ allCountry: [{ id: '0', firstname: 'All' }].concat(response.data), stateId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAllCountries());
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
            
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
          this.setState({
            modelMessage: !modelMessage,
            
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
          this.setState({
            modelMessage: !modelMessage,
            
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
        }  else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.searchWorkLocation(cityId));
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
            
          });
        }
      })
      .catch(err => console.error(err.toString()));
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
      activityId: 0,
      fromDate: moment(`${moment().get('month') + 1}-01-${moment().get('year')}`, 'MM-DD-YYYY').utc(),
      toDate: moment(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate(),
    }, () => this.loadData());
  }
  
  activityType = () => {
    const {
      token, modelMessage,
    } = this.state;
  
    const data = {
      id: 0,
      languageId: 1,
      offset: '',
      isActive: true,
    };
    fetch(`${Api.systemUsage.activityType}`, {
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
          this.setState({ loading: false, activities: [{ id: '0', name: 'All' }].concat(response.data), activityId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.activityType());
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getSystemUsage = () => {
    const {
      activityId, token, modelMessage, totalRecords, fromDate, toDate,
      pageIndex, pageSize, managerId, divisionId, countryId, departmentId, teamId,
      employeesId, contractTypeId, locationId, businessUnitId, stateId,
    } = this.state;
    const userId = userService.getUserId();
    this.setState({ loading: true });
    const data = {
      id: 0,
      languageId: 1,
      offset: '',
      isActive: true,
      totalRecords,
      pageIndex: (pageSize) * (pageIndex - 1) + 1,
      pageSize,
      workLocationId: parseInt(locationId, 10) || 0,
      divisionId: parseInt(divisionId, 10) || 0,
      businessUnitId: parseInt(businessUnitId, 10) || 0,
      departmentId: parseInt(departmentId, 10) || 0,
      teamId: parseInt(teamId, 10) || 0,
      managerId: parseInt(managerId, 10) || 0,
      userId: parseInt(employeesId, 10) || 0,
      contractTypeId: parseInt(contractTypeId, 10) || 0,
      countryId: parseInt(countryId, 10) || 0,
      stateId: parseInt(stateId, 10) || 0,
      userRoleIds: '',
      activityTypeId: parseInt(activityId, 0) || 0,
      startDate: fromDate,
      endDate: toDate,
    };
    return fetch(`${Api.systemUsage.systemData}`, {
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
          const systemArray = response.data.filter(item => item.activityTypeId !== 14 && item.activityTypeId !== 15);
          this.setState({
            loading: false,
            systemData: systemArray,
            pageIndex: Math.floor(response.pageIndex / response.pageSize) + 1 || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords - 2,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getSystemUsage());
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
            loading: false,
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

  handleFromDateChange(date) {
    const { toDate } = this.state;
    if ((Date.parse(toDate) < Date.parse(date))) {
      this.setState({ fromDateIsGreater: true, toDateIsSmaller: false });
    } else {
      this.setState({ fromDateIsGreater: false, toDateIsSmaller: false });
    }
    this.setState({
      fromDate: date,
    });
  }


  handleToDateChange(date) {
    const { fromDate } = this.state;
    if ((Date.parse(date) < Date.parse(fromDate))) {
      this.setState({ toDateIsSmaller: true, fromDateIsGreater: false });
    } else {
      this.setState({ toDateIsSmaller: false, fromDateIsGreater: false });
    }
    this.setState({
      toDate: date,
    });
  }


  handleChange(event) {
    const { target } = event;
    const { name } = target;
    this.setState({ [name]: target.value }, () => this.bindSubDropDowns(name, target.value));
  }

  submitRequest() {
    this.setState({ loading: true }, () => this.getSystemUsage());
  }

  handleRefresh() {
    this.setState({ systemData: [] });
    this.getSystemUsage();
  }

  render() {
    const {
      divisions, businessUnit, department, team, primaryManager, emp, allCity, allLocation,
      divisionId, countryId, departmentId, teamId, managerId, employeesId,
      fromDateIsGreater, toDateIsSmaller, locationId, businessUnitId, allCountry, stateId,
      allState, cityId, loading, activities, activityId, pageIndex, pageSize, totalRecords,
      toDate, fromDate, systemData,
    } = this.state;
    const { t } = this.props;
    const isEnabled = divisionId > 0 || countryId > 0 || activityId > 0;
    return (
      <>
        <div className="container-fluid coverage">
          <Card className="card_layout">
            <Row>
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
                <Form.Label>{t('ManageEmployeePage.Label_Country')}</Form.Label>
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
              <Col lg={3}>
                <Form.Label htmlFor={fromDate}>{t('SystemUsage.StartDate')}</Form.Label>
                <DatePicker
                  name="fromDate"
                  selected={fromDate}
                  autoComplete="off"
                  onChange={this.handleFromDateChange}
                  placeholderText="MM/DD/YYYY"
                  dateFormat="MM/dd/yyyy"
                  className="form-control cal_icon"
                  pattern="\d{2}\/\d{2}/\d{4}"
                />
                {fromDateIsGreater
                    && <div className="text-danger">{t('SystemUsage.StartDate_reqText')}</div>
                  }
              </Col>

              <Col lg={3}>
                <Form.Label htmlFor={toDate}>{t('SystemUsage.EndDate')}</Form.Label>
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
                    && <div className="text-danger">{t('SystemUsage.EndDate_reqText')}</div>
                  }
              </Col>
              <Col lg={3}>
                <Form.Label>
                  {t('SystemUsage.ActivityType')}
                </Form.Label>
                <Form.Control name="activityId" value={activityId} as="select" onChange={this.handleChange}>
                  {activities.map(activity => (
                    <option
                      key={activity.id}
                      value={activity.id}
                    >
                      {activity.activityTypeName}
                    </option>
                  ))}
                </Form.Control>
              </Col>
              <Col lg={3}>
                <div className="d-flex justify-content-center flex-column">
                  <Button className="" onClick={() => this.submitRequest()}>
                    {' '}
                    {t('SystemUsage.Search')}
                    {' '}
                  </Button>
                </div>
              </Col>
              <Col lg={3}>
                {isEnabled && (
                <div className="d-flex justify-content-center flex-column">
                  <Button onClick={() => this.resetFilter()}>Reset Filter</Button>
                </div>
                )}
              </Col>
            </Row>
          </Card>
          <Card className="card_layout p-0">
            {loading
              ? (
                <Loaders />
              )
              : (
                <>
                  <Row className="reloadBtn">
                    <button type="button" className="arrowBtn mx-2" onClick={() => this.handleRefresh()}><img className="pointer" src={ReloadIcon} alt="reload icon" /></button>
                  </Row>
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>{t('SystemUsage.Sr')}</th>
                        <th className="text-left">{t('SystemUsage.Activity')}</th>
                        <th>{t('SystemUsage.Count')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {systemData && systemData.map((data, index) => (
                        <tr>
                          <td>{pageSize * (pageIndex - 1) + index + 1}</td>
                          <td className="text-left">{data.activityTypeName}</td>
                          <td>
                            <Link className="linkLine" to={`/adminDashboard/usageDetails/?roleId=2&activityName=${data.activityTypeName}&activityId=${data.activityTypeId}&fromDate=${moment.utc(fromDate).local().format('MM/DD/YYYY')}&toDate=${moment.utc(toDate).local().format('MM/DD/YYYY')}&managerId=${managerId}&departmentId=${departmentId}&businessUnitId=${businessUnitId}&divisionId=${divisionId}&teamId=${teamId}&userId=${employeesId}&countryId=${countryId}&stateId=${stateId}&cityId=${cityId}&workLocationId=${locationId}}`}>
                              {data.activityCount}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )
            }
          </Card>
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

export default (withTranslation()(AdminSystemUsage));
