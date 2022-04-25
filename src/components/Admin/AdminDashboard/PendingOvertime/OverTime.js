import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Row, Col, Table,
} from 'react-bootstrap';
import './style.scss';
import moment from 'moment';
import PaginationAndPageNumber from '../../../shared/Pagination';
import Api from '../../../common/Api';
import { userService } from '../../../../services';
import Loaders from '../../../shared/Loaders';

const tableHeader = [  
  {
    label: 'Employee Name',
  },
  {
    label: 'Applied On',
  },
  {
    label: 'Shift Date',
  },
  {
    label: 'Shift Label',
  },
  {
    label: 'Reason',
  },
  {
    label: 'Hours',
  },
  {
    label: 'Over Due',
  },
];

class ViewOverTime extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const date = new Date();
    const userId = props.location && props.location.state ? props.location.state.id : 0;
    this.state = {
      loaded: false,
      token: `${token}`,
      userId: `${userId}`,
      allOverTimeExceptions: [],
      pageSize: 10,
      pageIndex: 1,
      totalRecords: 10,
      startDate: new Date(date.getFullYear(), date.getMonth(), 1),
      endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      statusId: 10,    
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
  }

  componentDidMount() {
    this.getOvertimeEmployeeRequests();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getOvertimeEmployeeRequests();
    }
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
      pageSize: pageCount,
      pageIndex: 1,
      loaded: false,
    });
  }

  getOvertimeEmployeeRequests = () => {
    const {
      pageSize, pageIndex, token, statusId, userId, startDate, endDate,
    } = this.state;
    const data = {
      languageId: 1,
      pageIndex: Number(pageIndex),
      pageSize: Number(pageSize),
      statusId: Number(statusId),
      userId: Number(userId),
      requestTypeId: 1,
      startDateTime: startDate,
      endDateTime: endDate,
    };
     
    fetch(`${Api.exceptionRequest.overTimeEmployee.getOverTimeRequest}`, {
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
            allOverTimeExceptions: (response.data === null) ? [] : [].concat(response.data),
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getOvertimeEmployeeRequests());
          });
        }
      });
  }

  handleFromDateChange(date) {
    this.setState({
      startDate: date,
    },
    () => this.getOvertimeEmployeeRequests());
  }

  handleToDateChange(date) {
    this.setState({
      endDate: date,
    },
    () => this.getOvertimeEmployeeRequests());
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, type, checked } = target;
    const value = type === 'checkbox' ? checked : target.value;
    this.setState({
      [name]: value,
    }, () => {
      if (name === 'statusId') {
        this.getOvertimeEmployeeRequests();
      }
    });
  }

  render() {
    const {
      allOverTimeExceptions, pageIndex, pageSize, totalRecords, startDate, endDate, loaded,
    } = this.state;

    let counter = ((pageIndex - 1) * pageSize) + 1;
    return (
      <div className="container-fluid overTime">
        <div className="card_layout">
          <Row md={12} className="">            
            <Col md={3} className="d-flex">
              <label className="overtimeLabel" htmlFor="startDate">
                From
              </label>
              <DatePicker
                name="startDate"
                selected={startDate}
                onChange={this.handleFromDateChange}
                placeholderText="MM/DD/YYYY"
                dateFormat="MM/dd/yyyy"
                className="form-control cal_icon"
                pattern="\d{2}\/\d{2}/\d{4}"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                required
              />

            </Col>
            <Col md={3} className="d-flex">
              <label className="overtimeLabel" htmlFor="endDate">
                To
              </label>
              <DatePicker
                name="endDate"
                selected={endDate}
                onChange={this.handleToDateChange}
                placeholderText="MM/DD/YYYY"
                dateFormat="MM/dd/yyyy"
                className="form-control cal_icon"
                pattern="\d{2}\/\d{2}/\d{4}"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                required
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <Table responsive striped bordered>
                <thead>
                  <tr>
                    {tableHeader.map(headerData => (
                      <th>{headerData.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>

                  {loaded ? (
                    <>
                      {allOverTimeExceptions.map(tableTimeData => (
                        <tr>                         
                          <td>
                            {tableTimeData.userName}
                          </td>
                          <td>
                            {moment(tableTimeData.shiftStartDate).format('MM/DD/YYYY')}
                          </td>
                          <td>
                            {moment(tableTimeData.shiftStartDate).format('MM/DD/YYYY')}
                          </td>
                          <td>
                            {tableTimeData.shiftTitle}
                          </td>
                          <td>
                            {tableTimeData.userNotes}
                          </td>
                          <td>
                            {(tableTimeData.overTimeInMinutes / 60)}
                          </td>    
                          <td>
                            {tableTimeData.overDueApprovalDetails}
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
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ViewOverTime;
