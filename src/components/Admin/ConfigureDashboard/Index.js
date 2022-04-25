import React, { Component } from 'react';
import './style.scss';
import { withTranslation } from 'react-i18next';
import { Table, Col, Row } from 'react-bootstrap';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { userService } from '../../../services';
import Api from '../../common/Api';
import ApiResponsePopup from '../../shared/Common/ApiResponsePopup';

class Index extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.state = {
      token: `${token}`,
      id: 0,
      numberofTotalUsers: true,
      accountInActive: true,
      clockedInUser: true,
      sickUsers: true,
      unknownStatus: true,
      usersOnLeave: true,
      exceptions: true,
      pendingOvertime: true,
      pendingTimeSheetApproval: true,
      pendingAbsenceApproval: true,
      numberofOutstandingTimesheetApprovals: true,
      listingInfoSystemUsageSummary: true,
      listingInfoEmployeeSummarybyHour: true,
      listingInfoShiftsAssigned: true,
      loading: false,
      showModel: false,
      body: '',
    };
  }

  componentDidMount() {
    this.getUserConsent();
  }

  
  getUserConsent = () => {
    const { token } = this.state;
    this.setState({ loading: true });
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
          // eslint-disable-next-line prefer-destructuring
          const data = response.data;
          this.setState({
            // eslint-disable-next-line react/no-unused-state
            id: data.id,
            numberofTotalUsers: data.numberofTotalUsers,
            accountInActive: data.accountInActive,
            clockedInUser: data.clockedInUser,
            sickUsers: data.sickUsers,
            unknownStatus: data.unknownStatus,
            usersOnLeave: data.usersOnLeave,
            exceptions: data.exceptions,
            pendingOvertime: data.pendingOvertime,
            pendingTimeSheetApproval: data.pendingTimeSheetApproval,
            pendingAbsenceApproval: data.pendingAbsenceApproval,
            numberofOutstandingTimesheetApprovals: data.numberofOutstandingTimesheetApprovals,
            listingInfoSystemUsageSummary: data.listingInfoSystemUsageSummary,
            listingInfoEmployeeSummarybyHour: data.listingInfoEmployeeSummarybyHour,
            listingInfoShiftsAssigned: data.listingInfoShiftsAssigned,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getUserConsent());
          });
        }
        this.setState({ loading: false });
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(`Failed to fetch get all shift types service. Please try again after sometime. ${err}`);
        this.setState({ loading: false });
      });
  }


  // eslint-disable-next-line react/sort-comp
  handleSwitch(event) {
    const { target } = event;
    const { name, checked } = target;
    this.setState({
      [name]: checked,
    });
  }

  handleSubmit() {
    const {
      token,
      // eslint-disable-next-line max-len
      id, numberofTotalUsers, accountInActive, clockedInUser,
      sickUsers,
      unknownStatus,
      usersOnLeave, exceptions, pendingTimeSheetApproval,
      pendingAbsenceApproval, pendingOvertime, numberofOutstandingTimesheetApprovals,
      listingInfoSystemUsageSummary, listingInfoEmployeeSummarybyHour, listingInfoShiftsAssigned,
    } = this.state;

    const data = {
      languageId: 1,
      id,
      offset: '',
      isActive: true,
      userId: userService.getUserId(),
      numberofTotalUsers,
      accountInActive,
      clockedInUser,
      sickUsers,
      unknownStatus,
      usersOnLeave,
      exceptions,
      pendingTimeSheetApproval,
      pendingAbsenceApproval,
      pendingOvertime,
      numberofOutstandingTimesheetApprovals,
      listingInfoSystemUsageSummary,
      listingInfoEmployeeSummarybyHour,
      listingInfoShiftsAssigned,
      createdById: userService.getUserId(),
      updatedById: userService.getUserId(),
    };
    this.setState({
      loading: true,
    });
   
    fetch(`${Api.dashboard.updateSettingByUserId}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ ...data }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.getUserConsent();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.handleSubmit());
          });
        }
        this.setState({
          loading: false,
          showModel: true,
          body: response.message,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
          showModel: true,
          body: err,
        });
      });
  }

  closeResponseModel = () => {
    this.setState({
      showModel: false,
      body: '',
    });
  };

  render() {
    const { t } = this.props;
    const {
      numberofTotalUsers, accountInActive, clockedInUser,
      sickUsers,
      unknownStatus,
      usersOnLeave, exceptions, pendingTimeSheetApproval,
      pendingAbsenceApproval, pendingOvertime, numberofOutstandingTimesheetApprovals,
      listingInfoSystemUsageSummary, listingInfoEmployeeSummarybyHour, listingInfoShiftsAssigned,
      loading, showModel, body,
    } = this.state;
    return (
      <>
        <div>
          {loading ? (<LoadingSpinner />) : null}
        </div>
        {showModel && (
          <ApiResponsePopup
            body={body}
            closeResponseModel={this.closeResponseModel}
          />
        ) }
        
        <div className="container-fluid configure-dashboard">
          <div className="card_layout p-3">
            <div className="card_layout p-1">
              <Row>
                <Col md={12}>
                  <div>
                    <h4 className="tilte">{t('ConfiguredDashboard.Tiles')}</h4>
                  </div>
                  <Table striped responsive>
                    <tbody>
                      <tr>
                        <td>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={numberofTotalUsers}
                              name="numberofTotalUsers"
                              onChange={event => this.handleSwitch(event)}
                              className="custom-control-input"
                              id="numberofTotalUsers"
                            />
                            <label className="custom-control-label" htmlFor="numberofTotalUsers">{t('ConfiguredDashboard.TotalUsers')}</label>
                          </div>
                        </td>
                        <td>
                          {' '}
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={accountInActive}
                              name="accountInActive"
                              onChange={event => this.handleSwitch(event)}
                              className="custom-control-input"
                              id="accountInActive"
                            />
                            <label className="custom-control-label" htmlFor="accountInActive">{t('ConfiguredDashboard.AccountInActive')}</label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {' '}
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={clockedInUser}
                              name="clockedInUser"
                              onChange={event => this.handleSwitch(event)}
                              className="custom-control-input"
                              id="clockedInUser"
                            />
                            <label className="custom-control-label" htmlFor="clockedInUser">{t('ConfiguredDashboard.ClockedInUser')}</label>
                          </div>
                        </td>
                        <td>
                          {' '}
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={usersOnLeave}
                              name="usersOnLeave"
                              onChange={event => this.handleSwitch(event)}
                              className="custom-control-input"
                              id="usersOnLeave"
                            />
                            <label className="custom-control-label" htmlFor="usersOnLeave">{t('ConfiguredDashboard.UserOnLeave')}</label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {' '}
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={sickUsers}
                              name="sickUsers"
                              onChange={event => this.handleSwitch(event)}
                              className="custom-control-input"
                              id="sickUsers"
                            />
                            <label className="custom-control-label" htmlFor="sickUsers">{t('ConfiguredDashboard.SickUsers')}</label>
                          </div>
                        </td>
                        <td>
                          {' '}
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={unknownStatus}
                              name="unknownStatus"
                              onChange={event => this.handleSwitch(event)}
                              className="custom-control-input"
                              id="unknownStatus"
                            />
                            <label className="custom-control-label" htmlFor="unknownStatus">{t('ConfiguredDashboard.UnknownStatus')}</label>
                          </div>
                        </td>
                        
                      </tr>
                      <tr>
                        <td>
                          {' '}
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={pendingTimeSheetApproval}
                              name="pendingTimeSheetApproval"
                              onChange={event => this.handleSwitch(event)}
                              className="custom-control-input"
                              id="pendingTimeSheetApproval"
                            />
                            <label className="custom-control-label" htmlFor="pendingTimeSheetApproval">{t('ConfiguredDashboard.PendingTimeSheetApproval')}</label>
                          </div>
                        </td>
                        <td>
                          {' '}
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={pendingAbsenceApproval}
                              name="pendingAbsenceApproval"
                              onChange={event => this.handleSwitch(event)}
                              className="custom-control-input"
                              id="pendingAbsenceApproval"
                            />
                            <label className="custom-control-label" htmlFor="pendingAbsenceApproval">{t('ConfiguredDashboard.PendingAbsenceApproval')}</label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {' '}
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={pendingOvertime}
                              name="pendingOvertime"
                              onChange={event => this.handleSwitch(event)}
                              className="custom-control-input"
                              id="pendingOvertime"
                            />
                            <label className="custom-control-label" htmlFor="pendingOvertime">{t('ConfiguredDashboard.PendingOverTime')}</label>
                          </div>
                        </td>
                        <td>
                          {' '}
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={numberofOutstandingTimesheetApprovals}
                              name="numberofOutstandingTimesheetApprovals"
                              onChange={event => this.handleSwitch(event)}
                              className="custom-control-input"
                              id="numberofOutstandingTimesheetApprovals"
                            />
                            <label className="custom-control-label" htmlFor="numberofOutstandingTimesheetApprovals">{t('ConfiguredDashboard.OutstandingTimeSheetApproval')}</label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {' '}
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={exceptions}
                              name="exceptions"
                              onChange={event => this.handleSwitch(event)}
                              className="custom-control-input"
                              id="exceptions"
                            />
                            <label className="custom-control-label" htmlFor="exceptions">{t('ConfiguredDashboard.Exception')}</label>
                          </div>
                        </td>
                        <td><span /></td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
           
            <div className="card_layout p-1">
              <Row>
                <Col md={12}>
                  <div>
                    <h4 className="tilte">{t('ConfiguredDashboard.listingInfo')}</h4>
                  </div>
                  <Table striped responsive>
                    <tbody>
                      <tr>
                        <td>
                          {' '}
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={listingInfoSystemUsageSummary}
                              name="listingInfoSystemUsageSummary"
                              onChange={event => this.handleSwitch(event)}
                              className="custom-control-input"
                              id="listingInfoSystemUsageSummary"
                            />
                            <label className="custom-control-label" htmlFor="listingInfoSystemUsageSummary">{t('ConfiguredDashboard.SystemUsage')}</label>
                          </div>
                        </td>
                        <td>
                          {' '}
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={listingInfoEmployeeSummarybyHour}
                              className="custom-control-input"
                              name="listingInfoEmployeeSummarybyHour"
                              onChange={event => this.handleSwitch(event)}
                              id="listingInfoEmployeeSummarybyHour"
                            />
                            <label className="custom-control-label" htmlFor="listingInfoEmployeeSummarybyHour">{t('ConfiguredDashboard.EmployeeCoverage')}</label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div className="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              checked={listingInfoShiftsAssigned}
                              name="listingInfoShiftsAssigned"
                              onChange={event => this.handleSwitch(event)}
                              className="custom-control-input"
                              id="listingInfoShiftsAssigned"
                            />
                            <label className="custom-control-label" htmlFor="listingInfoShiftsAssigned">{t('ConfiguredDashboard.AssignedShift')}</label>
                          </div>
                        </td>
                        <td />
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
        
            <div className="row">
              <div className="col-md-12 mb-3">
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                  >
                    {' '}
                    {t('CancelBtn')}
                    {' '}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => this.handleSubmit()}
                  >
                    {t('SaveBtn')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(Index);
