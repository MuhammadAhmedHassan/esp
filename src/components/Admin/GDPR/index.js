import React, { Component } from 'react';
import {
  Row, Col, Table, Button, Modal, Tooltip, OverlayTrigger,
} from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import InfoIcon from '../../../Images/Icons/info.svg';
import ThumbIcon from '../../../Images/Icons/thumb.svg';
import CheckIcon from '../../../Images/Icons/check.svg';
import CrossIcon from '../../../Images/Icons/cross.svg';
import EditIcon from '../../../Images/Icons/Edit.svg';
import PaginationAndPageNumber from '../../shared/Pagination';
import QuestionIcon from '../../../Images/Icons/question.svg';
import { userService } from '../../../services';
import Api from '../../common/Api';
import './style.scss';

class GdprSetting extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    this.state = {
      token: `${token}`,
      totalRecords: 0,
      pageIndex: 1,
      pageSize: 10,
      isEnabledModal: false,
      consentData: [],
      enabled: [],
      isEnabled: false,
    };
  }

  componentDidMount() {
    this.getConsent();
    this.getConsentCommon();
  }

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
      }, () => this.getConsent());
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
    }, () => this.getConsent());
  }

  getConsentCommon = () => {
    const {
      token,
    } = this.state;
    fetch(`${Api.gdpr.adminSetting}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: 0,
        languageId: 1,
        offset: '',
        isActive: true,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            isEnabled: response.data.isEnabled,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getConsentCommon());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getConsent = () => {
    const {
      token, pageSize, pageIndex, totalRecords,
    } = this.state;
    fetch(`${Api.gdpr.getConsent}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: 0,
        languageId: 1,
        offset: '',
        isActive: false,
        pageIndex,
        pageSize,
        totalRecords,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            consentData: response.data,
            pageIndex,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getConsent());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getAdminSetting = () => {
    const {
      token,
    } = this.state;
    fetch(`${Api.gdpr.adminSetting}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: 0,
        languageId: 1,
        offset: '',
        isActive: true,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            isEnabled: response.data.isEnabled,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getAdminSetting());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  saveEnableSetting = () => {
    const {
      token, isEnabled,
    } = this.state;
    fetch(`${Api.gdpr.saveAdminSetting}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: 0,
        languageId: 0,
        offset: '',
        isActive: true,
        isEnabled,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            isEnabledModal: true,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.saveEnableSetting());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  goToAddConsent = () => {
    const { history } = this.props;
    history.push('/gdpr-setting/addConsent');
  }

  goToEditConsent = (id) => {
    const { history } = this.props;
    history.push(`/gdpr-setting/edit/${id}`);
  }

  handleEnable(e) {
    const { checked } = e.target;
    this.setState({
      isEnabled: checked,
    }, () => this.saveEnableSetting());
  }

  renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {props}
    </Tooltip>
  );

  render() {
    const {
      consentData,
      isEnabledModal,
      pageSize,
      pageIndex,
      totalRecords,
      isEnabled,
    } = this.state;
    const { t } = this.props;
    return (
      <>
        <div className="gdprSetting">
          <Row>
            <Col md={12}>
              <span className="heading">
                <img src={InfoIcon} alt="info icon" />
                {' '}
                {t('GdprPage.Common')}
                {' '}
              </span>
              <hr />
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col xs={6} sm={6}>
              <h6>
                {t('GdprPage.Enabled')}
              </h6>
            </Col>
            <Col xs={6} sm={6} className="px-0">
              <input className="check" checked={isEnabled} name="isEnabled" onChange={e => this.handleEnable(e)} type="checkbox" />
            </Col>
          </Row>
        </div>
        <div className="gdprSetting">
          <Row>
            <Col md={12} className="createConsentBtn">
              <Button onClick={() => this.goToAddConsent()}>
                {t('Gdpr.CreateConsent')}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <span className="heading">
                <img src={ThumbIcon} alt="thumb icon" />
                {' '}
                {t('GdprPage.Consent')}
                {' '}
              </span>
              <hr />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Table className="tableContent" responsive bordered>
                <thead>
                  <tr>
                    <th>{t('Gdpr.Message')}</th>
                    <th>{t('Gdpr.IsNonEditable')}</th>
                    <th>{t('Gdpr.DefaultValue')}</th>
                    <th>{t('Gdpr.IsActive')}</th>
                    <th>{t('Gdpr.Order')}</th>
                    <th>{t('Gdpr.Edit')}</th>
                  </tr>
                </thead>
                <tbody>
                  { consentData && consentData.map(data => (
                    <tr>
                      <td><p>{data.message}</p></td>
                      { data.isNonEditable
                        ? (
                          <td>
                            <img src={CheckIcon} alt="check" />
                          </td>
                        )
                        : (
                          <td>
                            <img src={CrossIcon} alt="cross" />
                          </td>
                        )}
                      { data.isRequired
                        ? (
                          <td>
                            <img src={CheckIcon} alt="check" />
                          </td>
                        )
                        : (
                          <td>
                            <img src={CrossIcon} alt="cross" />
                          </td>
                        )}
                      { !data.deleted
                        ? (
                          <td>
                            <img src={CheckIcon} alt="check" />
                          </td>
                        )
                        : (
                          <td>
                            <img src={CrossIcon} alt="cross" />
                          </td>
                        )}
                      <td>{data.displayOrder}</td>
                      <td>
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 50, hide: 40 }}
                          overlay={this.renderTooltip('Edit')}
                        >
                          <Button variant="link" className="edit__btn" onClick={() => this.goToEditConsent(data.id)}>
                            <img src={EditIcon} alt="edit" />
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))}
                  <tr />
                </tbody>
              </Table>
            </Col>
          </Row>

          { isEnabledModal && (
          <Modal
            show={isEnabledModal}
            onHide={() => this.setState({ isEnabledModal: false })}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header>
              {isEnabled ? 'GDPR is Active' : 'GDPR is Inactive'}
            </Modal.Header>
            <Modal.Footer>
              <Button
                type="button"
                variant="primary"
                onClick={() => this.setState({ isEnabledModal: false })}
              >
                OK
              </Button>
            </Modal.Footer>
          </Modal>
          )}
          { consentData.length === 0 && (
          <div>
            <h3 className="text-center">No data found</h3>
          </div>
          )}
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
          <Row />
        </div>
      </>
    );
  }
}

export default withTranslation()(GdprSetting);
