import React, { Component } from 'react';
import {
  Form,
  Col,
  Row,
  Button,
  Tooltip, OverlayTrigger, InputGroup, Modal,
}
  from 'react-bootstrap';
import Api from '../../common/Api';
import { userService } from '../../../services';
import LoadingSpinner from '../../shared/LoadingSpinner';


export class AdminSetting extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      token: `${token}`,
      userId,
      loading: false,
      earlyStart: 0,
      lateStart: 0,
      earlyFinish: 0,
      lateFinish: 0,
      adminTimeSheetLockInPeriod: 0,
      managerTimeSheetLockInPeriod: 0,
      employeeTimeSheetLockInPeriod: 0,
      showModel: false,
      responseMessage: '',
    };
  }

  componentDidMount = () => {
    this.getSettigData();
  }

  getSettigData = () => {
    const { token, userId } = this.state;
    this.setState({ loading: true });
    fetch(`${Api.settings.getSetting}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: `${token}`,
      }),
      body: JSON.stringify({
        id: userId,
        languageId: 1,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            earlyStart: response.data.earlyStart,
            lateStart: response.data.lateStart,
            earlyFinish: response.data.earlyFinish,
            lateFinish: response.data.lateFinish,
            adminTimeSheetLockInPeriod: response.data.adminTimeSheetLockInPeriod,
            managerTimeSheetLockInPeriod: response.data.managerTimeSheetLockInPeriod,
            employeeTimeSheetLockInPeriod: response.data.employeeTimeSheetLockInPeriod,
            loading: false,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getSettigData());
          });
        } else {
          this.setState({
            loading: false,
          });
        }
      });
  }

  SaveSettingData = () => {
    const {
      token, userId,
      earlyStart,
      lateStart,
      earlyFinish,
      lateFinish,
      adminTimeSheetLockInPeriod,
      managerTimeSheetLockInPeriod,
      employeeTimeSheetLockInPeriod,
      // showModel,
    } = this.state;
    this.setState({ loading: true });
    fetch(`${Api.settings.saveSetting}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: `${token}`,
      }),
      body: JSON.stringify({
        id: userId,
        languageId: 1,
        earlyStart: earlyStart !== '' ? parseInt(earlyStart, 10) : 0,
        lateStart: lateStart !== '' ? parseInt(lateStart, 10) : 0,
        earlyFinish: earlyFinish !== '' ? parseInt(earlyFinish, 10) : 0,
        lateFinish: lateFinish !== '' ? parseInt(lateFinish, 10) : 0,
        adminTimeSheetLockInPeriod: adminTimeSheetLockInPeriod !== '' ? parseInt(adminTimeSheetLockInPeriod, 10) : 0,
        managerTimeSheetLockInPeriod: managerTimeSheetLockInPeriod !== '' ? parseInt(managerTimeSheetLockInPeriod, 10) : 0,
        employeeTimeSheetLockInPeriod: employeeTimeSheetLockInPeriod !== '' ? parseInt(employeeTimeSheetLockInPeriod, 10) : 0,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            loading: false,
            showModel: true,
            responseMessage: response.message,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.SaveSettingData());
          });
        } else {
          this.setState({
            showModel: true,
            responseMessage: response.message,
          });
        }
      });
  }

  onCancel = () => {
    window.location.reload();
  }

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );
  
  handleClose = () => {
    this.setState({
      showModel: false,
    });
  };

  handleChange(event) {
    const { target } = event;
    const { name, value } = target;
    if (value < 0) {
      this.setState({
        [name]: 0,
      });
    } else {
      this.setState({
        [name]: value,
      });
    }
  }

  render() {
    const {
      employeeTimeSheetLockInPeriod, managerTimeSheetLockInPeriod, loading, showModel, responseMessage,
      adminTimeSheetLockInPeriod, earlyFinish, earlyStart, lateStart, lateFinish,
    } = this.state;
    let isAdministratorRole = false;
    if (userService.getRole().some(role => role.name === 'Administrators')) {
      isAdministratorRole = true;
    }
    let isEmployeeRole = true;
    if (userService.getRole().some(role => role.name === 'Employee')) {
      isEmployeeRole = false;
    }
  
    return (
      <>
        <div>
          {loading ? (<LoadingSpinner />) : null}
        </div>
        <div className="container-fluid">
          <div className="card_layout">
            <h4>Timesheet Lock</h4>
            <Form>
              <Row>
                <Col md={12} lg={12}>
                  <div>
                    <strong> Notes: </strong>
                    <p>
                      Month end Date + Additional days set in the this field.
                      <br />
                      Example: Month end date is 31+ 7=38 So this sheet will be locked after 38 days for Admin.Admin can’t do any changes in the timesheet after 38days
                    </p>
                  </div>
                  <Row>
                    { isAdministratorRole && (
                    <Col lg={4}>
                      <Form.Group controlId="formGridadminTimeSheetLockInPeriod">
                        <Form.Label className="form-label-custom">Lock for Admin</Form.Label>
                        <InputGroup>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 50, hide: 40 }}
                            overlay={this.renderTooltip('Additional days given to edit timesheet.')}
                          >
                            <Form.Control
                              name="adminTimeSheetLockInPeriod"
                              value={adminTimeSheetLockInPeriod}
                              type="number"
                              onChange={event => this.handleChange(event)}
                              disabled={!isAdministratorRole}
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                            
                          </OverlayTrigger>
                          <div className="input-group-append">
                            <span className="input-group-text"> Days </span>
                          </div>
                        </InputGroup>
   
                      </Form.Group>
                    </Col>
                    )}
                    {isEmployeeRole && (
                    <Col lg={4}>
                      <Form.Group controlId="formGridmanagerTimeSheetLockInPeriod">
                        <Form.Label className="form-label-custom">Lock for Manager</Form.Label>
                        <InputGroup>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 50, hide: 40 }}
                            overlay={this.renderTooltip('Additional days given to edit timesheet.')}
                          >
                            <Form.Control
                              name="managerTimeSheetLockInPeriod"
                              value={managerTimeSheetLockInPeriod}
                              type="number"
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                              onChange={event => this.handleChange(event)}
                              disabled={!isAdministratorRole}
                            />
                          </OverlayTrigger>
                          <div className="input-group-append">
                            <span className="input-group-text"> Days </span>
                          </div>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    )}
                    <Col lg={4}>
                      <Form.Group controlId="formGridemployeeTimeSheetLockInPeriod">
                        <Form.Label className="form-label-custom">Lock for Employee</Form.Label>
                        <InputGroup>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 50, hide: 40 }}
                            overlay={this.renderTooltip('Additional days given to edit timesheet.')}
                          >
                            <Form.Control
                              name="employeeTimeSheetLockInPeriod"
                              value={employeeTimeSheetLockInPeriod}
                              type="number"
                              onChange={event => this.handleChange(event)}
                              disabled={!isAdministratorRole}
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                          </OverlayTrigger>
                          <div className="input-group-append">
                            <span className="input-group-text"> Days </span>
                          </div>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div>
                    <h4>Exception Threshold</h4>
                  </div>
                  <Row className="mt-3">
                    <Col lg={3}>
                      <Form.Group controlId="formGridearlyStart">
                        <Form.Label className="form-label-custom">Early Start Shift</Form.Label>
                        <InputGroup>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 50, hide: 40 }}
                            overlay={this.renderTooltip('If set the user cannot start shift before this time.')}
                          >
                            <Form.Control
                              name="earlyStart"
                              value={earlyStart}
                              type="number"
                              onChange={event => this.handleChange(event)}
                              disabled={!isAdministratorRole}
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                          </OverlayTrigger>
                          <div className="input-group-append">
                            <span className="input-group-text"> Mintues </span>
                          </div>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col lg={3}>
                      <Form.Group controlId="formGridearlyFinish">
                        <Form.Label className="form-label-custom">Early Finish Shift</Form.Label>
                        <InputGroup>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 50, hide: 40 }}
                            overlay={this.renderTooltip('If set the user cannot end shift after this time.')}
                          >
                            <Form.Control
                              name="earlyFinish"
                              value={earlyFinish}
                              type="number"
                              onChange={event => this.handleChange(event)}
                              disabled={!isAdministratorRole}
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                          </OverlayTrigger>
                          <div className="input-group-append">
                            <span className="input-group-text">  Mintues </span>
                          </div>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col lg={3}>
                      <Form.Group controlId="formGridlateStart">
                        <Form.Label className="form-label-custom">Late Start Shift</Form.Label>
                        <InputGroup>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 50, hide: 40 }}
                            overlay={this.renderTooltip('If set the user cannot start shift after this time.')}
                          >
                            <Form.Control
                              name="lateStart"
                              value={lateStart}
                              type="number"
                              onChange={event => this.handleChange(event)}
                              disabled={!isAdministratorRole}
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                          </OverlayTrigger>
                          <div className="input-group-append">
                            <span className="input-group-text">  Mintues </span>
                          </div>
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col lg={3}>
                      <Form.Group controlId="formGridlateFinish">
                        <Form.Label className="form-label-custom">Late Finish Shift</Form.Label>
                        <InputGroup>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 50, hide: 40 }}
                            overlay={this.renderTooltip('If set the user cannot start shift after this time.')}
                          >

                            <Form.Control
                              name="lateFinish"
                              value={lateFinish}
                              type="number"
                              onChange={event => this.handleChange(event)}
                              disabled={!isAdministratorRole}
                              onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />
                          </OverlayTrigger>
                          <div className="input-group-append">
                            <span className="input-group-text">  Mintues </span>
                          </div>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="justify-content-center mt-3">
                <Button className="mt-2" disabled={!isAdministratorRole} onClick={this.SaveSettingData}>Save</Button>
                <Button className="mt-2" disabled={!isAdministratorRole} onClick={this.onCancel}>Cancel</Button>
              </Row>
            </Form>
          </div>
        </div>

        {
                showModel && (
                  <Modal
                    show={this.SaveSettingData}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                  >
                    <Modal.Body>
                      {responseMessage}
                     
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="primary" onClick={this.handleClose}>
                        OK
                      </Button>
                    </Modal.Footer>
                  </Modal>
                )
              }
      </>
    );
  }
}

export default AdminSetting;
