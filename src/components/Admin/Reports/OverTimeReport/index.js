import React, { useEffect, useState } from 'react';
import { userService } from '../../../../services/user.service';
import { sendApiRequest } from '../../../common/serviceCall/PostApiCall';
import Api from '../../../common/Api';
import AdminOverTimeIndex from './components/Admin';
import ManagerOverTimeIndex from './components/Manager';
import EmployeeOverTimeIndex from './components/Employee';

const {
  isAdmin, isEmployee, isManager, getUserId,
} = userService;

function OverTimeReport() {
  const defaultPaginationObj = {
    currentPage: 1,
    pageIndex: 1,
    pageSize: 10,
    totalRecords: 0,
  };
  const defaultRequestBodyForAllUsers = (pageIndex = 1, pageSize = 10) => {
    const date = new Date(); const year = date.getFullYear(); const
      month = date.getMonth();
    const firstDateOfMonth = new Date(year, month, 1);
    const currentDateOfMonth = new Date(year, month, date.getDate());
    return {
      id: 0,
      languageId: 1,
      pageIndex,
      pageSize,
      userId: parseInt(getUserId(), 10),
      startDate: firstDateOfMonth,
      endDate: currentDateOfMonth,
      overTimeStatusId: 0,
    };
  };
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [hasData, setHasData] = useState(true);
  const [pagination, setPagination] = useState({ ...defaultPaginationObj });

  const resetFields = () => {
    setHasData(true);
    setLoading(false);
    // setTableData([]);
    if (tableData.length > 0) setPagination({ ...pagination });
    else setPagination({ ...defaultPaginationObj });
  };

  const getSearchOvertimeReport = async (pageIndex = 1, pageSize = 10,
    paginationFields = {}, requestBody = defaultRequestBodyForAllUsers) => {
    try {
      setLoading(true);
      const body = requestBody(pageIndex, pageSize);
      const response = await sendApiRequest(Api.overTime.searchOvertimeReport, 'POST', body);

      if (response.statusCode === 200) {
        setHasData(response.data && !!response.data.length);
        setTableData(response.data);
        setPagination({
          ...pagination,
          totalRecords: response.totalRecords,
          pageIndex: response.pageIndex,
          ...paginationFields,
        });
      } else if (response.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          getSearchOvertimeReport(pageIndex, pageSize, paginationFields);
        });
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const onDownloadFile = async (isDownloadBtnClick, paginationObj, requestBody) => {
    const { pageIndex, pageSize } = paginationObj;
    const body = requestBody(pageIndex, pageSize);

    const apiUrl = isDownloadBtnClick
      ? Api.overTime.downloadOvertimeReportExcel
      : Api.overTime.downloadOvertimeReportExcel;

    try {
      setLoading(true);
      const isBlob = true;
      const blob = await sendApiRequest(apiUrl, 'POST', body, isBlob);

      if (blob.type === undefined || blob.type === 'application/json') {
        console.error('Error downloading file');
      } else {
        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `overTimeReport.${isDownloadBtnClick ? 'xlsx' : 'pdf'}`); // 3. Append to html page
        document.body.appendChild(link); // 4. Force download
        link.click(); // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  
  return (
    <div className="container-fluid">
      <div className="card_layout">
        {isAdmin() && (
        <AdminOverTimeIndex
          onDownloadFile={onDownloadFile}
          resetFields={resetFields}
          loading={loading}
          tableData={tableData}
          pagination={pagination}
          getSearchOvertimeReport={getSearchOvertimeReport}
          hasData={hasData}
        />
        )}
        {isManager() && (
        <ManagerOverTimeIndex
          onDownloadFile={onDownloadFile}
          resetFields={resetFields}
          loading={loading}
          tableData={tableData}
          pagination={pagination}
          getSearchOvertimeReport={getSearchOvertimeReport}
          hasData={hasData}
        />
        )}
        {isEmployee() && (
        <EmployeeOverTimeIndex
          onDownloadFile={onDownloadFile}
          resetParentFields={resetFields}
          loading={loading}
          tableData={tableData}
          pagination={pagination}
          getSearchOvertimeReport={getSearchOvertimeReport}
          hasData={hasData}
        />
        )}
      </div>
    </div>
  );
}

export default OverTimeReport;
