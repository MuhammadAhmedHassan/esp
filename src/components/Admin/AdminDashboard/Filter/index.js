/* eslint-disable max-len */
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Form, Button,
} from 'react-bootstrap';
import { userService } from '../../../../services';
import './style.scss';
import Api from '../../../common/Api';
import LoadingSpinner from '../../../shared/LoadingSpinner';


class Filter extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      token: `Bearer ${token}`,
      loading: false,
      divisions: [{ id: '0', name: 'Select Division' }],
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
      userId: 0,
      isAdmin: props.isAdmin,
      showEmployee: props.showEmployee,
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
        this.setState({ users: [{ id: '0', firstName: 'Select Employee', lastName: '' }], userId: 0 });
      } else {
        this.getDivisionsByOrganisationId(ddlValue);
      }
    } else if (ddlName === 'divisionId') {
      if (ddlValue === defaultValue) {
        this.setState({ businessUnit: [{ id: '0', name: 'Select Business Unit' }], businessUnitId: 0 });
        this.setState({ department: [{ id: '0', name: 'Select Department' }], departmentId: 0 });
        this.setState({ team: [{ id: '0', name: 'Select Team' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
        this.setState({ users: [{ id: '0', firstName: 'Select Employee', lastName: '' }], userId: 0 });
      } else {
        this.getBusinessUnitByDivisionId(ddlValue);
      }
    } else if (ddlName === 'businessUnitId') {
      if (ddlValue === defaultValue) {
        this.setState({ department: [{ id: '0', name: 'Select Department' }], departmentId: 0 });
        this.setState({ team: [{ id: '0', name: 'Select Team' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
        this.setState({ users: [{ id: '0', firstName: 'Select Employee', lastName: '' }], userId: 0 });
      } else {
        this.getDepartmentByBusinessUnitId(ddlValue);
      }
    } else if (ddlName === 'departmentId') {
      if (ddlValue === defaultValue) {
        this.setState({ team: [{ id: '0', name: 'Select Team' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
        this.setState({ users: [{ id: '0', firstName: 'Select Employee', lastName: '' }], userId: 0 });
      } else {
        this.getAllUrls(ddlValue);
      }
    } else if (ddlName === 'teamId') {
      if (ddlValue === defaultValue) {
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
        this.setState({ users: [{ id: '0', firstName: 'Select Employee', lastName: '' }], userId: 0 });
      } else {
        this.getMgrUserByTeamId(ddlValue);
        this.getEmployeeByTeamId(ddlValue);
      }
    } else if (ddlName === 'managerId') {
      if (ddlValue === defaultValue) {
        this.setState({ users: [{ id: '0', firstName: 'Select Employee', lastName: '' }], userId: 0 });
      } else {
        this.getEmployeeByManagerId(ddlValue);
      }
    }
  }
  
  getDivisionsByOrganisationId = (organisationId) => {
    const { token } = this.state;
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
        // eslint-disable-next-line no-console
        this.setState({ divisions: [{ id: '0', name: 'Select Division' }].concat(response.data), divisionId: 0, loading: false });
      })
      .catch((err) => {
        console.error(err.toString());
        this.setState({ loading: false });
      });
  }

  getBusinessUnitByDivisionId = (divId) => {
    const { token } = this.state;
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
        // eslint-disable-next-line no-console
        this.setState({ businessUnit: [{ id: '0', name: 'Select Business Unit' }].concat(response.data), businessUnitId: 0, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err.toString());
      });
  }

  getDepartmentByBusinessUnitId = (businessUnitId) => {
    const { token } = this.state;
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
        // eslint-disable-next-line no-console
        this.setState({ department: [{ id: '0', name: 'Select Department' }].concat(response.data), departmentId: 0, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        console.error(err.toString());
      });
  }


  getAllUrls = async (departmentId) => {
    const { token } = this.state;
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
        teamId: 0,
        primaryManager: [{ id: '0', firstName: 'Select Manager' }].concat(response[1].data),
        managerId: 0,
        users: [{ id: '0', firstName: 'Select Employee' }].concat(response[2].data),
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
            userId: 0,
            users: [{ id: '0', firstName: 'Select Employee' }].concat(response.data),
          });
        } else {
          this.setState({ loading: false });
          // eslint-disable-next-line no-alert
          alert(`Error fetching Organisations ${response.message}`);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getEmployeeByTeamId = (teamId) => {
    const {
      token,
    } = this.state;
    fetch(`${Api.getUsersByTeamId}`, {
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
          this.setState({
            userId: 0,
            users: [{ id: '0', firstName: 'Select Employee' }].concat(response.data),
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
      userId: 0,
    });
    // eslint-disable-next-line react/destructuring-assignment
    this.props.clearFilter();
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
      departmentId, teamId, managerId, userId, users, isAdmin, showEmployee,
    } = this.state;
    return (
      <>
        <div>
          {loading ? (<LoadingSpinner />) : null}
        </div>
        <div className="container-fluid create-shift shift-template">
          <div className="card_layout p-3">
            <Form className="row mt-3" id="select-org">
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
              {!isAdmin || showEmployee
                ? (
                  <Form.Group controlId="employee" className="col-xl-3 col-lg-4 col-md-6">
                    <Form.Label className="ml-1">{t('ShiftTemplatePage.AvailableEmployees')}</Form.Label>
                    <Form.Control className="ml-1" name="userId" value={userId} as="select" onChange={this.handleChange}>
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
                )
                : null }
              
              <Form.Group className="col-xl-6 col-sm-12 pt-2">
                <Form.Label className="ml-1 mt-3 d-flex" />
                <Button className="search-button mb-2" type="button" onClick={() => this.handleSearch()}>
                  {' '}
                  {t('Admin.Search')}
                  {' '}
                </Button>
                <Button className="search-button mb-2" type="button" onClick={() => this.clearData()}>
                  {' '}
                  {t('Admin.Clear')}
                  {' '}
                </Button>
              </Form.Group>
              {divisionId > 0 && (
              <Form.Group className="col-xl-3 col-lg-4 col-md-6 pt-2">
                <Form.Label className="ml-1" />
               
              </Form.Group>
              )}
            </Form>
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(Filter);
