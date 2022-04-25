/* eslint-disable no-undef */
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Form, Button, Row, Col, ToggleButtonGroup, ToggleButton, Card, Modal,
} from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import './style.scss';
import { userService } from '../../../services';
import Api from '../../common/Api';
import clockIcon from '../../../Images/Icons/clock.svg';
import NoteIcon from '../../../Images/Icons/note_book.svg';
import RightArrowIcon from '../../../Images/Icons/right-arrow.svg';
import groupIcon from '../../../Images/Icons/add_friend.svg';
import addTitleIcon from '../../../Images/Icons/pencil.svg';
import paintBoardIcon from '../../../Images/Icons/paint_board_and_brush.svg';
import hoTCoffeeIcon from '../../../Images/Icons/coffee_cup.svg';
import getEndDate, { setRealDate } from '../../common/app.constant';
import { callShiftData } from '../SeeScheduler/scheduleData';
import LoadingSpinner from '../../shared/LoadingSpinner';
import PostApiCall from '../../common/serviceCall/PostApiCall';
import getMinDate from '../../common/app.constant';
import cancelIcon from '../../../Images/Icons/cancel.svg';
import plusIcon from '../../../Images/Icons/plus_icon.svg';
import { commonService } from '../../../services/common.service';

/**
 * Import ends
 */
const monthlyDays = [
  {
    day: 1,
  },
  {
    day: 2,
  },
  {
    day: 3,
  },
  {
    day: 4,
  },
  {
    day: 5,
  },
  {
    day: 6,
  },
  {
    day: 7,
  },
  {
    day: 8,
  },
  {
    day: 9,
  },
  {
    day: 10,
  },
  {
    day: 11,
  },
  {
    day: 12,
  },
  {
    day: 13,
  },
  {
    day: 14,
  },
  {
    day: 15,
  },
  {
    day: 16,
  },
  {
    day: 17,
  },
  {
    day: 18,
  },
  {
    day: 19,
  },
  {
    day: 20,
  },
  {
    day: 21,
  },
  {
    day: 22,
  },
  {
    day: 23,
  },
  {
    day: 24,
  },
  {
    day: 25,
  },
  {
    day: 26,
  },
  {
    day: 27,
  },
  {
    day: 28,
  },
  {
    day: 29,
  },
  {
    day: 30,
  },
  {
    day: 31,
  },

];

class ShiftTemplate extends React.PureComponent {
  constructor(props) {
    super(props);
    this.props = props;
    const { location } = this.props;
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
    this.isRecurring = this.isRecurring.bind(this);
    this.previewPattern = this.previewPattern.bind(this);
    this.selectRecurring = this.selectRecurring.bind(this);
    this.updateShiftTemplate = this.updateShiftTemplate.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.back = this.back.bind(this);
    this.state = {
      ModelUpdate: false,
      SaveUpdate: false,
      errorMessage: '',
      responseStatus: 0,
      title: (location.state && location.state.shiftTemp) ? location.state.shiftTemp.title : '',
      errors: [],
      isOpenShift: (location.state && location.state.shiftTemp)
        ? location.state.shiftTemp.isOpenShift : false,
      // eslint-disable-next-line react/no-unused-state
      isOnCallShift: false,
      // eslint-disable-next-line react/no-unused-state
      isOverTimeShift: false,
      shiftType: (location.state && location.state.shiftTemp) ? location.state.shiftTemp.shiftType : '0',
      token: `Bearer ${token}`,
      scheduleId: this.getScheduleId(),
      userIds: [],
      onBehalfOfManagerId: undefined,
      colours: [{ id: 0, name: 'Choose Color' }],
      colourId: (location.state && location.state.shiftTemp)
        ? Number(location.state.shiftTemp.colourId) : 0,
      // eslint-disable-next-line react/no-unused-state
      totalHours: '',
      allowedPaidBreakTime: (location.state && location.state.shiftTemp && location.state.shiftTemp.allowedPaidBreakTime > 0)
        ? location.state.shiftTemp.allowedPaidBreakTime : '',
      // eslint-disable-next-line react/no-unused-state
      shiftTypeId: '',
      // eslint-disable-next-line react/no-unused-state
      statusId: '',
      notes: (location.state && location.state.shiftTemp)
        ? location.state.shiftTemp.notes : undefined,
      startDate: ((location.state && location.state.shiftTemp) && location.state.shiftTemp.startDate !== '') ? new Date(location.state.shiftTemp.startDate) : '',
      endDate: ((location.state && location.state.shiftTemp) && location.state.shiftTemp.endDate !== '') ? new Date(location.state.shiftTemp.endDate) : '',
      startTime: ((location.state && location.state.shiftTemp) && location.state.shiftTemp.startTime !== '') ? new Date(location.state.shiftTemp.startTime) : '',
      endTime: ((location.state && location.state.shiftTemp) && location.state.shiftTemp.endTime !== '') ? new Date(location.state.shiftTemp.endTime) : '',
      isRecurring: (location.state && location.state.shiftTemp)
        ? location.state.shiftTemp.isRecurring : false,
      frequencyId: (location.state && location.state.shiftTemp)
        ? location.state.shiftTemp.frequencyId : 1,
      weekDays: this.setWeekdays(),
      monthDates: this.setMonthDates(),
      workingDays: (location.state && location.state.shiftTemp)
        ? location.state.shiftTemp.workingDays : 0,
      nonWorkingDays: (location.state && location.state.shiftTemp)
        ? location.state.shiftTemp.nonWorkingDays : 0,
      // eslint-disable-next-line react/no-unused-state
      createdByUserId: userId,
      // eslint-disable-next-line react/no-unused-state
      isActive: true,
      // eslint-disable-next-line react/no-unused-state
      languageId: 1,
      fromDateIsGreater: false,
      toDateIsSmaller: false,
      startTimeIsGreater: false,
      timeAreEquals: false,
      endTimeIsSmaller: false,
      active: false,
      selectedDates: [],
      loading: false,
      isSaveAsShiftTemplate: false,
      // eslint-disable-next-line no-nested-ternary
      isReadOnly: (location.state && location.state.isReadOnly) ? location.state.isReadOnly
        : (location.state && location.state.shiftTemp) ? location.state.shiftTemp.isReadOnly
          : false,
      // eslint-disable-next-line no-nested-ternary
      shiftTemplate: (location.state && location.state.shiftTemplate) ? location.state.shiftTemplate
        : (location.state && location.state.shiftTemp) ? location.state.shiftTemp.shiftTemplate
          : false,
      shiftTemplateId: (location.state && location.state.shiftTemp && location.state.shiftTemp !== undefined) ? (location.state.shiftTemp.shiftTemplateId !== undefined) && location.state.shiftTemp.shiftTemplateId : 0,
      shiftId: (location.state && location.state.shift) ? location.state.shiftTemp.id : 0,
      id: (location.state && location.state.shift) ? location.state.shiftTemp.id : 0,
      isReadOnlyOnBehalf: !!((location.state && (location.state.shift || location.state.shiftTemp)) && location.state.shiftTemp.id > 0),
      isShiftTemplate: location.state && location.state.shiftTemp && location.state.shiftTemp !== undefined && location.state.shiftTemp.shiftTemplateId > 0,
    };
  }

