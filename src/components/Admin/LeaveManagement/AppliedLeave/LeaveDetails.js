/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Table, Row, Col, Container, Form, Card,
} from 'react-bootstrap';
import { userService } from '../../../../services';
import Api from '../../../common/Api';

class LeaveDetails extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    const token = userService.getToken();
    this.state = {
      token: `token ${token}`,
      appliedLeaves: [],
      appliedLeaveAttachments: [],
      leaveId: match.params.id,
      ParentLeaveTypeId: match.params.parentLeaveTypeId,
      appliedByUserId: match.params.appliedByUserId,
    };
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
  }

  componentDidMount() {
    this.getAppliedLeave();
    // window.scrollTo(0, 0);
  }

  getAppliedLeave = () => {
    const {
      token, leaveId, ParentLeaveTypeId, appliedByUserId,
    } = this.state;

    const data = {
      languageId: 1,
      id: parseInt(leaveId, 10),
      userId: parseInt(appliedByUserId, 10),
      parentLeaveTypeId: parseInt(ParentLeaveTypeId, 10),
    };
    fetch(`${Api.vacationManagement.getappliedleavesbyid}`,
      {
        method: 'POST',
        headers: new Headers({
          token: `${token} `,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
      }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            appliedLeaves: (response.data.appliedLeave !== null) ? response.data.appliedLeave : [],
            appliedLeaveAttachments: response.data.appliedLeaveAttachments,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAppliedLeave());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }


  downloadFile = (fileName) => {
    const { token } = this.state;

    fetch(`${Api.vacationManagement.getDownloadFile}?fileName=${fileName}`, {
      method: 'GET',
      headers: new Headers({
        token: `${token} `,
        Accept: 'application/json',
        'Content-Type': 'application/*',
      }),
    }).then(response => response.blob())
      .then((blob) => {
        if (blob.type === undefined || blob.type === 'application/json') {
          alert('Please try again getting some error.');
        } else {
          // 2. Create blob link to download
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName); // 3. Append to html page
          document.body.appendChild(link); // 4. Force download
          link.click(); // 5. Clean up and remove the link
          link.parentNode.removeChild(link);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  handleTime = (time) => {
    if (time.getMinutes() < 10 || time.getHours() < 10) {
      if (time.getHours() < 10) {
        return `0${time.getHours()}:${time.getMinutes()}`;
      }
      return `${time.getHours()}:0${time.getMinutes()}`;
    }
    return `${time.getHours()}:${time.getMinutes()}`;
  }

  handleDownloadClick = (fileName) => {
    this.downloadFile(fileName);
  }

  handleHours = (d2, d1) => {
    const diff = (d2.getTime() - d1.getTime()) / 1000;
    const hDiff = diff / (60 * 60);
    const mDiff = (diff / 60) % 60;
    return mDiff < 10 ? `${Math.floor(hDiff)}:0${Math.floor(mDiff)}` : `${Math.floor(hDiff)}:${Math.floor(mDiff)}`;
  }

  render() {
    const {
      appliedLeaves, appliedLeaveAttachments,
    } = this.state;
    const { t } = this.props;

    const fromTime = appliedLeaves && appliedLeaves.overtimeLeaveFromDateTimeUtc && new Date(appliedLeaves.overtimeLeaveFromDateTimeUtc);
    const toTime = appliedLeaves && appliedLeaves.overtimeLeaveToDateTimeUtc && new Date(appliedLeaves.overtimeLeaveToDateTimeUtc);
    return (
      <>
        { appliedLeaves && Object.keys(appliedLeaves).length > 0 && (
        <Container fluid className="leave_details one">
          <div className="card_layout">
          
            <div className="leavedetails">
              <div>
                <h4>
                  {t('ViewDetailsPage.Title')}
                  {' '}
                  {' '}
                  {appliedLeaves.appliedOn}
                </h4>
              </div>
              <hr />
              <Row>
                <Col xl={7}>
                  <Row>
                    <Col lg={3} md={4}>
                      <Form.Label className="label_lightgray">{t('ApplyPage.Leave_catergory')}</Form.Label>
                      <p>{appliedLeaves.parentLeaveTypeName}</p>
                    </Col>
                    <Col lg={3} md={4}>
                      <Form.Label className="label_lightgray">{t('ApplyPage.Leave_type')}</Form.Label>
                      <p>{appliedLeaves.childLeaveTypeName}</p>
                    </Col>
                    <Col lg={3} />
                    <Col lg={3} md={4} className="d-flex justify-content-end " />
                  </Row>
                  <Row>
                    <Col md={12}>
                      <div className="leaveBox">
                        <Row>
                          <Col md={4}>
                            <Form.Label>{t('FromDate')}</Form.Label>

                            <p><strong>{appliedLeaves.strFromDateTimeUtc}</strong></p>

                            <p>
                              {appliedLeaves.parentLeaveTypeId === 91
                                ? this.handleTime(fromTime) : appliedLeaves.strFromSession}
                            </p>
                          </Col>
                          <Col md={4}>
                            <Form.Label>{t('ApplyPage.ToDate')}</Form.Label>

                            <p><strong>{appliedLeaves.strToDateTimeUtc}</strong></p>

                            <p>
                              {appliedLeaves.parentLeaveTypeId === 91
                                ? this.handleTime(toTime) : appliedLeaves.strToSession}
                            </p>
                          </Col>
                          <Col md={4}>
                            {appliedLeaves.parentLeaveTypeId !== 91 && (
                            <>
                              <Form.Label>{t('AppliedPage.NoOfDays')}</Form.Label>
                              <p><strong>{appliedLeaves.noOfDays}</strong></p>
                            </>
                            )}
                            {appliedLeaves.parentLeaveTypeId === 91 && (
                            <>
                              <Form.Label>{t('No. of Hours')}</Form.Label>
                              <p><strong>{appliedLeaves.overtimeInHours}</strong></p>
                            </>
                            )}


                          </Col>
                        </Row>
                      </div>
                      <Row>
                        <Col>
                          <Card className="mt-4 mb-4">
                            <div className="details ">
                              <Card.Title>{t('AppliedPage.ViewDetails')}</Card.Title>
                              <hr />
                              <div className="detailsDiv">
                                <Form.Label className="detailslabel">{t('ApplyPage.OpenEnded')}</Form.Label>
                                <span>{appliedLeaves.openEnded ? 'Yes' : 'No'}</span>
                              </div>
                              <div className="detailsDiv">
                                <Form.Label className="detailslabel">{t('ViewDetailsPage.SecondaryManager')}</Form.Label>
                                <span>{appliedLeaves.appliedToSecondaryUser}</span>
                              </div>
                              <div className="detailsDiv">
                                <Form.Label className="detailslabel">{t('ViewDetailsPage.PrimaryManager')}</Form.Label>
                                <span>{appliedLeaves.appliedToPrimaryUser}</span>
                              </div>
                              <div className="detailsDiv">
                                <Form.Label className="detailslabel">{t('ApplyPage.Narrative')}</Form.Label>
                                <span>{appliedLeaves.reason}</span>
                              </div>
                              <div className="detailsDiv">
                                <Form.Label className="detailslabel">{t('ApplyPage.Sickness_paid')}</Form.Label>
                                <span>{appliedLeaves.sicknessPaid ? 'Yes' : 'No'}</span>
                              </div>
                              <div className="detailsDiv">
                                <Form.Label className="detailslabel">{t('ApplyPage.DoctorNoteProvided')}</Form.Label>
                                <span>{appliedLeaves.doctorsNoteProvided ? 'Yes' : 'No'}</span>
                              </div>
                              <div className="detailsDiv">
                                <Form.Label className="detailslabel">{t('ApplyPage.DoctorNote')}</Form.Label>
                                <span>{appliedLeaves.doctorsNote}</span>
                              </div>
                              <div className="detailsDiv">
                                <Form.Label className="detailslabel">
                                  {t('ApplyPage.AttachFile')}
                                </Form.Label>
                                {appliedLeaveAttachments.map(files => (
                                  <Table striped bordered hover size="sm">
                                    <thead>
                                      <tr>
                                        <th>
                                          {t('ViewDetailsPage.FileName')}
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="text-center breakWord">
                                          <a href="javascript:void(0)" onClick={() => this.handleDownloadClick(files.fileName)}>{files.fileName}</a>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                ))}
                              </div>
                            </div>
                          </Card>
                        </Col>
                      </Row>

                    </Col>
                  </Row>
                </Col>
                <Col xl={5}>
                  <Row>
                    <Col sm={5} className="timeLinesection">
                      <h5 className="statusText">{appliedLeaves.appliedLeaveStatus}</h5>
                    </Col>
                    <Col sm={7}>
                      <p>{t('ViewDetailsPage.ApplicationTimeLine')}</p>
                      <br />
                      {
                        appliedLeaves.isCancelledByUser && (
                          <>
                            <p>{appliedLeaves.appliedLeaveStatus}</p>
                            <span>
                              By
                              {' '}
                            </span>
                            <span>{appliedLeaves.appliedByUser}</span>
                            <br />
                            <span>{appliedLeaves.appliedOn}</span>
                            <br />
                            <br />
                            <br />
                          </>
                        )
                      }
                      {
                    appliedLeaves.appliedLeaveStatus === 'Pending' && (
                      <>
                        <p>{appliedLeaves.appliedLeaveStatus}</p>
                        <span>
                          With
                          {' '}
                        </span>
                        <span>
                          {appliedLeaves.appliedToSecondaryUser
                            ? appliedLeaves.appliedToSecondaryUser
                            : appliedLeaves.appliedToPrimaryUser}
                        </span>
                        <br />
                        <br />
                        <br />
                      </>
                    )
                  }
                      <span>Submitted</span>
                      <br />
                      <span>{appliedLeaves.appliedOn}</span>
                    </Col>
                  </Row>

                </Col>
              </Row>
            </div>
           
          </div>
        </Container>
        )}
      </>
    );
  }
}

export default withTranslation()(LeaveDetails);
