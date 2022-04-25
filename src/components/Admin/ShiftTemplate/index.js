import React from 'react';
import {
  Form,
  Col,
  Dropdown,
  Row,
  Table,
  Modal,
  Tooltip, OverlayTrigger,
}
  from 'react-bootstrap';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { commonService } from '../../../services/common.service';
import EyeView from '../../../Images/Icons/Eye.svg';
import EditIcon from '../../../Images/Icons/Edit.svg';
import DeleteIcon from '../../../Images/Icons/delete.svg';
import handIcon from '../../../Images/Icons/hand.svg';
import Api from '../../common/Api';
import { userService } from '../../../services';
import LoadingSpinner from '../../shared/LoadingSpinner';
import PaginationAndPageNumber from '../../shared/Pagination/index';
import store from '../../../store/store';
import PostApiCall from '../../common/serviceCall/PostApiCall';
import './style.scss';

/**
 * Import declaration ends
 */

const tableHeader = [
  {
    label: 'Schedule Name',
    class: 'text-left',
  },
  {
    label: 'Shift Template Label',
  },
  {
    label: 'Shift Type',
  },
  {
    label: 'Start Date',
  },
  {
    label: 'End Date',
  },
  {
    label: 'Actions',
  },
];
class ShiftTemplateListing extends React.PureComponent {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      loading: false,
      token: `${token}`,
      userId,
      clientId: 0,
      tableData: [],
      pageSize: 10,
      pageIndex: 1,
      roleIds: '',
      clients: [],
      clientName: 'All',
      scheduleTypeName: 'All',
      totalUserId: 0,
      useScheduleId: 0,
      useClientId: 0,
      schedules: [],
      useShiftName: '',
      divisions: [],
      divisionId: 0,
      businessUnitId: 0,
      businessUnit: [{ id: '0', name: 'All' }],
      departmentId: 0,
      department: [{ id: '0', name: 'All' }],
      teamId: 0,
      team: [{ id: '0', name: 'All' }],
      managerId: userService.getRole().some(role => role.name === 'Administrators') ? 0 : userId,
      primaryManager: [{ id: '0', firstName: 'All', lastName: '' }],
      formError: {
        useClientErr: '',
        useShiftNameErr: '',
        useScheduleErr: '',
      },
      scheduleTypeDd: [
        {
          name: 'All',
          id: 0,
        },
        {
          name: 'No user or Open Shift',
          id: 1,
        },
        {
          name: 'Single User or Individual',
          id: 2,
        },
        {
          name: 'Team',
          id: 3,
        },
      ],
      isAdministratorRole: userService.getRole().some(role => role.name === 'Administrators'),
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount = async () => {
    const { token } = this.state;
    window.scrollTo(0, 0);
    const getStoreState = store.getState();
    const names = getStoreState.checkUserRole.user.role.map(x => (x.id));
    const userRoleIds = names.toString();
    this.getDivisionsByOrganisationId();
    this.setState({ roleIds: userRoleIds });
    try {
      const getClientsData = await PostApiCall(`${Api.getAllClients}`, { languageId: 1 }, token);
      this.setState({ clients: [].concat(getClientsData.data) });
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
      this.setState({ loading: false });
    }
    this.getShiftTemplates();
  }

  componentDidUpdate() {
    const { loading } = this.state;
    if (!loading) {
      this.getShiftTemplates();
    }
  }
   
  renderTooltip = (props, id) => (
    <Tooltip id={id} {...props}>
      {props}
    </Tooltip>
  );

