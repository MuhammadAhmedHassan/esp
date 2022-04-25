/* eslint-disable max-len */
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import './style.scss';
import { Col, Row, Button } from 'react-bootstrap';

class DetailsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.count,
      title: props.title,
      path: props.path,
      history: props.history,
      status: props.status,
    };
  }

  viewPage = () => {
    const { path, history, status } = this.state;
    if (path !== '') {
      history.push({
        pathname: path,
        state: {
          status,
        },
      });
      // eslint-disable-next-line react/destructuring-assignment
    }
  }

  render() {
    const {
      title, count, path,
    } = this.state;
    return (
      <>
        <Col xl={3} sm={6} className="mb-3">
          {
            path !== '' ? (
              <Button className="noClassDashboard" onClick={() => this.viewPage()}>
                <div className="cardBox dashboardCard">
                  <div className="titleCount">
                    <div className="cardTileRight">
                      {count}
                    </div>
                  </div>
                  <p className="cardTileLeft">
                    {title}
                  </p>
                </div>
              </Button>
            ) : (
              <div className="cardBox dashboardCard">
                <div className="titleCount">
                  <div className="cardTileRight">
                    {count}
                  </div>
                </div>
                <p className="cardTileLeft">
                  {title}
                </p>
              </div>
            )
          }
        </Col>
      </>
    );
  }
}

export default withTranslation()(DetailsCard);
