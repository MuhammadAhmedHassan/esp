import React from 'react';
import {
  Card, Table, Modal, Button, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import './delegation.scss';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import moment from 'moment';
import api from '../../common/Api';
import { userService } from '../../../services';
import PaginationAndPageNumber from '../../shared/Pagination/index';
import ViewDelegation from '../../../Images/Icons/view-delegation.svg';
import DelegationIcon from '../../../Images/Icons/delegation.svg';
import Loaders from '../../shared/Loaders';

const tableHeader = [
  {
    label: 'S.No',
  },
  {
    label: 'User Name',
  },
  {
    label: 'Designation',
  },
  {
    label: 'Start Date',
  },
  {
    label: 'End Date',
  },
  {
    label: 'Actions',
  },
];

const { impersonationSubject } = userService;
let impersentSubscriber;

class DelegateAs extends React.Component {
  constructor(props) {
    super(props);
    const user = userService.getUser();
    const impUser = userService.getImpUser();
    const token = userService.getToken();
    this.state = {
      token: `${token}`,
      user,
      impUser,
      languageId: 1,
      delegateAsList: [],
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
      loaded: false,
      error: false,
      showModal: false,
      impersonatorId: '',
      confirmDelegation: false,
      modalMessage: '',
      isImpersenating: false,
    };
  }


  componentDidMount() {
    impersentSubscriber = impersonationSubject.subscribe((val) => {
      this.setState({ isImpersenating: val.showName });
      this.getFormData();
    });
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getFormData();
    }
  }

  componentWillUnmount() {
    if (impersentSubscriber) {
      impersentSubscriber.unsubscribe();
    }
  }

  getFormData = async () => {
    await this.getDelegateAsList();
  }

  getDelegateAsList = () => {
    const {
      languageId, pageIndex, pageSize, impUser, isImpersenating, token,
    } = this.state;
    const user = userService.getUser();
    
    const data = {
      languageId,
      offset: '',
      role: '',
      isActive: true,
      roleIds: '',
      publicKey: '',
      pageIndex,
      pageSize,
      userId: user.userId,
      requestTypeId: 3,
    };
    fetch(`${api.delegation.search}`, {
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
            loaded: true,
            error: false,
            delegateAsList: response.data,
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getDelegateAsList());
          });
        } else {
          this.setState({
            loaded: true,
            delegateAsList: [],
            error: true,
          });
        }
      });
  }

  handleImpersonation = (impersonatorId, impersonateeId, email) => {
    document.cookie = `${'espImp' + '=; expires='}${new Date().toUTCString()};path=/`;
    if (impersonatorId !== impersonateeId) {
      const {
        languageId, user, token,
      } = this.state;

      this.setState({ loaded: true, impersonatorId });
      const data = {
        languageId,
        impersonatorId: parseInt(impersonatorId, 10),
        impersonateeId: parseInt(impersonateeId, 10),
      };
      fetch(`${api.delegation.startImpersonation}`, {
        method: 'POST',
        headers: {
          token: `${token}`,
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
            });
            const impUser = userService.getUser();
            const oldUser = userService.getUser();
            document.cookie = `espImp=${JSON.stringify(oldUser || {})};path=/`;
            impUser.accessToken = `${response.data.accessToken}`;
            impUser.refreshToken = `${response.data.refreshToken}`;
            impUser.expires = `${response.data.impersonationEndDate}`;
            impUser.role = response.data.role;
            impUser.impersonatorName = `${response.data.userName}`;
            impUser.userId = Number(response.data.userId);
            impUser.email = email;
            document.cookie = `espUser=${JSON.stringify(impUser || {})};expires=${response.data.impersonationEndDate ? new Date(response.data.impersonationEndDate) : new Date()};path=/`;
            impersonationSubject.next({ showName: true, name: impUser.impersonatorName });
            this.setState({ impUser, loaded: false });
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.handleImpersonation(impersonatorId, impersonateeId, email));
            });
          } else {
            this.setState({
              loaded: true,
              showModal: true,
              modalMessage: response.message,
            });
          }
        });
    } else {
      this.setState({
        showModal: true,
        modalMessage: 'Impersonatee and Impersonater Id is same',
        loaded: false,
      });
    }
  }

  handleClose = () => {
    this.setState({
      showModal: false,
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

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  render() {
    const {
      delegateAsList, loaded, pageSize, pageIndex, error, totalRecords,
      showModal, modalMessage, isImpersenating, confirmDelegation,
    } = this.state;
    let count = ((pageIndex - 1) * pageSize) + 1;

    return (
      <div className="container-fluid delegation">

        {/* /filter section  */}

        <Card>

          <Card.Body>
            {loaded ? (
              <Table striped hover responsive>
                <thead>
                  <tr>
                    {tableHeader.map(data => (
                      <th>
                        {data.label}
                      </th>
                      
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {error
                    && (
                      <tr>
                        <td colSpan="10" className="text-center">No Data Found</td>
                      </tr>
                    )}
                  {delegateAsList && delegateAsList.map(data => (
                    <tr key={count}>
                      <td>{count++}</td>

                      <td>{data.impersonateeName}</td>
                      <td>{data.impersonateeDesignation}</td>
                      <td>{moment(data.startDateTime).format('DD/MM/YYYY')}</td>
                      <td>{moment(data.endDateTime).format('DD/MM/YYYY')}</td>
                      <td>
                        <div className="d-flex">
                          <Link to={`/delegation/recent/${data.impersonateeId}/${0}`}>
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 50, hide: 40 }}
                              overlay={this.renderTooltip('View Log')}
                            >
                              <img className="mr-3 pointer" src={ViewDelegation} alt="View Delegation" />
                            </OverlayTrigger>
                          </Link>
                          { !isImpersenating && (
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 50, hide: 40 }}
                            overlay={this.renderTooltip('Delegation')}
                          >
                            <img className="pointer" alt="Impersonation" src={DelegationIcon} onClick={() => this.handleImpersonation(data.impersonatorId, data.impersonateeId, data.impersonateeEmail)} />
                          </OverlayTrigger>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : <Loaders />
            }
            <PaginationAndPageNumber
              totalPageCount={Math.ceil(totalRecords / pageSize)}
              totalElementCount={totalRecords}
              updatePageNum={this.updatePageNum}
              updatePageCount={this.updatePageCount}
              currentPageNum={pageIndex}
              recordPerPage={pageSize}
            />
            {/* /Delegation Table */}
          </Card.Body>
        </Card>
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
                <Button
                  variant="secondary"
                  onClick={() => {
                    this.handleClose();
                    window.location.replace('/');
                  }}
                >
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

    );
  }
}

export default withTranslation()(DelegateAs);
