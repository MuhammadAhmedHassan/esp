import React, { Component } from 'react';
import {
  Container, Row, Col, Button, Modal, Form, FormControl,
} from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { userService } from '../../../services';
import QuestionIcon from '../../../Images/Icons/question.svg';
import Api from '../../common/Api';
import './style.scss';

class UserDelete extends Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    this.state = {
      token: `${token}`,
      showModal: false,
      email: '',
      emailRequired: false,
      showMessageModal: false,
      modalMessage: '',
    };
  }

  deleteUser = () => {
    const {
      token, email,
    } = this.state;
    if (email) {
      fetch(`${Api.gdpr.deleteUser}`, {
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
          userEmail: email,
        }),
      }).then(response => response.json())
        .then((response) => {
          if (response.statusCode === 200) {
            this.setState({
              showModal: false,
              showMessageModal: true,
              modalMessage: response.message,
            });
          } else if (response.statusCode === 401) {
            const refreshToken = userService.getRefreshToken();
            refreshToken.then(() => {
              const tokens = userService.getToken();
              this.setState({ token: tokens }, () => this.deleteUser());
            });
          } else {
            this.setState({
              showModal: false,
              showMessageModal: true,
              modalMessage: response.message,
            });
          }
        })
        .catch((err) => {
          console.error(err.toString());
          this.setState({
            showModal: false,
            showMessageModal: true,
            modalMessage: err.toString(),
          });
        });
    } else {
      this.setState({
        emailRequired: !email,
      });
    }
  }

  handleClose = () => {
    this.setState({
      showMessageModal: false,
    });
  }

  checkValidation = () => {
    const { email } = this.state;
    if (email) {
      this.setState({ showModal: true });
    } else {
      this.setState({ emailRequired: !email });
    }
  }


  handleEmail(e) {
    const { value } = e.target;
    this.setState({
      email: value,
      emailRequired: false,
    });
  }

  render() {
    const { t } = this.props;
    const {
      emailRequired, showModal, showMessageModal, modalMessage,
    } = this.state;
    return (
      <div className="userDelete">
        <Container>
          <Row>
            <Col lg={6} className="mx-auto">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>{t('userDelete.Email')}</Form.Label>
                  <Form.Control type="email" name="message" required placeholder="Enter email" onChange={e => this.handleEmail(e)} />
                  {emailRequired && <small className="text-danger validate__message d-block">Please enter a email</small>
                  }

                </Form.Group>


              </Form>

            </Col>
          </Row>
          <Row className="justify-content-center">
            <Button variant="primary" onClick={() => this.checkValidation()}>
              {t('userDelete.Submit')}
            </Button>
          </Row>
        </Container>
        {showModal && (
          <Modal
            show={showModal}
            onHide={() => this.setState({ showModal: false })}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              Are you sure you want to delete this User
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.deleteUser()}>
                Yes
              </Button>
              <Button variant="secondary" onClick={() => this.setState({ showModal: false })}>
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        {showMessageModal && (
          <Modal
            show={showMessageModal}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              {modalMessage}
            </Modal.Header>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    );
  }
}

export default withTranslation()(UserDelete);
