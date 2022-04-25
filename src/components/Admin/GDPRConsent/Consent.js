import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Row, Col, Button, Form, Modal, Table,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import Api from '../../common/Api';
import { userService } from '../../../services';
import Loaders from '../../shared/Loaders';

const tableHeader = [
  {
    label: 'Consent Name',
  },
];

class Consent extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      loaded: false,
      token: `${token}`,
      userId: `${userId}`,
      consentList: [],
      selectedConsent: [],
      showModal: false,
    };
  }

  componentDidMount() {
    this.getConsentList();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getConsentList();
    }
  }

  handleClose = () => {
    this.setState({
      showModal: false,
      loaded: false,
    });
  }

  getConsentList = () => {
    const {
      token, userId,
    } = this.state;
  
    const data = {
      languageId: 1,
      id: parseInt(userId, 10),
    };
       
    fetch(`${Api.gdpr.getConsentList}`, {
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
            consentList: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getConsentList());
          });
        } else {
          alert(response.message);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  submitConsent = () => {
    const {
      token, userId, selectedConsent,
    } = this.state;
    
    const data = {
      languageId: 1,
      id: parseInt(0, 10),
      userId: parseInt(userId, 10),
      consent: selectedConsent,
    };

    fetch(`${Api.gdpr.submitConsent}`, {
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
            showModal: true,
            selectedConsent: [],
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.submitConsent());
          });
        } else {
          alert(response.message);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  handleClick = () => {
    this.setState({
      loaded: false,
    });
  }

  handleInputChange(event, id) {
    const {
      selectedConsent,
    } = this.state;
    const { target } = event;
    const { type, checked } = target;
    const value = type === 'checkbox' ? checked : target.value;
    const index = selectedConsent.map(e => e.consentId).indexOf(id);
    if (index > -1) {
      selectedConsent[index].isConsentAgreed = value;
    } else {
      selectedConsent.push({
        consentId: id,
        isConsentAgreed: value,
      });
    }
    this.setState({
      selectedConsent,
    });
  }


  render() {
    const {
      loaded, consentList, showModal,
    } = this.state;
    const { t } = this.props;
    return (
      <div className="container-fluid overTime">
        <div className="card_layout p-0 pb-3">
          <Row>
            <Col>
              {
          loaded ? (
            <div>
              <h4 className="tilte">GDPR</h4>
              <Table responsive>
                <thead>
                  <tr className="table-header">
                    {tableHeader.map(data => (
                      <th className="text-left">
                        <span>
                          {data.label}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {consentList.map((data, index) => (
                    <tr>
                      <td>
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                          // name={data.message}
                            onChange={event => this.handleInputChange(event, data.gdprConsentId, index, data.isRequired)}
                         // className="custom-control-input"
                            id={data.gdprConsentId}
                            disabled={data.isNonEditable}
                            className="custom-control-input"
                            defaultChecked={data.gdprLogId > 0 ? data.isConsentAgreed : data.isRequired}
                          />
                          <label className="custom-control-label" htmlFor="numberofTotalUsers">{data.message}</label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
           
          )
            : <Loaders />
        }
            </Col>
          </Row>
        

          <Row className="mt-4">
            <Col className="text-center">
              <Button className="mb-3" onClick={this.submitConsent}>{t('Modal.SaveBtn')}</Button>
              <Button onClick={this.handleClick} className="btn btn-primary mb-3">{t('ScheduleCreatePage.CancelBtn')}</Button>
            </Col>
          </Row>
        </div>
        {
            showModal && (
              <Modal
                show={showModal}
                backdrop="static"
                keyboard={false}
              >
                <Modal.Body>
                  {t('GDPR.Update')}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    {t('OkBtn')}
                  </Button>
                </Modal.Footer>
              </Modal>
            )
          }
      </div>
    );
  }
}

export default connect()(withTranslation()(Consent));
