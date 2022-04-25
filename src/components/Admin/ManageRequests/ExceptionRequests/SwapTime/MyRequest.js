
import {
  Table, Modal, Button, Col, Row, Form, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import React, {
  Component,
} from 'react';
import { withTranslation } from 'react-i18next';
import './style.scss';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Withdraw from '../../../../../Images/Icons/withdraw.svg';
import { userService } from '../../../../../services';
import Api from '../../../../common/Api';
import PaginationAndPageNumber from '../../../../shared/Pagination/index';
import { commonService } from '../../../../../services/common.service';

export class SwapTime extends Component {
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
      requestId: 0,
      searchStatusId: 0,
      successMessage: '',
      responseStatus: false,
      totalRecords: 0,
      pageSize: 10,
      pageIndex: 1,
      loaded: false,
      errorMessage: '',
    };
  }

  componentDidMount() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getMySwapRequest();
    }
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getMySwapRequest();
    }
  }


  handleDropDown = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      }, () => this.getMySwapRequest(),
    );
  };

  handleRequestWidraw = (id, status) => {
    if (status === 'Pending') {
      const { showModel } = this.state;
      this.setState({
        showModel: !showModel,
        requestId: id,
      });
    }
  }

  doWidthrawRequest = () => {
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
        newStatusId: 40,
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
          this.getMySwapRequest();
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.doWidthrawRequest());
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

  getMySwapRequest = () => {
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
        requestTypeId: 1,
        searchStatusId: parseInt(searchStatusId, 10),
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
            this.setState({ token: tokens }, () => this.getMySwapRequest());
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

  handleClose = () => {
    this.setState({
      showModel: false,
    });
  }

  renderTooltip = (props, id) => (
    <Tooltip id={id} {...props}>
      {props}
    </Tooltip>
  );

  render() {
    const {
      data, noData, loaded, pageSize, pageIndex, totalRecords, showModel,
      successMessage, responseStatus, errorMessage,
    } = this.state;
    let counter = 1;
    const { t } = this.props;
    return (
      <>
        {loaded ? (
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
            {
              errorMessage && (
                <div className="row">
                  <div className="col-md-12">
                    <div className={`alert alert-${responseStatus === 200 ? 'success' : 'danger'}`} role="alert">
                      {errorMessage}
                    </div>
                  </div>
                </div>
              )
            }

            <div className="container-fluid swap-time">
              <div className="card_layout">
                <div className="row mx-0">
                  <div className="swaptime-btn">
                    <Button active className="btn btn-outline-secondary myrequest ">{t('SwapTimePage.MyRequest.MyBtn')}</Button>
                    <Link to="/swap-time/Others-request" className="btn btn-outline-secondary myrequest">{t('SwapTimePage.MyRequest.OtherRequestBtn')}</Link>
                  </div>
                </div>
                <hr />
                <div className="row flex-row-reverse bg-highlight">
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
                          {ShiftData.shiftStatus === 'Pending' ? ShiftData.requestNotes : ShiftData.statusChangeNotes}
                        </td>
                        <td>
                          {ShiftData.shiftStatus}
                        </td>
                        <td className="td-action">
                          <div className="action">
                            {
                              ShiftData.shiftStatus === 'Pending' && (
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 50, hide: 40 }}
                                overlay={this.renderTooltip('Withdraw', 'withdrawTooltip')}
                              >
                                <img
                                  src={Withdraw}
                                  alt="Withdraw Icon"
                                  onClick={() => this.handleRequestWidraw(ShiftData.id, ShiftData.shiftStatus)}
                                />
                              </OverlayTrigger>
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
              show={this.handleRequestWidraw}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Body>
                {t('MyProfilePage.ReqWithdrawText')}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  {t('CancelBtn')}
                </Button>
                <Button variant="primary" onClick={this.doWidthrawRequest}>{t('ConfirmBtn')}</Button>
              </Modal.Footer>
            </Modal>
          )
        }
      </>
    );
  }
}

export default withTranslation()(SwapTime);
