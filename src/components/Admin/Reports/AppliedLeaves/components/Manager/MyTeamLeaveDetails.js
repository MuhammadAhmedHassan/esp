/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import moment from 'moment';
import '../style.scss';
import { sendApiRequest } from '../../../../../common/serviceCall/PostApiCall';
import Api from '../../../../../common/Api';
import { userService } from '../../../../../../services';
import AppliedLeavesTable from '../AppliedLeavesTable';
import DownloadExcelAndPdfBtns from '../DownloadExcelAndPdfBtns';
import CustomSelectField from '../CustomSelectField';

const { getUserId, getUser } = userService;

function MyTeamLeaveDetails({
  loading, tableData, onDownloadFile, getSearchLeaveBalanceReport, pagination,
  sendUserToVacationDetailsPage, hasData, resetStates,
}) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    employeeId: '0',
    year: '',
    leaveType: '0',
  });
  const [dropdownOpts, setDropdownOpts] = useState({
    years: [{ id: '', name: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.SelectYear') }],
    employees: [{ id: '', name: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.SelectEmployee') }],
    leaveType: [{ id: '', name: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.SelectLeaveType') }],
  });

  const defaultFiltersValues = () => {
    const currentYear = new Date().getFullYear();
    const currentYearInRes = dropdownOpts.years.find(year => Number(year.name) === currentYear);
    let selectedYear = '';
    if (currentYearInRes) {
      selectedYear = currentYearInRes.id ? String(currentYearInRes.id) : '';
    }
    return {
      employeeId: '0',
      year: selectedYear,
      leaveType: '0',
    };
  };

  const resetFields = () => {
    setFilters({ ...filters, ...defaultFiltersValues() });
    if (resetStates) resetStates();
  };

  const getFiltersData = async (managerId = 0) => {
    try {
      const [allYearsRes, employeesRes, parentLeaveTypeRes] = await Promise.all([
        sendApiRequest(Api.vacationManagement.getAllyears, 'POST', { languageId: 1 }),
        sendApiRequest(Api.punchLog.getAllEmployees, 'POST', { id: Number(managerId), managerId: Number(managerId), languageId: 1 }),
        sendApiRequest(Api.vacationManagement.getParentLeaveType, 'POST', { languageId: 1 }),
      ]);

      const dropdownOptsObj = {};
      const filterOptsObj = {};
      if (allYearsRes.statusCode === 200) {
        dropdownOptsObj.years = [{ id: '', name: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.SelectYear') }].concat(allYearsRes.data.map(year => ({ id: year.id, name: year.year })));
        const currentYear = new Date().getFullYear();
        const currentYearInRes = allYearsRes.data.find(year => Number(year.year) === currentYear);
        if (currentYearInRes) {
          const selectedYear = currentYearInRes.id ? String(currentYearInRes.id) : '';
          filterOptsObj.year = selectedYear;
        }
      } else if (allYearsRes.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          getFiltersData(managerId);
        });
      }
      if (employeesRes.statusCode === 200) {
        dropdownOptsObj.employees = [{ id: '0', name: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.all') }].concat(employeesRes.data.map(empItem => ({ id: empItem.id, name: `${empItem.firstName} ${empItem.lastName}` })));
      } else if (employeesRes.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          getFiltersData(managerId);
        });
      }
      if (parentLeaveTypeRes.statusCode === 200) {
        filterOptsObj.leaveType = '0';
        // filters.leaveType = '0';
        // setFilters({ ...filters });
        dropdownOptsObj.leaveType = [
          { id: '0', name: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.all') },
        ].concat(parentLeaveTypeRes.data);
      } else if (parentLeaveTypeRes.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          getFiltersData(managerId);
        });
      }
      setFilters({ ...filters, ...filterOptsObj });
      setDropdownOpts({ ...dropdownOpts, ...dropdownOptsObj });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    filters[name] = value;
    setFilters({ ...filters });
  };

  const getSelectedYearComplete = () => parseInt(dropdownOpts.years.find(year => Number(year.id) === Number(filters.year)).name, 10);
  
  const requestBody = (pageIndex = 1, pageSize = 10) => {
    const userRoleIds = getUser().role.map(rle => rle.id).join(',');
    const selectedYear = getSelectedYearComplete() || new Date().getFullYear();
    const startDate = moment({ year: selectedYear, date: 1, month: 1 }).startOf('year');
    const endDate = moment({ year: selectedYear }).endOf('year');
    return {
      id: 0,
      languageId: 1,
      userRoleIds,
      pageIndex,
      pageSize,
      managerId: parseInt(getUserId(), 10),
      userId: parseInt(filters.employeeId || 0, 10),
      leaveCategoryId: parseInt(filters.leaveType || 0, 10),
      year: selectedYear,
      startDate,
      endDate,
    };
  };

  useEffect(() => {
    getFiltersData(getUserId());
    // on page load pageIndex will be 1 and page size will be pagination.pageSize or 10 and currentPage will be 1
    const pageIndex = 1;
    const pageSize = pagination.pageSize || 10;
    const paginationFields = { currentPage: 1 };
    getSearchLeaveBalanceReport(pageIndex, pageSize, paginationFields, requestBody);
  }, []);

  // const allFiltersFilled = () => Object.values(filters).every(filter => !!filter);
  
  const getPaginatedData = (pageIndex, pageSize, paginationFields) => {
    getSearchLeaveBalanceReport(pageIndex, pageSize, paginationFields, requestBody);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const pageIndex = 1;
    const pageSize = pagination.pageSize || 10;
    const paginationFields = { currentPage: 1 };
    getSearchLeaveBalanceReport(pageIndex, pageSize, paginationFields, requestBody);
  };
  
  return (
    <div>
      <Form className="mb-4" onSubmit={handleSubmit}>
        <DownloadExcelAndPdfBtns
          onDownloadBtnClick={isExcelFile => onDownloadFile(isExcelFile, pagination, requestBody)}
          disabled={loading}
        />
        
        <div className="row">
          <CustomSelectField
            label={t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.SelectEmployee')}
            name="employeeId"
            value={filters.employeeId}
            onChange={handleChange}
            options={dropdownOpts.employees}
          />
          <CustomSelectField
            label={t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.Year')}
            name="year"
            value={filters.year}
            onChange={handleChange}
            options={dropdownOpts.years}
            required
          />
          <CustomSelectField
            label={t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.LeaveType')}
            name="leaveType"
            value={filters.leaveType}
            onChange={handleChange}
            options={dropdownOpts.leaveType}
          />

        </div>
        <div className="d-flex align-items-center justify-content-end">
          <Button
            className="inline-block"
            onClick={resetFields}
          >
            {t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.ResetFields')}
          </Button>
          <Button
            type="submit"
            className="inline-block"
            disabled={loading}
          >
            {t(`LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.${loading ? 'Searching' : 'Search'}`)}
          </Button>
        </div>
      </Form>

      {/* {!hasData && <div>{t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.NoRecordFound')}</div>} */}
      <AppliedLeavesTable
        sendUserToVacationDetailsPage={(leaveCategoryId, userId) => sendUserToVacationDetailsPage(leaveCategoryId, userId, getSelectedYearComplete())}
        hasData={hasData}
        tableData={tableData}
        pagination={pagination}
        getData={getPaginatedData}
      />
    </div>
  );
}

export default MyTeamLeaveDetails;