  getShiftTemplates() {
    const {
      token, userId, roleIds, totalUserId, clientId, pageIndex, pageSize,
      businessUnitId, departmentId, teamId, managerId, divisionId,
    } = this.state;
    this.setState({ loading: true });
    fetch(`${Api.shift.searchShiftTemplate}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: `${token}`,
      }),
      body: JSON.stringify({
        id: 0,
        languageId: 1,
        isActive: true,
        totalRecords: 0,
        pageIndex: parseInt(pageIndex, 10),
        pageSize: parseInt(pageSize, 10),
        userId,
        clientId,
        totalUserId,
        roleIds,
        divisionId: parseInt(divisionId, 10),
        businessUnitId: parseInt(businessUnitId, 10),
        departmentId: parseInt(departmentId, 10),
        teamId: parseInt(teamId, 10),
        managerId: parseInt(managerId, 10),
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            tableData: response.data,
            totalRecords: response.totalRecords,
            loading: true,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getShiftTemplates());
          });
        } else {
          // eslint-disable-next-line no-alert
          alert(`Error while fetching the schedules. Please try again after sometime. The error is ${response.message}`);
          this.setState({
            loading: true,
          });
        }
        this.setState({ loading: true });
      }).catch((err) => {
        // eslint-disable-next-line no-alert
        alert('Error while fetching the schedules. Please try again after sometime', err);
        this.setState({ loading: true });
      });
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
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })

      .catch(err => console.error(err.toString()));
  }

  getSchedule() {
    const {
      token, userId, useClientId,
    } = this.state;
    this.setState({ loading: true });
    fetch(`${Api.schedule.getAllByUserId}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: `${token}`,
      }),
      body: JSON.stringify({
        languageId: 1,
        id: userId,
        clientId: Number(useClientId),
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            schedules: response.data,
            loading: false,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getSchedule());
          });
        } else {
          // eslint-disable-next-line no-alert
          alert(`Error while fetching the schedules. Please try again after sometime. The error is ${response.message}`);
        }
        this.setState({ loading: false });
      }).catch((err) => {
        // eslint-disable-next-line no-alert
        alert('Error while fetching the schedules. Please try again after sometime', err);
        this.setState({ loading: false });
      });
  }

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
        loading: false,
      });
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: pageCount,
      pageIndex: 1,
      loading: false,
    });
  }

  handleDropDown = (selectedVal, stateName, filterFrom, stateTitle) => {
    // eslint-disable-next-line react/destructuring-assignment
    const getStateValue = this.state[filterFrom];
    const filteredValue = getStateValue.filter(objVal => objVal.id === Number(selectedVal));
    this.setState({ [stateTitle]: filteredValue[0].name, [stateName]: Number(selectedVal) });
  }

  viewEditShiftTemp = async (shiftTemplateId, isReadOnly) => {
    this.setState({ loading: true });
    const { token, roleIds } = this.state;
    const { history } = this.props;
    const reqBody = {
      languageId: 1,
      id: shiftTemplateId,
      roleIds,
    };
    try {
      const response = await PostApiCall(`${Api.shift.getShiftTemplateById}`, reqBody, token);
      this.setState({ loading: false });
      response.data.startTime = moment.utc(response.data.startTime).local().format();
      response.data.endTime = moment.utc(response.data.endTime).local().format();
      history.push(
        {
          pathname: '/schedule/shift-template',
          state: {
            // eslint-disable-next-line no-nested-ternary
            shiftTemp: { ...response.data, shiftTemplateId: response.data.id, shiftType: response.data.isOverTimeShift ? '-1' : response.data.isOnCallShift ? '1' : '0' },
            createPage: { selectedUsers: response.data.users },
            managerPage: { selectedManager: response.data.onBehalfOfManager },
            isReadOnly,
            shiftTemplate: true,
            shift: false,
          },
        },
      );
    } catch (err) {
      this.setState({ loading: false });
    }
  }

  deleteShiftTemp = async (shiftTemplateId) => {
    this.setState({ loading: true });
    const { token, roleIds, userId } = this.state;
    const deleteReq = {
      languageId: 1,
      id: shiftTemplateId,
      roleIds,
      updatedByUserId: userId,
    };
    try {
      await PostApiCall(`${Api.shift.deleteShiftTempById}`, deleteReq, token);
      this.getShiftTemplates();
      this.setState({ loading: false, alertModal: true, resposeMessage: 'Template has been successfully deleted' });
      // eslint-disable-next-line no-alert
    } catch (err) {
      this.setState({ loading: false });
    }
  }

  handleSubmitUseTemp = async () => {
    const {
      token, userId, useScheduleId, useClientId, useShiftName,
      formError, useShiftTempData,
    } = this.state;
    let isFormValid = true;

    this.setState({
      formError: {
        useShiftNameErr: '',
        useClientErr: '',
        useScheduleErr: '',
      },
    });

    if (useShiftName === '') {
      this.setState({
        formError: {
          ...formError,
          useShiftNameErr: true,
        },
      });
      isFormValid = false;
    }

    if (useClientId === 0) {
      this.setState({
        formError: {
          ...formError,
          useClientErr: true,
        },
      });
      isFormValid = false;
    }

    if (useScheduleId === 0) {
      this.setState({
        formError: {
          ...formError,
          useScheduleErr: true,
        },
      });
      isFormValid = false;
    }

    if (!isFormValid) {
      return true;
    }

    fetch(`${Api.shift.useShift}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: `${token}`,
      }),
      body: JSON.stringify({
        languageId: 1,
        userId,
        id: useShiftTempData.id,
        scheduleId: Number(useScheduleId),
        title: useShiftName,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            loading: false,
            useShiftTempPop: false,
            alertModal: true,
            resposeMessage: response.message,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.handleSubmitUseTemp());
          });
        }
      }).catch((err) => {
        // eslint-disable-next-line no-alert
        alert('Error while fetching the schedules. Please try again after sometime', err);
        this.setState({ loading: false });
      });
    return true;
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
      } else {
        this.getBusinessUnitByDivisionId(ddlValue);
      }
    } else if (ddlName === 'businessUnitId') {
      if (ddlValue === defaultSelection) {
        this.setState({ department: [{ id: '0', name: 'All' }], departmentId: 0 });
        this.setState({ team: [{ id: '0', name: 'All' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'All', lastName: '' }], managerId: 0 });
      } else {
        this.getDepartmentByBusinessUnitId(ddlValue);
      }
    } else if (ddlName === 'departmentId') {
      if (ddlValue === defaultSelection) {
        this.setState({ team: [{ id: '0', name: 'All' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'All', lastName: '' }], managerId: 0 });
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
    }
  }

  handelCloseUseShift = () => {
    this.setState({
      useShiftTempPop: false,
      useShiftTempData: null,
    });
  }

  handelCloseAlertModal = () => {
    this.setState({
      alertModal: false,
    });
  }

  useShiftTemp = (data) => {
    this.setState({
      useShiftTempData: data,
      useShiftTempPop: true,
      useShiftName: data.shiftTemplateTitle,
      useClientId: 0,
      useScheduleId: 0,
    });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => {
      this.bindSubDropDowns(name, value);
      if (name === 'useClientId') {
        this.getSchedule();
      }
    });
  }

  resetSearch() {
    const {
      isAdministratorRole,
      managerId,
    } = this.state;
    this.setState({
      divisionId: 0,
      businessUnitId: 0,
      teamId: 0,
      managerId: !isAdministratorRole ? managerId : 0,
      clientId: 0,
      totalUserId: 0,
      departmentId: 0,
      clientName: 'All',
      scheduleTypeName: 'All',
    }, () => this.getSchedule());
  }

  render() {
    const {
      loading,
      tableData,
      totalRecords,
      pageSize,
      pageIndex,
      clients,
      clientName,
      scheduleTypeName,
      scheduleTypeDd,
      useShiftTempPop,
      alertModal,
      useShiftName,
      useClientId,
      schedules,
      useScheduleId,
      formError,
      divisions, divisionId,
      businessUnitId, businessUnit,
      departmentId, department,
      teamId, team, resposeMessage,
      managerId, primaryManager, isAdministratorRole,
      totalUserId, clientId,
    } = this.state;
    const { t } = this.props;
    const isResetEnabled = divisionId || businessUnitId || teamId || (isAdministratorRole && managerId) || clientId || totalUserId;
    
    return (
      <>
        <div>
          {!loading ? (<LoadingSpinner />) : null}
        </div>
        <div className="container-fluid view-schedule">
          <div className="card_layout">
            <div className="col-12 create-schedule">
              <Form>
                {
                  isAdministratorRole ? (
                    <Form.Row>
                      <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                        <Form.Label className="form-label-custom">{t('ManageEmployeePage.TableHeader_Division')}</Form.Label>
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
                        <Form.Label className="form-label-custom">{t('ManageEmployeePage.TableHeader_BusinessUnit')}</Form.Label>
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
                        <Form.Label className="form-label-custom">{t('ManageEmployeePage.TableHeader_Department')}</Form.Label>
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
                        <Form.Label className="form-label-custom">{t('ManageEmployeePage.TableHeader_Team')}</Form.Label>
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
                    </Form.Row>
                  ) : ''
                }
                <Form.Row>
                  {
                    isAdministratorRole ? (
                      <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                        <Form.Label className="form-label-custom">{t('ManageEmployeePage.Label_Manager')}</Form.Label>
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
                    ) : ''
                  }

                  <Form.Group className="col-lg-4 col-md-6 col-xl-3 react-multiselect" controlId="clientId">
                    <Form.Label className="form-label-custom">Contract</Form.Label>
                    <Dropdown as={Col} col={3} className="p-0" onSelect={e => this.handleDropDown(e, 'clientId', 'clients', 'clientName')}>
                      <Dropdown.Toggle className="m-0">
                        {clientName}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {clients && clients.map(client => <Dropdown.Item eventKey={client.id}>{client.name}</Dropdown.Item>)}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                  <Form.Group className="col-lg-4 col-md-6 col-xl-3 react-multiselect" controlId="scheduleType">
                    <Form.Label className="form-label-custom">Schedule Type</Form.Label>
                    <Dropdown as={Col} col={3} className="p-0" onSelect={e => this.handleDropDown(e, 'totalUserId', 'scheduleTypeDd', 'scheduleTypeName')}>
                      <Dropdown.Toggle className="m-0">
                        {scheduleTypeName}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {scheduleTypeDd && scheduleTypeDd.map(scheduleTypeObj => <Dropdown.Item eventKey={scheduleTypeObj.id}>{scheduleTypeObj.name}</Dropdown.Item>)}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                  <Form.Group className="col-lg-4 col-md-6 col-xl-3 searchButtonST">
                    <button type="button" className="btn btn-primary " onClick={() => this.getShiftTemplates()}>
                      Search
                    </button>
                  </Form.Group>
                  {
                    isResetEnabled ? (
                      <Form.Group className="col-lg-4 col-md-6 col-xl-3 searchButtonST">
                        <button type="button" className="btn btn-secondary " onClick={() => this.resetSearch()}>
                          Reset
                        </button>
                      </Form.Group>
                    ) : ''
                  }
                </Form.Row>

                <Row className="mt-5">
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        {tableHeader.map(data => (
                          <th className={data.class}>
                            {data.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map(data => (
                        <tr key={data.id}>
                          <td className="text-left">
                            {data.scheduleTitle}
                          </td>
                          <td>
                            {data.shiftTemplateTitle}
                          </td>
                          <td>
                            {data.pattern}
                          </td>
                          <td>
                            {data.startDate && commonService.localizedDate(data.startDate)}
                          </td>
                          <td>
                            {data.endDate && commonService.localizedDate(data.endDate)}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <button type="button" className="link-style p-0 position-relative left-0" onClick={() => this.useShiftTemp(data)}>
                                
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 40 }}
                                  overlay={this.renderTooltip('use', 'useTooltip')}
                                >
                                  <img
                                    title="Use"
                                    src={handIcon}
                                    alt="Hand Icon"
                                  />
                                </OverlayTrigger>
                              </button>
                              <button type="button" className="ml-1 link-style p-0 position-relative left-0" onClick={() => this.viewEditShiftTemp(data.id, true)}>
                               
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 40 }}
                                  overlay={this.renderTooltip('View', 'viewTooltip')}
                                >
                                  <img
                                    title="View"
                                    src={EyeView}
                                    alt="View Icon"
                                  />
                                </OverlayTrigger>
                              </button>
                              <button type="button" className="ml-1 link-style p-0 position-relative left-0" onClick={() => this.viewEditShiftTemp(data.id, false)}>
                               
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 40 }}
                                  overlay={this.renderTooltip('Edit', 'editTooltip')}
                                >
                                  <img
                                    title="Edit"
                                    src={EditIcon}
                                    alt="Edit Icon"
                                  />
                                </OverlayTrigger>
                              </button>
                              <button type="button" className="ml-1 link-style p-0 position-relative left-0" onClick={() => this.deleteShiftTemp(data.id, false)}>
                                
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 40 }}
                                  overlay={this.renderTooltip('Delete', 'deleteTooltip')}
                                >
                                  <img
                                    title="Delete"
                                    src={DeleteIcon}
                                    alt="Delete Icon"
                                  />
                                </OverlayTrigger>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Row>
                <PaginationAndPageNumber
                  totalPageCount={Math.ceil(totalRecords / pageSize)}
                  totalElementCount={totalRecords}
                  updatePageNum={this.updatePageNum}
                  updatePageCount={this.updatePageCount}
                  currentPageNum={pageIndex}
                  recordPerPage={pageSize}
                />
              </Form>
            </div>

          </div>
        </div>

        <Modal show={useShiftTempPop} onHide={() => this.handelCloseUseShift()}>
          <Modal.Header closeButton>
            <Modal.Title className="h6">Use Template</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Row>
                <Form.Group className="col-12 react-multiselect" controlId="clientId">
                  <Form.Label className="form-label-custom">Custom Shift Name</Form.Label>
                  <Form.Control name="useShiftName" value={useShiftName} onChange={e => this.handleChange(e)} />
                  <div className={formError.useShiftNameErr ? 'text-danger' : 'hidden'}>
                    Please select custom shift name
                  </div>
                </Form.Group>
                <Form.Group className="col-12 react-multiselect" controlId="clientId">
                  <Form.Label className="form-label-custom">Contract</Form.Label>
                  <Form.Control name="useClientId" value={useClientId} as="select" onChange={e => this.handleChange(e)}>
                    <option
                      key={0}
                      value={0}
                      hidden
                      selected
                      disabled
                    >
                      Choose
                    </option>
                    {clients.map(client => (
                      <option
                        key={client.id}
                        value={client.id}
                      >
                        {client.name}
                      </option>
                    ))}
                  </Form.Control>
                  <div className={formError.useClientErr ? 'text-danger' : 'hidden'}>
                    Please select contract
                  </div>
                </Form.Group>
                <Form.Group className="col-12 react-multiselect" controlId="scheduleType">
                  <Form.Label className="form-label-custom">Schedule</Form.Label>
                  <Form.Control name="useScheduleId" value={useScheduleId} as="select" onChange={e => this.handleChange(e)}>
                    <option
                      key={0}
                      value={0}
                      hidden
                      selected
                      disabled
                    >
                      Choose
                    </option>
                    {schedules.map(schedule => (
                      <option
                        key={schedule.id}
                        value={schedule.id}
                      >
                        {schedule.title}
                      </option>
                    ))}
                  </Form.Control>
                  <div className={formError.useScheduleErr ? 'text-danger' : 'hidden'}>
                    Please select schedule
                  </div>
                </Form.Group>
              </Form.Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <div className="modal__actions">
              <button type="button" className="btn btn-outline-secondary mt-2" onClick={() => this.handelCloseUseShift()}>Cancel</button>
              <button type="button" onClick={() => this.handleSubmitUseTemp()} className="btn btn-primary mt-2">Use</button>
            </div>
          </Modal.Footer>
        </Modal>

        <Modal show={alertModal} onHide={() => this.handelCloseAlertModal()}>
          <Modal.Header closeButton>
            <Modal.Title>
              <p>
                {resposeMessage}
              </p>
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <div className="modal__actions">
              <button type="button" className="btn btn-primary mt-2" onClick={() => this.handelCloseAlertModal()}>Ok</button>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default withTranslation()(ShiftTemplateListing);
