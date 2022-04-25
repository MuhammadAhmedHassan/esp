import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ACL from './Acl';

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
              <ACL />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}


export default UserRole;
