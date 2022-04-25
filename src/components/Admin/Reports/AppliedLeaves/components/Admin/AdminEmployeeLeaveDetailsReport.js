/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { sendApiRequest } from '../../../../../common/serviceCall/PostApiCall';
import Api from '../../../../../common/Api';
import { userService } from '../../../../../../services';
import HirarchicalFiltersForAdmin from './HirarchicalFiltersForAdmin';
import AppliedLeavesTable from '../AppliedLeavesTable';
import DownloadExcelAndPdfBtns from '../DownloadExcelAndPdfBtns';
import CustomSelectField from '../CustomSelectField';

const { getUserId, getUser } = userService;

function AdminEmployeeLeaveDetailsReport({
  loading, tableData, onDownloadFile, getSearchLeaveBalanceReport, pagination,
  sendUserToVacationDetailsPage, resetStates, hasData,
}) {
  const { t } = useTranslation();
  const adminHirarchyRef = useRef();

  const [dropdownOpts, setDropdownOpts] = useState({
    years: [{ id: '', name: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.SelectYear') }],
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
      year: selectedYear,
      leaveType: '0',
    };
  };
  // const [areAdminFiltersSet, setAreAdminFiltersSet] = useState(false);
  const [adminHirarchyFilters, setAdminHirarchyFilters] = useState({});
  const [filters, setFilters] = useState({
    year: '',
    leaveType: '',
  });
  
  const resetFields = () => {
    if (adminHirarchyRef.current && adminHirarchyRef.current.resetAdminFilters) {
      adminHirarchyRef.current.resetAdminFilters();
    }
    setFilters({ ...defaultFiltersValues() });
    setAdminHirarchyFilters({});
    if (resetStates) resetStates();
  };
  
  const checkAreAllAdminFieldsSet = (adminFilters) => {
    setAdminHirarchyFilters(adminFilters);
  };

  const getFiltersData = async () => {
    try {
      const [allYearsRes, parentLeaveTypeRes] = await Promise.all([
        sendApiRequest(Api.vacationManagement.getAllyears, 'POST', { languageId: 1 }),
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
      }
      if (parentLeaveTypeRes.statusCode === 200) {
        filterOptsObj.leaveType = '0';
        // filters.leaveType = '0';
        // setFilters({ ...filters });
        dropdownOptsObj.leaveType = [
          { id: '0', name: t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.all') },
        ].concat(parentLeaveTypeRes.data);
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
    const startDate = moment({ year: selectedYear }).startOf('year');
    const endDate = moment({ year: selectedYear }).endOf('year');

    const allAdminFields = {
      ...adminHirarchyRef.current.getDefaultValuesOfAdminFilters(),
      ...adminHirarchyFilters,
    };
    Object.keys(allAdminFields).forEach((key) => { allAdminFields[key] = parseInt(allAdminFields[key], 10); });
    
    return {
      id: 0,
      languageId: 1,
      userRoleIds,
      pageIndex,
      pageSize,
      // Admin filters
      ...allAdminFields,
      userId: allAdminFields.employeesId,
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

  const shouldBtnsDisabled = (loading);
  
  return (
    <div>
      <DownloadExcelAndPdfBtns
        onDownloadBtnClick={isExcelFile => onDownloadFile(isExcelFile, pagination, requestBody)}
        disabled={shouldBtnsDisabled}
      />
      
      <Form className="mb-4" onSubmit={handleSubmit}>
        <div className="row">
          <HirarchicalFiltersForAdmin
            ref={adminHirarchyRef}
            checkAreAllFieldsSet={checkAreAllAdminFieldsSet}
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
            disabled={loading}
          >
            {t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.ResetFields')}
          </Button>
          <Button
            type="submit"
            className="inline-block"
            disabled={shouldBtnsDisabled}
          >
            {t(`LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.${loading ? 'Searching...' : 'Search'}`)}
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

export default AdminEmployeeLeaveDetailsReport;
