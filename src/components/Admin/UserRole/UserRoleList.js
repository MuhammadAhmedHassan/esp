import React from 'react';
import { withTranslation } from 'react-i18next';

import {
  Container, Row, Col, Table, Button, Modal, Form, ListGroup, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import Toggle from 'react-toggle';
// import DeleteIcon from '../../../Images/Icons/icon_delete.svg';
import EditIcon from '../../../Images/Icons/Edit.svg';
// import ViewIcon from '../../../Images/Icons/icon_view.svg';
import api from '../../common/Api';
import PaginationAndPageNumber from '../../shared/Pagination/index';
import { userService } from '../../../services';
import Loaders from '../../shared/Loaders';

const tableHeader = [
  {
    label: 'S. No.',
    class: 'id',
  },
  {
    label: 'User Role',
    class: 'create_Shift',
  },
  {
    label: 'Status',
    class: 'shift_Template',
  },
  {
    label: 'Action',
    class: 'view_Schedule',
  },
];


class UserRoleList extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    this.state = {
      token: `${token}`,
      ModelDelete: false,
      ModelsAdd: false,
      ModelsView: false,
      ModelUpdate: false,
      updateId: 0,
      data: [],
      labelId: 0,
      isActive: false,
      value: '',
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
      roleName: '',
      modelMessage: false,
      errorMessage: '',
      userRoleErr: false,
    };
  }


  componentDidMount() {
    this.userRole();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.userRole();
    }
  }

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );


  handleClose = () => {
    this.setState({
      ModelDelete: false,
      ModelsAdd: false,
      ModelsView: false,
      ModelUpdate: false,
      modelMessage: false,
      value: null,
      isActive: false,
      userRoleErr: false,
    });
  };

  handleAddrole = () => {
    const { ModelsAdd } = this.state;
    this.setState({
      ModelsAdd: !ModelsAdd,
    });
  };

  handleUpdaterole = (id, name, active) => {
    const { ModelUpdate } = this.state;
    this.setState({
      ModelUpdate: !ModelUpdate,
      updateId: id,
      value: name,
      isActive: active,
      roleName: name,

    });
  };

  handleViewrole = (id, name, active) => {
    const { ModelsView } = this.state;
    this.setState({
      ModelsView: !ModelsView,
      updateId: id,
      value: name,
      isActive: active,
      roleName: name,
    });
  };


  handleCheeseChange = (active) => {
    this.setState({
      isActive: active,
    });
  }


  handleDeleteRole = (id, name) => {
    const { ModelDelete } = this.state;
    this.setState({
      ModelDelete: !ModelDelete,
    });
    this.setState({ labelId: id, value: name });
  };


  confirmDeleteService = () => {
    const {
      labelId, value, modelMessage, token,
    } = this.state;
    if (labelId === 0) {
      return;
    }

    const apidata = {
      modifiedById: 1002,
      id: labelId,
      name: value,
      isDeleted: true,
      languageId: 1,
    };

    fetch(`${api.acl.deleteRoles}?id=${labelId}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(apidata),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.userRole();
          this.handleClose();
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.message,
            loaded: true,
            pageIndex: response.pageIndex || 0,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.confirmDeleteService());
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
  };

  handleSubmit = () => {
    const {
      isActive, value, modelMessage, errorMessage, token,
    } = this.state;
    this.setState({ userRoleErr: false });
    if (!value) {
      this.setState({ userRoleErr: true });
      return;
    }
    const data = {
      name: value,
      createdById: 1001,
      id: 0,
      isActive,
      languageId: 1,
    };

    fetch(`${api.acl.createRoles}`, {
      method: 'POST',
      headers: {
        token: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),

    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.userRole();
          this.handleClose();
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.message,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.handleSubmit());
          });
        } else {
          this.handleClose();
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      });
  }

  updateUser = () => {
    const {
      isActive, value, updateId, modelMessage, token,
    } = this.state;
    this.setState({ userRoleErr: false });
    if (!value) {
      this.setState({ userRoleErr: true });
      return;
    }
    const data = {
      name: value,
      createdById: 1001,
      id: updateId,
      UpdatedById: 1,
      isActive,
      languageId: 1,
      modifiedById: 0,
      createdOnUtc: '2021-06-29T10:19:48.073Z',
      updatedOnUtc: '2021-06-29T10:19:48.073Z',
    };

    fetch(`${api.acl.updateRoles}`, {
      method: 'POST',
      headers: {
        token: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.userRole();
          this.handleClose();
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.message,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.updateUser());
          });
        } else {
          this.handleClose();
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.errors,
          });
        }
      });
  }

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
        loaded: false,
      });
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
      loaded: false,
    });
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, type, checked } = target;
    const value = type === 'checkbox' ? checked : target.value;
    this.setState({
      [name]: value,
    });
  }

  userRole() {
    const {
      pageIndex, pageSize, modelMessage, errorMessage, token,
    } = this.state;

    const searchdata = {
      id: 0,
      languageId: 0,
      offset: '',
      role: '',
      isActive: false,
      roleIds: '',
      publicKey: '',
      pageIndex,
      pageSize,
      module: '',
      sortColId: 0,

    };

    fetch(`${api.acl.getRoles}`, {
      method: 'POST',
      headers: {
        token: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchdata),
    })

      .then(res => res.json())
      .then(
        (result) => {
          if (result.statusCode === 200) {
            this.setState({
              loaded: true,
              data: result.data.allRoles,
              roleName: result.data.allRoles.name,
              pageIndex: result.data.pageIndex || 1,
              pageSize: result.data.pageSize,
              totalRecords: result.data.totalRecords,
            });
          } else if (result.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.userRole());
            });
          }
        },
      );
  }

  render() {
    const {
      ModelDelete,
      ModelsAdd,
      ModelUpdate, ModelsView,
      data, isActive, value,
      pageIndex,
      pageSize,
      totalRecords,
      loaded,
      modelMessage, errorMessage,
      roleName,
      userRoleErr,
    } = this.state;

    const count = ((pageIndex - 1) * pageSize) + 1;
    const { t } = this.props;
    return (
      <>
        
        <div className="card_layout myProfile_comp userRole p-2">
          <Row className="justify-content-end">
            <Col md={4} className="d-flex justify-content-end">
              <Button
                variant="primary"
                className="btn btn-primary"
                onClick={() => this.handleAddrole()}
              >
                {t('UserRollPage.AddUserBtn')}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              {loaded ? (
                <>
                  <Table striped responsive className="mt-3">
                    <thead>
                      <tr className="table-header ">
                        {tableHeader.map(dataList => (
                          <th>{dataList.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={item.id}>
                          <td className="id text-left">{count + 1}</td>
                          <td className="createShift" width="50%">{item.name}</td>
                          <td className="shiftTemplate">
                            <span>
                              {item.active ? 'Active' : 'In-active'}
                            </span>
                          </td>
                          <td className="viewSchedule text-center">
                            <div className="viewSchedule viewSchedule--action">
                              <span className="viewSchedule viewSchedule--edit">
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 40 }}
                                  overlay={this.renderTooltip('Edit')}
                                >
                                  <img
                                    src={EditIcon}
                                    alt="Edit Icon"
                                    onClick={() => this.handleUpdaterole(item.id, item.name, item.active)
                                      }
                                  />
                                </OverlayTrigger>

                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Col>
                    <hr />
                    <PaginationAndPageNumber
                      totalPageCount={Math.ceil(totalRecords / pageSize)}
                      totalElementCount={totalRecords}
                      updatePageNum={this.updatePageNum}
                      updatePageCount={this.updatePageCount}
                      currentPageNum={pageIndex}
                      recordPerPage={pageSize}
                    />
                  </Col>
                </>
              ) : (
                <Loaders />
              )
                }

              {ModelDelete && (
              <Modal
                show={this.handleDeleteRole}
                onHide={this.handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Body>
                  {t('UserRollPage.DeletePop-up.Title')}
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                  <Button className="mb-2" variant="secondary" onClick={this.handleClose}>
                    Cancel
                  </Button>
                  <Button className="mb-2" variant="primary" onClick={this.confirmDeleteService}>
                    Confirm
                  </Button>
                </Modal.Footer>
              </Modal>
              )}
              {ModelsAdd && (
              <Modal
                show={this.handleAddrole}
                onHide={this.handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>{t('UserRollPage.addPop-up.Title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>
                        User Role
                        <span className="redStar">*</span>
                      </Form.Label>
                      <Form.Control type="text" name="value" onChange={event => this.handleInputChange(event)} />
                      <div className={userRoleErr ? 'text-danger' : 'hidden'}>
                        Please fill name for your role
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                      <Form.Check checked={isActive} type="checkbox" name="isActive" label="Active" onChange={event => this.handleInputChange(event)} />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                  <Button className="mb-2" variant="secondary" onClick={this.handleClose}>
                    Cancel
                  </Button>
                  <Button className="mb-2" variant="primary" type="submit" onClick={this.handleSubmit}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
              )}

              {ModelUpdate && (
              <Modal
                show={this.handleUpdaterole}
                onHide={this.handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Edit Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>User Role</Form.Label>
                      <Form.Control as="input" value={value} name="value" onChange={event => this.handleInputChange(event)} />
                      <div className={userRoleErr ? 'text-danger' : 'hidden'}>
                        Please fill name for your role
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                      <Form.Check checked={isActive} type="checkbox" name="isActive" label="Active" onChange={event => this.handleInputChange(event)} />
                    </Form.Group>
                    <small>Note: The inactive will effect all the users associated with this particular role.</small>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                  <Button className="mb-2" variant="secondary" onClick={this.handleClose}>
                    Cancel
                  </Button>
                  <Button className="mb-2" variant="primary" type="submit" onClick={this.updateUser}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
              )}
              {ModelsView && (
              <Modal
                show={this.handleViewrole}
                onHide={this.handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton className="viewModalRoles">
                  <Modal.Title>{t('UserRollPage.ViewPop-up.Title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ListGroup>
                    {roleName}
                  </ListGroup>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                  <Button variant="secondary" onClick={this.handleClose}>
                    {t('CancelBtn')}
                  </Button>
                </Modal.Footer>
              </Modal>
              )}
              {modelMessage && (
              <Modal
                show={this.updateUser}
                onHide={this.handleClose}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  {errorMessage}
                </Modal.Header>
                <Modal.Footer className="d-flex justify-content-center">
                  <Button variant="secondary" onClick={this.handleClose}>
                    {t('OkBtn')}
                  </Button>
                </Modal.Footer>
              </Modal>
              )}
            </Col>
          </Row>

        </div>
       

      </>
    );
  }
}

export default withTranslation()(UserRoleList);
