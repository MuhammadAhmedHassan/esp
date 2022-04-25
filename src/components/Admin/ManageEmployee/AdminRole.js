import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Form, Button, Table, Modal, OverlayTrigger, Tooltip, Col,
} from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import './style.scss';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Api from '../../common/Api';
import DelegationIcon from '../../../Images/Icons/delegation.svg';
import { userService } from '../../../services';
import Loaders from '../../shared/Loaders';
import viewIcon from '../../../Images/Icons/viewIcon.svg';
import EditIcon from '../../../Images/Icons/Edit.svg';
import ApiResponsePopup from '../../shared/Common/ApiResponsePopup';

const mapStateToProps = state => ({
  // To get the list of employee details from store
  loggedUserRole: state.checkUserRole.user,
  userId: state.checkUserRole.user.userId,
  roleId: state.checkUserRole.user.role,
});
const { impersonationSubject } = userService;
let impersentSubscriber;

class AdminRole extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const statusLst = [
      { id: 1, value: 'Active' },
      { id: 2, value: 'In Active' },
    ];
    const userId = userService.getUserId();
    this.handleChange = this.handleChange.bind(this);
    const user = userService.getUser();
    const impUser = userService.getImpUser();
    this.submitRequest = this.submitRequest.bind(this);
    this.state = {
      user,
      impUser,
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
      totalRecords: 10,
      pageIndex: 1,
      pageSize: 10,
      contractTypeId: 0,
      city: '',
      organisationId: 0,
      empTypeById: 0,
      errorMessage: '',
      modelUpdate: false,
      employeesId: 0,
      showModal: false,
      modalMessage: '',
      isImpersenating: false,
      statusId: props.status,
      statusLst,
      showModel: false,
      body: '',
    };
  }

  componentDidMount() {
    impersentSubscriber = impersonationSubject.subscribe((val) => {
      this.setState({ isImpersenating: val.showName });
    });
    this.getDivisionsByOrganisationId();
    this.getAllCountries();
  }

  componentDidUnmount() {
    if (impersentSubscriber) {
      impersentSubscriber.unsubscribe();
    }
  }


  bindSubDropDowns = (ddlName, ddlValue) => {
    const defaultSelection = '0';
    const {
      departmentId, teamId,
    } = this.state;
    if (ddlName === 'divisionId') {
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
      if (ddlValue === defaultSelection) {
        this.setState({ department: [{ id: '0', name: 'All' }], departmentId: 0 });
        this.setState({ team: [{ id: '0', name: 'All' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'All', lastName: '' }], managerId: 0 });
        this.setState({ emp: [{ id: '0', firstName: 'All', lastName: '' }] });
      } else {
        this.getDepartmentByBusinessUnitId(ddlValue);
      }
    } else if (ddlName === 'departmentId') {
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
      if (ddlValue === defaultSelection) {
        this.setState({ allLocation: [{ id: '0', name: 'All' }] });
        this.setState({ allState: [{ id: '0', name: 'All' }], stateId: 0 });
        this.setState({ allCity: [{ id: '0', name: 'All' }] });
      } else {
        this.getStatesByCountryId(ddlValue);
      }
    } else if (ddlName === 'stateId') {
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
          this.setState({ allCountry: [{ id: '0', firstname: 'All' }].concat(response.data), stateId: 0 });
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
      body: JSON.stringify({
        id: cityId,
      }),
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

  getEmployees = () => {
    const {
      token, divisionId, businessUnitId, departmentId, teamId, modelMessage,
      managerId, countryId, stateId, totalRecords, empTypeById,
      pageIndex, pageSize, contractTypeId, organisationId, city, employeesId, isImpersenating,
      statusId,
    } = this.state;

    const user = userService.getUser();
    const userRoles = userService.getRole();
    const userId = userService.getUserId();
    const impUser = userService.getImpUser();

    const names = userRoles.map(x => (x.id));
    const userRoleIds = names.toString();

    let isAdministratorRole = false;
    if (userRoles.find(role => role.name === 'Administrators')) {
      isAdministratorRole = true;
    } else {
      isAdministratorRole = false;
    }
    const data = {
      id: 0,
      languageId: 0,
      offset: '',
      role: '',
      isActive: true,
      isActiveUsers: parseInt(statusId, 10) === 1,
      roleIds: userRoleIds,
      publicKey: 'string',
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
      city,
      workLocationId: 0,
      userRoleIds: '',
      empTypeById: parseInt(empTypeById, 10),
    };
    fetch(`${Api.manageEmp.searchuser}`, {
      method: 'POST',
      headers: new Headers({
        token: userService.getToken(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ loading: false, employees: response.data });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmployees());
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

  updateUserStatus = (userId, status) => {
    const user = userService.getUser();
   
    const data = {
      languageId: 1,
      offset: '',
      isActive: status,
      userId,
      isUserActive: status,
    };

    fetch(`${Api.manageEmp.updateUserStatus}`, {
      method: 'POST',
      headers: new Headers({
        token: userService.getToken(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ loading: false });
          this.setState({
            showModel: true,
            // eslint-disable-next-line react/no-unused-state
            body: response.message,
          });
          this.getEmployees();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.updateUserStatus(userId, status));
          });
        }
      })

      .catch(err => console.error(err.toString()));
  }

  handleImpersonation = (id, email) => {
    const userId = userService.getUserId();
    if (id != userId) {
      const {
        languageId, token, user,
      } = this.state;

      this.setState({ loaded: true, id });
      const data = {
        languageId: 1,
        impersonatorId: parseInt(userId, 10),
        impersonateeId: parseInt(id, 10),
      };
      fetch(`${Api.delegation.startImpersonation}`, {
        method: 'POST',
        headers: {
          token: userService.getToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),

      }).then(response => response.json())
        .then((response) => {
          if (response.statusCode === 200) {
            sessionStorage.clear();
            this.setState({
              showModal: true,
              isImpersenating: true,
              modalMessage: 'Delegation has been started',
            });
            const impUser = userService.getUser();
            const oldUser = userService.getUser();
            document.cookie = `espImp=${JSON.stringify(oldUser || {})};path=/`;
            impUser.accessToken = `${response.data.accessToken}`;
            impUser.refreshToken = `${response.data.refreshToken}`;
            impUser.expires = `${response.data.impersonationEndDate}`;
            impUser.role = response.data.role;
            impUser.impersonatorName = `${response.data.userName}`;
            impUser.userId = Number(response.data.userId);
            impUser.email = email;
            document.cookie = `espUser=${JSON.stringify(impUser || {})};expires=${response.data.impersonationEndDate ? new Date(response.data.impersonationEndDate) : new Date()};path=/`;
            impersonationSubject.next({ showName: true, name: impUser.impersonatorName });
            this.setState({ impUser });
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.handleImpersonation(id, email));
            });
          } else {
            this.setState({
              showModal: true,
              modalMessage: response.message,
              loaded: false,
            });
          }
        });
    } else {
      this.setState({
        showModal: true,
        modalMessage: 'Impersonatee and impersonater Id is same',
        loaded: false,
      });
    }
  }

  handleClose = () => {
    this.setState({
      modelUpdate: false,
      showModal: false,
    });
  };

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
      statusId: 1,
      businessUnit: [{ id: '0', name: 'All' }],
      department: [{ id: '0', name: 'All' }],
      team: [{ id: '0', name: 'All' }],
      primaryManager: [{ id: '0', firstName: 'All', lastName: '' }],
      emp: [{ id: '0', firstName: 'All', lastName: '' }],
      allState: [{ id: '0', name: 'All' }],
      allCity: [{ id: '0', name: 'All' }],
      allLocation: [{ id: '0', name: 'All' }],

    });
  }

  submitRequest() {
    this.setState({ loading: true }, () => this.getEmployees());
  }

  handleChange(event) {
    const { target } = event;
    const { name } = target;
    this.setState({ [name]: target.value }, () => this.bindSubDropDowns(name, target.value));
  }

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  closeResponseModel = () => {
    this.setState({
      showModel: false,
      body: '',
    });
  };

  render() {
    const {
      divisions, businessUnit, department, team, primaryManager, errorMessage, modelUpdate,
      allCountry, allState, allLocation, loading, employees, emp, allCity, divisionId, countryId,
      businessUnitId, departmentId, teamId, managerId, modalMessage, employeesId, isImpersenating, confirmDelegation, stateId, cityId, locationId, showModal,
      statusId, statusLst, showModel, body,
    } = this.state;
    const { t } = this.props;
    let counter = 1;
    const viewMode = true;
    const isEnabled = divisionId > 0 || countryId > 0;
    return (
      <>
        {showModel && (
        <ApiResponsePopup
          body={body}
          closeResponseModel={this.closeResponseModel}
        />
        ) }
        <div className="card_layout">
          <div className="row">
            <div className="col-md-12">
              {/* {loggedUserRole.userName}
              {' '}
              - User ID:
              {' '}
              {loggedUserRole.userId} */}
            </div>
          </div>
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
              <Form.Label>{t('EmployeeText')}</Form.Label>
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
            <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
              <Form.Label>{t('ManageEmployeePage.Status')}</Form.Label>
              <Form.Control name="statusId" value={statusId} as="select" onChange={this.handleChange}>
                {statusLst.map(status => (
                  <option
                    key={status.id}
                    value={status.id}
                  >
                    {status.value}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Col md={12} className="text-center">
              <Button className="manageEmpSearch mb-2" onClick={() => this.submitRequest()}>
                {' '}
                {t('SearchBtn')}
                {' '}
              </Button>
              {isEnabled && (
                <Button className="mb-2" onClick={() => this.resetFilter()}>Resest Filter</Button>
              )}
            </Col>
            
          </Form>
        </div>
        
        <div className="searchData">
        
          <div className="card_layout p-0">
            {loading
              ? (
                <Loaders />
              )
              : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>{t('SrNo')}</th>
                      <th>{t('ManageEmployeePage.TableHeader_Location')}</th>
                      <th>{t('ManageEmployeePage.TableHeader_Division')}</th>
                      <th>{t('ManageEmployeePage.TableHeader_BusinessUnit')}</th>
                      <th>{t('ManageEmployeePage.TableHeader_Department')}</th>
                      <th>{t('ManageEmployeePage.TableHeader_Team')}</th>
                      <th>{t('ManageEmployeePage.TableHeader_PrimaryManager')}</th>
                      <th>{t('ManageEmployeePage.TableHeader_SecManager')}</th>
                      <th>{t('ManageEmployeePage.TableHeader_ContractType')}</th>
                      <th>{t('UserRoleText')}</th>
                      <th>{t('EmployeeNameText')}</th>
                      <th>{t('Action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(data => (
                      <tr>
                        <td>
                          {counter++}
                        </td>
                        <td>
                          {data.workLocation}
                        </td>
                        <td>
                          {data.division}
                        </td>
                        <td>
                          {data.businessUnit}
                        </td>
                        <td>
                          {data.department}
                        </td>
                        <td>
                          {data.team}
                        </td>
                        <td>
                          {data.primaryManager}
                        </td>
                        <td>
                          {data.secondaryManager}
                        </td>
                        <td>
                          {data.contractType}
                        </td>
                        <td>
                          {data.userRoles}
                        </td>
                        
                        <td>
                          {`${data.firstName} ${data.lastName}`}
                        </td>
                        <td>
                          {data.isActiveUsers && (
                            <Button variant="secondary" onClick={() => { this.updateUserStatus(data.id, false); }}>
                              Inactive
                            </Button>
                          )}
                          {!data.isActiveUsers && (
                            <Button variant="secondary" onClick={() => { this.updateUserStatus(data.id, true); }}>
                              Active
                            </Button>
                          )}
                          
                          <Link to={`/profile/${data.id}/${viewMode}`} className="btn btn-outline-secondary mt-2">
                            
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 40 }}
                              overlay={this.renderTooltip('View Icon', 'viewTooltip')}
                            >
                              <img src={viewIcon} alt="View Icon" />
                            </OverlayTrigger>
                          </Link>
                          { !isImpersenating && (
                            <Link to={`/profile/${data.id}`} className="btn btn-outline-secondary mt-2">
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 40 }}
                                overlay={this.renderTooltip('Edit', 'editTooltip')}
                              >
                                <img src={EditIcon} alt="Edit Icon" />
                              </OverlayTrigger>
                              
                            </Link>
                          )}
                          { !isImpersenating && (
                          <div className="impersonation pointer" onClick={() => this.handleImpersonation(data.id, data.email)}>
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 40 }}
                              overlay={this.renderTooltip('Impersonation')}
                            >
                              <img alt="Impersonation" src={DelegationIcon} />
                            </OverlayTrigger>
                          </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )
            }
            {showModal && (
            <Modal
              show={showModal}
              onHide={() => this.handleClose()}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                {modalMessage}
              </Modal.Header>
              <Modal.Footer>
                { isImpersenating && (
                  <Button variant="secondary" onClick={() => { this.handleClose(); window.location.replace('/'); }}>
                    OK
                  </Button>
                )}

                { !isImpersenating && (
                  <Button variant="secondary" onClick={this.handleClose}>
                    OK
                  </Button>
                )}
              </Modal.Footer>
            </Modal>
            )}
          </div>
        </div>
        {modelUpdate && (
          <Modal
            show={this.getEmployees}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{t('AclPage.assignPermission.Title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
              {errorMessage}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                {t('CancelBtn')}
              </Button>
              <Button variant="primary" type="submit" onClick={this.updateUser}>
                {t('SubmitBtn')}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps, null,
)(withTranslation()(AdminRole));
