import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Form, Button, Row, Table, Col, Modal,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import removeIcon from '../../../Images/Icons/remove.svg';
import checkedIcon from '../../../Images/Icons/checked.svg';

import LoadingSpinner from '../../shared/LoadingSpinner';
import '../EmployeeShift/style.scss';
import Api from '../../common/Api';
import { userService } from '../../../services';
import PaginationAndPageNumber from '../../shared/Pagination';
import { commonService } from '../../../services/common.service';


export class MagShiftApproval extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      token: `${token}`,
      userId,
      managerListdata: [],
      pageIndex: 1,
      totalRecords: 0,
      pageSize: 10,
      loaded: false,
      startDate: null,
      endDate: null,
      fromError: '',
      toError: '',
      emp: [],
      shiftIds: '',
      notes: '',
      showModel: false,
      noteModal: false,
      showModelReject: false,
      pendingRequests: [],
      formErrors: {},
      employeesId: 0,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.searchFunc = this.searchFunc.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.handleFormValidation = this.handleFormValidation.bind(this);
  }

  componentDidMount() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getMngShifApprovalListing();
      this.getEmployeeByManagerId();
    }
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getMngShifApprovalListing();
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

  handleClose = () => {
    this.setState({
      showModel: false,
      showModelReject: false,
      noteModal: false,
      notes: '',
      formErrors: {},
    });
  }

  getEmployeeByManagerId = () => {
    const {
      token, modelMessage, userId,
    } = this.state;
    fetch(`${Api.manageEmp.getemployeebymanagerid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ languageId: 1, id: parseInt(userId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            emp: response.data,
            loaded: true,
            pageIndex: response.pageIndex || 1,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmployeeByManagerId());
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
            loaded: true,
            emp: [],
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getMngShifApprovalListing = () => {
    const {
      token, userId, startDate, endDate, pageIndex, pageSize, employeesId,
    } = this.state;
    const data = {
      languageId: 1,
      requestTypeId: 2,
      pageIndex,
      pageSize,
      managerId: userId,
      userId: parseInt(employeesId, 10),
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
            managerListdata: response.data,
            loaded: true,
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getMngShifApprovalListing());
          });
        } else if (response.data === null) {
          this.setState({
            managerListdata: [],
            loaded: true,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getRejectShiftApproval = () => {
    const {
      showModelReject,
      token, userId, notes, shiftIds,
    } = this.state;
    if (this.handleFormValidation()) {
      this.setState({
        noteModal: false,
        notes: '',
      });
      const data = {
        languageId: 1,
        shiftIds,
        statusId: 20,
        managerId: userId,
        notes,
      };
      fetch(`${Api.shift.getAcceptRejectShiftApproval}`, {
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
              showModelReject: !showModelReject,
              loaded: false,
            }, () => this.getMngShifApprovalListing());
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.getRejectShiftApproval());
            });
          } else {
            alert(response.message);
          }
        });
    }
  }

  noteModal = (id) => {
    this.setState({
      noteModal: true,
      shiftIds: id.toString(),

    });
  }

  getAcceptShiftApproval = (id) => {
    const {
      token, userId, notes, showModel, pendingRequests, shiftIds,
    } = this.state;

    const data = {
      languageId: 1,
      shiftIds: shiftIds ? pendingRequests.toString() : id.toString(),
      statusId: 30,
      managerId: userId,
      notes,
    };
    fetch(`${Api.shift.getAcceptRejectShiftApproval}`, {
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
            showModel: !showModel,
            loaded: false,
            pendingRequests: [],
          }, () => this.getMngShifApprovalListing());
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAcceptShiftApproval(id));
          });
        } else {
          alert(response.message);
        }
      });
  }


  handleInputChange = (event) => {
    const { target } = event;
    const { name, value } = target;
    this.setState({
      [name]: value,
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
  }


  handleFormValidation() {
    const {
      notes,
    } = this.state;

    const formErrors = {};
    let formIsValid = true;
    // note
    if (!notes) {
      formIsValid = false;
      formErrors.noteError = 'Note is required';
    } else if (notes.length > 250) {
      formIsValid = false;
      formErrors.noteError = 'Maximum character length is 250';
    }
    this.setState({ formErrors });
    return formIsValid;
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
      managerListdata, pageSize, totalRecords, pageIndex, fromError, toError, formErrors,
      startDate, endDate, emp, employeesId, showModel, showModelReject, noteModal, loaded,
    } = this.state;
    const {
      noteError,
    } = formErrors;
    let counter = 1;
    const { t } = this.props;
    return (


      <div className="container-fluid shift-Approval">
        <div className="card_layout">
          <Row className="">
            <Col md={2}>
              <Form.Group>
                <Form.Label>{t('VacationRequest.selectEmployee')}</Form.Label>
                <Form.Control
                  as="select"
                  name="employeesId"
                  value={employeesId}
                  onChange={event => this.handleInputChange(event)}
                >
                  <option value="0">All</option>
                  {emp
                    && emp.map((data, index) => (
                      <option key={index} value={data.id}>
                        {data.fullName}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
            </Col>
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

            <Col md={2} className="mr-4">
              <Button
                size="sm"
                className="btn btn-primary searchBtn"
                onClick={this.searchFunc}
              >
                {t('SearchBtn')}
              </Button>
            </Col>

            <Col md={2}>
              <Button
                size="sm"
                className="btn btn-primary searchBtn"
                onClick={this.getAcceptShiftApproval}
              >
                {t('ManagerShiftPage.AcceptBulk')}
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
                        {/* <th name="">
                          <label>
                            <input type="checkbox" />
                          </label>
          </th> */}

                        <th>{t('SrNo')}</th>
                        <th>{t('EmployeeNameText')}</th>
                        <th>{t('ScheduleNameText')}</th>
                        <th>{t('ShiftApproval.Shiftlabel')}</th>
                        <th>{t('ShiftApproval.PlannedST')}</th>
                        <th>{t('ShiftApproval.PlannedET')}</th>
                        <th>{t('ShiftApproval.ActualST')}</th>
                        <th>{t('ShiftApproval.ActualET')}</th>
                        <th>{t('ShiftApproval.ReqHours')}</th>
                        <th>{t('ShiftApproval.ActHours')}</th>
                        <th>{t('leavRequestPage.reason')}</th>
                        <th>{t('EndDate')}</th>
                        <th>{t('Status')}</th>
                        <th>{t('Action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {managerListdata.map(data => (
                        <tr>
                          <td
                            className="checkbox"
                            name="checkbox"
                            unchecked
                            onClick={event => this.handleCheckboxClick(event, data.id)}
                          >
                            {data.statusId === 10
                              && (
                                <label className="shiftCheckbox">
                                  <input type="checkbox" />
                                </label>
                              )}
                            {counter++}
                          </td>
                          <td>{data.employeeName}</td>
                          <td>{data.scheduleTitle}</td>
                          <td>{data.shiftLabel}</td>
                          <td>{data.plannedStartDateTime && commonService.localizedDate(data.plannedStartDateTime)}</td>
                          <td>{data.plannedEndDateTime && commonService.localizedDate(data.plannedEndDateTime)}</td>
                          <td>{data.actualStartDateTime && commonService.localizedDate(data.actualStartDateTime)}</td>
                          <td>{data.actualEndDateTime && commonService.localizedDate(data.actualEndDateTime)}</td>
                          <td>{data.requiredHours}</td>
                          <td>{data.actualHours}</td>
                          <td>{data.notes}</td>
                          <td>{data.endDate && commonService.localizedDate(data.endDate)}</td>
                          <td>{data.status}</td>
                          <td className="td-action">
                            {data.statusId === 10
                              && (
                                <div className="action">
                                  <span className="action-icon view danger-bg p-2">
                                    <img
                                      src={checkedIcon}
                                      alt="Checked Icon"
                                      onClick={() => this.getAcceptShiftApproval(data.id)}
                                      disabled={data.statusId !== 10}
                                    />
                                  </span>
                                  <span className="action-icon edit primary-bg p-2">
                                    <img
                                      src={removeIcon}
                                      alt="Remove Icon"
                                      onClick={() => this.noteModal(data.id)}
                                      disabled={data.statusId !== 10}
                                    />
                                  </span>
                                </div>
                              )}

                          </td>
                        </tr>
                      ))}
                      <tr />
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
          {
            showModel && (
              <Modal
                show={showModel}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Body>
                  Shift Request accepted successfully
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    OK
                  </Button>
                </Modal.Footer>
              </Modal>
            )
          }
          {
            showModelReject && (
              <Modal
                show={showModelReject}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Body>
                  Shift Request rejected successfully
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    OK
                  </Button>
                </Modal.Footer>
              </Modal>
            )
          }
          {
            noteModal && (
              <Modal
                show={noteModal}
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
                      <Form.Control name="notes" as="textarea" onChange={event => this.handleInputChange(event)} />
                      {noteError && <div className="validtionMessage">{noteError}</div>
                      }
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={this.getRejectShiftApproval}>
                    Submit
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

export default withTranslation()(MagShiftApproval);
