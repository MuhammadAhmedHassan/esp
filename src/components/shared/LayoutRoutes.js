/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Header from './Header';
import SideBar from './Sidebar/index';
import AdminBreadcrumb from './Breadcrumb/index';
import MyProfile from '../Admin/MyProfile/index';
import LeaveManagement from '../Admin/LeaveManagement/index';
import LeaveBalanceIndex from '../Admin/LeaveManagement/LeaveBalance/index';
import AppliedLeaveIndex from '../Admin/LeaveManagement/AppliedLeave/index';
import AppliedLeavesIndex from '../Admin/Reports/AppliedLeaves/index';
import Logout from './Logout/Logout';
import HolidayCalendar from '../Admin/LeaveManagement/HolidayCalendar';
import ManageRequests from '../Admin/ManageRequests/LeaveRequests/index';
import LeaveDetailBalance from '../Admin/LeaveManagement/LeaveBalance/LeaveDetailBalance';
import ManageEmployee from '../Admin/ManageEmployee/index';
import CreateSchedule from '../Admin/CreateSchedule/index';
import CreateShift from '../Admin/CreateShift/index';
import ShiftTemplate from '../Admin/CreateShift/ShiftTemplate';
import ViewSchedule from '../Admin/ViewSchedule/index';
import Schedule from '../Admin/Schedule/index';
import ScrollToTop from '../common/scrollToTop';
import CreateGeofence from '../Admin/ManageLocation/CreateGeofence';
import LocationListing from '../Admin/ManageLocation/LocationListing';
import UserRole from '../Admin/UserRole/index';
import ACL from '../Admin/ACL/index';
import SwapTime from '../Admin/ManageRequests/ExceptionRequests/SwapTime/MyRequest';
import OtherRequests from '../Admin/ManageRequests/ExceptionRequests/SwapTime/OtherRequest';
import LeaveDetails from '../Admin/LeaveManagement/AppliedLeave/LeaveDetails';
import EmpDashBoard from '../Admin/Dashboard/Profile';
import EmployeePunchLog from '../Admin/PunchLogs/Employee';
import ManagerPunchLog from '../Admin/PunchLogs/ManagerLog';
import EmployeeOverTime from '../Admin/ManageRequests/ExceptionRequests/OverTime/EmployeeOverTime';
import ManagerOverTime from '../Admin/ManageRequests/ExceptionRequests/OverTime/ManagerOverTime';
import AdminOverTime from '../Admin/ManageRequests/ExceptionRequests/OverTime/AdminOverTime';
import LanguageIndex from '../Admin/LanguageTranslator';
import ConfigureDashboard from '../Admin/ConfigureDashboard/Index';
import AdminDashboard from '../Admin/AdminDashboard';
import TimeSheet from '../Admin/TimeSheet/index';
import SeeScheduler from '../Admin/SeeScheduler/index';
import SwapShift from '../Admin/SwapShift/index';
import Reports from '../Admin/Reports';
import ShiftApproval from '../Admin/EmployeeShift/index';
import MngShiftApproval from '../Admin/ManagerShift/index';
import ShiftTemplateListing from '../Admin/ShiftTemplate/index';
import ViewProfileIndex from '../Admin/MyProfile/ViewProfile';
import MyScheduler from '../Admin/SeeScheduler/MySchedule';
import ShiftDetail from '../Admin/ShiftDetail/ShiftDetail';
import AdminSetting from '../Admin/Settings/index';
import ExceptionReports from '../Admin/Reports/ExceptionReports';
import OverTimeReports from '../Admin/Reports/Over Time Report';
import ManageRequestsException from '../Admin/ManageRequests/ExceptionRequests/Exception';
import Notifications from '../Admin/Notifications';
// Routes
import Api from '../common/Api';
// User Services
import { userService } from '../../services/user.service';
import { PrivateRoute } from '../../helper';

