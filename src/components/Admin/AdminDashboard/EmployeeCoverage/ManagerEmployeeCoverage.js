import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Row,
  Table,
  Button,
  Card,
  Form,
} from 'react-bootstrap';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import './style.scss';
import Api from '../../../common/Api';
import { userService } from '../../../../services';
import RightArrow from '../../../../Images/Icons/next_click.svg';
import LeftArrow from '../../../../Images/Icons/prev_click.svg';
import ReloadIcon from '../../../../Images/Icons/reload.svg';
import Loaders from '../../../shared/Loaders';
import PaginationAndPageNumber from '../../../shared/Pagination';

class ManagerEmployeeCoverage extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      token: `${token}`,
      userId: `${userId}`,
      loading: false,
      divisionId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      employees: [],
      locationId: 0,
      countryId: 0,
      stateId: 0,
      totalRecords: 0,
      pageIndex: 1,
      pageSize: 10,
      city: '',
      organisationId: 0,
      managerId: 0,
      employeesId: 0,
      todayText: 'Today',
      disabledLeft: false,
      disabledRight: false,
      allCountry: [{ id: '0', name: 'All' }],
      countryId: 0,
      allState: [{ id: '0', name: 'All' }],
      stateId: 0,
      allCity: [{ id: '0', name: 'All' }],
      allLocation: [{ id: '0', name: 'All' }],
      emp: [{ id: '0', firstName: 'All', lastName: '' }],
    };
  }

  componentDidMount() {
    this.getAllCountries();
    this.getEmployeeByManagerId();
    this.getEmployees();
  }

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      const { todayText } = this.state;
      this.setState({
        pageIndex: pageNum,
        loading: false,
      }, () => {
        if (todayText === 'Yesterday') {
          const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
          dt.setDate(dt.getDate() - 1);
          this.getEmployees(true, dt);
        } else if (todayText === 'Tommorrow') {
          const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
          dt.setDate(dt.getDate() + 1);
          this.getEmployees(true, dt);
        } else {
          this.getEmployees();
        }
      });
    }
  }

  updatePageCount = (pageCount) => {
    const { todayText } = this.state;
    this.setState({
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
      loading: false,
    }, () => {
      if (todayText === 'Yesterday') {
        const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
        dt.setDate(dt.getDate() - 1);
        this.getEmployees(true, dt);
      } else if (todayText === 'Tommorrow') {
        const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
        dt.setDate(dt.getDate() + 1);
        this.getEmployees(true, dt);
      } else {
        this.getEmployees();
      }
    });
  }

  bindSubDropDowns = (ddlName, ddlValue) => {
    const defaultSelection = '0';
    if (ddlName === 'countryId') {
      if (ddlValue === defaultSelection) {
        this.setState({
          allLocation: [{ id: '0', name: 'All' }],
          allState: [{ id: '0', name: 'All' }],
          stateId: 0,
          allCity: [{ id: '0', name: 'All' }],
        });
      } else {
        this.getStatesByCountryId(ddlValue);
      }
    } else if (ddlName === 'stateId') {
      if (ddlValue === defaultSelection) {
        this.setState({
          allCity: [{ id: '0', name: 'All' }],
          allLocation: [{ id: '0', name: 'All' }],
        });
      } else {
        this.getCitiesByStatesId(ddlValue);
      }
    } else if (ddlName === 'cityId') {
      if (ddlValue === defaultSelection) {
        this.setState({ allLocation: [{ id: '0', name: 'All' }] });
      } else {
        this.searchWorkLocation(ddlValue);
      }
    }
  }

  getEmployeeByManagerId = (managerId) => {
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
      body: JSON.stringify({ id: parseInt(userId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            emp: [{
              id: '0',
              firstName: 'All',
              lastName: '',
            }].concat(response.data),

          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmployeeByManagerId(managerId));
          });
        } else {
          this.handleClose();
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getAllCountries = () => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.manageEmp.getallcountries}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(0, 10),
        languageId: 1,
        showUnpublished: false,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ allCountry: [{ id: '0', firstname: 'All' }].concat(response.data), countryId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAllCountries());
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getStatesByCountryId = (stateId) => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.manageEmp.getstatesbycountryid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(stateId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ allState: [{ id: '0', firstname: 'All' }].concat(response.data), stateId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getStatesByCountryId(stateId));
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getCitiesByStatesId = (cityId) => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.manageEmp.getcitiesbystatesid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(cityId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ allCity: [{ id: '0', firstname: 'All' }].concat(response.data), cityId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getCitiesByStatesId(cityId));
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  searchWorkLocation = (cityId) => {
    const {
      token, modelMessage,
    } = this.state;
    fetch(`${Api.manageEmp.searchworklocation}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        city: cityId,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          const { data } = response;
          this.setState({
            allLocation: [{ id: '0', firstname: 'All' }].concat(data),
            locationId: 0,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.searchWorkLocation(cityId));
          });
        } else {
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }


  getEmployees = (isNotToday, date, pageIndexTrue) => {
    const {
      token, divisionId, businessUnitId, departmentId, teamId, modelMessage,
      managerId, countryId, stateId, totalRecords, locationId, employeesId,
      pageIndex, pageSize, organisationId, city, userId,
    } = this.state;
    const data = {
      id: 0,
      languageId: 1,
      offset: '',
      isActive: true,
      totalRecords,
      pageIndex: pageIndexTrue ? 1 : (pageSize) * (pageIndex - 1) + 1,
      pageSize,
      organisationId: parseInt(organisationId, 10),
      divisionId: parseInt(divisionId, 10),
      businessUnitId: parseInt(businessUnitId, 10),
      departmentId: parseInt(departmentId, 10),
      teamId: parseInt(teamId, 10),
      managerId: parseInt(userId, 10),
      contractTypeId: 0,
      userId: parseInt(employeesId) || Number(managerId),
      countryId: parseInt(countryId, 10),
      stateId: parseInt(stateId, 10),
      city,
      workLocationId: parseInt(locationId, 0),
      date: isNotToday ? date : moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate(),
    };

    fetch(`${Api.getEmployeeCoverage}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            loading: false,
            employees: response.data,
            pageIndex: Math.floor(response.pageIndex / response.pageSize) + 1 || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmployees(isNotToday, date));
          });
        } else {
          this.handleClose();
          this.setState({
            loading: false,
            modelMessage: !modelMessage,
            errorMessage: response.errors,
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

  resetFilter = () => {
    const { todayText } = this.state;
    this.setState({
      locationId: 0,
      countryId: 0,
      employeesId: 0,
      allState: [{ id: '0', name: 'All' }],
      allCity: [{ id: '0', name: 'All' }],
      allLocation: [{ id: '0', name: 'All' }],

    }, 
    () => {
      if (todayText === 'Yesterday') {
        const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
        dt.setDate(dt.getDate() - 1);
        this.getEmployees(true, dt, true);
      } else if (todayText === 'Tommorrow') {
        const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
        dt.setDate(dt.getDate() + 1);
        this.getEmployees(true, dt, true);
      } else { this.getEmployees(null, null, true); }
    });
  }

  handleClose = () => {
    this.setState({
      modelUpdate: false,
    });
  };

  handleTime = (time) => {
    const punch = new Date(time);
    return punch.getMinutes() < 10 ? `${punch.getHours()}:0${punch.getMinutes()}` : `${punch.getHours()}:${punch.getMinutes()}`;
  }

  handleChange(event) {
    const { target } = event;
    const { name } = target;
    this.setState({ [name]: target.value }, () => this.bindSubDropDowns(name, target.value));
  }

  handleLeftArrow() {
    const { disabledRight, pageIndex } = this.state;
    if (disabledRight) {
      this.setState({
        employees: [], disabledRight: false, disabledLeft: false, todayText: 'Today', pageIndex: 1, loading: true, totalRecords: 0,
      }, () => this.getEmployees());
    } else {
      this.setState({
        disabledLeft: true, disabledRight: false, todayText: 'Yesterday', totalRecords: 0,
      },
      () => {
        const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
        dt.setDate(dt.getDate() - 1);
        this.getEmployees(true, dt, true);
      });
    }
  }

  handleRightArrow() {
    const { disabledLeft, pageIndex } = this.state;
    if (disabledLeft) {
      this.setState({
        employees: [], disabledRight: false, disabledLeft: false, todayText: 'Today', pageIndex: 1, totalRecords: 0, loading: true,
      }, () => this.getEmployees());
    } else {
      this.setState({
        disabledRight: true, disabledLeft: false, todayText: 'Tommorrow', totalRecords: 0,
      },
      () => {
        const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
        dt.setDate(dt.getDate() + 1);
        this.getEmployees(true, dt, true);
      });
    }
  }
  
  submitRequest() {
    const { todayText } = this.state;
    this.setState({ loading: true },
      () => {
        if (todayText === 'Yesterday') {
          const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
          dt.setDate(dt.getDate() - 1);
          this.getEmployees(true, dt, true);
        } else if (todayText === 'Tommorrow') {
          const dt = moment.utc(`${moment().get('month') + 1}-${moment().get('date')}-${moment().get('year')}`, 'MM-DD-YYYY HH:MM').toDate();
          dt.setDate(dt.getDate() + 1);
          this.getEmployees(true, dt, true);
        } else { this.getEmployees(null, null, true); }
      });
  }

  handleRefresh() {
    const { todayText } = this.state;
    this.setState({ employees: [], loading: true });
    if (todayText === 'Yesterday') {
      this.handleLeftArrow();
    } else if (todayText === 'Tommorrow') {
      this.handleRightArrow();
    } else {
      this.getEmployees();
    }
  }

  handleToday() {
    this.setState({ disabledLeft: false, disabledRight: false });
    this.getEmployees();
  }

  render() {
    const {
      loading, employees, disabledLeft, disabledRight, todayText,
      allCountry, allState, allLocation, emp, allCity, countryId,
      employeesId, stateId, cityId, locationId, totalRecords, pageIndex, pageSize,
    } = this.state;
    const { t } = this.props;
    const isEnabled = employeesId > 0 || countryId > 0;
    return (
      <>
        <div className="empCoverage container-fluid">
          <Card className="card_layout">
            <Card.Header className="coverageHeading px-0">
              <h3>Manager Employee Coverage</h3>
            </Card.Header>
            <Form className="row">
              <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                <Form.Label>{t('Employee')}</Form.Label>
                <Form.Control name="employeesId" value={employeesId} as="select" onChange={this.handleChange}>
                  {emp.map(empItem => (
                    <option
                      key={empItem.id}
                      value={empItem.id}
                    >
                      {empItem.firstName}
                      {' '}
                      {empItem.lastName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                <Form.Label>{t('Country')}</Form.Label>
                <Form.Control name="countryId" value={countryId} as="select" onChange={this.handleChange}>
                  {allCountry.map(country => (
                    <option
                      key={country.id}
                      value={country.id}
                    >
                      {country.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                <Form.Label>{t('ManageEmployeePage.Label_State')}</Form.Label>
                <Form.Control name="stateId" value={stateId} as="select" onChange={this.handleChange}>
                  {allState.map(state => (
                    <option
                      key={state.id}
                      value={state.id}
                    >
                      {state.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                <Form.Label>{t('ManageEmployeePage.Label_City')}</Form.Label>
                <Form.Control name="cityId" value={cityId} as="select" onChange={this.handleChange}>
                  {allCity.map(city => (
                    <option
                      key={city.id}
                      value={city.name}
                    >
                      {city.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
                <Form.Label>{t('ManageEmployeePage.Label_Worklocation')}</Form.Label>
                <Form.Control name="locationId" value={locationId} as="select" onChange={this.handleChange}>
                  {allLocation.map(worklocation => (
                    <option
                      key={worklocation.id}
                      value={worklocation.id}
                    >
                      {worklocation.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <div className="col-lg-3 col-md-6 d-flex justify-content-center flex-column">
                <Button className="" onClick={() => this.submitRequest()}>
                  {' '}
                  {t('Search')}
                  {' '}
                </Button>
              </div>
              {isEnabled && (
              <div className="d-flex justify-content-center flex-column">
                <Button onClick={() => this.resetFilter()}>Reset Filter</Button>
              </div>
              )}
            </Form>
          </Card>
          <Card className="card_layout">
            {loading
              ? (
                <Loaders />
              )
              : (
                <>
                  <Row className="reloadBtn">
                    <button type="button" className="arrowBtn mx-2" onClick={() => this.handleRefresh()}><img className="pointer" src={ReloadIcon} alt="reload icon" /></button>
                    <button
                      type="button"
                      className="mx-2 arrowBtn"
                      disabled={disabledLeft}
                      onClick={() => this.handleLeftArrow()}
                    >
                      <img src={LeftArrow} alt="left arrow" />
                    </button>
                    <div>
                      {todayText}
                    </div>
                    <button
                      type="button"
                      className="mx-2 arrowBtn"
                      disabled={disabledRight}
                      onClick={() => this.handleRightArrow()}
                      aria-hidden
                    >
                      <img src={RightArrow} alt="right arrow" />
                    </button>
                  </Row>
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>{ t('EmployeeCoverage.Sr')}</th>
                        <th className="text-left">{ t('EmployeeCoverage.EmployeeName')}</th>
                        <th>{ t('EmployeeCoverage.EmployeePicture')}</th>
                        <th className="text-left">{ t('EmployeeCoverage.CurrentStatus')}</th>
                        <th>{ t('EmployeeCoverage.ClockedIn')}</th>
                        <th>{ t('EmployeeCoverage.ClockedOut')}</th>
                        <th className="text-left">{ t('EmployeeCoverage.CurrentShift')}</th>
                        <th className="text-left">{ t('EmployeeCoverage.Geolocations')}</th>
                      </tr>
                    </thead>
                    { employees && (
                    <tbody>
                      {employees.map((data, index) => (
                        <tr>
                          <td>
                            {pageSize * (pageIndex - 1) + index + 1}
                          </td>
                          <td className="text-left">
                            <Link className="linkLine" to={`/profile/${data.userId}/true`}>
                              {data.employeeName}
                            </Link>
                          </td>
                          <td>
                            <div className="profileImage">
                              <img src={data.profileImage} alt="User profile" />
                            </div>
                          </td>
                          <td className="text-left">
                            {data.currentStatus === null ? ' - ' : data.currentStatus}
                          </td>
                          <td>
                            {data.clockInDateTimeUtc === null ? ' - ' : this.handleTime(data.clockInDateTimeUtc)}
                          </td>
                          <td>
                            {data.clockOutDateTimeUtc === null ? ' - ' : this.handleTime(data.clockOutDateTimeUtc)}
                          </td>
                          <td className="text-left">
                            {data.shiftTitle}
                          </td>
                          <td className="text-left">
                            {data.geoLocation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    )}
                  </Table>
                  { !loading && employees.length === 0 && (
                    <p className="text-center p-3">No data available</p>
                  )}
                </>
              )
            }
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
          </Card>
        </div>
      </>
    );
  }
}

export default (withTranslation()(ManagerEmployeeCoverage));
