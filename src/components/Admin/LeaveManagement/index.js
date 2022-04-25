/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ApplyLeaveIndex from './ApplyLeave/index';
import './style.scss';


class LeaveManagement extends React.Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col md={12}>
            <div className="card_layout leaveManagement">
              <ApplyLeaveIndex />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LeaveManagement;
