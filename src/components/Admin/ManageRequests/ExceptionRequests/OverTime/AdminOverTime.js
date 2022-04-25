import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Multiselect } from 'multiselect-react-dropdown';
import {
  Row, Col, Table, Button, Modal, Form,
} from 'react-bootstrap';
import './style.scss';
import moment from 'moment';
import PaginationAndPageNumber from '../../../../shared/Pagination/index';
import ViewIcon from '../../../../../Images/Icons/Eye.svg';
import Api from '../../../../common/Api';
import { userService } from '../../../../../services';
import Loaders from '../../../../shared/Loaders';
import { commonService } from '../../../../../services/common.service';

const tableHeader = [
  {
    label: 'Sr.No',
  },
  {
    label: 'Employee Name',
  }, {
    label: 'Manager Name',
  },
  {
    label: 'Applied On',
  },
  {
    label: 'Shift Date',
  },
  {
    label: 'Shift Label',
  },
  {
    label: 'Reason',
  },
  {
    label: 'Hours',
  },
  {
    label: 'Status',
  },
  {
    label: 'Actions',
  },
];

class AdminOverTime extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      token: `${token}`,
      allData: [],
      loaded: false,
      pageIndex: 1,
      pageSize: 10,
      userId: `${userId}`,
      locationId: 0,
      stateId: 0,
      cityId: 0,
      divisionId: 0,
      businessUnitId: 0,
      departmentId: 0,
      managerId: 0,
      statusId: 0,
      countryId: [],
      fromDate: null,
      toDate: null,
      divisions: [],
      businessUnit: [],
      department: [],
      manager: [],
      employee: [],
      location: [],
      state: [],
      city: [],
      country: [],
      team: [],
      employeeIds: [],
      noData: false,
      toError: '',
      viewModal: false,
      allShifts: [],
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
  }

  componentDidMount() {
    this.getAllData();
    this.getDivisionsByOrganisationId();
    this.getAllCountries();
  }

  handleClose = () => {
    this.setState({
      viewModal: false,
    });
  }

  getDivisionsByOrganisationId = () => {
    const {
      token,
    } = this.state;

    fetch(`${Api.manageEmp.getdivisionsbyorganisationid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(0, 10),
        languageId: 1,

      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ divisions: [].concat(response.data) });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getDivisionsByOrganisationId());
          });
        } else {
          alert(response.message);
        }
      })

      .catch(err => console.error(err.toString()));
  }

  getBusinessUnitByDivisionId = (divisionId) => {
    const {
      token,
    } = this.state;
    fetch(`${Api.manageEmp.getbusinessunitbydivisionid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(divisionId, 10),
        languageId: 1,

      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ businessUnit: [].concat(response.data) });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getBusinessUnitByDivisionId(divisionId));
          });
        } else {
          alert(response.message);
        }
      })

      .catch(err => console.error(err.toString()));
  }

  getDepartmentByBusinessUnitId = (businessUnitId) => {
    const {
      token,
    } = this.state;
    fetch(`${Api.manageEmp.getdepartmentbybusinessunitid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(businessUnitId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ department: [].concat(response.data) });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getDepartmentByBusinessUnitId(businessUnitId));
          });
        } else {
          alert(response.message);
        }
      })

      .catch(err => console.error(err.toString()));
  }

  getTeamsByDepartmentId = (departmentId) => {
    const {
      token,
    } = this.state;
    fetch(`${Api.manageEmp.getteamsbydepartmentid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(departmentId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ team: [].concat(response.data) });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getTeamsByDepartmentId(departmentId));
          });
        } else {
          alert(response.message);
        }
      })

      .catch(err => console.error(err.toString()));
  }

  getManagerByTeamId = (teamId) => {
    const {
      token,
    } = this.state;
    fetch(`${Api.manageEmp.getmanagersbyteamid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(teamId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ manager: [].concat(response.data) });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getManagerByTeamId(teamId));
          });
        } else {
          alert(response.message);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getEmployeeByManagerId = (managerId) => {
    const {
      token,
    } = this.state;
    fetch(`${Api.manageEmp.getemployeebymanagerid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(managerId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            employee: [].concat(response.data),
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmployeeByManagerId(managerId));
          });
        } else {
          alert(response.message);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getAllCountries = () => {
    const {
      token,
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
          this.setState({ country: [].concat(response.data) });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAllCountries());
          });
        } else {
          alert(response.message);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getStatesByCountryId = (countryId) => {
    const {
      token,
    } = this.state;
    fetch(`${Api.manageEmp.getstatesbycountryid}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: parseInt(countryId, 10) }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ state: [].concat(response.data) });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getStatesByCountryId(countryId));
          });
        } else {
          alert(response.message);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getCitiesByStatesId = (stateId) => {
    const {
      token,
    } = this.state;
    fetch(`${Api.manageEmp.getcitiesbystatesid}`, {
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
          this.setState({ city: [].concat(response.data) });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getCitiesByStatesId(stateId));
          });
        } else {
          alert(response.message);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  searchWorkLocation = (cityId) => {
    const {
      token,
    } = this.state;
    fetch(`${Api.manageEmp.searchworklocation}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(cityId, 10),
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          const { data } = response;
          this.setState({ location: [].concat(data) });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.searchWorkLocation(cityId));
          });
        } else {
          alert(response.message);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getAllData = () => {
    const {
      token, pageIndex, pageSize, userId, fromDate, toDate, statusId, managerId, employeeIds,
    } = this.state;

    const apiEmployeeIds = employeeIds.join(',');

    const data = {
      languageId: 1,
      pageIndex: Number(pageIndex),
      pageSize: Number(pageSize),
      userId: Number(userId),
      requestTypeId: 3,
      startDateTime: fromDate,
      endDateTime: toDate,
      statusId: Number(statusId),
      userIds: apiEmployeeIds,
      managerId: 0,
    };

    fetch(`${Api.exceptionRequest.overTimeEmployee.getOverTimeRequest}`, {
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
            loaded: true,
            allData: (response.data === null) ? [] : [].concat(response.data),
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
            noData: !!(response.data === null || response.data.length === 0),
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAllData());
          });
        } else {
          alert(response.message);
        }
      });
  }

  bindSubDropDowns = (ddlName, ddlValue) => {
    const defaultSelection = '0';

    if (ddlName === 'divisionId') {
      if (ddlValue === defaultSelection) {
        this.setState({ businessUnit: [], businessUnitId: 0 });
        this.setState({ department: [], departmentId: 0 });
        this.setState({ team: [], teamId: 0 });
        this.setState({ manager: [], managerId: 0 });
        this.setState({ employee: [] });
      } else {
        this.getBusinessUnitByDivisionId(ddlValue);
      }
    } else if (ddlName === 'businessUnitId') {
      if (ddlValue === defaultSelection) {
        this.setState({ department: [], departmentId: 0 });
        this.setState({ team: [], teamId: 0 });
        this.setState({ manager: [], managerId: 0 });
        this.setState({ employee: [] });
      } else {
        this.getDepartmentByBusinessUnitId(ddlValue);
      }
    } else if (ddlName === 'departmentId') {
      if (ddlValue === defaultSelection) {
        this.setState({ team: [], teamId: 0 });
        this.setState({ manager: [], managerId: 0 });
        this.setState({ employee: [] });
      } else {
        this.getTeamsByDepartmentId(ddlValue);
      }
    } else if (ddlName === 'teamId') {
      if (ddlValue === defaultSelection) {
        this.setState({ manager: [], managerId: 0 });
        this.setState({ employee: [] });
      } else {
        this.getManagerByTeamId(ddlValue);
      }
    } else if (ddlName === 'managerId') {
      if (ddlValue === defaultSelection) {
        this.setState({ employee: [] });
      } else {
        this.getEmployeeByManagerId(ddlValue);
      }
    } else if (ddlName === 'countryId') {
      if (ddlValue === defaultSelection) {
        this.setState({ location: [] });
        this.setState({ state: [], stateId: 0 });
        this.setState({ city: [] });
      } else {
        this.getStatesByCountryId(ddlValue);
      }
    } else if (ddlName === 'stateId') {
      if (ddlValue === defaultSelection) {
        this.setState({ city: [] });
        this.setState({ location: [] });
      } else {
        this.getCitiesByStatesId(ddlValue);
      }
    } else if (ddlName === 'cityId') {
      if (ddlValue === defaultSelection) {
        this.setState({ location: [] });
      } else {
        this.searchWorkLocation(ddlValue);
      }
    }
  }

  resetFilter = () => {
    this.setState({
      divisionId: 0,
      countryId: 0,
      managerId: 0,
      stateId: 0,
      cityId: 0,
      locationId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      statusId: 0,
      businessUnit: [],
      department: [],
      team: [],
      manager: [],
      employee: [],
      state: [],
      city: [],
      location: [],
      employeeIds: [],
      fromDate: null,
      toDate: null,
    });
  }

  getShiftRequest = (id) => {
    const { token } = this.state;

    const data = {
      languageId: 1,
      id: Number(id),
    };

    fetch(`${Api.exceptionRequest.overTimeEmployee.getById}`, {
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
            viewModal: true,
            viewshiftDate: response.data.selectedDate,
            viewoverTimeInHours: response.data.hours,
            viewoverTimeInMinutes: response.data.minutes,
            viewuserNotes: response.data.notes,
            viewselectShiftId: response.data.shiftId,
          }, () => {
            this.getShiftByDate();
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getShiftRequest(id));
          });
        } else {
          alert(response.message);
        }
      });
  }

  getShiftByDate = () => {
    const {
      token, userId, viewshiftDate,
    } = this.state;

    const data = {
      languageId: 1,
      userId: Number(userId),
      date: viewshiftDate,
    };

    fetch(`${Api.exceptionRequest.overTimeEmployee.getShiftByDate}`, {
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
            allShifts: (response.data === null) ? [] : [].concat(response.data),
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getShiftByDate());
          });
        } else {
          alert(response.message);
        }
      });
  }

  handleSelectEmployee = (selectedList) => {
    const { employeeIds } = this.state;
    selectedList.map(provider => (!employeeIds.includes(provider.id) ? employeeIds.push(provider.id) : ''));
    this.setState({ employeeIds });
  }

  handleRemoveEmployee = (selectedList, selectedItem) => {
    const { employeeIds } = this.state;
    if (employeeIds.includes(selectedItem.id)) {
      const index = employeeIds.indexOf(selectedItem.id);
      if (index !== -1) {
        employeeIds.splice(index, 1);
      }
      this.setState({ employeeIds });
    }
  }

  handleInputChange(event) {
    const { target } = event;
    const { name } = target;
    this.setState({ [name]: target.value }, () => this.bindSubDropDowns(name, target.value));
  }

  handleFromDateChange(date) {
    this.setState({
      fromDate: date,
    });
  }

  handleToDateChange(date) {
    const { fromDate } = this.state;
    if (date < fromDate) {
      this.setState({ toError: 'To Date can not be less than From Date' });
    } else {
      this.setState({
        toDate: date,
        toError: '',
      });
    }
  }

  render() {
    const {
      pageSize, pageIndex, allData, totalRecords, loaded, divisions, businessUnit, department,
      manager, employee, location, state, city, divisionId, businessUnitId, departmentId, managerId,
      locationId, stateId, cityId, team, country, teamId, countryId, statusId, noData, toError,
      fromDate, toDate, viewoverTimeInHours, viewoverTimeInMinutes, viewshiftDate, allShifts,
      shiftDate,
      viewuserNotes, viewselectShiftId, viewModal,
    } = this.state;
    let counter = ((pageIndex - 1) * pageSize) + 1;
    const isEnabled = divisionId > 0 || countryId > 0
      || statusId > 0 || fromDate !== null || toDate !== null;
    return (
      <div className="container-fluid overTime">
        <div className="card_layout">
          <Row className="">
            <Col className="col-lg-3 col-md-6">
              <label name="divisionId" className="" htmlFor="divisioId ">
                Division
              </label>
              <select name="divisionId" value={divisionId} className="form-control" onChange={event => this.handleInputChange(event)}>
                <option value="0">All</option>
                {divisions.map(division => (
                  <option value={division.id}>
                    {division.name}
                  </option>
                ))}
              </select>
            </Col>
            <Col className="col-lg-3 col-md-6">
              <label htmlFor="status">
                Business Unit
              </label>
              <select name="businessUnitId" value={businessUnitId} className="form-control" onChange={event => this.handleInputChange(event)}>
                <option value="0">All</option>
                {businessUnit.map(division => (
                  <option value={division.id}>
                    {division.name}
                  </option>
                ))}
              </select>
            </Col>
            <Col className="col-lg-3 col-md-6">
              <label htmlFor="status">
                Department
              </label>
              <select name="departmentId" value={departmentId} className="form-control" onChange={event => this.handleInputChange(event)}>
                <option value="0">All</option>
                {department.map(division => (
                  <option value={division.id}>
                    {division.name}
                  </option>
                ))}
              </select>
            </Col>
            <Col className="col-lg-3 col-md-6">
              <label htmlFor="status">
                Team
              </label>
              <select name="teamId" value={teamId} className="form-control" onChange={event => this.handleInputChange(event)}>
                <option value="0">All</option>
                {team.map(division => (
                  <option value={division.id}>
                    {division.name}
                  </option>
                ))}
              </select>
            </Col>

            <Col className="col-lg-3 col-md-6">
              <label htmlFor="status">
                Manager
              </label>
              <select name="managerId" value={managerId} className="form-control" onChange={event => this.handleInputChange(event)}>
                <option value="0">All</option>
                {manager.map(division => (
                  <option value={division.id}>
                    {division.fullName}
                  </option>
                ))}
              </select>
            </Col>
            <Col className="col-lg-12 col-xl-9">
              <label htmlFor="status">
                Employee
              </label>
              <Multiselect
                id="employeeIds"
                options={employee}
                displayValue="fullName"
                onSelect={this.handleSelectEmployee}
                onRemove={this.handleRemoveEmployee}
              />
            </Col>

            <Col className="col-lg-3 col-md-6">
              <label htmlFor="status">
                Country
              </label>
              <select name="countryId" value={countryId} disabled className="form-control" onChange={event => this.handleInputChange(event)}>
                <option value="0">All</option>
                {country.map(division => (
                  <option value={division.id}>
                    {division.name}
                  </option>
                ))}
              </select>
            </Col>
            <Col className="col-lg-3 col-md-6">
              <label htmlFor="status">
                State
              </label>
              <select name="stateId" value={stateId} disabled className="form-control" onChange={event => this.handleInputChange(event)}>
                <option value="0">All</option>
                {state.map(division => (
                  <option value={division.id}>
                    {division.name}
                  </option>
                ))}
              </select>
            </Col>
            <Col className="col-lg-3 col-md-6">
              <label htmlFor="status">
                City
              </label>
              <select name="cityId" value={cityId} disabled className="form-control" onChange={event => this.handleInputChange(event)}>
                <option value="0">All</option>
                {city.map(division => (
                  <option value={division.id}>
                    {division.name}
                  </option>
                ))}
              </select>
            </Col>
            <Col className="col-lg-3 col-md-6">
              <label htmlFor="status">
                Location
              </label>
              <select name="locationId" value={locationId} disabled className="form-control" onChange={event => this.handleInputChange(event)}>
                <option value="0">All</option>
                {location.map(division => (
                  <option value={division.id}>
                    {division.name}
                  </option>
                ))}
              </select>
            </Col>

            <Col className="col-lg-3 col-md-6">
              <label htmlFor="status">
                Status
              </label>
              <select name="statusId" value={statusId} className="form-control" onChange={event => this.handleInputChange(event)}>
                <option value="0">All</option>
                <option value="10">Pending</option>
                <option value="20">Rejected</option>
                <option value="30">Approved</option>
                <option value="40">Withdrawn</option>
              </select>
            </Col>
            <Col className="col-lg-3 col-md-6">
              <label htmlFor={fromDate}>
                From
              </label>
              <DatePicker
                name="fromDate"
                className="form-control"
                placeholderText={commonService.localizedDateFormat()}
                dateFormat={commonService.localizedDateFormatForPicker()}
                selected={fromDate}
                onChange={this.handleFromDateChange}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                autoComplete="off"
              />
            </Col>
            <Col className="col-lg-3 col-md-6">
              <label htmlFor={toDate}>
                To
              </label>
              <DatePicker
                name="toDate"
                placeholderText={commonService.localizedDateFormat()}
                dateFormat={commonService.localizedDateFormatForPicker()}
                className="form-control"
                selected={toDate}
                onChange={this.handleToDateChange}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                autoComplete="off"
              />
              {toError && <div className="text-danger">{toError}</div>}
            </Col>
          </Row>
          <Row className="mt-4 d-flex justify-content-center">

            <Button onClick={this.getAllData}>Submit</Button>

            {isEnabled && (
              <Button className="mt-2 mt-sm-0" onClick={() => this.resetFilter()}>Clear</Button>

            )}
          </Row>
          <Row className="mt-3">
            <Col>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    {tableHeader.map(headerData => (
                      <th>{headerData.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {noData && (
                    <tr>
                      <td colSpan="10">No Data Available</td>
                    </tr>
                  )}
                  {loaded ? (
                    <>
                      {allData.map(tableTimeData => (
                        <tr>
                          <td>
                            {counter++}
                          </td>
                          <td>
                            {tableTimeData.userName}
                          </td>
                          <td>
                            {tableTimeData.shiftManagerName}
                          </td>
                          <td>
                            {tableTimeData.createdOnUtc ? commonService.localizedDate(tableTimeData.createdOnUtc) : ''}
                          </td>
                          <td>
                            {tableTimeData.shiftStartDate ? commonService.localizedDate(tableTimeData.shiftStartDate) : ''}
                          </td>
                          <td>
                            {tableTimeData.shiftTitle}
                          </td>
                          <td>
                            {tableTimeData.userNotes}
                          </td>
                          <td>
                            {tableTimeData.overTimeInMinutes / 60}
                          </td>
                          <td>
                            {tableTimeData.overTimeStatus}
                          </td>
                          <td>
                            <div>
                              <span>
                                <img
                                  src={ViewIcon}
                                  alt="View Icon"
                                  onClick={() => this.getShiftRequest(tableTimeData.id)}
                                />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <Loaders />
                  )}


                </tbody>
              </Table>
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
            </Col>
          </Row>

        </div>
        {
          viewModal && (
            <Modal
              show={viewModal}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
              className="applyOvertimeModel"
            >
              <Modal.Header closeButton />
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <label className="form-label px-3" htmlFor={viewshiftDate}>Select Date</label>
                    <Col>
                      <DatePicker
                        name="viewshiftDate"
                        value={moment(viewshiftDate).format('MM/DD/YYYY')}
                        onChange={this.handleFromDateChange}
                        placeholderText={commonService.localizedDateFormat()}
                        dateFormat={commonService.localizedDateFormatForPicker()}
                        className="form-control cal_icon"
                        pattern="\d{2}\/\d{2}/\d{4}"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        required
                        disabled
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="px-3">Select Shift</Form.Label>
                    <Col md={12}>
                      <Form.Control as="select" value={viewselectShiftId} name="viewshiftTypeId" onChange={event => this.handleInputChange(event)} disabled>
                        <option value={0}>All</option>
                        {
                          allShifts.map(data => <option value={data.id}>{data.title}</option>)
                        }
                      </Form.Control>
                    </Col>
                  </Form.Group>
                  <Row>
                    <Col md={12} className="d-flex">
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="px-3">Select Hours</Form.Label>
                        <Col>
                          <Form.Control type="text" value={viewoverTimeInHours} name="viewoverTimeInHours" placeholder="" onChange={event => this.handleInputChange(event)} disabled />
                        </Col>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="px-3">Select Minutes</Form.Label>
                        <Col>
                          <Form.Control type="text" name="viewoverTimeInMinutes" value={viewoverTimeInMinutes} placeholder="" onChange={event => this.handleInputChange(event)} disabled />
                        </Col>
                      </Form.Group>
                    </Col>

                  </Row>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="px-3">Reason</Form.Label>
                    <Col md={12}>
                      <Form.Control as="textarea" name="viewuserNotes" value={viewuserNotes} placeholder="Reason" onChange={event => this.handleInputChange(event)} disabled />
                    </Col>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={this.handleClose}>
                  OK
                </Button>
              </Modal.Footer>
            </Modal>
          )
        }
      </div>
    );
  }
}

export default AdminOverTime;
