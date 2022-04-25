import React from 'react';
import { withTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import {
  Form, Button, Table, Row, Col, Tooltip,
} from 'react-bootstrap';
import './style.scss';
import 'react-datetime/css/react-datetime.css';
import FileSaver from 'file-saver';
import moment from 'moment';
import Api from '../../common/Api';
import { userService } from '../../../services';
import Loaders from '../../shared/Loaders';
import DownloadIcon from '../../../Images/Icons/downloadIcon.svg';
import PaginationAndPageNumber from '../../shared/Pagination';
import { commonService } from '../../../services/common.service';


class EmployeeShiftHistory extends React.Component {
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
      initialize: true,
      fromDate: moment(`${moment().get('month') + 1}-01-${moment().get('year')}`, 'MM-DD-YYYY').toDate(),
      toDate: new Date(),
      divisionId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      managerId: 0,
      employees: [],
      countryId: 0,
      stateId: 0,
      schedules: [{ id: '0', title: 'All' }],
      shifts: [{ id: '0', title: 'All' }],
      totalRecords: 0,
      pageIndex: 1,
      pageSize: 10,
      selectedYear: new Date(),
      city: '',
      scheduleId: '0',
      shiftId: '0',
      fileDownload: false,
      isFromDate: false,
      isToDate: false,
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
  }

  componentDidMount() {
    this.getSchedule();
    this.getEmployees();
  }

  bindSubDropDowns = (ddlName, ddlValue) => {
    const defaultSelection = '0';
    if (ddlName === 'scheduleId') {
      if (ddlValue === defaultSelection) {
        this.setState({ shifts: [{ id: '0', name: 'All' }], shiftId: 0 });
      } else {
        this.getShift();
      }
    }
  }

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
        loading: false,
      }, () => this.getEmployees());
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
      loading: false,
    }, () => this.getEmployees());
  }

  getSchedule = () => {
    const {
      token, modelMessage, userId,
    } = this.state;
    fetch(`${Api.schedule.getAllByUserId}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(userId, 0),
        languageId: 1,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ schedules: [{ id: '0', name: 'All' }].concat(response.data), scheduleId: '0' });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getSchedule());
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

  getShift = () => {
    const {
      token, modelMessage, scheduleId,
    } = this.state;
    fetch(`${Api.shift.getShiftByScheduleId}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(scheduleId, 0),
        languageId: 1,

      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ shifts: [{ id: '0', name: 'All' }].concat(response.data), shiftId: '0' });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getShift());
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getExcelDownload = () => {
    const {
      token, modelMessage, userId, fromDate, toDate, scheduleId, shiftId,
    } = this.state;
    fetch(`${Api.shift.downloadExcel}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: 0,
        languageId: 1,
        offset: 'string',
        isActive: true,
        totalRecords: 0,
        pageIndex: 0,
        pageSize: 0,
        divisionId: 0,
        businessUnitId: 0,
        departmentId: 0,
        teamId: 0,
        managerId: 0,
        userId: parseInt(userId, 0),
        contractTypeId: 0,
        countryId: 0,
        stateId: 0,
        city: '',
        workLocationId: 0,
        scheduleId: parseInt(scheduleId, 0),
        shiftId: parseInt(shiftId, 0),
        startDate: fromDate,
        endDate: toDate,
        userRoleIds: '',
        isOpenShift: true,
        isOnCallShift: true,
        isOverTimeShift: true,
      }),
    }).then(response => response.blob())
      .then((response) => {
        FileSaver.saveAs(response, 'ShiftHistoryReport.xlsx');
      })
      .catch(err => console.error(err.toString()));
  }


  getEmployees = () => {
    const {
      token, divisionId, businessUnitId, departmentId, teamId, modelMessage,
      managerId, countryId, stateId, totalRecords, fromDate, toDate,
      pageIndex, pageSize, city, userId, scheduleId, shiftId,
    } = this.state;
    if (fromDate !== null && toDate !== null) {
      const data = {
        id: 0,
        languageId: 1,
        offset: '',
        isActive: true,
        totalRecords,
        pageIndex: (pageSize) * (pageIndex - 1) + 1,
        pageSize,
        // organisationId: parseInt(organisationId, 10),
        divisionId: parseInt(divisionId, 10),
        businessUnitId: parseInt(businessUnitId, 10),
        departmentId: parseInt(departmentId, 10),
        teamId: parseInt(teamId, 10),
        managerId: parseInt(userId, 0),
        contractTypeId: 0,
        userId: 0,
        countryId: parseInt(countryId, 10),
        stateId: parseInt(stateId, 10),
        city,
        workLocationId: 0,
        scheduleId: parseInt(scheduleId, 0),
        shiftId: parseInt(shiftId, 0),
        userRoleIds: '',
        startDate: fromDate,
        endDate: toDate,
        isOpenShift: true,
        isOnCallShift: true,
        isOverTimeShift: true,
      };

      fetch(`${Api.shift.shiftHistory}`, {
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
              initialize: false,
              employees: response.data,
              pageIndex: Math.floor(response.pageIndex / response.pageSize) + 1 || 1,
              pageSize: response.pageSize,
              totalRecords: response.totalRecords,
            });
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.getEmployees());
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

        .catch(err => console.error(err.toString()));
    } else {
      this.setState({
        isFromDate: !fromDate,
        isToDate: !toDate,
        loading: false,
      });
    }
  }

  handleClose = () => {
    this.setState({
      modelUpdate: false,
    });
  };

  resetFilter = () => {
    this.setState({
      scheduleId: 0,
      shiftId: 0,
      year: new Date().getFullYear(),
      selectedYear: '',
      fromDate: moment(`${moment().get('month') + 1}-01-${moment().get('year')}`, 'MM-DD-YYYY').toDate(),
      toDate: new Date(),
      employees: [],
      initialize: true,
    }, () => this.getEmployees());
  }

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );


  handleTime = (time) => {
    const shiftTime = new Date(time);
    return shiftTime.getMinutes() < 10 ? `${shiftTime.getHours()}:0${shiftTime.getMinutes()}` : `${shiftTime.getHours()}:${shiftTime.getMinutes()}`;
  }

  handleDate = (date) => {
    const shiftDate = new Date(date);
    return `${shiftDate.getDate()}/${shiftDate.getMonth()}/${shiftDate.getFullYear()}`;
  }

  handleFromDateChange(date) {
    const { toDate, fromSession } = this.state;
    if ((Date.parse(toDate) < Date.parse(date))) {
      this.setState({ fromDateIsGreater: true, toDateIsSmaller: false, invalid: true });
    } else if ((Date.parse(toDate) === Date.parse(date))) {
      this.setState({
        toSession: fromSession,
      });
    } else {
      this.setState({ fromDateIsGreater: false, toDateIsSmaller: false, invalid: false });
    }
    this.setState({
      fromDate: date,
      isFromDate: false,
    });
  }


  handleToDateChange(date) {
    const { fromDate } = this.state;
    if ((Date.parse(date) < Date.parse(fromDate))) {
      this.setState({ toDateIsSmaller: true, fromDateIsGreater: false, invalid: true });
    } else {
      this.setState({ toDateIsSmaller: false, fromDateIsGreater: false, invalid: false });
    }
    this.setState({
      toDate: date,
      isToDate: false,
    });
  }

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  handleYear(date) {
    this.setState({ year: date.year(), selectedYear: date });
  }

  submitRequest() {
    this.setState({ loading: true }, () => this.getEmployees());
  }

  handleChange(event) {
    const { target } = event;
    const { name } = target;
    this.setState({ [name]: target.value }, () => this.bindSubDropDowns(name, target.value));
  }

  render() {
    const {
      loading, employees, fromDate, toDate, pageIndex, pageSize, totalRecords, selectedYear,
      fromDateIsGreater, toDateIsSmaller, scheduleId, schedules, shiftId, shifts, year, initialize, fileDownload, isFromDate, isToDate,
    } = this.state;
    const date = new Date().getFullYear();
    const { t } = this.props;
    let counter = 1;
    const isEnabled = scheduleId > 0 || shiftId > 0;
    return (
      <>
        <div className="card_layout coverage">
          <Form>
            <Row className="reloadBtn">
              <button type="button" aria-hidden className="arrowBtn mx-2" onClick={() => this.getExcelDownload()}><img className="pointer" src={DownloadIcon} alt="download icon" /></button>
            </Row>
            <Row>
              <Col lg={3}>
                <Form.Label htmlFor={fromDate}>{t('SchedulePage.StartDate')}</Form.Label>
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
                  && <div className="text-danger">{t('ApplyPage.FromDateText')}</div>
                }
                {isFromDate && (
                  <p className="text-danger validation_message">
                    From date is required
                  </p>
                )}
              </Col>

              <Col lg={3}>
                <Form.Label htmlFor={toDate}>{t('SchedulePage.EndDate')}</Form.Label>
                <DatePicker
                  selected={toDate}
                  onChange={this.handleToDateChange}
                  name="toDate"
                  autoComplete="off"
                  dateFormat="MM/dd/yyyy"
                  className="form-control cal_icon"
                  pattern="\d{2}\/\d{2}/\d{4}"
                />
                {toDateIsSmaller
                  && <div className="text-danger">{t('ApplyPage.ToDateText')}</div>
                }
                {isToDate && (
                  <p className="text-danger validation_message">
                    To date is required
                  </p>
                )}
              </Col>
              <Col lg={3}>
                <Form.Label>
                  {t('SidebarPage.viewSchedule')}
                </Form.Label>
                <select className="form-control dropHeight" name="scheduleId" value={scheduleId} onChange={this.handleChange}>
                  {
                    schedules.map(schedule => (
                      <option key={schedule.id} value={schedule.id}>
                        {schedule.title}
                      </option>
                    ))}
                </select>
              </Col>
              <Col lg={3}>
                <Form.Label>
                  {t('ShiftTemplatePage.Shift')}
                </Form.Label>
                <select className="form-control dropHeight" name="shiftId" value={shiftId} onChange={this.handleChange}>
                  {
                    shifts.map(shift => (
                      <option key={shift.id} value={shift.id}>
                        {shift.title}
                      </option>
                    ))}
                </select>
              </Col>
              <div className="col-lg-3 col-md-6 d-flex justify-content-center align-items-end">
                <Button className="dropHeight" onClick={() => this.submitRequest()}>
                  {' '}
                  {t('ManageEmployeePage.SearchBtn')}
                  {' '}
                </Button>
              </div>
              {isEnabled && (
                <div className="col-lg-3 col-md-6 d-flex justify-content-center align-items-end">
                  <Button className="dropHeight" onClick={() => this.resetFilter()}>
                    {' '}
                    {t('ShiftTemplatePage.Reset')}
                    {' '}
                  </Button>
                </div>
              )}
            </Row>
          </Form>
        </div>
        <div className="card_layout p-0">
          {loading
            && (
              <Loaders />
            ) }
          { !loading && employees && employees.length > 0 && (
          <Table responsive>
            <thead>
              <tr>
                <th>{t('Coverage.Sr')}</th>
                <th>{t('Coverage.Name')}</th>
                <th>{t('Coverage.Label')}</th>
                <th>{t('Coverage.Shift')}</th>
                <th>{t('Coverage.Date')}</th>
                <th>{t('Coverage.Time')}</th>
                <th>{t('Coverage.CalTime')}</th>
                <th>{t('Coverage.ReqHr')}</th>
                <th>{t('Coverage.ExType')}</th>
                <th>{t('Coverage.Variance')}</th>
              </tr>
            </thead>
            <tbody>
              {employees && employees.length > 0 && employees.map(data => (
                <tr>
                  <td>
                    {counter++}
                  </td>
                  <td>
                    {data.userName}
                  </td>
                  <td>
                    {data.shiftLabel}
                  </td>
                  <td>
                    {data.shiftType}
                  </td>
                  <td>
                    {this.handleDate(data.shiftDate)}
                  </td>
                  <td>
                    {this.handleTime(data.shiftTime)}
                  </td>
                  <td>
                    {data.calculatedHours}
                  </td>
                  <td>
                    {data.requiredHours}
                  </td>
                  <td>
                    <div
                      style={{
                        backgroundColor: `${data.exceptionColourCode}`,
                      }}
                      className="employeeCode"
                    >
                      {data.exceptionType}
                    </div>
                  </td>
                  <td>
                    {data.variance}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          )}
        </div>
        { !loading && employees && employees.length > 0 && (
          <div className="mt-3">
            <PaginationAndPageNumber
              totalPageCount={Math.ceil(totalRecords / pageSize)}
              totalElementCount={totalRecords}
              updatePageNum={this.updatePageNum}
              updatePageCount={this.updatePageCount}
              currentPageNum={pageIndex}
              recordPerPage={pageSize}
            />
          </div>
        )}
        { !initialize && !loading && employees.length === 0 && (
          <div className="dataAlign"><h5 className="text-align-center">No data found</h5></div>
        )}
      </>
    );
  }
}

export default (withTranslation()(EmployeeShiftHistory));
