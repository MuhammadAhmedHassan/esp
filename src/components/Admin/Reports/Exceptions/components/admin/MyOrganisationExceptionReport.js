import React, {
  useRef, useState, useEffect, forwardRef, useImperativeHandle,
} from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import AdminHirarchyFilters from './AdminHirarchyFilters';
import DownloadExcelAndPdfBtns from '../DownloadExcelAndPdfBtns';
import { userService } from '../../../../../../services/user.service';
import { commonService } from '../../../../../../services/common.service';

const { getUser, getFirstLastAndCurrentDateOfTheMonth } = userService;

const MyOrganisationExceptionReport = forwardRef(({
  loading, allExceptions,
  getExceptionReport,
  onDownloadFile,
  onResetBtnClick,
}, ref) => {
  const { t } = useTranslation();
  const adminHirarchyRef = useRef();
  const { firstDateOfMonth, currentDateOfMonth } = getFirstLastAndCurrentDateOfTheMonth();

  const defaultFilterValues = exceptionType => ({
    startDate: firstDateOfMonth,
    endDate: currentDateOfMonth,
    exceptionType: exceptionType || '0',
  });
  
  // const [areAdminFiltersSet, setAreAdminFiltersSet] = useState(false);
  const [adminHirarchyFields, setAdminHirarchyFields] = useState({});
  const [selectedEmployeeName, setSelectedEmployeeName] = useState('');
  const [endDateBeforeStartDateError, setEndDateBeforeStartDateError] = useState('');
  const [filters, setFilters] = useState({ ...defaultFilterValues() });
  const [dropdownOptions, setDropdownOptions] = useState({
    exceptionType: [{ id: '0', name: t('Report.HoursWorked.ExceptionReport.ExceptionType.All') }],
  });

  useEffect(() => {
    setDropdownOptions({ ...dropdownOptions, exceptionType: allExceptions });
  }, [allExceptions]);

  const checkAreAllAdminHirarchFieldsSet = (
    newAdminFilters, isEveryFieldSet, adminSelectedEmployeeName,
  ) => {
    setAdminHirarchyFields(newAdminFilters);
    // setAreAdminFiltersSet(isEveryFieldSet);
    setSelectedEmployeeName(adminSelectedEmployeeName);
  };
  
  const resetFilters = () => {
    if (adminHirarchyRef.current && adminHirarchyRef.current.resetAdminFilters) {
      adminHirarchyRef.current.resetAdminFilters();
    }
    // setAreAdminFiltersSet(false);
    setAdminHirarchyFields({});
    setSelectedEmployeeName('');
    setFilters({ ...defaultFilterValues() });
    setEndDateBeforeStartDateError('');
    // Don't reset table data as per the instructions
    // if (onResetBtnClick) onResetBtnClick();
  };

  useImperativeHandle(ref, () => ({
    reset() {
      resetFilters();
    },
  }));
  
  const handleDateChange = (selectedDate, fieldName) => {
    const startDate = fieldName === 'startDate' ? selectedDate : filters.startDate;
    const endDate = fieldName === 'endDate' ? selectedDate : filters.endDate;
    let endDateError = '';
    if (moment(endDate).isBefore(startDate)) {
      endDateError = t('Report.HoursWorked.endDateError');
    }
    setEndDateBeforeStartDateError(endDateError);
    filters[fieldName] = selectedDate;
    setFilters({ ...filters });
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    filters[name] = value;
    setFilters({ ...filters });
  };
  

  const requestBody = () => {
    const userRoleIds = getUser().role.map(rle => rle.id).join(',');
    const adminFields = { ...adminHirarchyFields };
    Object.keys(adminFields).forEach((key) => {
      adminFields[key] = parseInt(adminFields[key], 10);
    });
    
    return {
      languageId: 1,
      pageIndex: 1,
      pageSize: 23412512,
      divisionId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      managerId: 0,
      ...adminFields,
      userId: parseInt(adminFields.employeesId || 0, 10),
      userRoleIds,
      startDate: filters.startDate,
      endDate: filters.endDate,
      exceptionType: parseInt(filters.exceptionType, 10),
    };
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    if (adminHirarchyRef.current && adminHirarchyRef.current.setErrorsOfMandatoryFields) {
      const { hasErrors } = adminHirarchyRef.current.setErrorsOfMandatoryFields();
      if (!hasErrors) {
        getExceptionReport(requestBody(), selectedEmployeeName);
      }
    }
  };

  const handleDownloadFile = (isExcelFile) => {
    if (adminHirarchyRef.current && adminHirarchyRef.current.setErrorsOfMandatoryFields) {
      const { hasErrors } = adminHirarchyRef.current.setErrorsOfMandatoryFields();
      if (!hasErrors) {
        onDownloadFile(isExcelFile, requestBody(), selectedEmployeeName);
      }
    }
  };
  
  // const shouldBtnsBeDisabled = (loading || selectedEmployeeName.length === 0
  //   || endDateBeforeStartDateError.length > 0);

  return (
    <div>
      <DownloadExcelAndPdfBtns
        onDownloadBtnClick={handleDownloadFile}
        disabled={loading}
      />
      <Form onSubmit={handleSubmit}>
        <div className="row">
          <AdminHirarchyFilters
            ref={adminHirarchyRef}
            checkAreAllFieldsSet={checkAreAllAdminHirarchFieldsSet}
          />
          <Form.Group className="col-lg-3 col-md-6">
            <Form.Label>{t('Report.HoursWorked.StartDate')}</Form.Label>
            <DatePicker
              autoComplete="off"
              // className="form-control rounded-lg bg-transparent"
              className="form-control"
              value={filters.startDate}
              selected={filters.startDate}
              name="startDate"
              onChange={selectedDate => handleDateChange(selectedDate, 'startDate')}
              // placeholderText="MM/DD/YYYY"
              // dateFormat="MM/dd/yyyy"
              placeholderText={commonService.localizedDateFormat()}
              dateFormat={commonService.localizedDateFormatForPicker()}
              pattern="\d{2}\/\d{2}/\d{4}"
              required
            />
          </Form.Group>
          <Form.Group className="col-lg-3 col-md-6">
            <Form.Label>{t('Report.HoursWorked.EndDate')}</Form.Label>
            <DatePicker
              autoComplete="off"
              // className="form-control rounded-lg bg-transparent"
              className="form-control"
              value={filters.endDate}
              selected={filters.endDate}
              name="endDate"
              onChange={selectedDate => handleDateChange(selectedDate, 'endDate')}
              // placeholderText="MM/DD/YYYY"
              // dateFormat="MM/dd/yyyy"
              placeholderText={commonService.localizedDateFormat()}
              dateFormat={commonService.localizedDateFormatForPicker()}
              pattern="\d{2}\/\d{2}/\d{4}"
              required
            />
            {endDateBeforeStartDateError.length > 0
              && <div className="text-danger font-sm">{endDateBeforeStartDateError}</div>}
          </Form.Group>

          <Form.Group
            className="col-lg-3 col-md-6"
          >
            <Form.Label>{t('Report.HoursWorked.ExceptionReport.ExceptionType')}</Form.Label>
            <Form.Control name="exceptionType" value={filters.exceptionType} as="select" onChange={handleChange}>
              {dropdownOptions.exceptionType.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>
        <div className="d-flex align-items-center justify-content-end">
          <Button
            className="inline-block"
            onClick={resetFilters}
            disabled={loading}
          >
            {t('Report.HoursWorked.ResetFilters')}
          </Button>
          <Button
            type="submit"
            className="inline-block"
            disabled={loading}
          >
            {loading ? `${t('Report.HoursWorked.Searching')}...` : t('Report.HoursWorked.Search')}
          </Button>
        </div>
      </Form>
    </div>
  );
});

export default MyOrganisationExceptionReport;
