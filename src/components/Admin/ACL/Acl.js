import React from 'react';
import {
  Container, Row, Col, Table, Button, InputGroup, FormControl, Modal, Spinner, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { userService } from '../../../services';
import Api from '../../common/Api';
import userIcon from '../../../Images/Icons/user_icon.svg';
import searchIcon from '../../../Images/Icons/search_icon.svg';
import PaginationAndPageNumber from '../../shared/Pagination/index';
import './style.scss';
import Loaders from '../../shared/Loaders';

class ACL extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyUp = this.onKeyUp.bind(this);
    const token = userService.getToken();
    this.state = {
      token: `${token}`,
      permission: [],
      assignPermissionList: [],
      modelUpdate: false,
      modelMessage: false,
      id: 0,
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
      module: '',
      isActive: false,
      error: null,
      errorMessage: '',
      isEnabled: false,
    };
  }

  componentDidMount() {
    this.aclPermission();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.aclPermission();
    }
  }

  onKeyUp(event) {
    if (event.charCode === 13) {
      this.aclPermission();
    }
  }

  handleClose = () => {
    this.setState({
      modelUpdate: false,
      modelMessage: false,
    });
  };

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

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  handleUpdaterole = (id) => {
    const { modelUpdate, isActive, token } = this.state;
    this.setState({
      isActive: !isActive,
    });
    fetch(`${Api.acl.getrolemappingsbypermissionid}?id=${id}`, {
      method: 'POST',
      headers: {
        token: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          id,
          languageId: 1,
          offset: '',
          role: '',
          isActive,
          roleIds: '',
          publicKey: '',
        },
      ),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            assignPermissionList: response.data,
            modelUpdate: !modelUpdate,
            errorMessage: response.Message,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.handleUpdaterole(id));
          });
        } else {
          this.setState({
            modelUpdate: !modelUpdate,
            errorMessage: response.Message,
          });
        }
      });
  };

  aclPermission = () => {
    const {
      token, pageIndex, pageSize, module,
    } = this.state;
    fetch(`${Api.acl.searchPermision}?&sortBy=${1}&pageIndex=${pageIndex}&pageSize=${parseInt(pageSize, 10)}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        languageId: 1,
        offset: '',
        role: '',
        isActive: true,
        roleIds: '',
        publicKey: '',
        pageIndex,
        module,
        pageSize,
        sortColId: 0,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            loaded: true,
            error: false,
            permission: response.data.response,
            pageIndex: response.data.pageIndex || 1,
            pageSize: response.data.pageSize,
            totalRecords: response.data.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.aclPermission());
          });
        } else {
          this.setState({
            loaded: true,
            permission: [],
            error: true,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }


  handleChange = (e) => {
    const { checked } = e.target;
    this.setState({
      checked,
    });
  }

  updateUser = () => {
    const {
      id, isActive, assignPermissionList, modelMessage, token,
    } = this.state;
    fetch(`${Api.acl.updateRoleMappings}`, {
      method: 'POST',
      headers: {
        token: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        languageId: 1,
        offset: '',
        role: '',
        isActive,
        roleIds: '',
        publicKey: '',
        userPermissionRoleMappingList: assignPermissionList,

      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.handleClose();
          this.aclPermission();
          this.setState({
            assignPermissionList: response.data,
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
          this.setState({
            modelMessage: !modelMessage,
            errorMessage: response.message,
          });
        }
      });
  }

  handleActiveStatus = (e, index) => {
    const { assignPermissionList } = this.state;
    assignPermissionList[index].isActive = e;
    this.setState({
      assignPermissionList,
      isEnabled: true,
    });
  }

  searchfunc() {
    const {
      module,
    } = this.state;
    this.setState({
      loaded: false,
      module,
      pageIndex: 1,
      totalRecords: 0,
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

  render() {
    const {
      permission, modelUpdate, assignPermissionList, pageIndex, loaded, modelMessage,
      pageSize, totalRecords, error, errorMessage, isEnabled,
    } = this.state;
    const { t } = this.props;
    // const isEnabled = studentName.length > 0;

    let count = ((pageIndex - 1) * pageSize) + 1;

    return (
      <div className="card_layout myProfile_comp aclCard p-0">
        <Row className="justify-content-end">
          <Col lg={4} className="d-flex justify-content-end">
            <InputGroup className="pt-3 pl-3 pr-3">
              <FormControl
                placeholder="Search by Module"
                name="module"
                onKeyPress={this.onKeyUp}
                onChange={event => this.handleInputChange(event)}
              />
              <InputGroup.Text id="basic-addon2" className="search__button">
                <img
                  src={searchIcon}
                  alt="Edit Icon"
                  onClick={() => this.searchfunc()
                    }
                />
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {loaded ? (
              <>
                <Table striped responsive className="mt-3">
                  <thead>
                    <tr className="table-header ">
                      <th className="text-left">{t('AclPage.assignPermission.SNo')}</th>
                      <th>{t('AclPage.TableHeader_ModuleName')}</th>
                      <th>{t('AclPage.TableHeader_ScreenName')}</th>
                      <th>{t('AclPage.TableHeader_Access')}</th>
                      <th className="text-center">{t('AclPage.TableHeader_ChooseRole')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {error
                      && (
                        <tr>
                          <td colSpan="10" className="text-center">{t('NoDataFoundText')}</td>
                        </tr>
                      )}
                    {permission.map(data => (
                      <tr key={data.id}>
                        <td className="id">{count++}</td>
                        <td className="createShift">
                          {data.module}
                        </td>
                        <td className="createShift">{data.screen}</td>
                        <td className="createShift">{data.name}</td>
                        <td className="createShift text-center">
                          <span className="viewSchedule viewSchedule--edit">
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 40 }}
                              overlay={this.renderTooltip('Assign Permission')}
                            >
                              <img
                                src={userIcon}
                                alt="Edit Icon"
                                onClick={() => this.handleUpdaterole(data.id, data.isActive)
                              }
                              />
                            </OverlayTrigger>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <hr />
                <Col>
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
            {modelUpdate && (
            <Modal
              show={this.handleUpdaterole}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
              size="lg"
              className="userRoleModal"
            >
              <Modal.Header closeButton>
                <Modal.Title>{t('AclPage.assignPermission.Title')}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-0">
                <Table striped responsive className="p-0">
                  <thead>
                    <tr className="table-header ">
                      <th className="text-left">{t('AclPage.assignPermission.SNo')}</th>
                      <th>{t('AclPage.assignPermission.UserRole')}</th>
                      <th className="text-center">{t('AclPage.assignPermission.ProvideAccess')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignPermissionList.map((data, index) => (
                      <tr key={data.id}>
                        <td className="id">{index + 1}</td>
                        <td className="createShift">{data.name}</td>
                        <td className="createShift text-center">
                          <input
                            type="checkbox"
                            checked={data.isActive}
                            onChange={() => this.handleActiveStatus(!data.isActive, index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Modal.Body>
              <Modal.Footer className="d-flex justify-content-center">
                <div className="text-center">
                  <Button className="mb-2" variant="secondary" onClick={this.handleClose}>
                    Cancel
                  </Button>
                  <Button
                    className="mb-2"
                    disabled={!isEnabled}
                    variant="primary"
                    type="submit"
                    onClick={this.updateUser}
                  >
                    Submit
                  </Button>
                </div>
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
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  OK
                </Button>
              </Modal.Footer>
            </Modal>
            )}
          </Col>
        </Row>
        <div />
      </div>
    );
  }
}


export default withTranslation()(ACL);
