/* eslint-disable max-len */
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Form,
} from 'react-bootstrap';
import { userService } from '../../../../../../services';
import './style.scss';
import Api from '../../../../../common/Api';
import LoadingSpinner from '../../../../../shared/LoadingSpinner';

class Filter extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      token: `Bearer ${token}`,
      loading: false,
      divisions: [{ id: '0', name: 'Select Division' }],
      divisionId: props.params.divisionId,
      businessUnit: [{ id: '0', name: 'Select Business Unit' }],
      businessUnitId: props.params.businessUnitId,
      department: [{ id: '0', name: 'Select Department' }],
      departmentId: props.params.departmentId,
      team: [{ id: '0', name: 'Select Team' }],
      teamId: props.params.teamId,
      primaryManager: [{ id: '0', firstName: 'Select Manager' }],
      managerId: props.params.managerId,
      users: [{ id: '0', firstName: 'Select Employee' }],
      empId: props.params.empId,
      isAdmin: props.isAdmin,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.isAdmin) {
      this.getDivisionsByOrganisationId(0);
    } else {
      this.getEmployeeByManagerId(userService.getUserId());
    }
  }


  // eslint-disable-next-line react/sort-comp
  handleChange(event) {
    const { target } = event;
    const { name } = target;
    this.setState({ [name]: target.value });
    this.bindSubDropDowns(name, target.value);
    // eslint-disable-next-line react/destructuring-assignment
    this.props.handleChange(name, target.value);
  }


  bindSubDropDowns = (ddlName, ddlValue) => {
    const defaultValue = '0';
    if (ddlName === 'organisationId') {
      if (ddlValue === defaultValue) {
        this.setState({ divisions: [{ id: '0', name: 'Select Division' }], divisionId: 0 });
        this.setState({ businessUnit: [{ id: '0', name: 'Select Business Unit' }], businessUnitId: 0 });
        this.setState({ department: [{ id: '0', name: 'Select Department' }], departmentId: 0 });
        this.setState({ team: [{ id: '0', name: 'Select Team' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
      } else {
        this.getDivisionsByOrganisationId(ddlValue);
      }
    } else if (ddlName === 'divisionId') {
      if (ddlValue === defaultValue) {
        this.setState({ businessUnit: [{ id: '0', name: 'Select Business Unit' }], businessUnitId: 0 });
        this.setState({ department: [{ id: '0', name: 'Select Department' }], departmentId: 0 });
        this.setState({ team: [{ id: '0', name: 'Select Team' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
      } else {
        this.getBusinessUnitByDivisionId(ddlValue);
      }
    } else if (ddlName === 'businessUnitId') {
      if (ddlValue === defaultValue) {
        this.setState({ department: [{ id: '0', name: 'Select Department' }], departmentId: 0 });
        this.setState({ team: [{ id: '0', name: 'Select Team' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
      } else {
        this.getDepartmentByBusinessUnitId(ddlValue);
      }
    } else if (ddlName === 'departmentId') {
      if (ddlValue === defaultValue) {
        this.setState({ team: [{ id: '0', name: 'Select Team' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
      } else {
        this.setState({
          team: [{ id: '0', name: 'Select Team' }],
          teamId: 0,
          primaryManager: [{ id: '0', firstName: 'Select Manager' }],
          managerId: 0,
        });

        this.getAllUrls(ddlValue);
      }
    } else if (ddlName === 'teamId') {
      if (ddlValue === defaultValue) {
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
      } else {
        this.setState({
          primaryManager: [{ id: '0', firstName: 'Select Manager' }],
        });
        this.getMgrUserByTeamId(ddlValue);
      }
    } else if (ddlName === 'managerId') {
      if (ddlValue === defaultValue) {
        this.setState({ users: [{ id: '0', firstName: 'Select Employee' }], empId: 0 });
      } else {
        this.setState({
          users: [{ id: '0', firstName: 'Select Employee' }],
        });
        this.getEmployeeByManagerId(ddlValue);
      }
    }
  }

  getDivisionsByOrganisationId = (organisationId) => {
    const { token, divisionId } = this.state;
    this.setState({ loading: true });
    fetch(`${Api.getDivisionsByOrganisationId}`, {
      method: 'POST',
      headers: new Headers({
        Token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: Number(organisationId), languageId: 1 }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
        // eslint-disable-next-line no-console
          this.setState({ divisions: [{ id: '0', name: 'Select Division' }].concat(response.data), divisionId, loading: false });
          if (divisionId > 0) {
            this.getBusinessUnitByDivisionId(divisionId);
          }
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getDivisionsByOrganisationId(organisationId));
          });
        }
      })
      .catch((err) => {
        console.error(err.toString());
        this.setState({ loading: false });
      });
  }

  getBusinessUnitByDivisionId = (divId) => {
    const { token, businessUnitId } = this.state;
    this.setState({ loading: true });
    fetch(`${Api.getBusinessUnitByDivisionId}`, {
      method: 'POST',
      headers: new Headers({
        Token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: Number(divId), languageId: 1 }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
        // eslint-disable-next-line no-console
          this.setState({ businessUnit: [{ id: '0', name: 'Select Business Unit' }].concat(response.data), businessUnitId, loading: false });
          if (businessUnitId > 0) {
            this.getDepartmentByBusinessUnitId(businessUnitId);
          }
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getBusinessUnitByDivisionId(divId));
          });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err.toString());
      });
  }

  getDepartmentByBusinessUnitId = (businessUnitId) => {
    const { token, departmentId } = this.state;
    this.setState({ loading: true });
    fetch(`${Api.getDepartmentByBusinessUnitId}`, {
      method: 'POST',
      headers: new Headers({
        Token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: Number(businessUnitId), languageId: 1 }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
        // eslint-disable-next-line no-console
          this.setState({ department: [{ id: '0', name: 'Select Department' }].concat(response.data), departmentId, loading: false });
          if (departmentId > 0) {
            this.getAllUrls(departmentId);
          }
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getDepartmentByBusinessUnitId(businessUnitId));
          });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err.toString());
      });
  }


  getAllUrls = async (departmentId) => {
    const {
      token, teamId, managerId, empId,
    } = this.state;
    const urls = [`${Api.getTeamsByDepartmentId}`, `${Api.getManagersByDepartmentId}`, `${Api.getUsersByDepartmentId}`];
    this.setState({ loading: true });

    try {
      const response = await Promise.all(
        urls.map(
          url => fetch(url, {
            method: 'POST',
            headers: new Headers({
              Token: `${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ id: Number(departmentId), languageId: 1 }),
            // eslint-disable-next-line no-shadow
          }).then(response => response.json()),
        ),
      );
      this.setState({
        loading: false,
        team: [{ id: '0', name: 'Select Team' }].concat(response[0].data),
        teamId,
        primaryManager: [{ id: '0', firstName: 'Select Manager' }].concat(response[1].data),
        managerId,
        users: [{ id: '0', firstName: 'Select Employee' }].concat(response[2].data),
        empId,
      });
      return (response);
    } catch (error) {
      this.setState({ loading: false });
      return (error);
    }
  }


  // eslint-disable-next-line consistent-return
  getMgrUserByTeamId = async (teamID) => {
    const {
      token,
    } = this.state;
    const urls = [`${Api.getManagersByTeamId}`];
    this.setState({ loading: true });

    try {
      const response = await Promise.all(
        urls.map(
          url => fetch(url, {
            method: 'POST',
            headers: new Headers({
              Token: `${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ id: Number(teamID), languageId: 1 }),
          }).then(
            // eslint-disable-next-line no-shadow
            response => response.json(),
          ),
        ),
      );
      this.setState({
        loading: false,
        primaryManager: [{ id: '0', firstName: 'Select Manager' }].concat(response[0].data),
        managerId: 0,
      });

      return (response);
    } catch (error) {
      this.setState({ loading: false });
    }
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
            users: [{ id: '0', firstName: 'Select Employee' }].concat(response.data),
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmployeeByManagerId(managerId));
          });
        } else {
          this.setState({ loading: false });
          // eslint-disable-next-line no-alert
          alert(`Error fetching Organisations ${response.message}`);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  clearData = () => {
    this.setState({
      loading: false,
      divisionId: 0,
      businessUnit: [{ id: '0', name: 'Select Business Unit' }],
      businessUnitId: 0,
      department: [{ id: '0', name: 'Select Department' }],
      departmentId: 0,
      team: [{ id: '0', name: 'Select Team' }],
      teamId: 0,
      primaryManager: [{ id: '0', firstName: 'Select Manager' }],
      managerId: 0,
      users: [{ id: '0', firstName: 'Select Employee' }],
      empId: 0,
    });
    // eslint-disable-next-line react/destructuring-assignment
    this.props.handleChange('isReset', false);
  }

  handleSearch = () => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.search();
  }

  render() {
    const { t } = this.props;
    const {
      divisions, businessUnit, department, team,
      primaryManager, loading, divisionId, businessUnitId,
      departmentId, teamId, managerId, empId, users, isAdmin,
    } = this.state;
    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.params.isReset) {
      this.clearData();
    }
 
    return (
      <>
        <div>
          {loading ? (<LoadingSpinner />) : null}
        </div>
        {isAdmin && (
          <>
            <Form.Group controlId="selectDivision" className="col-xl-3 col-lg-4 col-md-6 ">
              <Form.Label className="ml-1">{t('ManageEmployeePage.TableHeader_Division')}</Form.Label>
              <Form.Control className="ml-1" as="select" name="divisionId" onChange={this.handleChange} value={divisionId}>
                {(divisions.length > 0)
                  // eslint-disable-next-line max-len
                  ? (divisions.map(division => <option key={division.id} value={division.id}>{division.name}</option>))
                  : null}
              </Form.Control>

            </Form.Group>
            <Form.Group controlId="selectBusiness" className="col-xl-3 col-lg-4 col-md-6 ">
              <Form.Label className="ml-1">{t('ManageEmployeePage.TableHeader_BusinessUnit')}</Form.Label>
              <Form.Control className="ml-1" as="select" value={businessUnitId} name="businessUnitId" onChange={this.handleChange}>
                {(businessUnit.length > 0)
                  // eslint-disable-next-line max-len
                  ? (businessUnit.map(business => <option key={business.id} value={business.id}>{business.name}</option>))
                  : null}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="selectDept" className="col-xl-3 col-lg-4 col-md-6 ">
              <Form.Label className="ml-1">{t('ManageEmployeePage.TableHeader_Department')}</Form.Label>
              <Form.Control className="ml-1" as="select" value={departmentId} name="departmentId" onChange={this.handleChange}>
                {(department.length > 0)
                  // eslint-disable-next-line max-len
                  ? (department.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>))
                  : null}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="selectTeam" className="col-xl-3 col-lg-4 col-md-6 ">
              <Form.Label>{t('ManageEmployeePage.TableHeader_Team')}</Form.Label>
              <Form.Control as="select" name="teamId" value={teamId} onChange={this.handleChange}>
                {(team.length > 0)
                  // eslint-disable-next-line max-len
                  ? (team.map(selectedTeam => <option key={selectedTeam.id} value={selectedTeam.id}>{selectedTeam.name}</option>))
                  : null}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="selectMgr" className="col-xl-3 col-lg-4 col-md-6">
              <Form.Label className="ml-1">{t('ShiftTemplatePage.PoolOfManagers')}</Form.Label>
              <Form.Control className="ml-1" name="managerId" value={managerId} as="select" onChange={this.handleChange}>
                {(primaryManager.length > 0)
                  // eslint-disable-next-line max-len
                  ? (primaryManager.map(manager => (
                    <option
                      key={manager.id}
                      value={manager.id}
                    >
                      {manager.firstName}
                      &nbsp;
                      {manager.lastName}
                    </option>
                  )))
                  : null}
              </Form.Control>
            </Form.Group>
          </>
        )}
        {(
          <Form.Group controlId="employee" className="col-xl-3 col-lg-4 col-md-6">
            <Form.Label className="ml-1">{t('ShiftTemplatePage.AvailableEmployees')}</Form.Label>
            <Form.Control className="ml-1" name="empId" value={empId} as="select" onChange={this.handleChange}>
              {(users.length > 0)
                // eslint-disable-next-line max-len
                ? (users.map(manager => (
                  <option
                    key={manager.id}
                    value={manager.id}
                  >
                    {manager.firstName}
                    &nbsp;
                    {manager.lastName}
                  </option>
                )))
                : null}
            </Form.Control>
          </Form.Group>
        )}
      </>
    );
  }
}

export default withTranslation()(Filter);
