import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';

// function CardLeaveBalance(props) {
class CardLeaveBalance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      t, cardTitle, grantTitle, daysleft, c_link,
    } = this.props;
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>
              <Row>
                <Col lg={7}>
                  <p>{cardTitle}</p>
                </Col>
                <Col lg={5} className="grantTitle">
                  <p>{grantTitle}</p>
                </Col>
              </Row>
            </Card.Title>
            <Card.Body>
              <Row>
                <Col md={12}>
                  <div className="balance_card_box">
                    <h3 className="days_left">{daysleft}</h3>
                    <span>{t('VacationBalancePage.Balance')}</span>
                    {/* Use Link instead of anchor element */}
                    <Link to={c_link}>{t('VacationBalancePage.ViewDetails')}</Link>
                    {/* <a href={c_link}>{t('VacationBalancePage.ViewDetails')}</a> */}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card.Body>
        </Card>
      </>
    );
  }
}
export default withTranslation()(CardLeaveBalance);
