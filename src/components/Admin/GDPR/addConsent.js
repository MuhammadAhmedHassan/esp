import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { userService } from '../../../services';
import QuestionIcon from '../../../Images/Icons/question.svg';
import Api from '../../common/Api';
import './style.scss';

class AddConsent extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    this.state = {
      token: `${token}`,
      isRequired: false,
      message: '',
      displayOrder: 1,
      displayDuringRegistration: false,
      displayOnUserInfoPage: false,
      messageRequired: false,
      dispRequired: false,
      isNonEditable: false,
      defaultValueDisable: false,
      isActive: true,
    };
  }

  addConsent = () => {
    const {
      token, isRequired, message, isNonEditable,
      displayOrder, displayOnUserInfoPage, displayDuringRegistration,
      isActive,
    } = this.state;
    if (message && displayOrder > 0) {
      fetch(`${Api.gdpr.addConsent}`, {
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
          message,
          isRequired,
          requiredMessage: '',
          displayDuringRegistration,
          displayOnUserInfoPage,
          displayOrder: Number(displayOrder),
          isNonEditable,
          createdOnUtc: new Date(),
          updatedOnUtc: new Date(),
          deleted: !isActive,

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
              this.setState({ token: tokens }, () => this.addConsent());
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

  render() {
    const { t } = this.props;
    const {
      messageRequired, isActive, dispRequired, isNonEditable, defaultValueDisable, isRequired, displayOrder,
    } = this.state;
    return (
      <div className="gdprSetting">
        <Row>
          <Col sm={4}>
            <h6>
              {t('Gdpr.Message')}
            </h6>
          </Col>
          <Col sm={7}>
            <div className="consent_message">
              <textarea maxLength="250" rows="1" className="textField" required type="message" name="message" onChange={e => this.handleMessage(e)} />
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
            <input className="check" name="isNonEditable" type="checkbox" value={isNonEditable} onChange={e => this.handleCheck(e)} />
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col xs={8} sm={4}>
            <h6>
              {t('Gdpr.DefaultValue')}
            </h6>
          </Col>
          <Col xs={4} sm={4} className="px-0">
            <input className="check" name="isRequired" type="checkbox" checked={isRequired} disabled={defaultValueDisable} onChange={e => this.handleCheck(e)} />
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
          <Button className="mb-3 mb-sm-0" onClick={() => this.handleRedirect()}>
            {t('Gdpr.Cancel')}
          </Button>
          <Button onClick={() => this.addConsent()}>
            {t('Gdpr.Save')}
          </Button>
        </Row>
      </div>
    );
  }
}

export default withTranslation()(AddConsent);
