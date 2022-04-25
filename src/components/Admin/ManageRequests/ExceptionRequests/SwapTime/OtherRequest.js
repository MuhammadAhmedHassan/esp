import {
  Table, Modal, Button, Col, Row, Form, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import './style.scss';
import { Link } from 'react-router-dom';
import removeIcon from '../../../../../Images/Icons/remove.svg';
import checkedIcon from '../../../../../Images/Icons/checked.svg';
import { userService } from '../../../../../services';
import PaginationAndPageNumber from '../../../../shared/Pagination/index';
import { commonService } from '../../../../../services/common.service';

import Api from '../../../../common/Api';


const constRequestRejectStatus = 20;

export class OtherRequests extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      token: `${token}`,
      userId,
      data: [],
      noData: false,
      showModel: false,
      showModelAccept: false,
      searchStatusId: 0,
      requestId: 0,
      newStatusId: constRequestRejectStatus,
      statusChangeNotes: '',
      successMessage: '',
      responseStatus: false,
      pageIndex: 1,
      totalRecords: 0,
      pageSize: 10,
      loaded: false,
      errorMessage: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getOtherSwapRequest();
    }
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getOtherSwapRequest();
    }
  }

  handleDropDown = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      }, () => this.getOtherSwapRequest(),
    );
  };

  doAcceptRequest = () => {
    const { userId, token, requestId } = this.state;
    fetch(`${Api.getSwapStatuschanges}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(requestId, 10),
        languageId: 1,
        newStatusId: 30,
        userId,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            successMessage: response.message,
            responseStatus: response.statusCode,
            loaded: false,
          }, this.handleClose());
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.doAcceptRequest());
          });
        } else {
          this.setState({
            successMessage: response.message,
            responseStatus: response.statusCode,
            loaded: false,
          }, this.handleClose());
        }
      })
      .catch(err => console.error(err.toString()));
  }


  doRejectRequest = () => {
    const { statusChangeNotes, newStatusId } = this.state;

    if ((statusChangeNotes == null || statusChangeNotes === '')
      && newStatusId === constRequestRejectStatus) {
      this.setState({
        requestError: 'Please enter the note/reason to reject the leave.',
      });
      return;
    }
    this.setState({
      requestError: '',
    });
    const { userId, token, requestId } = this.state;
    fetch(`${Api.getSwapStatuschanges}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(requestId, 10),
        languageId: 1,
        newStatusId,
        userId,
        statusChangeNotes,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            successMessage: response.message,
            responseStatus: response.statusCode,
            loaded: false,
          }, this.handleClose());
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.doRejectRequest());
          });
        } else {
          this.setState({
            successMessage: response.message,
            responseStatus: response.statusCode,
            loaded: false,
          }, this.handleClose());
        }
      })
      .catch(err => console.error(err.toString()));
  }

  handleRequestReject = (id) => {
    const { showModel } = this.state;
    this.setState({
      showModel: !showModel,
      requestId: id,
    });
  }

  handleRequestAccept = (id) => {
    const { showModelAccept } = this.state;
    this.setState({
      showModelAccept: !showModelAccept,
      requestId: id,
    });
  }

  renderTooltip = (props, id) => (
    <Tooltip id={id} {...props}>
      {props}
    </Tooltip>
  );

  handleClose = () => {
    this.setState({
      showModel: false,
      showModelAccept: false,
    });
  }

  getOtherSwapRequest = () => {
    const {
      userId, token, searchStatusId, pageIndex, pageSize,
    } = this.state;

    fetch(`${Api.getSwapRequest}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        languageId: 1,
        pageIndex,
        pageSize,
        id: userId,
        searchStatusId: parseInt(searchStatusId, 10),
        requestTypeId: 2,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            data: response.data,
            noData: !!((response.data === null || response.data.length === 0)),
            loaded: true,
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getOtherSwapRequest());
          });
        } else {
          this.setState({
            data: [],
            loaded: true,
            errorMessage: response.errors,
          });
        }
      })
      .catch(err => console.error(err.toString()));
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

  handleChange(event) {
    const { target } = event;
    const { name } = target;
    if (name === 'statusChangeNotes') {
      this.setState({ [name]: target.value });
    }
  }

  render() {
    const {
      data,
      noData,
      loaded,
      showModel,
      showModelAccept,
      statusChangeNotes,
      requestError, successMessage, responseStatus, pageSize,
      totalRecords, pageIndex, errorMessage,
    } = this.state;
    const { t } = this.props;
    let counter = 1;
    return (
      <>
        {
          loaded ? (

            <>
              {
                successMessage && (
                  <div className="row">
                    <div className="col-md-12">
                      <div className={`alert alert-${responseStatus === 200 ? 'success' : 'danger'}`} role="alert">
                        {successMessage}
                      </div>
                    </div>
                  </div>
                )
              }
              {errorMessage && (
                <div className="row">
                  <div className="col-md-12">
                    <div className={`alert alert-${responseStatus === 200 ? 'success' : 'danger'}`} role="alert">
                      {errorMessage}
                    </div>
                  </div>
                </div>
              )}
              <div className="container-fluid swap-time">
                <div className="card_layout">
                  <div className="row mx-0">
                    <div className="swaptime-btn">
                      <Link to="/manage-requests/exception-request/swap-time" className="btn btn-outline-secondary myrequest">{t('SwapTimePage.MyRequest.MyBtn')}</Link>
                      <Button active className=" btn btn-outline-secondary myrequest">{t('SwapTimePage.MyRequest.OtherRequestBtn')}</Button>
                    </div>
                  </div>
                  <hr />

                  <div className="row mx-0 flex-row-reverse bg-highlight">
                    <div className="col-md-4">

                      <Form className="row">
                        <Form.Group as={Row} className="mb-3 col-md-12" controlId="formPlaintextPassword">
                          <Form.Label column sm="4">
                            {t('Status')}
                          </Form.Label>
                          <Col sm="8">

                            <select className="form-control status-input" name="searchStatusId" onChange={this.handleDropDown}>
                              <option name="All" value="0">All</option>
                              <option name="Pending" value="10">Pending</option>
                              <option name="Rejected" value="20">Rejected</option>
                              <option name="Approved" value="30">Approved</option>
                              <option name="Withdrawn" value="40">Withdrawn</option>
                            </select>

                          </Col>
                        </Form.Group>
                      </Form>

                    </div>
                  </div>
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>{t('SrNo')}</th>
                        <th>{t('SwapTimePage.MyRequest.TableLabelRequestShift')}</th>
                        <th>{t('SwapTimePage.MyRequest.TableLabelTargetShift')}</th>
                        <th>{t('SwapTimePage.MyRequest.TableLabelShift.StartDate')}</th>
                        <th>{t('SwapTimePage.MyRequest.TableLabelShift.EndDate')}</th>
                        <th>{t('SwapTimePage.MyRequest.TableLabelTraget.StartDate')}</th>
                        <th>{t('SwapTimePage.MyRequest.TableLabelTraget.EndDate')}</th>
                        <th>{t('SwapTimePage.MyRequest.TableLabelShift.LineManager')}</th>
                        <th>{t('SwapTimePage.MyRequest.TableLabelTarget.LineManager')}</th>
                        <th>{t('SwapTimePage.MyRequest.TableLabelAssignedTo')}</th>
                        <th>{t('SwapTimePage.MyRequest.TableLabelAssignedBy')}</th>
                        <th>{t('Notes')}</th>
                        <th>{t('Status')}</th>
                        <th>{t('Action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {noData
                        && (
                          <tr>
                            <td colSpan="3" />
                            <td colSpan="11">No Data Available</td>
                          </tr>
                        )
                      }

                      {data.map(ShiftData => (
                        <tr key={ShiftData.id}>
                          <td>{counter++}</td>
                          <td>
                            {ShiftData.requestShiftTitle}
                          </td>
                          <td>
                            {ShiftData.targetShiftTitle}
                          </td>
                          <td>
                            {ShiftData.requestShiftStartDateTime ? commonService.localizedDate(ShiftData.requestShiftStartDateTime) : ''}
                          </td>
                          <td>
                            {ShiftData.requestShiftEndDateTime ? commonService.localizedDate(ShiftData.requestShiftEndDateTime) : ''}
                          </td>
                          <td>
                            {ShiftData.targetShiftStartDateTime ? commonService.localizedDate(ShiftData.targetShiftStartDateTime) : ''}
                          </td>
                          <td>
                           
                            {ShiftData.targetShiftEndDateTime ? commonService.localizedDate(ShiftData.targetShiftEndDateTime) : ''}
                          </td>
                          <td>
                            {ShiftData.requestShiftManger}
                          </td>
                          <td>
                            {ShiftData.targetShiftManger}
                          </td>
                          <td>
                            {ShiftData.targetUserFullName}
                          </td>
                          <td>
                            {ShiftData.requestUserFullName}
                          </td>
                          <td>
                            {ShiftData.statusChangeNotes}
                          </td>
                          <td>
                            {ShiftData.shiftStatus}
                          </td>
                          <td className="td-action">
                            <div className="action">
                              {
                                          ShiftData.shiftStatus === 'Pending' && (
                                          <>
                                            <span className="action-icon view danger-bg">
                                              <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 50, hide: 40 }}
                                                overlay={this.renderTooltip('Accept', 'acceptTooltip')}
                                              >
                                                <button type="button" className="noClass" onClick={() => this.handleRequestAccept(ShiftData.id)}>
                                                  <img
                                                    src={checkedIcon}
                                                    alt="Checked Icon"
                                                  />
                                                </button>
                                 
                                              </OverlayTrigger>
                               
                                            </span>
                                            <span className="action-icon edit primary-bg">
                                              <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 50, hide: 40 }}
                                                overlay={this.renderTooltip('Reject', 'rejectTooltip')}
                                              >
                                                <button type="button" className="noClass" onClick={() => this.handleRequestReject(ShiftData.id)}>
                                                  <img
                                                    src={removeIcon}
                                                    alt="Remove Icon"
                                                  />
                                                </button>
                                 
                                              </OverlayTrigger>
                                
                                            </span>
                                          </>
                                          )
                                      }
                            </div>
                          </td>
                        </tr>
                      ))}
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
                </div>
              </div>
            </>
          )
            : <p>{t('LoadingText')}</p>
        }

        {
          showModel && (
            <Modal
              show={this.handleRequestReject}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}

            >
              <form className="p-2">
                <div className="popup-header">{t('MyProfilePage.RejectedNotes')}</div>
                <div id="popup-form" className="text-center">
                  <input type="text" className="form-control" onChange={this.handleChange} name="statusChangeNotes" id="statusChangeNotes" placeholder="Add Notes" maxLength="256" />
                  {
                    requestError && !statusChangeNotes && <span className="error">{requestError}</span>
                  }
                  <br />
                  <div className="btn-section text-center mb-2">
                    <button type="button" className="btn btn-primary btn-lg btn-custom btn-save" onClick={() => this.doRejectRequest()}>{t('OkBtn')}</button>
                    <button type="button" className="btn btn-secondary btn-lg btn-custom" onClick={() => this.handleClose()}>{t('CancelBtn')}</button>
                  </div>
                </div>
              </form>
            </Modal>
          )
        }

        {
          showModelAccept && (
            <Modal
              show={this.handleRequestAccept}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Body>
                {t('MyProfilePage.AcceptNotes')}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  {t('CancelBtn')}
                </Button>
                <Button variant="primary" onClick={this.doAcceptRequest}>{t('ConfirmBtn')}</Button>
              </Modal.Footer>
            </Modal>
          )
        }

      </>
    );
  }
}

export default withTranslation()(OtherRequests);
