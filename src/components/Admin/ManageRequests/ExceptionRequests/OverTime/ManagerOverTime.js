import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Multiselect } from 'multiselect-react-dropdown';
import {
  Row, Col, Button, Table, Modal, Form,
} from 'react-bootstrap';
import './style.scss';
import moment from 'moment';
import PaginationAndPageNumber from '../../../../shared/Pagination';
import ViewIcon from '../../../../../Images/Icons/Eye.svg';
import Api from '../../../../common/Api';
import { userService } from '../../../../../services';
import Loaders from '../../../../shared/Loaders';
import { commonService } from '../../../../../services/common.service';

const tableHeader = [
  {
    label: 'Sr.No',
  },
  {
    label: 'Employee Name',
  },
  {
    label: 'Applied On',
  },
  {
    label: 'Shift Date',
  },
  {
    label: 'Shift Label',
  },
  {
    label: 'Reason',
  },
  {
    label: 'Hours',
  },
  {
    label: 'Status',
  },
  {
    label: 'Actions',
  },
];

class ManagerOverTime extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    const statusId = props.location && props.location.state ? props.location.state.status : 0;
    const isShowOverdue = props.location && props.location.state && props.location.state.status;
    const date = new Date();

    this.state = {
      loaded: false,
      token: `${token}`,
      userId: `${userId}`,
      allOverTimeExceptions: [],
      pageSize: 10,
      pageIndex: 1,
      totalRecords: 0,
      startDate: isShowOverdue ? new Date(date.getFullYear(), date.getMonth(), 1) : null,
      endDate: isShowOverdue ? new Date(date.getFullYear(), date.getMonth() + 1, 0) : null,
      statusId,
      openNotes: false,
      changeNotes: '',
      pendingRequests: [],
      formErrors: {},
      noneSelected: false,
      employee: [],
      employeeIds: [],
      isShowOverdue,
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.handleFormValidation = this.handleFormValidation.bind(this);
  }

  componentDidMount() {
    this.getOvertimeEmployeeRequests();
    this.getEmployeeByManagerId();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getOvertimeEmployeeRequests();
    }
  }

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
        loaded: false,
      }, () => this.getOvertimeEmployeeRequests());
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: pageCount,
      pageIndex: 1,
      loaded: false,
    }, () => this.getOvertimeEmployeeRequests());
  }

  getEmployeeByManagerId = () => {
    const {
      token, userId,
    } = this.state;
    fetch(`${Api.manageEmp.getemployeebymanagerid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(userId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            employee: [].concat(response.data),
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmployeeByManagerId());
          });
        } else {
          alert(response.message);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  handleSelectEmployee = (selectedList) => {
    const { employeeIds } = this.state;
    selectedList.map(provider => (!employeeIds.includes(provider.id) ? employeeIds.push(provider.id) : ''));
    this.setState({ employeeIds }, () => {
      this.getOvertimeEmployeeRequests();
    });
  }

  handleRemoveEmployee = (selectedList, selectedItem) => {
    const { employeeIds } = this.state;
    if (employeeIds.includes(selectedItem.id)) {
      const index = employeeIds.indexOf(selectedItem.id);
      if (index !== -1) {
        employeeIds.splice(index, 1);
      }
      this.setState({ employeeIds }, () => {
        this.getOvertimeEmployeeRequests();
      });
    }
  }

  getOvertimeEmployeeRequests = () => {
    const {
      pageSize, pageIndex, token, statusId, userId, startDate, endDate, employeeIds, totalRecords,
    } = this.state;
    const apiEmployeeIds = employeeIds.join(',');

    const data = {
      languageId: 1,
      totalRecords,
      pageIndex: (pageSize) * (pageIndex - 1) + 1,
      pageSize,
      statusId: Number(statusId),
      userId: Number(userId),
      managerId: Number(userId),
      userIds: apiEmployeeIds,
      requestTypeId: 2,
      startDateTime: startDate,
      endDateTime: endDate,
    };

    fetch(`${Api.exceptionRequest.overTimeEmployee.getOverTimeRequest}`, {
      method: 'POST',
      headers: {
        token: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            loaded: true,
            allOverTimeExceptions: (response.data === null) ? [] : [].concat(response.data),
            pageIndex: Math.floor(response.pageIndex / response.pageSize) + 1 || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getOvertimeEmployeeRequests());
          });
        }
      });
  }

  openNotesModal = (e, checkClick) => {
    const {
      pendingRequests,
    } = this.state;
    if (pendingRequests.length > 0) {
      this.setState({
        openNotes: true,
        clickedAccept: checkClick,
      });
    } else {
      this.setState({
        noneSelected: true,
      });
    }
  }

  acceptRequest = () => {
    const {
      token, pendingRequests, userId, changeNotes, clickedAccept,
    } = this.state;

    const data = {
      languageId: 1,
      overTimeIds: pendingRequests.toString(),
      statusId: clickedAccept ? 30 : 20,
      userId: Number(userId),
      changeNotes,
    };

    if (this.handleFormValidation()) {
      fetch(`${Api.exceptionRequest.overTimeManager.acceptRejectOvertime}`, {
        method: 'POST',
        headers: {
          token: `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then(response => response.json())
        .then((response) => {
          if (response.statusCode === 200) {
            this.setState({
              loaded: false,
              pendingRequests: [],
              changeNotes: '',
            }, () => this.getOvertimeEmployeeRequests());
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.acceptRequest());
            });
          } else {
            alert(response.message);
          }
        })
        .catch(err => console.error(err.toString()));
    }
  }

  handleClose = () => {
    this.setState({
      openNotes: false,
      changeNotes: '',
      formErrors: {},
      noneSelected: false,
    });
  }

  handleCheckboxClick = (event, id) => {
    const { target } = event;
    const { type, checked } = target;
    const value = type === 'checkbox' ? checked : target.value;
    const { pendingRequests } = this.state;

    if (value) {
      pendingRequests.push(id);
    } else {
      const index = pendingRequests.indexOf(id);
      if (index > -1) {
        pendingRequests.splice(index, 1);
      }
    }

    this.setState({
      pendingRequests,
    });
  }

  handleFromDateChange(date) {
    this.setState({
      startDate: date,
    },
    () => this.getOvertimeEmployeeRequests());
  }

  handleToDateChange(date) {
    this.setState({
      endDate: date,
    },
    () => this.getOvertimeEmployeeRequests());
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, type, checked } = target;
    const value = type === 'checkbox' ? checked : target.value;
    this.setState({
      [name]: value,
    }, () => {
      if (name === 'statusId') {
        this.getOvertimeEmployeeRequests();
      }
    });
  }

  handleFormValidation() {
    const {
      changeNotes,
    } = this.state;

    const formErrors = {};
    let formIsValid = true;
    // Change Note
    if (!changeNotes) {
      formIsValid = false;
      formErrors.changeNotesError = 'Note Is Required';
    } else if (changeNotes.length > 250) {
      formIsValid = false;
      formErrors.changeNotesError = 'Maximum characters allowed is 250';
    }
    this.setState({ formErrors });
    return formIsValid;
  }

  render() {
    const {
      allOverTimeExceptions, pageIndex, pageSize, totalRecords, startDate, endDate, loaded,
      openNotes, formErrors, noneSelected, employee, statusId, isShowOverdue,
    } = this.state;
    const { t } = this.props;

    const {
      changeNotesError,
    } = formErrors;

    let counter = ((pageIndex - 1) * pageSize) + 1;
    return (
      <div className="container-fluid overTime">
        <div className="card_layout">
          <Row>
            <Col className="col-lg-3 col-md-6">
              <label
                htmlFor="status"
              >
                Status
              </label>
              <select
                className="form-control"
                name="statusId"
                value={statusId}
                onChange={event => this.handleInputChange(event)}
              >
                <option value="0">All</option>
                <option value="10">Pending</option>
                <option value="20">Rejected</option>
                <option value="30">Approved</option>
                <option value="40">Withdrawn</option>
              </select>
            </Col>

            <Col className="col-lg-12 col-xl-9">
              <label htmlFor="status">
                Employee
              </label>
              <Multiselect
                id="employeeIds"
                options={employee}
                displayValue="fullName"
                onSelect={this.handleSelectEmployee}
                onRemove={this.handleRemoveEmployee}
              />
            </Col>
            <Col className="col-lg-3 col-md-6">
              <label htmlFor="startDate">
                From
              </label>
              <DatePicker
                name="startDate"
                selected={startDate}
                onChange={this.handleFromDateChange}
                placeholderText={commonService.localizedDateFormat()}
                dateFormat={commonService.localizedDateFormatForPicker()}
                className="form-control cal_icon"
                pattern="\d{2}\/\d{2}/\d{4}"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                required
              />

            </Col>
            <Col className="col-lg-3 col-md-6">
              <label htmlFor="endDate">
                To
              </label>
              <DatePicker
                name="endDate"
                selected={endDate}
                onChange={this.handleToDateChange}
                placeholderText={commonService.localizedDateFormat()}
                dateFormat={commonService.localizedDateFormatForPicker()}
                className="form-control cal_icon"
                pattern="\d{2}\/\d{2}/\d{4}"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                required
              />
            </Col>
            <Col className="col-lg-3 col-md-6 acceptBtn">
              <Button className="overtimeBtn" onClick={e => this.openNotesModal(e, true)}>Accept</Button>
            </Col>
            <Col className="col-lg-3 col-md-6 acceptBtn">
              <Button className="overtimeBtn" onClick={e => this.openNotesModal(e, false)}>Reject</Button>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    {tableHeader.map(headerData => (
                      <th>{headerData.label}</th>
                    ))}
                    {isShowOverdue ? <th>Over Due</th> : null}

                  </tr>
                </thead>
                <tbody>

                  {loaded ? (
                    <>
                      {allOverTimeExceptions.map((tableTimeData, index) => (
                        <tr>
                          <td>
                            <div className="checkBtn">
                              {tableTimeData.statusId === 10 && (
                                <input type="checkbox" className="m-2" onChange={event => this.handleCheckboxClick(event, tableTimeData.id)} />
                              )}
                              {pageSize * (pageIndex - 1) + index + 1}
                            </div>
                          </td>
                          <td>
                            {tableTimeData.userName}
                          </td>
                          <td>
                            {tableTimeData.shiftStartDate ? commonService.localizedDate(tableTimeData.shiftStartDate) : ''}
                          </td>
                          <td>
                            {moment(tableTimeData.shiftStartDate).format('MM/DD/YYYY')}
                            {tableTimeData.shiftStartDate ? commonService.localizedDate(tableTimeData.shiftStartDate) : ''}
                          </td>
                          <td>
                            {tableTimeData.shiftTitle}
                          </td>
                          <td>
                            {tableTimeData.userNotes}
                          </td>
                          <td>
                            {(tableTimeData.overTimeInMinutes / 60)}
                          </td>
                          <td>
                            {tableTimeData.overTimeStatus}
                          </td>
                          <td>
                            <div>
                              <span>
                                <img
                                  className="pointer"
                                  src={ViewIcon}
                                  alt="View Icon"
                                />
                              </span>
                            </div>
                          </td>
                          {isShowOverdue ? <td className="max-width-150px">{tableTimeData.overDueApprovalDetails}</td> : null}

                        </tr>
                      ))}
                    </>
                  ) : (
                    <Loaders />
                  )
                  }

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
            </Col>
          </Row>
          {
            openNotes && (
              <Modal
                show={openNotes}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header />
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>
                        Note
                        <span className="mandatry">*</span>
                      </Form.Label>
                      <Form.Control name="changeNotes" as="textarea" onChange={event => this.handleInputChange(event)} />
                      {changeNotesError && <div className="validtionMessage">{changeNotesError}</div>
                      }
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={this.acceptRequest}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
            )
          }
          {
            noneSelected && (
              <Modal
                show={noneSelected}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Body>
                  Please select atleast one record
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    OK
                  </Button>
                </Modal.Footer>
              </Modal>
            )
          }
        </div>
      </div>
    );
  }
}

export default ManagerOverTime;
