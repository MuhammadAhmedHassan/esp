/* eslint-disable radix */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Row, Col,
} from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import '../style.scss';
import Api from '../../../common/Api';
import { userService } from '../../../../services/user.service';
import { commonService } from '../../../../services/common.service';

import PaginationAndPageNumber from '../../../shared/Pagination/index';


const constActiveTransactionType = 10;

class ManagerAbsence extends React.Component {
  constructor(props) {
    super(props);
    const userId = props.location && props.location.state ? props.location.state.id : 0;
    const token = userService.getToken();
    this.state = {
      token: `token ${token}`,
      userId,
      appliedLeaves: [],
      transactionType: constActiveTransactionType,
      dateRange: '',
      employeesUnderManager: [],
      reportingEmployee: 0,
      pageIndex: 1,
      pageSize: 5,
      totalRecords: 0,
    };
  }

  componentDidMount() {
    this.getAppliedLeaves(this.state.transactionType);
    this.getManagerEmployee();
  }

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
        // eslint-disable-next-line react/no-unused-state
        loaded: false,
      });
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: pageCount,
      pageIndex: 1,
      // eslint-disable-next-line react/no-unused-state
      loaded: false,
    });
  }

  getManagerEmployee = () => {
    const {
      token, userId, pageIndex,
      pageSize,
    } = this.state;

    // Get leave type
    fetch(`${Api.vacationManagement.getTeamMateList}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        languageId: 1,
        userId,
        pageIndex,
        pageSize,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            employeesUnderManager: response.data,
            pageIndex: response.data.pageIndex || 1,
            pageSize: response.data.pageSize,
            totalRecords: response.data.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getManagerEmployee());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  getAppliedLeaves = (transactionType) => {
    const {
      token, userId,
      reportingEmployee, pageIndex,
      pageSize,
    } = this.state;
    let startDate = null;
    let endDate = null;
    if (this.state.dateRange != null && this.state.dateRange !== '') {
      if (this.state.dateRange.length > 0) {
        startDate = this.state.dateRange[0].toDate();
        endDate = this.state.dateRange.length > 1 ? this.state.dateRange[1].toDate() : null;
      }
    }

    fetch(`${Api.vacationManagement.getuserappliedleaves}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        employeeId: parseInt(reportingEmployee, 10),
        appliedToSecondaryUser: userId,
        pageIndex,
        pageSize,
        transactionType: parseInt(transactionType),
        isClosed: transactionType !== constActiveTransactionType,
        fromDateTimeUtc: startDate,
        toDateTimeUtc: endDate,
      }),
    }).then(response => response.json())
      .then((response) => {
        // eslint-disable-next-line no-console
        if (response.statusCode === 200) {
          this.setState({
            appliedLeaves: response.data.userAppliedLeaves,
            pageIndex: response.data.pageIndex || 1,
            pageSize: response.data.pageSize,
            totalRecords: response.data.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAppliedLeaves(transactionType));
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  // Handler for Select
  handleDropDown = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      }, () => this.getAppliedLeaves(this.state.transactionType),
    );
  };


  handleChange(event) {
    const { target } = event;
    const { name } = target;
    if (name === 'regionMessage') {
      this.setState({ [name]: target.value });
    }
  }
  
  // eslint-disable-next-line react/sort-comp
  renderleavelist() {
    return (
      (
        this.state.appliedLeaves.map(appliedLeavesData => (
          <div className="appliedLeaveOuterCard">
            <div className="appliedLeaveCard">
              <Row>
                <Col md={4}>
                  <h5> Vacation Category</h5>
                  <p>
                    {appliedLeavesData.parentLeaveTypeName}
                  </p>
                </Col>
                <Col md={4}>
                  <h5> Vacation Type </h5>
                  <p>
                    {appliedLeavesData.childLeaveTypeName}
                  </p>
                </Col>
                <Col md={4}>
                  <h5> No of Days </h5>
                  <p>
                    {appliedLeavesData.noOfDays}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <h5> Start Date </h5>
                  <p>
                    {appliedLeavesData.strFromDateTimeUtc && commonService.localizedDate(appliedLeavesData.strFromDateTimeUtc)}
                  </p>
                </Col>
                <Col md={4}>
                  <h5> End Date </h5>
                  <p>
                    {appliedLeavesData.StrToDateTimeUtc && commonService.localizedDate(appliedLeavesData.StrToDateTimeUtc)}
                  </p>
                </Col>
                <Col md={4}>
                  <h5> Applied by</h5>
                  <p>
                    {' '}
                    {appliedLeavesData.appliedByUser}
                    {' '}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <h5> Over Due </h5>
                  <p>
                    {appliedLeavesData.overDueApprovalDetails}
                  </p>
                </Col>

              </Row>
              <Col lg={12} className=" d-flex align-items-center justify-content-end mb-3">
                <Link
                  className="btn btn-primary"
                  to={`/vacation-management/my-vacation/applied-vacation/view-details/${appliedLeavesData.id},${appliedLeavesData.parentLeaveTypeId},${appliedLeavesData.userId}`}
                >
                  View Details
                </Link>
              </Col>
            </div>
          </div>

        ))
      )

    );
  }

  closeCalendar() {
    this.getAppliedLeaves(this.state.transactionType);
  }

  render() {
    const {
      reportingEmployee, employeesUnderManager,
      pageIndex, pageSize, totalRecords,
    } = this.state;

    const { t } = this.props;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card_layout leaveManagement manageLeave">
              <h2>
                {t('VacationRequest.leaveRequest')}
                {' '}
              </h2>
              <div className="row ">
              
                <div className="col-lg-1">  </div>
                <div className="col-lg-6">
                  <div className="row">
                    <div className="col-lg-6">
                      <label className="form-check-label customCheck mb-2">
                        {' '}
                        {t('VacationRequest.selectDateRange')}
                        {' '}
                      </label>
                      <DatePicker
                        range
                        onClose={() => this.closeCalendar()}
                        onChange={(array) => { // Array of Dateobjecs
                          this.setState({ dateRange: array });
                        }}
                        plugins={[
                          <DatePanel />,
                        ]}
                      />
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label" htmlFor={reportingEmployee}>{t('VacationRequest.selectEmployee')}</label>
                      <select
                        className="form-control"
                        name="reportingEmployee"
                        defaultValue={reportingEmployee}
                        onChange={this.handleDropDown}
                      >
                        <option value="0">{t('VacationRequest.searchText')}</option>
                        {
                          employeesUnderManager.map(usr => (
                            <option key={usr.id} value={usr.id}>
                              {usr.name}
                            </option>
                          ))}
                      </select>
                    </div>

                  </div>
                </div>

              </div>
              {this.renderleavelist(this.state.userList)}
              <br />
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
      </div>
    );
  }
}

export default withTranslation()(ManagerAbsence);
