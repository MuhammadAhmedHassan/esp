import React from 'react';
import {
  Form, Card, Button, Table, Accordion, Modal, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './delegation.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import api from '../../common/Api';
import { userService } from '../../../services';
import ViewDelegation from '../../../Images/Icons/view-delegation.svg';
import EditDelegation from '../../../Images/Icons/Edit.svg';
import DeleteDelegation from '../../../Images/Icons/delete.svg';
import PaginationAndPageNumber from '../../shared/Pagination/index';
import Loaders from '../../shared/Loaders';
import { commonService } from '../../../services/common.service';

const tableHeader = [
  {
    label: 'User',
  },
  {
    label: 'Designation',
  },
  {
    label: 'Start Date',
  },
  {
    label: 'End Date',
  },
  {
    label: 'Actions',
  },
];

const { impersonationSubject } = userService;
let impersentSubscriber;
class AddDelegators extends React.Component {
  constructor(props) {
    super(props);
    const user = userService.getUser();
    const token = userService.getToken();
    this.state = {
      token: `${token}`,
      user,
      languageId: 1,
      impersonateeId: 0,
      startDate: null,
      endDate: null,
      impersonatorId: 0,
      deptManagers: [],
      recentDelegatorList: [],
      historyList: [],
      recentPageIndex: 1,
      recentPageSize: 10,
      recentTotalRecords: 0,
      historyPageIndex: 1,
      historyPageSize: 10,
      historyTotalRecords: 0,
      showModal: false,
      showEditModal: false,
      showDeleteModal: false,
      editRowData: {},
      deleteId: '',
      modalMessage: '',
      recentLoaded: false,
      historyLoaded: false,
      recentError: false,
      historyError: false,
      formErrors: {},
      isImpersenating: false,
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  componentDidMount() {
    impersentSubscriber = impersonationSubject.subscribe((val) => {
      this.setState({ isImpersenating: val.showName });
      this.getFormData();
    });
  }

  componentWillUnmount() {
    if (impersentSubscriber) {
      impersentSubscriber.unsubscribe();
    }
  }

  getFormData = async () => {
    await this.getSameDepartmentManagers();
    await this.getRecentDelegatorList();
    await this.getHistoryList();
  }

  componentDidUpdate() {
    const { recentLoaded, historyLoaded } = this.state;
    if (!recentLoaded) {
      this.getRecentDelegatorList();
    }
    if (!historyLoaded) {
      this.getHistoryList();
    }
  }

  getRecentDelegatorList = () => {
    const {
      languageId, user, recentPageIndex, recentPageSize, token,
    } = this.state;

    const data = {
      languageId,
      offset: '',
      role: '',
      isActive: true,
      roleIds: '',
      publicKey: '',
      pageIndex: recentPageIndex,
      pageSize: recentPageSize,
      userId: user.userId,
      requestTypeId: 1,
    };

    fetch(`${api.delegation.search}`, {
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
            recentLoaded: true,
            recentError: false,
            recentDelegatorList: response.data,
            recentPageIndex: response.pageIndex || 1,
            recentPageSize: response.pageSize,
            recentTotalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getRecentDelegatorList());
          });
        } else {
          this.setState({
            recentError: true,
            recentLoaded: true,
            recentDelegatorLists: [],
          });
        }
      });
  }

  getHistoryList = () => {
    const {
      languageId, user, historyPageIndex, historyPageSize, token,
    } = this.state;

    const data = {
      languageId,
      offset: '',
      role: '',
      isActive: true,
      roleIds: '',
      publicKey: '',
      pageIndex: historyPageIndex,
      pageSize: historyPageSize,
      userId: user.userId,
      requestTypeId: 2,
    };

    fetch(`${api.delegation.search}`, {
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
            historyLoaded: true,
            historyError: false,
            historyList: response.data,
            historyPageIndex: response.pageIndex || 1,
            historyPageSize: response.pageSize,
            historyTotalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getHistoryList());
          });
        } else {
          this.setState({
            historyError: true,
            historyLoaded: true,
            historyList: [],

          });
        }
      });
  }

  getSameDepartmentManagers = () => {
    const {
      languageId, user, token,
    } = this.state;

    const data = {
      languageId,
      id: user.userId,
    };

    fetch(`${api.getSameDepartmentManagers}`, {
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
            deptManagers: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getSameDepartmentManagers());
          });
        }
      });
  }

  handleSubmit = () => {
    const {
      impersonatorId, startDate, endDate, user, languageId, token,
    } = this.state;

    const data = {
      languageId,
      impersonatorId: parseInt(impersonatorId, 10),
      impersonateeId: user.userId,
      startDateTime: startDate,
      endDateTime: endDate,
      createdUpdatedByUserId: user.userId,
    };
    if (this.handleFormValidation()) {
      fetch(`${api.delegation.insertImpersonate}`, {
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
              showModal: true,
              modalMessage: response.message,
            });
            this.clearData();
            this.getRecentDelegatorList();
            this.getHistoryList();
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.handleSubmit());
            });
          } else {
            this.setState({
              showModal: true,
              modalMessage: response.message,
            });
          }
        });
    }
  }

  handleFormValidation() {
    const {
      impersonatorId, startDate, endDate,
    } = this.state;

    const formErrors = {};
    let formIsValid = true;

    if (impersonatorId <= 0) {
      formIsValid = false;
      formErrors.impersonatorIdError = 'Impersonator is Required';
    }
    if (startDate === null || startDate === '') {
      formIsValid = false;
      formErrors.startDateError = 'Start Date is Required';
    }
    if (endDate === null || endDate === '') {
      formIsValid = false;
      formErrors.endDateError = 'End Date is Required';
    } else if (endDate !== null && startDate !== null) {
      if ((Date.parse(endDate) < Date.parse(startDate))) {
        formIsValid = false;
        formErrors.endDateError = 'End Date cannot be less than Start Date';
      }
    }
    this.setState({ formErrors });
    return formIsValid;
  }

  handleUpdate = (impersonatorId, impersonateeId, id) => {
    const {
      editStartDate, editEndDate, user, languageId, token,
    } = this.state;

    const data = {
      languageId,
      impersonatorId: Number(impersonatorId),
      id: Number(id),
      impersonateeId: Number(impersonateeId),
      startDateTime: editStartDate,
      endDateTime: editEndDate,
      createdUpdatedByUserId: user.userId,
    };
    if (this.handleEditFormValidation()) {
      fetch(`${api.delegation.insertImpersonate}`, {
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
              showEditModal: false,
              showModal: true,
              modalMessage: response.message,
            });
            this.clearData();
            this.getRecentDelegatorList();
            this.getHistoryList();
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.handleUpdate(impersonatorId, impersonateeId, id));
            });
          } else {
            this.setState({
              showEditModal: false,
              showModal: true,
              modalMessage: response.message,
            });
          }
        });
    }
  }


  handleEditFormValidation() {
    const {
      editStartDate, editEndDate,
    } = this.state;

    const formErrors = {};
    let formIsValid = true;

    
    if (editStartDate === null || editEndDate === '') {
      formIsValid = false;
      formErrors.editStartDateError = 'Start Date is Required';
    }
    if (editEndDate === null || editEndDate === '') {
      formIsValid = false;
      formErrors.editEndDateError = 'End Date is Required';
    } else if (editEndDate !== null && editStartDate !== null) {
      if ((Date.parse(editEndDate) < Date.parse(editStartDate))) {
        formIsValid = false;
        formErrors.editEndDateError = 'End Date cannot be less than Start Date';
      }
    }
    this.setState({ formErrors });
    return formIsValid;
  }

  handleDelete = () => {
    const {
      deleteId, user, languageId, token,
    } = this.state;

    const data = {
      languageId,
      id: Number(deleteId),
      updatedByUserId: user.userId,
    };
    fetch(`${api.delegation.delete}`, {
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
            showDeleteModal: false,
            showModal: true,
            modalMessage: response.message,
          });
          this.clearData();
          this.getRecentDelegatorList();
          this.getHistoryList();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.handleDelete());
          });
        } else {
          this.setState({
            showDeleteModal: false,
            showModal: true,
            modalMessage: response.message,
          });
        }
      });
  }


  clearData() {
    this.setState({
      impersonatorId: 0,
      startDate: '',
      endDate: '',
    });
  }

  handleCancel = () => {
    this.clearData();
    this.setState({ formErrors: {} });
  }

  updateRecentPageCount = (pageCount) => {
    this.setState({
      recentPageSize: parseInt(pageCount, 10),
      recentPageIndex: 1,
      recentLoaded: false,
    });
  }

  updateRecentPageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        recentPageIndex: pageNum,
        recentLoaded: false,
      });
    }
  }

  updateHistoryPageCount = (pageCount) => {
    this.setState({
      historyPageSize: parseInt(pageCount, 10),
      historyPageIndex: 1,
      historyLoaded: false,
    });
  }

  updateHistoryPageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        historyPageIndex: pageNum,
        historyLoaded: false,
      });
    }
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, type, checked } = target;
    const value = type === 'checkbox' ? checked : target.value;
    this.setState({
      [name]: value,
    });
  }

  handleStartDateChange(date) {
    this.setState({
      startDate: date,
    });
  }

  handleEndDateChange(date) {
    this.setState({
      endDate: date,
    });
  }

  handleClose = () => {
    this.setState({
      showModal: false,
    });
  }

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  render() {
    const {
      impersonatorId, deptManagers, startDate, endDate,
      recentDelegatorList, recentPageIndex, recentPageSize, recentTotalRecords, recentError,
      historyList, historyPageIndex, historyPageSize, historyTotalRecords, historyError,
      modalMessage, showModal, recentLoaded, historyLoaded, showEditModal, editRowData,
      editStartDate, editEndDate, showDeleteModal, isImpersenating,
    } = this.state;

    const {
      startDateError, endDateError, impersonatorIdError, editEndDateError, editStartDateError,
    } = this.state.formErrors;

    return (
      <div className="container-fluid delegation">

        <Card>
          <Card.Body>
            <Form>
              {/* filter Section */}
              <div className="row">
                <div className="col-md-5 offset-md-7">
                  <div className="row">
                    <div className="col-md-4">
                      {/* <Button className="filter__primary__btn">
                        Change
                      </Button> */}
                    </div>
                    <div className="col-md-4">
                      <Button disabled={isImpersenating} className="filter__primary__btn" onClick={this.handleSubmit}>
                        Save
                      </Button>
                    </div>
                    <div className="col-md-4">
                      <Button className="filter__primary__outline__btn" disabled={isImpersenating} variant="outline" onClick={this.handleCancel}>Cancel</Button>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="heading">Add Delegators</h2>
              <div className="row mb-3">
                <div className="col-md-3">
                  <Form.Group controlId="formImpersonator">
                    <Form.Label>Delegator</Form.Label>
                    <Form.Control as="select" disabled={isImpersenating} name="impersonatorId" value={impersonatorId} onChange={event => this.handleInputChange(event)}>
                      <option value={0}>Choose...</option>
                      {
                          deptManagers.map((data, index) => <option key={data.id} value={data.id}>{data.fullName}</option>)
                        }
                    </Form.Control>
                      
                    {impersonatorIdError
                      && (
                      <div className={impersonatorIdError ? 'text-danger' : 'hidden'}>
                        {impersonatorIdError}
                      </div>
                      )
                    }
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group controlId="formStartDate">
                    <Form.Label>Start Date</Form.Label>
                    
                    <DatePicker
                      name="startDate"
                      selected={startDate}
                      onChange={this.handleStartDateChange}
                      placeholderText={commonService.localizedDateFormat()}
                      dateFormat={commonService.localizedDateFormatForPicker()}
                      className="form-control cal_icon"
                      pattern="\d{2}\/\d{2}/\d{4}"
                      required
                    />
                    {startDateError
                      && (
                      <div className={startDateError ? 'text-danger' : 'hidden'}>
                        {startDateError}
                      </div>
                      )
                    }
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group controlId="formEndDate">
                    <Form.Label>End Date</Form.Label>
                    <DatePicker
                      name="endDate"
                      selected={endDate}
                      onChange={this.handleEndDateChange}
                      placeholderText={commonService.localizedDateFormat()}
                      dateFormat={commonService.localizedDateFormatForPicker()}
                      className="form-control cal_icon"
                      pattern="\d{2}\/\d{2}/\d{4}"
                      required
                    />
                    {endDateError
                      && (
                      <div className={endDateError ? 'text-danger' : 'hidden'}>
                        {endDateError}
                      </div>
                      )
                    }
                  </Form.Group>
                </div>
              </div>

              {/* /filter section  */}
              <Accordion defaultActiveKey="0">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Recent Delegators
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {/* Recent Delegators Table */}
                      {recentLoaded ? (
                        <Table striped hover responsive>
                          <thead>
                            <tr>
                              {tableHeader.map(data => (
                                <th>
                                  {data.label}
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {recentError
                            && (
                              <tr>
                                <td colSpan="10" className="text-center">No Data Found</td>
                              </tr>
                            )}
                            {recentDelegatorList && recentDelegatorList.map(data => (
                              <tr key={data.impersonatorId}>
                                <td>{data.impersonatorName}</td>
                                <td>{data.impersonatorDesignation}</td>
                                <td>{moment(data.startDateTime).format('DD/MM/YYYY')}</td>
                                <td>{moment(data.endDateTime).format('DD/MM/YYYY')}</td>
                                <td>
                                  <div className="d-flex">
                                    <Link to={`/delegation/recent/${data.impersonatorId}/${1}`}>
                                      <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 50, hide: 40 }}
                                        overlay={this.renderTooltip('View')}
                                      >
                                        <img className="mr-3 pointer" src={ViewDelegation} />
                                      </OverlayTrigger>
                                    </Link>
                                    { !isImpersenating && (
                                    <>
                                      <div
                                        onClick={() => this.setState({
                                          editRowData: data, showEditModal: true, editStartDate: moment(data.startDateTime).format('YYYY-MM-DD'), editEndDate: moment(data.endDateTime).format('YYYY-MM-DD'),
                                        })}
                                        aria-hidden
                                      >
                                        <OverlayTrigger
                                          placement="top"
                                          delay={{ show: 50, hide: 40 }}
                                          overlay={this.renderTooltip('Edit')}
                                        >
                                          <img className="mr-3 pointer" src={EditDelegation} alt="edit" />
                                        </OverlayTrigger>
                                        
                                      </div>
                                      <div
                                        onClick={() => this.setState({
                                          deleteId: data.id, showDeleteModal: true,
                                        })}
                                        aria-hidden
                                      >
        
                                        <OverlayTrigger
                                          placement="top"
                                          delay={{ show: 50, hide: 40 }}
                                          overlay={this.renderTooltip('Delete')}
                                        >
                                          <img className="mr-3 pointer" src={DeleteDelegation} alt="delete" />
                                        </OverlayTrigger>
                                      </div>
                                    </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : <Loaders />
                      }
                      <PaginationAndPageNumber
                        totalPageCount={Math.ceil(recentTotalRecords / recentPageSize)}
                        totalElementCount={recentTotalRecords}
                        updatePageNum={this.updateRecentPageNum}
                        updatePageCount={this.updateRecentPageCount}
                        currentPageNum={recentPageIndex}
                        recordPerPage={recentPageSize}
                      />
                      {/* /History List Table */}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="1">
                    History List
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      {historyLoaded ? (
                        <Table striped hover responsive>
                          <thead>
                            <tr>
                              {tableHeader.map(data => (
                                <th>
                                  {data.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {historyError
                              && (
                                <tr>
                                  <td colSpan="10" className="text-center">No Data Found</td>
                                </tr>
                              )}
                            {historyList && historyList.map(data => (
                              <tr key={data.impersonatorId}>
                                <td>{data.impersonatorName}</td>
                                <td>{data.impersonatorDesignation}</td>
                                <td>
                                  {data.startDateTime ? commonService.localizedDate(data.startDateTime) : ''}
                                </td>
                                <td>
                                  {data.endDateTime ? commonService.localizedDate(data.endDateTime) : ''}
                                </td>
                                <td>
                                  <div className="d-flex">
                                    <Link to={`/delegation/history/${data.impersonatorId}/${1}`}>
                                      <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 50, hide: 40 }}
                                        overlay={this.renderTooltip('View')}
                                      >
                                        <img className="mr-3 pointer" src={ViewDelegation} />
                                      </OverlayTrigger>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))}

                          </tbody>
                        </Table>
                      ) : <Loaders />
                      }
                      <PaginationAndPageNumber
                        totalPageCount={Math.ceil(historyTotalRecords / historyPageSize)}
                        totalElementCount={historyTotalRecords}
                        updatePageNum={this.updateHistoryPageNum}
                        updatePageCount={this.updateHistoryPageCount}
                        currentPageNum={historyPageIndex}
                        recordPerPage={historyTotalRecords}
                      />
                      {/* /Delegation Table */}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>

            </Form>
          </Card.Body>
        </Card>

        {showModal && (
          <Modal
            show={showModal}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              {modalMessage}
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {showDeleteModal && (
          <Modal
            show={showDeleteModal}
            onHide={() => this.setState({ showDeleteModal: false })}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              Are you sure you want to delete the delegator
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.handleDelete()}>
                Yes
              </Button>
              <Button variant="secondary" onClick={() => this.setState({ showDeleteModal: false })}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        {showEditModal && (
        <Modal
          show={showEditModal}
          onHide={() => this.setState({ showEditModal: false })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            Update Delegator
          </Modal.Header>
          <Modal.Body>
            <div className=" mb-3">
              <div className="row mx-2">
                <Form.Group controlId="formImpersonator" className="w-100">
                  <Form.Label>Delegator</Form.Label>
                  <Form.Control as="select" name="impersonatorId" defaultValue={editRowData && editRowData.impersonatorId} custom disabled>
                    {/* <option value={0}>Choose...</option> */}
                    {
                        deptManagers.map((data, index) => <option key={data.id} value={data.id}>{data.fullName}</option>)
                      }
                  </Form.Control>

                </Form.Group>
              </div>
              <div className="row mx-2">
                <div className="col-md-6 pl-0">
                  <Form.Group controlId="formStartDate">
                    <Form.Label>Start Date</Form.Label>
                    <DatePicker
                      name="startDate"
                      selected={startDate}
                      onChange={this.handleStartDateChange}
                      placeholderText={commonService.localizedDateFormat()}
                      dateFormat={commonService.localizedDateFormatForPicker()}
                      className="form-control cal_icon"
                      pattern="\d{2}\/\d{2}/\d{4}"
                      required
                    />
                    {editStartDateError
                      && (
                      <div className={editStartDateError ? 'text-danger' : 'hidden'}>
                        {editStartDateError}
                      </div>
                      )
                    }
                  </Form.Group>
                </div>
                <div className="col-md-6 pr-0">
                  <Form.Group controlId="formEndDate">
                    <Form.Label>End Date</Form.Label>
                    <DatePicker
                      name="endDate"
                      selected={endDate}
                      onChange={this.handleEndDateChange}
                      placeholderText={commonService.localizedDateFormat()}
                      dateFormat={commonService.localizedDateFormatForPicker()}
                      className="form-control cal_icon"
                      pattern="\d{2}\/\d{2}/\d{4}"
                      required
                    />
                    {editEndDateError
                      && (
                      <div className={editEndDateError ? 'text-danger' : 'hidden'}>
                        {editEndDateError}
                      </div>
                      )
                    }
                  </Form.Group>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleUpdate(editRowData.impersonatorId, editRowData.impersonateeId, editRowData.id)}>
              Update
            </Button>
            <Button variant="secondary" onClick={() => this.setState({ showEditModal: false, formErrors: {} })}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
        )}
      </div>

    );
  }
}

export default AddDelegators;
