import React, {
  Component, useContext, useEffect, useState,
} from 'react';
import {
  Button, Tooltip, Modal,
  Accordion, Card, AccordionContext,
}
  from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import PaginationAndPageNumber from '../../shared/Pagination';
import Api from '../../common/Api';
import { userService } from '../../../services';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { commonService } from '../../../services/common.service';
import clockIcon from '../../../Images/Icons/clock.svg';
import arrow from '../../../Images/Icons/next_click.svg';
import './style.scss';

function CustomAccordionToggle({ children, eventKey, callback }) {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <Card.Header
      type="button"
      className={isCurrentEventKey && 'active'}
      onClick={decoratedOnClick}
    >
      {children}
      {' '}
      <img src={arrow} alt="Arrow" />
    </Card.Header>
  );
}

function NotificationList({
  category, userId, token, oldCollapseId, history,
}) {
  const [notifications, setNotification] = useState([]);
  const [loaded, setLoader] = useState(false);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageIndex: 1,
    pageSize: 10,
  });

  const getData = () => {
    setLoader(false);
    fetch(`${Api.notification.getNotificationWithCategory}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: userService.getToken(),
      }),
      body: JSON.stringify({
        languageId: 1,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        userId,
        notificationCategoryId: category.categoryId,
        // unreadNotificationOnly: true,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          setLoader(true);
          setNotification(response.data);
          setPagination(prevState => ({
            ...prevState,
            totalRecords: response.totalRecords,
            pageIndex: response.pageIndex,
            pageSize: response.pageSize,
          }));
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            getData();
          });
        } else {
          setLoader(true);
        }
      });
  };

  const readByIds = () => {
    setLoader(false);
    const ids = notifications.map(x => x.id);
    // notifications.map(x => x.id);
    fetch(`${Api.notification.readByIds}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: userService.getToken(),
      }),
      body: JSON.stringify({
        languageId: 1,
        offset: '',
        isActive: true,
        userId,
        ids: ids.join(','),
        categoryId: category.categoryId,
      }),
    }).then(response => response.json())
      .then((response) => {
        console.warn(response);
        history.push({
          pathname: '/notification',
          search: `?updated=${Math.random()}`,
        });
        if (response.statusCode === 200) {
          setLoader(true);
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            readByIds();
          });
        } else {
          setLoader(true);
        }
      });
  };

  useEffect(() => () => {
    readByIds();
  }, []);


  const readAll = () => {
    setLoader(false);
    fetch(`${Api.notification.readByCategory}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: userService.getToken(),
      }),
      body: JSON.stringify({
        languageId: 1,
        offset: '',
        isActive: true,
        userId,
        categoryId: category.categoryId,
      }),
    }).then(response => response.json())
      .then((response) => {
        console.warn(response);
        history.push({
          pathname: '/notification',
          search: `?updated=${Math.random()}`,
        });
        if (response.statusCode === 200) {
          setLoader(true);
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            readAll();
          });
        } else {
          setLoader(true);
        }
      });
  };

  useEffect(() => {
    if (!loaded) {
      getData();
    }
  }, [loaded]);

  const updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      setPagination(prevState => ({
        ...prevState,
        pageIndex: pageNum,
      }));
      readByIds();
      setLoader(false);
    }
  };

  const updatePageCount = (pageCount) => {
    setPagination(prevState => ({
      ...prevState,
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
    }));
    readByIds();
    setLoader(false);
  };

  if (!loaded) {
    return (<LoadingSpinner />);
  }

  return (
    <>
      {
        notifications.length === 0 ? 'No record available.' : (
          <>
            <div className="text-right">
              <Button variant="primary" className="w-auto px-4 mb-3" onClick={() => readAll()}>Read all</Button>
            </div>
            <ul className="notification">
              {notifications.map(notification => (
                <li className={`notification__item ${!notification.isRead && 'notification__item--unread'}`}>
                  <p>
                    {notification.message}
                    <br />
                    <small>
                      <img src={clockIcon} alt="Clock" />
                      {' '}
                      {commonService.localizedDateAndTime(notification.createdOnUtc)}
                    </small>
                  </p>
                </li>
              ))}
            </ul>
          </>
        )
      }
      <div className="mt-3">
        <PaginationAndPageNumber
          totalPageCount={Math.ceil(pagination.totalRecords / pagination.pageSize)}
          totalElementCount={pagination.totalRecords}
          updatePageNum={updatePageNum}
          updatePageCount={updatePageCount}
          currentPageNum={pagination.pageIndex}
          recordPerPage={pagination.pageSize}
        />
      </div>
    </>
  );
}

class Notifications extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      token: `${token}`,
      userId,
      loading: false,
      showModel: false,
      responseMessage: '',
      notificationCategory: [],
      collapseId: null,
      oldCollapseId: null,
      setChangeAccordion: false,
    };
  }

  componentDidMount = () => {
    this.getNotificationCatData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { collapseId, setChangeAccordion } = this.state;
    if (prevState.collapseId !== collapseId && setChangeAccordion) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setCollapseId(prevState.collapseId, setChangeAccordion);
    }
  }

  setCollapseId = (id) => {
    this.setState({
      oldCollapseId: id,
      setChangeAccordion: false,
    });
  }

  getNotificationCatData = () => {
    const { token } = this.state;
    this.setState({ loading: true });
    fetch(`${Api.notification.getCategory}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: `${token}`,
      }),
      body: JSON.stringify({
        id: 0,
        languageId: 1,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            loading: false,
            notificationCategory: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({
              token: tokens,
            }, () => this.getNotificationCatData());
          });
        } else {
          this.setState({
            loading: false,
          });
        }
      });
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

  onChangeAccordion = (e) => {
    this.setState({
      collapseId: e,
      setChangeAccordion: true,
    });
  }

  render() {
    const {
      loading, showModel, responseMessage, userId, token,
      notificationCategory, collapseId, oldCollapseId,
    } = this.state;
    const { history } = this.props;
    return (
      <>
        <div>
          {loading ? (<LoadingSpinner />) : null}
        </div>
        <div className="container-fluid">
          <div className="card_layout">
            <h4>Notifications</h4>
            <Accordion defaultActiveKey="0" onSelect={this.onChangeAccordion}>
              {
                notificationCategory.map(category => (
                  <Card>
                    <CustomAccordionToggle as={Card.Header} variant="link" eventKey={category.categoryId}>
                      {category.name}
                    </CustomAccordionToggle>
                    <Accordion.Collapse eventKey={category.categoryId}>
                      <Card.Body>
                        {collapseId === category.categoryId ? (
                          <NotificationList history={history} category={category} oldCollapseId={oldCollapseId} userId={userId} token={token} />
                        ) : ''
                        }
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                ))
              }
            </Accordion>
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

export default Notifications;
