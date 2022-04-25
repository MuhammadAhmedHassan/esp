/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Spinner,
  Tabs,
  Tab,
  Modal,
  Form,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './style.scss';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import ViewIcon from '../../../Images/Icons/View.svg';
// import OpenShiftIcon from '../../../Images/Icons/Open_Shift.svg';
import removeIcon from '../../../Images/Icons/remove.svg';
import checkedIcon from '../../../Images/Icons/checked.svg';
import CharEIcon from '../../../Images/Icons/E_char.svg';
import CharSIcon from '../../../Images/Icons/S_char.svg';
import Withdraw from '../../../Images/Icons/withdraw.svg';
import { userService } from '../../../services';
import Timer from './component/timer';
import {
  getTeamMatesRequest,
  getShiftByDateRequest,
  swapShiftRequest,
  getProfileDataRequest,
  overTimeRequest,
  getUserTimerRequest,
  getOpenShiftRequest,
  getSwapTimeRequest,
  getScheduleRequest,
} from '../../../store/action';

import Api from '../../common/Api';
import { commonService } from '../../../services/common.service';
import 'react-datepicker/dist/react-datepicker.css';

const openShiftHeader = [
  {
    label: 'Date',
  },
  {
    label: 'Label',
  },
  {
    label: 'Actions',
  },
];

