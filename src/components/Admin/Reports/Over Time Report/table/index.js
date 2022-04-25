import React from "react";
import Table from "react-bootstrap/Table";
import PaginationAndPageNumber from "../../../../shared/Pagination";
import "./style.scss";

const OverTimeTable = ({
  updatePageNum,
  updatePageCount,
  pagination,
  overTimeData,
  isManager,
}) => {
  const { totalRecords, pageSize, pageIndex } = pagination;
  const header = [
    "Date",
    "Over Time",
    "Status",
  ];

  return (
    <>
      <div className="timesheet timesheet-content">
        <div className="d-flex flex-row-reverse approve">
        </div>
        <Table responsive="xl" className="main-table-wrapper">
          <thead>
            <tr>
              {isManager && (<th>Employee Name</th>)}
              {header.map((val, index) => (
                <th key={index}>{val}</th>
              ))}
            </tr>
          </thead>
          <tbody>
          {/* overTimeData */}
            {overTimeData && overTimeData.data && overTimeData.data.map(
              (data) => {
                return (
                  <tr key={data && data.sequenceId}>
                    {isManager && (<td>
                      <span>{data && data.userName && data.userName}</span>
                    </td>)}
                    <td>
                      <span>{data && data.overTimeDate && data.overTimeDate}</span>
                    </td>
                    <td>
                      <span>{data && data.overTimeValue && data.overTimeValue}</span>{" "}
                    </td>
                    <td>
                      <span>{data && data.overTimeStatus && data.overTimeStatus}</span>
                    </td>
                    <td className="d-flex justify-content-around">
                      <div>
                        
                      </div>
                      <div>
                        
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </Table>
      </div>
      <div >
        <PaginationAndPageNumber
          totalPageCount={Math.ceil(totalRecords / pageSize)}
          totalElementCount={totalRecords}
          updatePageNum={updatePageNum}
          updatePageCount={updatePageCount}
          currentPageNum={pageIndex}
          recordPerPage={pageSize}
        />
      </div>
    </>
  );
};

export default OverTimeTable;
