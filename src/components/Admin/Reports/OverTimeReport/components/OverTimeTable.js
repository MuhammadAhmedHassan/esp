import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import PaginationAndPageNumber from '../../../../shared/Pagination';
import { commonService } from '../../../../../services/common.service';

const { localizedDate } = commonService;

const tableHeader = (t) => {
  const headers = [
    { label: t('OverTimeTable.Header.SrNo') },
    { label: t('OverTimeTable.Header.EmployeeName') },
    { label: t('OverTimeTable.Header.date') },
    { label: t('OverTimeTable.Header.Overtime') },
    { label: t('OverTimeTable.Header.Notes') },
    { label: t('OverTimeTable.Header.Status') },
  ];
  return headers;
};

function OverTimeTable({
  tableData, pagination, getData, hasData,
}) {
  const { t } = useTranslation();

  const updatePageNum = async (pageNumber) => {
    const { pageSize } = pagination;
    // const nextPageFirstItem = ((pageNumber - 1) * pageSize) + 1;
    // await getData(nextPageFirstItem, pageSize, { currentPage: pageNumber });
    await getData(pageNumber, pageSize, { currentPage: pageNumber });
  };
  
  const updatePageCount = (recordsPerPage) => {
    getData(1, Number(recordsPerPage), { pageSize: Number(recordsPerPage), currentPage: 1 });
  };

  return (
    <Row className="mt-3">
      <Col>
        <Table responsive striped bordered className="text-no-wrap">
          <thead>
            <tr>
              {tableHeader(t).map(headerData => (
                <th key={headerData.label} className="text-left">{headerData.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!hasData && <tr><td colSpan={7} className="text-center">{t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.NoRecordFound')}</td></tr>}
            {tableData.length > 0 && (
              tableData.map((data, idx) => {
                const {
                // userId,
                  userName,
                  overtime,
                  message,
                  overTimeStatus,
                  createdOnUtc,
                // id,
                } = data;
                // const srNo = pagination.pageIndex + idx;
                const { pageIndex, pageSize } = pagination;
                const srNo = pageSize * (pageIndex - 1) + idx + 1;
                const textColor = `${overTimeStatus}`.toLowerCase() === 'approved' ? '#1BCD8D' : '#00C2F0';
                return (
                  <tr key={srNo}>
                    <td>{srNo}</td>
                    <td>{userName}</td>
                    <td>{localizedDate(createdOnUtc)}</td>
                    <td>{overtime}</td>
                    <td>{message}</td>
                    <td style={{ color: textColor }}>{overTimeStatus}</td>
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

export default OverTimeTable;
