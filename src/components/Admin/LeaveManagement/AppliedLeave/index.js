/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Container, Row, Col } from 'react-bootstrap';
import AppliedLeave from './AppliedLeave';

class AppliedLeaveIndex extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <Container fluid>
        <Row>
          <Col md={12}>
            <div className="card_layout leaveManagement">
              <h2 className="ml-2">
                {t('AppliedPage.Title')}
                {' '}
              </h2>
              <AppliedLeave> </AppliedLeave>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withTranslation()(AppliedLeaveIndex);