// import Delegation from '../Admin/delegation/delegation';
import AddDelegators from '../Admin/delegation/AddDelegators';
import DelegatorAs from '../Admin/delegation/DelegateAs';
import LogHistoryDelegator from '../Admin/delegation/LogHistoryDelegator';
import RecentDelegator from '../Admin/delegation/RecentDelegatorDetail';
import HistoryDelegator from '../Admin/delegation/HistoryDelegatorDetail';
import ExceptionReport from '../Admin/Reports/Exceptions';
import Consent from '../Admin/GDPRConsent/Consent';
import OverTimeReport from '../Admin/Reports/OverTimeReport';
import GdprSetting from '../Admin/GDPR/index';
import AddConsent from '../Admin/GDPR/addConsent';
import EditConsent from '../Admin/GDPR/editConsent';
import UserDelete from '../Admin/UserDelete/index';
import MonthlyComparison from '../Admin/EmployeeShift/monthlyComparison';
import VacationBalance from '../Admin/Reports/VacationBalance';
import AdminEmployeeCoverage from '../Admin/AdminDashboard/EmployeeCoverage/AdminEmployeeCoverage';
import ManagerEmployeeCoverage from '../Admin/AdminDashboard/EmployeeCoverage/ManagerEmployeeCoverage';
import ManagerShift from '../Admin/ManagerShift/Role/index';
import AdminSystemUsage from '../Admin/AdminDashboard/SystemUsage/adminSystemUsage';
import UsageDetails from '../Admin/AdminDashboard/SystemUsage/usageDetails';
import ManagerSystemUsage from '../Admin/AdminDashboard/SystemUsage/managerSystemUsage';
// import OverTimeReport from '../Admin/Reports/OverTimeReport';
import ChangeTime from '../Admin/ManageRequests/ExceptionRequests/ChangeTime/index';
// import LeaveBalanceReport from '../Admin/Reports/AppliedLeaves/index';
import Exception from '../Admin/AdminDashboard/Exception/index';
import PendingTimeSheet from '../Admin/AdminDashboard/PendingTimeSheet/index';
import PendingAbsence from '../Admin/AdminDashboard/PendingAbsence/index';
import PendingOvertime from '../Admin/AdminDashboard/PendingOvertime/index';
import ManagerChangeTimeSheet from '../Admin/AdminDashboard/PendingTimeSheet/managersheet';
import ViewOverTime from '../Admin/AdminDashboard/PendingOvertime/OverTime';
import ManagerAbsence from '../Admin/AdminDashboard/PendingAbsence/ManagerAbsence';

class LayoutRoutes extends Component {
  constructor(props) {
    super(props);
    const access = sessionStorage.getItem('userAccess');
    const user = userService.getUser();
    this.state = {
      languageId: 1,
      access,
      user,
      accessMessage: 'Loading...',
    };
  }

  componentDidMount() {
    const { access } = this.state;
    if (!access) this.loadData();
  }

