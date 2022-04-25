import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UserRoleList from './UserRoleList';
import './style.scss';

class UserRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Container fluid>
          <Row>
            <Col xs={12}>
              <UserRoleList />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}


export default UserRole;
