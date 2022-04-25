import React from 'react';
import { useTranslation } from 'react-i18next';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import '../style.scss';

const ChangeTimeTabs = ({
  tabkey,
  handleKeyChange,
}) => {
  // eslint-disable-next-line no-unused-vars
  const { t } = useTranslation();
  return (
    <Tabs
      id="controlled-tab"
      activeKey={tabkey}
      onSelect={k => handleKeyChange(k)}
    >      
      <Tab
        eventKey="myTimeSheet"
        title="My Request"
        tabClassName="select-tab"
      />
      <Tab eventKey="myTeam" title="My Team Request" tabClassName="select-tab" />
    </Tabs>
  );
};

export default ChangeTimeTabs;