const renderTooltip = props => (
  <Tooltip id="button-tooltip" {...props}>
    {props}
  </Tooltip>
);
const errorMessage = 'You are out of Zone';
const Profile = (props) => {
  const { t } = useTranslation();
  let isAdmin = false;
  const userRoles = userService.getRole() ? userService.getRole() : [];
  if (userRoles.find(role => role.name === 'Administrators')) {
    isAdmin = true;
  } else {
    isAdmin = false;
  }

  const [selectDate, setSelectDate] = useState();
  const [swapRequestDetails, setSwapRequestDetails] = useState({
    currentUserDate: '',
    currentUserShift: '',
    targetUser: '',
    targetUserDate: '',
    targetUserShift: '',
    reason: '',
    formErrors: {},
  });

  const [overTimeRequestDetails, setoverTimeRequestDetails] = useState({
    id: '',
    userNotes: '',
    overTimeInHours: 0,
    overTimeInMinutes: 0,
    formErrors: {},
    currentUserDate: '',
    currentUserShift: '',
  });

  const [punchInDetails, setPunchInDetails] = useState({
    geoCoordinates: '',
    isForced: false,
    shiftId: 0,
    isShiftStart: false,
    loading: false,
    shiftModal: false,
    sourceGuid: 'd6149029-b97e-4555-ab5f-7bf77c90ab96',
    modalBody: '',
    displayMessage: false,
    responseMessage: '',
    responseStatus: false,
    shiftResponseMessage: '',
    shiftStartEndModal: false,
  });

  const [showModel, setshowModel] = useState({
    showModelView: false,
    showOpenRequest: false,
    requestId: 0,
    showSwapPopup: false,
    showModelAccept: false,
    showModelReject: false,
    userShiftStatus: false,
    showModelEndShift: false,
    showModelStartShift: false,
  });

  const [rejectReq, setRejectReq] = useState({
    statusChangeNotes: '',
    requestError: '',
  });

  const [viewSwapData, setViewSwapData] = useState({
    requestShiftTitle: '',
    requestShiftStartDateTime: '',
    requestShiftEndDateTime: '',
    targetShiftTitle: '',
    targetShiftStartDateTime: '',
    targetShiftEndDateTime: '',
    requestNotes: '',
    shiftStatus: '',
    key: 1,
  });

  const [leaveInfo, setleaveInfo] = useState({
    appliedLeaves: [],
  });

  const [myException, setMyException] = useState({
    exceptionData: [],
  });

  const dispatch = useDispatch();
  const teamMatesList = useSelector(state => state.teamMatesList);
  const shiftByDatesList = useSelector(state => state.shiftByDateList);
  const swapShift = useSelector(state => state.swapShift);
  const profileDataList = useSelector(state => state.profileDataList);
  const userData = profileDataList.list;
  const overTime = useSelector(state => state.overTime);
  const punchTime = useSelector(state => state.punchTime);
  const userTimerList = useSelector(state => state.userTimerList);
  const openShift = useSelector(state => state.openShiftData);
  const shiftdetails = [].concat(openShift.list);
  const swapTimedetails = useSelector(state => state.swapTimeList);
  const scheduleData = useSelector(state => state.scheduleData);
  const assignedShift = [].concat(scheduleData.list);

  const [responseModalMessage, setResponseModalMessage] = useState('');
  const [responseModal, setResponseModal] = useState(false);

  const getAppliedleave = () => {
    const token = userService.getToken();
    const id = userService.getUserId();
    const data = {
      languageId: 1,
      userId: id,
      pageIndex: 1,
      pageSize: 10,
    };

    fetch(`${Api.vacationManagement.getAppliedLeavesByUserId}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token} `,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          setleaveInfo({
            appliedLeaves: response.data.appliedLeaves,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            getAppliedleave();
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  const ScheduleShiftDetails = () => {
    const userId = userService.getUserId();
    dispatch(
      getScheduleRequest({
        id: userId,
        pageSize: 10,
        pageIndex: 1,
      }),
    );
  };

  const getSwapTimeDetails = (key) => {
    const userId = userService.getUserId();
    dispatch(
      getSwapTimeRequest({
        languageId: 1,
        pageIndex: 1,
        pageSize: 10,
        id: userId,
        requestTypeId: parseInt(key, 10),
      }),
    );
  };

  const getOpenShiftdetails = () => {
    const startDate = moment();
    const EndDate = moment(startDate).add(10, 'days');
    const userId = userService.getUserId();
    dispatch(
      getOpenShiftRequest({
        languageId: 1,
        startDateTime: startDate,
        endDateTime: EndDate,
        requestByUserId: 1,
        userIds: userId.toString(),
      }),
    );
  };

  const getShiftException = () => {
    const token = userService.getToken();
    const userId = userService.getUserId();
    const data = {
      languageId: 1,
      id: userId,
      pageIndex: 1,
      pageSize: 10,
    };

    fetch(`${Api.getShiftException}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token} `,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          setMyException({
            exceptionData: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            getShiftException();
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  useEffect(() => {
    const { key } = viewSwapData;
    const token = userService.getToken();
    const id = userService.getUserId();
    const email = userService.getUserEmail();
    ScheduleShiftDetails();
    getOpenShiftdetails();
    getAppliedleave();
    getSwapTimeDetails(key);
    getShiftException();

    if (id && token) {
      dispatch(getTeamMatesRequest(id));
    }
    if (email && token) {
      dispatch(getProfileDataRequest(email));
    }
    if (id && token) {
      dispatch(getUserTimerRequest(id));
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const geoLocation = `${position.coords.latitude} ${position.coords.longitude}`;
      setPunchInDetails(prevState => ({ ...prevState, geoCoordinates: geoLocation }));
    });
  }, [viewSwapData.key]);

  const formValidation = () => {
    const {
      overTimeInHours, overTimeInMinutes, userNotes, currentUserShift, currentUserDate,
    } = overTimeRequestDetails;
    const formErrors = {};
    let formIsValid = true;

    if (overTimeInHours === 0 && overTimeInMinutes === 0) {
      formIsValid = false;
      formErrors.overTimeInHoursError = 'Hours and Minutes should be greater than zero';
    }

    // if (overTimeInMinutes === 0) {
    //   formIsValid = false;
    //   formErrors.overTimeInMinutesError = 'Minutes should be greater than zero';
    // }
    if (!currentUserDate) {
      formIsValid = false;
      formErrors.currentUserDateError = 'Date Is Required';
    }
    if (!currentUserShift) {
      formIsValid = false;
      formErrors.currentUserShiftError = 'Shift Is Required';
    }

    if (!userNotes) {
      formIsValid = false;
      formErrors.userNotesError = 'Reason Is Required';
    }
    setoverTimeRequestDetails(prevState => ({
      ...prevState,
      formErrors,
    }));
    return formIsValid;
  };

  const handleSubmitOverTimeRequest = () => {
    const userId = userService.getUserId();
    const {
      userNotes, id, overTimeInHours, overTimeInMinutes,
    } = overTimeRequestDetails;
    if (formValidation()) {
      setoverTimeRequestDetails(prevState => ({
        ...prevState,
        formErrors: {},
      }));
      dispatch(overTimeRequest({
        languageId: 1,
        userId,
        shiftRecurrenceId: parseInt(id, 10),
        userNotes,
        overTimeInMinutes: overTimeInMinutes !== '' ? parseInt(overTimeInMinutes, 10) : 0,
        overTimeInHours: overTimeInHours !== '' ? parseInt(overTimeInHours, 10) : 0,
      }));
    }
  };

  const handleSwapRequest = () => {
    const {
      currentUserDate,
      currentUserShift,
      targetUser,
      targetUserDate,
      targetUserShift,
      reason,
    } = swapRequestDetails;
    const formErrors = {};
    let formIsValid = true;

    if (!currentUserDate) {
      formIsValid = false;
      formErrors.currentUserDateError = 'Date Is Required';
    }
    if (!currentUserShift) {
      formIsValid = false;
      formErrors.currentUserShiftError = 'Shift Is Required';
    }
    if (!targetUserDate) {
      formIsValid = false;
      formErrors.targetUserDateError = 'Employee Date Is Required';
    }
    if (!targetUserShift) {
      formIsValid = false;
      formErrors.targetUserShiftError = 'Employee Shift Is Required';
    }
    if (!targetUser) {
      formIsValid = false;
      formErrors.targetUserError = 'User Is Required';
    }
    if (!reason) {
      formIsValid = false;
      formErrors.reasonError = 'Reason Is Required';
    }

    setSwapRequestDetails(prevState => ({
      ...prevState,
      formErrors,
    }));
    return formIsValid;
  };

  const handleSubmit = () => {
    const id = userService.getUserId();

    const {
      currentUserShift, targetUser, targetUserShift, reason,
    } = swapRequestDetails;
    if (handleSwapRequest()) {
      setSwapRequestDetails(prevState => ({
        ...prevState,
        formErrors: {},
      }));

      dispatch(
        swapShiftRequest({
          languageId: 1,
          requestShiftId: parseInt(currentUserShift, 10),
          requestUserId: id,
          requestNotes: reason,
          targetShiftId: parseInt(targetUserShift, 10),
          targetShiftUserId: parseInt(targetUser, 10),
        }),
      );
    }
  };

  const handleSwapSwiftReason = async (e) => {
    e.persist();
    setSwapRequestDetails(prevState => ({
      ...prevState,
      reason: e.target.value,
    }));
  };

  const handleOverTimeUserNotes = async (e) => {
    e.persist();
    const { target } = e;
    const { name, type, checked } = target;
    const value = type === 'checkbox' ? checked : target.value;

    if (value < 0) {
      setoverTimeRequestDetails(prevState => ({
        ...prevState,
        [name]: 0,
      }));
    } else {
      setoverTimeRequestDetails(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSelectEmployee = (e) => {
    // e.persist();
    setSwapRequestDetails(prevState => ({
      ...prevState,
      targetUser: e,
    }));
  };

  const handleSelectUserDate = (e, type, targetId) => {
    // e.persist();
    setSwapRequestDetails(prevState => ({
      ...prevState,
      [type]: e,
    }));
    const userId = userService.getUserId();
    const selectedShiftId = Number(targetId) || 0;
    const selectedDate = new Date(e).toISOString();
    dispatch(getShiftByDateRequest({
      userId,
      date: e,
      requestType: type,
      selectedShiftId,
    }));
  };

  const handleSelectUserDateOt = (e, type) => {
    // e.persist();
    setoverTimeRequestDetails(prevState => ({
      ...prevState,
      [type]: e,
    }));
    let userId = '';
    if (type === 'currentUserDate') {
      userId = userService.getUserId();
    }
    const selectedDate = new Date(e).toISOString();
    dispatch(getShiftByDateRequest({
      userId,
      date: e,
      requestType: type,
    }));
  };

  const handleSelectShift = (e, type) => {
    e.persist();
    setSwapRequestDetails(prevState => ({
      ...prevState,
      [type]: e.target.value,
    }));
  };

  const handleSelectShiftOverTime = (e, type) => {
    e.persist();
    const { target } = e;
    const { name, checked } = target;
    const value = type === 'checkbox' ? checked : target.value;
    setoverTimeRequestDetails(prevState => ({
      ...prevState,
      [type]: e.target.value,
      [name]: value,
    }));
  };

  const handleRequestWidraw = (id) => {
    setshowModel(prevState => ({
      ...prevState,
      showModelView: true,
    }));
    setshowModel(prevState => ({
      ...prevState,
      requestId: id,
    }));
  };

  const handleAcceptRequest = (id) => {
    setshowModel(prevState => ({
      ...prevState,
      showModelAccept: true,
    }));

    setshowModel(prevState => ({
      ...prevState,
      requestId: id,
    }));
  };

  const handleRejectRequest = (id) => {
    setshowModel(prevState => ({
      ...prevState,
      showModelReject: true,
    }));

    setshowModel(prevState => ({
      ...prevState,
      requestId: id,
    }));
  };

  const handleShowSwapPopup = (
    id,
    requestShiftTitle,
    requestShiftStartDateTime,
    requestShiftEndDateTime,
    targetShiftTitle,
    targetShiftStartDateTime,
    targetShiftEndDateTime,
    requestNotes,
    shiftStatus,
  ) => {
    setViewSwapData(prevState => ({
      ...prevState,
      id,
      requestShiftTitle,
      requestShiftStartDateTime,
      requestShiftEndDateTime,
      targetShiftTitle,
      targetShiftStartDateTime,
      targetShiftEndDateTime,
      requestNotes,
      shiftStatus,
    }));
    setshowModel(prevState => ({
      ...prevState,
      showSwapPopup: true,
    }));
  };

  const handleClose = () => {
    setshowModel(prevState => ({
      ...prevState,
      showModelView: false,
      showOpenRequest: false,
      showSwapPopup: false,
      showModelAccept: false,
      showModelReject: false,
      showModelEndShift: false,
      showModelStartShift: false,
    }));
    setPunchInDetails(prevState => ({
      ...prevState,
      shiftModal: false,
      shiftStartEndModal: false,
      displayMessage: false,
    }));
    window.location.reload();
  };

  const showOpenRequest = (id) => {
    setshowModel(prevState => ({
      ...prevState,
      showOpenRequest: true,
      requestId: id,
    }));
  };

  const doWidthrawRequest = (event) => {
    const statusId = event.target.id;
    const token = userService.getToken();
    const userId = userService.getUserId();
    const { requestId } = showModel;
    fetch(`${Api.getSwapStatuschanges}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(requestId, 10),
        languageId: 1,
        newStatusId: parseInt(statusId, 10),
        userId,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          alert(response.message);
          handleClose();
          const { key } = viewSwapData;
          getSwapTimeDetails(key);
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            doWidthrawRequest();
          });
        } else {
          alert(response.message);
          handleClose();
        }
      })
      .catch(err => console.error(err.toString()));
  };

  const doAcceptRequest = (event) => {
    const statusId = event.target.id;
    const token = userService.getToken();
    const userId = userService.getUserId();
    const { requestId } = showModel;
    fetch(`${Api.getSwapStatuschanges}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(requestId, 10),
        languageId: 1,
        newStatusId: parseInt(statusId, 10),
        userId,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          alert(response.message);
          handleClose();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            doAcceptRequest();
          });
        } else {
          alert(response.message);
          handleClose();
        }
      })
      .catch(err => console.error(err.toString()));
  };

  const doRejectRequest = (event) => {
    const statusId = event.target.id;
    const token = userService.getToken();
    const userId = userService.getUserId();
    const { statusChangeNotes } = rejectReq;
    const { requestId } = showModel;
    if (statusChangeNotes == null || statusChangeNotes === '') {
      setRejectReq(prevState => ({
        ...prevState,
        requestError: 'Please enter the note/reason to reject the leave.',
      }));
      return;
    }
    setRejectReq(prevState => ({
      ...prevState,
      requestError: '',
    }));
    fetch(`${Api.getSwapStatuschanges}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(requestId, 10),
        languageId: 1,
        newStatusId: parseInt(statusId, 10),
        userId,
        statusChangeNotes,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          alert(response.message);
          handleClose();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            doRejectRequest();
          });
        } else {
          alert(response.message);
          handleClose();
        }
      })
      .catch(err => console.error(err.toString()));
  };

  const getRequestOpenShift = () => {
    const token = userService.getToken();
    const userId = userService.getUserId();
    const { requestId } = showModel;
    fetch(`${Api.shift.openRequestShift}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(requestId, 10),
        languageId: 1,
        userId,
        updatedByUserId: userId,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          alert(response.message);
          handleClose();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            getRequestOpenShift();
          });
        } else {
          alert(response.message);
          handleClose();
        }
      })
      .catch(err => console.error(err.toString()));
  };

  const handleChange = (event) => {
    const { target } = event;
    const { name } = target;
    if (name === 'statusChangeNotes') {
      setRejectReq({ [name]: target.value });
    }
  };

  const startEndShift = (shiftId, isShiftStart, isForced) => {
    const token = userService.getToken();
    const userId = userService.getUserId();
    const { geoCoordinates, shiftModal } = punchInDetails;

    if (geoCoordinates === '') {
      setResponseModal(true);
      setResponseModalMessage('Please allow location access to use this feature');
      return true;
    }

    setPunchInDetails(prevState => ({
      ...prevState,
      shiftId,
      isShiftStart,
      loading: true,
    }));
    const startEndShiftReq = {
      id: shiftId,
      languageId: 1,
      isShiftStart,
      userId,
      isActiveOnly: true,
      isForced,
      geoLocation: geoCoordinates,
      loginViaDeviceTypeId: 10,
    };

    fetch(`${Api.shift.startEndShift}`, {
      method: 'POST',
      headers: new Headers({
        Token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(startEndShiftReq),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 290) {
          setPunchInDetails(prevState => ({
            ...prevState,
            shiftModal: true,
            modalBody: response.message,
          }));
        } else if (response.statusCode === 200) {
          setPunchInDetails(prevState => ({
            ...prevState,
            shiftStartEndModal: true,
            shiftResponseMessage: response.message,
          }));
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            startEndShift();
          });
        } else if (response.statusCode !== 200) {
          setPunchInDetails(prevState => ({
            ...prevState,
            shiftStartEndModal: true,
            shiftResponseMessage: response.message,
          }));
        }
        setPunchInDetails(prevState => ({
          ...prevState,
          loading: false,
        }));
      })
      .catch((err) => {
        setPunchInDetails(prevState => ({
          ...prevState,
          loading: false,
        }));
      });
    return true;
  };

  const onConfirm = () => {
    const { shiftId, isShiftStart } = punchInDetails;
    setPunchInDetails(prevState => ({
      ...prevState,
      shiftModal: false,
      shiftId,
    }));
    startEndShift(shiftId, isShiftStart, true);
  };

  const viewShift = (shift) => {
    const { history } = props;

    history.push({

      pathname: `/shift-detail/${shift.id}/${userService.getUserId()}/`,

    });
  };
  return (
    <>
      {window.setTimeout(() => {
        setPunchInDetails(prevState => ({
          ...prevState,
          displayMessage: false,
        }));
      }, 7000)
        && punchInDetails.displayMessage && (
          <div className="row">
            <div className="col-md-12">
              <div
                className={`alert-fixed alert alert-${punchInDetails.responseStatus === 200 ? 'success' : 'danger'
                }`}
                role="alert"
              >
                {punchInDetails.responseMessage}
              </div>
            </div>
          </div>
      )}
      <div className="container-fluid employee-dashboard">
        <div className="card_layout">
          <Row>
            <Col md={12} lg={12} xl={6} xxl={4} className="mb-4 col-xxl-4">
              <Card className="cardBox">
                <p className="cardBox_cardTitle">
                  My Schedule (Assigned Shifts)
                </p>
                <div className="myScheduleTable">
                  <Table responsive bordered>
                    <thead className="shiftHeader">
                      <tr>
                        <th>Date</th>
                        <th>Information</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedShift.length === 0
                        && (
                          <tr>
                            <td colSpan="10" className="text-center">No Data Available</td>
                          </tr>
                        )}
                      {assignedShift.map((shiftData, index) => (index <= 7 ? (
                        <tr>
                          <td>
                            <div className="shiftDesc">
                              {shiftData.startDateTime ? commonService.localizedDate(shiftData.startDateTime) : ''}
                            </div>
                          </td>
                          <td>
                            <div className="myScheduleinfo">
                              <div className="shiftDesc">
                                {`${moment(shiftData.startDateTime).format(
                                  'HH:mm',
                                )}`}
                                {' - '}
                                {`${moment(shiftData.endDateTime).format(
                                  'HH:mm',
                                )}`}
                                {' | '}
                                {shiftData.shiftType}
                                {' | '}
                                {shiftData.title}
                              </div>
                              <div className="shiftIcon">
                                {shiftData.userShiftStatusId === 20 && (
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 40 }}
                                    overlay={renderTooltip('End Shift')}
                                  >
                                    <span>
                                      <img
                                        src={CharEIcon}
                                        className="icon"
                                        alt="CharEIcon"
                                        onClick={() => startEndShift(
                                          shiftData.id,
                                          false,
                                          false,
                                        )
                                        }
                                      />
                                    </span>
                                  </OverlayTrigger>
                                )}
                                {shiftData.userShiftStatusId === 10 && (
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 40 }}
                                    overlay={renderTooltip('Start Shift')}
                                  >
                                    <span>
                                      <img
                                        src={CharSIcon}
                                        className="icon"
                                        alt="CharSIcon"
                                        onClick={() => startEndShift(
                                          shiftData.id,
                                          true,
                                          false,
                                        )
                                        }
                                      />
                                    </span>
                                  </OverlayTrigger>
                                )}

                                {shiftData.userShiftStatusId === 30 && (
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 40 }}
                                    overlay={renderTooltip('View Shift')}
                                  >
                                    <span>
                                      <img
                                        className="icon"
                                        src={ViewIcon}
                                        onClick={() => viewShift(
                                          shiftData,
                                        )}
                                        alt="ViewIcon"
                                      />

                                    </span>
                                  </OverlayTrigger>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : undefined))}
                    </tbody>
                  </Table>
                </div>
                {assignedShift.length > 4 && (
                  <div className="d-flex justify-content-end">
                    <Link to="/schedule/my-schedule" variant="link " className="mr-3 seeAllbtn">
                      {t('SeeAllBtn')}
                    </Link>
                  </div>
                )}
              </Card>
            </Col>
            <Col md={12} lg={12} xl={6} xxl={4} className="mb-4 col-xxl-4">
              <Timer />
            </Col>
            <Col md={12} xl={12} xxl={4} className="mb-4 col-xxl-4">
              <Card className="cardBox MyException">
                <p className="cardBox_cardTitle profile-card-header">
                  My Exceptions
                </p>
                <div className="myException">
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Exception Type</th>
                        <th>Shift Name</th>
                        <th>Exception Status  </th>
                      </tr>
                    </thead>
                    <tbody>
                      {myException.exceptionData.length === 0
                        && (
                          <tr>
                            <td colSpan="10" className="text-center">No Data Available</td>
                          </tr>
                        )}
                      {myException.exceptionData.map((data, index) => (index <= 9 ? (
                        <tr>
                          <td>
                            {data.dateTime ? commonService.localizedDate(data.dateTime) : ''}
                          </td>
                          <td>{data.exceptionType}</td>
                          <td>{data.title}</td>
                          <td>{data.status}</td>
                        </tr>
                      ) : undefined))}

                    </tbody>
                  </Table>
                  {myException.exceptionData.length > 4 && (
                    <div className="d-flex justify-content-end">
                      <Link to="/request/exceptions" className="seeAllbtn">
                        See All
                      </Link>
                    </div>
                  )}
                </div>
                <div className="m-2">
                  <p>
                    {' '}
                    <span className="validtionMessage">Note:</span>
                    {' '}
                    This section
                    consists Exceptions related to time, Clock-in and Clock-out
                    outside Geo-location. For Swaps and Over time please look
                    below.
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={12} lg={12} xl={6} className="mb-4">
              <div className="requestTabs">
                <Tabs
                  defaultActiveKey="1"
                  id="uncontrolled-tab-example"
                  onSelect={key => setViewSwapData({ key })}
                  className="d-flex justify-content-center"
                >
                  <Tab
                    eventKey="1"
                    title="My Submitted Swap Requests"
                    className="mySubmittedRequest col"
                  >
                    <div className="request-card">
                      <Table responsive bordered>
                        <thead>
                          <tr>
                            <th>{t('Date')}</th>
                            <th>{t('MyProfilePage.RequestType')}</th>
                            <th>{t('Action')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {swapTimedetails.list.length === 0
                            && (
                              <tr>
                                <td colSpan="10" className="text-center">No Data Available</td>
                              </tr>
                            )}
                          {swapTimedetails.list.map((reqData, index) => (index <= 9 ? (
                            <tr>
                              <td>
                                {reqData.createdOnUtc ? commonService.localizedDate(reqData.createdOnUtc) : ''}
                              </td>
                              <td>
                                <div className="shiftDescRequest">
                                  {reqData.targetShiftTitle}
                                </div>
                              </td>
                              <td>
                                <div className="shiftIconRequest">
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 40 }}
                                    overlay={renderTooltip('View Detail')}
                                  >
                                    <span>
                                      <img
                                        src={ViewIcon}
                                        alt="ViewIcon"
                                        onClick={() => handleShowSwapPopup(
                                          reqData.id,
                                          reqData.requestShiftTitle,
                                          reqData.requestShiftStartDateTime,
                                          reqData.requestShiftEndDateTime,
                                          reqData.targetShiftTitle,
                                          reqData.targetShiftStartDateTime,
                                          reqData.targetShiftEndDateTime,
                                          reqData.requestNotes,
                                          reqData.shiftStatus,
                                        )}
                                      />
                                    </span>
                                  </OverlayTrigger>
                                  {
                                    reqData.shiftStatus === 'Pending' ? (
                                      <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 50, hide: 40 }}
                                        overlay={renderTooltip(
                                          'Widthraw Request',
                                        )}
                                      >
                                        <span className="pl-3">
                                          <img
                                            src={Withdraw}
                                            alt="Withdraw"
                                            onClick={() => handleRequestWidraw(reqData.id)
                                            }
                                          />
                                        </span>
                                      </OverlayTrigger>
                                    ) : ''
                                  }
                                </div>
                              </td>
                            </tr>
                          ) : undefined))}
                        </tbody>
                      </Table>
                    </div>
                    <Row>
                      <Col className="text-right mb-3">
                        {swapTimedetails.list.length > 4 && (
                          <Link
                            to="/manage-requests/exception-request/swap-time"
                            className="seeAllbtn mr-3 "
                          >
                            See All
                          </Link>
                        )}
                      </Col>
                    </Row>
                  </Tab>
                  <Tab
                    eventKey="2"
                    title="Swap Requests Submitted By Others"
                    className="mySubmittedRequest col"
                  >
                    <div className="request-card">
                      <Table responsive bordered>
                        <thead>
                          <tr>
                            <th>{t('Date')}</th>
                            <th>{t('MyProfilePage.RequestType')}</th>
                            <th>{t('Action')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {swapTimedetails.list.length === 0
                            && (
                              <tr>
                                <td colSpan="10" className="text-center">No Data Available</td>
                              </tr>
                            )}
                          {swapTimedetails.list.map((reqData, index) => (index <= 9 ? (
                            <tr>
                              <td>
                                {`${moment(reqData.createdOnUtc).format(
                                  'MM/DD/YYYY',
                                )}`}
                              </td>
                              <td>
                                <div className="shiftDescRequest">
                                  {reqData.targetShiftTitle}
                                </div>
                              </td>
                              <td>
                                {
                                  reqData.shiftStatus === 'Pending' ? (
                                    <div className="shiftIconRequest">
                                      <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 50, hide: 40 }}
                                        overlay={renderTooltip('Reject Request')}
                                      >
                                        <span>
                                          <img
                                            src={removeIcon}
                                            alt="removeIcon"
                                            onClick={() => handleRejectRequest(reqData.id)
                                            }
                                          />
                                        </span>
                                      </OverlayTrigger>
                                      <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 50, hide: 40 }}
                                        overlay={renderTooltip('Accept Request')}
                                      >
                                        <span className="pl-3">
                                          <img
                                            src={checkedIcon}
                                            alt="checkedIcon"
                                            onClick={() => handleAcceptRequest(reqData.id)
                                            }
                                          />
                                        </span>
                                      </OverlayTrigger>
                                    </div>
                                  ) : (
                                    <div className="shiftIconRequest">
                                      <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 50, hide: 40 }}
                                        overlay={renderTooltip('View Detail')}
                                      >
                                        <span>
                                          <img
                                            src={ViewIcon}
                                            alt="ViewIcon"
                                            onClick={() => handleShowSwapPopup(
                                              reqData.id,
                                              reqData.requestShiftTitle,
                                              reqData.requestShiftStartDateTime,
                                              reqData.requestShiftEndDateTime,
                                              reqData.targetShiftTitle,
                                              reqData.targetShiftStartDateTime,
                                              reqData.targetShiftEndDateTime,
                                              reqData.requestNotes,
                                              reqData.shiftStatus,
                                            )}
                                          />
                                        </span>
                                      </OverlayTrigger>
                                    </div>
                                  )
                                }
                              </td>
                            </tr>
                          ) : undefined))}
                        </tbody>
                      </Table>
                    </div>
                    <Row>
                      <Col className="text-right mb-3">
                        {swapTimedetails.list.length > 4 && (
                          <Link
                            to="/swap-time/Others-request"
                            className="seeAllbtn mr-3"
                          >
                            See All
                          </Link>
                        )}
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>
              </div>
            </Col>
            <Col md={12} lg={12} xl={6} className="mb-4">
              <Card className="cardBox requestOverTime-card">
                <p className="cardBox_cardTitle requestOverTime-card-header">
                  Request Overtime
                </p>
                <div className="requestOverTimeDesc">
                  <Row md={12} className="mt-3">
                    <Col md={6}>
                      <label
                        className="form-label requestOverTime-card-label"
                        htmlFor={selectDate}
                      >
                        Select date
                      </label>
                      <span className="redStar"> * </span>
                      <DatePicker
                        name="currentUserDate"
                        selected={overTimeRequestDetails.currentUserDate}
                        onChange={e => handleSelectUserDateOt(e, 'currentUserDate')}
                        placeholderText={commonService.localizedDateFormat()}
                        dateFormat={commonService.localizedDateFormatForPicker()}
                        className="form-control cal_icon"
                        pattern="\d{2}\/\d{2}/\d{4}"
                        required
                      />
                      {overTimeRequestDetails.formErrors
                        .currentUserDateError && (
                          <div className="validtionMessage">
                            {
                              overTimeRequestDetails.formErrors
                                .currentUserDateError
                            }
                          </div>
                      )}
                    </Col>
                    <Col md={6}>
                      {' '}
                      <label className="form-label requestOverTime-card-label" htmlFor={selectDate}>
                        {t('MyProfilePage.SelectShift')}
                      </label>
                      <span className="redStar"> * </span>
                      <select
                        className="form-control"
                        name="currentUserShift"
                        value={overTimeRequestDetails.currentUserShift}
                        onChange={e => handleSelectShiftOverTime(e, 'id')}
                      >
                        <option>Choose Shift</option>
                        {shiftByDatesList.currentUserList.map(val => (
                          <option key={val.id} value={val.id}>
                            {val.title}
                          </option>
                        ))}
                      </select>
                      {overTimeRequestDetails.formErrors.currentUserShiftError && <div className="validtionMessage">{overTimeRequestDetails.formErrors.currentUserShiftError}</div>}
                    </Col>
                  </Row>
                  <Row md={12} className="mt-3">
                    <Col md={6}>
                      <label className="form-label requestOverTime-card-label" htmlFor={selectDate}>
                        {t('MyProfilePage.SelectHours')}
                      </label>
                      <span className="redStar"> * </span>
                      <input
                        value={overTimeRequestDetails.overTimeInHours}
                        className="form-control"
                        type="number"
                        min="0"
                        name="overTimeInHours"
                        onChange={e => handleOverTimeUserNotes(e)}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                      {overTimeRequestDetails.formErrors
                        .overTimeInHoursError && (
                          <div className="validtionMessage">
                            {
                              overTimeRequestDetails.formErrors
                                .overTimeInHoursError
                            }
                          </div>
                      )}
                    </Col>
                    <Col md={6}>
                      <label className="form-label requestOverTime-card-label" htmlFor={selectDate}>
                        {t('MyProfilePage.SelectMinutes')}
                      </label>
                      <span className="redStar"> * </span>
                      <input
                        value={overTimeRequestDetails.overTimeInMinutes}
                        className="form-control"
                        type="number"
                        name="overTimeInMinutes"
                        min="0"
                        onChange={e => handleOverTimeUserNotes(e)}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </Col>
                  </Row>
                  <Row md={12} className="mt-3">
                    <Col md={12}>
                      <label className="form-label " htmlFor={selectDate}>
                        {t('leavRequestPage.reason')}
                      </label>
                      <span className="redStar"> * </span>
                      <textarea
                        value={overTimeRequestDetails.userNotes}
                        name="userNotes"
                        className="form-control reason-textarea"
                        onChange={e => handleOverTimeUserNotes(e)}
                      >
                        {overTimeRequestDetails.userNotes}
                      </textarea>
                      {overTimeRequestDetails.formErrors.userNotesError && (
                        <div className="validtionMessage">
                          {overTimeRequestDetails.formErrors.userNotesError}
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row md={12} className="d-flex justify-content-center p-2 mt-5">
                    <div className="">
                      {overTime.isError ? overTime.error.error : null}
                      {overTime.isSuccess ? overTime.message : null}
                    </div>
                  </Row>


                  <div className=" d-flex justify-content-center p-4 mt-5">
                    <Button
                      className="reqOverTimeBtn"
                      onClick={handleSubmitOverTimeRequest}
                    >
                      {overTime.isLoading ? (
                        <Spinner animation="border" variant="light" />
                      ) : (
                        'Submit'
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={12} lg={12} xl={6} className="mb-4">
              <Card className="cardBox openShift-card">
                <p className="cardBox_cardTitle openShift-card-header">
                  Open Shifts
                </p>
                <Row>
                  <Col md={12}>
                    <div className="openShiftCard">
                      <Table responsive bordered>
                        <thead>
                          <tr>
                            {openShiftHeader.map(reqHeaderData => (
                              <th>{reqHeaderData.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {shiftdetails.length === 0
                            && (
                              <tr>
                                <td colSpan="10" className="text-center">No Data Available</td>
                              </tr>
                            )}
                          {shiftdetails.map((reqData, index) => (index <= 9 ? (
                            <tr>
                              <td>
                                {reqData.startDateTime ? commonService.localizedDate(reqData.startDateTime) : ''}
                              </td>
                              <td>
                                <div className="openShiftRequest">
                                  {reqData.title}

                                </div>
                              </td>
                              <td>
                                <div className="openShiftIcons">
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 50, hide: 40 }}
                                    overlay={renderTooltip(
                                      'Open Shift Request',
                                    )}
                                  >
                                    <span>
                                      {/* <img
                                        src={OpenShiftIcon}
                                        alt="OpenShiftIcon"
                                        onClick={() => showOpenRequest(reqData.id)}
                                      /> */}
                                    </span>
                                  </OverlayTrigger>
                                </div>
                              </td>
                            </tr>
                          ) : undefined))}
                        </tbody>
                      </Table>
                    </div>

                    <Row>
                      <Col md={12} className="text-right">
                        {shiftdetails.length > 7 && (
                        <Link
                                                      to="/schedule/my-schedule"
                          className="seeAllbtn mr-3"
                        >
                          See All
                        </Link>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col md={12} lg={12} xl={6} className="mb-4">
              <Card className="cardBox requestSwap-card">
                <p className="cardBox_cardTitle requestSwap-card-header">
                  Raise Swap Request
                </p>
                <div className="swapShiftCardDesc">
                  <Row md={12} className="mt-3 justify-content-center">
                    <Col md={6}>
                      <label className="form-label" htmlFor={selectDate}>
                        {t('MyProfilePage.Selectdate')}
                      </label>
                      <span className="redStar"> * </span>
                      <DatePicker
                        name="currentUserDate"
                        selected={swapRequestDetails.currentUserDate}
                        onChange={e => handleSelectUserDate(e, 'currentUserDate')}
                        placeholderText={commonService.localizedDateFormat()}
                        dateFormat={commonService.localizedDateFormatForPicker()}
                        className="form-control cal_icon"
                        pattern="\d{2}\/\d{2}/\d{4}"
                        required
                      />
                      {swapRequestDetails.formErrors.currentUserDateError && (
                        <div className="validtionMessage">
                          {swapRequestDetails.formErrors.currentUserDateError}
                        </div>
                      )}
                    </Col>
                    <Col md={6}>
                      {' '}
                      <label className="form-label" htmlFor={selectDate}>
                        {t('MyProfilePage.SelectShift')}
                      </label>
                      <span className="redStar"> * </span>
                      <select
                        className="form-control"
                        onChange={e => handleSelectShift(e, 'currentUserShift')
                        }
                        name="currentUserShift"
                        value={swapRequestDetails.currentUserShift}
                      >
                        <option>Choose Shift</option>
                        {shiftByDatesList.currentUserList.map(val => (
                          <option key={val.id} value={val.id}>
                            {val.title}
                          </option>
                        ))}
                      </select>
                      {swapRequestDetails.formErrors.currentUserShiftError && (
                        <div className="validtionMessage">
                          {swapRequestDetails.formErrors.currentUserShiftError}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row md={12} className="mt-3 justify-content-center">
                    <Col md={12}>
                      {' '}
                      <label className="form-label" htmlFor={selectDate}>
                        {t('VacationRequest.selectEmployee')}
                      </label>
                      <span className="redStar"> * </span>
                      <select
                        className="form-control"
                        onChange={handleSelectEmployee}
                        name="targetUser"
                        value={swapRequestDetails.targetUser}
                      >
                        <option>Choose Employee</option>
                        {teamMatesList.list
                          && teamMatesList.list.map(val => (
                            <option
                              value={val.id}
                            >
                              {`${val.firstName} ${val.lastName}`}
                            </option>
                          ))}
                      </select>
                      {swapRequestDetails.formErrors.targetUserError && (
                        <div className="validtionMessage">
                          {swapRequestDetails.formErrors.targetUserError}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row md={12} className="mt-3 justify-content-center">
                    <Col md={6}>
                      <label className="form-label" htmlFor={selectDate}>
                        {t('MyProfilePage.EmployeeSelectdate')}
                      </label>
                      <span className="redStar"> * </span>
                      <DatePicker
                        name="targetUserDate"
                        selected={swapRequestDetails.targetUserDate}
                        onChange={e => handleSelectUserDate(e, 'targetUserDate', swapRequestDetails.currentUserShift)}
                        placeholderText={commonService.localizedDateFormat()}
                        dateFormat={commonService.localizedDateFormatForPicker()}
                        className="form-control cal_icon"
                        pattern="\d{2}\/\d{2}/\d{4}"
                        required
                      />
                      {swapRequestDetails.formErrors.targetUserDateError && <div className="validtionMessage">{swapRequestDetails.formErrors.targetUserDateError}</div>
                      }
                    </Col>
                    <Col md={6}>
                      {' '}
                      <label className="form-label" htmlFor={selectDate}>
                        {t('MyProfilePage.EmployeeSelectShift')}
                      </label>
                      <span className="redStar"> * </span>
                      <select
                        className="form-control"
                        name="targetUserShift"
                        value={swapRequestDetails.targetUserShift}
                        // disabled={!swapRequestDetails.targetUser}
                        onChange={e => handleSelectShift(e, 'targetUserShift')
                        }
                      >
                        <option>Choose Shift</option>
                        {shiftByDatesList.targetUserList.map(val => (
                          <option key={val.id} value={val.id}>
                            {val.title}
                          </option>
                        ))}
                      </select>
                      {swapRequestDetails.formErrors.targetUserShiftError && <div className="validtionMessage">{swapRequestDetails.formErrors.targetUserShiftError}</div>
                      }

                    </Col>
                  </Row>
                  <Row md={12} className="mt-3 justify-content-center">
                    <Col md={12}>
                      <label className="form-label" htmlFor={selectDate}>
                        {t('Notes')}
                      </label>
                      <textarea
                        value={swapRequestDetails.reason}
                        name="reason"
                        className="form-control reason-textarea"
                        onChange={e => handleSwapSwiftReason(e)}
                      />
                    </Col>
                  </Row>
                  <Row md={12} className="d-flex justify-content-center p-2 mt-5">
                    <div>
                      {swapShift.isError ? swapShift.error.error : null}
                      {swapShift.isSuccess ? swapShift.message : null}
                    </div>
                  </Row>
                  <div className="d-flex justify-content-center p-2 mt-4">
                    <Button
                      className="reqOverTimeBtn mt-3"
                      // disabled={!(swapRequestDetails.currentUserShift && swapRequestDetails.targetUser && swapRequestDetails.targetUserShift)}
                      onClick={handleSubmit}
                    >
                      {swapShift.isLoading ? (
                        <Spinner animation="border" variant="light" />
                      ) : (
                        'Submit'
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={12} className="mb-4">
              <Card className="cardBox pb-3">
                <p className="cardBox_cardTitle">Vacation Info</p>
                <div className="leaveInfo">
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Vacation Category</th>
                        <th> Number Of Days</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveInfo.appliedLeaves.length === 0
                        && (
                          <tr>
                            <td colSpan="10" className="text-center">No Data Available</td>
                          </tr>
                        )}
                      {leaveInfo.appliedLeaves.map((leaveData, index) => (index <= 9 ? (
                        <tr>
                          <td>
                            {leaveData.strFromDateTimeUtc ? commonService.localizedDate(leaveData.strFromDateTimeUtc) : ''}
                          </td>
                          <td>
                            {leaveData.strToDateTimeUtc ? commonService.localizedDate(leaveData.strToDateTimeUtc) : ''}
                          </td>
                          <td>{leaveData.parentLeaveTypeName}</td>
                          <td>{leaveData.noOfDays}</td>
                          <td>{leaveData.appliedLeaveStatus}</td>
                        </tr>
                      ) : undefined))}
                    </tbody>
                  </Table>
                </div>
                <Row>
                  <Col md={12} className="text-right">
                    {leaveInfo.appliedLeaves.length > 7 && (
                      <Link
                        to="/vacation-management/my-vacation/applied-vacation"
                        className="seeAllbtn mr-3"
                      >
                        See All
                      </Link>
                    )}
                    <Link
                      to="/vacation-management/my-vacation/apply-vacation"
                      className="seeAllbtn mr-3"
                    >
                      Apply Vacation
                    </Link>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      {
        showModel.showOpenRequest && (
          <Modal
            show={showOpenRequest}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body>
              {t('MyProfilePage.ReqText')}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => handleClose()}>
                {t('CancelBtn')}
              </Button>
              <Button onClick={getRequestOpenShift}>{t('ConfirmBtn')}</Button>
            </Modal.Footer>
          </Modal>
        )
      }
      {
        showModel.showModelView && (
          <Modal
            show={handleRequestWidraw}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body>
              {t('MyProfilePage.ReqWithdrawText')}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => handleClose()}>
                {t('CancelBtn')}
              </Button>
              <Button id={40} type="submit" onClick={id => doWidthrawRequest(id)}>{t('ConfirmBtn')}</Button>
            </Modal.Footer>
          </Modal>
        )
      }
      {
        showModel.showSwapPopup && (
          <Modal
            show={handleShowSwapPopup}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton />
            <Modal.Body>
              <Form>
                <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                  <Form.Label column sm="5">{t('SwapTimePage.MyRequest.TableLabelRequestShift')}</Form.Label>
                  <Col sm="5">
                    <Form.Control as="input" disabled value={viewSwapData.requestShiftTitle} name="requestShiftTitle" />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                  <Form.Label column sm="5">{t('SwapTimePage.MyRequest.TableLabelShift.StartDate')}</Form.Label>
                  <Col sm="5">
                    <Form.Control disabled name="requestShiftStartDateTime" value={`${moment(viewSwapData.requestShiftStartDateTime).format('MM/DD/YYYY')}`} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                  <Form.Label column sm="5">{t('SwapTimePage.MyRequest.TableLabelShift.EndDate')}</Form.Label>
                  <Col sm="5">
                    <Form.Control disabled name="requestShiftEndDateTime" value={`${moment(viewSwapData.requestShiftEndDateTime).format('MM/DD/YYYY')}`} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                  <Form.Label column sm="5">{t('SwapTimePage.MyRequest.TableLabelTargetShift')}</Form.Label>
                  <Col sm="5">
                    <Form.Control disabled name="targetShiftTitle" value={viewSwapData.targetShiftTitle} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                  <Form.Label column sm="5">{t('SwapTimePage.MyRequest.TableLabelTraget.StartDate')}</Form.Label>
                  <Col sm="5">
                    <Form.Control disabled name="targetShiftStartDateTime" value={`${moment(viewSwapData.targetShiftStartDateTime).format('MM/DD/YYYY')}`} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                  <Form.Label disabled column sm="5">{t('SwapTimePage.MyRequest.TableLabelTraget.EndDate')}</Form.Label>
                  <Col sm="5">
                    <Form.Control disabled name="targetShiftEndDateTime" value={`${moment(viewSwapData.targetShiftEndDateTime).format('MM/DD/YYYY')}`} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                  <Form.Label column sm="5">{t('Notes')}</Form.Label>
                  <Col sm="5">
                    <Form.Control disabled name="requestNotes" value={viewSwapData.requestNotes} />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                  <Form.Label column sm="5">{t('Status')}</Form.Label>
                  <Col sm="5">
                    <Form.Control disabled name="shiftStatus" value={viewSwapData.shiftStatus} />
                  </Col>
                </Form.Group>
              </Form>

            </Modal.Body>
          </Modal>
        )
      }
      {
        showModel.showModelReject && (
          <Modal
            show={handleRejectRequest}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <form className="p-2">
              <div className="popup-header">{t('MyProfilePage.RejectedNotes')}</div>
              <div id="popup-form" className="text-center">
                <input type="text" className="form-control" onChange={handleChange} name="statusChangeNotes" id="statusChangeNotes" placeholder="Add Notes" maxLength="256" />
                {
                  rejectReq.requestError && !rejectReq.statusChangeNotes && <span className="error">{rejectReq.requestError}</span>
                }
                <br />
                <div className="btn-section text-center mb-2">
                  <button type="button" id={20} className="btn btn-primary btn-lg btn-custom btn-save" onClick={id => doRejectRequest(id)}>{t('OkBtn')}</button>
                  <button type="button" className="btn btn-secondary btn-lg btn-custom" onClick={handleClose}>{t('CancelBtn')}</button>
                </div>
              </div>
            </form>
          </Modal>
        )
      }
      {
        showModel.showModelAccept && (
          <Modal
            show={handleAcceptRequest}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body>
              {t('MyProfilePage.AcceptNotes')}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                {t('CancelBtn')}
              </Button>
              <Button id={30} type="submit" onClick={id => doAcceptRequest(id)}>{t('ConfirmBtn')}</Button>
            </Modal.Footer>
          </Modal>
        )
      }
      {/*
        showModel.showModelStartShift && (
          <Modal
            // show={handleStartShift}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body>
              Are you sure you want to Start Shift?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => startEndShift()}>Confirm</Button>
            </Modal.Footer>
          </Modal>
        )
        */}
      {
        punchInDetails.shiftModal && (
          <Modal
            show={punchInDetails.shiftModal}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body>
              {punchInDetails.modalBody}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => onConfirm()}>Confirm</Button>
            </Modal.Footer>
          </Modal>
        )
      }
      {
        punchInDetails.shiftStartEndModal && (
          <Modal
            show={punchInDetails.shiftStartEndModal}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body>
              {punchInDetails.shiftResponseMessage}
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn btn-primary btn-sm" onClick={handleClose}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        )
      }
      {
        punchInDetails.displayMessage && (
          <Modal
            show={punchInDetails.displayMessage}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body>
              {punchInDetails.responseMessage}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        )
      }

      {
        responseModal && (
          <Modal
            show={responseModal}
            onHide={() => setResponseModal(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body>
              {responseModalMessage}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setResponseModal(false)}>
                Ok
              </Button>
            </Modal.Footer>
          </Modal>
        )
      }

    </>
  );
};

export default Profile;
