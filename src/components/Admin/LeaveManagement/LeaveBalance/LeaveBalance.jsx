/* eslint-disable react/no-unused-state */
/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Row, Col, Button, Modal, Form, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import CardLeaveBalance from './CardLeaveBalance';
import ProgressBar from './progressbar';
import Api from '../../../common/Api';
import { userService } from '../../../../services';
import DownloadIcon from '../../../../Images/Icons/downloadIcon.svg';
import { commonService } from '../../../../services/common.service';


class LeaveBalance extends React.Component {
  constructor(props) {
    super(props);
    const userId = userService.getUserId();
    const token = userService.getToken();
    const fromDate = new Date().setUTCFullYear(new Date().getFullYear() - 1);
    this.state = {
      token: `${token}`,
      userId,
      leaveBalance: [],
      currentYear: new Date().getFullYear(),
      yearName: '2021',
      bgcolor: '#00C2F0',
      languageId: 1,
      data: [],
      showModal: false,
      fromDate: new Date(fromDate),
      toDate: new Date(),
      leaveTypeList: [],
      transactionList: [],
      sortByList: [],
      leaveType: 0,
      transactionType: 0,
      sortBy: 0,
      toError: '',
    };
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
  }

  componentDidMount() {
    this.getLeaveBalance();
    this.getAllyears();
    this.getLeaveType();
    this.getTransactionType();
    this.sortingType();
  }

  renderTooltip = (props, id) => (
    <Tooltip id={id} {...props}>
      {props}
    </Tooltip>
  );


  openModal = () => {
    const {
      showModal,
    } = this.state;
    this.setState({
      showModal: !showModal,
    });
  }

  closeModal = () => {
    const fromDate = new Date().setUTCFullYear(new Date().getFullYear() - 1);
    this.setState({
      showModal: false,
      fromDate: new Date(fromDate),
      toError: '',
      toDate: new Date(),
      sortBy: 0,
      transactionType: 0,
      leaveType: 0,
    });
  }

