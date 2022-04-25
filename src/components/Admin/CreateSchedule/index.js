/* eslint-disable react/no-unused-state */
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Form, Button, Col,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import './style.scss';
import { userService } from '../../../services';
import Api from '../../common/Api';
import getMinDate, { setRealDate } from '../../common/app.constant';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { commonService } from '../../../services/common.service';

/**
 * Import declaration ends
 */
class CreateSchedule extends React.Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.handleChange = this.handleChange.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    
    this.state = {
      token: `Bearer ${token}`,
      title: location.state ? location.state.data.title : '',
      description: location.state ? location.state.data.description : '',
      endOnUtc: location.state ? new Date(location.state.data.endOnUtc) : '',
      startOnUtc: location.state ? new Date(location.state.data.startOnUtc) : '',
      numberOfPeopleInSchedule: location.state
        ? location.state.data.numberOfPeopleInSchedule : undefined,
      daysToBeCovered: location.state ? location.state.data.daysToBeCovered : undefined,
      hoursToBeCovered: location.state ? location.state.data.hoursToBeCovered : undefined,
      typeOfShiftIncluded: undefined,
      numberOfShiftType: location.state ? location.state.data.numberOfShiftType : undefined,
      clientId: 0,
      createdByUserId: '',
      isPublished: location.state ? location.state.data.isPublished : true,
      isActive: false,
      languageId: 1,
      allShiftType: [],
      clients: [],
      fromDateIsGreater: false,
      toDateIsSmaller: false,
      contractId: location.state ? location.state.data.clientId.toString() : 0,
      userId,
      isOpenShiftRequestAllowed: location.state
        ? location.state.data.isOpenShiftRequestAllowed : false,
      errors: [],
      readOnly: location.state ? location.state.isViewOnly : false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getAllShiftType();
    this.getAllContract();
  }


  getAllShiftType = () => {
    const { token } = this.state;
    fetch(`${Api.shift.getAllShiftType}`, {
      method: 'POST',
      headers: new Headers({
        Token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({}),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            allShiftType: response,
          });
          this.getDefaultShiftType(response);
          this.setState({ loading: false });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAllShiftType());
          });
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(`Failed to fetch get all shift types service. Please try again after sometime. ${err}`);
        this.setState({ loading: false });
      });
  }

  // Handler for Shift type


  getAllContract = () => {
    const { token } = this.state;
    this.setState({ loading: true });
    fetch(`${Api.getAllClients}`, {
      method: 'POST',
      headers: new Headers({
        Token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        languageId: 1,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            clients: response,
          });
          this.getDdDefaultVal(response);
          this.setState({ loading: false });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAllContract());
          });
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(`Failed to fetch get all contract service. Please try again after sometime.${err}`);
        this.setState({ loading: false });
      });
  }

  // eslint-disable-next-line react/sort-comp
  createScheduleFn(e, redirectTo) {
    const errors = [];
    const { location } = this.props;
    let updateOrCreateApi = '';
    const {
      token, userId, title, description, startOnUtc, endOnUtc,
      numberOfPeopleInSchedule, daysToBeCovered, hoursToBeCovered,
      numberOfShiftType,
      isPublished, languageId, contractId, isOpenShiftRequestAllowed, typeOfShiftIncluded,
    } = this.state;
    let data = {
      title,
      description,
      startOnUtc: setRealDate(startOnUtc),
      endOnUtc: setRealDate(endOnUtc),
      numberOfPeopleInSchedule,
      daysToBeCovered,
      hoursToBeCovered,
      numberOfShiftType,
      clientId: Number(contractId),
      createdByUserId: userId,
      isPublished,
      isActive: true,
      languageId,
      isOpenShiftRequestAllowed,
      typeOfShiftIncluded,
    };
    if (location.state && !location.state.isViewOnly) {
      updateOrCreateApi = `${Api.schedule.scheduleUpdate}`;
      data = { ...data, id: location.state.scheduleId, updatedByUserId: userId };
    } else {
      updateOrCreateApi = `${Api.schedule.scheduleInsert}`;
    }

    if (parseInt(contractId) === 0) {
      errors.push('contractId');
    }
    if (title === '') {
      errors.push('title');
    }
    if (startOnUtc === '' || !startOnUtc) {
      errors.push('startOnUtc');
    }

    if (endOnUtc === '') {
      errors.push('endOnUtc');
    }
   
    if ((Date.parse(endOnUtc) < Date.parse(startOnUtc))) {
      this.setState({ toDateIsSmaller: true, fromDateIsGreater: false, invalid: true });    
      errors.push('endOnUtcSmaller'); 
    }

    this.setState({
      errors,
    });

    if (errors.length > 0) {
      return false;
    }
    this.setState({ loading: true });

    fetch(`${updateOrCreateApi}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: `${token}`,
      }),
      body: JSON.stringify({ ...data }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          const { history } = this.props;
          history.push({
            pathname: redirectTo,
            state: { scheduleId: response.data },
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.createScheduleFn(e, redirectTo));
          });
        } else {
          // eslint-disable-next-line no-alert
          alert(response.errors[0]);
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(`Record insertion failed ${err}`);
        this.setState({ loading: false });
      });
    return true;
  }

  getDefaultShiftType(shifts) {
    const { location } = this.props;
    const { typeOfShiftIncluded } = this.state;
    if (location.state && Number.isNaN(Number(typeOfShiftIncluded))) {
      // eslint-disable-next-line max-len
      const filteredVal = shifts.data.filter(shift => shift.id.toString() === location.state.data.typeOfShiftIncluded);
      if (filteredVal.length > 0) {
        this.setState({ typeOfShiftIncluded: (filteredVal[0].id).toString() });
      }
    }
  }

  getDdDefaultVal(clients) {
    const { location } = this.props;
    const { state } = location;
    const { contractId } = this.state;
    if (state && Number.isNaN(Number(contractId))) {
      const filteredVal = clients.data.filter(option => option.name === state.data.clientId);
      this.setState({ contractId: Number(filteredVal[0].id) });
    }
  }

  callErrorHandlerOnChange = (name, val) => {
    const { errors } = this.state;
    if (errors.indexOf(name) !== -1 && val) {
      errors.splice(errors.indexOf(name), 1);
      this.setState({ errors });
    }
  }

  handleShiftDropDowns = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
    );
  };

  blockInvalidChar = (e, allowDecimal) => {
    const blockChar = ['e', 'E', '+', '-'];
    if (!allowDecimal) { blockChar.push('.'); }
    if (blockChar.includes(e.key) || (e.which === 38 || e.which === 40)) {
      e.preventDefault();
    }
  };

  handleChange(event) {
    const { target } = event;
    const { name, value } = target;
    const re = /^[0-9\b]+$/;
    this.callErrorHandlerOnChange(name, value);
    if (event.target.type === 'text') {
      this.setState({
        [name]: value,
      });
    } else if (event.target.type === 'number' && (event.target.value === '' || re.test(event.target.value))) {
      this.setState({
        [name]: Number(value),
      });
    }
  }

  handleSwitch(event) {
    const { target } = event;
    const { name, checked } = target;
    this.setState({
      [name]: checked,
    });
  }

  handleFromDateChange(date) {
    const { endOnUtc } = this.state;
    if ((Date.parse(endOnUtc) < Date.parse(date))) {
      this.setState({ fromDateIsGreater: true, toDateIsSmaller: false, invalid: true });
    } else {
      this.setState({ fromDateIsGreater: false, toDateIsSmaller: false, invalid: false });
    }
    this.setState({
      startOnUtc: date,
    });
    this.callErrorHandlerOnChange('startOnUtc', date);
  }

  handleToDateChange(date) {
    const { startOnUtc } = this.state;
    if ((Date.parse(date) < Date.parse(startOnUtc))) {
      this.setState({ toDateIsSmaller: true, fromDateIsGreater: false, invalid: true });
    } else {
      this.setState({ toDateIsSmaller: false, fromDateIsGreater: false, invalid: false });
    }
    this.setState({
      endOnUtc: date,
    });
    this.callErrorHandlerOnChange('endOnUtc', date);
  }

  hasError(key) {
    const { errors } = this.state;
    return errors.indexOf(key) !== -1;
  }

  render() {
    const {
      title, isPublished, readOnly, contractId, description, numberOfPeopleInSchedule,
      daysToBeCovered, hoursToBeCovered, numberOfShiftType,
      allShiftType, clients, startOnUtc, endOnUtc, loading,
      fromDateIsGreater, toDateIsSmaller, typeOfShiftIncluded,
      isOpenShiftRequestAllowed,
    } = this.state;
    const { history, t } = this.props;
    return (
      <div className="container-fluid create-schedule">
        <div className="card_layout">
          <Form>
            <Form.Row>
              <Form.Group as={Col} xl={3} lg={6} controlId="title">
                <Form.Label className="form-label-custom">{t('ScheduleNameText')}</Form.Label>
                <Form.Control
                  type="text"
                  required="true"
                  disabled={readOnly}
                  defaultValue={title}
                  className={
                    this.hasError('title')
                      ? 'is-invalid'
                      : ''
                  }
                  name="title"
                  onChange={event => this.handleChange(event)}
                  autoComplete="off"
                />
                <div
                  className={
                    this.hasError('title') ? 'text-danger' : 'hidden'
                  }
                >
                  {t('ScheduleCreatePage.ScheduleName_errorText')}
                </div>
              </Form.Group>

              <Form.Group as={Col} xl={6} lg={6} controlId="description">
                <Form.Label className="form-label-custom">{t('ScheduleCreatePage.Description')}</Form.Label>
                <Form.Control
                  defaultValue={description}
                  type="text"
                  name="description"
                  disabled={readOnly}
                  onChange={event => this.handleChange(event)}
                  autoComplete="off"
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xl={3} md={6} controlId="noPeople">
                <Form.Label className="form-label-custom">{t('ScheduleCreatePage.NoOfPeoples')}</Form.Label>
                <Form.Control
                  type="number"
                  defaultValue={numberOfPeopleInSchedule}
                  name="numberOfPeopleInSchedule"
                  disabled={readOnly}
                  onKeyDown={event => this.blockInvalidChar(event, false)}
                  onChange={event => this.handleChange(event)}
                  autoComplete="off"
                />
              </Form.Group>
              <Form.Group as={Col} xl={3} md={6} controlId="daysCovered">
                <Form.Label className="form-label-custom">
                  {t('ScheduleCreatePage.DaysToBeCovered')}
                  {' '}
                </Form.Label>
                <Form.Control
                  defaultValue={daysToBeCovered}
                  type="number"
                  name="daysToBeCovered"
                  disabled={readOnly}
                  onKeyDown={event => this.blockInvalidChar(event, true)}
                  onChange={event => this.handleChange(event)}
                  autoComplete="off"
                />
              </Form.Group>
              <Form.Group as={Col} xl={3} md={12} controlId="hoursCovered">
                <Form.Label className="form-label-custom">
                  {t('ScheduleCreatePage.HrsToBeCovered')}
                  {' '}
                </Form.Label>
                <Form.Control
                  type="number"
                  pattern="[0-9]*"
                  name="hoursToBeCovered"
                  defaultValue={hoursToBeCovered}
                  disabled={readOnly}
                  onKeyDown={event => this.blockInvalidChar(event, true)}
                  onChange={event => this.handleChange(event)}
                  autoComplete="off"
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} xl={3} md={6} controlId="shiftType">
                <Form.Label className="form-label-custom">{t('ScheduleCreatePage.TypesOfShift')}</Form.Label>
                <Form.Control
                  name="typeOfShiftIncluded"
                  as="select"
                  disabled={readOnly}
                  onChange={this.handleShiftDropDowns}
                >

                  <option value="0">{t('ScheduleCreatePage.SelectShiftType')}</option>
                  {allShiftType.data && allShiftType.data.map(shiftType => (
                    // eslint-disable-next-line max-len
                    <option key={shiftType.id} value={shiftType.id.toString()} selected={typeOfShiftIncluded === shiftType.id.toString() || false}>{shiftType.title}</option>))}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} xl={3} md={6} controlId="noOfShift">
                <Form.Label className="form-label-custom">{t('ScheduleCreatePage.NoOfShift')}</Form.Label>
                <Form.Control
                  type="number"
                  onKeyDown={event => this.blockInvalidChar(event, false)}
                  defaultValue={numberOfShiftType}
                  name="numberOfShiftType"
                  disabled={readOnly}
                  onChange={event => this.handleChange(event)}
                  autoComplete="off"
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} xl={3} md={6} controlId="scheduleName">
                <Form.Label className="form-label-custom">{t('StartDate')}</Form.Label>
                <DatePicker
                  minDate={getMinDate.startDateTom()}
                  name="startOnUtc"
                  selected={startOnUtc}
                  onChange={this.handleFromDateChange}
                  placeholderText={commonService.localizedDateFormat()}
                  dateFormat={commonService.localizedDateFormatForPicker()}
                  className="form-control cal_icon"
                  pattern="\d{2}\/\d{2}/\d{4}"
                  disabled={readOnly}
                  autoComplete="off"
                />
                <div className={this.hasError('startOnUtc') ? 'text-danger' : 'hidden'}>{t('ScheduleCreatePage.StartDate_reqText')}</div>
                {fromDateIsGreater
                  && <div className="text-danger">{t('ScheduleCreatePage.StartDate_errorText')}</div>
                }
              </Form.Group>
              <Form.Group as={Col} xl={3} md={6} controlId="endDate">
                <Form.Label className="form-label-custom">{t('EndDate')}</Form.Label>
                <DatePicker
                  name="endOnUtc"
                  id="endOnUtc"
                  minDate={getMinDate.startDateTom()}
                  selected={endOnUtc}
                  onChange={this.handleToDateChange}
                  placeholderText={commonService.localizedDateFormat()}
                  dateFormat={commonService.localizedDateFormatForPicker()}
                  className="form-control cal_icon"
                  pattern="\d{2}\/\d{2}/\d{4}"
                  disabled={readOnly}
                  autoComplete="off"
                />
                <div className={this.hasError('endOnUtc') ? 'text-danger' : 'hidden'}>{t('ScheduleCreatePage.EndDate_reqText')}</div>
                {toDateIsSmaller
                  && <div className="text-danger">{t('ScheduleCreatePage.EndDate_errorText')}</div>
                }
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} xl={3} md={6} controlId="contract">
                <Form.Label className="form-label-custom">{t('ContractText')}</Form.Label>
                {clients.data && (
                  <Form.Control
                    as="select"
                    defaultValue={contractId}
                    required="true"
                    name="contractId"
                    onChange={this.handleShiftDropDowns}
                    disabled={readOnly}
                  >
                    <option value="0">{t('ScheduleCreatePage.SelectClient')}</option>
                    {clients.data !== undefined ? clients.data.map(client => (
                      <option key={client.id} value={client.id} selected={contractId === Number(client.id) || false}>{client.name}</option>)) : null}
                  </Form.Control>
                )}
                <div className={this.hasError('contractId') ? 'text-danger' : 'hidden'}>{t('ScheduleCreatePage.ContractId_reqText')}</div>

              </Form.Group>
              <Form.Group as={Col} xl={3} md={6} className="display-flex">

                <Form.Control
                  className="custom-checkbox custom-checkbox-switch"
                  onChange={event => this.handleSwitch(event)}
                  disabled={readOnly}
                  defaultChecked={isOpenShiftRequestAllowed}
                  name="isOpenShiftRequestAllowed"
                  type="checkbox"
                />
                <span className="slider round" />
                <Form.Label className="switch form-label-custom">{t('ScheduleCreatePage.RequestOpenShift')}</Form.Label>
              </Form.Group>
              <Form.Group as={Col} xl={3} md={6} className="display-flex">

                <Form.Control
                  className="custom-checkbox custom-checkbox-switch"
                  defaultChecked={isPublished}
                  onChange={event => this.handleSwitch(event)}
                  name="isPublished"
                  type="checkbox"
                  disabled={readOnly}
                />
                <span className="slider round" />
                <Form.Label className="switch form-label-custom">{t('PublishedText')}</Form.Label>
              </Form.Group>
            </Form.Row>
            <Form.Row className="row">
              <Col className="btn-card-box">
                <div className="btn-card">
                  <Link to="view-schedule" onClick={() => history.push('view-schedule')} className=" flex-fill btn btn-secondary createbtn">{t('ScheduleCreatePage.CancelBtn')}</Link>
                </div>
                <div className="btn-card">
                  <Button type="button" onClick={e => this.createScheduleFn(e, 'view-schedule')} disabled={readOnly}>
                    {' '}
                    {t('SaveBtn')}
                    {' '}
                  </Button>
                </div>
                <div className="btn-card">
                  <Button type="button" onClick={e => this.createScheduleFn(e, 'shift-template')} disabled={readOnly}>
                    {' '}
                    {t('ScheduleCreatePage.SaveContinueBtn')}
                    {' '}
                  </Button>
                </div>
              </Col>
            </Form.Row>
          </Form>
        </div>
      </div>

    );
  }
}

export default withTranslation()(CreateSchedule);
