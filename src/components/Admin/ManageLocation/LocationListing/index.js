import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Form, Button, Row, Col, Table, Modal, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import './style.scss';
import { Link } from 'react-router-dom';
import EyeView from '../../../../Images/Icons/eye_2.svg';
import EditIcon from '../../../../Images/Icons/edit_1.svg';
import api from '../../../common/Api';
import PaginationAndPageNumber from '../../../shared/Pagination/index';
import { userService } from '../../../../services';
import Loaders from '../../../shared/Loaders';


class CreateGeofence extends React.PureComponent {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    this.state = {
      token: `${token}`,
      loaded: false,
      isSearch: false,
      stateList: [],
      countryList: [],
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
      countryId: 0,
      stateId: 0,
      workLocationId: 0,
      alias: '',
      tableData: [],
      workLocationList: [],
      ModelUpdate: false,
      errorMessage: '',
    };
  }


  componentDidMount() {
    this.loadData();
    this.getCountries();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.loadData();
    }
  }

  loadData = () => {
    const {
      pageIndex, pageSize, token, alias, workLocationId, countryId, stateId,
    } = this.state;
    const data = {
      id: 0,
      languageId: 0,
      offset: '',
      role: '',
      isActive: true,
      roleIds: '',
      publicKey: '',
      pageIndex,
      pageSize,
      workLocationId: parseInt(workLocationId, 10),
      alias,
      countryId: parseInt(countryId, 10),
      stateId: parseInt(stateId, 10),
    };

    fetch(`${api.geolocation.search}`, {
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
            tableData: response.data,
            totalRecords: response.totalRecords,
            loaded: true,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.loadData());
          });
        } else {
          this.setState({
            tableData: response.data,
            loaded: true,
          });
        }
      });
  }

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  getCountries = () => {
    const {
      token,
    } = this.state;
    const data = {
      id: 0,
      languageId: 0,
      role: '',
      isActive: true,
      roleIds: '',
      publicKey: '',
      showUnpublished: true,
    };

    fetch(`${api.manageEmp.getallcountries}`, {
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
            countryList: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getCountries());
          });
        }
      });
  }

  getWorkLocation = () => {
    const {
      token, stateId,
    } = this.state;
    const data = {
      id: 0,
      languageId: 0,
      offset: '',
      role: '',
      isActive: true,
      roleIds: '',
      publicKey: '',
      city: '',
      stateId: parseInt(stateId, 10),
    };

    fetch(`${api.manageEmp.searchworklocation}`, {
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
            workLocationList: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getWorkLocation());
          });
        }
      });
  }

  getState = () => {
    const {
      token,
      countryId,
    } = this.state;
    const data = {
      id: parseInt(countryId, 10),
      languageId: 0,
      role: '',
      isActive: true,
      roleIds: '',
      publicKey: '',
      showUnpublished: true,
    };

    fetch(`${api.manageEmp.getstatesbycountryid}`, {
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
            stateList: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getState());
          });
        }
      });
  }

  handleSubmit = () => {
    this.setState({
      pageIndex: 1,
      loaded: false,
      isSearch: true,
    });
  }

  handleClose = () => {
    this.setState({
      ModelUpdate: false,
    });
  };


  handleReset = () => {
    this.setState({
      pageIndex: 1,
      countryId: 0,
      stateId: 0,
      workLocationId: 0,
      alias: '',
      loaded: false,
      isSearch: false,
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

  changeStatus = (id, isActive) => {
    const {
      token, ModelUpdate,
    } = this.state;
    const userId = userService.getUserId();

    const data = {
      id,
      isActive: !isActive,
      updatedByUserId: userId,
      languageId: 1,
    };

    fetch(`${api.geolocation.status}`, {
      method: 'POST',
      headers: {
        token: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),

    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          // alert(response.message);
          this.handleClose();
          this.setState({
            loaded: false,
            ModelUpdate: !ModelUpdate,
            errorMessage: response.message,
          });
        } else {
          this.handleClose();
          this.setState({
            ModelUpdate: !ModelUpdate,
            errorMessage: response.errors,
          });
        }
      });
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, type, checked } = target;
    const value = type === 'checkbox' ? checked : target.value;
    this.setState({
      [name]: value,
    }, () => {
      if (name === 'countryId') {
        this.getState();
      }
      if (name === 'stateId') {
        this.getWorkLocation();
      }
      return true;
    });
  }

  render() {
    const {
      totalRecords, pageSize, pageIndex, countryId, stateId,
      workLocationId, alias, tableData, countryList,
      stateList, workLocationList, isSearch, ModelUpdate, errorMessage, loaded,
    } = this.state;
    const { t } = this.props;
    return (
      <div className="container-fluid location-listing">
        <div className="card_layout">
          <Row>
            <Col lg={12} md={12}>
              <Form className="row">
                <Form.Group controlId="exampleForm.SelectCustom" as={Col} lg={4} md={12}>
                  <Form.Label>{t('ManageLocation.country')}</Form.Label>
                  <Form.Control name="countryId" value={countryId} onChange={e => this.handleInputChange(e)} as="select">
                    <option value={0}>Choose...</option>
                    {
                      countryList.map(x => (
                        <option value={x.id}>
                          {x.name}
                        </option>
                      ))
                    }
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" as={Col} lg={4} md={12}>
                  <Form.Label>{t('ManageLocation.state')}</Form.Label>
                  <Form.Control as="select" name="stateId" value={stateId} onChange={e => this.handleInputChange(e)}>
                    <option value={0}>Choose...</option>
                    {
                      stateList.map(x => (
                        <option value={x.id}>
                          {x.name}
                        </option>
                      ))
                    }
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" as={Col} lg={4} md={12}>
                  <Form.Label>{t('ManageLocation.officeAddress')}</Form.Label>
                  <Form.Control as="select" name="workLocationId" value={workLocationId} onChange={e => this.handleInputChange(e)}>
                    <option value={0}>Choose...</option>
                    {
                      workLocationList.map(x => (
                        <option value={x.id}>
                          {x.name}
                        </option>
                      ))
                    }
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" as={Col} lg={4} md={12}>
                  <Form.Label>{t('ManageLocation.aliasName')}</Form.Label>
                  <Form.Control placeholder="Enter Alias Name" name="alias" value={alias} onChange={e => this.handleInputChange(e)} />
                </Form.Group>
                <Col lg={6} md={12}>
                  <div className="px-1 mt-4">
                    <Button className="mt-2" onClick={() => this.handleSubmit()}>
                      {' '}
                      {t('SearchBtn')}
                      {' '}
                    </Button>
                    {isSearch && (
                      <Button className="mt-2" onClick={() => this.handleReset()}>
                        {' '}
                        {t('ResetBtn')}
                        {' '}
                      </Button>
                    )}
                  </div>

                </Col>
              </Form>
            </Col>


          </Row>


          {loaded ? (
            <>
              <Row className="mt-5">
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th className="w-auto">{t('CountryText')}</th>
                      <th className="w-auto">{t('ManageLocation.state')}</th>
                      <th className="w-auto">{t('ManageLocation.officeAddress')}</th>
                      <th className="w-auto">{t('ManageLocation.Alias')}</th>
                      <th className="w-auto">{t('ManageLocation.GeofenceType')}</th>
                      <th className="w-auto">{t('Status')}</th>
                      <th className="w-auto">{t('Action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map(data => (
                      <tr key={data.id}>
                        <td>
                          {data.countryName}
                        </td>
                        <td>
                          {data.stateName}
                        </td>
                        <td>
                          {data.officeAddress}
                        </td>
                        <td>
                          {data.alias}
                        </td>
                        <td>
                          {data.geofenceType}
                        </td>
                        <td>
                          <label className="switch">
                            <input type="checkbox" name="geo-fancing" onChange={() => this.changeStatus(data.id, data.isActive)} checked={data.isActive} />
                            <span className="switch-slider" />
                          </label>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="icon-edit primary-bg mr-2">
                              <Link to={`/manage-location/geofence/${data.id}/${true}`}>
                               
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 50, hide: 40 }}
                                  overlay={this.renderTooltip('Edit')}
                                >
                                  <img
                                    src={EditIcon}
                                    alt="Edit Icon"
                                  />
                                </OverlayTrigger>
                              </Link>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

              </Row>
              <PaginationAndPageNumber
                totalPageCount={Math.ceil(totalRecords / pageSize)}
                totalElementCount={totalRecords}
                updatePageNum={() => this.updatePageNum()}
                updatePageCount={() => this.updatePageCount()}
                currentPageNum={pageIndex}
                recordPerPage={pageSize}
              />
            </>

          ) : (
            <Loaders />
          )}

          {ModelUpdate && (
            <Modal
              show={this.changeStatus}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {' '}
                  {errorMessage}
                </Modal.Title>
              </Modal.Header>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  {t('OkBtn')}
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      </div>
    );
  }
}

export default withTranslation()(CreateGeofence);
