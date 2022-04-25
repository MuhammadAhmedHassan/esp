import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Form, Button, Table, Modal, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import './style.scss';
import { connect } from 'react-redux';
import Api from '../../common/Api';
import DelegationIcon from '../../../Images/Icons/delegation.svg';
import { userService } from '../../../services';
import ApiResponsePopup from '../../shared/Common/ApiResponsePopup';


const lineManagerHeader = [
  {
    label: 'Sr. No.',
  },
  {
    label: 'Employee Name',
  },
  {
    label: 'Employee Type',
  },
  {
    label: 'User Role',
  },
  {
    label: 'Action',
  },
];

const mapStateToProps = state => ({
  // To get the list of employee details from store
  loggedUserRole: state.checkUserRole.user,
  userId: state.checkUserRole.user.userId,
  roleId: state.checkUserRole.user.role,
});

const { impersonationSubject } = userService;
let impersentSubscriber;

class UserRole extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.handleChange = this.handleChange.bind(this);
    const user = userService.getUser();
    const impUser = userService.getImpUser();
    const statusLst = [
      { id: 1, value: 'Active' },
      { id: 2, value: 'In Active' },
    ];
    this.state = {
      token: `${token}`,
      userId: `${userId}`,
      user,
      impUser,
      loading: false,
      divisionId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      employees: [],
      countryId: 0,
      stateId: 0,
      totalRecords: 10,
      pageIndex: 1,
      pageSize: 10,
      contractTypeId: 0,
      city: '',
      organisationId: 0,
      lineManagerName: [],
      empType: [],
      getAllRole: [],
      empTypeById: 0,
      errorMessage: '',
      modelUpdate: false,
      getAllRoleId: 0,
      managerId: 0,
      showModal: false,
      modalMessage: '',
      isImpersenating: false,
      statusId: props.status,
      statusLst,
      showModel: false,
      body: '',
    };
  }

  componentDidMount() {
    // this.employeeName();
    // this.getEmployees();
    impersentSubscriber = impersonationSubject.subscribe((val) => {
      this.setState({ isImpersenating: val.showName });
      this.getEmployees();
      this.employeeName();
    });
    this.employeeType();
    this.getAllUserRole();
  }

  componentDidUnmount() {
    if (impersentSubscriber) {
      impersentSubscriber.unsubscribe();
    }
  }

  getAllUserRole = () => {
    const {
      token, modelMessage,
    } = this.state;

    this.setState({ loading: true });
    fetch(`${Api.manageEmp.getAllUserRole}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(0, 10),
        languageId: 0,
        offset: '',
        role: '',
        isActive: true,
        roleIds: '',
        publicKey: '',

      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ getAllRole: [].concat(response.data) });
          this.getEmployees();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAllUserRole());
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


  employeeName = () => {
    const {
      token, modelMessage, userId,
    } = this.state;

    fetch(`${Api.manageEmp.employeeName}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(userId, 10),
        // managerId: parseInt(userId, 10),
        languageId: 0,
        offset: '',
        role: '',
        isActive: true,
        roleIds: '',
        publicKey: '',
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ lineManagerName: [].concat(response.data), managerId: 0 });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.employeeName());
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

  employeeType = () => {
    const {
      token, modelMessage, managerId,
    } = this.state;

    this.setState({ loading: true });
    fetch(`${Api.manageEmp.employeeType}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({

        id: parseInt(managerId, 10),
        languageId: 0,
        offset: '',
        role: '',
        isActive: true,
        roleIds: '',
        publicKey: '',


      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ empType: [].concat(response.data), empTypeById: 0 });
          this.getEmployees();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.employeeType());
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

  getEmployees = () => {
    const {
      token, divisionId, businessUnitId, departmentId, teamId, modelMessage,
      managerId, countryId, stateId, totalRecords, empTypeById,
      pageIndex, pageSize, contractTypeId, organisationId, city, userId, getAllRoleId,
      isImpersenating, statusId,
    } = this.state;

    const user = userService.getUser();
    const impRoles = userService.getImpUser();
    const userRoles = userService.getRole();
    const { roleId } = this.props;

    let isAdministratorRole = false;
    if (userRoles.find(role => role.name === 'Administrators')) {
      isAdministratorRole = true;
    } else {
      isAdministratorRole = false;
    }


    const names = roleId.map(x => (x.id));
    const userRoleIds = names.toString();

    const data = {
      id: 0,
      languageId: 0,
      offset: '',
      role: '',
      isActive: true,
      isActiveUsers: parseInt(statusId, 10) === 1,
      roleIds: '4,5,6',
      publicKey: 'string',
      totalRecords,
      pageIndex,
      pageSize,
      organisationId: parseInt(organisationId, 10),
      divisionId: parseInt(divisionId, 10),
      businessUnitId: parseInt(businessUnitId, 10),
      departmentId: parseInt(departmentId, 10),
      teamId: parseInt(teamId, 10),
      managerId: parseInt(userId, 10),
      // managerId: parseInt(userId, 10),
      userId: managerId !== null ? parseInt(managerId, 10) : 0,
      contractTypeId: parseInt(empTypeById, 10),
      countryId: parseInt(countryId, 10),
      stateId: parseInt(stateId, 10),
      city,
      workLocationId: 0,
      userRoleIds: (getAllRoleId === 0 || getAllRoleId === '0') ? '' : getAllRoleId.toString(),
      empTypeById: parseInt(empTypeById, 10),
    };

    fetch(`${Api.manageEmp.searchuser}`, {
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
          this.setState({ loading: false, employees: response.data });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmployees());
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

  handleImpersonation = (id, email) => {
    const userId = userService.getUserId();
    if (id != userId) {
      const {
        languageId, token, user,
      } = this.state;

      this.setState({ loaded: true, id });
      const data = {
        languageId: 1,
        impersonatorId: parseInt(userId, 10),
        impersonateeId: parseInt(id, 10),
      };
      fetch(`${Api.delegation.startImpersonation}`, {
        method: 'POST',
        headers: {
          token: userService.getToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),

      }).then(response => response.json())
        .then((response) => {
          if (response.statusCode === 200) {
            sessionStorage.clear();
            this.setState({
              showModal: true,
              isImpersenating: true,
              modalMessage: 'Delegation has been started',
              loaded: false,
            });
            const impUser = userService.getUser();
            const oldUser = userService.getUser();
            document.cookie = `espImp=${JSON.stringify(oldUser || {})};path=/`;
            impUser.accessToken = `${response.data.accessToken}`;
            impUser.refreshToken = `${response.data.refreshToken}`;
            impUser.expires = `${response.data.impersonation_end_date}`;
            impUser.role = response.data.role;
            impUser.impersonatorName = `${response.data.userName}`;
            impUser.userId = Number(response.data.userId);
            impUser.email = email;
            document.cookie = `espUser=${JSON.stringify(impUser || {})};path=/`;
            impersonationSubject.next({ showName: true, name: impUser.impersonatorName });
            this.setState({ impUser });
            this.getEmployees();
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.handleImpersonation(id, email));
            });
          } else {
            this.setState({
              showModal: true,
              modalMessage: response.message,
              loaded: false,
            });
          }
        });
    } else {
      this.setState({
        showModal: true,
        modalMessage: 'Impersonatee and impersonater Id is same',
        loaded: false,
      });
    }
  }


  handleClose = () => {
    this.setState({
      modelUpdate: false,
      showModal: false,
    });
  };

  handleChange(event) {
    const { target } = event;
    const { name } = target;
    this.setState({ [name]: target.value }, () => {
      this.getEmployees();
    });
  }

  resetFilter = () => {
    this.setState({
      getAllRoleId: '0', empTypeById: 0, managerId: 0, statusId: 1,
    }, () => {
      this.getEmployees();
    });
  }

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  updateUserStatus = (userId, status) => {
    const user = userService.getUser();
   
    const data = {
      languageId: 1,
      offset: '',
      isActive: status,
      userId,
      isUserActive: status,
    };

    fetch(`${Api.manageEmp.updateUserStatus}`, {
      method: 'POST',
      headers: new Headers({
        token: userService.getToken(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ loading: false });
          this.setState({
            showModel: true,
            // eslint-disable-next-line react/no-unused-state
            body: response.message,
          });
          this.getEmployees();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.updateUserStatus(userId, status));
          });
        }
      })

      .catch(err => console.error(err.toString()));
  }

  closeResponseModel = () => {
    this.setState({
      showModel: false,
      body: '',
    });
  };
  
  render() {
    const {
      loading, employees, lineManagerName, empType, getAllRole, modelUpdate, errorMessage,
      getAllRoleId, empTypeById, managerId, isImpersenating, confirmDelegation, showModal,
      modalMessage, statusId, statusLst, showModel, body,
    } = this.state;
    const viewMode = true;
    const { t } = this.props;
    const isEnabled = managerId > 0 || empTypeById > 0 || getAllRoleId > 0 || statusId > 1;
    let counter = 1;
    return (
      <>
        {showModel && (
        <ApiResponsePopup
          body={body}
          closeResponseModel={this.closeResponseModel}
        />
        ) }
        <div className="card_layout">
          <Form className="row">
            <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
              <Form.Label>
                {t('EmployeeNameText')}
                {' '}
              </Form.Label>
              <Form.Control name="managerId" value={managerId} as="select" onChange={this.handleChange}>
                <option value={0}>All</option>
                {lineManagerName.map(manager => (
                  <option
                    key={manager.id}
                    value={manager.id}
                  >
                    {manager.firstName}
                    {' '}
                    {' '}
                    {manager.lastName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
              <Form.Label>{t('UserRollPage.EmpType')}</Form.Label>
              <Form.Control name="empTypeById" value={empTypeById} as="select" onChange={this.handleChange}>
                <option value={0}>All</option>
                {empType.map(empTypename => (
                  <option
                    key={empTypename.id}
                    value={empTypename.id}
                  >
                    {empTypename.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
              <Form.Label>{t('UserRoleText')}</Form.Label>
              <Form.Control name="getAllRoleId" value={getAllRoleId} as="select" onChange={this.handleChange}>
                <option value="0">All</option>
                {getAllRole.map(getAllusers => (
                  <option
                    key={getAllusers.id}
                    value={getAllusers.id}
                  >
                    {getAllusers.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-3 col-md-6">
              <Form.Label>{t('ManageEmployeePage.Status')}</Form.Label>
              <Form.Control name="statusId" value={statusId} as="select" onChange={this.handleChange}>
                {statusLst.map(status => (
                  <option
                    key={status.id}
                    value={status.id}
                  >
                    {status.value}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
          {isEnabled && (
            <div className="col-md-2">
              <Button onClick={() => this.resetFilter()}>{t('ManageEmployee.UserRolePage.ResestFilter')}</Button>
            </div>
          )
          }
        </div>
        <div className="searchData">
          <div className="card_layout p-0">
            {loading
              ? (
                <div className="customloader">
                  <Spinner animation="border" role="status">
                    <span className="sr-only">{t('LoadingText')}</span>
                  </Spinner>
                </div>
              )
              : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>{t('SrNo')}</th>
                      <th>{t('EmployeeNameText')}</th>
                      <th>{t('UserRollPage.EmpType')}</th>
                      <th>{t('UserRoleText')}</th>
                      <th>{t('Action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(data => (
                      <tr>
                        <td>
                          {counter++}
                        </td>
                        <td>
                          {data.firstName}
                          {' '}
                          {data.lastName}
                        </td>
                        <td>
                          {data.contractType}
                        </td>
                        <td>
                          {data.userRoles}
                        </td>
                        <td>
                          {data.isActiveUsers && (
                            <Button variant="secondary" onClick={() => { this.updateUserStatus(data.id, false); }}>
                              Inactive
                            </Button>
                          )}
                          {!data.isActiveUsers && (
                            <Button variant="secondary" onClick={() => { this.updateUserStatus(data.id, true); }}>
                              Active
                            </Button>
                          )}
                          <div>
                            <Link to={`/profile/${data.id}/${viewMode}`} className="btn btn-outline-secondary mt-2">{t('ManageEmployeePage.ViewBtn')}</Link>
                          </div>
                          {/* { !isImpersenating && (
                          <div>
                            <Link to={`/profile/${data.id}`} className="btn btn-outline-secondary mt-2">{t('ManageEmployeePage.EditBtn')}</Link>
                          </div>
                          )} */}
                          { !isImpersenating && (
                          <div className="impersonation pointer" onClick={() => this.handleImpersonation(data.id, data.email)}>
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 40 }}
                              overlay={this.renderTooltip('Delegation')}
                            >
                              <img alt="Impersonation" src={DelegationIcon} />
                            </OverlayTrigger>
                          </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                
              )
          }
            {showModal && (
            <Modal
              show={showModal}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                {modalMessage}
              </Modal.Header>
              <Modal.Footer>
                { isImpersenating && (
                  <Button variant="secondary" onClick={() => { this.handleClose(); window.location.replace('/'); }}>
                    OK
                  </Button>
                )}

                { !isImpersenating && (
                  <Button variant="secondary" onClick={this.handleClose}>
                    OK
                  </Button>
                )}
              </Modal.Footer>
            </Modal>
            )}
          </div>
        </div>
        {modelUpdate && (
          <Modal
            show={this.getEmployees}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{t('AclPage.assignPermission.Title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
              {errorMessage}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                {t('CancelBtn')}
              </Button>
              <Button variant="primary" type="submit" onClick={this.updateUser}>
                {t('SubmitBtn')}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps, null,
)(withTranslation()(UserRole));