  componentDidMount() {
    this.getSelectedEmp();
    this.getSelectedMang();
    this.getColours();
  }

  getSelectedEmp() {
    const { location } = this.props;
    if ((location.state && location.state.shiftTemp) && location.state.createPage && location.state.createPage.selectedUsers) {
      this.setState({ userIds: location.state.createPage.selectedUsers });
    }
  }

  getSelectedMang() {
    const { location } = this.props;
    if ((location.state && location.state.shiftTemp) && location.state.managerPage && location.state.managerPage.selectedManager) {
      const manager = location.state.managerPage.selectedManager;
      if (manager.id > 0) {
        const userIdObj = { managerName: manager.fullName, managerId: manager.id };
        this.setState({ onBehalfOfManagerId: userIdObj });
      }
    }
  }

  getColours() {
    const { token, colourId } = this.state;
    // eslint-disable-next-line react/no-unused-state
    this.setState({ loading: true });
    fetch(`${Api.getAllColours}`, {
      method: 'POST',
      headers: new Headers({
        Token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: 0, languageId: 1, isActive: true }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ colours: response.data });
          if (colourId === 0) {
            this.setState({ colourId: response.data[0].id });
          }
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getColours());
          });
        } else {
          this.setState({ colours: [{ id: '0', name: 'Choose Color' }] });
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        // eslint-disable-next-line react/no-unused-state
        this.setState({ loading: false });
        // eslint-disable-next-line no-alert
        alert(`Error fetching Colours ${err}`);
      });
  }

  setMonthDates() {
    const { location } = this.props;
    if ((location.state && location.state.shiftTemp)
      && typeof location.state.shiftTemp.monthDates === 'string') {
      const getMonthDates = location.state.shiftTemp.monthDates.split(',').map(Number);
      return getMonthDates;
    } if ((location.state && location.state.shiftTemp)
      && Array.isArray(location.state.shiftTemp.monthDates)) {
      return location.state.shiftTemp.monthDates;
    }
    return undefined;
  }

  getScheduleId = () => {
    const { location } = this.props;
    if ((location.state && location.state.scheduleId)) {
      return location.state.scheduleId;
    }
    if (location.state && location.state.shiftTemp) {
      return location.state.shiftTemp.scheduleId;
    }
    return undefined;
  }

  setWeekdays() {
    const { location } = this.props;
    if ((location.state && location.state.shiftTemp) && typeof location.state.shiftTemp.weekDays === 'string') {
      const getWeekDaysArr = location.state.shiftTemp.weekDays.split(',').map(Number);
      return getWeekDaysArr;
      // eslint-disable-next-line max-len
    } if ((location.state && location.state.shiftTemp) && Array.isArray(location.state.shiftTemp.weekDays)) {
      return location.state.shiftTemp.weekDays;
    }
    return undefined;
  }

  handleClose = () => {
    const { responseStatus, isShiftTemplate } = this.state;
    this.setState({
      ModelUpdate: false,
    });

    if (responseStatus === 200) {
      const {
        history,
      } = this.props;
      if (isShiftTemplate) {
        history.push('/shift/shift-template');
      } else {
        history.push('/schedule/view-schedule');
      }
    }
    // resolve(response);
  };

  handleSaveClose = () => {
    this.setState({
      SaveUpdate: false,
    });

    const { history } = this.props;
    history.push('/shift/shift-template');
  };

  mapToggleBtnData = (value, event) => {
    const { target } = event;
    const { name } = target;
    this.setState({ [name]: value.join(',') });
  }

  createShift = () => new Promise((resolve, reject) => {
    this.setState({ submitted: true });
    const errors = [];
    const {
      token, scheduleId, title, isOpenShift,
      allowedPaidBreakTime, userIds, shiftType, notes,
      startDate, endDate, endTime, startTime, isRecurring,
      monthDates, workingDays, nonWorkingDays, createdByUserId,
      weekDays, colourId, shiftId, isEdit, frequencyId, isSaveAsShiftTemplate, ModelUpdate, SaveUpdate, errorMessage,
      onBehalfOfManagerId,
    } = this.state;
    if (title === '') {
      errors.push('title');
    }
    if (!isOpenShift && userIds.length === 0) {
      errors.push('userIds');
    }
    if (startDate === '') {
      errors.push('startDate');
    }
    if (endDate === '') {
      errors.push('endDate');
    }
    if (startTime === '') {
      errors.push('startTime');
    }
    if (endTime === '') {
      errors.push('endTime');
    }
    
    if (startTime !== '' && endDate !== '') {
      const datePartStartDate = startDate.setHours(0, 0, 0, 0);
      const datePartEndDate = endDate.setHours(0, 0, 0, 0);
     
      if ((datePartStartDate === datePartEndDate) && (Date.parse(startTime) === Date.parse(endTime))) {
        this.setState({ timeAreEquals: true });
        errors.push('startDateError');
      } else {
        this.setState({ timeAreEquals: false });
      }
    }
    this.setState({
      errors,
    });

    if (errors.length > 0) {
      return false;
    }
    let api = Api.shift.shiftInsert;
    if (shiftId > 0) {
      api = Api.shift.shiftUpdate;
    }

    const usrIdsLst = userIds.map(user => user.id);
    const usrIds = usrIdsLst.join(',');

    const data = {
      languageId: 1,
      isActive: true,
      scheduleId,
      title,
      isOpenShift,
      isOnCallShift: shiftType === '1',
      isOverTimeShift: shiftType === '-1',
      userIds: userIds.length > 0 ? usrIds : '',
      onBehalfOfManagerId: onBehalfOfManagerId ? parseInt(onBehalfOfManagerId.managerId, 10) : 0,
      colourId: Number(colourId),
      totalHours: 10,
      allowedPaidBreakTime: allowedPaidBreakTime ? Number(allowedPaidBreakTime) : 0,
      shiftTypeId: 0,
      statusId: 0,
      notes,
      startDate: setRealDate(startDate),
      endDate: setRealDate(endDate),
      startTime,
      endTime,
      isRecurring,
      frequencyId,
      weekDays: Array.isArray(weekDays) ? weekDays.join(',') : weekDays,
      monthDates: Array.isArray(monthDates) ? monthDates.join(',') : monthDates,
      workingDays: parseInt(workingDays),
      nonWorkingDays: parseInt(nonWorkingDays),
      createdByUserId,
      updatedByUserId: createdByUserId,
      isSaveAsShiftTemplate,
      id: shiftId,
    };

    this.setState({ loading: true });
    fetch(`${api}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: `${token}`,
      }),
      body: JSON.stringify({ ...data }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          // eslint-disable-next-line no-alert
          this.setState({
            responseStatus: response.statusCode,
            ModelUpdate: !ModelUpdate,
            errorMessage: response.message,
          });
          // alert('Shift has been created successfully');
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.createShift());
          });
        } else {
          // eslint-disable-next-line no-alert
          // alert(`Failed to create shift, ${response.message}`);
          reject(response);
          // this.handleClose();
          this.setState({
            ModelUpdate: !ModelUpdate,
            errorMessage: response.errors,
          });
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(`Failed to create shift, ${err}`);
        this.setState({ loading: false });
        reject(err);
      });
  });

  blockInvalidChar = (e) => {
    const blockChar = ['e', 'E', '+', '-', '.'];
    if (blockChar.includes(e.key) || (e.which === 38 || e.which === 40)) {
      e.preventDefault();
    }
  };


  removeUser = (userId, lst) => {
    const { location } = this.props;
   
    const filterData = lst.filter(user => user.id !== userId);
    this.setState({
      userIds: filterData,
    });
    if (location.state && location.state.createPage) {
      if (filterData.length === 0) {
        location.state.createPage = undefined;
      } else {
        location.state.createPage.selectedUsers = filterData;
      }
    }
  };

  removeManager =() => {
    const { location } = this.props;
    this.setState({
      onBehalfOfManagerId: undefined,
    });
    if (location.state && location.state.managerPage) {
      location.state.managerPage = undefined;
    }
  };

  handleFocus = (isManagerSelection) => {
    const { history, location } = this.props;
    history.push({
      pathname: 'create-shift',
      state: {
        createPage: (location.state && location.state.createPage)
          ? { ...location.state.createPage } : undefined,
        shiftTemp: this.state,
        shift: location.state.shift,
        managerSelection: isManagerSelection,
        shiftTemplate: location.state.shiftTemplate,
        managerPage: (location.state && location.state.managerPage)
          ? { ...location.state.managerPage } : undefined,
      },
    });
  }

  showDaily = () => {
    const { startDate, endDate } = this.state;
    const lastDate = new Date(endDate);
    const getlstDate = `${lastDate.getFullYear()}-${(lastDate.getMonth() + 1) >= 10 ? (lastDate.getMonth() + 1) : `0${lastDate.getMonth() + 1}`}-${(lastDate.getDate()) >= 10 ? (lastDate.getDate()) : `0${lastDate.getDate()}`}`;
    const getlstTimeStamp = new Date(getlstDate);
    const today = new Date(startDate);
    const todayDate = `${today.getFullYear()}-${(today.getMonth() + 1) >= 10 ? (today.getMonth() + 1) : `0${today.getMonth() + 1}`}-${(today.getDate()) >= 10 ? (today.getDate()) : `0${today.getDate()}`}`;
    let getSelTime; let getlstTime;
    const DateArray = [{ date: todayDate, day: today.getDay(), dayDate: today.getDate() }];
    if (startDate.getTime() !== endDate.getTime()) {
      do {
        today.setDate(today.getDate() + 1);
        let getselDate = today;
        getselDate = `${today.getFullYear()}-${(today.getMonth() + 1) >= 10 ? (today.getMonth() + 1) : `0${today.getMonth() + 1}`}-${(today.getDate()) >= 10 ? (today.getDate()) : `0${today.getDate()}`}`;
        const getselTimeStamp = new Date(getselDate);
        getSelTime = getselTimeStamp.getTime();
        getlstTime = getlstTimeStamp.getTime();
        DateArray.push({ date: getselDate, day: today.getDay(), dayDate: today.getDate() });
      }
      while (getSelTime < getlstTime);
    }
    return DateArray;
  }

  showWeekly = () => {
    const { weekDays } = this.state;
    const getCorrectDays = this.showDaily().map((dateItem) => {
      if (dateItem.day === 0) {
        const chngSundayVal = { ...dateItem, day: dateItem.day + 7 };
        return chngSundayVal;
      }
      return dateItem;
    });
    if (weekDays) {
      const getSelectedDays = getCorrectDays.filter((day) => {
        const getWeekdaysArr = weekDays.split(',');
        if (getWeekdaysArr.indexOf(day.day.toString()) !== -1) {
          return day;
        }
        return undefined;
      });
      return getSelectedDays;
    }
    return [];
  }

  showMonthly = () => {
    const { monthDates } = this.state;

    if (monthDates) {
      const getSelectedDates = this.showDaily().filter((day) => {
        const getMonthlysArr = monthDates.split(',');
        if (getMonthlysArr.indexOf(day.dayDate.toString()) !== -1) {
          return day;
        }
        return undefined;
      });
      return getSelectedDates;
    }
    return [];
  }

  moveToScheduler = async () => {
    await this.createShift();
    const { history } = this.props;
    const {
      createdByUserId,
      userIds,
      token,
    } = this.state;

    let usrIds = '';
    if (userIds.length > 0) {
      const usrIdsLst = userIds.map(user => user.id);
      usrIds = usrIdsLst.join(',');
    }

    const reqBody = {
      languageId: 1,
      startDateTime: new Date(),
      endDateTime: getEndDate.datePlusSeven(),
      requestByUserId: createdByUserId,
      userIds: usrIds,
      isActiveOnly: true,
    };
    this.setState({ loading: true });
    try {
      const getShiftData = await callShiftData(token, reqBody);
      this.setState({ loading: false });
      history.push('scheduler', { getShiftData, scheduleId: this.getScheduleId() });
    } catch (err) {
      this.setState({ loading: false });
      // eslint-disable-next-line no-alert
      alert(err);
    }
  }

  handle3WaySwitch(event) {
    const { target } = event;
    const { name, value } = target;
    this.setState({
      [name]: value,
      isOpenShift: false,
    }, () => { });
  }

  handleSwitch(event) {
    const { target } = event;
    const { name, checked } = target;
    this.setState({
      [name]: checked,
      shiftType: 0,
    });
  }

  selectRecurring(e) {
    this.setState({ frequencyId: Number(e.target.value) });
    this.setState({
      weekDays: undefined,
      monthDates: undefined,
      workingDays: 0,
      nonWorkingDays: 0,
      active: false,
    });
  }

  handleStartTimeChange(date) {
    const { endTime, startDate, endDate } = this.state;
    if ((Date.parse(endTime) < Date.parse(date)) && (Date.parse(startDate) >= Date.parse(endDate))) {
      // eslint-disable-next-line react/no-unused-state
      this.setState({
        startTimeIsGreater: true, timeAreEquals: false, endTimeIsSmaller: false, invalid: true,
      });
    } else {
      // eslint-disable-next-line react/no-unused-state
      this.setState({
        startTimeIsGreater: false, timeAreEquals: false, endTimeIsSmaller: false, invalid: false,
      });
    }
    this.setState({
      startTime: date,
    });
  }

  handleEndTimeChange(date) {
    const { startTime, startDate, endDate } = this.state;
    if ((Date.parse(date) < Date.parse(startTime)) && (Date.parse(startDate) >= Date.parse(endDate))) {
      // eslint-disable-next-line react/no-unused-state
      this.setState({
        endTimeIsSmaller: true, timeAreEquals: false, startTimeIsGreater: false, invalid: true,
      });
    } else {
      // eslint-disable-next-line react/no-unused-state
      this.setState({
        endTimeIsSmaller: false, timeAreEquals: false, startTimeIsGreater: false, invalid: false,
      });
    }
    this.setState({
      endTime: date,
    });
  }

  handleStartDateChange(date) {
    const { endDate } = this.state;
    if ((Date.parse(endDate) < Date.parse(date))) {
      // eslint-disable-next-line react/no-unused-state
      this.setState({
        fromDateIsGreater: true, timeAreEquals: false, toDateIsSmaller: false, invalid: true,
      });
    } else {
      // eslint-disable-next-line react/no-unused-state
      this.setState({
        fromDateIsGreater: false, timeAreEquals: false, toDateIsSmaller: false, invalid: false,
      });
    }
    this.setState({
      startDate: date,
    });
  }

  handleEndDateChange(date) {
    const { startDate } = this.state;
    if ((Date.parse(date) < Date.parse(startDate))) {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ toDateIsSmaller: true, fromDateIsGreater: false, invalid: true });
    } else {
      // eslint-disable-next-line react/no-unused-state
      this.setState({ toDateIsSmaller: false, fromDateIsGreater: false, invalid: false });
    }
    this.setState({
      endDate: date,
    });
  }

  handleChange(event) {
    const { target } = event;
    let {
      name, value, checked, type,
    } = target;
    if (type === 'checkbox') {
      this.setState({
        [name]: checked,
      });
    } else {
      if (name === 'nonWorkingDays'
        || name === 'workingDays') {
        value = value === '' ? 0 : value.replace(/^0+/, '');
      }
      this.setState({
        [name]: value,
      });
    }
  }

  isRecurring(event) {
    const { target } = event;
    const { name, checked } = target;
    if (checked) {
      this.setState({ frequencyId: 1 });
    } else {
      this.setState({ frequencyId: undefined });
    }
    this.setState({ [name]: checked });
  }

  previewPattern() {
    const {
      active,
      frequencyId,
      workingDays,
      nonWorkingDays,
    } = this.state;
    this.setState({ active: !active });
    const getDates = this.showDaily();
    console.log(getDates);
    if (frequencyId === 1) {
      this.setState({ selectedDates: [...getDates] });
    } else if (frequencyId === 2) {
      const getWeeklyDates = this.showWeekly();
      this.setState({ selectedDates: [...getWeeklyDates] });
    } else if (frequencyId === 3) {
      const getMonthlyDates = this.showMonthly();
      this.setState({ selectedDates: [...getMonthlyDates] });
    } else if (frequencyId === 4) {
      const getDateRange = this.showDaily();
      for (let i = 0; i < getDateRange.length; i += 1) {
        if ((Number.isInteger(i / workingDays) && i !== 0)) {
          getDateRange.splice(i, nonWorkingDays);
        }
      }
      this.setState({ selectedDates: [...getDateRange] });
    }
    setTimeout(() => {
      const current = document.getElementsByClassName('fc-daygrid-event-harness');
      for (let i = 0; i < current.length; i += 1) {
        current[i].parentElement.parentElement.classList.add('text-white');
      }
    }, 100);
  }

  async updateShiftTemplate() {
    this.setState({ loading: true, submitted: true });
    const {
      token, scheduleId, title, isOpenShift,
      allowedPaidBreakTime, userIds, shiftType, notes,
      startDate, endDate, endTime, startTime, isRecurring,
      monthDates, workingDays, nonWorkingDays, createdByUserId,
      weekDays, colourId, frequencyId, isSaveAsShiftTemplate,
      shiftTemplateId,
    } = this.state;

    let usrIds = '';
    if (userIds.length > 0) {
      const usrIdsLst = userIds.map(user => user.id);
      usrIds = usrIdsLst.join(',');
    }
    const templateRequest = {
      id: shiftTemplateId,
      languageId: 1,
      isActive: true,
      scheduleId,
      title,
      shiftTemplateTitle: title,
      isOpenShift,
      isOnCallShift: shiftType === '1',
      isOverTimeShift: shiftType === '-1',
      userIds: usrIds,
      colourId: Number(colourId),
      totalHours: 0,
      allowedPaidBreakTime: Number(allowedPaidBreakTime),
      shiftTypeId: 0,
      statusId: 0,
      notes,
      startDate: setRealDate(startDate),
      endDate: setRealDate(endDate),
      startTime,
      endTime,
      isRecurring,
      frequencyId,
      weekDays: Array.isArray(weekDays) ? weekDays.join(',') : weekDays,
      monthDates: Array.isArray(monthDates) ? monthDates.join(',') : monthDates,
      workingDays: parseInt(workingDays),
      nonWorkingDays: parseInt(nonWorkingDays),
      createdByUserId,
      isSaveAsShiftTemplate,
      updatedByUserId: createdByUserId,
    };

    try {
      await PostApiCall(`${Api.shift.updateShiftTemplate}`, templateRequest, token);
      this.setState({
        responseStatus: 200, loading: false, ModelUpdate: true, errorMessage: 'Template has been updated successfully',
      });
    } catch (err) {
      this.setState({ loading: false, ModelUpdate: true, errorMessage: err });
    }
  }

  hasError(key) {
    const { errors } = this.state;
    return errors.indexOf(key) !== -1;
  }

  back() { 
    const { history, location } = this.props;

    if (location.state.createPage === undefined) {
      history.push('/schedule/view-schedule');
    } else {
      history.goBack();
    }
  }

  render() {
    const { active } = this.state;
    const {
      weekDays, submitted, isOpenShift, shiftType, colours, startDate,
      endDate, fromDateIsGreater, toDateIsSmaller, frequencyId,
      startTime, endTime, startTimeIsGreater, endTimeIsSmaller,
      isRecurring, userIds, title, allowedPaidBreakTime, monthDates, isSaveAsShiftTemplate,
      workingDays, nonWorkingDays, notes, selectedDates, colourId, loading,
      isReadOnly, shiftTemplate, shiftId, isEdit, ModelUpdate, SaveUpdate, errorMessage, timeAreEquals,
      onBehalfOfManagerId, isReadOnlyOnBehalf, isShiftTemplate,
    } = this.state;
    const { t } = this.props;
    const displayNone = isOpenShift ? 'd-none' : '';
    const user = userIds;
    const startme = `${moment(startDate).format('DD-MM-YYYY')} ${moment(startTime).format('HH:mm')} `;
    const endme = `${moment(endDate).format('DD-MM-YYYY')} ${moment(endTime).format('HH:mm')} `;
    const startdifftime = moment(startme, 'DD-MM-YYYY HH:mm');
    const enddifftime = moment(endme, 'DD-MM-YYYY HH:mm');
    const diff = enddifftime.diff(startdifftime, 'minutes');
    const numdays = Math.floor(diff / 1440);
    const numhours = Math.floor((diff % 1440) / 60);
    const numminutes = Math.floor((diff % 1440) % 60);
    // eslint-disable-next-line no-nested-ternary
    const totalHours = !(isNaN(numminutes)) ? (numdays ? `${numdays} day(s) ${numhours}h ${numminutes}m` : `${numhours}h ${numminutes}m`) : 0;
    return (
      <>
        <div>
          {loading ? (<LoadingSpinner />) : null}
        </div>
        <div className="container-fluid shift-template">
          <div className="card_layout">
            <Form className="p-lg-5">
              <Form.Row className="ml-4">


                <Form.Group className="mt-5 mt-lg-0 mt-xl-0">
                  <Form.Control
                    className="custom-checkbox custom-checkbox-switch"
                    onChange={event => this.handle3WaySwitch(event)}
                    type="radio"
                    name="shiftType"
                    id="none"
                    value="0"
                    checked={(!isOpenShift && shiftType === '0')}
                    disabled={isReadOnly}
                  />
                  <span className="slider round" />
                  <Form.Label className="switch form-label-custom mt-0 ml-6">Normal Shift</Form.Label>
                </Form.Group>
                <Form.Group className="mt-5 mt-lg-0 mt-xl-0">
                  <Form.Control
                    className="custom-checkbox custom-checkbox-switch"
                    type="radio"
                    onChange={event => this.handle3WaySwitch(event)}
                    name="shiftType"
                    id="isOverTimeShift"
                    value="-1"
                    checked={(!isOpenShift && shiftType === '-1')}
                    disabled={isReadOnly}
                  />
                  <span className="slider round" />
                  <Form.Label className="switch form-label-custom mt-0 ml-6">{t('ShiftTemplatePage.OverTime')}</Form.Label>
                </Form.Group>
                <Form.Group className="mt-5 mt-lg-0 mt-xl-0">
                  <Form.Control
                    className="custom-checkbox custom-checkbox-switch"
                    onChange={event => this.handle3WaySwitch(event)}
                    type="radio"
                    name="shiftType"
                    id="isOnCallShift"
                    value="1"
                    checked={(!isOpenShift && shiftType === '1')}
                    disabled={isReadOnly}
                  />
                  <span className="slider round" />
                  <Form.Label className="switch form-label-custom mt-0 ml-6">{t('ShiftTemplatePage.OnCall')}</Form.Label>
                </Form.Group>
                <Form.Group className="mt-5 mt-lg-0 mt-xl-0">
                  <Form.Control
                    className="custom-checkbox custom-checkbox-switch"
                    defaultChecked={isOpenShift}
                    checked={isOpenShift}
                    onChange={event => this.handleSwitch(event)}
                    name="isOpenShift"
                    type="radio"
                    disabled={isReadOnly}
                  />
                  <span className="slider round" />
                  <Form.Label className="switch form-label-custom mt-0 ml-6">{t('ShiftTemplatePage.OpenShift')}</Form.Label>
                </Form.Group>

              </Form.Row>
              <Form.Row className="mt-3">
                <div className="action">
                  <span className="action-icon view danger-bg">
                    <img
                      src={addTitleIcon}
                      alt="Add Title Icon"
                    />
                  </span>
                </div>
                <Form.Group className="col col-lg-11 col-md-11" controlId="title">
                  <Form.Control disabled={isReadOnly} autoComplete="off" placeholder={t('ShiftTemplatePage.addTitle')} defaultValue={title} type="text" name="title" onChange={event => this.handleChange(event)} />
                  {this.hasError('title')
                    && <div className="text-danger">{t('ShiftTemplatePage.Title_reqText')}</div>
                  }
                </Form.Group>

              </Form.Row>

              <Form.Row className={['mt-3', displayNone].join(' ')}>
                <div className="action">
                  <span className="action-icon view danger-bg">
                    <img
                      src={groupIcon}
                      alt="View Icon"
                    />
                  </span>
                </div>
                <Form.Group className="col col-lg-11 col-md-11" controlId="selectedUer">
                  {
                   userIds.length === 0
                     ? (
                       <Form.Control
                         disabled
                         type="text"
                         name="userIds"
                         placeholder={t('ShiftTemplatePage.AddRequired')}
                       />
                     )
                     : userIds.map(user => (
                       <span className="userAdded">
                         {user.fullName}
                         <img
                           src={cancelIcon}
                           alt={user.fullName}
                           onClick={() => this.removeUser(user.id, userIds)}
                         />
                       </span>
                     ))
                 }
                  {this.hasError('userIds')
                      && <div className="text-danger">{t('ShiftTemplatePage.User_reqText')}</div>
                }
                 
                </Form.Group>
                <button type="button" className="noClass d-flex" onClick={() => this.handleFocus(false)}>
                  <span className="addUser">
                    <img
                      src={plusIcon}
                      alt="View Icon"
                      Title={t('ShiftTemplatePage.AddRequired')}
                      className="addUserIcon"
                    />
                  </span>
                </button>
              </Form.Row>
              {!isShiftTemplate && (
              <Form.Row className="mt-3">
                <div className="action">
                  <span className="action-icon view danger-bg">
                    <img
                      src={groupIcon}
                      alt="View Icon"
                    />
                  </span>
                </div>
                <Form.Group className="col col-lg-11 col-md-11" controlId="selectedManager">
                  {
                   onBehalfOfManagerId
                     ? (
                       <span className="userAdded">
                         {onBehalfOfManagerId.managerName }
                         {!isReadOnlyOnBehalf && (
                           <button type="button" className="noClass" onClick={() => this.removeManager()}>
                             <img
                               src={cancelIcon}
                               alt={user.fullName}
                               disabled={isReadOnlyOnBehalf}
                             />
                           </button>
                         )}
                       </span>
                     ) : (
                       <Form.Control
                         type="text"
                         disabled
                         name="onbehalfUserId"
                         placeholder={t('ShiftTemplatePage.AddManager')}
                       />
                     )}
                  
                </Form.Group>
                {!isReadOnlyOnBehalf && (
                <button type="button" className="noClass" onClick={() => this.handleFocus(true)}>
                  <img
                    src={plusIcon}
                    disabled={isReadOnlyOnBehalf}
                    alt="View Icon"
                    Title={t('ShiftTemplatePage.AddManager')}
                    className="addUserIcon"
                  />
                </button>
                )}
              </Form.Row>
              )}
              <Form.Row className="mt-3">
                <div className="action">
                  <span className="action-icon view danger-bg">
                    <img
                      src={clockIcon}
                      alt="clock Icon"
                    />
                  </span>
                </div>
                <Form.Group className="col col-lg-11 col-md-11">
                  <Row>
                    <Col xl={2}>
                      <Form.Group className=" custom-with-datepicker " controlId="ScheduleName">
                        <DatePicker
                          autoComplete="off"
                          minDate={getMinDate.startDateTom()}
                          name="startDate"
                          selected={startDate}
                          onChange={this.handleStartDateChange}
                          placeholderText={commonService.localizedDateFormat()}
                          dateFormat={commonService.localizedDateFormatForPicker()}
                          className="form-control cal_icon"
                          pattern="\d{2}\/\d{2}/\d{4}"
                          required
                          disabled={isReadOnly}
                        />

                        {this.hasError('startDate')
                          && <div className="text-danger">{t('ShiftTemplatePage.StartDate_reqText')}</div>
                        }
                        {fromDateIsGreater
                          && <div className="text-danger">{t('ShiftTemplatePage.StartDate_errorText')}</div>
                        }
                      </Form.Group>
                    </Col>
                    <Col xl={2}>
                      <Form.Group className="" controlId="startTime">
                        <DatePicker
                          name="startTime"
                          autoComplete="off"
                          className="startTime form-control"
                          selected={startTime}
                          onChange={this.handleStartTimeChange}
                          placeholderText="HH:MM"
                          showTimeSelect
                          showTimeSelectOnly
                          dateFormat="hh:mm aa"
                          timeCaption="time"
                          timeIntervals={30}
                          disabled={isReadOnly}
                        />
                        {this.hasError('startTime')
                          && <div className="text-danger">{t('ShiftTemplatePage.StartTime_reqText')}</div>
                        }
                        {startTimeIsGreater
                          && <div className="text-danger">{t('ShiftTemplatePage.StartTime_errorText')}</div>
                        }
                        {timeAreEquals
                          && <div className="text-danger">{t('ShiftTemplatePage.TimeEqual_errorText')}</div>
                        }
                      </Form.Group>
                    </Col>
                    <Col xl={1} className="p-0">
                      <Form.Group className="mt-2 justify-content-center">
                        <div className="action px-3 text-center">
                          <span className="action-icon view danger-bg ">
                            <img
                              src={RightArrowIcon}
                              alt="Arrow Icon"
                            />
                          </span>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col xl={2}>
                      <Form.Group className="custom-with-datepickermt-2" controlId="endDate">
                        <DatePicker
                          name="endDate"
                          autoComplete="off"
                          id="endDate"
                          minDate={startDate}
                          selected={endDate}
                          onChange={this.handleEndDateChange}
                          placeholderText={commonService.localizedDateFormat()}
                          dateFormat={commonService.localizedDateFormatForPicker()}
                          className="form-control"
                          pattern="\d{2}\/\d{2}/\d{4}"
                          required
                          disabled={isReadOnly}
                        />
                        {toDateIsSmaller
                          && <div className="text-danger">{t('ShiftTemplatePage.EndDate_errorText')}</div>
                        }
                        {this.hasError('endDate')
                          && <div className="text-danger">{t('ShiftTemplatePage.EndDate_reqText')}</div>
                        }
                      </Form.Group>
                    </Col>
                    <Col xl={2}>
                      <Form.Group className="" controlId="endTime">
                        <DatePicker
                          className="startTime cal_icon form-control"
                          name="endTime"
                          autoComplete="off"
                          selected={endTime}
                          onChange={this.handleEndTimeChange}
                          placeholderText="HH:MM"
                          showTimeSelect
                          showTimeSelectOnly
                          dateFormat="hh:mm aa"
                          timeCaption="time"
                          timeIntervals={30}
                          disabled={isReadOnly}
                        />
                        {endTimeIsSmaller
                          && <div className="text-danger">{t('ShiftTemplatePage.EndTime_errorText')}</div>
                        }
                        {this.hasError('endTime')
                          && <div className="text-danger">{t('ShiftTemplatePage.EndTime_reqText')}</div>
                        }
                      </Form.Group>
                    </Col>
                    <Col>
                      <Row>
                        <Col sm={12}>
                          <label className="m-0 d-block" htmlFor="Total hr">Total</label>
                          {totalHours}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form.Group>
              </Form.Row>

              <Form.Row className="mt-3">
                <Form.Group className="col col-lg-12">
                  <Row>
                    <Col sm={3}>
                      <Form.Row>
                        <div className="action iconImage">
                          <span className="action-icon view danger-bg">
                            <img
                              src={hoTCoffeeIcon}
                              alt="Coffee cup Icon"
                            />
                          </span>
                        </div>
                        <Form.Group className="col mr-0 mr-lg-4" controlId="unpaidBreak">
                          <Form.Control disabled={isReadOnly} autoComplete="off" placeholder={t('ShiftTemplatePage.UnpaidBreak')} onKeyDown={event => this.blockInvalidChar(event)} className="clock" type="text" value={allowedPaidBreakTime} name="allowedPaidBreakTime" onChange={event => this.handleChange(event)} />
                        </Form.Group>

                      </Form.Row>
                    </Col>
                    <Col sm={6}>
                      <Form.Row className="mx-0">
                        <div className="action iconImage">
                          <span className="action-icon view danger-bg">
                            <img
                              src={paintBoardIcon}
                              alt="Coffee cup Icon"
                            />
                          </span>
                        </div>
                        <Form.Group className="col mr-lg-4" controlId="selectColor">
                          <Form.Control disabled={isReadOnly} as="select" placeholder={t('ShiftTemplatePage.ChooseColor')} name="colourId" onChange={event => this.handleChange(event)} value={colourId}>
                            {(colours.length > 0)
                              // eslint-disable-next-line max-len
                              ? (colours.map(colour => <option key={colour.id} value={colour.id}>{colour.name}</option>))
                              : null}
                          </Form.Control>
                        </Form.Group>
                        {colours.map(colour => parseInt(colour.id, 10) === parseInt(colourId, 10) && <Form.Group className="col mr-lg-5" controlId="selectColor" style={{ backgroundColor: colour.colourCode }} />)}

                      </Form.Row>
                    </Col>
                  </Row>
                </Form.Group>
              </Form.Row>


              <Form.Row className="mt-3">
                <div className="action iconImage ">
                  <span className="action-icon view danger-bg">
                    <img
                      src={NoteIcon}
                      alt="Note Icon"
                    />
                  </span>
                </div>
                <Form.Group className="col col-lg-8 " controlId="notes">
                  <Form.Control disabled={isReadOnly} defaultValue={notes} placeholder={t('ShiftTemplatePage.Notes')} as="textarea" rows={5} name="notes" style={{ height: 'auto' }} onChange={event => this.handleChange(event)} />
                </Form.Group>
              </Form.Row>
              {shiftId > 0 ? null
                : (
                  <Form.Row className="mt-3 pl-1 ml-lg-4 ml-0">
                    <Col xs={12} sm={6} className="mb-2">
                      <div className="custom-control is-recurring">
                        <input disabled={isReadOnly} type="checkbox" checked={isRecurring} className="custom-control-input" name="isRecurring" id="is-recurring" onChange={this.isRecurring} />
                        <label className="custom-control-label" htmlFor="is-recurring">{t('ShiftTemplatePage.IsRecurring')}</label>
                      </div>
                    </Col>
                    {!isShiftTemplate && (
                    <Col xs={12} sm={6}>
                      <div className="custom-control save-as">
                        <input disabled={isReadOnly} type="checkbox" checked={isSaveAsShiftTemplate} name="isSaveAsShiftTemplate" className="custom-control-input" id="save-as" onChange={event => this.handleChange(event)} />
                        <label className="custom-control-label" htmlFor="save-as">{t('ShiftTemplatePage.SaveAs')}</label>
                      </div>
                    </Col>
                    )}
                  </Form.Row>
                )
              }
              {
                isRecurring
                  ? (

                    <Row className="mt-3 ml-3">
                      <Col xxl={11} md={12}>
                        <Card className="cardShift">
                          <Row>
                            <div className="col-xl-7">
                              <Form.Row>
                                <Form.Group as={Col} lg={12} controlId="createPattern">
                                  <p className="mb-0">{t('ShiftTemplatePage.Rec_Text')}</p>
                                  <p className="small text-muted mb-0">
                                    {' '}
                                    {t('ShiftTemplatePage.Rec_PGText')}
                                  </p>
                                </Form.Group>
                              </Form.Row>
                              <Form.Row className="align-items-start">
                                <Form.Group className="" as={Col} lg={4} controlId="selectFrequency">
                                  <Form.Control as="select" disabled={isReadOnly} defaultValue={frequencyId} name="frequencyId" onChange={this.selectRecurring}>
                                    <option value={1}>Daily</option>
                                    <option value={2}>Weekly</option>
                                    <option value={3}>Monthly</option>
                                    <option value={4}>Customized</option>
                                  </Form.Control>

                                </Form.Group>
                                <Col lg={4} className=" btn-adjust mt-3 mt-lg-0">
                                  <ToggleButtonGroup type="checkbox">
                                    <ToggleButton disabled={isReadOnly} variant="dark" onChange={this.previewPattern} value={1}>{t('ShiftTemplatePage.Preview')}</ToggleButton>
                                  </ToggleButtonGroup>
                                </Col>
                              </Form.Row>
                              {
                                (frequencyId === 2)
                                && (
                                  <Form.Row className="weekly mx-0">
                                    <ToggleButtonGroup type="checkbox" defaultValue={weekDays} name="weekDays" onChange={(val, event) => this.mapToggleBtnData(val, event)} className="mb-2 weeklyCard">
                                      <ToggleButton disabled={isReadOnly} className="ml-lg-0 mb-1" variant="outline-secondary" value={1}>Mon</ToggleButton>
                                      <ToggleButton disabled={isReadOnly} className="ml-lg-0 mb-1" variant="outline-secondary" value={2}>Tue</ToggleButton>
                                      <ToggleButton disabled={isReadOnly} className="ml-lg-0 mb-1" variant="outline-secondary" value={3}>Wed</ToggleButton>
                                      <ToggleButton disabled={isReadOnly} className="ml-lg-0 mb-1" variant="outline-secondary" value={4}>Thu</ToggleButton>
                                      <ToggleButton disabled={isReadOnly} className="ml-lg-0 mb-1" variant="outline-secondary" value={5}>Fri</ToggleButton>
                                      <ToggleButton disabled={isReadOnly} className="ml-lg-0 mb-1" variant="outline-secondary" value={6}>Sat</ToggleButton>
                                      <ToggleButton disabled={isReadOnly} className="ml-lg-0 mb-1" variant="outline-secondary" value={7}>Sun</ToggleButton>
                                    </ToggleButtonGroup>
                                  </Form.Row>
                                )

                              }
                              {
                                (frequencyId === 3)
                                  ? (
                                    <Form.Row className="monthly mx-0">
                                      <ToggleButtonGroup type="checkbox" defaultValue={monthDates} name="monthDates" onChange={(val, event) => this.mapToggleBtnData(val, event)} className="mb-2">
                                        {monthlyDays.map(data => (
                                          <ToggleButton disabled={isReadOnly} key={data.day} variant="outline-secondary" value={Number(data.day)}>{data.day}</ToggleButton>
                                        ))}
                                      </ToggleButtonGroup>
                                    </Form.Row>
                                  )
                                  : null
                              }
                              {
                                (frequencyId === 4)
                                  ? (
                                    <Form.Row className="customized align-items-center mx-0">
                                      <Form.Group className="pl-0" as={Col} lg={3} controlId="workingDays">
                                        <Form.Label>Working Days</Form.Label>
                                        <Form.Control
                                          onKeyDown={event => this.blockInvalidChar(event)}
                                          type="number"
                                          value={workingDays}
                                          name="workingDays"
                                          onChange={this.handleChange}
                                          disabled={isReadOnly}
                                        />
                                      </Form.Group>
                                      <div className="px-2 mt-4">-</div>
                                      <Form.Group className="pl-0 pl-lg-1" as={Col} lg={3} controlId="nonWorkingDays">
                                        <Form.Label>Non-Working Days</Form.Label>
                                        <Form.Control
                                          onKeyDown={event => this.blockInvalidChar(event)}
                                          type="number"
                                          value={nonWorkingDays}
                                          name="nonWorkingDays"
                                          onChange={this.handleChange}
                                          disabled={isReadOnly}
                                        />
                                      </Form.Group>
                                    </Form.Row>
                                  )
                                  : null
                              }
                              {startTimeIsGreater
                                && <div className="text-danger">{t('ShiftTemplatePage.StartTime_errorText')}</div>
                              }
                            </div>
                            {
                              active
                                ? (
                                  <div className="col-xl-5">
                                    <div className="preview-calendar mt-2 mb-2 ml-1">
                                      <FullCalendar
                                        id="calendar"
                                        events={selectedDates}
                                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                                        selectable
                                        aspectRatio="2"
                                        expandRows="true"
                                        initialView="dayGridMonth"
                                      />
                                    </div>
                                  </div>
                                )
                                : null
                            }

                          </Row>
                        </Card>
                      </Col>
                    </Row>

                  )
                  : null
              }


              <Form.Row className="justify-content-center mt-4">
                <div className={`col-md-6 col-lg-3 d-flex justify-content-center flex-column ${isShiftTemplate ? 'hidden' : ''}`}>
                  <Button type="button" onClick={this.createShift}>
                    {' '}
                    {t('ShiftTemplatePage.Save_publish')}
                    {' '}
                  </Button>
                </div>
                <div className={`col-md-6 col-lg-3 d-flex justify-content-center flex-column ${(isShiftTemplate && !isReadOnly) ? '' : 'hidden'}`}>
                  <Button type="button" onClick={this.updateShiftTemplate}>
                    {t('ShiftTemplatePage.inserUpdate')}
                  </Button>
                </div>
                <div className={`col-md-6 col-lg-3 d-flex justify-content-center flex-column ${(isShiftTemplate && isReadOnly) ? '' : 'hidden'}`}>
                  <Button type="button" onClick={this.back}>
                    {' '}
                    {t('ScheduleCreatePage.CancelBtn')}
                    {' '}
                  </Button>
                </div>
              </Form.Row>
            </Form>

            {ModelUpdate && (
              <Modal
                show={ModelUpdate}
                onHide={this.handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    <p>
                      {errorMessage}
                    </p>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <Button variant="primary" onClick={this.handleClose}>
                    Ok
                  </Button>
                </Modal.Footer>
              </Modal>
            )}

            {SaveUpdate && (
              <Modal
                show={SaveUpdate}
                onHide={this.handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>
                    <p>
                      {errorMessage}
                    </p>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <Button variant="primary" onClick={this.handleSaveClose}>
                    Ok
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(ShiftTemplate);