  getLeaveType = () => {
    const {
      token,
    } = this.state;

    const data = {
      languageId: 1,
    };

    fetch(`${Api.vacationManagement.getParentLeaveType}`, {
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
            leaveTypeList: (response.data === null) ? [] : [].concat(response.data),
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getLeaveType());
          });
        } else {
          alert(response.message);
        }
      });
  }

  getTransactionType = () => {
    const {
      token,
    } = this.state;

    const data = {
      languageId: 1,
    };

    fetch(`${Api.vacationManagement.getTransactionType}`, {
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
            transactionList: (response.data === null) ? [] : [].concat(response.data),
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getTransactionType());
          });
        } else {
          alert(response.message);
        }
      });
  }

  sortingType = () => {
    const {
      token,
    } = this.state;

    const data = {
      languageId: 1,
    };

    fetch(`${Api.vacationManagement.getSortingType}`, {
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
            sortByList: (response.data === null) ? [] : [].concat(response.data),
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.sortingType());
          });
        } else {
          alert(response.message);
        }
      });
  }

  handleDownload = (extension) => {
    const {
      token, fromDate, toDate, userId, leaveType, transactionType, sortBy,
      toError,
    } = this.state;
    if (toError !== '') {
      return;
    }
    const data = {
      languageId: 1,
      userId: parseInt(userId, 10),
      fromDateTimeUtc: fromDate,
      toDateTimeUtc: toDate,
      leaveType: parseInt(leaveType, 10),
      transactionType: parseInt(transactionType, 10),
      sortBy: parseInt(sortBy, 10),
      pageIndex: 1,
    };

    const apiUrl = extension ? `${Api.vacationManagement.downloadPDF}` : `${Api.vacationManagement.downloadExcel}`;
    const fileName = extension ? 'LeaveBalance.pdf' : 'LeaveBalance.csv';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        token: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => response.blob())
      .then((blob) => {
        if (blob.type === undefined || blob.type === 'application/json') {
          alert('Please try again getting some error.');
        } else {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getAllyears = () => {
    const { token, userId } = this.state;
    fetch(`${Api.vacationManagement.getAllyears}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        userId,
        Id: userId,
        languageId: 1,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({ data: response.data });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAllyears());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  getLeaveBalance = () => {
    const { token, userId, yearName } = this.state;

    fetch(`${Api.vacationManagement.getLeaveBalance}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        userId: parseInt(userId, 10),
        year: parseInt(yearName, 10),
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            leaveBalance: response.data.userLeaveTypesBalanceListing,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getLeaveBalance());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  handleYearDropDown(event) {
    const { target } = event;
    const { name, year, checked } = target;
    const value = year === 'checked' ? checked : target.value;
    this.setState(
      {
        [name]: value,
      },
      () => this.getLeaveBalance(),
    );
  }

  handleFromDateChange(date) {
    this.setState({
      fromDate: date,
    });
  }

  handleToDateChange(date) {
    const { fromDate } = this.state;
    if (date < fromDate) {
      this.setState({ toError: 'To Date can not be less than From Date' });
    } else {
      this.setState({
        toDate: date,
        toError: '',
      });
    }
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, type, checked } = target;
    const value = type === 'checkbox' ? checked : target.value;
    this.setState({
      [name]: value,
    });
  }

  render() {
    const {
      leaveBalance, currentYear, bgcolor, data, showModal, leaveTypeList, toError,
      transactionList, sortByList, fromDate, toDate, sortBy, transactionType, leaveType,
    } = this.state;
    const { t } = this.props;
    return (
      <>
        <Row>
          <Col>
            <Row>
              <Col lg="6">
                <h2>{t('VacationBalancePage.LeaveBalance')}</h2>
              </Col>
              <Col lg="6" className="text-right mb-3">
                <select
                  className="form-control leaveBalanceDrop"
                  name="yearName"
                  defaultValue={currentYear.toString()}
                  onChange={event => this.handleYearDropDown(event)}
                >
                  {data.map(years => (
                    <option
                      key={years.id}
                      selected={years.year === currentYear.toString()}
                      value={years.year}
                    >
                      {years.year}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => this.openModal()}
                  className="btn w-auto"
                >
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 50, hide: 40 }}
                    overlay={this.renderTooltip('Downlooad', 'downlooadTooltip')}
                  >
                    <img src={DownloadIcon} alt="download" />
                  </OverlayTrigger>

                </button>
                <Link
                  className="btn btn-primary"
                  to="my-vacation/apply-vacation"
                >
                  {t('VacationBalancePage.ApplyNow')}
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          {leaveBalance.map(leaveBalanceData => (
            <Col md={6} xl={4}>
              <div className="balancecard">
                <CardLeaveBalance
                  cardTitle={leaveBalanceData.name}
                  grantTitle={`Granted: ${leaveBalanceData.totalGrantedleaves}`}
                  daysleft={leaveBalanceData.availableBalance}
                  c_link={`/vacation-management/vacation-balance/vacation-details/${leaveBalanceData.id}`}
                  key="{leaveBalanceData.id}"
                />
                <div className="progressBar">
                  <span>
                    {`${leaveBalanceData.leavesConsumed} of ${leaveBalanceData.totalGrantedleaves} Consumed`}
                  </span>
                  <ProgressBar
                    bgcolor={bgcolor}
                    completed={Math.round(
                      (leaveBalanceData.leavesConsumed
                        / leaveBalanceData.totalGrantedleaves)
                      * 100,
                    )}
                  />
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {
          showModal && (
            <Modal
              show={showModal}
              onHide={this.closeModal}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                {t('DownloadLeaveTransaction')}
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>
                        {t('ApplyPage.FromDate')}
                      </Form.Label>
                      <DatePicker
                        name="fromDate"
                        selected={fromDate}
                        onChange={this.handleFromDateChange}
                        placeholderText={commonService.localizedDateFormat()}
                        dateFormat={commonService.localizedDateFormatForPicker()}
                        className="form-control cal_icon"
                        pattern="\d{2}\/\d{2}/\d{4}"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        {t('ApplyPage.ToDate')}
                      </Form.Label>
                      <DatePicker
                        name="toDate"
                        selected={toDate}
                        onChange={this.handleToDateChange}
                        placeholderText={commonService.localizedDateFormat()}
                        dateFormat={commonService.localizedDateFormatForPicker()}
                        className="form-control cal_icon"
                        pattern="\d{2}\/\d{2}/\d{4}"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                      <span className="mandatory">{toError}</span>
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>
                        {t('ApplyPage.Leave_type')}
                      </Form.Label>
                      <Form.Control as="select" name="leaveType" value={leaveType} onChange={event => this.handleInputChange(event)}>
                        <option value={0}>All</option>
                        {
                          leaveTypeList.map(x => <option value={x.id}>{x.name}</option>)
                        }
                      </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>
                        {t('Transaction')}
                      </Form.Label>
                      <Form.Control as="select" name="transactionType" value={transactionType} onChange={event => this.handleInputChange(event)}>
                        <option value={0}>All</option>
                        {
                          transactionList.map(x => <option value={x.id}>{x.type}</option>)
                        }
                      </Form.Control>
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>
                        {t('Sort')}
                      </Form.Label>
                      <Form.Control as="select" name="sortBy" value={sortBy} onChange={event => this.handleInputChange(event)}>
                        <option value={0}>All</option>
                        {
                          sortByList.map(x => <option value={x.id}>{x.sort}</option>)
                        }
                      </Form.Control>
                    </Form.Group>
                  </Row>
                </Form>
              </Modal.Body>
              <Modal.Footer className="justify-content-center">
                <Row>
                  <Col md={12} className="text-center">
                    <Button variant="primary" onClick={() => this.handleDownload(true)} className="mt-2">
                      {t('DownloadPDF')}
                    </Button>
                    <Button variant="primary" onClick={() => this.handleDownload(false)} className="mt-2">
                      {t('DownloadExcel')}
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="text-center">
                    <Button variant="secondary" onClick={this.closeModal}>
                      {t('CancelBtn')}
                    </Button>
                  </Col>
                </Row>
              </Modal.Footer>
            </Modal>
          )
        }
      </>
    );
  }
}

export default withTranslation()(LeaveBalance);
