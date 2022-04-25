import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Table, Row, Button, Col,
} from 'react-bootstrap';
import moment from 'moment';
import './style.scss';
import Api from '../../../common/Api';
import LoadingSpinner from '../../../shared/Loaders';
import { userService } from '../../../../services';
import PaginationAndPageNumber from '../../../shared/Pagination';

class UsageDetails extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    this.handleChange = this.handleChange.bind(this);
    const urlParams = new URLSearchParams(window.location.search);
    this.state = {
      token: `${token}`,
      loading: true,
      totalRecords: 0,
      pageIndex: 1,
      pageSize: 10,
      contractTypeId: 0,
      usageDetails: [],
      fromDate: moment.utc(urlParams.get('fromDate'), 'MM/DD/YYYY'),
      toDate: moment.utc(urlParams.get('toDate'), 'MM/DD/YYYY'),
      managerId: urlParams.get('managerId'),
      userId: urlParams.get('userId'),
      activityType: urlParams.get('activityId'),
      divisionId: urlParams.get('divisionId'),
      departmentId: urlParams.get('departmentId'),
      businessUnitId: urlParams.get('businessUnitId'),
      teamId: urlParams.get('teamId'),
      stateId: urlParams.get('stateId'),
      countryId: urlParams.get('countryId'),
      activityName: urlParams.get('activityName'),
    };
  }

  componentDidMount() {
    this.getUsageDetails();
  }

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
        loading: true,
      }, () => this.getUsageDetails());
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
      loading: true,
    }, () => this.getUsageDetails());
  }

  getUsageDetails = () => {
    const {
      token, modelMessage, totalRecords, fromDate, toDate,
      pageIndex, pageSize, managerId, activityType,
      divisionId, countryId, departmentId, teamId, userId, contractTypeId,
      locationId, businessUnitId, stateId,
    } = this.state;
    const data = {
      id: 0,
      languageId: 1,
      offset: '',
      isActive: true,
      totalRecords,
      pageIndex: (pageSize) * (pageIndex - 1) + 1,
      pageSize,
      city: '',
      workLocationId: parseInt(locationId, 0) || 0,
      divisionId: parseInt(divisionId, 0) || 0,
      businessUnitId: parseInt(businessUnitId, 0) || 0,
      departmentId: parseInt(departmentId, 0) || 0,
      teamId: parseInt(teamId, 0) || 0,
      managerId: Number(managerId) || Number(userId),
      userId: parseInt(userId, 0) || 0,
      contractTypeId: parseInt(contractTypeId, 0) || 0,
      countryId: parseInt(countryId, 0) || 0,
      stateId: parseInt(stateId, 0) || 0,
      userRoleIds: '',
      activityTypeId: Number(activityType),
      startDate: fromDate,
      endDate: toDate,
    };
    // debugger
    fetch(`${Api.systemUsage.usageDetails}`, {
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
            usageDetails: response.data,
            pageIndex: Math.floor(response.pageIndex / response.pageSize) + 1 || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
            loading: false,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getUsageDetails());
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
            loading: false,
          });
        }
      })

      .catch(err => console.error(err.toString()));
  }

  schedulePublishedTableData = () => {
    const { usageDetails, pageIndex, pageSize } = this.state;
    const { t } = this.props;
    return (
      <>
        <Table responsive striped>
          <thead>
            <tr>
              <th>{t('SystemUsage.Sr')}</th>
              <th className="text-left">{t('SystemUsage.ScheduleName')}</th>
              <th className="text-left">{t('SystemUsage.DateRange')}</th>
              <th>{t('SystemUsage.DaysCovered')}</th>
              <th>{t('SystemUsage.HoursCovered')}</th>
              <th>{t('SystemUsage.NumberPeople')}</th>
            </tr>
          </thead>
          { usageDetails && (
          <tbody>
            {usageDetails && usageDetails.map((data, index) => (
              <tr>
                <td>{pageSize * (pageIndex - 1) + index + 1}</td>
                <td className="text-left">{data.title}</td>
                <td className="text-left">
                  {moment.utc(data.startOnUtc).local().format('L')}
                  {' '}
                  to
                  {' '}
                  {moment.utc(data.endOnUtc).local().format('L')}
                </td>
                <td>{data.daysToBeCovered}</td>
                <td>{data.hoursToBeCovered}</td>
                <td>{data.numberOfPeopleInSchedule}</td>
              </tr>
            ))}
          </tbody>
          )}
        </Table>
        { usageDetails.length === 0 && (
          <p className="text-center p-3">No data available</p>
        )}
      </>
    );
  }

  shiftsPublishedTableData = () => {
    const { usageDetails, pageIndex, pageSize } = this.state;
    const { t } = this.props;
    return (
      <>
        <Table responsive striped>
          <thead>
            <tr>
              <th>{ t('SystemUsage.Sr') }</th>
              <th className="text-left">{ t('SystemUsage.ShiftName')}</th>
              <th>{ t('SystemUsage.StartTime')}</th>
              <th>{ t('SystemUsage.EndTime')}</th>
            </tr>
          </thead>
          { usageDetails && (
          <tbody>
            {usageDetails && usageDetails.map((data, index) => (
              <tr>
                <td>{pageSize * (pageIndex - 1) + index + 1}</td>
                <td className="text-left">{data.title}</td>
                <td>
                  {`${moment.utc(data.startDateTimeUtc).local().format('L')}-${moment.utc(data.startDateTimeUtc).local().format('LT')}`}
                </td>
                <td>
                  {data.endDateTimeUtc ? `${moment.utc(data.endDateTimeUtc).local().format('L')}-${moment.utc(data.endDateTimeUtc).local().format('LT')}` : ' - '}
                </td>
              </tr>
            ))}
          </tbody>
          )}
        </Table>
        { usageDetails.length === 0 && (
          <p className="text-center p-3">No data available</p>
        )}
      </>
    );
  }

  absentRequestAcceptedTableData = () => {
    const { usageDetails, pageIndex, pageSize } = this.state;
    const { t } = this.props;
    return (
      <>
        <Table responsive striped>
          <thead>
            <tr>
              <th>{ t('SystemUsage.Sr')}</th>
              <th className="text-left">{ t('SystemUsage.ParentLeaveTypeName')}</th>
              <th>{ t('SystemUsage.StartDate')}</th>
              <th>{ t('SystemUsage.EndDate')}</th>
              <th className="text-left">{ t('SystemUsage.FromSession')}</th>
              <th className="text-left">{ t('SystemUsage.ToSession')}</th>
              <th className="text-left">{ t('SystemUsage.AppliedBy')}</th>
              <th className="text-left">{ t('SystemUsage.AppliedTo')}</th>
              
            </tr>
          </thead>
          { usageDetails && (
          <tbody>
            {usageDetails && usageDetails.map((data, index) => (
              <tr>
                <td>{pageSize * (pageIndex - 1) + index + 1}</td>
                <td className="text-left">{data.parentLeaveTypeName}</td>
                <td>
                  {moment.utc(data.fromDateTimeUtc).local().format('L')}
                </td>
                <td>
                  {moment.utc(data.toDateTimeUtc).local().format('L')}
                </td>
                <td className="text-left">{data.strFromSession}</td>
                <td className="text-left">{data.strToSession}</td>
                <td className="text-left">{data.appliedByUser}</td>
                <td className="text-left">{data.appliedToSecondaryUser}</td>
              </tr>
            ))}
          </tbody>
          )}
        </Table>
        { usageDetails.length === 0 && (
        <p className="text-center p-3">No data available</p>
        )}
      </>
    );
  }

  reportsGeneratedTableData = () => {
    const { usageDetails, pageIndex, pageSize } = this.state;
    const { t } = this.props;
    return (
      <>
        <Table responsive striped>
          <thead>
            <tr>
              <th>{ t('SystemUsage.Sr')}</th>
              <th className="text-left">{ t('SystemUsage.ReportName')}</th>
              <th>{ t('SystemUsage.DateRange')}</th>
              <th>{ t('SystemUsage.GeneratedOn')}</th>
              <th className="text-left">{ t('SystemUsage.GeneratedBy')}</th>
            </tr>
          </thead>
          { usageDetails && (
          <tbody>
            {usageDetails && usageDetails.map((data, index) => (
              <tr>
                <td>{pageSize * (pageIndex - 1) + index + 1}</td>
                <td className="text-left">{data.actionName}</td>
                <td>{data.dateRange}</td>
                <td>
                  {moment.utc(data.createdOnUtc).local().format('L')}
                </td>
                <td className="text-left">{data.userName}</td>
              </tr>
            ))}
          </tbody>
          )}
        </Table>
        { usageDetails.length === 0 && (
        <p className="text-center p-3">No data available</p>
        )}
      </>
    );
  }

  editedTimesheetTableData = () => {
    const { usageDetails, pageIndex, pageSize } = this.state;
    const { t } = this.props;
    return (
      <>
        <Table responsive striped>
          <thead>
            <tr>
              <th>{ t('SystemUsage.Sr')}</th>
              <th>{ t('SystemUsage.Date')}</th>
              <th className="text-left">{ t('SystemUsage.ShiftName')}</th>
              <th className="text-left">{ t('SystemUsage.EmployeeName')}</th>
              <th className="text-left">{ t('SystemUsage.ManagerName')}</th>
            </tr>
          </thead>
          { usageDetails && (
          <tbody>
            {usageDetails && usageDetails.map((data, index) => (
              <tr>
                <td>{pageSize * (pageIndex - 1) + index + 1}</td>
                <td>{ data.shiftStartTime ? moment.utc(data.shiftStartTime).local().format('L') : ''}</td>
                <td className="text-left">{data.title}</td>
                <td className="text-left">{data.userName}</td>
                <td className="text-left">{data.managerName}</td>
              </tr>
            ))}
          </tbody>
          )}
        </Table>
        { usageDetails.length === 0 && (
        <p className="text-center p-3">No data available</p>
        )}
      </>
    );
  }

  goToBack = () => {
    const { history } = this.props;
    const {
      activityType, fromDate, toDate, userId, managerId, locationId,
      departmentId, businessUnitId, divisionId, teamId, countryId, stateId, employeesId, cityId,
    } = this.state;
    const userRoles = userService.getRole();
    let isAdministratorRole = false;
    if (userRoles.find(role => role.name === 'Administrators')) {
      isAdministratorRole = true;
    } else {
      isAdministratorRole = false;
    }
    if (isAdministratorRole) {
      history.push(`/adminDashboard/systemUsage/?roleId=1&activityId=${activityType}&fromDate=${moment.utc(fromDate).local().format('L')}&toDate=${moment.utc(toDate).local().format('L')}&managerId=${managerId}&departmentId=${departmentId}&businessUnitId=${businessUnitId}&divisionId=${divisionId}&teamId=${teamId}&userId=${userId}&countryId=${countryId}&stateId=${stateId}&cityId=${cityId}&workLocationId=${locationId}`);
    } else {
      history.push(`/managerDashboard/systemUsage/?roleId=1&activityId=${activityType}&fromDate=${moment.utc(fromDate).local().format('L')}&toDate=${moment.utc(toDate).local().format('L')}&managerId=${managerId}&userId=${userId}`);
    }
  }

  handleChange(event) {
    const { target } = event;
    const { name } = target;
    this.setState({ [name]: target.value }, () => {
      this.getSystemUsage();
    });
  }
  
  render() {
    const {
      loading, activityType, totalRecords, pageSize, pageIndex, activityName,
    } = this.state;
    return (
      <>
        <div className="container-fluid coverage">
          <div className="card_layout p-0">
            {loading
              && (
                <div className="customloader">
                  <LoadingSpinner />
                </div>
              )
            }
            {
              !loading && (
                <>
                  <div className="activityStyle">
                    <Row className="align-items-center">
                      <Col>
                        <h4 className="mb-0">{activityName}</h4>
                      </Col>
                      <Col sm={4} className="title">
                        <Button onClick={() => this.goToBack()}>Back</Button>
                      </Col>
                      
                    </Row>
                  </div>
                  <div>
                    {Number(activityType) === 1 && (
                      this.schedulePublishedTableData()
                    )}
                    {(Number(activityType) === 2 || Number(activityType) === 3
                    || Number(activityType) === 4
                    || Number(activityType) === 5 || Number(activityType) === 6
                    || Number(activityType) === 7 || Number(activityType) === 8) && (
                      this.shiftsPublishedTableData()
                    )}
                    {(Number(activityType) === 9 || Number(activityType) === 10
                    || Number(activityType) === 11) && (
                      this.absentRequestAcceptedTableData()
                    )}
                    {Number(activityType) === 12 && (
                      this.reportsGeneratedTableData()
                    )}
                    {Number(activityType) === 13 && (
                      this.editedTimesheetTableData()
                    )}
                  </div>
                </>
              )
            }
          </div>
          {
                    totalRecords > 0 && (
                    <div className="pageDiv">
                      <PaginationAndPageNumber
                        totalPageCount={Math.ceil(totalRecords / pageSize)}
                        totalElementCount={totalRecords}
                        updatePageNum={this.updatePageNum}
                        updatePageCount={this.updatePageCount}
                        currentPageNum={pageIndex}
                        recordPerPage={pageSize}
                      />
                    </div>
                    )
          }
        </div>
      </>
    );
  }
}

export default (withTranslation()(UsageDetails));
