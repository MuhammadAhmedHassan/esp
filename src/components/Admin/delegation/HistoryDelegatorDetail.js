import React from 'react';
import {
  Card, Table,  
} from 'react-bootstrap';
import './delegation.scss';
import api from '../../common/Api';
import { userService } from '../../../services';
import PaginationAndPageNumber from '../../shared/Pagination/index';
import moment from 'moment';
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


class HistoryDelegatorDetail extends React.Component {

  constructor(props) {
    super(props);
    const user = userService.getUser();
    const { match } = this.props;
    const token = userService.getToken();
    console.log(match);
    this.state = {
      token: `${token}`,
      user,
      languageId: 1,
      impersonatorId: match.params && match.params.id,
      historyDelegators: [],
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
      error: false,
      loaded: false,
    }
  }

  componentDidMount() {
    this.getFormData();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getFormData();
    }
  }

  getFormData = async () => {
    await this.getHistoryDetails();
  }

  getHistoryDetails = () => {
    const {
      languageId, user, impersonatorId, pageIndex, pageSize, token,
    } = this.state;

    const data = {
      languageId,
      offset: '',
      role: '',
      isActive: true,
      roleIds: '',
      publicKey: '',
      pageIndex: pageIndex,
      pageSize: pageSize,
      userId: user.userId,
      impersonatorId: parseInt(impersonatorId, 10),
      impersonateeId: user.userId,
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
            historyDelegators: response.data,
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getHistoryDetails());
          });
        } else {
          this.setState({
            loaded: true,
            historyDelegators: [],
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
      historyDelegators, pageSize, pageIndex, totalRecords, loaded,
      error,
    } = this.state;

    let count = ((pageIndex - 1) * pageSize) + 1;

    return (
      <div className="container-fluid delegation">

        <Card>

          <Card.Body>
            {loaded ? (<Table striped hover responsive>
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
                {historyDelegators && historyDelegators.map(data => (
                  <tr key={data.impersonatorId}>
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
                  </tr>)
                )}
              </tbody>
            </Table>) : <Loaders />
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

export default HistoryDelegatorDetail;
