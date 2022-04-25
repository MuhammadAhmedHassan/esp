/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Api from '../../../../../common/Api';
import DownloadExcelAndPdfBtns from '../DownloadExcelAndPdfBtns';
import { sendApiRequest } from '../../../../../common/serviceCall/PostApiCall';
import { userService } from '../../../../../../services/user.service';
import AppliedLeavesTable from '../AppliedLeavesTable';
import CustomSelectField from '../CustomSelectField';
import { commonService } from '../../../../../../services/common.service';

const { getUser, getUserId, getFirstLastAndCurrentDateOfTheMonth } = userService;

// Validation Schema
const validationSchema = t => Yup.object({
  startDate: Yup.date().required(t('Report.ThisFieldIsRequired')),
  endDate: Yup.date().required(t('Report.ThisFieldIsRequired')).min(
    Yup.ref('startDate'), t('ShiftTemplatePage.EndDate_errorText'),
  ),
  leaveType: Yup.string().required(t('Report.ThisFieldIsRequired')),
});

function EmployeeLeaveDetailsReport({
  loading, tableData, onDownloadFile, getSearchLeaveBalanceReport, pagination,
  sendUserToVacationDetailsPage, hasData, resetStates,
}) {
  const { t } = useTranslation();
  const { firstDateOfMonth, currentDateOfMonth } = getFirstLastAndCurrentDateOfTheMonth();
  const [filters, setFilters] = useState({
    year: '',
    leaveType: '',
  });
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

  const resetFields = () => {
    setFilters({ ...filters, ...defaultFiltersValues() });
    if (resetStates) resetStates();
  };

  const getSelectedYearComplete = () => parseInt(dropdownOpts.years.find(year => Number(year.id) === Number(filters.year)).name, 10);

  const requestBody = (pageIndex = 1, pageSize = 10, values) => {
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
      userId: parseInt(getUserId(), 10),
      leaveCategoryId: parseInt(filters.leaveType || 0, 10),
      year: selectedYear,
      startDate,
      endDate,
    };
  };

  const formik = useFormik({
    initialValues: {
      startDate: firstDateOfMonth,
      endDate: currentDateOfMonth,
      leaveType: '0',
    },
    validationSchema: validationSchema(t),
    async onSubmit(values) {
      console.log('values', values);
      getSearchLeaveBalanceReport(requestBody(pagination.pageIndex, pagination.pageSize, values));
    },
  });

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
  
  useEffect(() => {
    getFiltersData();
  }, []);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    filters[name] = value;
    setFilters({ ...filters });
  };

  useEffect(() => {
    getFiltersData(getUserId());
    // on page load pageIndex will be 1 and page size will be pagination.pageSize or 10 and currentPage will be 1
    const pageIndex = 1;
    const pageSize = pagination.pageSize || 10;
    const paginationFields = { currentPage: 1 };
    getSearchLeaveBalanceReport(pageIndex, pageSize, paginationFields, requestBody);
  }, []);

  
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
          <Form.Group className="col-lg-3 col-md-6">
            <Form.Label>{t('Report.HoursWorked.StartDate')}</Form.Label>
            <DatePicker
              autoComplete="off"
              className="form-control cal_icon"
              value={formik.values.startDate}
              selected={formik.values.startDate}
              name="startDate"
              onChange={selectedDate => formik.setFieldValue('startDate', selectedDate)}
              placeholderText={commonService.localizedDateFormat()}
              dateFormat={commonService.localizedDateFormatForPicker()}
              pattern="\d{2}\/\d{2}/\d{4}"
              required
            />
            <CustomErrorMsg
              touched={formik.touched.startDate}
              error={formik.errors.startDate}
            />
          </Form.Group>
          <Form.Group className="col-lg-3 col-md-6">
            <Form.Label>{t('Report.HoursWorked.EndDate')}</Form.Label>
            <DatePicker
              autoComplete="off"
              className="form-control cal_icon"
              value={formik.values.endDate}
              selected={formik.values.endDate}
              name="endDate"
              onChange={selectedDate => formik.setFieldValue('endDate', selectedDate)}
              placeholderText={commonService.localizedDateFormat()}
              dateFormat={commonService.localizedDateFormatForPicker()}
              pattern="\d{2}\/\d{2}/\d{4}"
              required
            />
            <CustomErrorMsg
              touched={formik.touched.endDate}
              error={formik.errors.endDate}
            />
          </Form.Group>
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

      {!hasData && <div>{t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.NoRecordFound')}</div>}
      <AppliedLeavesTable
        sendUserToVacationDetailsPage={(leaveCategoryId, userId) => sendUserToVacationDetailsPage(leaveCategoryId, userId, getSelectedYearComplete())}
        tableData={tableData}
        pagination={pagination}
        getData={getPaginatedData}
        isEmployee
      />
    </div>
  );
}

export default EmployeeLeaveDetailsReport;

function CustomErrorMsg({ touched, error }) {
  if (touched && error) return (<div className="text-danger font-sm">{error}</div>);
  return <></>;
}
