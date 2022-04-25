/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import moment from 'moment';
import Api from '../../../../../common/Api';
import printIcon from '../../../../../../Images/Icons/print.svg';
import downloadIcon from '../../../../../../Images/Icons/downloadIcon.svg';
import { sendApiRequest } from '../../../../../common/serviceCall/PostApiCall';
import { userService } from '../../../../../../services/user.service';
import AppliedLeavesTable from '../AppliedLeavesTable';

const { getUser, getUserId } = userService;

function MyLeaveDetails() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageIndex: 1,
    pageSize: 10,
    totalRecords: 0,
  });
  const [filters, setFilters] = useState({
    year: '',
    leaveType: '',
  });
  const [dropdownOpts, setDropdownOpts] = useState({
    years: [{ id: '', name: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.SelectYear') }],
    leaveType: [{ id: '', name: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.SelectLeaveType') }],
  });
  const [tableData, setTableData] = useState([]);

  const getFiltersData = async () => {
    try {
      const [allYearsRes, parentLeaveTypeRes] = await Promise.all([
        sendApiRequest(Api.vacationManagement.getAllyears, 'POST', { languageId: 1 }),
        sendApiRequest(Api.vacationManagement.getParentLeaveType, 'POST', { languageId: 1 }),
      ]);

      const dropdownOptsObj = {};
      if (allYearsRes.statusCode === 200) {
        dropdownOptsObj.years = [{ id: '', name: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.SelectYear') }].concat(allYearsRes.data.map(year => ({ id: year.id, name: year.year })));
      } else if (allYearsRes.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          getFiltersData();
        });
      }
      if (parentLeaveTypeRes.statusCode === 200) {
        dropdownOptsObj.leaveType = [
          { id: '', name: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.SelectLeaveType') },
          { id: '0', name: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.all') },
        ].concat(parentLeaveTypeRes.data);
      } else if (parentLeaveTypeRes.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          getFiltersData();
        });
      }
      setDropdownOpts({ ...dropdownOpts, ...dropdownOptsObj });
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    getFiltersData();
  }, []);

  const requestBody = (pageIndex = 1, pageSize = 10) => {
    const userRoleIds = getUser().role.map(rle => rle.id).join(',');
    const selectedYear = parseInt(dropdownOpts.years.find(year => Number(year.id) === Number(filters.year)).name, 10);
    const startDate = moment({ year: selectedYear }).startOf('year');
    const endDate = moment({ year: selectedYear }).endOf('year');
    return {
      id: 0,
      languageId: 1,
      userRoleIds,
      pageIndex,
      pageSize,
      userId: parseInt(getUserId(), 10),
      leaveCategoryId: parseInt(filters.leaveType, 10),
      year: selectedYear,
      startDate,
      endDate,
    };
  };

  const getSearchLeaveBalanceReport = async (pageIndex = 1, pageSize = 10,
    paginationFields = {}) => {
    try {
      setLoading(true);
      const body = requestBody(pageIndex, pageSize);
      const response = await sendApiRequest(Api.vacationManagement.searchLeaveBalanceReport, 'POST', body);

      if (response.statusCode === 200) {
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
          getSearchLeaveBalanceReport(pageIndex, pageSize, paginationFields);
        });
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const allFiltersFilled = () => Object.values(filters).every(filter => !!filter);

  const handleSubmit = (event) => {
    event.preventDefault();
    getSearchLeaveBalanceReport();
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    filters[name] = value;
    setFilters({ ...filters });
  };

  const onDownloadFile = async (isDownloadBtnClick) => {
    const { pageIndex, pageSize } = pagination;
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
  
  return (
    <div>
      <Form className="mb-4" onSubmit={handleSubmit}>
        <div className="d-flex align-items-center justify-content-end">
          <button type="button" className="no-style-btn" onClick={() => onDownloadFile(false)} disabled={loading || !allFiltersFilled()}>
            <img src={printIcon} alt="print" />
          </button>
          <button type="button" className="no-style-btn ml-4" onClick={() => onDownloadFile(true)} disabled={loading || !allFiltersFilled()}>
            <img src={downloadIcon} alt="download" />
          </button>
        </div>
        
        <div className="row">
          <Form.Group className="col-lg-3 col-md-6">
            <Form.Label>{t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.Year')}</Form.Label>
            <Form.Control name="year" value={filters.year} as="select" onChange={handleChange}>
              {dropdownOpts.years.map(opt => (<option key={opt.id} value={opt.id}>{opt.name}</option>))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="col-lg-3 col-md-6">
            <Form.Label>{t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.LeaveType')}</Form.Label>
            <Form.Control name="leaveType" value={filters.leaveType} as="select" onChange={handleChange}>
              {dropdownOpts.leaveType.map(opt => (<option key={opt.id} value={opt.id}>{opt.name}</option>))}
            </Form.Control>
          </Form.Group>

        </div>
        <div className="d-flex align-items-center justify-content-end">
          <Button
            type="submit"
            className="inline-block"
            disabled={loading || !allFiltersFilled()}
          >
            {t(`LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.${loading ? 'Searching' : 'Search'}`)}
          </Button>
        </div>
      </Form>

      <AppliedLeavesTable
        tableData={tableData}
        pagination={pagination}
        getData={getSearchLeaveBalanceReport}
      />
    </div>
  );
}

export default MyLeaveDetails;
