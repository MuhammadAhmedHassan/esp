/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { } from 'react';
import {
  Row, Col, Container, Form,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../Images/logos/esp_logo_primary.svg';
import './style.scss';

class ForgotPassword extends React.Component {
  render() {
    return (
      <Container fluid className="login">
        <Row className="row justify-content-center align-items-center h-100">
          <Col className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 py-4">
            <Col className="col-12">
              <div className="logo mx-auto mb-5 pb-sm-3">
                <Link to="/">
                  <img alt="esp logo" src={logo} />
                </Link>
              </div>
            </Col>
            <div className="login-form p-4 p-sm-5">
              <form onSubmit={this.handleSubmit}>
                <Row className="row">
                  <h2 className="col-12 mb-3">
                    Forgot Password
                  </h2>

                </Row>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                  <Form.Text className="text-muted">
                    <small className="text-danger">Please enter a valid email id</small>
                  </Form.Text>
                </Form.Group>

                <Row className="row  mt-3 mt-sm-5">
                  <Col className="col-sm-12 text-center">
                    <button type="submit" className="btn btn-primary login-button"><h3>Submit</h3></button>
                  </Col>
                </Row>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default ForgotPassword;
