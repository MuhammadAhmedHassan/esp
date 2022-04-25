import React, {useRef} from "react";
import EmployeeHeader from "./filter";
import OverTimeTable from "../table";
import { useReactToPrint } from 'react-to-print';
import { ReactComponent as PrintIcon } from     "../../../../../Images/Icons/print.svg";
import {ReactComponent as DownloadsIcon} from   "../../../../../Images/Icons/downloadIcon.svg";

const EmployeeTable = ({
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
    <div className="d-flex flex-column tab-container justify-content-between">
      <div className="d-flex justify-content-end actionbtn">
        <div className="action-btn-primary mx-2">
          <DownloadsIcon
            style={{ cursor: "pointer" }}
            onClick={overTimeTableDownloadRequest}
          />
        </div>
        <div className="action-btn-secondary">
          <PrintIcon style={{ cursor: "pointer" }} onClick={handlePrint} />
        </div>
      </div>
      <EmployeeHeader
        handleSearchReport={handleSearchReport}
        isOverTimeTableLoading={isOverTimeTableLoading}
        overTimeTableDownloadRequest={overTimeTableDownloadRequest}
        filters={filters}
        setFilters={setFilters}
        handleFilterChange={handleFilterChange}
        emp={emp}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
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
    </div>
  );
};

export default EmployeeTable;
