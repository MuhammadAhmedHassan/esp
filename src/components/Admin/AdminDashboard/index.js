/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Col, Row, Card, Table, OverlayTrigger, Tooltip,
  Modal, Button,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import DetailsCard from './DetailsCard';
import './style.scss';
import Api from '../../common/Api';
import { userService } from '../../../services';
import { commonService } from '../../../services/common.service';
import CharEIcon from '../../../Images/Icons/E_char.svg';
import CharSIcon from '../../../Images/Icons/S_char.svg';
import ViewIcon from '../../../Images/Icons/View.svg';

class AdminDashboard extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.getUserConsent = this.getUserConsent.bind(this);
    this.getCountDetails = this.getCountDetails.bind(this);
    let isAdmin = false;
    const userRoles = userService.getRole() ? userService.getRole() : [];
    if (userRoles.find(role => role.name === 'Administrators')) {
      isAdmin = true;
    }
    const token = userService.getToken();
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      data: {},
      // eslint-disable-next-line react/no-unused-state
      token: `${token}`,
      totalUsers: undefined,
      inActiveUsers: undefined,
      exceptions: undefined,
      pendingTimeSheet: undefined,
      pendingAbsences: undefined,
      pendingOvertime: undefined,
      outStandingTimeSheets: undefined,
      clockedInUser: undefined,
      sickUsers: undefined,
      unknownStatus: undefined,
      usersOnLeave: undefined,
      isAdmin,
      systemData: [],
      assignedShift: [],
      geoCoordinates: '',
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      const geoLocation = `${position.coords.latitude} ${position.coords.longitude}`;
      this.setState({ geoCoordinates: geoLocation });
    });
    this.getUserConsent();
    this.getSystemUsage();
    this.getShifts();
  }

  getCountDetails = () => {
    const { isAdmin, token } = this.state;
    fetch(`${Api.dashboard.getCountDetails}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        languageId: 1,
        offset: '',
        startDate: null,
        endDate: null,
        isActive: true,
        pageSize: 20,
        isAdmin,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            // eslint-disable-next-line react/no-unused-state
            countData: response.data,
            totalUsers: this.getCount(10, response.data),
            inActiveUsers: this.getCount(11, response.data),
            exceptions: this.getCount(1, response.data),
            pendingTimeSheet: this.getCount(2, response.data),
            pendingAbsences: this.getCount(3, response.data),
            pendingOvertime: this.getCount(4, response.data),
            outStandingTimeSheets: this.getCount(5, response.data),
            clockedInUser: this.getCount(6, response.data),
            sickUsers: this.getCount(8, response.data),
            unknownStatus: this.getCount(9, response.data),
            usersOnLeave: this.getCount(7, response.data),
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getCountDetails());
          });
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(`Failed to fetch get user consent service. Please try again after sometime. ${err}`);
      });
  }

  getCount = (key, lst) => {
    const data = lst.filter(x => x.widgetId === key);
    return data.length > 0 ? data[0].dataCount : 0;
  }

  getUserConsent = () => {
    const { token } = this.state;
    fetch(`${Api.dashboard.getSettingByUserId}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        languageId: 1,
        id: userService.getUserId(),
        offset: '',
        isActive: true,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            // eslint-disable-next-line react/no-unused-state
            data: response.data,
          });
          this.getCountDetails();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getUserConsent());
          });
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(`Failed to fetch get user consent service. Please try again after sometime. ${err}`);
      });
  }

  getSystemUsage = () => {
    const token = userService.getToken();
    const userRoles = userService.getRole();
    const userId = userService.getUserId();
    let isAdministratorRole = false;
    if (userRoles.find(role => role.name === 'Administrators')) {
      isAdministratorRole = true;
    } else {
      isAdministratorRole = false;
    }
    const data = {
      id: 0,
      languageId: 1,
      offset: '',
      isActive: true,
      totalRecords: 5,
      pageIndex: 1,
      pageSize: 5,
      workLocationId: 0,
      divisionId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      managerId: isAdministratorRole ? 0 : Number(userId),
      userId: 0,
      contractTypeId: 0,
      countryId: 0,
      stateId: 0,
      userRoleIds: '',
      activityTypeId: 0,
      startDate: new Date(`${new Date().getMonth() + 1}/01/${new Date().getFullYear()}`),
      endDate: new Date(),
    };
    fetch(`${Api.systemUsage.systemData}`, {
      method: 'POST',
      headers: new Headers({
        token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            systemData: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            this.getSystemUsage();
          });
        }
      })

      .catch(err => console.error(err.toString()));
  };

  getShifts = () => {
    const token = userService.getToken();
    const userId = userService.getUserId();
 
    const data = {
      id: userId,
      languageId: 1,
      pageIndex: 1,
      isActive: true,
      pageSize: 10,
    };
    fetch(`${Api.shiftSearchEmp}`, {
      method: 'POST',
      headers: new Headers({
        token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            assignedShift: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            this.getShifts();
          });
        }
      })

      .catch(err => console.error(err.toString()));
  };

  onConfirm = () => {
    const { shiftId, isShiftStart } = this.state;
    this.setState({
      shiftModal: false,
      shiftId,
    });
    this.startEndShift(shiftId, isShiftStart, true);
  };

  viewShift = (shift) => {
    const { history } = this.props;
    history.push({
      pathname: `/shift-detail/${shift.id}/${userService.getUserId()}/`,
    });
  };

  startEndShift = (shiftId, isShiftStart, isForced) => {
    const token = userService.getToken();
    const userId = userService.getUserId();
    const { geoCoordinates } = this.state;

    this.setState({
      shiftId, isShiftStart,
    });

    if (geoCoordinates === '') {
      this.setState({
        responseModal: true,
        responseModalMessage: 'Please allow location access to use this feature',
      });
      return true;
    }

    const startEndShiftReq = {
      id: shiftId,
      languageId: 1,
      isShiftStart,
      userId,
      isActiveOnly: true,
      isForced,
      geoLocation: geoCoordinates,
      loginViaDeviceTypeId: 10,
    };

    fetch(`${Api.shift.startEndShift}`, {
      method: 'POST',
      headers: new Headers({
        Token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(startEndShiftReq),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 290) {
          this.setState({
            shiftModal: true,
            modalBody: response.message,
          });
        } else if (response.statusCode === 200) {
          this.setState({
            responseModal: true,
            responseModalMessage: response.message,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            this.startEndShift(shiftId, isShiftStart, isForced);
          });
        } else if (response.statusCode !== 200) {
          this.setState({
            responseModal: true,
            responseModalMessage: response.message,
          });
        }
      })
      .catch((err) => {
        console.warn(err);
      });
    return true;
  };

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  render() {
    const {
      data, totalUsers, inActiveUsers, exceptions, pendingTimeSheet,
      pendingAbsences, pendingOvertime, outStandingTimeSheets,
      clockedInUser, sickUsers, unknownStatus, usersOnLeave,
      isAdmin, systemData, assignedShift, shiftModal, modalBody,
      responseModal, responseModalMessage,
    } = this.state;
    const { t, history } = this.props;
    return (
      <>
        <div className="container-fluid configure-dashboard">
          <div className="card_layout p-3">
            <div className="dashboard-wrapper">
              <Row>
                {data.numberofTotalUsers && totalUsers !== undefined && (
                  <DetailsCard path="/manage-employee" status="1" history={history} count={totalUsers} title={t('Dashboard.UserCount')} key="users" />
                )}
                {data.accountInActive && inActiveUsers !== undefined && (
                  <DetailsCard path="/manage-employee" status="2" history={history} count={inActiveUsers} title={t('Dashboard.InActiveUsers')} key="InActiveUsers" />
                )}
                {data.exceptions && exceptions !== undefined && (
                  <DetailsCard isAdmin={isAdmin} path="/exception" history={history} count={exceptions} title={t('Dashboard.Exception')} key="Exceptions" />
                )}
                {data.pendingTimeSheetApproval && pendingTimeSheet !== undefined && (
                  <DetailsCard isAdmin={isAdmin} path="/pending-timesheet" history={history} count={pendingTimeSheet} title={t('Dashboard.PendingTimeSheet')} key="PendingTimeSheet" />
                )}
                {data.pendingAbsenceApproval && pendingAbsences !== undefined && (
                  <DetailsCard path="pending-absence" history={history} count={pendingAbsences} title={t('ConfiguredDashboard.PendingAbsenceApproval')} key="PendingAbsences" />
                )}
                {data.pendingOvertime && pendingOvertime !== undefined && (
                  <DetailsCard path="pending-overtime" history={history} count={pendingOvertime} title={t('ConfiguredDashboard.PendingOverTime')} key="PendingOverTime" />
                )}
                {data.numberofOutstandingTimesheetApprovals && outStandingTimeSheets !== undefined && (
                  <DetailsCard path="" history={history} count={outStandingTimeSheets} title={t('Dashboard.OutstandingTimeSheetApproval')} key="OutstandingTimeSheetApproval" />
                )}
                {data.clockedInUser && clockedInUser !== undefined && (
                  <DetailsCard path="" history={history} count={clockedInUser} title={t('ConfiguredDashboard.ClockedInUser')} key="OutstandingTimeSheetApproval" />
                )}
                {data.usersOnLeave && usersOnLeave !== undefined && (
                  <DetailsCard path="" history={history} count={usersOnLeave} title={t('ConfiguredDashboard.UserOnLeave')} key="OutstandingTimeSheetApproval" />
                )}
                {data.sickUsers && sickUsers !== undefined && (
                  <DetailsCard path="" history={history} count={sickUsers} title={t('ConfiguredDashboard.SickUsers')} key="OutstandingTimeSheetApproval" />
                )}
                {data.unknownStatus && unknownStatus !== undefined && (
                  <DetailsCard path="" history={history} count={unknownStatus} title={t('ConfiguredDashboard.UnknownStatus')} key="OutstandingTimeSheetApproval" />
                )}
              </Row>
            </div>
          </div>
        </div>
        <div className="container-fluid configure-dashboard employee-dashboard">
          <div className="card_layout p-3">
            <div className="dashboard-wrapper">
              <Row>
                <Col lg={6}>
                  <Card className="cardBox openShift-card">
                    <header className="cardBox_cardTitle openShift-card-header">
                      System Usage
                    </header>
                    <Row>
                      <Col md={12}>
                        <Table responsive bordered>
                          <thead>
                            <tr>
                              <th>Activity Type</th>
                              <th>Counts</th>
                            </tr>
                          </thead>
                          <tbody>
                            {systemData.length === 0 && <tr><td colSpan="2">No data found</td></tr>}
                            {systemData.map(reqData => (
                              <tr>
                                <td>
                                  {reqData.activityTypeName}
                                </td>
                                <td>
                                  {isAdmin ? (
                                    <Link className="linkLine" to={`/adminDashboard/usageDetails/?roleId=2&activityId=${reqData.activityTypeId}&fromDate=${moment.utc(moment(`${moment().get('month') + 1}-01-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate()).local().format('MM/DD/YYYY')}&toDate=${moment.utc(moment(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate()).local().format('MM/DD/YYYY')}`}>
                                      {reqData.activityCount}
                                    </Link>
                                  )
                                    : (
                                      <Link className="linkLine" to={`/adminDashboard/usageDetails/?roleId=1&activityId=${reqData.activityTypeId}&fromDate=${moment.utc(moment(`${moment().get('month') + 1}-01-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate()).local().format('MM/DD/YYYY')}&toDate=${moment.utc(moment(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate()).local().format('MM/DD/YYYY')}&managerId=${userService.getUserId()}`}>
                                        {reqData.activityCount}
                                      </Link>
                                    )
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        <div className=" d-flex justify-content-end">
                          <Link to={isAdmin ? '/adminDashboard/systemUsage' : '/managerDashboard/systemUsage'} className="seeAllbtn mr-3">
                            See All
                          </Link>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col md={12} lg={12} xl={6} className="mb-4">
                  <Card className="cardBox">
                    <p className="cardBox_cardTitle">
                      My Schedule (Assigned Shifts)
                    </p>
                    <div className="myScheduleTable">
                      <Table responsive bordered>
                        <thead className="shiftHeader">
                          <tr>
                            <th>Date</th>
                            <th>Information</th>
                          </tr>
                        </thead>
                        <tbody>
                          {assignedShift.length === 0
                            && (
                              <tr>
                                <td colSpan="10" className="text-center">No Data Available</td>
                              </tr>
                            )}
                          {assignedShift.map((shiftData, index) => (index <= 7 ? (
                            <tr>
                              <td>
                                <div className="shiftDesc">
                                  {shiftData.startDateTime ? commonService.localizedDate(shiftData.startDateTime) : ''}
                                </div>
                              </td>
                              <td>
                                <div className="myScheduleinfo">
                                  <div className="shiftDesc">
                                    {`${moment(shiftData.startDateTime).format(
                                      'HH:mm',
                                    )}`}
                                    {' - '}
                                    {`${moment(shiftData.endDateTime).format(
                                      'HH:mm',
                                    )}`}
                                    {' | '}
                                    {shiftData.shiftType}
                                    {' | '}
                                    {shiftData.title}
                                  </div>
                                  <div className="shiftIcon">
                                    {shiftData.userShiftStatusId === 20 && (
                                      <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 50, hide: 40 }}
                                        overlay={this.renderTooltip('End Shift')}
                                      >
                                        <span>
                                          <img
                                            src={CharEIcon}
                                            className="icon"
                                            alt="CharEIcon"
                                            onClick={() => this.startEndShift(
                                              shiftData.id,
                                              false,
                                              false,
                                            )
                                            }
                                          />
                                        </span>
                                      </OverlayTrigger>
                                    )}
                                    {shiftData.userShiftStatusId === 10 && (
                                      <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 50, hide: 40 }}
                                        overlay={this.renderTooltip('Start Shift')}
                                      >
                                        <span>
                                          <img
                                            src={CharSIcon}
                                            className="icon"
                                            alt="CharSIcon"
                                            onClick={() => this.startEndShift(
                                              shiftData.id,
                                              true,
                                              false,
                                            )
                                            }
                                          />
                                        </span>
                                      </OverlayTrigger>
                                    )}

                                    {shiftData.userShiftStatusId === 30 && (
                                      <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 50, hide: 40 }}
                                        overlay={this.renderTooltip('View Shift')}
                                      >
                                        <span>
                                          <img
                                            className="icon"
                                            src={ViewIcon}
                                            onClick={() => this.viewShift(
                                              shiftData,
                                            )}
                                            alt="ViewIcon"
                                          />

                                        </span>
                                      </OverlayTrigger>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : undefined))}
                        </tbody>
                      </Table>
                    </div>
                    {assignedShift.length > 4 && (
                      <div className="d-flex justify-content-end">
                        <Link to="/schedule/my-schedule" variant="link " className="mr-3 seeAllbtn">
                          {t('SeeAllBtn')}
                        </Link>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <Modal
          show={shiftModal}
          onHide={() => this.setState({ shiftModal: false, modalBody: '' })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>
            {modalBody}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ shiftModal: false, modalBody: '' })}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => this.onConfirm()}>Confirm</Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={responseModal}
          onHide={() => this.setState({ responseModal: false, responseModalMessage: '' })}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>
            {responseModalMessage}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ responseModal: false, responseModalMessage: '' })}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default withTranslation()(AdminDashboard);
