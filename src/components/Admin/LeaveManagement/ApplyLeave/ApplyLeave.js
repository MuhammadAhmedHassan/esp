import React from 'react';
import { withTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import {
  Modal, Button, Table, Row, Col, Form,
} from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-bootstrap-time-picker';
import Api from '../../../common/Api';
import { userService } from '../../../../services';
import '../style.scss';
import deleteIcon from '../../../../Images/Icons/icon_delete.svg';
import Loaders from '../../../shared/Loaders';
import { commonService } from '../../../../services/common.service';

const emailTo = 'Primary Manager';

const doctorsNoteErrorMessage = 'This is required field';
let defaultState = {};
class ApplyLeave extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      token: `${token}`,
      leaveCategories: [],
      leaveCategory: 0,
      leaveTypes: [],
      leaveType: 0,
      sessions: [],
      fromSession: 1,
      toSession: 1,
      reason: '',
      fromDate: '',
      toDate: '',
      userManagers: [],
      reportingManager: 0,
      openEnded: false,
      sicknessPaid: false,
      doctorsNoteProvided: false,
      doctorsNote: '',
      submitted: false,
      userId,
      noOfDays: 0,
      appliedToPrimaryUserId: 4,
      file: '',
      leaveBalance: '',
      isUserCanApplyLeaveAsPerLeaveBalance: true,
      lowBalanceWarning: '',
      fromDateIsGreater: false,
      toDateIsSmaller: false,
      responseStatus: false,
      responseMessage: '',
      showModel: false,
      invalid: false,
      charsLefted: 500,
      maximamChars: 500,
      charsLeft: 500,
      maxChars: 500,
      languageId: 1,
      attachFiles: [],
      fileName: [],
      loaded: false,
      isOvertime: false,
      overtimeFromTime: 0,
      overtimeToTime: 0,
      fromTimeIsGreater: false,
      toTimeIsSmaller: false,
    };
    defaultState = this.state;
    this.handleChange = this.handleChange.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleWordCount = this.handleWordCount.bind(this);
    this.handleWordCountdoctor = this.handleWordCountdoctor.bind(this);
  }

  componentDidMount() {
    this.bindLeaveCategoryDropDown();
    this.bindSessionDropDown();
    this.getUserManagers();
  }

  handleWordCountdoctor = (event) => {
    const { maxChars } = this.state;
    const charCount = event.target.value.length;
    const maxWord = maxChars;
    const charLength = maxWord - charCount;
    this.setState({ charsLeft: charLength });
    this.handleChange(event);
  }

  handleWordCount = (event) => {
    const { maximamChars } = this.state;
    const charCount = event.target.value.length;
    const maxChar = maximamChars;
    const charLength = maxChar - charCount;
    this.setState({ charsLefted: charLength });
    this.handleChange(event);
  }

  handleAttachFile = (event) => {
    const { target: { files } } = event;
    const { fileName } = this.state;
    const input = event;
    for (let i = 0; i < files.length; ++i) {
      if (!fileName.length) {
        fileName.push(files[i]);
      } else {
        const isFile = fileName.filter(x => x.lastModified === files[i].lastModified
          && x.name === files[i].name);
        if (!isFile.length) {
          fileName.push(files[i]);
        }
      }
    }

    this.setState({
      fileName,
      attachFiles: fileName,
    });
    input.target.value = '';
  }

  handleDelete = (id) => {
    const { fileName } = this.state;
    fileName.splice(id, 1);
    this.setState({
      fileName,
    });
  }

  handleCloseModal = () => {
    this.setState({
      showModel: false,
    });
  };

  handleShow = () => {
    const { showModel } = this.state;
    this.setState({
      showModel: !showModel,
    });
  }

  eraseFormData = (e) => {
    e.preventDefault();
    document.getElementById('apply_leave').reset();
    this.setState({
      fromSession: 1,
      toSession: 1,
      reason: '',
      fromDate: '',
      toDate: '',
      showModel: false,
      leaveCategory: 0,
      leaveType: 0,
      reportingManager: 0,
      openEnded: false,
      sicknessPaid: false,
      doctorsNoteProvided: false,
      doctorsNote: '',
      noOfDays: 0,
      file: '',
      leaveBalance: '',
      isUserCanApplyLeaveAsPerLeaveBalance: true,
      lowBalanceWarning: '',
      fromDateIsGreater: false,
      toDateIsSmaller: false,
      charsLefted: 500,
      maximamChars: 500,
      charsLeft: 500,
      maxChars: 500,
      attachFiles: [],
      fileName: [],
    });
  }

  checkForLeaveBalance = () => {
    const {
      token, leaveCategory, userId, fromDate, toDate, fromSession, toSession, invalid,
      overtimeFromTime, overtimeToTime,
    } = this.state;

    const hoursFrom = Math.floor(overtimeFromTime / 3600);
    const minutesFrom = Math.floor((overtimeFromTime - (hoursFrom * 3600)) / 60);

    const hoursTo = Math.floor(overtimeToTime / 3600);
    const minutesTo = Math.floor((overtimeToTime - (hoursTo * 3600)) / 60);

    const fromTime = fromDate !== '' ? new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), hoursFrom, minutesFrom, 0, 0) : '';
    const toTime = toDate !== '' ? new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), hoursTo, minutesTo, 0, 0) : '';

    this.setState({
      isUserCanApplyLeaveAsPerLeaveBalance: true,
    });

    if (leaveCategory === 0 || !toDate || !fromDate || invalid) {
      return;
    }
    
    // Get leave type
    fetch(`${Api.vacationManagement.checkForLeaveBalance}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        userId,
        Id: parseInt(leaveCategory, 10),
        languageId: 1,
        fromDateTimeUtc: fromTime === '' ? fromDate : fromTime,
        toDateTimeUtc: toTime === '' ? toDate : toTime,
        fromSession: parseInt(fromSession, 10),
        toSession: parseInt(toSession, 10),
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode !== 200) {
          this.setState({
            isUserCanApplyLeaveAsPerLeaveBalance:
              response.data.IsUserCanApplyLeaveAsPerLeaveBalance,
            lowBalanceWarning: response.message,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.checkForLeaveBalance());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  bindLeaveCategoryDropDown = () => {
    const { token } = this.state;
    // Get leave categories
    fetch(`${Api.vacationManagement.getLeaveCategory}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ languageId: 1 }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            leaveCategories: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.bindLeaveCategoryDropDown());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  bindLeaveTypeDropDown = () => {
    const { token, leaveCategory, userId } = this.state;
    if (leaveCategory === 0) {
      this.setState({
        leaveTypes: [],
      });
      return;
    }
    // Get leave type
    fetch(`${Api.vacationManagement.getLeaveType}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        userId,
        Id: parseInt(leaveCategory, 10),
        languageId: 1,
      }),

    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            leaveTypes: response.data.leaveTypes,
            leaveBalance: response.data.balance,
            invalid: response.data.balance === '0',
          },
            this.checkForLeaveBalance);
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.bindLeaveTypeDropDown());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  getUserManagers = () => {
    const { token, userId } = this.state;

    // Get leave type
    fetch(`${Api.getManagers}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ Id: userId }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          const reportManagers = response.data.map(usr => (
            { name: `${usr.firstName} ${usr.lastName}`, id: usr.id }
          ));
          this.setState({
            userManagers: reportManagers,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getUserManagers());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  // Get sessions
  bindSessionDropDown = () => {
    const { token, userId } = this.state;
    fetch(`${Api.getSessions}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ userId, Id: userId, languageId: 1 }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            sessions: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.bindSessionDropDown());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  // Handler for leave category select
  handleLeaveCategoryDropDown = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
        isOvertime: event.target.value == 91,
      },
      this.bindLeaveTypeDropDown,
    );
  };

  // Handler for Select
  handleDropDown = (event) => {
    const { fromDate, toDate, openEnded } = this.state;
    if ((event.target.name === 'fromSession' && openEnded) || (event.target.name === 'fromSession' && fromDate.getTime() === toDate.getTime())) {
      this.setState(
        {
          toSession: event.target.value,
        },
        () => this.checkForLeaveBalance(),
      );
    }

    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => this.checkForLeaveBalance(),
    );
  };

  handleClose = () => {
    this.setState({
      responseMessage: '',
      showModel: false,
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      submitted: true, loaded: true,
    });
    const {
      token, userId, leaveCategory, leaveType,
      fromDate, toDate,
      fromSession, toSession, noOfDays, openEnded, appliedToPrimaryUserId,
      reportingManager, reason, isOvertime,
      sicknessPaid, doctorsNoteProvided, doctorsNote, languageId, attachFiles,
      overtimeFromTime, overtimeToTime,
    } = this.state;
    // stop here if form is invalid

    if (leaveCategory === '0' || !leaveType || !fromDate || (!toDate && !openEnded) || reportingManager === 0) {
      return;
    }

    if (doctorsNoteProvided && doctorsNote === '') {
      this.setState({
        doctorsNoteError: true,
      });
      return;
    }

    const hoursFrom = Math.floor(overtimeFromTime / 3600);
    const minutesFrom = Math.floor((overtimeFromTime - (hoursFrom * 3600)) / 60);

    const hoursTo = Math.floor(overtimeToTime / 3600);
    const minutesTo = Math.floor((overtimeToTime - (hoursTo * 3600)) / 60);

    const fromTime = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), hoursFrom, minutesFrom, 0, 0);
    const toTime = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), hoursTo, minutesTo, 0);
    const data = {
      userId,
      parentLeaveTypeId: leaveCategory,
      childLeaveTypeId: leaveType,
      fromDateTimeUtc: isOvertime ? fromTime.toUTCString() : fromDate.toDateString(),
      toDateTimeUtc: isOvertime ? toTime.toUTCString() : (toDate ? toDate.toDateString() : ''),
      fromSession: parseInt(fromSession, 10),
      noOfDays,
      openEnded,
      appliedToPrimaryUserId,
      appliedToSecondaryUserId: reportingManager,
      reason,
      sicknessPaid,
      doctorsNoteProvided,
      doctorsNote,
      languageId,
      id: 0,
      isActive: false,
      toSession,
    };

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    const datas = new FormData();
    attachFiles.forEach((record) => {
      datas.append('attachFiles', record);
    });

    Object.keys(data).forEach((key) => {
      datas.append(key, data[key]);
    });

    fetch(`${Api.vacationManagement.applyLeave}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
      }),
      body: datas,
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            responseStatus: response.statusCode,
            responseMessage: response.message,
            submitted: false,
            attachFiles: [],
            fileName: [],
            doctorsNoteError: false,
            loaded: false,
            overtimeFromTime: '00:00',
            overtimeToTime: '00:00',
            fromTimeIsGreater: false,
            toTimeIsSmaller: false,

          });
          window.location.href = ('/vacation-management/my-vacation/applied-vacation');
          this.eraseFormData(e);
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.handleSubmit(e));
          });
        } else {
          this.setState({
            responseStatus: response.statusCode,
            responseMessage: response.message,
            submitted: false,
            doctorsNoteError: false,
            loaded: false,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  // Handler for input
  handleChange(e) {
    const { target } = e;
    if (target.name === 'openEnded') {
      this.setState({
        toDate: '',
        toSession: 1,
      });
    }
    if (target.name === 'doctorsNoteProvided' && target.value) {
      this.setState({
        doctorsNote: '',
        charsLeft: 500,
      });
    }
    if (target.type === 'checkbox') {
      this.setState({
        [target.name]: target.checked,
      });
    } else {
      this.setState({
        [target.name]: target.value,
      });
    }
  }


  handleFromDateChange(date) {
    const {
      toDate, fromSession, overtimeFromTime, overtimeToTime,
    } = this.state;
    if ((Date.parse(toDate) < Date.parse(date))) {
      this.setState({ fromDateIsGreater: true, toDateIsSmaller: false, invalid: true });
    } else if ((Date.parse(toDate) === Date.parse(date))) {
      this.setState({
        toSession: fromSession,
      });
    } else {
      this.setState({ fromDateIsGreater: false, toDateIsSmaller: false, invalid: false });
    }
    if ((Date.parse(toDate) === Date.parse(date)) && (overtimeFromTime >= overtimeToTime)) {
      this.setState({ fromTimeIsGreater: true, toTimeIsSmaller: false });
    } else {
      this.setState({ fromTimeIsGreater: false, toTimeIsSmaller: false });
    }
    this.setState({
      fromDate: date,
    },
      () => this.checkForLeaveBalance());
  }

  handleTimeChange(date) {
    const { toDate } = this.state;
    if ((Date.parse(toDate) < Date.parse(date))) {
      this.setState({ fromDateIsGreater: true, toDateIsSmaller: false, invalid: true });
    } else {
      this.setState({ fromDateIsGreater: false, toDateIsSmaller: false, invalid: false });
    }
    this.setState({
      fromDate: date,
    },
      () => this.checkForLeaveBalance());
  }


  handleToDateChange(date) {
    const {
      fromDate, overtimeFromTime, overtimeToTime, fromSession,
    } = this.state;
    if ((Date.parse(date) < Date.parse(fromDate))) {
      this.setState({ toDateIsSmaller: true, fromDateIsGreater: false, invalid: true });
    } else if ((Date.parse(date) === Date.parse(fromDate))) {
      this.setState({
        toSession: fromSession,
      });
    } else {
      this.setState({ toDateIsSmaller: false, fromDateIsGreater: false, invalid: false });
    }
    if ((Date.parse(fromDate) === Date.parse(date)) && (overtimeFromTime >= overtimeToTime)) {
      this.setState({ fromTimeIsGreater: false, toTimeIsSmaller: true });
    } else {
      this.setState({ fromTimeIsGreater: false, toTimeIsSmaller: false });
    }
    this.setState({
      toDate: date,
    },
      () => this.checkForLeaveBalance());
  }

  overtimeFromChange(time) {
    const { toDate, fromDate, overtimeToTime } = this.state;
    if ((Date.parse(toDate) === Date.parse(fromDate)) && (overtimeToTime <= time)) {
      this.setState({ fromTimeIsGreater: true, toTimeIsSmaller: false, invalid: true });
    } else {
      this.setState({ fromTimeIsGreater: false, toTimeIsSmaller: false, invalid: false });
    }
    this.setState({ overtimeFromTime: time }, () => this.checkForLeaveBalance());
  }

  overtimeToChange(time) {
    const { toDate, fromDate, overtimeFromTime } = this.state;
    if ((Date.parse(toDate) === Date.parse(fromDate)) && (overtimeFromTime >= time)) {
      this.setState({ fromTimeIsGreater: true, toTimeIsSmaller: false, invalid: true });
    } else {
      this.setState({ fromTimeIsGreater: false, toTimeIsSmaller: false, invalid: false });
    }
    this.setState({ overtimeToTime: time }, () => this.checkForLeaveBalance());
  }

  disableSession() {
    const { fromDate, toDate, openEnded } = this.state;
    if (openEnded) {
      return true;
    }
    if (fromDate !== '' && toDate !== '') {
      if (fromDate.getTime() === toDate.getTime()) {
        return true;
      }
      return false;
    }
    return false;
  }

  checkPromp() {
    const {
      leaveCategory,
      leaveType,
      fromDate,
      toDate,
      fromSession,
      toSession,
      noOfDays,
      openEnded,
      appliedToPrimaryUserId,
      reportingManager,
      reason,
      sicknessPaid,
      doctorsNoteProvided,
      doctorsNote,
      attachFiles,
    } = this.state;

    if (
      defaultState.leaveCategory === leaveCategory
      && defaultState.leaveType === leaveType
      && defaultState.fromDate === fromDate
      && defaultState.toDate === toDate
      && defaultState.fromSession === fromSession
      && defaultState.toSession === toSession
      && defaultState.noOfDays === noOfDays
      && defaultState.openEnded === openEnded
      && defaultState.appliedToPrimaryUserId === appliedToPrimaryUserId
      && defaultState.reportingManager === reportingManager
      && defaultState.reason === reason
      && defaultState.sicknessPaid === sicknessPaid
      && defaultState.doctorsNoteProvided === doctorsNoteProvided
      && defaultState.doctorsNote === doctorsNote
      && defaultState.attachFiles === attachFiles
    ) {
      return false;
    }
    return true;
  }

  render() {
    const {
      leaveCategories, leaveCategory, leaveTypes, leaveType,
      sessions, fromSession, toSession, fromDate, toDate,
      reason, submitted, doctorsNoteError,
      userManagers, reportingManager, openEnded, sicknessPaid,
      doctorsNoteProvided, doctorsNote, file, leaveBalance,
      isUserCanApplyLeaveAsPerLeaveBalance, lowBalanceWarning, fromDateIsGreater,
      toDateIsSmaller, responseStatus, responseMessage, showModel, charsLeft,
      maxChars, fileName, maximamChars, charsLefted, loaded, isOvertime,
      overtimeFromTime, overtimeToTime, fromTimeIsGreater, toTimeIsSmaller,
    } = this.state;
    const { t } = this.props;

    return (
      <>
        <Row>
          <Col md={12}>
            <h2>
              {' '}
              {t('ApplyPage.PageTitle')}
              {' '}
            </h2>
          </Col>
        </Row>
        {!loaded ? (
          <>
            {
              responseMessage && (
                <Row>
                  <Col md={12}>
                    <div className={`alert alert-${responseStatus === 200 ? 'success' : 'danger'}`} role="alert">
                      {responseMessage}
                      <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => this.handleClose()}>
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                  </Col>
                </Row>
              )
            }

            {
              !isUserCanApplyLeaveAsPerLeaveBalance && (
                <Row>
                  <Col md={12}>
                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                      {lowBalanceWarning}
                    </div>
                  </Col>
                </Row>
              )
            }
          </>
        ) : (
          <Loaders />
        )}


        <Form id="apply_leave" autoComplete="off">
          <Row className="row justify-content-between">
            <Col md={12} xl={6}>
              <Row>
                <Col lg={6}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label htmlFor={leaveCategory}>
                      {' '}
                      {t('ApplyPage.Leave_catergory')}
                      <span className="redStar"> * </span>
                      {' '}
                    </Form.Label>
                    <select
                      className="form-control"
                      name="leaveCategory"
                      defaultValue={leaveCategory}
                      onChange={this.handleLeaveCategoryDropDown}
                    >
                      <option value="0">Choose Category</option>
                      {
                        leaveCategories.map(leavecategory => (
                          <option key={leavecategory.id} value={leavecategory.id}>
                            {leavecategory.name}
                          </option>
                        ))
                      }
                    </select>
                    {submitted && !leaveCategory
                      && <div className="text-danger">{t('ShiftTemplatePage.StartDate_reqText')}</div>
                    }
                  </Form.Group>

                </Col>
                <Col lg={6}>
                  <Form.Label htmlFor={leaveType}>
                    {t('ApplyPage.Leave_type')}
                    {' '}
                    <span className="redStar"> * </span>
                  </Form.Label>
                  <select className="form-control" name="leaveType" defaultValue={leaveType} onChange={this.handleDropDown}>
                    <option>Choose Type</option>
                    {
                      leaveTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>

                      ))}
                  </select>
                  {submitted && !leaveType
                    && <div className="text-danger">{t('ShiftTemplatePage.StartDate_reqText')}</div>
                  }
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Form.Label htmlFor={fromDate}>
                    {t('ApplyPage.FromDate')}
                    {' '}
                    <span className="redStar"> * </span>
                    {' '}
                  </Form.Label>
                  <DatePicker
                    name="fromDate"
                    selected={fromDate}
                    onChange={this.handleFromDateChange}
                    placeholderText={commonService.localizedDateFormat()}
                    dateFormat={commonService.localizedDateFormatForPicker()}
                    className="form-control cal_icon"
                    pattern="\d{2}\/\d{2}/\d{4}"
                    required
                  />
                  {submitted && !fromDate
                    && <div className="text-danger">{t('ShiftTemplatePage.StartDate_reqText')}</div>}
                  {fromDateIsGreater
                    && <div className="text-danger">{t('ApplyPage.FromDateText')}</div>}
                </Col>
                <Col lg={6}>
                  <Form.Label htmlFor={toDate}>
                    {t('ToDate')}
                    {' '}
                    <span className="redStar"> * </span>
                    {' '}
                  </Form.Label>
                  <DatePicker
                    selected={toDate}
                    onChange={this.handleToDateChange}
                    name="toDate"
                    className="form-control cal_icon"
                    placeholderText={commonService.localizedDateFormat()}
                    dateFormat={commonService.localizedDateFormatForPicker()}
                    // pattern="\d{2}\/\d{2}/\d{4}"
                    disabled={openEnded}
                    value={!openEnded ? toDate : ''}
                    required={!openEnded}
                  />
                  {submitted && !toDate && !openEnded
                    && <div className="text-danger">{t('ShiftTemplatePage.StartDate_reqText')}</div>}
                  {toDateIsSmaller
                    && <div className="text-danger">{t('ApplyPage.ToDateText')}</div>}
                </Col>
              </Row>
              {!isOvertime && (
                <>
                  <Row>
                    <Col lg={6}>
                      <Form.Label htmlFor={fromSession}>
                        {t('ApplyPage.Session_from')}
                        {' '}
                        <span className="redStar"> * </span>
                        {' '}
                      </Form.Label>
                      <select
                        className="form-control"
                        name="fromSession"
                        value={fromSession}
                        onChange={(e) => { this.handleDropDown(e); }}
                      >
                        {sessions.map(session => (
                          <option key={session.id} value={session.id}>
                            {session.name}
                          </option>
                        ))}
                      </select>
                      {submitted && !fromSession
                        && <div className="text-danger">{t('ShiftTemplatePage.StartDate_reqText')}</div>}
                    </Col>
                    <Col lg={6}>
                      <Form.Label htmlFor={toSession}>
                        {t('ApplyPage.Session_To')}
                        {' '}
                        <span className="redStar"> * </span>
                        {' '}
                      </Form.Label>
                      <select
                        className="form-control"
                        name="toSession"
                        disabled={this.disableSession()}
                        value={toSession}
                        onChange={this.handleDropDown}
                      >
                        {sessions.map(session => (
                          <option key={session.id} value={session.id}>
                            {session.name}
                          </option>
                        ))}
                      </select>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <Form.Group className="mt-3">
                        <div className="custom-control custom-checkbox openEnded custom-checkbox-right">
                          <input type="checkbox" className="custom-control-input" id="openEnded" name="openEnded" defaultValue={openEnded} onChange={this.handleChange} />
                          <label className="custom-control-label" htmlFor="openEnded" name={openEnded.toString()}>{t('ApplyPage.OpenEnded')}</label>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mt-3">
                        <div className="custom-control custom-checkbox sicknessPaid">
                          <input
                            type="checkbox"
                            id="sicknessPaid"
                            className="custom-control-input"
                            name="sicknessPaid"
                            defaultValue={sicknessPaid}
                            onChange={this.handleChange}
                          />
                          <label className="custom-control-label" htmlFor="sicknessPaid" name={sicknessPaid.toString()}>{t('ApplyPage.Sickness_paid')}</label>
                        </div>
                      </Form.Group>

                    </Col>
                  </Row>
                </>
              )}
              {isOvertime && (
                <>
                  <Row>
                    <Col lg={6}>
                      <Form.Label htmlFor={fromSession}>
                        {t('From')}
                        {' '}
                        <span className="redStar"> * </span>
                        {' '}
                      </Form.Label>
                      <TimePicker
                        disabled={fromDate === '' || toDate === ''}
                        start="0:00"
                        end="23:00"
                        step={15}
                        format={24}
                        onChange={time => this.overtimeFromChange(time)}
                        value={overtimeFromTime}
                      />
                      {fromTimeIsGreater
                        && <div className="text-danger">{t('From Time is greater than To time')}</div>}
                    </Col>
                    <Col lg={6}>
                      <Form.Label htmlFor={toSession}>
                        {t('To')}
                        {' '}
                        <span className="redStar"> * </span>
                        {' '}
                      </Form.Label>
                      <TimePicker
                        disabled={fromDate === '' || toDate === ''}
                        start="0:00"
                        end="23:00"
                        step={15}
                        format={24}
                        onChange={time => this.overtimeToChange(time)}
                        value={overtimeToTime}
                      />
                      {toTimeIsSmaller
                        && <div className="text-danger">{t('To time is smaller than From Time')}</div>}
                    </Col>
                  </Row>
                </>
              )}
              <Row>
                <Col lg={6}>
                  <Form.Label htmlFor={reportingManager}>
                    {t('ApplyPage.ApplyTo')}
                    {' '}
                    <span className="redStar"> * </span>
                    {' '}
                  </Form.Label>
                  <select
                    className="form-control"
                    name="reportingManager"
                    onChange={this.handleDropDown}
                    value={reportingManager}
                  >
                    <option value="0">{t('ApplyPage.ChooseManager')}</option>
                    {userManagers.map(usr => (
                      <option key={usr.id} value={usr.id}>
                        {usr.name}
                      </option>
                    ))}
                  </select>
                  {submitted && reportingManager === 0
                    && <div className="text-danger">{t('ShiftTemplatePage.StartDate_reqText')}</div>}
                </Col>
                {!isOvertime && (
                  <Col lg={6}>
                    <div className="choosefile mb-2">
                      <Form.Label htmlFor={file}>{t('ApplyPage.AttachFile')}</Form.Label>
                      <div className="attachFile">
                        <input
                          id="file"
                          multiple
                          name="attachFiles"
                          className="choose_file"
                          type="file"
                          onChange={event => this.handleAttachFile(event)}
                          accept=".pdf,.doc,.zip"
                        />
                      </div>
                      {fileName.map((fileData, index) => (
                        <Table className="m-0 font-sm">
                          <tr>
                            <th className="px-0" style={{ 'min-width': '15px' }} width="15px">
                              <span
                                className="action-icon delete danger-bg"
                              >
                                <img
                                  src={deleteIcon}
                                  alt="Delete Icon"
                                  onClick={() => this.handleDelete(index)}
                                />
                              </span>
                            </th>
                            <th>
                              {fileData.name}
                            </th>
                          </tr>
                        </Table>
                      ))}
                    </div>
                  </Col>
                )}
                {leaveBalance && (
                  <Col lg={6}>
                    <Form.Group className="form-check">
                      <Form.Label htmlFor="exampleCheck2">{t('BalanceText')}</Form.Label>
                      <h3 className="balText">
                        {leaveBalance}
                      </h3>
                    </Form.Group>
                  </Col>
                )}
              </Row>
              <Row />
            </Col>
            <Col md={12} xl={6}>
              <Row>
                <Col lg={12}>
                  <Form.Label htmlFor={reason}>{t('ApplyPage.Narrative')}</Form.Label>
                  <textarea
                    name="reason"
                    value={reason}
                    type="text"
                    className="form-control"
                    maxLength={maximamChars}
                    onChange={this.handleWordCount}
                  />
                  <p className="charsTooTip">
                    {' '}
                    {charsLefted}
                    {' '}
                    {t('ApplyPage.CharRemaining')}
                  </p>
                </Col>
              </Row>
              <Row>
                {!isOvertime && (
                  <Col lg={12}>
                    <Form.Group>
                      <div className="custom-control custom-checkbox doctorsNoteProvided custom-checkbox-right">
                        <input
                          type="checkbox"
                          id="doctorsNoteProvided"
                          className="custom-control-input"
                          name="doctorsNoteProvided"
                          onChange={this.handleChange}
                          defaultValue={doctorsNoteProvided}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="doctorsNoteProvided"
                          name={doctorsNoteProvided.toString()}
                        >
                          {t('ApplyPage.DoctorNoteProvided')}
                        </label>
                      </div>
                    </Form.Group>
                  </Col>
                )}
              </Row>
              <Row>
                {!isOvertime && (
                  <Col lg={12}>
                    <Form.Label htmlFor={doctorsNote}>
                      {t('ApplyPage.DoctorNote')}
                    </Form.Label>
                    <textarea
                      name="doctorsNote"
                      type="text"
                      className="form-control"
                      maxLength={maxChars}
                      onChange={this.handleWordCountdoctor}
                      disabled={!doctorsNoteProvided}
                      value={doctorsNote}
                    />
                    <div className="text-danger">{doctorsNoteError && doctorsNote === '' && doctorsNoteErrorMessage}</div>
                    <p className="charsTooTip">
                      {charsLeft}
                      {' '}
                      {t('ApplyPage.CharRemaining')}
                    </p>
                  </Col>
                )}
              </Row>

              <Col>
                <Row>
                  <Col sm={12}>
                    <Form.Label htmlFor={emailTo}>
                      {t('ApplyPage.EmailTo')}
                    </Form.Label>
                  </Col>
                  <Col sm={12}>
                    <Form.Label htmlFor={emailTo}>
                      <strong>
                        {' '}
                        {emailTo}
                        {' '}
                      </strong>
                    </Form.Label>
                  </Col>
                </Row>
              </Col>
              <hr />
              <Row className="justify-content-md-end">
                <Col>
                  <Row>
                    <Col sm={6} className="btn-align-r">
                      <div className="buttonsOuter">
                        <button type="button" className="btn btn-outline-secondary" disabled={(leaveCategory === '0' || !leaveType || !fromDate || (!toDate && !openEnded) || reportingManager === 0) || !isUserCanApplyLeaveAsPerLeaveBalance || loaded} onClick={this.handleShow}>
                          {' '}
                          {t('CancelBtn')}
                          {' '}
                        </button>
                      </div>
                    </Col>
                    <Col sm={6} className="btn-align-l">
                      <button
                        type="submit"
                        onClick={this.handleSubmit}
                        disabled={(leaveCategory === '0' || !leaveType || !fromDate || (!toDate && !openEnded) || reportingManager === 0) || !isUserCanApplyLeaveAsPerLeaveBalance || loaded}
                        className="btn btn-primary"
                      >
                        {t('ApplyPage.ApplyBtn')}
                      </button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>

        {
          showModel && (
            <Modal
              show={showModel}
              onHide={this.handleCloseModal}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Body>
                {t('ApplyPage.ModelMeessage')}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleCloseModal}>
                  {t('ApplyPage.NoBtn')}
                </Button>
                <Button variant="primary" onClick={this.eraseFormData}>
                  {' '}
                  {t('ApplyPage.YesBtn')}
                </Button>
              </Modal.Footer>
            </Modal>
          )
        }
      </>
    );
  }
}

export default withTranslation()(ApplyLeave);
