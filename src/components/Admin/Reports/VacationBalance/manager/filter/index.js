import React from "react";
import ManagerTabs from "../tabs";

const Header = ({
  isOverTimeTableLoading,
  overTimeTableDownloadRequest,
  handleSearchReport,
  filters,
  setFilters,
  handleFilterChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  userRolesDetails,
  emp,
  handlePrint,
  allLeavesTypes,
}) => {
  return (
    <ManagerTabs
      handleSearchReport={handleSearchReport}
      isOverTimeTableLoading={isOverTimeTableLoading}
      filters={filters}
      setFilters={setFilters}
      handleFilterChange={handleFilterChange}
      emp={emp}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      overTimeTableDownloadRequest={overTimeTableDownloadRequest}
      handlePrint={handlePrint}
      allLeavesTypes={allLeavesTypes}
    />
  );
};

export default Header;
