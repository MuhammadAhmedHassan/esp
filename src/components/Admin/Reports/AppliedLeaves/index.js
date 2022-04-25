import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './components/style.scss';
import ManagerMyTeamLeaveDetails from './components/Manager/MyTeamLeaveDetails';
import AdminEmployeeLeaveDetailsReport from './components/Admin/AdminEmployeeLeaveDetailsReport';
import { userService } from '../../../../services/user.service';
import Api from '../../../common/Api';
import { sendApiRequest } from '../../../common/serviceCall/PostApiCall';

const { isAdmin, isManager } = userService;

function AppliedLeaves() {
  const history = useHistory();
  const defaultPaginationObj = {
    currentPage: 1,
    pageIndex: 1,
    pageSize: 10,
    totalRecords: 0,
  };
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [hasData, setHasData] = useState(true);
  const [pagination, setPagination] = useState({ ...defaultPaginationObj });

  const resetStates = () => {
    setHasData(true);
    setLoading(false);
    // setTableData([]);
    if (tableData.length > 0) setPagination({ ...pagination });
    else setPagination({ ...defaultPaginationObj });
  };

  const getSearchLeaveBalanceReport = async (pageIndex = 1, pageSize = 10,
    paginationFields = {}, requestBody) => {
    try {
      setLoading(true);
      const body = requestBody(pageIndex, pageSize);
      const response = await sendApiRequest(Api.vacationManagement.searchLeaveBalanceReport, 'POST', body);

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
          getSearchLeaveBalanceReport(pageIndex, pageSize,
            paginationFields, requestBody);
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
      ? Api.vacationManagement.downloadLeaveBalanceReportExcel
      : Api.vacationManagement.downloadLeaveBalanceReportPdf;

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
        link.setAttribute('download', `appliedLeaves.${isDownloadBtnClick ? 'xlsx' : 'pdf'}`); // 3. Append to html page
        document.body.appendChild(link); // 4. Force download
        link.click(); // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const sendUserToVacationDetailsPage = (leaveCategoryId, userId, selectedYear) => {
    history.push(`/vacation-management/vacation-balance/vacation-details/${leaveCategoryId}`, { userId, year: selectedYear });
  };
  
  return (
    <div className="container-fluid">
      <div className="card_layout">
        {isManager() && (
        <ManagerMyTeamLeaveDetails
          loading={loading}
          tableData={tableData}
          pagination={pagination}
          getSearchLeaveBalanceReport={getSearchLeaveBalanceReport}
          onDownloadFile={onDownloadFile}
          sendUserToVacationDetailsPage={sendUserToVacationDetailsPage}
          resetStates={resetStates}
          hasData={hasData}
        />
        )}
        {isAdmin() && (
        <AdminEmployeeLeaveDetailsReport
          loading={loading}
          tableData={tableData}
          pagination={pagination}
          getSearchLeaveBalanceReport={getSearchLeaveBalanceReport}
          onDownloadFile={onDownloadFile}
          sendUserToVacationDetailsPage={sendUserToVacationDetailsPage}
          resetStates={resetStates}
          hasData={hasData}
        />
        )}
      </div>
    </div>
  );
}

export default AppliedLeaves;
