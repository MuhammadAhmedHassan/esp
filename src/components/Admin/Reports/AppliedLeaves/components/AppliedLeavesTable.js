import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import PaginationAndPageNumber from '../../../../shared/Pagination';
import eyeIcon from '../../../../../Images/Icons/Eye.svg';


const tableHeader = (t, isEmployee) => {
  const headers = [
    { label: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.SrNo') },
    { label: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.Employee Name') },
    { label: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.LeaveType') },
    { label: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.Granted') },
    { label: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.Consumed') },
    { label: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.Balance') },
    { label: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.Actions') },
  ];

  if (isEmployee) {
    headers.splice(1, 1); // delete Employee name header
    headers.splice(5, 1); // delete Actions header
  }
  return headers;
};

function AppliedLeavesTable({
  tableData, pagination, getData, isEmployee, sendUserToVacationDetailsPage, hasData,
}) {
  const { t } = useTranslation();

  const updatePageNum = async (pageNumber) => {
    const { pageSize } = pagination;
    const nextPageFirstItem = ((pageNumber - 1) * pageSize) + 1;
    await getData(nextPageFirstItem, pageSize, { currentPage: pageNumber });
  };
  const updatePageCount = (recordsPerPage) => {
    getData(1, Number(recordsPerPage), { pageSize: Number(recordsPerPage), currentPage: 1 });
  };

  // if (!hasData) return <div>{t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.NoRecordFound')}</div>;
  
  return (
    <Row className="mt-3">
      <Col>
        <Table responsive striped bordered className="text-no-wrap">
          <thead>
            <tr>
              {tableHeader(t, isEmployee).map(headerData => (
                <th key={headerData.label} className="text-left">{headerData.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!hasData && <tr><td colSpan={7} className="text-center">{t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.NoRecordFound')}</td></tr>}
            {tableData.length > 0 && (
              tableData.map((data, idx) => {
                const {
                  userName,
                  userId,
                  leaveCategoryId,
                  leaveCategory,
                  leavesGranted,
                  leavesConsumed,
                  availableBalance,
                } = data;
                const srNo = pagination.pageIndex + idx;
                return (
                  <tr key={srNo}>
                    <td>{srNo}</td>
                    {!isEmployee && (<td>{userName}</td>)}
                    <td>{leaveCategory}</td>
                    <td>{leavesGranted}</td>
                    <td>{leavesConsumed}</td>
                    <td>{availableBalance}</td>
                    {!isEmployee && (
                    <td className="text-center">
                      <button type="button" className="no-style-btn" onClick={() => sendUserToVacationDetailsPage(leaveCategoryId, userId)}>
                        <img src={eyeIcon} alt="eye icon" />
                      </button>
                    </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
                      
        <div className="mt-3">
          <PaginationAndPageNumber
            totalPageCount={Math.ceil(pagination.totalRecords / pagination.pageSize)}
            totalElementCount={pagination.totalRecords}
            updatePageNum={updatePageNum}
            updatePageCount={updatePageCount}
            currentPageNum={pagination.currentPage}
            recordPerPage={pagination.pageSize}
          />
        </div>
      </Col>
    </Row>
  );
}

export default AppliedLeavesTable;
