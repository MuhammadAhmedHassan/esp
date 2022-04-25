/* eslint-disable max-len */
import React, {
  useEffect, useState, forwardRef, useImperativeHandle,
} from 'react';
import { Form, Button } from 'react-bootstrap';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import { userService } from '../../../../../../services/user.service';
import OverTimeTable from '../OverTimeTable';
import DownloadExcelBtn from '../DownloadExcelBtn';
import { commonService } from '../../../../../../services/common.service';

const { getUserId } = userService;

const AdminOverTime = forwardRef(({
  loading, tableData, pagination, getSearchOvertimeReport,
  onDownloadFile, resetParentFields, hasData,
}, ref) => {
  const { t } = useTranslation();
  const date = new Date(); const year = date.getFullYear(); const
    month = date.getMonth();
  const firstDateOfMonth = new Date(year, month, 1);
  // var lastDay = new Date(year, month + 1, 0);
  const currentDateOfMonth = new Date(year, month, date.getDate());
  const defaultFiltersValues = {
    startDate: firstDateOfMonth,
    endDate: currentDateOfMonth,
    status: '0',
  };
  const defaultStatusOptions = [
    { id: '0', name: t('AdminOverTime.Status.Options.All') },
    { id: '10', name: t('AdminOverTime.Status.Options.Approved') },
    { id: '20', name: t('AdminOverTime.Status.Options.Avail') },
  ];
  const [dropdownOptions] = useState({
    status: defaultStatusOptions.map(opt => ({ ...opt })),
  });
  const [filters, setFilters] = useState({ ...defaultFiltersValues });
  const [endDateBeforeError, setEndDateBeforeError] = useState('');

  const resetFields = () => {
    setFilters({ ...defaultFiltersValues });
    setEndDateBeforeError('');
    if (resetParentFields) resetParentFields();
  };
  
  // for fields in this component
  const checkAreAllFieldsFilled = fields => Object.values(fields).every(field => !!field);

  const handleDateChange = (date, fieldName) => {
    let endDateError = '';
    const startDate = fieldName === 'startDate' ? date : filters.startDate;
    const endDate = fieldName === 'endDate' ? date : filters.endDate;
    if (moment(startDate).isAfter(endDate)) {
      endDateError = t('AdminOverTime.EndDateError');
    }
    setEndDateBeforeError(endDateError);
    filters[fieldName] = date;
    setFilters({ ...filters });
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    filters[name] = value;
    setFilters({ ...filters });
  };

  const requestBody = (pageIndex = 1, pageSize = 10) => ({
    id: 0,
    languageId: 1,
    pageIndex,
    pageSize,
      
    userId: parseInt(getUserId(), 10),
    startDate: filters.startDate,
    endDate: filters.endDate,
    overTimeStatusId: parseInt(filters.status, 10),
  });

  const getDataOnPageLoad = () => {
    // on page load request
    const pageIndex = 1;
    const pageSize = pagination.pageSize || 10;
    const paginationFields = { currentPage: 1 };
    getSearchOvertimeReport(pageIndex, pageSize, paginationFields, requestBody);
  };

  useEffect(() => {
    getDataOnPageLoad();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      getData() { getDataOnPageLoad(); },
    }),
    [],
  );
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const pageIndex = 1;
    const pageSize = pagination.pageSize || 10;
    const paginationFields = { currentPage: 1 };
    getSearchOvertimeReport(pageIndex, pageSize, paginationFields, requestBody);
  };

  const getPaginatedData = (pageIndex, pageSize, paginationFields) => {
    getSearchOvertimeReport(pageIndex, pageSize, paginationFields, requestBody);
  };

  const shouldBtnsDisabled = (endDateBeforeError.length > 0
     || loading || !checkAreAllFieldsFilled(filters));
  
  return (
    <div>
      <DownloadExcelBtn
        onDownloadBtnClick={isExcelFile => onDownloadFile(isExcelFile, pagination, requestBody)}
        disabled={shouldBtnsDisabled}
      />
      <Form className="mb-4" onSubmit={handleSubmit}>
        <div className="row">
          <Form.Group className="col-lg-3 col-md-6">
            <Form.Label>{t('AdminOverTime.Status.Options.StartDate')}</Form.Label>
            <DatePicker
              autoComplete="off"
              // className="form-control rounded-lg bg-transparent mb-0"
              className="form-control"
              value={filters.startDate}
              selected={filters.startDate}
              name="startDate"
              onChange={date => handleDateChange(date, 'startDate')}
              placeholderText={commonService.localizedDateFormat()}
              dateFormat={commonService.localizedDateFormatForPicker()}
              pattern="\d{2}\/\d{2}/\d{4}"
              required
            />
          </Form.Group>
          <Form.Group className="col-lg-3 col-md-6">
            <Form.Label>{t('AdminOverTime.Status.Options.EndDate')}</Form.Label>
            <DatePicker
              autoComplete="off"
              // className="form-control rounded-lg bg-transparent mb-0"
              className="form-control"
              value={filters.endDate}
              selected={filters.endDate}
              name="endDate"
              onChange={date => handleDateChange(date, 'endDate')}
              placeholderText={commonService.localizedDateFormat()}
              dateFormat={commonService.localizedDateFormatForPicker()}
              pattern="\d{2}\/\d{2}/\d{4}"
              required
            />
            {endDateBeforeError.length > 0
              && <div className="text-danger font-sm ">{endDateBeforeError}</div>}
          </Form.Group>
          <CustomSelectField
            label={t('AdminOverTime.Status.Options.Status')}
            name="status"
            value={filters.status}
            onChange={handleChange}
            options={dropdownOptions.status}
          />
        </div>
        <div className="d-flex align-items-center justify-content-end">
          <Button
            className="inline-block"
            onClick={resetFields}
            disabled={loading}
          >
            {t('AdminOverTime.Status.Options.ResetFields')}
          </Button>
          <Button
            type="submit"
            className="inline-block"
            disabled={shouldBtnsDisabled}
          >
            {loading ? `${t('AdminOverTime.Status.Options.Searching')}...` : t('AdminOverTime.Status.Options.Search')}
          </Button>
        </div>
      </Form>
      {/* {!hasData && <div>{t('LeaveManagement.AppliedLeaves.Manager.MyTeamLeaveDetails.NoRecordFound')}</div>} */}
      <OverTimeTable
        hasData={hasData}
        tableData={tableData}
        pagination={pagination}
        getData={getPaginatedData}
      />
    </div>
  );
});

export default AdminOverTime;

function CustomSelectField({
  label, name, value, onChange, options,
}) {
  return (
    <Form.Group
      controlId="exampleForm.SelectCustom"
      className="col-lg-3 col-md-6"
    >
      <Form.Label>{label}</Form.Label>
      <Form.Control name={name} value={value} as="select" onChange={onChange}>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
}
