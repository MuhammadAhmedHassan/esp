/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { withTranslation } from 'react-i18next';
import './style.scss';
import {
  Navbar, Nav, Dropdown, Button, Modal, Row, Col, Container, FormControl, InputGroup,
} from 'react-bootstrap';

import { withRouter, Link } from 'react-router-dom';
import logo from '../../../Images/logos/esp_logo_linear_white.svg';
import notification from '../../../Images/Icons/icon_notification.svg';
import setting from '../../../Images/Icons/icon_settings.svg';
import profile from '../../../Images/Icons/icon_profile.svg';
import '../Multilingual/i18nextInit';
import LanguageSelect from '../Multilingual/languageSelect';
import Api from '../../common/Api';
import { userService } from '../../../services';
import Cancel from '../../../Images/Icons/cancel.svg';
import searchIcon from '../../../Images/Icons/search_icon.svg';
import { commonService } from '../../../services/common.service';
import clockIcon from '../../../Images/Icons/clock.svg';

const { impersonationSubject } = userService;
let impersentSubscriber;
const errorMessage = 'You are out of Zone';

class Header extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    const user = userService.getUser();
    const impUser = userService.getImpUser();
    this.state = {
      token: `${token}`,
      userId,
      user,
      impUser,
      showEndModal: false,
      showUserName: false,
      geoCoordinates: '',
      isForced: false,
      showModel: false,
      isClockIn: false,
      sourceGuid: '',
      responseMessage: '',
      displayMessage: false,
      responseStatus: false,
      getClockInData: [],
      impersonatorName: '',
      confirmDelegation: false,
      isImpersenating: false,
      notificationCount: null,
      recentNotification: [],
      showNotification: false,
      updated: false,
      messageModal: '',
      showMessageModal: false,
    };
  }

  componentWillMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.unlisten = this.props.history.listen((location, action) => {
      this.setState({ updated: true });
    });
  }

  componentDidMount() {
    impersentSubscriber = impersonationSubject.subscribe((val) => {
      this.setState({ showUserName: val.showName, isImpersenating: val.showName, impersonatorName: val.name });
    });
    this.getClockInOutStatus();
    this.getPunchLogSourceGuid();
    navigator.geolocation.getCurrentPosition((position) => {
      const geoLocation = `${position.coords.latitude} ${position.coords.longitude}`;
      this.setState({ geoCoordinates: geoLocation });
    });
    this.getNotificationCount();
    this.getRecentNotification();
  }

  componentDidUpdate(prevProps) {
    const { updated } = this.state;
    if (updated) {
      this.getNotificationCount();
      this.getRecentNotification();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ updated: false });
    }
  }

  componentWillUnmount() {
    if (impersentSubscriber) {
      impersentSubscriber.unsubscribe();
    }
    this.unlisten();
  }

  getNotificationCount = () => {
    const {
      token, userId,
    } = this.state;
    const data = {
      languageId: 1,
      userId,
      id: 0,
      offset: '',
      isActive: true,
      notificationCategoryId: 0,
      unreadNotificationOnly: true,
    };

    fetch(`${Api.notification.getCount}`, {
      method: 'POST',
      headers: new Headers({
        token: userService.getToken(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            notificationCount: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            this.getNotificationCount();
          });
        } else {
          this.setState({
            notificationCount: response.data,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getRecentNotification = () => {
    const {
      token, userId,
    } = this.state;
    fetch(`${Api.notification.getNotificationWithCategory}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: userService.getToken(),
      }),
      body: JSON.stringify({
        languageId: 1,
        pageIndex: 1,
        pageSize: 5,
        userId,
        // notificationCategoryId: category.id,
        unreadNotificationOnly: true,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            recentNotification: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            this.getRecentNotification();
          });
        } else {
          alert(response.message);
        }
      });
  }


  getPunchLogSourceGuid = () => {
    const {
      token, userId,
    } = this.state;
    const data = {
      languageId: 1,
      userId,
    };

    fetch(`${Api.punchLogSource}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        this.setState({
          sourceGuid: response.data[0].sourceGuid,
        });
      })
      .catch(err => console.error(err.toString()));
  }

  handleClick = () => {
    this.doClockIn();
  }

  handleClose = () => {
    this.setState({
      showModel: false,
      displayMessage: false,
    }, () => window.location.reload());
  };


  getClockInOutStatus = () => {
    const {
      token, userId,
    } = this.state;
    const data = {
      languageId: 1,
      id: userId,
    };

    fetch(`${Api.getClockInOutStatus}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            isClockIn: response.data.isUserClockIn,
            getClockInData: response.data,
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }


  doClockInOutsideGeolocation = () => {
    const {
      token, userId, geoCoordinates, isClockIn, sourceGuid,
    } = this.state;

    if (geoCoordinates === '') {
      this.setState({
        showMessageModal: true,
        messageModal: 'Please allow location access to use this feature',
      });
      return true;
    }

    const data = {
      languageId: 1,
      userId,
      isClockIn: !(isClockIn),
      sourceGuid,
      geoCoordinates,
      isForced: true,
    };

    fetch(`${Api.clockIn}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 290) {
          this.setState({
            showModel: true,
          });
        } else if (response.statusCode === 200) {
          this.setState({
            isClockIn: !(isClockIn),
            displayMessage: true,
            responseMessage: response.message,
            responseStatus: response.statusCode,
          });
        } else if (response.statusCode !== 200) {
          this.setState({
            displayMessage: true,
            responseMessage: response.message,
            responseStatus: response.statusCode,
          });
        }
      }, this.handleClose())
      .catch(err => console.error(err.toString()));
    return true;
  }

  doClockIn = () => {
    const {
      token, userId, geoCoordinates, isClockIn, isForced, sourceGuid,
    } = this.state;

    if (geoCoordinates === '') {
      this.setState({
        showMessageModal: true,
        messageModal: 'Please allow location access to use this feature',
      });
      return true;
    }

    const data = {
      languageId: 1,
      userId,
      isClockIn: !(isClockIn),
      sourceGuid,
      geoCoordinates,
      isForced,
    };

    fetch(`${Api.clockIn}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 290) {
          this.setState({
            showModel: true,
          });
        } else if (response.statusCode === 200) {
          this.setState({
            isClockIn: !(isClockIn),
            displayMessage: true,
            responseMessage: response.message,
            responseStatus: response.statusCode,
          });
        } else if (response.statusCode !== 200) {
          this.setState({
            displayMessage: true,
            responseMessage: response.message,
            responseStatus: response.statusCode,
          });
        }
      })
      .catch(err => console.error(err.toString()));
    return true;
  }

  endImpersonation = () => {
    const impUser = userService.getImpUser();
    const user = userService.getUser();
    const data = {
      id: Number(user.userId), languageId: 1,
    };
    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: userService.getToken(),
      }),
      body: JSON.stringify(data),
    };
    fetch(`${Api.delegation.endImpersonation}`, requestOptions)
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          sessionStorage.clear();
          this.setState({
            isImpersenating: false,
            showEndModal: true,
            loaded: false,
          });
          // const user = userService.getUser();
          // user.accessToken = `${response.data.accessToken}`
          // user.expires=`${response.data.impersonation_end_date}`
          // user.impersonatorName = ``
          impersonationSubject.next({ showName: false, name: user.impersonatorName });
          // user.userId = Number(response.data.userId)
          // document.cookie = `espUser=${JSON.stringify(user ? user:{} )}`;
          // this.setState({user});
          // this.getEmployees()
          document.cookie = `espUser=${JSON.stringify(impUser || {})};path=/`;
          document.cookie = `${'espImp' + '=; expires='}${new Date().toUTCString()};path=/`;
        } else {
          this.setState({
            loaded: true,
            error: true,
          });
        }
      });
  }

  render() {
    const {
      showModel, responseMessage, isClockIn,
      displayMessage, showUserName, showEndModal, user,
      impersonatorName, confirmDelegation, isImpersenating,
      responseStatus, notificationCount, recentNotification, showNotification,
      showMessageModal, messageModal,
    } = this.state;
    const { t } = this.props;
    return (
      <>
        <Navbar expand="lg" className="justify-content-between">
          <Navbar.Brand href="/">
            <img
              src={logo}
              width="153"
              className="d-inline-block align-top"
              alt="ESP logo"
            />
          </Navbar.Brand>
          <Navbar id="basic-navbar-nav" className="p-0">
            <div className="SearchBox">
              <InputGroup>
                <FormControl
                  placeholder="Search"
                />
                <InputGroup.Text id="basic-addon2">
                  {' '}
                  <img className="searchIcon" src={searchIcon} alt="Search Icon" />
                  {' '}
                </InputGroup.Text>
              </InputGroup>
            </div>

            {showUserName && (
              <div className="impName" onClick={() => this.setState({ confirmDelegation: true })}>
                <img src={Cancel} alt="Cancel" />
                <p>
                  <strong className="delegataName">Delegate As:- :-</strong>
                  <b>{impersonatorName}</b>
                </p>
              </div>
            )}
            {confirmDelegation && (
              <Modal
                show={confirmDelegation}
                onHide={() => this.setState({ confirmDelegation: false })}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton>
                  Are you sure , you want to stop Delegation
                </Modal.Header>
                <Modal.Footer>

                  <Button variant="secondary" onClick={() => this.setState({ confirmDelegation: false })}>
                    No
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      this.endImpersonation();
                      this.setState({ confirmDelegation: false, isImpersenating: false });
                    }}
                  >
                    Yes
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
            <Row>
              <Col sm="6" className="d-none d-md-block">
                <Nav>
                  <div className="language-select">
                    <LanguageSelect />
                  </div>
                  <Button
                    disabled={showUserName}
                    onClick={this.handleClick}
                    className="clockIn mt-2"
                  >
                    {
                      isClockIn ? t('HeaderPage.clockOutBTn') : t('HeaderPage.clockInBTn')}
                  </Button>
                </Nav>
              </Col>
              <Col sm="6">
                <Nav>
                  <div className="nav-link notification__header">
                    <Button variant="link" className="w-auto p-0" onClick={() => this.setState({ showNotification: !showNotification })}>
                      <img
                        src={notification}
                        className="d-inline-block align-top"
                        alt="Notification"
                      />
                      <span className="notification__count">{notificationCount}</span>
                    </Button>
                    {
                      showNotification && (
                        <>
                          <div className="fakeNotification" onClick={() => this.setState({ showNotification: !showNotification })} />
                          <div className="notification__pannel">
                            <ul className="p-0">
                              {recentNotification.length === 0 ? <li><p>No new notification pending</p></li> : ''}
                              {recentNotification ? recentNotification.map(recent => (
                                <li className={`notification__item ${!recent.isRead && 'notification__item--unread'}`}>
                                  <p>
                                    {recent.message}
                                    <br />
                                    <small>
                                      <img src={clockIcon} alt="Clock" />
                                      {' '}
                                      {recent.createdOnUtc ? commonService.localizedDateAndTime(recent.createdOnUtc) : ''}
                                    </small>
                                  </p>
                                </li>
                              )) : ''}
                            </ul>
                            <p className="text-center m-0">
                              <Link to="/notification" title="Notifications" onClick={() => this.setState({ showNotification: !showNotification })}>
                                See All
                              </Link>
                            </p>
                          </div>
                        </>
                      )
                    }
                  </div>
                  <Link to="/settings" title="Settings" className="nav-link">
                    <img
                      src={setting}
                      className="d-inline-block align-top"
                      alt="Settings"
                    />
                  </Link>
                  <Dropdown>
                    <Dropdown.Toggle variant="" className="nav-link">
                      <img
                        src={profile}
                        className="d-inline-block align-top"
                        alt="Profile"
                      />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Link to="/profile" className="dropdown-item">My Profile</Link>
                      <Link to="/logout" className="dropdown-item">Logout</Link>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav>
              </Col>
            </Row>


          </Navbar>
        </Navbar>
        <Container className="d-xl-none d-lg-none d-md-none d-block mobileheader">

          <Row className="mb-2">
            <Col xs="6">
              <div className="language-select">
                <LanguageSelect />
              </div>
            </Col>
            <Col xs="6">
              <Button
                onClick={this.handleClick}
                className="clockInMob mt-2"
              >
                {
                  isClockIn ? t('HeaderPage.clockOutBTn') : t('HeaderPage.clockInBTn')}
              </Button>
            </Col>
          </Row>

        </Container>
        {
          showModel && (
            <Modal
              show={showModel}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Body>
                {errorMessage}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={this.doClockInOutsideGeolocation}>Confirm</Button>
              </Modal.Footer>
            </Modal>
          )
        }
        {showEndModal && (
          <Modal
            show={showEndModal}
            onHide={() => this.setState({ showEndModal: false })}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              Delegation ended successfully
            </Modal.Header>
            <Modal.Footer>
              <Link to="/">
                <Button variant="secondary" onClick={() => { this.setState({ showEndModal: false }); window.location.replace('/'); }}>
                  OK
                </Button>
              </Link>
            </Modal.Footer>
          </Modal>
        )}
        {
          displayMessage && (
            <Modal
              show={displayMessage}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Body>
                {responseMessage}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  OK
                </Button>
              </Modal.Footer>
            </Modal>
          )
        }

        {showMessageModal && (
          <Modal
            show={showMessageModal}
            onHide={() => this.setState({ showMessageModal: false })}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              {messageModal}
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => { this.setState({ showMessageModal: false }); }}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  }
}
const Head = withRouter(Header);
export default withTranslation()(Head);
