import React, { useRef } from "react";
import Header from "./filter";
import VacationTable from "../table";
import { useReactToPrint } from 'react-to-print';

const ManagerExceptionTable = ({
  isLeaveBalanceLoading,
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
  overTimeData,
  pagination,
  updatePageNum,
  updatePageCount,
  isManager,
  leaveBalanceReport,
  allLeavesTypes,
}) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <>
      <Header
        isLeaveBalanceLoading={isLeaveBalanceLoading}
        overTimeTableDownloadRequest={overTimeTableDownloadRequest}

        handleSearchReport={handleSearchReport}
        filters={filters}
        setFilters={setFilters}
        handleFilterChange={handleFilterChange}

        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}

        userRolesDetails={userRolesDetails}
        emp={emp}
        handleSearchReport={handleSearchReport}

        handlePrint={handlePrint}
        allLeavesTypes={allLeavesTypes}

      />
      <div ref={componentRef}>
        <VacationTable
        isLeaveBalanceLoading={isLeaveBalanceLoading}
        isManager={isManager}
        pagination={pagination}
        updatePageNum={updatePageNum}
        updatePageCount={updatePageCount}
        overTimeData={overTimeData}
        leaveBalanceReport={leaveBalanceReport}
        />
      </div>
    </>
  );
};

export default ManagerExceptionTable;
