import React from "react";
import Table from "react-bootstrap/Table";
import PaginationAndPageNumber from "../../../../shared/Pagination";
import "./style.scss";
import {ReactComponent as EditDetail} from "../../../../../Images/Icons/eye_2.svg";
import Loaders from "../../../../shared/Loaders";

const VacationTable = ({
  updatePageNum,
  updatePageCount,
  pagination,
  overTimeData,
  isManager,
  leaveBalanceReport,
  isLeaveBalanceLoading,
}) => {
  const { totalRecords, pageSize, pageIndex } = pagination;
  const [ toggle, setToggle ] = React.useState(false);
  
  const header = [
    "Leave Type ",
    "Granted",
    "Consumed",
    "Balance",
    "Action"
  ];

const handleOpenBox=(e,data)=>{
  console.log(data,"data")
  setToggle(true)
}

  return (
    <>
      <div className="timesheet timesheet-content">
        <div className="d-flex flex-row-reverse approve">
        </div>
        {isLeaveBalanceLoading ? (
        <Loaders />
      ) : ( 
        <Table responsive="xl" className="main-table-wrapper">
          <thead>
            <tr>
              {header.map((val, index) => (
                <th key={index}>{val}</th>
              ))}
            </tr>
          </thead>
          <tbody>
          {/* balance vacations */}
            {leaveBalanceReport && leaveBalanceReport.data && leaveBalanceReport.data.map(
              (data) => {
                return (
                  <tr>
                    <td>
                      <span>{data && data.leaveCategory && data.leaveCategory}</span>
                    </td>
                    <td>
                      <span>{data && data.leavesGranted && data.leavesGranted}</span>{" "}
                    </td>
                    <td>
                      <span>{data && data.leavesConsumed && data.leavesConsumed}</span>
                    </td>
                    <td>
                      <span>{data && data.availableBalance && data.availableBalance}</span>
                    </td>
                    
                    <td className="text-center">
                     <EditDetail onClick={(e)=>handleOpenBox(e,data)}/>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </Table>
      )}
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

export default VacationTable;
