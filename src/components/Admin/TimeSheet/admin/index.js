import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Filters from './filter';
import './style.scss';
import { ReactComponent as DownloadIcon } from '../../../../Images/Icons/downloadIcon.svg';
import FiltersUser from '../user/filter';

const AdminDetails = ({
  filtersList,
  handleFilterChange,
  filterdates,
  handleSearchAdminTeamTimeSheet,
  managerKey,
  setManagerKey,
  handleDownloadTimeSheet,
  clearFilterAdminTeamStatus,
  clearAdminTeamFilterChange,
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
          filters={filters}
          filtersList={filtersList}
          handleFilterChange={handleFilterChange}
          filterdates={filterdates}
          handleSearchAdminTeamTimeSheet={handleSearchAdminTeamTimeSheet}
          clearAdminTeamFilterChange={clearAdminTeamFilterChange}
          clearFilterAdminTeamStatus={clearFilterAdminTeamStatus}
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

export default AdminDetails;
