import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Form,
  Col,
  Table,
  Dropdown,
  Button,
  Modal,
  Row, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import './style.scss';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import EyeView from '../../../Images/Icons/Eye.svg';
import EditIcon from '../../../Images/Icons/Edit.svg';
import CalIcon from '../../../Images/Icons/calendar_3.svg';
import Publish from '../../../Images/Icons/publish.svg';
import Api from '../../common/Api';
import { userService } from '../../../services';
import { callShiftData } from '../SeeScheduler/scheduleData';
import getEndDate, { setRealDate } from '../../common/app.constant';
import DeleteIcon from '../../../Images/Icons/icon_delete.svg';
import DownloadButton from '../../../Images/Icons/downloads.svg';
import Loaders from '../../shared/Loaders';
import PaginationAndPageNumber from '../../shared/Pagination';
import { commonService } from '../../../services/common.service';

/**
 * Import declaration ends
 */

class ViewSchedule extends React.PureComponent {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      token: `Bearer ${token}`,
      userId,
      schedules: [],
      startOnUtc: null,
      endOnUtc: null,
      currentPage: 1,
      loaded: false,
      itemCount: 5,
      totalRecords: 0,
      publishOptionId: 0,
      numberOfPeopleId: 0,
      pageIndex: 1,
      pageSize: 10,
      confirmDelete: false,
      responseMessage: false,
      divisions: [],
      divisionId: 0,
      businessUnitId: 0,
      businessUnit: [{ id: '0', name: 'All' }],
      departmentId: 0,
      department: [{ id: '0', name: 'All' }],
      teamId: 0,
      team: [{ id: '0', name: 'All' }],
      managerId: userService.getRole().some(role => role.name === 'Administrators') ? 0 : userId,
      isAdministratorRole: userService.getRole().some(role => role.name === 'Administrators'),
      primaryManager: [{ id: '0', firstName: 'All', lastName: '' }],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getDivisionsByOrganisationId();
    this.getViewSchedule();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getViewSchedule();
    }
  }

  renderTooltip = (props, id) => (
    <Tooltip id={id} {...props}>
      {props}
    </Tooltip>
  );


  getViewSchedule(startDate, endDate) {
    const {
      token,
      userId,
      endOnUtc,
      itemCount,
      startOnUtc,
      publishOptionId,
      numberOfPeopleId,
      pageIndex, pageSize,
      businessUnitId, departmentId, teamId, managerId, divisionId,
    } = this.state;
    this.setState({ loading: true });
    fetch(`${Api.schedule.searchSchedule}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: `${token}`,
      }),
      body: JSON.stringify({
        languageId: 1,
        showUnpublished: true,
        pageIndex: Number(pageIndex) || 1,
        pageSize: Number(pageSize) || Number(itemCount),
        createdByUserId: userId,
        startOnUtc: startDate === null ? null : setRealDate(startOnUtc) || null,
        endOnUtc: endDate === null ? null : setRealDate(endOnUtc) || null,
        publishOptionId,
        numberOfPeopleId,
        divisionId: parseInt(divisionId, 10),
        businessUnitId: parseInt(businessUnitId, 10),
        departmentId: parseInt(departmentId, 10),
        teamId: parseInt(teamId, 10),
        managerId: parseInt(managerId, 10),
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            loaded: true,
            schedules: response.data,
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getViewSchedule(startDate, endDate));
          });
        } else {
          this.setState({
            loaded: true,
            schedules: [],
          });
          // eslint-disable-next-line no-alert
          alert(
            `Error while fetching the schedules. Please try again after sometime. The error is ${response.message}`,
          );
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(
          'Error while fetching the schedules. Please try again after sometime',
          err,
        );
        this.setState({ loading: false });
      });
  }

  setItemCount(e) {
    this.setState({ itemCount: Number(e.target.value) });
    this.getViewSchedule(1, Number(e.target.value));
  }

  deleteShiftPopUp = (data) => {
    this.setState({
      confirmDelete: true,
      deleteData: data,
    });
  }

  handleClose = () => {
    this.setState({
      confirmDelete: false,
      responseMessage: false,
    });
  }

  deleteShift = () => {
    const {
      token,
      userId,
      deleteData,
    } = this.state;

    fetch(`${Api.schedule.deleteSchedule}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: `${token}`,
      }),
      body: JSON.stringify({
        languageId: 1,
        id: deleteData.id,
        updatedByUserId: userId,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            loaded: false,
            confirmDelete: false,
            responseMessage: response.message,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.deleteShift());
          });
        } else {
          this.setState({
            loaded: true,
            responseMessage: response.message,
          });
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(
          'Error while fetching the schedules. Please try again after sometime',
          err,
        );
        this.setState({ loading: false });
      });
  }

  handleCalendarClick = async (schedule) => {
    const { history } = this.props;
    history.push('scheduler', { scheduleId: schedule.id });
  };

  addNewShift = async (schedule) => {
    const { history } = this.props;
    history.push({
      pathname: 'shift-template',
      state: { scheduleId: schedule.id },
    });
  };

  handleClick = (event) => {
    const listId = Number(event.target.id);
    this.setState({
      currentPage: listId,
    });
    this.getViewSchedule(Number(event.target.id));
  };

  handleDropDown = (selectedVal, stateName) => {
    this.setState({ [stateName]: Number(selectedVal) }, () => {
      this.getViewSchedule();
    });
  };

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
        loaded: false,
      });
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: pageCount,
      pageIndex: 1,
      loaded: false,
    });
  }

  handleFromDateChange(date) {
    const { endOnUtc, itemCount } = this.state;
    if (Date.parse(endOnUtc) < Date.parse(date)) {
      // eslint-disable-next-line react/no-unused-state
      this.setState(
        { fromDateIsGreater: true, toDateIsSmaller: false, invalid: true },
        () => { },
      );
    } else {
      this.setState(
        {
          startOnUtc: date,
        },
        () => {
          this.getViewSchedule(1, itemCount);
        },
      );
      // eslint-disable-next-line react/no-unused-state
      this.setState({
        fromDateIsGreater: false,
        toDateIsSmaller: false,
        invalid: false,
      });
    }
  }

  handleToDateChange(date) {
    const { startOnUtc, itemCount } = this.state;
    if (Date.parse(date) < Date.parse(startOnUtc)) {
      // eslint-disable-next-line react/no-unused-state
      this.setState(
        { toDateIsSmaller: true, fromDateIsGreater: false, invalid: true },
        () => { },
      );
    } else {
      this.setState(
        {
          endOnUtc: date,
        },
        () => {
          this.getViewSchedule(1, itemCount);
        },
      );
      // eslint-disable-next-line react/no-unused-state
      this.setState({
        toDateIsSmaller: false,
        fromDateIsGreater: false,
        invalid: false,
      });
    }
  }

  viewEditSchedule(data, viewOnly) {
    const { history } = this.props;
    const { token } = this.state;
    this.setState({ loading: true });
    fetch(`${Api.schedule.getScheduleByID}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: `${token}`,
      }),
      body: JSON.stringify({
        languageId: 1,
        id: data.id,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          history.push('create-schedule', {
            ...response,
            isViewOnly: viewOnly,
            scheduleId: data.id,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.viewEditSchedule(data, viewOnly));
          });
        } else {
          // eslint-disable-next-line no-alert
          alert('Error while fetching.');
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        // eslint-disable-next-line no-alert
        alert(`Error while fetching.${err}`);
      });
  }

  exportSchedule() {
    const {
      token,
      userId,
      endOnUtc,
      itemCount,
      startOnUtc,
      publishOptionId,
      numberOfPeopleId,
    } = this.state;
    this.setState({ loading: true });
    fetch(`${Api.schedule.exportScheduleExcel}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: `${token}`,
      }),
      body: JSON.stringify({
        languageId: 1,
        showUnpublished: true,
        pageIndex: 1,
        pageSize: itemCount,
        createdByUserId: userId,
        startOnUtc: setRealDate(startOnUtc) || null,
        endOnUtc: setRealDate(endOnUtc) || null,
        publishOptionId: publishOptionId || 0,
        numberOfPeopleId: numberOfPeopleId || 0,
      }),
    })
      .then(response => response.blob())
      .then((blob) => {
        if (blob.type === undefined || blob.type === 'application/json') {
          // eslint-disable-next-line no-alert
          alert('Please try again getting some error.');
        } else {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Schedule List.xlsx');
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert('Error exporting. Please try again after sometime', err);
        this.setState({ loading: false });
      });
  }

  resetFilter() {
    const { isAdministratorRole, managerId } = this.state;
    this.setState({
      startOnUtc: null,
      endOnUtc: null,
      publishOptionId: 0,
      numberOfPeopleId: 0,
      divisionId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      managerId: !isAdministratorRole ? managerId : 0,
    }, () => this.getViewSchedule());
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => {
      this.bindSubDropDowns(name, value);
      this.getViewSchedule();
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


  handleFromDateChange(date) {
    const { endOnUtc, itemCount } = this.state;
    if (Date.parse(endOnUtc) < Date.parse(date)) {
      // eslint-disable-next-line react/no-unused-state
      this.setState(
        { fromDateIsGreater: true, toDateIsSmaller: false, invalid: true },
        () => {},
      );
    } else {
      this.setState(
        {
          startOnUtc: date,
        },
        () => {
          this.getViewSchedule(1, itemCount);
        },
      );
      // eslint-disable-next-line react/no-unused-state
      this.setState({
        fromDateIsGreater: false,
        toDateIsSmaller: false,
        invalid: false,
      });
    }
  }

  render() {
    // eslint-disable-next-line no-nested-ternary
    const { history } = this.props;
    const { t } = this.props;
    const {
      schedules,
      startOnUtc,
      endOnUtc,
      fromDateIsGreater,
      toDateIsSmaller,
      itemCount,
      totalRecords,
      currentPage,
      publishOptionId,
      numberOfPeopleId,
      loaded,
      pageIndex,
      pageSize,
      confirmDelete,
      responseMessage,
      divisions, divisionId,
      businessUnitId, businessUnit,
      departmentId, department,
      teamId, team,
      managerId, primaryManager, isAdministratorRole,
    } = this.state;
    const isEnabled = startOnUtc != null
      || endOnUtc != null
      || numberOfPeopleId > 0
      || divisionId !== 0
      || businessUnitId !== 0
      || teamId !== 0
      || (isAdministratorRole && managerId !== 0)
      || publishOptionId > 0;

    return (
      <div className="container-fluid view-schedule">
        <div className="card_layout">
          <Row>
            <Col md={12}>
              <div className="text-right m-3">
                <button
                  type="button"
                  onClick={() => history.push({
                    pathname: 'create-schedule',
                    search: '?pageName=Create Schedule',
                  })
                  }
                  className="btn btn-primary"
                >
                  {t('SchedulePage.CreateBtn')}
                </button>
                {/* <button type="button" onClick={() => this.exportSchedule()} className="no-style border-primary"><img alt="Download Button" src={DownloadButton} /></button> */}

              </div>
            </Col>
          </Row>
          <Row as={Row} className=" create-schedule">
            <Col md={12}>
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
                <Form.Row as={Row}>
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
                  <Form.Group as={Col} xl={3} lg={6} className="react-multiselect" controlId="filterOnEmployee">
                    <Form.Label className="form-label-custom">Filter By</Form.Label>
                    <Dropdown onSelect={e => this.handleDropDown(e, 'numberOfPeopleId')}>
                      <Dropdown.Toggle className="m-0">
                        { /* eslint-disable-next-line no-nested-ternary */}
                        {numberOfPeopleId === 0 ? 'All' : numberOfPeopleId === 10 ? 'No Employee' : numberOfPeopleId === 20 ? 'Individual' : numberOfPeopleId === 30 ? 'Team' : 'Filter Employees'}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item eventKey={0}>{t('AllText')}</Dropdown.Item>
                        <Dropdown.Item eventKey={10}>{t('NoEmployeeText')}</Dropdown.Item>
                        <Dropdown.Item eventKey={20}>{t('IndividualText')}</Dropdown.Item>
                        <Dropdown.Item eventKey={30}>{t('TeamText')}</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                  <Form.Group as={Col} xl={3} lg={6} className="react-multiselect" controlId="viewByPublish">
                    <Form.Label className="form-label-custom">View By</Form.Label>
                    <Dropdown onSelect={e => this.handleDropDown(e, 'publishOptionId')}>
                      <Dropdown.Toggle className="m-0">
                        { /* eslint-disable-next-line no-nested-ternary */}
                        {publishOptionId === 0 ? 'All' : publishOptionId === 10 ? 'Published' : publishOptionId === 20 ? 'Unpublished' : 'Publish/Unpublish'}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item eventKey={0}>{t('AllText')}</Dropdown.Item>
                        <Dropdown.Item eventKey={10}>{t('PublishedText')}</Dropdown.Item>
                        <Dropdown.Item eventKey={20}>{t('UnPublishedText')}</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                  <Form.Group as={Col} xl={3} lg={6} controlId="startDate">
                    <Form.Label className="form-label-custom">
                      {t('SchedulePage.StartDate')}
                    </Form.Label>
                    <DatePicker
                      name="startOnUtc"
                      selected={startOnUtc}
                      onChange={e => this.handleFromDateChange(e)}
                      placeholderText={commonService.localizedDateFormat()}
                      dateFormat={commonService.localizedDateFormatForPicker()}
                      className="form-control cal_icon"
                      pattern="\d{2}\/\d{2}/\d{4}"
                      autoComplete="off"
                    />
                    {fromDateIsGreater && (
                      <div className="text-danger">
                        {t('ScheduleCreatePage.StartDate_errorText')}
                      </div>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} xl={3} lg={6} col controlId="endDate">
                    <Form.Label className="form-label-custom">
                      {t('SchedulePage.EndDate')}
                    </Form.Label>
                    <DatePicker
                      name="endOnUtc"
                      id="endOnUtc"
                      selected={endOnUtc}
                      onChange={e => this.handleToDateChange(e)}
                      placeholderText={commonService.localizedDateFormat()}
                      dateFormat={commonService.localizedDateFormatForPicker()}
                      className="form-control cal_icon"
                      pattern="\d{2}\/\d{2}/\d{4}"
                      autoComplete="off"
                    />
                    {toDateIsSmaller && (
                      <div className="text-danger">
                        {t('EndDate_errorText')}
                      </div>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} xl={12} lg={12} className="text-center">
                    {' '}
                    {isEnabled && (
                      <button
                        type="button"
                        onClick={() => this.resetFilter()}
                        className="btn btn-secondary resetButton"
                      >
                        Reset Filter
                      </button>
                    )}
                  </Form.Group>
                </Form.Row>
              </Form>
            </Col>
          </Row>

          {loaded ? (
            <>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>{t('SchedulePage.Table_SNo')}</th>
                    <th>{t('SchedulePage.Table_ScheduleName')}</th>
                    <th>{t('SchedulePage.Table_ManagerName')}</th>
                    <th>{t('SchedulePage.Table_CreateOn')}</th>
                    <th>{t('SchedulePage.Table_Contract')}</th>
                    <th className="text-center">
                      {t('SchedulePage.Table_Action')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schedules
                    && schedules.map((data, index) => (
                      <tr key={data.id}>
                        <td>{(currentPage - 1) * itemCount + index + 1}</td>
                        <td>{data.title}</td>
                        <td>{data.createdByUser}</td>
                        <td>
                          {data.createdOnUtc ? commonService.localizedDate(data.createdOnUtc) : ''}
                        </td>
                        <td>{data.client}</td>
                        <td className="td-action">
                          <div className="action">
                            <span className="action-icon view danger-bg">
                              <button
                                className="no-style"
                                type="button"
                                onClick={() => this.viewEditSchedule(data, true)}
                              >
                                
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 40 }}
                                  overlay={this.renderTooltip('View Schedule', 'viewScheduleTooltip')}
                                >
                                  <img
                                    title="View Schedule"
                                    src={EyeView}
                                    alt="View Icon"
                                  />
                                </OverlayTrigger>
                              </button>
                            </span>
                            <span className="action-icon edit primary-bg">
                              <button
                                className="no-style"
                                type="button"
                                onClick={() => this.viewEditSchedule(data, false)}
                              >
                                
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 40 }}
                                  overlay={this.renderTooltip('Edit Schedule', 'editScheduleTooltip')}
                                >
                                  <img
                                    title="Edit Schedule"
                                    src={EditIcon}
                                    alt="Edit Icon"
                                  />
                                </OverlayTrigger>
                              </button>
                            </span>
                            <span className="action-icon edit primary-bg">
                              <button
                                className="no-style"
                                type="button"
                                onClick={() => this.handleCalendarClick(data)}
                              >
                                
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 40 }}
                                  overlay={this.renderTooltip('See Shifts', 'seeShiftScheduleTooltip')}
                                >
                                  <img
                                    title="See Shifts"
                                    src={CalIcon}
                                    alt="Calendar Icon"
                                  />
                                </OverlayTrigger>
                              </button>
                            </span>

                            <span className="action-icon edit primary-bg">
                              <button
                                className="no-style"
                                type="button"
                                onClick={() => this.addNewShift(data)}
                              >
                                
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 40 }}
                                  overlay={this.renderTooltip('Add New Shift', 'newShiftTooltip')}
                                >
                                  <img
                                    title="Add New Shift"
                                    src={Publish}
                                    alt="Create new task Icon"
                                  />
                                </OverlayTrigger>
                              </button>
                            </span>
                            <span className="action-icon delete primary-bg">
                              <button
                                className="no-style"
                                type="button"
                                onClick={() => this.deleteShiftPopUp(data)}
                              >
                               
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 40 }}
                                  overlay={this.renderTooltip('Delete task', 'deleteShiftTooltip')}
                                >
                                  <img
                                    title="Delete task"
                                    src={DeleteIcon}
                                    alt="Delete task Icon"
                                  />
                                </OverlayTrigger>
                              </button>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <PaginationAndPageNumber
                totalPageCount={Math.ceil(totalRecords / pageSize)}
                totalElementCount={totalRecords}
                updatePageNum={this.updatePageNum}
                updatePageCount={this.updatePageCount}
                currentPageNum={pageIndex}
                recordPerPage={pageSize}
              />
            </>
          ) : (
            <Loaders />
          )

          }

        </div>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          keyboard={false}
          show={confirmDelete}
        >
          <Modal.Header>
            <Modal.Title className="h6" id="contained-modal-title-vcenter">
              Are you sure you want to delete?
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={e => this.handleClose(e)}>
              {' '}
              {t('CancelBtn')}
            </Button>
            <Button onClick={e => this.deleteShift(e)}>
              {' '}
              {t('ConfirmBtn')}
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          keyboard={false}
          show={responseMessage}
        >
          <Modal.Header>
            <Modal.Title className="h6" id="contained-modal-title-vcenter">
              {responseMessage}
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={e => this.handleClose(e)}>
              {' '}
              {t('Ok')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withTranslation()(ViewSchedule);
