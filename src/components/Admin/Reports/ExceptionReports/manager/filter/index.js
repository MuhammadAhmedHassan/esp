import React from "react";
import ManagerTabs from "../tabs";

const Header = ({
  filters,
  setFilters,
  handleSearchReport,
  isHoursTableLoading,
  handleFilterChange,
  startDate,
  setStartDate,
  handleDownload,
  endDate,
  emp,
  setEndDate,
  hoursTableDownloadRequest,
  handlePrint,
  allExceptionData,
}) => {
  return (
    <ManagerTabs
      handleSearchReport={handleSearchReport}
      isHoursTableLoading={isHoursTableLoading}
      filters={filters}
      setFilters={setFilters}
      handleFilterChange={handleFilterChange}
      emp={emp}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      hoursTableDownloadRequest={hoursTableDownloadRequest}
      handlePrint={handlePrint}
      allExceptionData={allExceptionData}
    />
  );
};

export default Header;
