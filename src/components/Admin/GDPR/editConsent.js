import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { userService } from '../../../services';
import Api from '../../common/Api';
import './style.scss';

class EditConsent extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const { match } = this.props;
    this.state = {
      token: `${token}`,
      isRequired: false,
      defaultValueDisable: false,
      message: '',
      displayOrder: '',
      displayDuringRegistration: false,
      displayOnUserInfoPage: false,
      consentId: match.params && match.params.consentId,
      dispRequired: false,
      messageRequired: false,
      isNonEditable: false,
      isActive: true,
    };
  }

  componentDidMount = () => {
    this.getConsentData();
  }

  getConsentData = () => {
    const {
      token, consentId,
    } = this.state;
    fetch(`${Api.gdpr.getConsent}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: Number(consentId),
        languageId: 1,
        offset: '',
        isActive: false,
        pageIndex: 1,
        pageSize: 10,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          const arrayRes = response.data.filter(data => (Number(consentId) === data.id));
          if (arrayRes.length > 0) {
            this.setState({
              message: arrayRes[0].message,
              isRequired: arrayRes[0].isNonEditable ? true : arrayRes[0].isRequired,
              isNonEditable: arrayRes[0].isNonEditable,
              defaultValueDisable: arrayRes[0].isNonEditable,
              displayOnUserInfoPage: arrayRes[0].displayOnUserInfoPage,
              displayDuringRegistration: arrayRes[0].displayDuringRegistration,
              displayOrder: arrayRes[0].displayOrder,
              isActive: !arrayRes[0].deleted,
            });
          }
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getConsentData());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  saveConsent = () => {
    const {
      token, isRequired, isActive, message, displayOrder, isNonEditable,
      displayOnUserInfoPage, displayDuringRegistration, consentId,
    } = this.state;
    
    if (message && displayOrder > 0) {
      fetch(`${Api.gdpr.saveConsent}`, {
        method: 'POST',
        headers: new Headers({
          token: `${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          id: Number(consentId),
          languageId: 1,
          offset: '',
          isActive: true,
          message,
          isRequired,
          requiredMessage: '',
          displayDuringRegistration,
          displayOnUserInfoPage,
          displayOrder: Number(displayOrder),
          isNonEditable,
          deleted: !isActive,
          createdOnUtc: new Date(),
          updatedOnUtc: new Date(),

        }),
      }).then(response => response.json())
        .then((response) => {
          if (response.statusCode === 200) {
            const { history } = this.props;
            history.push('/gdpr-setting');
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.saveConsent());
            });
          }
        });
    } else {
      this.setState({
        messageRequired: !message,
        dispRequired: displayOrder < 1,
      });
    }
  }

  handleRedirect = () => {
    const { history } = this.props;
    history.push('/gdpr-setting');
  }

  handleCheck(e) {
    const { name, checked } = e.target;
    if (name === 'isNonEditable') {
      this.setState({
        isRequired: true,
        defaultValueDisable: checked,
      });
    }
    this.setState({
      [name]: checked,
    });
  }

  handleMessage(e) {
    const { value } = e.target;
    this.setState({
      message: value,
      messageRequired: false,
    });
  }

  handleDispOrder(e) {
    const { value } = e.target;
    this.setState({
      displayOrder: value,
      dispRequired: false,
    });
  }

  render() {
    const {
      message, isRequired, displayOrder,
      dispRequired, messageRequired, isNonEditable, defaultValueDisable,
      isActive,
    } = this.state;
    const { t } = this.props;
    return (
      <div className="gdprSetting">
        <Row className="align-items-center">
          <Col sm={4}>
            <h6>
              {t('Gdpr.Message')}
            </h6>
          </Col>
          <Col sm={7}>
            <div className="consent_message">
              <textarea className="textField" maxLength="250" rows="1" required type="message" defaultValue={message} name="message" onChange={e => this.handleMessage(e)} />
              {messageRequired && <small className="text-danger validate__message">Please enter a message</small>
                }
            </div>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col xs={8} sm={4}>
            <h6>
              {t('Gdpr.IsNonEditable')}
            </h6>
          </Col>
          <Col xs={4} sm={4} className="px-0">
            <input className="check" name="isNonEditable" checked={isNonEditable} type="checkbox" onChange={e => this.handleCheck(e)} />
          </Col>
        </Row>

        <Row className="align-items-center">
          <Col xs={8} sm={4}>
            <h6>
              {t('Gdpr.DefaultValue')}
            </h6>
          </Col>
          <Col xs={4} sm={4} className="px-0">
            <input className="check" name="isRequired" disabled={defaultValueDisable} checked={isRequired} type="checkbox" onChange={e => this.handleCheck(e)} />
          </Col>
        </Row>

        <Row className="align-items-center">
          <Col xs={8} sm={4}>
            <h6>
              {t('Gdpr.IsActive')}
            </h6>
          </Col>
          <Col xs={4} sm={4} className="px-0">
            <input className="check" type="checkbox" checked={isActive} name="isActive" onChange={e => this.handleCheck(e)} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col xs={8} sm={4}>
            <h6>
              {t('Gdpr.Order')}
            </h6>
          </Col>
          <Col sm={7}>
            <div className="consent_message">
              <input className="mt-3 textField" type="number" defaultValue={displayOrder} min="1" name="displayOrder" onChange={e => this.handleDispOrder(e)} />
              {dispRequired && <small className="text-danger validate__message">Please enter valid display order</small>
                    }
            </div>
          </Col>
        </Row>
        <Row className="addConsentBtn mt-3">
          <Button className="mb-4 mb-sm-0" onClick={() => this.handleRedirect()}>
            {t('Gdpr.Cancel')}
          </Button>
          <Button onClick={() => this.saveConsent()}>
            {t('Gdpr.Save')}
          </Button>
        </Row>
      </div>
    );
  }
}

export default withTranslation()(EditConsent);
