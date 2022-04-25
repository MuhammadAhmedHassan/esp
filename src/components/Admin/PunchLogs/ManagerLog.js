import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Multiselect } from 'multiselect-react-dropdown';
import './style.scss';
import moment from 'moment';
import {
  Table, Col, Row, Form,
} from 'react-bootstrap';
import DatePicker from 'react-multi-date-picker';
import PaginationAndPageNumber from '../../shared/Pagination';
import { userService } from '../../../services';
import Api from '../../common/Api';
import { commonService } from '../../../services/common.service';

export class ManagerLog extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      token: `${token}`,
      userId,
      pageIndex: 1,
      totalRecords: 0,
      pageSize: 10,
      loaded: false,
      fromDate: '',
      toDate: '',
      fromDateIsGreater: false,
      toDateIsSmaller: false,
      punchdata: [],
      sourceName: null,
      sourceguidData: [],
      employeesData: [],
      employeeName: '',
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.handleMultiSelect = this.handleMultiSelect.bind(this);
    this.onHandleSelectRemove = this.onHandleSelectRemove.bind(this);
  }

  componentDidMount() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getPunchLogManager();
      this.getSourceGuid();
      this.getAllEmployees();
    }
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getPunchLogManager();
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
      loaded: false,
    });
  };

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
        loaded: false,
      });
    }
  };

  getPunchLogManager = () => {
    const {
      token,
      pageIndex,
      userId,
      pageSize,
      sourceName,
      fromDate,
      toDate,
      employeeName,
    } = this.state;

    fetch(`${Api.punchLog.getPunchLog}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        managerId: userId,
        userIds: employeeName.toString(),
        languageId: 1,
        pageIndex,
        pageSize,
        sourceGuid: sourceName,
        startDate: fromDate
          ? moment(fromDate).format('YYYY-MM-DDTHH:mm:ss.Z')
          : null,
        endDate: toDate ? moment(toDate).format('YYYY-MM-DDTHH:mm:ss.Z') : null,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            punchdata: response.data,
            loaded: true,
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getPunchLogManager());
          });
        } else {
          this.setState({
            punchdata: [],
            loaded: true,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  getSourceGuid = () => {
    const { token, userId } = this.state;

    fetch(`${Api.punchLog.getSourceGuid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        languageId: 1,
        id: userId,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            sourceguidData: response.data,
            loaded: true,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getSourceGuid());
          });
        } else {
          this.setState({
            sourceguidData: [],
            loaded: true,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  getAllEmployees = () => {
    const { token, userId } = this.state;

    fetch(`${Api.punchLog.getAllEmployees}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        languageId: 1,
        id: userId,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          const reportManagers = response.data.map(usr => ({
            name: `${usr.firstName} ${usr.lastName}`,
            id: usr.id,
          }));
          this.setState({
            employeesData: reportManagers,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAllEmployees());
          });
        } else {
          this.setState({
            employeesData: [],
            loaded: true,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  handleMultiSelect = (selectedList, selectedItem) => {
    this.setState(
      prevState => ({
        employeeName: [...prevState.employeeName, selectedItem.id],
      }),
      () => this.getPunchLogManager(),
    );
  };

  onHandleSelectRemove = (selectedList, removedItem) => {
    this.setState(
      prevState => ({
        employeeName: prevState.employeeName.filter(
          x => x !== removedItem.id,
        ),
      }),
      () => this.getPunchLogManager(),
    );
  };

  handleDropDown = (event) => {
    const { target } = event;
    const { name, value } = target;
    this.setState(
      {
        [name]: value,
      },
      () => this.getPunchLogManager(),
    );
  };

  handleFromDateChange(date) {
    const { toDate } = this.state;
    if (Date.parse(toDate) < Date.parse(date)) {
      this.setState({ fromDateIsGreater: true, toDateIsSmaller: false });
    } else {
      this.setState({ fromDateIsGreater: false, toDateIsSmaller: false });
    }
    this.setState(
      {
        fromDate: date,
      },
      () => this.getPunchLogManager(),
    );
  }

  handleToDateChange(date) {
    const { fromDate } = this.state;
    if (Date.parse(date) < Date.parse(fromDate)) {
      this.setState({ toDateIsSmaller: true, fromDateIsGreater: false });
    } else {
      this.setState({ toDateIsSmaller: false, fromDateIsGreater: false });
    }
    this.setState(
      {
        toDate: date,
      },
      () => this.getPunchLogManager(),
    );
  }

  render() {
    const {
      punchdata,
      pageSize,
      toDateIsSmaller,
      fromDateIsGreater,
      fromDate,
      toDate,
      totalRecords,
      pageIndex,
      employeesData,
      sourceName,
      sourceguidData,
      employeeName,
    } = this.state;
    let counter = 1;
    const { t } = this.props;
    return (
      <>
        <div className="container-fluid employee-punchlog">
          <div className="card_layout">
            <Row className="p-4">
              <Col xl={3} lg={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm="4" htmlFor={employeeName}>
                    {t('EmployeeText')}
                  </Form.Label>
                  <Col sm={8}>
                    <Multiselect
                      multiple
                      options={employeesData}
                      displayValue="name"
                      onSelect={this.handleMultiSelect}
                      onRemove={this.onHandleSelectRemove}
                      className="form-control"
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col xl={3} lg={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm="4" htmlFor={sourceName}>
                    {t('EmployeePunchLogPage.Label_SourceId')}
                  </Form.Label>
                  <Col sm="8">
                    <select
                      className="form-control"
                      name="sourceName"
                      onChange={event => this.handleDropDown(event)}
                      value={sourceName}
                    >
                      <option value="0">
                        {t('EmployeePunchLogPage.Label_SelectSource')}
                      </option>
                      {sourceguidData.map(sourceData => (
                        <option value={sourceData.sourceGuid}>
                          {sourceData.sourceName}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Form.Group>
              </Col>
              <Col xl={3} lg={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm="4" htmlFor={fromDate}>
                    {t('From')}
                  </Form.Label>
                  <Col sm={8}>
                    <DatePicker
                      selected={fromDate}
                      onChange={this.handleFromDateChange}
                      name="toDate"
                      placeholderText={commonService.localizedDateFormat()}
                      dateFormat={commonService.localizedDateFormatForPicker()}
                    />
                    {fromDateIsGreater && (
                      <div className="text-danger">
                        {t('EmployeePunchLogPage.Label_FromDateText')}
                      </div>
                    )}
                  </Col>
                </Form.Group>
              </Col>
              <Col xl={3} lg={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm="4" htmlFor={toDate}>
                    {t('To')}
                  </Form.Label>
                  <Col sm="8">
                    <DatePicker
                      selected={toDate}
                      onChange={this.handleToDateChange}
                      name="toDate"
                      placeholderText={commonService.localizedDateFormat()}
                      dateFormat={commonService.localizedDateFormatForPicker()}
                    />
                    {toDateIsSmaller && (
                      <div className="text-danger">
                        {t('EmployeePunchLogPage.Label_ToDateText')}
                      </div>
                    )}
                  </Col>
                </Form.Group>

              </Col>
            </Row>
            <Table responsive striped bordered className="striped-body">
              <thead className="table-header">
                <tr>
                  <th>{t('SrNo')}</th>
                  <th>{t('Date')}</th>
                  <th>{t('EmployeeNameText')}</th>
                  <th>{t('EmployeePunchLogPage.TableHeader_PInLoc')}</th>
                  <th>{t('EmployeePunchLogPage.TableHeader_PInTime')}</th>
                  <th>{t('EmployeePunchLogPage.TableHeader_PInSource')}</th>
                  <th>{t('EmployeePunchLogPage.TableHeader_POutLoc')}</th>
                  <th>{t('EmployeePunchLogPage.TableHeader_POutTime')}</th>
                  <th>{t('EmployeePunchLogPage.TableHeader_POutSource')}</th>
                </tr>
              </thead>
              <tbody>
                {punchdata.map(punchData => (
                  <tr key={punchData.id}>
                    <td>{counter++}</td>
                    <td>
                      {punchData.punchInDateTime ? commonService.localizedDate(punchData.punchInDateTime) : ''}
                    </td>
                    <td>{punchData.userName}</td>
                    <td />
                    <td>
                      {`${moment(punchData.punchInDateTime).format('HH:mm A')}`}
                    </td>
                    <td>{punchData.punchInSource}</td>
                    <td />
                    <td>
                      {`${moment(punchData.punchOutDateTime).format(
                        'HH:mm A',
                      )}`}
                    </td>
                    <td>{punchData.punchOutSource}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(ManagerLog);
