/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LeaveBalance from './LeaveBalance';
import LeaveDetailBalance from './LeaveDetailBalance';


class LeaveBalanceIndex extends React.Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col md={12}>
            <div className="card_layout leaveManagement">
              <LeaveBalance />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default LeaveBalanceIndex;
export { LeaveDetailBalance };
