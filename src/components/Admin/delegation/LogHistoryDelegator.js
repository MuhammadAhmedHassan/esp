import React from 'react';
import {
  Card, Table,
} from 'react-bootstrap';
import './delegation.scss';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import moment from 'moment';
import api from '../../common/Api';
import { userService } from '../../../services';
import PaginationAndPageNumber from '../../shared/Pagination/index';
import Loaders from '../../shared/Loaders';
import { commonService } from '../../../services/common.service';

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
    label: 'Activity',
  },
  {
    label: 'Date',
  },
  {
    label: 'Time',
  },
];


class LogHistoryDelegator extends React.Component {
  constructor(props) {
    super(props);
    const user = userService.getUser();
    const token = userService.getToken();
    this.state = {
      token: `${token}`,
      user,
      languageId: 1,
      myActivityLogHistory: [],
      otherActivityLogHistory: [],
      myActivityPageIndex: 1,
      myActivityPageSize: 10,
      myActivityTotalRecords: 0,
      otherActivityPageIndex: 1,
      otherActivityPageSize: 10,
      otherActivityTotalRecords: 0,
      key: 'myActivity',
      myActivityError: false,
      myActivityLoaded: false,
      otherActivityError: false,
      otherActivityLoaded: false,

    };
  }

  componentDidMount() {
    this.getFormData();
  }

  componentDidUpdate() {
    const { myActivityLoaded, otherActivityLoaded } = this.state;
    if (!myActivityLoaded) {
      this.getMyActvityLogDelegatorHistory();
    }
    if (!otherActivityLoaded) {
      this.getOtherActvityLogDelegatorHistory();
    }
  }

    getFormData = async () => {
      await this.getMyActvityLogDelegatorHistory();
      await this.getOtherActvityLogDelegatorHistory();
    }

