import React from 'react';
import { withTranslation } from 'react-i18next';
import { Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './style.scss';
import { Multiselect } from 'multiselect-react-dropdown';
import Api from '../../common/Api';
import { userService } from '../../../services';
import LoadingSpinner from '../../shared/LoadingSpinner';
import CancelBtn from '../../shared/Common/CancelButton';

const MultiSelectStyles = {
  control: styles => ({
    ...styles,
    padding: '10px 0',

  }),

  multiValue: styles => ({
    ...styles,
    backgroundColor: '#0084A3',
    borderRadius: '25px',
    paddingLeft: '10px',

  }),

  multiValueLabel: styles => ({
    ...styles,
    color: '#ffffff',
  }),

  multiValueRemove: styles => ({
    ...styles,
    color: '#ffffff',
    borderRadius: '25px',
    padding: '8px',
    ':hover': {
      backgroundColor: '#ffffff',
      color: '#0084A3',
      cursor: 'pointer',
    },
  }),

  indicatorsContainer: styles => ({
    ...styles,
    display: 'none',
  }),
};

class CreateShift extends React.Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    this.multiselectRef = React.createRef();
    const token = userService.getToken();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      token: `Bearer ${token}`,
      loading: false,
      organisations: [{ id: '0', name: 'Select Organization' }],
      organisationId: 0,
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
      users: undefined,
      selectedUsers: undefined,
      selectedManager: undefined,
      errors: [],
      managerSelection: location.state.managerSelection,
      locationData: location.state.createPage,
      managerData: location.state.managerPage,
    };
  }


  componentDidMount() {
    this.getOrganisationId();
  }

  handleMultiSelect = (value) => {
    this.setState({ selectedUsers: value });
  }

  handleMultiRemove = (value) => {
    this.setState({ selectedUsers: value });
  }

  bindSubDropDowns = (ddlName, ddlValue) => {
    const { location } = this.props;
    const {
      managerSelection,
    } = this.state;
    if (location.state && location.state.createPage) {
      location.state.createPage = undefined;
    }
    if (location.state && location.state.managerPage) {
      location.state.managerPage = undefined;
    }
    const defaultValue = '0';
    if (ddlName === 'organisationId') {
      if (ddlValue === defaultValue) {
        this.setState({ divisions: [{ id: '0', name: 'Select Division' }], divisionId: 0 });
        this.setState({ businessUnit: [{ id: '0', name: 'Select Business Unit' }], businessUnitId: 0 });
        this.setState({ department: [{ id: '0', name: 'Select Department' }], departmentId: 0 });
        this.setState({ team: [{ id: '0', name: 'Select Team' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
        this.setState({ users: [], selectedUsers: [] });
      } else {
        this.getDivisionsByOrganisationId(ddlValue);
      }
    } else if (ddlName === 'divisionId') {
      if (ddlValue === defaultValue) {
        this.setState({ businessUnit: [{ id: '0', name: 'Select Business Unit' }], businessUnitId: 0 });
        this.setState({ department: [{ id: '0', name: 'Select Department' }], departmentId: 0 });
        this.setState({ team: [{ id: '0', name: 'Select Team' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
        this.setState({ users: [], selectedUsers: [] });
      } else {
        this.getBusinessUnitByDivisionId(ddlValue);
      }
    } else if (ddlName === 'businessUnitId') {
      if (ddlValue === defaultValue) {
        this.setState({ department: [{ id: '0', name: 'Select Department' }], departmentId: 0 });
        this.setState({ team: [{ id: '0', name: 'Select Team' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
        this.setState({ users: [], selectedUsers: [] });
      } else {
        this.getDepartmentByBusinessUnitId(ddlValue);
      }
    } else if (ddlName === 'departmentId') {
      if (ddlValue === defaultValue) {
        this.setState({ team: [{ id: '0', name: 'Select Team' }], teamId: 0 });
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
        this.setState({ users: [], selectedUsers: [] });
      } else {
        this.setState({
          team: [{ id: '0', name: 'Select Team' }],
          teamId: 0,
          primaryManager: [{ id: '0', firstName: 'Select Manager' }],
          managerId: 0,
          users: [],
          selectedUsers: [],
        });
        if (!managerSelection) {
          this.multiselectRef.current.resetSelectedValues();
        }
        this.getAllUrls(ddlValue);
      }
    } else if (ddlName === 'teamId') {
      if (ddlValue === defaultValue) {
        this.setState({ primaryManager: [{ id: '0', firstName: 'Select Manager', lastName: '' }], managerId: 0 });
        this.setState({ users: [], selectedUsers: [] });
      } else {
        this.setState({
          primaryManager: [{ id: '0', firstName: 'Select Manager' }],
          selectedUsers: [],
        });
        if (!managerSelection) {
          this.multiselectRef.current.resetSelectedValues();
        }
        this.getMgrUserByTeamId(ddlValue);
      }
    } else if (ddlName === 'managerId') {
      if (ddlValue === defaultValue) {
        this.setState({ users: [], selectedUsers: [] });
      } else {
        this.getEmployeeByManagerId(ddlValue);
      }
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
            users: response.data,
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

  getOrganisationId = () => {
    const { location } = this.props;
    const { token, managerSelection } = this.state;
    this.setState({ loading: true });
    fetch(`${Api.getAllOrganisations}`, {
      method: 'POST',
      headers: new Headers({
        Token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ id: 0, languageId: 1 }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ organisations: [{ id: '0', name: 'Select Organisation' }].concat(response.data), loading: false });
          if (!managerSelection && location.state && location.state.createPage) {
            this.setState({ organisationId: location.state.createPage.organisationId });
            this.getDivisionsByOrganisationId(location.state.createPage.organisationId);
          } else if (managerSelection && location.state && location.state.managerPage) {
            this.setState({ organisationId: location.state.managerPage.organisationId });
            this.getDivisionsByOrganisationId(location.state.managerPage.organisationId);
          }
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getOrganisationId());
          });
        } else {
          this.setState({ loading: false });
          // eslint-disable-next-line no-alert
          alert(`Error fetching Organisations ${response.message}`);
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        // eslint-disable-next-line no-alert
        alert(`Error fetching Organisations ${err}`);
      });
  }

  getDivisionsByOrganisationId = (organisationId) => {
    const { location } = this.props;
    const { token, managerSelection } = this.state;
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
        if (!managerSelection && location.state && location.state.createPage) {
          this.setState({ divisionId: location.state.createPage.divisionId });
          this.getBusinessUnitByDivisionId(location.state.createPage.divisionId);
        } else if (managerSelection && location.state && location.state.managerPage) {
          this.setState({ divisionId: location.state.managerPage.divisionId });
          this.getBusinessUnitByDivisionId(location.state.managerPage.divisionId);
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
    const { location } = this.props;
    const { token, managerSelection } = this.state;
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
        if (!managerSelection && location.state && location.state.createPage) {
          this.setState({ businessUnitId: location.state.createPage.businessUnitId });
          this.getDepartmentByBusinessUnitId(location.state.createPage.businessUnitId);
        } else if (managerSelection && location.state && location.state.managerPage) {
          this.setState({ businessUnitId: location.state.managerPage.businessUnitId });
          this.getDepartmentByBusinessUnitId(location.state.managerPage.businessUnitId);
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
    const { location } = this.props;
    const { token, managerSelection } = this.state;
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
        if (!managerSelection && location.state && location.state.createPage) {
          this.setState({ departmentId: location.state.createPage.departmentId });
          this.getAllUrls(location.state.createPage.departmentId);
        } else if (managerSelection && location.state && location.state.managerPage) {
          this.setState({ departmentId: location.state.managerPage.departmentId });
          this.getAllUrls(location.state.managerPage.departmentId);
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
    const { location } = this.props;
    const { token, managerSelection } = this.state;
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
        users: response[2].data,
      });
      if (!managerSelection && location.state && location.state.createPage) {
        if (location.state.createPage.teamId) {
          this.setState({ teamId: location.state.createPage.teamId });
          this.getMgrUserByTeamId(location.state.createPage.teamId);
        } else {
          this.setState({
            managerId: location.state.createPage.managerId,
            selectedUsers: location.state.createPage.selectedUsers,
          });
        }
      } else if (managerSelection && location.state && location.state.managerPage) {
        if (location.state.managerPage.teamId) {
          this.setState({ teamId: location.state.managerPage.teamId });
          this.getMgrUserByTeamId(location.state.managerPage.teamId);
        } else {
          this.setState({
            managerId: location.state.managerPage.managerId,
          });
        }
      }
      return (response);
    } catch (error) {
      this.setState({ loading: false });
      return (error);
    }
  }

  // eslint-disable-next-line consistent-return
  getMgrUserByTeamId = async (teamID) => {
    const { location } = this.props;
    const {
      token,
      managerSelection,
    } = this.state;
    const urls = [`${Api.getManagersByTeamId}`, `${Api.getUsersByTeamId}`];
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
        users: response[1].data,
      });
      if (!managerSelection && location.state && location.state.createPage) {
        this.setState({
          managerId: location.state.createPage.managerId,
          selectedUsers: location.state.createPage.selectedUsers,
        });
      } else if (managerSelection && location.state && location.state.managerPage) {
        this.setState({
          managerId: location.state.managerPage.managerId,
        });
      }
      return (response);
    } catch (error) {
      this.setState({ loading: false });
    }
  }

  handleChange(event) {
    const { target } = event;
    const { name } = target;
    const { errors } = this.state;
    this.setState({ [name]: target.value });
    this.bindSubDropDowns(name, target.value);
    if (errors.indexOf(name) !== -1) {
      const err = [...errors];
      err.splice(errors.indexOf(name), 1);
      this.setState({ errors: err });
    }
  }

  hasError(key) {
    const { errors } = this.state;
    return errors.indexOf(key) !== -1;
  }

  handleSubmit(e) {
    const { history, location } = this.props;
    e.preventDefault();
    const errors = [];
    const {
      users,
      organisationId,
      divisionId,
      businessUnitId,
      departmentId,
      managerId,
      managerSelection,
      locationData,
      managerData,
      primaryManager,
    } = this.state;
    let { selectedUsers } = this.state;
    if (organisationId === 0 || organisationId === undefined) {
      errors.push('organisationId');
    }
    if (divisionId === 0 || divisionId === undefined) {
      errors.push('divisionId');
    }
    if (businessUnitId === 0 || businessUnitId === undefined) {
      errors.push('businessUnitId');
    }
    if (departmentId === 0 || departmentId === undefined) {
      errors.push('departmentId');
    }
    if (!managerSelection) {
      if ((selectedUsers === undefined) || (selectedUsers.length === 0)) {
        errors.push('selectedUsers');
      }
    } else if (managerId === 0 || managerId === undefined) {
      errors.push('managerId');
    }
    this.setState({
      errors,
    });

    if (errors.length > 0) {
      return false;
    }
    selectedUsers = (selectedUsers === undefined) || (selectedUsers.length === 0)
      ? [] : selectedUsers;
    
    const selectedManager = {};
    if (managerSelection) {
      const managerName = primaryManager.filter(x => x.id.toString() === managerId);
      selectedManager.id = managerId;
      selectedManager.fullName = `${managerName[0].firstName} ${managerName[0].lastName}`;
    }
    this.setState({ selectedUsers, selectedManager }, () => history.push(
      {
        pathname: 'shift-template',
        state: {
          createPage: managerSelection ? locationData : this.state,
          managerPage: managerSelection ? this.state : managerData,
          shiftTemp: (location.state && location.state.shiftTemp)
            ? { ...location.state.shiftTemp } : undefined,
          shift: location.state.shift,
          shiftTemplate: location.state.shiftTemplate,
        },
      },
    ));
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  cancel(props, data, managerData) {
    const { history, location } = props;
    history.push(
      {
        pathname: 'shift-template',
        state: {
          managerPage: (managerData),
          createPage: (data)
            ? { ...data } : [],
          shiftTemp: (location.state && location.state.shiftTemp)
            ? { ...location.state.shiftTemp } : undefined,
          shift: location.state.shift,
        },
      },
    );
  }

  render() {
    const {
      organisations, divisions, businessUnit, department, team,
      primaryManager, users, loading, organisationId, divisionId, businessUnitId,
      departmentId, teamId, managerId, selectedUsers, locationData, managerSelection, managerData,
    } = this.state;
    const { t } = this.props;

    return (
      <>
        <div>
          {loading ? (<LoadingSpinner />) : null}
        </div>
        <div className="container-fluid create-shift shift-template">

          <div className="card_layout">
            <Form className="row mt-3" id="select-org">
              <Form.Group controlId="selectOrganisation" className="col-xl-3 col-lg-4 col-md-6  ">
                <Form.Label>{t('ShiftTemplatePage.Organization')}</Form.Label>
                <Form.Control as="select" name="organisationId" onChange={this.handleChange} value={organisationId}>
                  {(organisations.length > 0)
                    // eslint-disable-next-line max-len
                    ? (organisations.map((organisation, index) => <option key={organisation.id} value={organisation.id}>{organisation.name}</option>))
                    : null}
                </Form.Control>
                <div
                  className={
                    this.hasError('organisationId') ? 'text-danger' : 'hidden'
                  }
                >
                  {t('ShiftTemplatePage.OrgErrorText')}
                </div>
              </Form.Group>
              <Form.Group controlId="selectDivision" className="col-xl-3 col-lg-4 col-md-6 ">
                <Form.Label className="ml-1">{t('ManageEmployeePage.TableHeader_Division')}</Form.Label>
                <Form.Control className="ml-1" as="select" name="divisionId" onChange={this.handleChange} value={divisionId}>
                  {(divisions.length > 0)
                    // eslint-disable-next-line max-len
                    ? (divisions.map((division, index) => <option key={division.id} value={division.id}>{division.name}</option>))
                    : null}
                </Form.Control>
                <div
                  className={
                    this.hasError('divisionId') ? 'text-danger' : 'hidden'
                  }
                >
                  {t('ShiftTemplatePage.DivisionErrorText')}
                </div>
              </Form.Group>
              <Form.Group controlId="selectBusiness" className="col-xl-3 col-lg-4 col-md-6 ">
                <Form.Label className="ml-1">{t('ManageEmployeePage.TableHeader_BusinessUnit')}</Form.Label>
                <Form.Control className="ml-1" as="select" value={businessUnitId} name="businessUnitId" onChange={this.handleChange}>
                  {(businessUnit.length > 0)
                    // eslint-disable-next-line max-len
                    ? (businessUnit.map((business, index) => <option key={business.id} value={business.id}>{business.name}</option>))
                    : null}
                </Form.Control>
                <div
                  className={
                    this.hasError('businessUnitId') ? 'text-danger' : 'hidden'
                  }
                >
                  {t('ShiftTemplatePage.BusinessUnitErrorText')}
                </div>
              </Form.Group>
              <Form.Group controlId="selectDept" className="col-xl-3 col-lg-4 col-md-6 ">
                <Form.Label className="ml-1">{t('ManageEmployeePage.TableHeader_Department')}</Form.Label>
                <Form.Control className="ml-1" as="select" value={departmentId} name="departmentId" onChange={this.handleChange}>
                  {(department.length > 0)
                    // eslint-disable-next-line max-len
                    ? (department.map((dept, index) => <option key={dept.id} value={dept.id}>{dept.name}</option>))
                    : null}
                </Form.Control>
                <div
                  className={
                    this.hasError('departmentId') ? 'text-danger' : 'hidden'
                  }
                >
                  {t('ShiftTemplatePage.DepartmentErrorText')}
                </div>
              </Form.Group>
              <Form.Group controlId="selectTeam" className="col-xl-3 col-lg-4 col-md-6 ">
                <Form.Label>{t('ManageEmployeePage.TableHeader_Team')}</Form.Label>
                <Form.Control as="select" name="teamId" value={teamId} onChange={this.handleChange}>
                  {(team.length > 0)
                    // eslint-disable-next-line max-len
                    ? (team.map((selectedTeam, index) => <option key={selectedTeam.id} value={selectedTeam.id}>{selectedTeam.name}</option>))
                    : null}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="selectMgr" className="col-xl-3 col-lg-4 col-md-6">
                <Form.Label className="ml-1">{t('ShiftTemplatePage.PoolOfManagers')}</Form.Label>
                <Form.Control className="ml-1" name="managerId" value={managerId} as="select" onChange={this.handleChange}>
                  {(primaryManager.length > 0)
                    // eslint-disable-next-line max-len
                    ? (primaryManager.map((manager, index) => (
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
                <div
                  className={
                    this.hasError('managerId') ? 'text-danger' : 'hidden'
                  }
                >
                  {t('ShiftTemplatePage.ManagerErrorText')}
                </div>
              </Form.Group>
              { !managerSelection
              && (
              <Form.Group controlId="selectEmp" className="col-xl-3 col-lg-4 col-md-6 ">
                <Form.Label className="ml-1">{t('ShiftTemplatePage.AvailableEmployees')}</Form.Label>
                <Multiselect
                  ref={this.multiselectRef}
                  selectedValues={selectedUsers}
                  placeholder="Select Users"
                  className="form-control"
                  options={users}
                  displayValue="email"
                  onSelect={this.handleMultiSelect}
                  onRemove={this.handleMultiRemove}
                />
                <div
                  className={
                    this.hasError('selectedUsers') ? 'text-danger' : 'hidden'
                  }
                >
                  {t('ShiftTemplatePage.SelectedUsersErrorText')}
                </div>

              </Form.Group>
              )
             }
              
              <Form.Group className="col-xl-3 col-lg-4 col-md-6 pt-2">
                <CancelBtn data1={locationData} data2={managerData} callBackFunction={this.cancel} />
              </Form.Group>
              <Form.Group className="col-xl-3 col-lg-4 col-md-6 pt-2">
                <Link to="/schedule/shift-template" type="button" onClick={this.handleSubmit} className="btn btn-primary mt-4">{t('ShiftTemplatePage.ProceedBtn')}</Link>
              </Form.Group>
            </Form>
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(CreateShift);
