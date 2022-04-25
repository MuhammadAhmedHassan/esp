import React from "react";
import Table from "../table";
import Filters from "./filters";
import "./filters/style.scss";

const AdminTable = ({
  handleSearchReport,
  hoursWorkedData,
  handleFilterChange,
  filterdates,
  filtersList,
  combineByWeekData,
  combineByshiftLabel,
  isHoursTableLoading,
  combineForWeekWise,
  uniqueDateByWeekData,
}) => {
  
  return (
    <>
      <div className="admin-container">
        <Filters
          handleFilterChange={handleFilterChange}
          filtersList={filtersList}
          filterdates={filterdates}
          handleSearchTimeSheet={handleSearchReport}
        />
      </div>
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

export default AdminTable;
