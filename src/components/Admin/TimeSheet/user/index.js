import React from 'react';
import Filters from './filter';
import { ReactComponent as DownloadIcon } from '../../../../Images/Icons/downloadIcon.svg';
import './style.scss';

const UserDetails = ({
  isUser = false,
  filterdates,
  handleSearchTimeSheet,
  handleFilterChange,
  filtersList,
  handleDownloadTimeSheet,
  clearFilterChange,
  filters,
}) => (
  <div className="date-wrapper align-items-end flex-wrap">
    <div className="content-wrapper">
      <div className="d-flex justify-content-end">
        <div title="Download Excel" className="action-btn mx-1">
          <DownloadIcon className="pointer" onClick={() => handleDownloadTimeSheet('')} />
        </div>
      </div>

      <Filters
        isUser={isUser}
        handleFilterChange={handleFilterChange}
        filterdates={filterdates}
        filtersList={filtersList}
        filters={filters}
        handleSearchTimeSheet={handleSearchTimeSheet}
        clearFilterChange={clearFilterChange}
      />
    </div>
  </div>
);

export default UserDetails;
