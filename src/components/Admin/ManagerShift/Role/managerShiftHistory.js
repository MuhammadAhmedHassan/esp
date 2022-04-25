import React from 'react';
import './style.scss';
import { Tabs, Tab } from 'react-bootstrap';
import MyShiftHistory from './myShiftHistory';
import MyTeamShiftHistory from './myTeamShiftHistory';


class ManagerTabsShift extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  render() {
    return (
      <div className="card_layout coverage">
        <Tabs defaultActiveKey="myShift" id="uncontrolled-tab-example">
          <Tab eventKey="myShift" title="My Shift">
            <MyShiftHistory />
          </Tab>
          <Tab eventKey="myTeamShift" title="My Team Shift">
            <MyTeamShiftHistory />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default (ManagerTabsShift);
