import React from "react";
import EmployeeHeader from "./filter";
import Table from "../table";

const EmployeeTable = ({
  filters,
  setFilters,
  handleSearchReport,
  isHoursTableLoading,
  handleFilterChange,
  filterdates,
  hoursWorkedData,
  combineByshiftLabel,
  combineByWeekData,
  emp,
  combineForWeekWise,
  uniqueDateByWeekData,
}) => {
  return (
    <>
      <EmployeeHeader
        handleSearchReport={handleSearchReport}
        filters={filters}
        setFilters={setFilters}
        handleFilterChange={handleFilterChange}
        filterdates={filterdates}
        hoursWorkedData={hoursWorkedData}
        combineByshiftLabel={combineByshiftLabel}
        combineByWeekData={combineByWeekData}
        emp={emp}
      />
      <Table
        hoursWorkedData={hoursWorkedData}
        combineByshiftLabel={combineByshiftLabel}
        combineByWeekData={combineByWeekData}
        isHoursTableLoading={isHoursTableLoading}
        combineForWeekWise={combineForWeekWise}
        uniqueDateByWeekData={uniqueDateByWeekData}
      />
    </>
  );
};

export default EmployeeTable;