    getMyActvityLogDelegatorHistory = () => {
      const {
        languageId, user, myActivityPageIndex, myActivityPageSize, token,
      } = this.state;

      const data = {
        languageId,
        offset: '',
        role: '',
        isActive: true,
        roleIds: '',
        publicKey: '',
        pageIndex: myActivityPageIndex,
        pageSize: myActivityPageSize,
        userId: user.userId,
        requestTypeId: 1,
      };
      fetch(`${api.delegation.searchImpersonationHistoryLog}`, {
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
              myActivityLoaded: true,
              myActivityError: false,
              myActivityLogHistory: response.data,
              myActivityPageIndex: response.pageIndex || 1,
              myActivityPageSize: response.pageSize,
              myActivityTotalRecords: response.totalRecords,
            });
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.getMyActvityLogDelegatorHistory());
            });
          } else {
            this.setState({
              myActivityLoaded: true,
              myActivityLogHistory: [],
              myActivityError: true,
            });
          }
        })
        .catch(err => console.error(err.toString()));
    }


    getOtherActvityLogDelegatorHistory = () => {
      const {
        languageId, user, otherActivityPageIndex, otherActivityPageSize, token,
      } = this.state;

      const data = {
        languageId,
        offset: '',
        role: '',
        isActive: true,
        roleIds: '',
        publicKey: '',
        pageIndex: otherActivityPageIndex,
        pageSize: otherActivityPageSize,
        userId: user.userId,
        requestTypeId: 2,
      };
      fetch(`${api.delegation.searchImpersonationHistoryLog}`, {
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
              otherActivityLoaded: true,
              otherActivityError: false,
              otherActivityLogHistory: response.data,
              otherActivityPageIndex: response.pageIndex || 1,
              otherActivityPageSize: response.pageSize,
              otherActivityTotalRecords: response.totalRecords,
            });
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.getOtherActvityLogDelegatorHistory());
            });
          } else {
            this.setState({
              otherActivityLoaded: true,
              otherActivityLogHistory: [],
              otherActivityError: true,
            });
          }
        })
        .catch(err => console.error(err.toString()));
    }

    updateMyActivityPageNum = (pageNum) => {
      if (pageNum > 0) {
        this.setState({
          myActivityPageIndex: pageNum,
          myActivityLoaded: false,
        });
      }
    }

    updateMyActivityPageCount = (pageCount) => {
      this.setState({
        myActivityPageSize: parseInt(pageCount, 10),
        myActivityPageIndex: 1,
        myActivityLoaded: false,
      });
    }

    updateOtherActivityPageNum = (pageNum) => {
      if (pageNum > 0) {
        this.setState({
          otherActivityPageIndex: pageNum,
          otherActivityLoaded: false,
        });
      }
    }

    updateOtherActivityPageCount = (pageCount) => {
      this.setState({
        otherActivityPageSize: parseInt(pageCount, 10),
        otherActivityPageIndex: 1,
        otherActivityLoaded: false,
      });
    }

    handleTabSelect = (selTab) => {
      this.setState({ key: selTab });
    }


    render() {
      const {
        key, myActivityLogHistory, myActivityPageIndex, myActivityPageSize, myActivityTotalRecords,
        otherActivityLogHistory, otherActivityPageIndex, otherActivityPageSize, otherActivityTotalRecords,
        myActivityError, myActivityLoaded, otherActivityError, otherActivityLoaded,
      } = this.state;
      let myActivityCount = ((myActivityPageIndex - 1) * myActivityPageSize) + 1;

      let otherActivityCount = ((otherActivityPageIndex - 1) * otherActivityPageSize) + 1;

      return (
        <div className="container-fluid delegation">

          {/* /filter section  */}
          <Tabs id="controlled-tab" activeKey={key} onSelect={event => this.handleTabSelect(event)}>
            <Tab eventKey="myActivity" title="My Activity" tabClassName="select-tab">


              <Card>
                <Card.Body>
                  {myActivityLoaded ? (
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
                        {myActivityError
                                                && (
                                                <tr>
                                                  <td colSpan="10" className="text-center">No Data Found</td>
                                                </tr>
                                                )}
                        {myActivityLogHistory && myActivityLogHistory.map(data => (
                          <tr key={data.id}>
                            <td>{myActivityCount++}</td>
                            <td>{data.impersonateeName}</td>
                            <td>
                              {data.impersonateeDesignation}
                            </td>
                            <td>
                              {data.activity}
                            </td>
                            <td>
                              {data.activityDoneOnUtc ? commonService.localizedDate(data.activityDoneOnUtc) : ''}
                            </td>
                            <td>
                              {data.activityDoneOnUtc ? commonService.localizedDate(data.activityDoneOnUtc) : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : <Loaders />
                                }

                  <PaginationAndPageNumber
                    totalPageCount={Math.ceil(myActivityTotalRecords / myActivityPageSize)}
                    totalElementCount={myActivityTotalRecords}
                    updatePageNum={this.updateMyActivityPageNum}
                    updatePageCount={this.updateMyActivityPageCount}
                    currentPageNum={myActivityPageIndex}
                    recordPerPage={myActivityPageSize}
                  />

                  {/* /Delegation Table */}
                </Card.Body>
              </Card>
            </Tab>
            <Tab
              eventKey="otherActivity"
              title="Other Activity"
              tabClassName="select-tab"
            >
              <Card>
                <Card.Body>
                  {otherActivityLoaded ? (
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
                        {otherActivityError
                                                && (
                                                <tr>
                                                  <td colSpan="10" className="text-center">No Data Found</td>
                                                </tr>
                                                )}
                        {otherActivityLogHistory && otherActivityLogHistory.map(data => (
                          <tr key={data.id}>
                            <td>{otherActivityCount++}</td>
                            <td>{data.impersonatorName}</td>
                            <td>
                              {data.impersonatorDesignation}
                            </td>
                            <td>
                              {data.activity}
                            </td>
                            <td>
                              {moment(data.activityDoneOnUtc).format('DD/MM/YYYY')}
                            </td>
                            <td>
                              {moment(data.activityDoneOnUtc).format('HH:mm A')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : <Loaders />
                                }

                  <PaginationAndPageNumber
                    totalPageCount={Math.ceil(otherActivityTotalRecords / otherActivityPageSize)}
                    totalElementCount={otherActivityTotalRecords}
                    updatePageNum={this.updateOtherActivityPageNum}
                    updatePageCount={this.updateOtherActivityPageCount}
                    currentPageNum={otherActivityPageIndex}
                    recordPerPage={otherActivityPageSize}
                  />

                  {/* /Delegation Table */}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </div>

      );
    }
}

export default LogHistoryDelegator;
