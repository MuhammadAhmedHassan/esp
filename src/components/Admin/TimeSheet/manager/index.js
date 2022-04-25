import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Filters from './filter';
import './style.scss';
import { ReactComponent as DownloadIcon } from '../../../../Images/Icons/downloadIcon.svg';
import FiltersUser from '../user/filter';

const ManagerDetails = ({
  isManager = true,
  filtersList,
  handleFilterChange,
  filterdates,
  handleSearchManagerTeamTimeSheet,
  managerKey,
  setManagerKey,
  handleDownloadTimeSheet,
  clearFilterManagerTeamStatus,
  clearManagerTeamFilterChange,
  filters,
  handleSearchTimeSheet,
  clearFilterChange,
}) => (
  <div className="manager">
    <div className="d-flex justify-content-end">
      <div title="Download Excel" className="action-btn mx-1">
        <DownloadIcon className="pointer" onClick={() => handleDownloadTimeSheet(managerKey)} />
      </div>
    </div>
    <Tabs
      id="controlled-tab"
      activeKey={managerKey}
      onSelect={k => setManagerKey(k)}
    >
      <Tab eventKey="myteam" title="My Team" tabClassName="select-tab">
        <Filters
          isManager={isManager}
          filters={filters}
          filtersList={filtersList}
          handleFilterChange={handleFilterChange}
          filterdates={filterdates}
          handleSearchManagerTeamTimeSheet={handleSearchManagerTeamTimeSheet}
          clearManagerTeamFilterChange={clearManagerTeamFilterChange}
          clearFilterManagerTeamStatus={clearFilterManagerTeamStatus}
        />
      </Tab>
      <Tab
        eventKey="mytimesheet"
        title="My Timesheet"
        tabClassName="select-tab"
      >
        <FiltersUser
          handleFilterChange={handleFilterChange}
          filterdates={filterdates}
          filtersList={filtersList}
          filters={filters}
          handleSearchTimeSheet={handleSearchTimeSheet}
          clearFilterChange={clearFilterChange}
        />
      </Tab>
    </Tabs>
  </div>
);

export default ManagerDetails;
