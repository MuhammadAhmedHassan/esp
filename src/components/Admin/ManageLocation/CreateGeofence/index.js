import React from 'react';
import {
  Form, Button, Row, Col, Modal,
} from 'react-bootstrap';
import './style.scss';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Map from './radiusMap';
// import GeoMap from './dynamicMap';
import PolyMap from './polygonMap';
import api from '../../../common/Api';
import { userService } from '../../../../services';

class LocationListing extends React.PureComponent {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    const { match: { params } } = this.props;
    this.state = {
      id: params.id || 0,
      isEditEnabled: !!params.id,
      token: `${token}`,
      userId,
      stateList: [],
      countryList: [],
      countryId: 0,
      stateId: 0,
      workLocationId: 0,
      alias: '',
      workLocationList: [],
      unitId: 10,
      radius: 10,
      geofencingTypeId: 0,
      selectedLocation: [],
      formErrors: {},
      isActive: true,
      ModelUpdate: false,
      errorMessage: '',
      isTrue: params.true,
    };
  }

  componentDidMount() {
    const { id } = this.state;
    if (id !== 0) {
      this.loadData();
    }
    this.getCountries();
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      window.location.reload();
    }
  }

  loadData = () => {
    const {
      token,
      id,
    } = this.state;
    const data = {
      id: parseInt(id, 10),
      languageId: 1,
      role: '',
      isActive: true,
      roleIds: '',
      publicKey: '',
    };

    fetch(`${api.geolocation.get}`, {
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
            alias: response.data.alias,
            countryId: response.data.countryId,
            geofence: response.data.geofence,
            geofencingTypeId: response.data.geofenceTypeId,
            radius: response.data.radius,
            stateId: response.data.stateId,
            unitId: response.data.unitId,
            workLocationId: response.data.workLocationId,
            isActive: response.data.isActive,
          }, () => {
            this.getState();
            this.getWorkLocation();
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.loadData());
          });
        }
      });
  }

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

  getFence = (id) => {
    const {
      token,
    } = this.state;
    const data = {
      id,
      languageId: 1,
      role: '',
      isActive: true,
      roleIds: '',
      publicKey: '',
    };

    fetch(`${api.geolocation.getLocationOnWorkBaises}`, {
      method: 'POST',
      headers: {
        token: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),

    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          if (response.data) {
            const rdata = [].concat(response.data);
            if (rdata.length > 0) {
              this.setState({
                isFenceCreated: response.data,
              });
            } else {
              this.setState({
                isFenceCreated: null,
              });
            }
          } else {
            this.setState({
              isFenceCreated: null,
            });
          }
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getFence(id));
          });
        } else {
          this.setState({
            isFenceCreated: null,
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
          }, () => {
            const { id } = this.state;
            if (id !== 0) {
              this.selectWorkLocation();
            }
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
            errorMessage: response.message,
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

  getBounderies = (e) => {
    // console.log(e.current.getBounds());
    // const ne = e.current.getBounds().getNorthEast();
    // const sw = e.current.getBounds().getSouthWest();
    // console.log(`${ne.lat()};${ne.lng()}`);
    // console.log(`${sw.lat()};${sw.lng()}`);
  }

  getPolyBounderies = (e) => {
    if (e.current) {
      const polygonBounds = e.current.getPath();
      const bounds = [];
      let geofence = '';
      for (let i = 0; i < polygonBounds.length; i++) {
        const point = {
          lat: polygonBounds.getAt(i).lat(),
          lng: polygonBounds.getAt(i).lng(),
        };
        bounds.push(point);
        geofence += `${polygonBounds.getAt(i).lat()} ${polygonBounds.getAt(i).lng()},`;
      }
      this.setState({ geofence });
    }
  }

  selectWorkLocation = () => {
    const { workLocationId, workLocationList, radius } = this.state;
    const selected = workLocationList.filter(x => x.id === parseInt(workLocationId, 10));
    if (selected.length > 0) {
      const geolocation = selected[0].geolocation.split(' ');
      // eslint-disable-next-line prefer-destructuring
      selected[0].latitude = parseFloat(geolocation[0]);
      // eslint-disable-next-line prefer-destructuring
      selected[0].longitude = parseFloat(geolocation[1]);
      selected[0].circle = {
        options: {
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: { radius },
          fillOpacity: 0.35,
          editable: false,
          draggable: false,
        },
      };
    }
    this.setState({
      selectedLocation: selected,
    });
  }

  setUnit = (prevUint) => {
    const { unitId, radius } = this.state;
    let r = radius;
    const unitNew = parseInt(unitId, 10);
    const unit = parseInt(prevUint, 10);
    // prevUint === 'mtr' && unitId === 'kmtr'
    if (unit === 10 && unitNew === 20) {
      r /= 1000;
      // prevUint === 'mtr' && unitId === 'miles'
    } else if (unit === 10 && unitNew === 30) {
      r /= 1609.34;
      // prevUint === 'kmtr' && unitId === 'mtr'
    } else if (unit === 20 && unitNew === 10) {
      r *= 1000;
      // prevUint === 'kmtr' && unitId === 'mile'
    } else if (unit === 20 && unitNew === 30) {
      r /= 1.609;
      // prevUint === 'mile' && unitId === 'kmtr'
    } else if (unit === 30 && unitNew === 20) {
      r *= 1.609;
      // prevUint === 'mile' && unitId === 'mtr'
    } else if (unit === 30 && unitNew === 10) {
      r *= 1609.34;
    }
    this.setState({ radius: r }, () => this.selectWorkLocation());
  }

  handleFormValidation = () => {
    const {
      countryId,
      stateId,
      workLocationId,
      alias,
      radius,
      geofencingTypeId,
    } = this.state;

    const formErrors = {};
    let formIsValid = true;

    if (geofencingTypeId === 0) {
      formIsValid = false;
      formErrors.geofencingTypeErr = 'Fence is required';
    } else if (geofencingTypeId === 10) {
      if (!radius || radius === 0) {
        formIsValid = false;
        formErrors.radiusErr = 'Radius is required';
      }
    }

    if (countryId === 0) {
      formIsValid = false;
      formErrors.countryErr = 'Country is required';
    }
    if (stateId === 0) {
      formIsValid = false;
      formErrors.stateErr = 'State is required';
    }
    if (workLocationId === 0) {
      formIsValid = false;
      formErrors.workLocationErr = 'Office address is required';
    }
    if (alias === '') {
      formIsValid = false;
      formErrors.aliasErr = 'Alias is required';
    }

    this.setState({ formErrors });
    return formIsValid;
  };

  handleClose = () => {
    this.setState({
      ModelUpdate: false,
    });
  };

  handleSubmit = () => {
    const {
      token,
      id,
      workLocationId,
      geofencingTypeId,
      alias,
      unitId,
      radius,
      userId,
      selectedLocation,
      geofence,
      isActive,
      ModelUpdate,
      errorMessage,
    } = this.state;

    if (this.handleFormValidation()) {
      const data = {
        id: parseInt(id, 10),
        languageId: 1,
        offset: '',
        role: '',
        isActive,
        roleIds: '',
        publicKey: '',
        workLocationId: parseInt(workLocationId, 10),
        geoLocation: selectedLocation[0].geolocation,
        alias,
        geofencingTypeId,
        radius,
        unitId: parseInt(unitId, 10),
        geofence,
        createdUpdatedByUserId: userId,
      };

      fetch(`${api.geolocation.manage}`, {
        method: 'POST',
        headers: {
          token: `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),

      }).then(response => response.json())
        .then((response) => {
          if (response.statusCode === 200) {
            this.handleClose();
            this.setState({
              ModelUpdate: !ModelUpdate,
              errorMessage: response.message,
            });
            // window.location.href = '/manage-location/location-listing';
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.handleSubmit());
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
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, type, checked } = target;
    let value = type === 'checkbox' ? checked : target.value;
    const { unitId } = this.state;
    if (name === 'radius' || name === 'geofencingTypeId') {
      value = parseInt(value, 10);
    }
    this.setState({
      [name]: value,
    }, () => {
      if (name === 'countryId') {
        this.getState();
      }
      if (name === 'stateId') {
        this.getWorkLocation();
      }
      if (name === 'unitId') {
        this.setUnit(unitId);
      }
      if (name === 'workLocationId') {
        // eslint-disable-next-line react/destructuring-assignment
        this.getFence(parseInt(this.state.workLocationId, 10));
        this.selectWorkLocation();
      }
      if (name === 'radius') {
        this.selectWorkLocation();
      }
      return true;
    });
  }

  render() {
    const {
      countryId, stateId, workLocationId, alias, isEditEnabled,
      countryList, stateList, workLocationList, isFenceCreated, isTrue,
      geofencingTypeId, radius, selectedLocation, unitId, formErrors, geofence,
      ModelUpdate, errorMessage,
    } = this.state;
    const {
      geofencingTypeErr, radiusErr, countryErr, stateErr, workLocationErr, aliasErr,
    } = formErrors;
    const { t } = this.props;
    
    return (
      <div className="container-fluid create-geofence">
        <div className="card_layout">
          <Row>
            <Col lg={12} md={12}>
              <Form className="row">
                <Form.Group controlId="exampleForm.SelectCustom" as={Col} lg={6} md={12}>
                  <Form.Label>
                    {t('ManageLocation.country')}
                    <span className="redStar">*</span>
                  </Form.Label>
                  <Form.Control name="countryId" value={countryId} disabled={isEditEnabled} onChange={e => this.handleInputChange(e)} as="select">
                    <option value={0}>Choose...</option>
                    {
                      countryList.map(x => (
                        <option value={x.id}>
                          {x.name}
                        </option>
                      ))
                    }
                  </Form.Control>
                  {countryErr && <span className="mandatory">{countryErr}</span>}
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" as={Col} lg={6} md={12}>
                  <Form.Label>
                    {t('ManageLocation.state')}
                    <span className="redStar">*</span>
                  </Form.Label>
                  <Form.Control as="select" name="stateId" disabled={isEditEnabled} value={stateId} onChange={e => this.handleInputChange(e)}>
                    <option value={0}>Choose...</option>
                    {
                      stateList.map(x => (
                        <option value={x.id}>
                          {x.name}
                        </option>
                      ))
                    }
                  </Form.Control>
                  {stateErr && <span className="mandatory">{stateErr}</span>}
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" as={Col} lg={6} md={12}>
                  <Form.Label>
                    {t('ManageLocation.officeAddress')}
                    <span className="redStar">*</span>
                  </Form.Label>
                  <Form.Control as="select" name="workLocationId" disabled={isEditEnabled} value={workLocationId} onChange={e => this.handleInputChange(e)}>
                    <option value={0}>Choose...</option>
                    {
                      workLocationList.map(x => (
                        <option value={x.id}>
                          {x.name}
                        </option>
                      ))
                    }
                  </Form.Control>
                  {workLocationErr && <span className="mandatory">{workLocationErr}</span>}
                </Form.Group>

                <Form.Group controlId="exampleForm.SelectCustom" as={Col} lg={6} md={12}>
                  <Form.Label>
                    {t('ManageLocation.aliasName')}
                    <span className="redStar">*</span>
                  </Form.Label>
                  <Form.Control placeholder="Enter Alias Name" name="alias" value={alias} onChange={e => this.handleInputChange(e)} />
                  {aliasErr && <span className="mandatory">{aliasErr}</span>}
                </Form.Group>
                <Col md={12}>
                  <h5>
                    {isFenceCreated && (
                      <p>
                        <strong className="dangerText">Note: </strong>
                        {t('ManageLocation.textMessage')}
                        {' '}
                        <Link className="ml-2" to={`/manage-location/geofence/${isFenceCreated.id}/true`}>
                          {' '}
                          {t('ManageLocation.clickHere')}
                          {' '}
                        </Link>
                        {' '}

                      </p>
                    )}
                  </h5>
                </Col>

                <Form.Group as={Col} md={12}>
                  <Row>
                    <Col md={12}>
                      <h5 className="my-3">
                        {t('ManageLocation.addGeofence')}
                        <span className="redStar">*</span>
                      </h5>
                      {geofencingTypeErr && <span className="mandatory">{geofencingTypeErr}</span>}
                    </Col>
                  </Row>

                  <Row className="px-4  geo-fancing mt-4">
                    <Col className="custom-control custom-radio checked">
                      <input type="radio" className="custom-control-input" id="usingRadius" checked={geofencingTypeId === 10} value={10} name="geofencingTypeId" onChange={e => this.handleInputChange(e)} />
                      <label className="custom-control-label" htmlFor="usingRadius">{t('ManageLocation.usingRadius')}</label>
                    </Col>
                    <Col className="custom-control custom-radio pl-5">
                      <input type="radio" className="custom-control-input" id="DynamicCoordination" value={20} name="geofencingTypeId" checked={geofencingTypeId === 20} onChange={e => this.handleInputChange(e)} />
                      <label className="custom-control-label" htmlFor="DynamicCoordination">{t('ManageLocation.dynamicCoOrdination')}</label>
                    </Col>
                  </Row>
                </Form.Group>

                {
                  // 'usingRadius'
                  geofencingTypeId === 10
                  && (
                    <>
                      <Form.Group controlId="exampleForm.SelectCustom" as={Col} lg={6} md={12}>
                        <Form.Label>
                          {t('ManageLocation.radius')}
                        </Form.Label>
                        <Form.Control type="number" placeholder="Enter Radius" value={radius} name="radius" onChange={e => this.handleInputChange(e)} />
                        {radiusErr && <span className="mandatory">{radiusErr}</span>}
                      </Form.Group>
                      <Form.Group controlId="exampleForm.SelectCustom" as={Col} lg={6} md={12}>
                        <Form.Label>{t('ManageLocation.Unite')}</Form.Label>
                        <Form.Control as="select" value={unitId} name="unitId" onChange={e => this.handleInputChange(e)}>
                          <option value={10}>Meters</option>
                          <option value={20}>Km</option>
                          <option value={30}>Mile</option>
                        </Form.Control>
                      </Form.Group>
                    </>
                  )
                }
              </Form>

            </Col>
            {
              // usingRadius
              geofencingTypeId === 10 && selectedLocation.length > 0
              && (
                <Col lg={6} md={12} className="mt-4" radius={radius}>
                  {
                    radius > 0
                    && (
                      <Map
                        center={{ lat: selectedLocation[0].latitude, lng: selectedLocation[0].longitude }}
                        radius={radius}
                        zoom={12}
                        places={selectedLocation}
                        getBound={e => this.getBounderies(e)}
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDJNMXJ82mymc7PjZtF8KxpLz4lDWxjdJI"
                        loadingElement={<div style={{ height: '100%' }} />}
                        containerElement={<div style={{ height: '400px' }} />}
                        mapElement={<div style={{ height: '100%' }} />}
                      />
                    )
                  }

                </Col>
              )
            }

            {
              // dynamicCoordination
              geofencingTypeId === 20 && selectedLocation.length > 0
              && (
                <Col lg={8} md={12} className="mt-4">
                  <PolyMap
                    center={{ lat: selectedLocation[0].latitude, lng: selectedLocation[0].longitude }}
                    radius={radius}
                    geofence={geofence}
                    zoom={12}
                    places={selectedLocation}
                    getBound={e => this.getPolyBounderies(e)}
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDJNMXJ82mymc7PjZtF8KxpLz4lDWxjdJI"
                    loadingElement={<div style={{ height: '100%' }} />}
                    containerElement={<div style={{ height: '400px' }} />}
                    mapElement={<div style={{ height: '100%' }} />}
                  />
                </Col>
              )
            }
          </Row>
          <hr />
          <Row>
            <Col lg={4} className="d-flex justify-content-end px-1 mt-4" />
            <Col lg={8} className="d-flex justify-content-end px-1 mt-4">
              <Row>
                {isTrue && (
                  <Col sm={6} className="mb-1">
                    <Link to="/manage-location/location-listing" className="btn btn-secondary">
                      {t('CancelBtn')}
                    </Link>
                  </Col>
                )
                }
                <Col sm={6} className="mb-1">
                  <Button className="" onClick={() => this.handleSubmit()}>
                    {' '}
                    {t('SaveBtn')}
                    {' '}
                  </Button>
                </Col>
              </Row>


            </Col>
          </Row>
        </div>

        {ModelUpdate && (
          <Modal
            show={this.handleSubmit}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {' '}
                <p>{errorMessage}</p>
                {' '}
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/manage-location/location-listing';
                }}
              >
                Ok
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>

    );
  }
}

export default withTranslation()(LocationListing);
