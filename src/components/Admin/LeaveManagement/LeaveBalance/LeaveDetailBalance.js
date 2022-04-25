import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Table, Container, Row, Col,
} from 'react-bootstrap';
import '../style.scss';
import { userService } from '../../../../services';
import Api from '../../../common/Api';
import { LeaveGraph } from '../../../common/Charts/BarGraph';
import PaginationAndPageNumber from '../../../shared/Pagination/index';
import { commonService } from '../../../../services/common.service';

const { localizedDate } = commonService;

class LeaveDetailBalance extends React.Component {
  constructor(props) {
    super(props);
    const { match, setBreadcrumbData } = this.props;
    const token = userService.getToken();
    let userId = userService.getUserId();
    if (this.props.location && this.props.location.state && this.props.location.state.userId) {
      userId = this.props.location.state.userId;
    }
    if (match.params && match.params.userId) {
      userId = match.params.userId;
    }
    // const userId = parseInt(this.props.location.state.userId || match.params.userId || userService.getUserId(), 10);
    // setBreadcrumbData({ title: 'Vacation Management/Vacation Balance/Vacation Details', link: '/vacation-management/vacation-balance/vacation-details' });
    this.state = {
      token: `${token}`,
      currentYear: `${new Date().getFullYear()}`,
      userId,
      yearName: '2021',
      leaveTypesBalance: [],
      userAppliedLeaves: [],
      monthWiseLeaves: [],
      leaveTypeId: parseInt(match.params.id || 0, 10),
      data: [],
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
      loaded: false,
    };
  }

  componentDidMount() {
    let selectedYear = '';
    if (this.props.location.state && this.props.location.state.year) {
      selectedYear = this.props.location.state.year;
    }
    if (selectedYear) {
      this.setState({ yearName: selectedYear }, () => {
        this.getuserappliedleavesbyleavetypeid();
        this.getAllyears();
      });
    } else {
      this.getuserappliedleavesbyleavetypeid();
      this.getAllyears();
    }
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getuserappliedleavesbyleavetypeid();
    }
  }

  getAllyears = () => {
    const { token, userId } = this.state;
    fetch(`${Api.vacationManagement.getAllyears}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        userId: userId,
        Id: userId,
        languageId: 1,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ data: response.data });
        }else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAllyears());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  getuserappliedleavesbyleavetypeid = () => {
    const {
      token, userId, leaveTypeId, yearName, pageIndex, pageSize,
    } = this.state;
    fetch(`${Api.vacationManagement.getuserappliedleavesbyleavetypeid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        userId: userId,
        Id: userId,
        languageId: 1,
        year: parseInt(yearName, 10),
        pageIndex,
        pageSize,
        leaveType: parseInt(leaveTypeId, 10),
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            leaveTypesBalance: response.data.leaveTypesBalance,
            monthWiseLeaves: response.data.monthWiseLeaves,
            userAppliedLeaves: response.data.userAppliedLeaves,
            loaded: true,
          });
        }else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getuserappliedleavesbyleavetypeid());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  // handle for year select

  handleYearDropDown(event) {
    const { target } = event;
    const { name, year, checked } = target;
    const value = year === 'checked' ? checked : target.value;
    this.setState(
      {
        [name]: value,
      },
      () => this.getuserappliedleavesbyleavetypeid(),
    );
  }

  render() {
    const {
      leaveTypesBalance,
      monthWiseLeaves,
      userAppliedLeaves,
      data,
      currentYear,
      yearName,
    } = this.state;
    const { t } = this.props;
    let counter = 1;
    return (
      <Container fluid>
        <Row>
          <Col md={12}>
            <div className="card_layout leaveManagement">
              <Row>
                <Col md={6}>
                  {leaveTypesBalance.map(leaveBalance => (
                    <ul className="detail_lb">
                      <li>
                        {' '}
                        {t('VacationBalancePage.AvailableLeaves')}
                        {' '}
                        {leaveBalance.availableBalance}
                      </li>
                      <li>
                        {' '}
                        {t('VacationBalancePage.Granted')}
                        {' '}
                        {leaveBalance.totalGrantedleaves}
                      </li>
                      <li>
                        {' '}
                        {t('VacationBalancePage.Availed')}
                        {' '}
                        {leaveBalance.leavesConsumed}
                      </li>
                      <li>
                        {' '}
                        {t('VacationBalancePage.Applied')}
                        {' '}
                        {userAppliedLeaves.length}
                      </li>
                    </ul>
                  ))}
                </Col>
                <Col md={1} />
                <Col md={5}>
                  <Row>
                    <Col md={6} />
                    <Col md={6}>
                      <select
                        className="form-control"
                        id="exampleFormControlSelect1"
                        name="yearName"
                        value={yearName}
                        defaultValue={currentYear}
                        onChange={event => this.handleYearDropDown(event)}
                      >
                        <option value="0">Choose</option>
                        {data.map(data => (
                          <option key={data.id} value={data.year}>
                            {data.year}
                          </option>
                        ))}
                      </select>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <div className="graphContainer">
                    <div style={{ width: 1250, height: 630 }}>
                      <LeaveGraph graphDetails={monthWiseLeaves} />
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="card_layout leaveManagement p0">
              <Row>
                <Col md={12}>
                  <Table responsive>
                    <thead>
                      <tr className="table-header">
                        <th className="text-left" scope="col">{t('SrNo')}</th>
                        <th scope="col">{t('Status')}</th>
                        <th scope="col">{t('VacationBalancePage.RequestedOn')}</th>
                        <th scope="col">{t('From')}</th>
                        <th scope="col">{t('To')}</th>
                        <th scope="col">{t('VacationBalancePage.Days')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userAppliedLeaves.map(data => (
                        <tr key={data.id}>
                          <td>{counter++}</td>
                          <td>{data.appliedLeaveStatus}</td>
                          <td>{data.postedDate ? localizedDate(data.postedDate) : ''}</td>
                          <td>
                            {data.strFromDateTimeUtc ? commonService.localizedDate(data.strFromDateTimeUtc) : ''}
                          </td>
                          <td>
                            {data.strToDateTimeUtc ? commonService.localizedDate(data.strToDateTimeUtc) : ''}
                          </td>
                          <td>{data.noOfDays}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withTranslation()(LeaveDetailBalance);
