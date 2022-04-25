import React from 'react';
import {
  Card, Table,
} from 'react-bootstrap';
import './delegation.scss';
import moment from 'moment';
import api from '../../common/Api';
import { userService } from '../../../services';
import PaginationAndPageNumber from '../../shared/Pagination/index';
import Loaders from '../../shared/Loaders';

const tableHeader = [
  {
    label: 'S.No',
  },
  {
    label: 'Activity Performed',
  },
  {
    label: 'Date',
  },
  {
    label: 'Time',
  },
];

class RecentDelegatorDetail extends React.Component {
  constructor(props) {
    super(props);
    const user = userService.getUser();
    const { match } = this.props;
    const token = userService.getToken();
    this.state = {
      token: `${token}`,
      user,
      impersonateeId: match.params && match.params.id,
      languageId: 1,
      recentDelegatorList: [],
      pageType: match.params && match.params.pageType,
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
      loaded: false,
      error: false,
    };
  }

  componentDidMount() {
    this.getFormData();
  }


  getFormData = async () => {
    await this.getRecentDelegatorDetails();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getFormData();
    }
  }

  getRecentDelegatorDetails = () => {
    const {
      languageId, user, impersonateeId, pageIndex, pageSize, pageType, token,
    } = this.state;
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
      impersonatorId: Number(pageType) === 1 ? parseInt(impersonateeId, 10) : user.userId,
      impersonateeId: Number(pageType) === 1 ? user.userId : parseInt(impersonateeId, 10),
    };
   
    fetch(`${api.delegation.searchImpersonationHistorySameLevel}`, {
      method: 'POST',
      headers: {
        token: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),

    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200 && response.data.length > 0) {
          this.setState({
            loaded: true,
            error: false,
            recentDelegatorList: response.data,
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getRecentDelegatorDetails());
          });
        } else {
          this.setState({
            loaded: true,
            recentDelegatorList: [],
            error: true,
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

  render() {
    const {
      recentDelegatorList, pageIndex, pageSize, totalRecords, loaded, error,
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
                  {recentDelegatorList && recentDelegatorList.map(data => (
                    <tr key={data.impersonateeId}>
                      <td>{count++}</td>
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
      </div>

    );
  }
}

export default RecentDelegatorDetail;
