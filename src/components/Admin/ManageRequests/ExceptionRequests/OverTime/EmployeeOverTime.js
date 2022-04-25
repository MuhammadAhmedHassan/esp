import React, { Component } from 'react';
import {
  Row, Col, Button, Table, Modal, Form, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';
import moment from 'moment';
import PaginationAndPageNumber from '../../../../shared/Pagination';
import ViewIcon from '../../../../../Images/Icons/Eye.svg';
import EditIcon from '../../../../../Images/Icons/Edit.svg';
import WithdrawIcon from '../../../../../Images/Icons/withdraw.svg';
import Api from '../../../../common/Api';
import { userService } from '../../../../../services';
import Loaders from '../../../../shared/Loaders';
import { commonService } from '../../../../../services/common.service';

const tableHeader = [
  {
    label: 'Sr.No',
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
    label: 'Line Manager',
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

class EmpOverTime extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      loaded: false,
      isModal: false,
      token: `${token}`,
      userId: `${userId}`,
      allOverTimeExceptions: [],
      pageSize: 10,
      pageIndex: 1,
      totalRecords: 10,
      statusId: 0,
      shiftDate: null,
      allShifts: [],
      overTimeInMinutes: null,
      overTimeInHours: null,
      userNotes: '',
      successModal: false,
      successMessage: '',
      viewModal: false,
      withdrawModal: false,
      widthdrawMessage: '',
      withdrawSuccessModal: false,
      viewshiftDate: null,
      isShiftRequired: false,
      isTimeRequired: false,
      isReasonRequired: false,
      isShiftDate: false,
      currentTime: new Date(),
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    // this.handleFormValidation = this.handleFormValidation.bind(this);
  }

  componentDidMount() {
    this.getOvertimeEmployeeRequests();
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
      });
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: pageCount,
      pageIndex: 1,
      loaded: false,
    });
  }

  getOvertimeEmployeeRequests = () => {
    const {
      pageSize, pageIndex, token, statusId, userId,
    } = this.state;

    const data = {
      languageId: 1,
      pageIndex: Number(pageIndex),
      pageSize: Number(pageSize),
      statusId: Number(statusId),
      userId: Number(userId),
      requestTypeId: 1,
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
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getOvertimeEmployeeRequests());
          });
        } else {
          this.setState({
            isModal: false,
            successModal: true,
            successMessage: response.message,
          });
        }
      });
  }

  getShiftByDate = () => {
    const {
      token, shiftDate, userId, viewshiftDate,
    } = this.state;

    const data = {
      languageId: 1,
      // id: Number(userId),
      userId: Number(userId),
      date: shiftDate !== null ? shiftDate : viewshiftDate,
    };

    fetch(`${Api.exceptionRequest.overTimeEmployee.getShiftByDate}`, {
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
            allShifts: (response.data === null) ? [] : [].concat(response.data),
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getShiftByDate());
          });
        } else {
          this.setState({
            isModal: false,
            successModal: true,
            successMessage: response.message,
          });
        }
      });
  }

  handleSubmit = () => {
    const {
      token, userId, overTimeInMinutes, overTimeInHours, userNotes, shiftTypeId, shiftDate,
    } = this.state;
    
   
    if (shiftDate && overTimeInMinutes && userId && overTimeInHours && userNotes && shiftTypeId) {
      const data = {
        languageId: 1,
        userId: Number(userId),
        overTimeInHours: Number(overTimeInHours),
        overTimeInMinutes: Number(overTimeInMinutes),
        userNotes,
        shiftRecurrenceId: Number(shiftTypeId),
        requestTypeId: 3,
      };

      fetch(`${Api.exceptionRequest.overTimeEmployee.applyOvertime}`, {
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
              isModal: false,
              successModal: true,
              successMessage: response.message,
            }, () => {
              this.getOvertimeEmployeeRequests();
            });
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.handleSubmit());
            });
          } else {
            this.setState({
              isModal: false,
              successModal: true,
              successMessage: response.message,
            });
          }
        });
    } else {
      this.setState({
        isShiftDate: !shiftDate,
        isShiftRequired: !shiftTypeId,
        isTimeRequired: (overTimeInMinutes % 1 !== 0 || overTimeInMinutes < 0 || overTimeInMinutes > 60 || overTimeInMinutes === null) && (overTimeInHours % 1 !== 0 || overTimeInHours < 0 || overTimeInHours > 24 || overTimeInHours === null),
        isReasonRequired: !userNotes,
      });
    }
  }

  handleUpdate = () => {
    const {
      token, userId, selectedId, shiftDate,
      overTimeInMinutes, overTimeInHours, userNotes, shiftTypeId,
    } = this.state;
    if (overTimeInHours && overTimeInMinutes && userId && shiftTypeId && selectedId && userNotes) {
      const data = {
        languageId: 1,
        userId: Number(userId),
        overTimeInHours: Number(overTimeInHours),
        overTimeInMinutes: Number(overTimeInMinutes),
        userNotes,
        shiftRecurrenceId: Number(shiftTypeId),
        id: Number(selectedId),
      };

      fetch(`${Api.exceptionRequest.overTimeEmployee.updateOvertime}`, {
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
              successModal: true,
              successMessage: response.message,
            }, () => {
              this.getOvertimeEmployeeRequests();
            });
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.handleUpdate());
            });
          } else {
            this.setState({
              isModal: false,
              successModal: true,
              successMessage: response.message,
            });
          }
        });
    } else {
      this.setState({
        isShiftDate: !shiftDate,
        isShiftRequired: !shiftTypeId,
        isTimeRequired: (overTimeInMinutes % 1 !== 0 || overTimeInMinutes < 0 || overTimeInMinutes > 60) && (overTimeInHours % 1 !== 0 || overTimeInHours < 0 || overTimeInHours < 24),
        isReasonRequired: !userNotes,
      });
    }
  }


  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );


  getShiftRequest = (id, isViewMode) => {
    const {
      token,
    } = this.state;

    this.setState({
      isViewMode,
      selectedId: id,
    });

    const data = {
      languageId: 1,
      id: Number(id),
    };

    fetch(`${Api.exceptionRequest.overTimeEmployee.getById}`, {
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
            viewModal: true,
            shiftDate: response.data.selectedDate,
            overTimeInHours: response.data.hours,
            overTimeInMinutes: response.data.minutes,
            userNotes: response.data.notes,
            shiftTypeId: response.data.shiftId,
          }, () => {
            this.getShiftByDate();
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getShiftRequest(id, isViewMode));
          });
        } else {
          this.setState({
            isModal: false,
            successModal: true,
            successMessage: response.message,
          });
        }
      });
  }

  handleClose = () => {
    this.setState({
      isModal: false,
      successModal: false,
      successMessage: '',
      overTimeInMinutes: '',
      overTimeInHours: '',
      userNotes: '',
      shiftTypeId: null,
      shiftDate: null,
      viewModal: false,
      withdrawModal: false,
      withdrawSuccessModal: false,
      notes: '',
      viewshiftDate: null,
    });
  };

  handleApplyOvertime = () => {
    const { isModal } = this.state;
    this.setState({
      isModal: !isModal,
    });
  }

  openWithdrawModal = (id) => {
    this.setState({
      withdrawModal: true,
      withdrawId: id,
    });
  }

  handleWithdraw = () => {
    const {
      token, withdrawId, userId, note,
    } = this.state;

    const data = {
      languageId: 1,
      id: Number(withdrawId),
      userId: Number(userId),
      changeNotes: note,
    };

    fetch(`${Api.exceptionRequest.overTimeEmployee.withDrawRequest}`, {
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
            withdrawModal: false,
            withdrawSuccessModal: true,
            widthdrawMessage: response.message,
          }, () => {
            this.getOvertimeEmployeeRequests();
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.handleWithdraw());
          });
        } else {
          this.setState({
            isModal: false,
            successModal: true,
            successMessage: response.message,
          });
        }
      });
  }

  handleFromDateChange(date) {
    this.setState({
      shiftDate: date,
      isShiftDate: false,
    },
    () => this.getShiftByDate());
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

  handleShiftChange(event) {
    this.setState({
      shiftTypeId: event.target.value,
      isShiftRequired: false,
    });
  }

  handleOverTimeInMinutes(event) {
    this.setState({
      overTimeInMinutes: event.target.value,
      isTimeRequired: false,
    });
  }

  handleOverTimeInHours(event) {
    this.setState({
      overTimeInHours: event.target.value,
      isTimeRequired: false,
    });
  }

  handleUserNotes(event) {
    this.setState({
      userNotes: event.target.value,
      isReasonRequired: false,
    });
  }

  render() {
    const {
      isModal, allOverTimeExceptions, pageSize, pageIndex, totalRecords, loaded,
      shiftDate, allShifts, successModal, successMessage, viewModal, isViewMode, withdrawModal,
      withdrawSuccessModal, widthdrawMessage, isReasonRequired, isTimeRequired, isShiftRequired, isShiftDate,
      overTimeInMinutes, overTimeInHours, userNotes, shiftTypeId, currentTime,
    } = this.state;
    let counter = ((pageIndex - 1) * pageSize) + 1;
    return (
      <div className="container-fluid overTime">
        <div className="card_layout">
          <Row className="justify-content-end align-items-center">
            <div className="px-3">
              <Button
                className="overtimeBtn"
                onClick={this.handleApplyOvertime}
              >
                Apply
              </Button>
            </div>
            <div className="d-flex px-3">
              <label
                className="overtimeLabel"
                htmlFor="statusId"
              >
                Status
              </label>
              <select
                className="form-control overtimeInput mb-0"
                name="statusId"
                onChange={event => this.handleInputChange(event)}
              >
                <option value="0">All</option>
                <option value="10">Pending</option>
                <option value="20">Rejected</option>
                <option value="30">Approved</option>
                <option value="40">Withdrawn</option>
              </select>
            </div>
          </Row>
          <Row className="mt-3">
            <Col>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    {tableHeader.map(headerData => (
                      <th>{headerData.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loaded ? (
                    <>
                      {allOverTimeExceptions.map(tableTimeData => (
                        <tr>
                          <td>
                            {counter++}
                          </td>
                          <td>
                            {tableTimeData.createdOnUtc ? commonService.localizedDate(tableTimeData.createdOnUtc) : ''}
                          </td>
                          <td>
                            {tableTimeData.shiftStartDate ? commonService.localizedDate(tableTimeData.shiftStartDate) : ''}
                          </td>
                          <td>
                            {tableTimeData.shiftTitle}
                          </td>
                          <td>
                            {tableTimeData.shiftManagerName}
                          </td>
                          <td>
                            {tableTimeData.userNotes}
                          </td>
                          <td>
                            {(tableTimeData.overTimeInMinutes / 60).toFixed(2)}
                          </td>
                          <td>
                            {tableTimeData.overTimeStatus}
                          </td>
                          <td>
                            <div>
                              <span>

                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 40 }}
                                  overlay={this.renderTooltip('View')}
                                >
                                  <img
                                    className="pointer"
                                    src={ViewIcon}
                                    alt="View Icon"
                                    onClick={() => this.getShiftRequest(tableTimeData.id, true)}
                                  />
                                </OverlayTrigger>
                              </span>
                              {tableTimeData.statusId === 10 && (
                                <>
                                  <span>

                                    <OverlayTrigger
                                      placement="top"
                                      delay={{ show: 50, hide: 40 }}
                                      overlay={this.renderTooltip('Edit')}
                                    >
                                      <img
                                        className="pointer"
                                        src={EditIcon}
                                        alt="Edit Icon"
                                        onClick={() => this.getShiftRequest(tableTimeData.id, false)}
                                      />
                                    </OverlayTrigger>
                                  </span>
                                  <span>
                                    <OverlayTrigger
                                      placement="top"
                                      delay={{ show: 50, hide: 40 }}
                                      overlay={this.renderTooltip('WithdrawIcon')}
                                    >
                                      <img
                                        className="pointer"
                                        src={WithdrawIcon}
                                        alt="Edit Icon"
                                        onClick={() => this.openWithdrawModal(tableTimeData.id)}
                                      />
                                    </OverlayTrigger>
                                    
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <Loaders />
                  )}

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

        </div>
        {
          isModal && (
            <Modal
              show={isModal}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
              className="applyOvertimeModel"
            >
              <Modal.Header closeButton />
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <label className="form-label px-3" htmlFor={shiftDate}>
                      Select Date
                      {' '}
                      <span className="text-danger star">*</span>
                    </label>
                    <Col>
                      <DatePicker
                        name="shiftDate"
                        minDate={new Date(currentTime.getFullYear(), currentTime.getMonth(), 1)}
                        maxDate={new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0)}
                        selected={shiftDate}
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
                      {isShiftDate && <p className="text-danger validation_message">Shift date required</p>}
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="px-3">
                      Select Shift
                      {' '}
                      <span className="text-danger star">*</span>
                    </Form.Label>
                    <Col md={12}>
                      <Form.Control as="select" name="shiftTypeId" onChange={event => this.handleShiftChange(event)}>
                        {shiftDate === null ? (
                          <option>Please Select Shift</option>
                        ) : (
                          <>
                            <option value={0}>All</option>
                            {
                              allShifts.map(data => <option value={data.id}>{data.title}</option>)
                            }
                          </>
                        )}
                      </Form.Control>
                      {isShiftRequired && <p className="text-danger validation_message">Shift change required</p>}
                    </Col>
                  </Form.Group>
                  <Row>
                    <Col md={12} className="d-flex">
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="px-3">
                          Select Hours
                          {' '}
                          <span className="text-danger star">*</span>
                        </Form.Label>
                        <Col>
                          <Form.Control type="Number" name="overTimeInHours" placeholder="" onChange={event => this.handleOverTimeInHours(event)} />
                          {isTimeRequired && <p className="text-danger validation_message">Hours required</p>}
                        </Col>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="px-3">
                          Select Minutes
                          {' '}
                          <span className="text-danger star">*</span>
                        </Form.Label>
                        <Col>
                          <Form.Control type="Number" name="overTimeInMinutes" placeholder="" onChange={event => this.handleOverTimeInMinutes(event)} />
                          {' '}
                          {isTimeRequired && <p className="text-danger validation_message">Minutes required</p>}
                        </Col>
                      </Form.Group>
                    </Col>

                  </Row>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="px-3">
                      Reason
                      {' '}
                      <span className="text-danger star">*</span>
                    </Form.Label>
                    <Col md={12}>
                      <Form.Control as="textarea" name="userNotes" maxLength="250" placeholder="Reason" onChange={event => (this.handleUserNotes(event))} />
                      {isReasonRequired && <p className="text-danger validation_message">Notes required</p>}
                    </Col>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                  Send
                </Button>
                <Button variant="secondary" onClick={this.handleClose}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>
          )
        }
        {
          successModal && (
            <Modal
              show={successModal}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Body>
                {successMessage}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={this.handleClose}>
                  OK
                </Button>
              </Modal.Footer>
            </Modal>
          )
        }
        {
          viewModal && (
            <Modal
              show={viewModal}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
              className="applyOvertimeModel"
            >
              <Modal.Header closeButton />
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <label className="form-label px-3" htmlFor={shiftDate}>
                      Select Date
                      <span className="text-danger star">*</span>
                    </label>
                    <Col>
                      <DatePicker
                        name="viewshiftDate"
                        value={moment(shiftDate).format('MM/DD/YYYY')}
                        onChange={this.handleFromDateChange}
                        placeholderText={commonService.localizedDateFormat()}
                        dateFormat={commonService.localizedDateFormatForPicker()}
                        className="form-control cal_icon"
                        pattern="\d{2}\/\d{2}/\d{4}"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        required
                        disabled={isViewMode}
                      />
                    </Col>
                    {isShiftDate && <p className="text-danger validation_message">Shift date required</p>}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="px-3">
                      Select Shift
                      {' '}
                      <span className="text-danger star">*</span>
                    </Form.Label>
                    <Col md={12}>
                      <Form.Control as="select" value={shiftTypeId} name="shiftTypeId" onChange={event => this.handleShiftChange(event)} disabled>
                        {shiftDate === null ? (
                          <option>Please Select Shift</option>
                        ) : (
                          <>
                            <option value={0}>All</option>
                            {
                              allShifts.map(data => <option value={data.id}>{data.title}</option>)
                            }
                          </>
                        )}
                      </Form.Control>
                      {isShiftRequired && <p className="text-danger validation_message">Shift change required</p>}
                    </Col>
                  </Form.Group>
                  <Row>
                    <Col md={12} className="d-flex">
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="px-3">
                          Select Hours
                          {' '}
                          <span className="text-danger star">*</span>
                        </Form.Label>
                        <Col>
                          <Form.Control type="Number" value={overTimeInHours} name="overTimeInHours" placeholder="" onChange={event => this.handleOverTimeInHours(event)} disabled={isViewMode} />
                          {isTimeRequired && <p className="text-danger validation_message">Hours required</p>}
                        </Col>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="px-3">
                          Select Minutes
                          {' '}
                          <span className="text-danger star">*</span>
                        </Form.Label>
                        <Col>
                          <Form.Control type="Number" name="overTimeInMinutes" value={overTimeInMinutes} placeholder="" onChange={event => this.handleOverTimeInMinutes(event)} disabled={isViewMode} />
                          {isTimeRequired && <p className="text-danger validation_message">Minute required</p>}
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="px-3">
                      Reason
                      {' '}
                      <span className="text-danger star">*</span>
                    </Form.Label>
                    <Col md={12}>
                      <Form.Control as="textarea" name="userNotes" maxLength="250" value={userNotes} placeholder="Reason" onChange={event => this.handleUserNotes(event)} disabled={isViewMode} />
                      {isReasonRequired && <p className="text-danger validation_message">Notes required</p>}
                    </Col>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                {isViewMode ? (
                  <Button variant="primary" onClick={this.handleClose}>
                    OK
                  </Button>
                ) : (
                  <>
                    <Button variant="primary" type="submit" onClick={this.handleUpdate}>
                      Send
                    </Button>
                    <Button variant="secondary" onClick={this.handleClose}>
                      Cancel
                    </Button>
                  </>
                )}
              </Modal.Footer>
            </Modal>
          )
        }
        {
          withdrawModal && (
            <Modal
              show={withdrawModal}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header />
              <Modal.Body>
                <h3>
                  Are you sure
                </h3>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={this.handleWithdraw}>
                  Withdraw
                </Button>
              </Modal.Footer>
            </Modal>
          )
        }
        {
          withdrawSuccessModal && (
            <Modal
              show={withdrawSuccessModal}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Body>
                {widthdrawMessage}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={this.handleClose}>
                  OK
                </Button>
              </Modal.Footer>
            </Modal>
          )
        }
      </div>

    );
  }
}

export default EmpOverTime;
