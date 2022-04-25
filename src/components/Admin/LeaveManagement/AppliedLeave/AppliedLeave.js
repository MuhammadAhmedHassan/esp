import React from 'react';
import { withTranslation } from 'react-i18next';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Button, Modal, Tooltip, OverlayTrigger, Row, Col, Form,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Loader } from 'react-bootstrap-typeahead';
import PaginationAndPageNumber from '../../../shared/Pagination/index';
import Api from '../../../common/Api';
import { userService } from '../../../../services';
import viewIcon from '../../../../Images/Icons/viewIcon.svg';
import stopIcon from '../../../../Images/Icons/stopIcon.svg';
import withdrawIcon from '../../../../Images/Icons/withdrawIcon.svg';
import Loaders from '../../../shared/Loaders';
import { commonService } from '../../../../services/common.service';

class AppliedLeave extends React.Component {
  constructor(props) {
    super(props);
    const userId = userService.getUserId();
    const token = userService.getToken();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      token: `${token}`,
      userId,
      appliedLeaves: [],
      leaveId: 0,
      showModel: false,
      showModels: false,
      toDate: '',
      openEnded: false,
      toDateIsSmaller: false,
      sessions: [],
      toSession: '1',
      endDate: '',
      endSession: '1',
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
      loaded: false,
      modelUpdate: false,
      errorMessage: '',
    };
  }

  componentDidMount() {
    this.getAppliedLeaves();
    this.bindSessionDropDown();
    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getAppliedLeaves();
    }
  }

  // Handler for Select

  onChangeDate(date) {
    this.setState({ endtDate: date });
  }

  handleDropDown = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  bindSessionDropDown = () => {
    const { token, userId } = this.state;
    fetch(`${Api.getSessions}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ userId, Id: userId, languageId: 1 }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            sessions: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.bindSessionDropDown());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  handleLeaveWidraw = (id) => {
    const { showModel } = this.state;
    this.setState({
      showModel: !showModel,
      leaveId: id,
    });
  };

  stopLeave = (id) => {
    const { showModels } = this.state;
    this.setState({
      showModels: !showModels,
      leaveId: id,
    });
  };

  handleClose = () => {
    this.setState({
      showModel: false,
      showModels: false,
      modelUpdate: false,
      modelFieldError: null,
    });
  };

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      token, leaveId, endSession, endDate, modelUpdate,
    } = this.state;
    const data = {
      Id: parseInt(leaveId, 10),
      endSession: parseInt(endSession, 10),
      endDateUtc: endDate,
      languageId: 1,
    };

    if (!endDate || !endSession) {
      this.setState({
        modelFieldError: 'Update required fields',
      });
      return;
    }

    fetch(`${Api.vacationManagement.getCloseOpenLeave}`, {
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
          this.setState({
            data: response.data,
            modelUpdate: !modelUpdate,
            errorMessage: response.message,
          }, () => this.getAppliedLeaves());
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.handleSubmit(e));
          });
        } else {
          this.handleClose();
          this.setState({
            modelUpdate: !modelUpdate,
            errorMessage: response.message,
          });
        }
      }, this.handleClose())
      .catch(err => console.error(err.toString()));
  };

  confirmLeaveWithdraw = (e) => {
    e.preventDefault();
    const { token, leaveId } = this.state;
    // stop here if leave id = 0
    if (leaveId === 0) {
      return;
    }

    const appliedleaveWithdrawn = {
      id: leaveId,
      languageId: 1,
      isCancelledByUser: true,
    };
    fetch(`${Api.vacationManagement.leaveWithdraw}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: `${token}`,
      }),
      body: JSON.stringify({ ...appliedleaveWithdrawn }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.handleClose();
          this.getAppliedLeaves();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.confirmLeaveWithdraw(e));
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  getAppliedLeaves = () => {
    const {
      token, userId, pageIndex, pageSize,
    } = this.state;

    const data = {
      languageId: 1,
      userId,
      pageIndex,
      pageSize,
    };

    fetch(`${Api.vacationManagement.getAppliedLeavesByUserId}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token} `,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            appliedLeaves: response.data.appliedLeaves,
            loaded: true,
            pageIndex: response.data.pageIndex || 1,
            pageSize: response.data.pageSize,
            totalRecords: response.data.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAppliedLeaves());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
        loaded: false,
      });
    }
  };

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
      loaded: false,
    });
  };

  handleHours(d2, d1) {
    const diff = ((new Date(d2)).getTime() - (new Date(d1)).getTime()) / 1000;
    const hDiff = (diff) / (60 * 60);
    const mDiff = Math.abs((diff / 60) % 60);
    return mDiff < 10 ? `${Math.abs(Math.floor(hDiff))}:0${Math.abs(Math.floor(mDiff))}` : `${Math.abs(Math.floor(hDiff))}:${Math.abs(Math.floor(mDiff))}`;
  }

  render() {
    const {
      appliedLeaves,
      showModel,
      showModels,
      sessions,
      pageIndex,
      pageSize,
      modelUpdate,
      errorMessage,
      totalRecords,
      loaded,
      modelFieldError,
    } = this.state;
    const { t } = this.props;

    return (
      <>
        {loaded ? (
          <>
            {appliedLeaves.map(appliedLeavesData => (
              <div className="appliedLeaveOuterCard">
                <div className="appliedLeaveCard">
                  <Row>
                    <Col lg={8}>
                      <Row>
                        <Col md={4}>
                          <h5 className="label_lightgray">
                            {' '}
                            {t('ApplyPage.Leave_catergory')}
                            {' '}
                          </h5>
                          <p>{appliedLeavesData.parentLeaveTypeName}</p>
                        </Col>
                        <Col md={4}>
                          <h5 className="label_lightgray">
                            {' '}
                            {t('ApplyPage.Leave_catergory')}
                            {' '}
                          </h5>
                          <p>{appliedLeavesData.childLeaveTypeName}</p>
                        </Col>
                        
                        {appliedLeavesData.parentLeaveTypeId !== 91 && (
                        <Col md={4}>
                          <>
                            <h5>
                              {' '}
                              {t('AppliedPage.NoOfDays')}
                              {' '}
                            </h5>
                            <p>{appliedLeavesData.noOfDays}</p>
                          </>
                        </Col>
                        )}
                        {appliedLeavesData.parentLeaveTypeId === 91 && (
                          
                          <Col md={4}>
                            <>
                              <h5>
                                {' '}
                                {t('No. of Hours')}
                                {' '}
                              </h5>
                              <p>{appliedLeavesData.overtimeInHours}</p>
                            </>
                          </Col>
                        )}
                        <Col md={4}>
                          <h5>
                            {' '}
                            {t('StartDate')}
                            {' '}
                          </h5>
                          <p>{appliedLeavesData.strFromDateTimeUtc && commonService.localizedDate(appliedLeavesData.strFromDateTimeUtc)}</p>
                        </Col>
                        <Col md={4}>
                          <h5>
                            {' '}
                            {t('EndDate')}
                            {' '}
                          </h5>
                          <p>
                            {appliedLeavesData.strToDateTimeUtc && commonService.localizedDate(appliedLeavesData.strToDateTimeUtc)}
                            {' '}
                            <span className="openEndedText">
                              {appliedLeavesData.openEnded ? 'Open Ended' : ' '}
                            </span>
                          </p>
                          <p />
                        </Col>
                        <Col md={4}>
                          <h5>
                            {' '}
                            {t('Status')}
                            {' '}
                          </h5>
                          <p>{appliedLeavesData.appliedLeaveStatus}</p>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={4}>
                      <Row className="d-flex justify-content-end">
                        <Link
                          className="btn btn-outline-info applyLeaveBtn"
                          to={`/vacation-management/my-vacation/applied-vacation/view-details/${appliedLeavesData.id},${appliedLeavesData.parentLeaveTypeId},${appliedLeavesData.userId}`}
                        >
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 50, hide: 40 }}
                            overlay={this.renderTooltip('View Detail')}
                          >
                            <img src={viewIcon} alt="View Icon" />
                          </OverlayTrigger>
                        </Link>
                        {appliedLeavesData.openEnded && (
                        <Button
                          className="btn btn-outline-info applyLeaveBtn"
                          onClick={() => this.stopLeave(appliedLeavesData.id)
                              }
                        >
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 50, hide: 40 }}
                            overlay={this.renderTooltip('Open Ended Stop')}
                          >
                            <img src={stopIcon} alt="stop Icon" />
                          </OverlayTrigger>
                        </Button>
                        )}

                        {appliedLeavesData.appliedLeaveStatus === 'Pending' && (
                          <Button
                            type="button"
                            className="btn btn-outline-info applyLeaveBtn"
                            onClick={() => this.handleLeaveWidraw(appliedLeavesData.id)
                            }
                          >
                            <span className="action-icon delete danger-bg">
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 40 }}
                                overlay={this.renderTooltip('Withdraw')}
                              >
                                <img src={withdrawIcon} alt="Withdraw Icon" />
                              </OverlayTrigger>
                            </span>
                          </Button>
                        )}
                      </Row>
                    </Col>
                  </Row>
                </div>
              </div>
            ))}
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
          </>
        ) : (
          <Loaders />
        )}

        {showModels && (
          <Modal
            show={this.stopLeave}
            onHide={this.handleClose}
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title>Close Open Leave</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={this.handleSubmit} autoComplete="off">
                <Row className="d-flex">
                  <Col md={6}>
                    <Form.Label htmlFor="endDate"> End date</Form.Label>
                    <span className="redStar"> * </span>
                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
                      className="form-control"
                      onChange={this.handleDropDown}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="endSession">Session</Form.Label>
                    <span className="redStar"> * </span>
                    <select
                      lassName="form-control"
                      name="endSession"
                      id="endSession"
                      className="form-control"
                      onChange={this.handleDropDown}
                    >
                      {sessions.map(session => (
                        <option key={session.id} value={session.id}>
                          {session.name}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
                <Row className="d-flex text-center">
                  <Col md={12}>
                    <div className="text-danger mt-1">{modelFieldError}</div>
                  </Col>
                </Row>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <div className="modal__actions">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={this.handleClose}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={this.handleSubmit}
                >
                  Submit
                </button>
              </div>
            </Modal.Footer>
          </Modal>
        )}

        {showModel && (
          <Modal
            show={this.handleLeaveWidraw}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body>
              {t('AppliedPage.popUpMessage')}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                {t('CancelBtn')}
              </Button>
              <Button variant="primary" onClick={this.confirmLeaveWithdraw}>
                {t('ConfirmBtn')}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        {modelUpdate && (
          <Modal
            show={this.handleSubmit}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body>
              <p>
                {' '}
                {errorMessage}
                {' '}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Ok
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  }
}

export default withTranslation()(AppliedLeave);