  loadData = () => {
    const { languageId, user } = this.state;
    const data = {
      id: user.userId || user.userId,
      languageId,
      offset: 'string',
      isActive: true,
    };
    fetch(`${Api.getRoleByUserId}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: userService.getToken(),
      }),
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          sessionStorage.setItem('userAccess', JSON.stringify(response.data));
          this.setState({ access: JSON.stringify(response.data) });
        } else {
          this.setState({ accessMessage: response.message });
        }
      }).catch((err) => {
        console.warn(err);
      });
  }

  render() {
    const {
      setSidebarEnabled, isSidebarEnabled, setBreadcrumbData, breadcrumbData,
    } = this.props;
    const {
      access, accessMessage,
    } = this.state;

    if (!access) {
      return (
        <Router>
          <Header />
          <h3 className="text-center mt-5 UnauthorizedMessage">{accessMessage}</h3>
          <>
            <Switch>
              <Route exact component={Logout} path="/logout" />
            </Switch>
          </>
        </Router>
      );
    }

    return (
      <Router>
        <Header />

        <div id="wrapper" className={`${isSidebarEnabled ? 'toggled' : ''}`}>
          <SideBar setBreadcrumbData={setBreadcrumbData} />
          <div id="page-content-wrapper">
            <AdminBreadcrumb
              isSidebarEnabled={isSidebarEnabled}
              setSidebarEnabled={setSidebarEnabled}
              breadcrumbData={breadcrumbData}
            />
            <ScrollToTop>
              <Switch>
                <Route exact component={Logout} path="/logout" />
                <Route exact component={ViewProfileIndex} path="/profile" />
                <Route exact component={Exception} path="/exception" />
                <Route exact component={PendingTimeSheet} path="/pending-timesheet" />
                <Route exact component={PendingAbsence} path="/pending-absence" />
                <Route exact component={PendingOvertime} path="/pending-overtime" />
                <Route exact component={ManagerChangeTimeSheet} path="/change-timesheet" />
                <Route exact component={ViewOverTime} path="/view-overtime" />
                <Route exact component={ManagerAbsence} path="/view-absence" />

                <>
                  {/* <Route exact component={AdminDashboard} path="/" /> */}
                  <PrivateRoute
                    exact
                    screenKey="Dashboard"
                    component={userService.isEmployee() ? EmpDashBoard : AdminDashboard}
                    path="/"
                  />
                  <PrivateRoute
                    exact
                    screenKey="OverTimeReport"
                    component={OverTimeReport}
                    path="/reports/over-time-report"
                  />
                  <PrivateRoute
                    exact
                    screenKey="LeaveBalanceReport"
                    component={AppliedLeavesIndex}
                    path="/reports/leave-balance-report"
                  />
                  <PrivateRoute
                    exact
                    screenKey="ExceptionsReport"
                    component={ExceptionReport}
                    path="/reports/exceptions-report"
                  />
                  <PrivateRoute
                    exact
                    screenKey="ApplyVacation"
                    component={LeaveManagement}
                    path="/vacation-management/my-vacation/apply-vacation"
                  />
                  <PrivateRoute
                    exact
                    screenKey="VacationBalance"
                    component={LeaveDetailBalance}
                    setBreadcrumbData={setBreadcrumbData}
                    path="/vacation-management/vacation-balance/vacation-details/:id/:year?"
                  />
                  <PrivateRoute
                    exact
                    screenKey="VacationBalance"
                    component={LeaveBalanceIndex}
                    path="/vacation-management/vacation-balance"
                  />
                  <PrivateRoute
                    exact
                    component={HolidayCalendar}
                    path="/vacation-management/holiday-calendar"
                    screenKey="HolidayCalendar"
                  />
                  <PrivateRoute
                    exact
                    component={AppliedLeaveIndex}
                    path="/vacation-management/my-vacation/applied-vacation"
                    screenKey="AppliedVacation"
                  />
                  <PrivateRoute
                    exact
                    screenKey="AppliedVacation"
                    component={LeaveDetails}
                    path="/vacation-management/my-vacation/applied-vacation/view-details/:id,:parentLeaveTypeId"
                  />
                    
                  <PrivateRoute
                    exact
                    screenKey="VacationRequest"
                    component={ManageRequests}
                    path="/manage-requests/vacation-requests"
                  />
                  <PrivateRoute
                    exact
                    screenKey="ManageEmployee"
                    component={ManageEmployee}
                    path="/manage-employee"
                  />
                  <PrivateRoute
                    exact
                    screenKey="AppliedVacation"
                    component={LeaveDetails}
                    path="/vacation-management/my-vacation/applied-vacation/view-details/:id,:parentLeaveTypeId,:appliedByUserId"
                  />
                  <PrivateRoute
                    exact
                    screenKey="Schedule"
                    component={ViewSchedule}
                    path="/schedule/view-schedule"
                  />
                  <PrivateRoute
                    exact
                    screenKey="Schedule"
                    component={Schedule}
                    path="/schedule/view-schedule/:scheduleId"
                  />
                  <PrivateRoute
                    exact
                    screenKey="Schedule"
                    component={CreateSchedule}
                    path="/schedule/create-schedule"
                  />
                  <PrivateRoute
                    exact
                    screenKey="SwapRequest"
                    component={SwapTime}
                    path="/manage-requests/exception-request/swap-time"
                  />
                  <PrivateRoute
                    exact
                    screenKey=""
                    component={OtherRequests}
                    path="/swap-time/Others-request"
                  />
                  <PrivateRoute
                    exact
                    screenKey="CreateGeofence"
                    component={CreateGeofence}
                    path="/manage-location/create-geofence"
                  />
                  <PrivateRoute
                    exact
                    screenKey="CreateGeofence"
                    component={CreateGeofence}
                    path="/manage-location/geofence/:id/:true"
                  />
                  <PrivateRoute
                    exact
                    screenKey="LocationListing"
                    component={LocationListing}
                    path="/manage-location/location-listing"
                  />
                  <PrivateRoute
                    exact
                    screenKey=""
                    component={CreateShift}
                    path="/schedule/create-shift"
                  />
                  <PrivateRoute
                    exact
                    screenKey="UserRoles"
                    component={UserRole}
                    path="/user-role"
                  />
                  <PrivateRoute
                    exact
                    screenKey="ACL"
                    component={ACL}
                    path="/acl"
                  />
                  <PrivateRoute
                    exact
                    screenKey="MyTimesheet"
                    component={TimeSheet}
                    path="/timesheet"
                  />
                  <PrivateRoute
                    exact
                    screenKey="PunchLogs"
                    component={EmployeePunchLog}
                    path="/punchlog-employee"
                  />
                  <PrivateRoute
                    exact
                    screenKey="TeamPunchlog"
                    component={ManagerPunchLog}
                    path="/punchlog-manager"
                  />
                  <PrivateRoute
                    exact
                    screenKey="OverTime"
                    component={EmployeeOverTime}
                    path="/overtime-employee"
                  />
                  <PrivateRoute
                    exact
                    screenKey="OverTime"
                    component={ManagerOverTime}
                    path="/overtime-manager"
                  />
                  <PrivateRoute
                    exact
                    screenKey="OverTime"
                    component={AdminOverTime}
                    path="/overtime-admin"
                  />
                  <PrivateRoute
                    exact
                    screenKey="ManageTranslation"
                    component={LanguageIndex}
                    path="/language-translator"
                  />
                  <PrivateRoute
                    exact
                    screenKey="ConfigurableDashboard"
                    component={ConfigureDashboard}
                    path="/configure-dashboard"
                  />
                  <PrivateRoute
                    exact
                    screenKey=""
                    component={SeeScheduler}
                    path="/schedule/scheduler"
                  />
                  <PrivateRoute
                    exact
                    screenKey=""
                    component={SwapShift}
                    path="/schedule/swap-shift"
                  />
                  <PrivateRoute
                    exact
                    screenKey=""
                    component={ViewProfileIndex}
                    path="/profile/:id/:view"
                  />
                  <PrivateRoute
                    exact
                    screenKey=""
                    component={ViewProfileIndex}
                    path="/profile/:id"
                  />
                  <PrivateRoute
                    exact
                    screenKey=""
                    component={ShiftApproval}
                    path="/employee-shift-approval"
                  />
                  <PrivateRoute
                    exact
                    screenKey=""
                    component={MngShiftApproval}
                    path="/manager-shift-approval"
                  />
                  <PrivateRoute
                    exact
                    screenKey="ShiftTemplate"
                    component={ShiftTemplateListing}
                    path="/shift/shift-template"
                  />
                  <PrivateRoute
                    exact
                    screenKey="ShiftTemplate"
                    component={ShiftTemplate}
                    path="/schedule/shift-template"
                  />
                  <PrivateRoute
                    exact
                    screenKey="MySchedule"
                    component={MyScheduler}
                    path="/schedule/my-schedule"
                  />
                  <PrivateRoute
                    exact
                    screenKey="MyDelegators"
                    component={AddDelegators}
                    path="/delegation/add-delegators"
                  />
                  <PrivateRoute
                    exact
                    screenKey="DelegateAs"
                    component={DelegatorAs}
                    path="/delegation/delegator-as"
                  />
                  <PrivateRoute
                    exact
                    screenKey="LogHistory"
                    component={LogHistoryDelegator}
                    path="/delegation/log-history"
                  />
                  <PrivateRoute
                    exact
                    screenKey="LogHistory"
                    component={RecentDelegator}
                    path="/delegation/recent/:id/:pageType"
                  />
                  <PrivateRoute
                    exact
                    screenKey="LogHistory"
                    component={HistoryDelegator}
                    path="/delegation/history/:id/:pageType"
                  />
                  <PrivateRoute
                    exact
                    screenKey="ViewShiftDetails"
                    component={ShiftDetail}
                    path="/shift-detail/:id/:uId"
                  />
                  <PrivateRoute
                    exact
                    screenKey="GDPRConsentListing"
                    component={Consent}
                    path="/gdpr/consent"
                  />
                  <PrivateRoute
                    exact
                    screenKey="GDPR"
                    component={GdprSetting}
                    path="/gdpr-setting"
                  />
                  <PrivateRoute
                    exact
                    screenKey="GDPR"
                    component={AddConsent}
                    path="/gdpr-setting/addConsent"
                  />
                  <PrivateRoute
                    exact
                    screenKey="GDPR"
                    component={EditConsent}
                    path="/gdpr-setting/edit/:consentId"
                  />
                  <PrivateRoute
                    exact
                    screenKey="GDPR"
                    component={UserDelete}
                    path="/user-delete"
                  />
                  <PrivateRoute
                    exact
                    screenKey="MonthlyComparisonReportShowingOverTime"
                    component={MonthlyComparison}
                    path="/employee-shift-monthly-comparison"
                  />
                  <PrivateRoute
                    exact
                    screenKey="GeneralSettings"
                    component={AdminSetting}
                    path="/configuration/general-settings"
                  />
                  <PrivateRoute
                    exact
                    screenKey="LeaveBalanceReport"
                    component={VacationBalance}
                    path="/reports/leave-balance"
                  />
                  <PrivateRoute
                    exact
                    screenKey="HoursWorkedReport"
                    component={Reports}
                    path="/reports/hours"
                  />
                  <PrivateRoute
                    exact
                    screenKey="ShiftHistoryReport"
                    component={ManagerShift}
                    path="/manager-Shift-history"
                  />
                  <PrivateRoute
                    exact
                    screenKey="ExceptionRequest"
                    component={ExceptionReports}
                    path="/reports/exceptions"
                  />
                  <PrivateRoute
                    exact
                    screenKey="ChangeTime"
                    component={ChangeTime}
                    path="/change-time"
                  />
                  <PrivateRoute
                    exact
                    screenKey="OverTimeReport"
                    component={OverTimeReports}
                    path="/reports/over-time"
                  />
                  <PrivateRoute
                    exact
                    screenKey="OverTimeReport"
                    component={AdminEmployeeCoverage}
                    path="/admin-dashboard/admin-employee"
                  />
                  <PrivateRoute
                    exact
                    screenKey=""
                    component={ManagerEmployeeCoverage}
                    path="/admin-dashboard/manage-employee"
                  />
                  <PrivateRoute
                    exact
                    screenKey=""
                    component={ManagerSystemUsage}
                    path="/managerDashboard/systemUsage"
                  />
                  <PrivateRoute
                    exact
                    screenKey=""
                    component={AdminSystemUsage}
                    path="/adminDashboard/systemUsage"
                  />
                  <PrivateRoute
                    exact
                    screenKey=""
                    component={UsageDetails}
                    path="/adminDashboard/usageDetails"
                  />
                  <PrivateRoute
                    exact
                    screenKey="ExceptionRequest"
                    component={ManageRequestsException}
                    path="/request/exceptions"
                  />
                  <PrivateRoute
                    exact
                    screenKey="NotificationsInTopmenu"
                    component={Notifications}
                    path="/notification"
                  />
                </>
              </Switch>
            </ScrollToTop>
          </div>
        </div>
      </Router>
    );
  }
}
export default LayoutRoutes;
