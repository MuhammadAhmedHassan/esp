
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Form, Button, Row, Table, Col,
} from 'react-bootstrap';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import LoadingSpinner from '../../shared/LoadingSpinner';
import './style.scss';
import Api from '../../common/Api';
import PaginationAndPageNumber from '../../shared/Pagination';
import { userService } from '../../../services';

const tableHeader = [
  {
    label: 'S.No',
  },
  {
    label: 'Schedule Name',
  },
  {
    label: 'Shift label',
  },
  {
    label: 'Planned S T',
  },
  {
    label: 'Planned E T',
  },
  {
    label: 'Actual S T',
  },
  {
    label: 'Actual E T',
  },
  {
    label: 'Req. Hours',
  },
  {
    label: 'Act. Hours',
  },
  {
    label: 'Reason',
  },
  {
    label: 'Status',
  },
];


export class ShiftApproval extends Component {
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
      startDate: null,
      endDate: null,
      fromError: '',
      toError: '',
      empListdata: [],
    };
    this.onKeyUp = this.onKeyUp.bind(this);
    this.searchFunc = this.searchFunc.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
  }

  componentDidMount() {
    this.getEmpShifApprovalListing();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getEmpShifApprovalListing();
    }
  }

  onKeyUp(event) {
    if (event.charCode === 13) {
      this.getEmpShifApprovalListing();
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

  getEmpShifApprovalListing = () => {
    const {
      token, userId, startDate, endDate, pageIndex, pageSize,
    } = this.state;
    const data = {
      languageId: 1,
      requestTypeId: 1,
      pageIndex,
      pageSize,
      managerId: userId,
      userId,
      startDate: (startDate !== null) ? moment(startDate).format('yyyy-MM-DDTHH:mm:ss.Z') : null,
      endDate: (endDate !== null) ? moment(endDate).format('yyyy-MM-DDTHH:mm:ss.Z') : null,
    };
    fetch(`${Api.shift.getMngShifApprovalListing}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            empListdata: response.data,
            loaded: true,
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmpShifApprovalListing());
          });
        } else {
          this.setState({
            empListdata: [],
            loaded: true,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  handleFromDateChange(date) {
    this.setState({
      startDate: date,
      fromError: '',
    });
  }

  handleToDateChange(date) {
    const { startDate } = this.state;
    if (date < startDate) {
      this.setState({ toError: 'End Date can\'t be less than Start Date' });
    } else {
      this.setState({
        endDate: date,
        toError: '',
      });
    }
  }


  searchFunc() {
    this.setState({
      loaded: false,
      pageIndex: 1,
    });
  }

  render() {
    const {
      empListdata, pageSize, loaded, totalRecords, pageIndex, fromError, toError,
      startDate, endDate,
    } = this.state;
    let counter = 1;
    const { t } = this.props;
    return (
      <div className="container-fluid shift-Approval">
        <div className="card_layout">
          <Row>
            <Col md={2}>
              <Form.Group>
                <Form.Label htmlFor={startDate}>{t('StartDate')}</Form.Label>
                <DatePicker
                  selected={startDate}
                  onChange={this.handleFromDateChange}
                  name="startDate"
                  placeholderText="MM/DD/YYYY"
                  className="form-control cal_icon"
                  pattern="\d{2}\/\d{2}/\d{4}"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
                {fromError && <div className="text-danger">{fromError}</div>
                }
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label htmlFor={endDate}>{t('EndDate')}</Form.Label>
                <DatePicker
                  selected={endDate}
                  onChange={this.handleToDateChange}
                  name="endDate"
                  className="form-control cal_icon"
                  placeholderText="MM/DD/YYYY"
                  pattern="\d{2}\/\d{2}/\d{4}"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
                {toError && <div className="text-danger">{toError}</div>
                }
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button
                size="sm"
                className="btn btn-primary searchBtn"
                onClick={this.searchFunc}
              >
                {t('SearchBtn')}
              </Button>
            </Col>
          </Row>
          {loaded ? (
            <>
              <div>
                <Row className="p-2">
                  <Table responsive striped bordered>
                    <thead>
                      <tr className="table-header ">
                        <th>{t('SrNo')}</th>
                        <th>{t('ScheduleNameText')}</th>
                        <th>{t('ShiftApproval.Shiftlabel')}</th>
                        <th>{t('ShiftApproval.PlannedST')}</th>
                        <th>{t('ShiftApproval.PlannedET')}</th>
                        <th>{t('ShiftApproval.ActualST')}</th>
                        <th>{t('ShiftApproval.ActualET')}</th>
                        <th>{t('ShiftApproval.ReqHours')}</th>
                        <th>{t('ShiftApproval.ActHours')}</th>
                        <th>{t('leavRequestPage.reason')}</th>
                        <th>{t('Status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empListdata.map(data => (
                        <tr key={data.id}>
                          <td>{counter++}</td>
                          <td>{data.scheduleTitle}</td>
                          <td>{data.shiftLabel}</td>
                          <td>{`${moment(data.plannedStartDateTime).format('HH:mm:A')}`}</td>
                          <td>{`${moment(data.plannedEndDateTime).format('HH:mm:A')}`}</td>
                          <td>{`${moment(data.actualStartDateTime).format('HH:mm:A')}`}</td>
                          <td>{`${moment(data.actualEndDateTime).format('HH:mm:A')}`}</td>
                          <td>{data.requiredHours}</td>
                          <td>{data.actualHours}</td>
                          <td>{data.notes}</td>
                          <td>{data.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Row>
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
            </>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>

    );
  }
}

export default withTranslation()(ShiftApproval);
