import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Row,
  Table,
  Col,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import './style.scss';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import Api from '../../../common/Api';
import { userService } from '../../../../services';
import ReloadIcon from '../../../../Images/Icons/reload.svg';
import Loaders from '../../../shared/Loaders';
import PaginationAndPageNumber from '../../../shared/Pagination';
import { commonService } from '../../../../services/common.service';

moment.tz.setDefault('GMT');
class ManagerSystemUsage extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    this.handleChange = this.handleChange.bind(this);
    const userId = userService.getUserId();
    this.state = {
      token: `${token}`,
      userId,
      loading: false,
      totalRecords: 0,
      pageIndex: 1,
      pageSize: 10,
      activityId: 0,
      systemData: [],
      fromDate: moment(`${moment().get('month') + 1}-01-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate(),
      toDate: moment(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate(),
      selectedId: 0,
      activities: [{ id: '0', activityTypeName: 'All' }],
      users: [{ id: '0', fullName: 'All' }],
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    Promise.all([
      this.getSystemUsage(),
      this.activityType(),
      this.getUser(),
    ]).then((response) => {
    })
      .catch((error) => {
        console.log(error);
      });
  }

  bindSubDropDowns = (ddlName, ddlValue) => {
    const defaultSelection = '0';
    if (ddlName === 'activityId') {
      if (ddlValue === defaultSelection) {
        this.setState({ activities: [{ id: '0', activityTypeName: 'All' }], activityId: 0 });
      }
    }
  }

  resetFilter = () => {
    this.setState({
      selectedId: 0,
      activityId: 0,
      fromDate: moment(`${moment().get('month') + 1}-01-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate(),
      toDate: moment(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate(),
    }, () => this.loadData());
  }

  getUser = () => {
    const {
      token, modelMessage,
    } = this.state;
    const id = userService.getUserId();
    const data = {
      id: parseInt(id, 0),
      languageId: 0,
      offset: '',
      isActive: true,
    };
    fetch(`${Api.systemUsage.getUsers}`, {
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
          this.setState({ loading: false, users: [{ id: '0', fullName: 'All' }].concat(response.data) });
        }else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getUser());
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
          });
        }
      })
  
      .catch(err => console.error(err.toString()));
  }
  
  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
        loading: false,
      }, () => this.getSystemUsage());
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
      loading: false,
    }, () => this.getSystemUsage());
  }

  activityType = () => {
    const {
      token, modelMessage,
    } = this.state;
  
    const data = {
      id: 0,
      languageId: 1,
      offset: '',
      isActive: true,
    };
    fetch(`${Api.systemUsage.activityType}`, {
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
          this.setState({ loading: false, activities: [{ id: '0', name: 'All' }].concat(response.data), activityId: 0 });
        }else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.activityType());
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
          });
        }
      })
  
      .catch(err => console.error(err.toString()));
  }

  
  getSystemUsage = () => {
    const {
      token, modelMessage, totalRecords, fromDate, toDate,
      pageIndex, pageSize, selectedId, activityId,
    } = this.state;
    const userId = userService.getUserId();
    const data = {
      id: 0,
      languageId: 1,
      offset: '',
      isActive: true,
      totalRecords,
      pageIndex: (pageSize) * (pageIndex - 1) + 1,
      pageSize,
      organisationId: 0,
      divisionId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      managerId: parseInt(userId, 0),
      userId: parseInt(selectedId, 0) || 0,
      countryId: 0,
      stateId: 0,
      city: '',
      workLocationId: 0,
      userRoleIds: '',
      activityTypeId: parseInt(activityId, 0) || 0,
      startDate: fromDate,
      endDate: toDate,
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
          const systemArray = response.data.filter(item => item.activityTypeId !== 14 && item.activityTypeId !== 15);
          this.setState({
            loading: false,
            systemData: systemArray,
            pageIndex: Math.floor(response.pageIndex / response.pageSize) + 1 || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords - 2,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getSystemUsage());
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
            loading: false,
          });
        }
      })

      .catch((err) => {
        console.error(err.toString());
        this.setState({
          loading: false,
        });
      });
  }

  handleFromDateChange(date) {
    const { toDate } = this.state;
    if ((Date.parse(toDate) < Date.parse(date))) {
      this.setState({ fromDateIsGreater: true, toDateIsSmaller: false });
    } else {
      this.setState({ fromDateIsGreater: false, toDateIsSmaller: false });
    }
    this.setState({
      fromDate: date,
    });
  }


  handleToDateChange(date) {
    const { fromDate } = this.state;
    if ((Date.parse(date) < Date.parse(fromDate))) {
      this.setState({ toDateIsSmaller: true, fromDateIsGreater: false });
    } else {
      this.setState({ toDateIsSmaller: false, fromDateIsGreater: false });
    }
    this.setState({
      toDate: date,
    });
  }


  handleChange(event) {
    const { target } = event;
    const { name } = target;
    this.setState({ [name]: target.value }, () => this.bindSubDropDowns(name, target.value));
  }

  submitRequest() {
    this.setState({ loading: true }, () => this.getSystemUsage());
  }

  handleRefresh() {
    this.setState({ systemData: [] });
    this.getSystemUsage();
  }

  render() {
    const {
      loading, activities, users, selectedId, activityId, userId,
      toDate, fromDate, fromDateIsGreater, toDateIsSmaller, systemData, totalRecords, pageSize, pageIndex,
    } = this.state;
    const { t } = this.props;
    const isEnabled = selectedId > 0 || activityId > 0 || toDate.toDateString() !== new Date().toDateString() || fromDate.toDateString() !== new Date(`${new Date().getMonth() + 1}/01/${new Date().getFullYear()}`).toDateString();
    return (
      <>
        <div className="container-fluid coverage">
          <Card className="card_layout">
            <Row>
              <Col lg={4}>
                <Form.Label>
                  {t('SystemUsage.Users')}
                </Form.Label>
                <Form.Control name="selectedId" value={selectedId} as="select" onChange={this.handleChange}>
                  {users.map(user => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.fullName}
                    </option>
                  ))}
                </Form.Control>
              </Col>
              <Col lg={4}>
                <Form.Label htmlFor={fromDate}>{t('SystemUsage.StartDate')}</Form.Label>
                <DatePicker
                  name="fromDate"
                  selected={fromDate}
                  onChange={this.handleFromDateChange}
                  placeholderText="MM/DD/YYYY"
                  dateFormat="MM/dd/yyyy"
                  className="form-control cal_icon"
                  pattern="\d{2}\/\d{2}/\d{4}"
                />
                {fromDateIsGreater
                      && <div className="text-danger">{t('SystemUsage.StartDate_reqText')}</div>
                    }
              </Col>

              <Col lg={4}>
                <Form.Label htmlFor={toDate}>{t('SystemUsage.EndDate')}</Form.Label>
                <DatePicker
                  selected={toDate}
                  onChange={this.handleToDateChange}
                  name="toDate"
                  dateFormat="MM/dd/yyyy"
                  className="form-control cal_icon"
                  placeholderText="MM/DD/YYYY"
                  pattern="\d{2}\/\d{2}/\d{4}"
                />
                {toDateIsSmaller
                      && <div className="text-danger">{t('SystemUsage.EndDate_reqText')}</div>
                    }
              </Col>
              <Col lg={4}>
                <Form.Label>
                  {t('SystemUsage.ActivityType')}
                </Form.Label>
                <Form.Control name="activityId" value={activityId} as="select" onChange={this.handleChange}>
                  {activities.map(activity => (
                    <option
                      key={activity.id}
                      value={activity.id}
                    >
                      {activity.activityTypeName}
                    </option>
                  ))}
                </Form.Control>
              </Col>
              <Col lg={4}>
                <div className="d-flex justify-content-center flex-column">
                  <Button className="" onClick={() => this.submitRequest()}>
                    {' '}
                    {t('SystemUsage.Search')}
                    {' '}
                  </Button>
                </div>
              </Col>
              <Col lg={4}>
                {isEnabled && (
                <div className="d-flex justify-content-center flex-column">
                  <Button onClick={() => this.resetFilter()}>Reset Filter</Button>
                </div>
                )}
              </Col>
            </Row>
          </Card>
          <div className="card_layout p-0">
            {loading
              ? (
                <Loaders />
              )
              : (
                <>
                  <Row className="reloadBtn">
                    <button type="button" className="arrowBtn mx-2" onClick={() => this.handleRefresh()}><img className="pointer" src={ReloadIcon} alt="reload icon" /></button>
                  </Row>
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>{t('SystemUsage.Sr')}</th>
                        <th className="text-left">{t('SystemUsage.Activity')}</th>
                        <th>{t('SystemUsage.Count')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      { systemData && systemData.map((data, index) => (
                        <tr>
                          <td>{pageSize * (pageIndex - 1) + index + 1 }</td>
                          <td className="text-left">{data.activityTypeName}</td>
                          <td>
                            <Link className="linkLine" to={`/adminDashboard/usageDetails/?roleId=1&activityName=${data.activityTypeName}&activityId=${data.activityTypeId}&fromDate=${moment.utc(fromDate).local().format('MM/DD/YYYY')}&toDate=${moment.utc(toDate).local().format('MM/DD/YYYY')}&managerId=${userId}&userId=${selectedId}`}>
                              {data.activityCount}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
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

export default (withTranslation()(ManagerSystemUsage));
