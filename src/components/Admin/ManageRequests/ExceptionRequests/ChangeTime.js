import React, { Component } from 'react';
import {
  Row, Table,
} from 'react-bootstrap';
import '../style.scss';
import moment from 'moment';
import PaginationAndPageNumber from '../../../shared/Pagination';
import RemoveIcon from '../../../../Images/Icons/remove.svg';
import CheckedIcon from '../../../../Images/Icons/checked.svg';
import Api from '../../../common/Api';
import { userService } from '../../../../services';
import Loaders from '../../../shared/Loaders';

const tableHeader = [
  {
    label: 'Sr.No',
  },
  {
    label: 'Shift Id',
  },
  {
    label: 'Shift Label',
  },
  {
    label: 'Original Start Time',
  },
  {
    label: 'Original End Time',
  },
  {
    label: 'Line Manager',
  },
  {
    label: 'Requested Start Time',
  },
  {
    label: 'Requested End Time',
  },
  {
    label: 'Requested By',
  },
  {
    label: 'Actions',
  },
];

class ChangeTime extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      token: `${token}`,
      userId: `${userId}`,
      pageSize: 10,
      pageIndex: 1,
      totalRecords: 10,
      loaded: false,
      changeTimeData: [],
    };
  }

  componentDidMount() {
    this.getChangeTimeList();
  }

  getChangeTimeList = () => {
    const {
      pageSize, pageIndex, token, userId,
    } = this.state;

    const data = {
      languageId: 1,
      pageIndex: Number(pageIndex),
      pageSize: Number(pageSize),
      userId: Number(userId),
    };
     
    fetch(`${Api.shift.getMngShifApprovalListing}`, {
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
            changeTimeData: (response.data === null) ? [] : [].concat(response.data),
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getChangeTimeList());
          });
        } else {
          alert(response.message);
        }
      });
  }

  changeTimeData = (id, shiftRecurrenceId, checkClick) => {
    const {
      token, userId,
    } = this.state;

    const data = {
      languageId: 1,
      id: Number(id),
      userId: Number(userId),
      shiftRecurrenceId: Number(shiftRecurrenceId),
      statusId: checkClick ? 30 : 20,
    };
     
    fetch(`${Api.exceptionRequest.changeTime.changeTimeApprove}`, {
      method: 'POST',
      headers: {
        token: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          alert(response.message);
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.changeTimeData(id, shiftRecurrenceId, checkClick));
          });
        } else {
          alert(response.message);
        }
      });
  }

  render() {
    const {
      changeTimeData, totalRecords, pageIndex, pageSize, loaded,
    } = this.state;
    let counter = 1;
    return (
      <div className="container-fluid overTime">
        <div className="card_layout">
          <Row className="mt-3">
            <Table responsive striped bordered>
              <thead>
                <tr>
                  {tableHeader.map(headerData => (
                    <th>{headerData.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {
                  loaded ? (
                    <>
                      {changeTimeData.map(data => (
                        <tr>
                          <td>
                            {counter++}
                          </td>
                          <td>
                            {data.shiftId}
                          </td>
                          <td>
                            {data.shiftLabel}
                          </td>
                          <td>
                            {moment(data.originalStartTime).format('MM/DD/YYYY')}
                          </td>
                          <td>
                            {moment(data.originalEndTime).format('MM/DD/YYYY')}
                          </td>
                          <td>
                            {data.lineManager}
                          </td>
                          <td>
                            {moment(data.requestedStartTime).format('hh:mm')}
                          </td>
                          <td>
                            {moment(data.requestedEndTime).format('hh:mm')}
                          </td>
                          <td>
                            {data.requestedBy}
                          </td>
                          <td>
                            <div>
                              <span>
                                <img
                                  src={CheckedIcon}
                                  alt="Checked Icon"
                                  onClick={() => this.changeTimeData(data.id, data.shiftRecurrenceId, true)}
                                />
                              </span>
                              <span className="ml-1">
                                <img
                                  src={RemoveIcon}
                                  alt="Remove Icon"
                                  onClick={() => this.changeTimeData(data.id, data.shiftRecurrenceId, false)}
                                />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <Loaders />
                  )
                }
              </tbody>
            </Table>
            <div className="mt-3">
              <PaginationAndPageNumber
                totalPageCount={Math.ceil(totalRecords / pageSize)}
                totalElementCount={totalRecords}
                updatePageNum={this.updatePageNum}
                updatePageCount={this.updatePageCount}
                currentPageNum={pageIndex}
                recordPerPage={pageSize}
              />
            </div>
          </Row>
        </div>
      </div>
    );
  }
}

export default ChangeTime;
