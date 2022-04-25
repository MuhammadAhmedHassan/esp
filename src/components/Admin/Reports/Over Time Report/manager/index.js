import React, { useRef } from "react";
import Header from "./filter";
import OverTimeTable from "../table";
import { useReactToPrint } from 'react-to-print';

const ManagerExceptionTable = ({
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
  overTimeData,
  pagination,
  updatePageNum,
  updatePageCount,
  isManager,
}) => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <>
      <Header
        isOverTimeTableLoading={isOverTimeTableLoading}
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

      />
      <div ref={componentRef}>
        <OverTimeTable
        isOverTimeTableLoading={isOverTimeTableLoading}
        isManager={isManager}
        pagination={pagination}
        updatePageNum={updatePageNum}
        updatePageCount={updatePageCount}

        overTimeData={overTimeData}
        />
      </div>
    </>
  );
};

export default ManagerExceptionTable;
