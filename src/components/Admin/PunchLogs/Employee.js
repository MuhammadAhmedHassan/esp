import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import './style.scss';
import moment from 'moment';
import {
  Table, Row, Col, Form, Select,
} from 'react-bootstrap';
import DatePicker from 'react-multi-date-picker';
import PaginationAndPageNumber from '../../shared/Pagination';
import { userService } from '../../../services';
import Api from '../../common/Api';
import { commonService } from '../../../services/common.service';

export class Employee extends Component {
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
      // errorMessage: '',
      punchdata: [],
      sourceName: null,
      sourceguidData: [],
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
  }

  componentDidMount() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getPunchLog();
      this.getSourceGuid();
    }
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getPunchLog();
    }
  }

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
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
      loaded: false,
    });
  }


  handleDropDown = (event) => {
    const { target } = event;
    const {
      name, value,
    } = target;
    this.setState({
      [name]: value,
    }, () => this.getPunchLog());
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
  }

  getPunchLog = () => {
    const {
      token, userId, pageIndex, pageSize, sourceName, fromDate, toDate,
    } = this.state;
    fetch(`${Api.punchLog.getPunchLog}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: userId,
        languageId: 1,
        pageIndex,
        pageSize,
        sourceGuid: sourceName,
        startDate: fromDate ? moment(fromDate).format('YYYY-MM-DDTHH:mm:ss.Z') : null,
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
            this.setState({ token: tokens }, () => this.getPunchLog());
          });
        } else {
          this.setState({
            punchdata: [],
            loaded: true,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }


  handleToDateChange(date) {
    const { fromDate } = this.state;
    if ((Date.parse(date) < Date.parse(fromDate))) {
      this.setState({ toDateIsSmaller: true, fromDateIsGreater: false });
    } else {
      this.setState({ toDateIsSmaller: false, fromDateIsGreater: false });
    }
    this.setState({
      toDate: date,
    },
    () => this.getPunchLog());
  }

  handleFromDateChange(date) {
    const { toDate } = this.state;
    if ((Date.parse(toDate) < Date.parse(date))) {
      this.setState({ fromDateIsGreater: true, toDateIsSmaller: false });
    } else {
      this.setState({ fromDateIsGreater: false, toDateIsSmaller: false });
    }
    this.setState({
      fromDate: date,
    },
    () => this.getPunchLog());
  }


  render() {
    const {
      punchdata, pageSize, toDateIsSmaller, fromDateIsGreater, fromDate, toDate,
      totalRecords, pageIndex, sourceName, sourceguidData,
    } = this.state;
    let counter = 1;
    const { t } = this.props;
    return (
      <>
        <div className="container-fluid employee-punchlog">
          <div className="card_layout">
            <Row>
              <Col sm="12" xl={{ size: 8, offset: 4 }}>
                <Row className="p-4">
                  <Col lg={4}>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                      <Form.Label column sm="4" htmlFor={sourceName}>
                        {t('EmployeePunchLogPage.Label_SourceId')}
                      </Form.Label>
                      <Col sm="8">
                        <select
                          name="sourceName"
                          onChange={event => this.handleDropDown(event)}
                          value={sourceName}
                          className="form-control"
                        >
                          <option value="0">{t('EmployeePunchLogPage.Label_SelectSource')}</option>
                          {sourceguidData.map(sourceData => (
                            <option value={sourceData.sourceGuid}>
                              {sourceData.sourceName}
                            </option>
                          ))}
                        </select>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                      <Form.Label column sm="4" htmlFor={fromDate}>
                        {t('From')}
                      </Form.Label>
                      <Col sm="8">
                        <DatePicker
                          selected={fromDate}
                          onChange={this.handleFromDateChange}
                          name="toDate"
                          placeholderText={commonService.localizedDateFormat()}
                          dateFormat={commonService.localizedDateFormatForPicker()}
                        />
                        {fromDateIsGreater
                          && <div className="text-danger">{t('EmployeePunchLogPage.Label_FromDateText')}</div>
                        }
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
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
                        {toDateIsSmaller
                          && <div className="text-danger">{t('EmployeePunchLogPage.Label_ToDateText')}</div>
                        }
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Table responsive striped bordered>
              <thead className="table-header">
                <tr>
                  <th>{t('SrNo')}</th>
                  <th>{t('Date')}</th>
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
                    <td>{punchData.punchInLocation}</td>
                    <td>
                      {`${moment(punchData.punchInDateTime).format('HH:mm A')}`}
                    </td>
                    <td>{punchData.punchInSource}</td>
                    <td>{punchData.punchOutLocation}</td>
                    <td>
                      {`${moment(punchData.punchOutDateTime).format('HH:mm A')}`}
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

export default withTranslation()(Employee);
