import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import MyLeaveDetails from './MyLeaveDetails';
import MyTeamLeaveDetails from './MyTeamLeaveDetails';


function ManagerLeaveDetailsReport() {
  const [key, setKey] = useState('my_leave_details');
  return (
    <div>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={selectedKey => setKey(selectedKey)}
        className="mb-3"
      >
        <Tab eventKey="my_leave_details" title="My Leave Details">
          <MyLeaveDetails />
        </Tab>
        <Tab eventKey="my_team_leave_details" title="My Team Leave Details">
          <MyTeamLeaveDetails />
        </Tab>
      </Tabs>
    </div>
  );
}

export default ManagerLeaveDetailsReport;
