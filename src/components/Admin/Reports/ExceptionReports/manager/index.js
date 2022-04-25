import React, { useRef } from "react";
import Header from "./filter";
import Table from "../table";
import { useReactToPrint } from "react-to-print";

const ManagerExceptionTable = ({
  filters,
  setFilters,
  handleSearchReport,
  isHoursTableLoading,
  handleFilterChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  hoursWorkedData,
  combineByshiftLabel,
  combineByWeekData,
  emp,
  hoursTableDownloadRequest,
  combineForWeekWise,
  uniqueDateByWeekData,
  sameDateAddition,
  allExceptionData,
  multipleShiftRequest,
}) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Header
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
      <div ref={componentRef}>
        <Table
          hoursWorkedData={hoursWorkedData}
          combineByshiftLabel={combineByshiftLabel}
          combineByWeekData={combineByWeekData}
          isHoursTableLoading={isHoursTableLoading}
          combineForWeekWise={combineForWeekWise}
          uniqueDateByWeekData={uniqueDateByWeekData}
          sameDateAddition={sameDateAddition}
          multipleShiftRequest={multipleShiftRequest}
        />
      </div>
    </>
  );
};

export default ManagerExceptionTable;
