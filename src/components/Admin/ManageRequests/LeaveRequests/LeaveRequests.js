
import React from 'react';
import { Button, Accordion, Card } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { commonService } from '../../../../services/common.service';
import Api from '../../../common/Api';
import { userService } from '../../../../services';
import PaginationAndPageNumber from '../../../shared/Pagination/index';

class LeaveReq extends React.Component {
  constructor(props) {
    super(props);
    const userId = userService.getUserId();
    const token = userService.getToken();
    this.state = {
      token: `token ${token}`,
      userId,
      appliedLeaves: [],
      pageIndex: 1,
      pageSize: 5,
      totalRecords: 0,
      error: null,
    };
  }

  componentDidMount() {
    this.getAppliedLeaves();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getAppliedLeaves();
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
  
    getAppliedLeaves = () => {
      const {
        token, userId, pageIndex, pageSize,
      } = this.state;
      fetch(`${Api.vacationManagement.getuserappliedleaves}`, {
        method: 'POST',
        headers: new Headers({
          token: `${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          AppliedToPrimaryUser: userId,
          pageIndex,
          pageSize,
        }),
      }).then(response => response.json())
        .then((response) => {
          if (response.statusCode === 200) {
            this.setState({
              appliedLeaves: response.data,
              loaded: true,
              error: false,
              pageIndex: response.data.pageIndex || 1,
              pageSize: response.data.pageSize,
              totalRecords: response.data.totalRecords,
            });
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.getAppliedLeaves());
            });
          } else {
            this.setState({
              loaded: true,
              appliedLeaves: [],
              error: true,
            });
          }
        })
        .catch(err => console.error(err.toString()));
    }


    render() {
      const {
        appliedLeaves, pageIndex, loaded, pageSize, totalRecords, error,
      } = this.state;
      const { t } = this.props;
      return (

        (
          appliedLeaves.map(appliedLeavesData => (
            <div className="appliedLeaveOuterCard">
              <div className="appliedLeaveCard">
                <div className="row">
                  <div className="col-md-4">
                    <h5>
                      {' '}
                      {t('ApplyPage.Leave_catergory')}
                    </h5>
                    <p>
                      {appliedLeavesData.ParentLeaveTypeName}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <h5>
                      {' '}
                      {t('ApplyPage.Leave_type')}
                      {' '}
                    </h5>
                    <p>
                      {appliedLeavesData.ChildLeaveTypeName}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <h5>
                      {' '}
                      {t('AppliedPage.NoOfDays')}
                      {' '}
                    </h5>
                    <p>
                      {appliedLeavesData.NoOfDays}
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <h5>
                      {' '}
                      {t('StartDate')}
                      {' '}
                    </h5>
                    <p>
                      {appliedLeavesData.StrFromDateTimeUtc ? commonService.localizedDate(appliedLeavesData.StrFromDateTimeUtc) : ''}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <h5>
                      {' '}
                      {t('EndDate')}
                    </h5>
                    <p>
                      {appliedLeavesData.StrToDateTimeUtc ? commonService.localizedDate(appliedLeavesData.StrToDateTimeUtc) : ''}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <h5>
                      {' '}
                      {t('leavRequestPage.requestedBy')}
                      {' '}
                    </h5>
                    <p>
                      {appliedLeavesData.AppliedByUser}
                      {' '}
                    </p>
                  </div>
                </div>


                <Accordion defaultActiveKey="0">
                  <Card>
                    <div className="row">
                      <div className="col-lg-9">
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            <div className="row">
                              <div className="col-xl-6">
                                <p>
                                  <label className="label_ap">{t('leaveRequestPage.AppliedOn')}</label>
                                  {appliedLeavesData.AppliedOn}
                                </p>
                                <p>
                                  <label className="label_ap">{t('leavRequestPage.reason')}</label>
                                  {appliedLeavesData.Reason}
                                </p>
                              </div>
                              <div className="col-xl-6">
                                <p>
                                  <label className="label_ap">{t('leavRequestPage.CCTo')}</label>
                                  {appliedLeavesData.AppliedToSecondaryUser}
                                </p>
                              </div>
                            </div>
                          </Card.Body>
                        </Accordion.Collapse>
                      </div>
                      <div className="col-lg-3">
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                          {t('AppliedPage.ViewDetails')}
                        </Accordion.Toggle>
                      </div>
                    </div>
                  </Card>
                </Accordion>

                <div className="row ">
                  <div className="col-md-12 d-flex justify-content-end mt20">
                    <button type="button" className="btn btn-danger">{t('leavRequestPage.reject')}</button>
                    <button type="button" className="btn btn-success">{t('leavRequestPage.approve')}</button>
                  </div>
                </div>
              
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

          ))
        )

      );
    }
}

export default withTranslation()(LeaveReq);
