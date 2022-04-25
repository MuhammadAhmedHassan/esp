/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import Scheduler, {
  SchedulerData,
  ViewTypes,
} from 'react-big-scheduler';
import {
  Col,
  DropdownButton,
  Dropdown,
  ListGroup,
  ListGroupItem,
  Row,
  Alert,
  Button,
  Form, Modal,
} from 'react-bootstrap';
import withDragDropContext from './withDnDContext';
import { callShiftData, SchDataMySchedule, initializedData } from './scheduleData';
import 'react-big-scheduler/lib/css/style.css';
import './style.scss';
import ModalPopUp from '../../common/Modal';
import Api from '../../common/Api';
import { userService } from '../../../services';
import PostApiCall from '../../common/serviceCall/PostApiCall';
import getEndDate, { setRealDate } from '../../common/app.constant';
import LoadingSpinner from '../../shared/LoadingSpinner';
import NoteIcon from '../../../Images/Icons/note_book.svg';
import startShift from '../../../Images/Icons/startShift.svg';
import swapShift from '../../../Images/Icons/swapShift.svg';
import endShift from '../../../Images/Icons/withdrawIcon.svg';
/**
 * Import declaration ends
 */
class MyScheduler extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.copyScheduleHtml = '';
    if (initializedData) {
      const schedulerData = new SchedulerData(new Date(), ViewTypes.Week, false, false,
        {
          eventItemHeight: 50,
          eventItemLineHeight: 55,
          nonWorkingTimeHeadBgColor: '#ffffff',
          nonWorkingTimeBodyBgColor: '#ffffff',
          nonWorkingTimeBodyBgColor: '#ffffff',
          views: [
            { viewName: 'Day', viewType: ViewTypes.Day },
            { viewName: 'Week', viewType: ViewTypes.Week },
            { viewName: 'Month', viewType: ViewTypes.Month },
          ],
        });
      schedulerData.localeMoment.locale('en');
      schedulerData.setResources(initializedData.resources);
      schedulerData.setEvents(initializedData.events);
      this.state = {
        viewModel: schedulerData,
        modalShow: false,
        token: `Bearer ${token}`,
        shareWithTeam: false,
        userShiftStatusId: 0,
        userId,
        schedulerData,
        loading: false,
        empList: [],
        userIds: '',
        scheduleDdTitle: 'Select Schedule',
        geoCoordinates: '',
        employeeCal: true,
        modelUpdate: false,
        errorMessage: '',
      };
    } else {
      this.state = {
        viewModel: '',
        modalShow: false,
        shareWithTeam: false,
      };
    }
  }

  componentDidMount() {
    // Set the geoLocation
    navigator.geolocation.getCurrentPosition((position) => {
      const geoLocation = `${position.coords.latitude} ${position.coords.longitude}`;
      this.setState({ geoCoordinates: geoLocation });
    });
    this.getMyShifts();
    const queriedDivs = document.querySelectorAll('.overflow-text.header2-text');
    for (let i = 0; i < queriedDivs.length; i += 1) {
      queriedDivs[i].removeAttribute('title');
    }

    document.addEventListener('mouseover', () => {
      const hoveredDivs = document.querySelectorAll('.dot-ele.show.dropdown');
      if (hoveredDivs.length > 0) {
        for (let i = 0; i < queriedDivs.length; i += 1) {
          if (hoveredDivs[i] && hoveredDivs[i].parentElement) {
            if (hoveredDivs[i].closest('.ant-popover-hidden')) {
              hoveredDivs[i].children[0].click();
            }
          }
        }
      }
    });
  }

  getMyShifts = async () => {
    const { userShiftStatusId, schedulerData } = this.state;
    const token = userService.getToken();
    const userId = userService.getUserId();
    const shiftReqBody = {
      languageId: 1,
      startDateTime: getEndDate.dateMinusSeven(),
      endDateTime: getEndDate.datePlusSeven(),
      requestByUserId: userId,
      isActiveOnly: true,
      userIds: userId.toString(),
      userShiftStatusId,
    };
    try {
      this.setState({ loading: true });
      const filteredShift = await callShiftData(token, shiftReqBody);
      const functionParam = { getShiftData: { mergedShift: filteredShift.mergedShift } };
      this.scheduleData = SchDataMySchedule(functionParam);

      schedulerData.setEvents(this.scheduleData.events);
      schedulerData.setResources(this.scheduleData.resources);
      this.setState({
        viewModel: schedulerData,
      });
      this.setState({ loading: false, schedulerData });
      const scheduleReqBody = {
        id: userId,
        languageId: 1,
      };
      const getScheduleByUserId = await PostApiCall(`${Api.schedule.getAllByUserId}`, scheduleReqBody, token);
      this.setState({ schedules: getScheduleByUserId.data });
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
    }
  }

  callShiftUpdateCal = async (schedulerData) => {
    const { token, userId, userShiftStatusId } = this.state;
    let extendedEndDate;
    if (schedulerData.startDate === schedulerData.endDate) {
      extendedEndDate = getEndDate.currentDateTom(schedulerData.endDate);
    } else {
      const { endDate } = schedulerData;
      extendedEndDate = endDate;
    }
    let shiftReqBody = {};
    shiftReqBody = {
      languageId: 1,
      startDateTime: schedulerData.startDate,
      endDateTime: extendedEndDate,
      requestByUserId: userId,
      isActiveOnly: true,
      userShiftStatusId,
      userIds: userId.toString(),
    };
    this.setState({ loading: true });
    const filteredShift = await callShiftData(token, shiftReqBody);
    const functionParam = { getShiftData: { mergedShift: filteredShift.mergedShift } };
    this.scheduleData = SchDataMySchedule(functionParam);
    schedulerData.setEvents(this.scheduleData.events);
    schedulerData.setResources(this.scheduleData.resources);
    this.setState({
      viewModel: schedulerData,
    });
    this.setState({ loading: false, schedulerData });
  }

  prevClick = async (schedulerData) => {
    try {
      schedulerData.prev();
      await this.callShiftUpdateCal(schedulerData);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
      this.setState({ loading: false });
    }
  };

  nextClick = async (schedulerData) => {
    try {
      schedulerData.next();
      await this.callShiftUpdateCal(schedulerData);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
      this.setState({ loading: false });
    }
  };

  onViewChange = async (schedulerData, view) => {
    this.setState({ viewSelected: view.viewType });
    schedulerData.setViewType(
      view.viewType,
    );
    try {
      await this.callShiftUpdateCal(schedulerData);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
      this.setState({ loading: false });
    }
  };

  onSelectDate = async (schedulerData, date) => {
    schedulerData.setDate(date);
    await this.callShiftUpdateCal(schedulerData);
  };

  selectToday = (schedulerData) => {
    schedulerData.setDate(new Date());
    schedulerData.setEvents(this.scheduleData.events);
    this.setState({
      viewModel: schedulerData,
    });
  };

  swapShiftFn = (event) => {
    const { history } = this.props;
    history.push({
      pathname: 'swap-shift',
      state: { requestShift: event },
    });
  }

  handleClose = () => {
    this.setState({
      modelUpdate: false,
    });
  };


  applyOpenShift = async (shiftId) => {
    const { token, userId } = this.state;
    const reqOpenShift = {
      id: shiftId,
      languageId: 1,
      userId,
      updatedByUserId: userId,
    };
    this.setState({ loading: true });
    try {
      const applyOpnShiftResp = await PostApiCall(`${Api.shift.applyOpenShift}`, reqOpenShift, token);
      this.setState({ loading: false, modelUpdate: true, errorMessage: applyOpnShiftResp.message });
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err);
      this.setState({ loading: false });
    }
  }

  eventItemPopoverTemplateResolver = (schedulerData, eventItem, title, start, end, statusColor) => (
    <div>
      <Row>
        <Col className="overflow-text">
          <span className="header2-text" title={title}>{title}</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <span className="header1-text">
            {start.format('HH:mm')}
            {' '}
            -
            {' '}
            {end.format('HH:mm')}
          </span>

        </Col>
      </Row>
      <Row>
        <Col className="overflow-text">
          <span className="header2-text" title={eventItem.colour}>
            Colour:
            {' '}
            {eventItem.colour}
          </span>
        </Col>
      </Row>

      <Row className="position-absolute three-dot-wrapper">
        {
          (!eventItem.isOpenShift && (eventItem.isShiftSwapAllowed || eventItem.userShiftStatusIdDashboard === 10 || eventItem.userShiftStatusIdDashboard === 0 || eventItem.userShiftStatusIdDashboard === 20)) || eventItem.IsOpenShiftRequestAllowed ? (
            <DropdownButton
              id="dropdown-menu-align-right"
              className="dot-ele"
              title=""
            >
              {!eventItem.isOpenShift && (
                <>
                  {
                    eventItem.isShiftSwapAllowed ? (
                      <Dropdown.Item eventKey="1" className="d-flex" onClick={() => this.swapShiftFn(eventItem)}>
                        <img
                          src={swapShift}
                          alt="Swap Shift"
                          className="mr-2"
                          width="20"
                        />
                        Swap Shift
                      </Dropdown.Item>
                    ) : ''
                  }
                  {eventItem.userShiftStatusIdDashboard === 10 || eventItem.userShiftStatusIdDashboard === 0
                    ? (
                      <Dropdown.Item
                        className="d-flex"
                        eventKey="start"
                        onClick={() => this.startEndShift(eventItem.id, true, false)}
                      >
                        <img
                          src={startShift}
                          alt="Start Shift"
                          className="mr-2"
                          width="20"
                        />
                        Start Shift
                      </Dropdown.Item>
                    )
                    : null}
                  {eventItem.userShiftStatusIdDashboard === 20
                    ? (
                      <Dropdown.Item
                        className="d-flex"
                        eventKey="close"
                        onClick={() => this.startEndShift(eventItem.id, false, false)}
                      >
                        <img
                          src={endShift}
                          alt="End Shift"
                          className="mr-2"
                          width="20"
                        />
                        End Shift
                      </Dropdown.Item>
                    )
                    : null}
                </>
              )}
              {eventItem.isOpenShift && eventItem.IsOpenShiftRequestAllowed
                ? (
                  <Dropdown.Item eventKey="1" onClick={() => this.applyOpenShift(eventItem.id)}>
                    Request for Open shift
                  </Dropdown.Item>
                ) : null
              }
            </DropdownButton>
          ) : ''
        }
      </Row>
    </div>
  );

  eventItemTemplateResolver =
    (schedulerData,
      event, bgColor, isStart, isEnd, mustAddCssClass, mustBeHeight, agendaMaxEventWidth) => {
      const { viewSelected } = this.state;
      const getRows = document.getElementsByClassName('event-container');
      const getEventRow = document.getElementsByClassName('scheduler-bg-table');
      if (viewSelected === 0 && getRows[0].classList) {
        setTimeout(() => {
          getRows[0].classList.add('full-length');
          getEventRow[1].classList.add('full-length');
        }, 0);
      } else {
        setTimeout(() => {
          getRows[0].classList.remove('full-length');
          getEventRow[1].classList.remove('full-length');
        }, 0);
      }
      const borderWidth = isStart ? '4' : '0';
      const borderColor = event.colourCode;
      const backgroundColor = event.colourCodeLight || '#F2FCFE';
      const titleText = schedulerData.behaviors.getEventTextFunc(schedulerData, event);
      let divStyle = {
        borderLeft: `${borderWidth}px solid ${borderColor}`,
        backgroundColor,
        height: mustBeHeight,
      };
      let bgImageClass;
      if (event.resourceId !== 'r0') {
        // eslint-disable-next-line no-nested-ternary
        bgImageClass = event.isOpenShift ? 'open-shift-icon' : event.isOnCallShift ? 'on-call-icon' : event.isOverTimeShift ? 'over-time-icon' : 'not-decided-icon';
      } else {
        bgImageClass = '';
      }
      if (agendaMaxEventWidth) divStyle = { ...divStyle, maxWidth: agendaMaxEventWidth };

      return (
        <div
          className={[mustAddCssClass, bgImageClass].join(' ')}
          key={event.id}
          style={divStyle}
        >
          {(event.isOpenShift
            ? (
              <span className="icon open-shift-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill={borderColor} />
                  <path d="M16.1611 12.3696C16.1611 11.5854 15.9286 10.8187 15.4928 10.1666C15.0571 9.51451 14.4378 9.00627 13.7133 8.70614C12.9887 8.40601 12.1914 8.32749 11.4222 8.48049C10.653 8.63349 9.94645 9.01115 9.39189 9.56572C8.83733 10.1203 8.45967 10.8268 8.30666 11.596C8.15366 12.3652 8.23219 13.1625 8.53231 13.8871C8.83244 14.6117 9.34068 15.231 9.99278 15.6667C10.6449 16.1024 11.4115 16.335 12.1958 16.335C13.2471 16.3338 14.255 15.9156 14.9984 15.1722C15.7418 14.4288 16.1599 13.4209 16.1611 12.3696ZM9.14363 12.8102H9.55225C9.6691 12.8102 9.78116 12.7638 9.86379 12.6812C9.94642 12.5985 9.99284 12.4865 9.99284 12.3696C9.99284 12.2528 9.94642 12.1407 9.86379 12.0581C9.78116 11.9755 9.6691 11.929 9.55225 11.929H9.14363C9.23975 11.2706 9.54584 10.6607 10.0164 10.1902C10.4869 9.71967 11.0968 9.41358 11.7552 9.31746V9.72607C11.7552 9.84293 11.8016 9.95499 11.8843 10.0376C11.9669 10.1202 12.0789 10.1667 12.1958 10.1667C12.3126 10.1667 12.4247 10.1202 12.5073 10.0376C12.59 9.95499 12.6364 9.84293 12.6364 9.72607V9.31746C13.2948 9.41358 13.9047 9.71967 14.3752 10.1902C14.8457 10.6607 15.1518 11.2706 15.248 11.929H14.8393C14.7225 11.929 14.6104 11.9755 14.5278 12.0581C14.4452 12.1407 14.3988 12.2528 14.3988 12.3696C14.3988 12.4865 14.4452 12.5985 14.5278 12.6812C14.6104 12.7638 14.7225 12.8102 14.8393 12.8102H15.248C15.1518 13.4687 14.8457 14.0785 14.3752 14.549C13.9047 15.0196 13.2948 15.3257 12.6364 15.4218V15.0132C12.6364 14.8963 12.59 14.7843 12.5073 14.7016C12.4247 14.619 12.3126 14.5726 12.1958 14.5726C12.0789 14.5726 11.9669 14.619 11.8843 14.7016C11.8016 14.7843 11.7552 14.8963 11.7552 15.0132V15.4218C11.0968 15.3257 10.4869 15.0196 10.0164 14.549C9.54584 14.0785 9.23975 13.4687 9.14363 12.8102Z" fill="white" />
                  <path d="M11.9985 12.7629C12.0812 12.8043 12.1749 12.8185 12.2661 12.8037C12.3574 12.7889 12.4417 12.7458 12.5071 12.6804L13.682 11.5054C13.7635 11.4226 13.809 11.3109 13.8085 11.1947C13.8081 11.0784 13.7617 10.9671 13.6795 10.8849C13.5973 10.8027 13.486 10.7563 13.3698 10.7559C13.2535 10.7554 13.1418 10.8009 13.059 10.8824L12.1086 11.8328L11.2177 11.3873C11.1132 11.3351 10.9922 11.3265 10.8814 11.3634C10.7705 11.4004 10.6789 11.4798 10.6266 11.5844C10.5743 11.6889 10.5657 11.8099 10.6027 11.9207C10.6396 12.0316 10.7191 12.1232 10.8236 12.1755L11.9985 12.7629Z" fill="white" />
                  <path d="M5.44059 12.8093C5.55744 12.8093 5.66951 12.7629 5.75214 12.6803C5.83476 12.5976 5.88118 12.4856 5.88118 12.3687C5.88118 9.05325 8.44928 6.32654 11.7007 6.07294L11.2973 6.47634C11.2559 6.51713 11.2229 6.56573 11.2003 6.61932C11.1777 6.67292 11.166 6.73046 11.1658 6.78862C11.1655 6.84678 11.1768 6.90441 11.1989 6.95819C11.2211 7.01197 11.2537 7.06083 11.2948 7.10196C11.3359 7.14309 11.3848 7.17566 11.4386 7.19781C11.4923 7.21996 11.55 7.23124 11.6081 7.231C11.6663 7.23077 11.7238 7.21902 11.7774 7.19643C11.831 7.17385 11.8796 7.14087 11.9204 7.09941L13.0953 5.9245C13.1779 5.84187 13.2244 5.72981 13.2244 5.61297C13.2244 5.49612 13.1779 5.38406 13.0953 5.30143L11.9204 4.12652C11.8376 4.045 11.7258 3.99953 11.6096 4C11.4934 4.00048 11.3821 4.04686 11.2999 4.12905C11.2177 4.21123 11.1713 4.32257 11.1708 4.4388C11.1704 4.55503 11.2158 4.66674 11.2973 4.74959L11.7353 5.18757C7.98134 5.42612 5 8.55553 5 12.3687C5 12.4856 5.04642 12.5976 5.12905 12.6803C5.21167 12.7629 5.32374 12.8093 5.44059 12.8093Z" fill="white" />
                  <path d="M18.9517 11.9277C18.8348 11.9277 18.7228 11.9742 18.6402 12.0568C18.5575 12.1394 18.5111 12.2515 18.5111 12.3683C18.5111 15.6838 15.943 18.4105 12.6916 18.6641L13.095 18.2607C13.1765 18.1778 13.222 18.0661 13.2215 17.9499C13.221 17.8337 13.1746 17.7223 13.0925 17.6401C13.0103 17.558 12.8989 17.5116 12.7827 17.5111C12.6665 17.5106 12.5548 17.5561 12.4719 17.6376L11.297 18.8125C11.2144 18.8952 11.168 19.0072 11.168 19.1241C11.168 19.2409 11.2144 19.353 11.297 19.4356L12.4719 20.6105C12.5548 20.692 12.6665 20.7375 12.7827 20.737C12.8989 20.7366 13.0103 20.6902 13.0925 20.608C13.1746 20.5258 13.221 20.4145 13.2215 20.2982C13.222 20.182 13.1765 20.0703 13.095 19.9874L12.657 19.5495C16.411 19.3109 19.3923 16.1815 19.3923 12.3683C19.3923 12.2515 19.3459 12.1394 19.2632 12.0568C19.1806 11.9742 19.0686 11.9277 18.9517 11.9277Z" fill="white" />
                </svg>

              </span>
            )
            : event.isOnCallShift
              ? (
                <span className="icon on-call-icon">
                  <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill={borderColor} />
                    <path d="M10.8672 12.4805L7.32812 11.4258L7.86719 9.65625L11.4062 10.9688L11.3008 6.9375H13.0938L12.9766 11.0273L16.457 9.73828L16.9961 11.5195L13.3984 12.5859L15.7188 15.7617L14.2656 16.8633L12.0859 13.4883L9.97656 16.7812L8.51172 15.7148L10.8672 12.4805Z" fill="white" />
                  </svg>
                </span>
              )
              : event.isOverTimeShift
                ? (
                  <span className="icon over-time-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="12" fill={borderColor} />
                      <path d="M11.5 19C7.91576 19 5 16.0842 5 12.5C5 8.91576 7.91576 6 11.5 6C15.0842 6 18 8.91576 18 12.5C18 16.0842 15.0842 19 11.5 19ZM11.5 6.8125C8.36376 6.8125 5.8125 9.36376 5.8125 12.5C5.8125 15.6362 8.36376 18.1875 11.5 18.1875C14.6362 18.1875 17.1875 15.6362 17.1875 12.5C17.1875 9.36376 14.6362 6.8125 11.5 6.8125Z" fill="white" />
                      <path d="M14.3438 16.0202C14.2397 16.0202 14.1358 15.9807 14.0566 15.901L11.2129 13.0573C11.1365 12.9809 11.0938 12.8775 11.0938 12.7702V8.97852C11.0938 8.75426 11.2757 8.57227 11.5 8.57227C11.7243 8.57227 11.9062 8.75426 11.9062 8.97852V12.6017L14.6309 15.3264C14.7896 15.4851 14.7896 15.7423 14.6309 15.901C14.5517 15.9807 14.4478 16.0202 14.3438 16.0202Z" fill="white" />
                    </svg>

                  </span>
                )
                : (
                  <span className="icon not-decided-icon">
                    <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="12" fill={borderColor} />
                      <path d="M10.8672 12.4805L7.32812 11.4258L7.86719 9.65625L11.4062 10.9688L11.3008 6.9375H13.0938L12.9766 11.0273L16.457 9.73828L16.9961 11.5195L13.3984 12.5859L15.7188 15.7617L14.2656 16.8633L12.0859 13.4883L9.97656 16.7812L8.51172 15.7148L10.8672 12.4805Z" fill="white" />
                    </svg>
                  </span>
                )
          )}
          <span style={{ marginLeft: '10px', lineHeight: `${mustBeHeight}px` }}>
            {titleText}
            {event.isConflicted ? (<span className="show-flag" />) : null}
          </span>
        </div>
      );
    }

  hideModal = async (isConfirmed) => {
    const { shiftId, isShiftStart, enableConfirm } = this.state;
    this.setState({ modalShow: false });
    if (isConfirmed) {
      await this.startEndShift(shiftId, isShiftStart, true);
    }
  }


  handleDropDown = (selectedVal, stateName) => {
    this.setState({ [stateName]: Number(selectedVal) }, async () => {
      const {
        token, userId, userShiftStatusId, schedulerData,
      } = this.state;
      const shiftReqBody = {
        languageId: 1,
        startDateTime: schedulerData.startDate,
        endDateTime: schedulerData.endDate,
        requestByUserId: userId,
        isActiveOnly: true,
        userShiftStatusId,
        userIds: userId.toString(),
      };
      this.setState({ loading: true });
      try {
        const filteredShift = await callShiftData(token, shiftReqBody);
        const functionParam = { getShiftData: { mergedShift: filteredShift.mergedShift } };
        this.scheduleData = SchDataMySchedule(functionParam);
        schedulerData.setEvents(this.scheduleData.events);
        this.setState({ viewModel: schedulerData, loading: false });
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert(err);
        this.setState({ loading: false });
      }
    });
  }


  onScheduleSelect = async (scheduleId, filterFrom, stateTitle) => {
    const {
      userId, token, schedulerData, selectedUserId,
    } = this.state;
    const reqBody = {
      languageId: 1,
      startDateTime: new Date(),
      endDateTime: getEndDate.datePlusSeven(),
      requestByUserId: userId,
      scheduleId: Number(scheduleId),
      userIds: userId.toString(),
      isActiveOnly: true,
    };
    this.setState({ loading: true });
    try {
      const getShiftForSchedule = await callShiftData(token, reqBody);
      const functionParam = { getShiftData: { mergedShift: getShiftForSchedule.mergedShift } };
      this.scheduleData = SchDataMySchedule(functionParam);
      schedulerData.setEvents(this.scheduleData.events);
      // eslint-disable-next-line react/destructuring-assignment
      const getStateValue = this.state[filterFrom];
      const filteredValue = getStateValue.filter(objVal => objVal.id === Number(scheduleId));
      this.setState({
        viewModel: schedulerData, loading: false, selectedScheduleIdDp: Number(scheduleId), [stateTitle]: filteredValue.length > 0 ? filteredValue[0].title : 'All', schedulerData,
      });
    } catch (err) {
      this.setState({ loading: false });
      // eslint-disable-next-line no-alert
      alert(err);
    }
  }

  startEndShift = async (shiftId, isShiftStart, isForced) => {
    const {
      userId, token, geoCoordinates, modalShow, schedulerData,
    } = this.state;
    if (geoCoordinates === '') {
      this.setState({ modalShow: true, modalBody: 'Please allow location access to use this feature', enableConfirm: true });
      return true;
    }
    this.setState({ shiftId, isShiftStart });
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

    this.setState({ loading: true });

    await fetch(`${Api.shift.startEndShift}`, {
      method: 'POST',
      headers: new Headers({
        Token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(startEndShiftReq),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.callShiftUpdateCal(schedulerData);
        } else if (response.statusCode === 290) {
          this.setState({ modalShow: true, modalBody: response.message, enableConfirm: true });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.startEndShift(shiftId, isShiftStart, isForced));
          });
        } else {
          this.setState({ modalShow: true, modalBody: response.message, enableConfirm: false });
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
    return true;
  }

  render() {
    const {
      viewModel, modalShow, inputText,
      userShiftStatusId, loading, modalBody,
      schedules, scheduleDdTitle, employeeCal, enableConfirm, modelUpdate, errorMessage,
    } = this.state;
    const leftCustomHeader = (
      <button type="button" id="today" onClick={() => this.selectToday(viewModel)}> Today </button>
    );
    return (
      <>
        <div>
          {loading ? (<LoadingSpinner />) : null}
        </div>
        <ModalPopUp
          show={modalShow}
          header={enableConfirm ? 'Confirm' : 'Message'}
          inputval={inputText}
          onHide={this.hideModal}
          sectionname={enableConfirm ? 'confirm' : 'message'}
          modalbody={modalBody}
          enableConfirm={enableConfirm}
        />
        {!viewModel ? (
          <Alert variant="danger" dismissible>
            <p>Unable to fetch the shift Data. Please try again after sometime.</p>
          </Alert>
        ) : null}

        <div className="container-fluid shift-template">
          <div className="card_layout">
            {employeeCal && (
              <div className="see-schdule">
                <Row>
                  <Col xl={6} lg={8} md={12} sm={12}>
                    <Row>
                      <div className="col-md-6 react-multiselect react-multiselect-dropdown">
                        <Dropdown onSelect={e => this.onScheduleSelect(e, 'schedules', 'scheduleDdTitle')}>
                          <Dropdown.Toggle className="mb-2">
                            {scheduleDdTitle}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item eventKey={0} key={0}>All</Dropdown.Item>
                            {schedules && schedules.map(val => (
                              <Dropdown.Item
                                eventKey={val.id}
                                key={val.id}
                              >
                                {val.title}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <div className="col-md-6 react-multiselect react-multiselect-dropdown">
                        <Dropdown onSelect={e => this.handleDropDown(e, 'userShiftStatusId')}>
                          <Dropdown.Toggle>
                            { /* eslint-disable-next-line no-nested-ternary */}
                            {userShiftStatusId === 0 ? 'All' : userShiftStatusId === 10 ? 'Upcoming' : userShiftStatusId === 20 ? 'Active' : userShiftStatusId === 30 ? 'Completed' : 'Select shift'}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item eventKey={0}>All</Dropdown.Item>
                            <Dropdown.Item eventKey={10}>Upcoming</Dropdown.Item>
                            <Dropdown.Item eventKey={20}>Active</Dropdown.Item>
                            <Dropdown.Item eventKey={30}>Completed</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Row>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        </div>

        <div className="container-fluid shift-template">
          <div className="card_layout">
            {viewModel ? (
              <div className="schedulerCard">
                <div className={employeeCal ? 'hide-note-icon' : ''}>
                  <Scheduler
                    schedulerData={viewModel}
                    prevClick={this.prevClick}
                    nextClick={this.nextClick}
                    onSelectDate={this.onSelectDate}
                    onViewChange={this.onViewChange}
                    eventItemPopoverTemplateResolver={this.eventItemPopoverTemplateResolver}
                    eventItemTemplateResolver={this.eventItemTemplateResolver}
                    leftCustomHeader={leftCustomHeader}
                    eventItemClick={this.eventClicked}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {modelUpdate && (
          <Modal
            show={modelUpdate}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title><p>{errorMessage}</p></Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="primary" onClick={this.handleClose}>
                Ok
              </Button>
            </Modal.Footer>
          </Modal>
        )}

      </>
    );
  }
}

export default withDragDropContext(MyScheduler);
