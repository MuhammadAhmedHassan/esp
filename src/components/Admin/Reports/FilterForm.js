import React, {
  useState, useRef, useImperativeHandle, forwardRef,
} from 'react';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Api from '../../common/Api';
import { sendApiRequest } from '../../common/serviceCall/PostApiCall';
import HirarchicalFiltersForAdmin from './HirarchicalFiltersForAdmin';
import { userService } from '../../../services/user.service';
import DownloadExcelAndPdfBtns from './components/DownloadExcelAndPrintBtns';
import { checkUserRoleType } from './util';
import { commonService } from '../../../services/common.service';

const {
  isAdmin, getUserId, getUser, getFirstLastAndCurrentDateOfTheMonth,
} = userService;

const FilterForm = forwardRef((props, ref) => {
  const {
    loading, getTimesheet, managerTeam, allEmployees, adminReport, shiftTypes,
    schedules,
  } = props;
  const { t } = useTranslation();
  const adminHirarchyRef = useRef();
  const { firstDateOfMonth, currentDateOfMonth } = getFirstLastAndCurrentDateOfTheMonth();
  const defaultFiltersValue = ({
    startDate: firstDateOfMonth,
    endDate: currentDateOfMonth,
    userId: managerTeam ? '' : '-', // '-' is just a dummy representation for checkAreAllFieldsFilled() to pass test
    scheduleId: '0',
    shiftId: '1', // because in api response 1 => all
  });
  const [filters, setFilters] = useState({ ...defaultFiltersValue });
  // const [areAllFieldsFilled, setAreAllFieldsFilled] = useState(false);
  const [adminFields, setAdminFields] = useState({});
  const [areAdminFieldsSet, setAreAdminFieldsSet] = useState(
    !isAdmin(),
  );
  const [managerEmployeeSelectionError, setManagerEmployeeSelectionError] = useState('');
  const [selectedEmployeeNameByAdmin, setSelectedEmployeeNameByAdmin] = useState('');
  const [endDateBeforeError, setEndDateBeforeError] = useState('');
  const [downloadExcelLoading, setDownloadExcelLoading] = useState(false);
  
  // for fields in this component
  const checkAreAllFieldsFilled = fields => Object.values(fields).every(field => !!field);

  const areAllFieldsSet = (allFilters) => {
    const isSet = checkAreAllFieldsFilled(allFilters);
    if (isAdmin()) {
      if (isSet && areAdminFieldsSet) {
        // setAreAllFieldsFilled(true);
      }
    } else {
      // If for some reason user is not admin and the areAdminFieldsSet is false
      // then set it to true
      // if (areAdminFieldsSet === false) setAreAdminFieldsSet(true);
      // if (isSet) setAreAllFieldsFilled(true);
    }
  };
  
  const checkAreAllFieldsSetForAdminHirarchy = (
    fields,
    isEveryFieldSet,
    selectedEmployeeName,
  ) => {
    // if (!isEveryFieldSet) setAreAllFieldsFilled(false);
    // else setAreAllFieldsFilled(checkAreAllFieldsFilled(filters));
    setAreAdminFieldsSet(isEveryFieldSet);
    setAdminFields({ ...fields });
    setSelectedEmployeeNameByAdmin(selectedEmployeeName);
  };

  const handleDateChange = (date, name) => {
    let endDateError = '';
    if (name === 'startDate') {
      if (moment(filters.endDate).isBefore(date)) {
        endDateError = t('Report.HoursWorked.EndDateErrorMsg');
      }
    } else if (moment(date).isBefore(filters.startDate)) {
      endDateError = t('Report.HoursWorked.EndDateErrorMsg');
    }
    setEndDateBeforeError(endDateError);
    filters[name] = date;
    setFilters({ ...filters });
    areAllFieldsSet({ ...filters });
  };

  const setErrors = (name, value) => {
    let error = '';
    if (name === 'userId' && managerTeam && !parseInt(value, 10)) {
      error = t('Reports.HoursReport.ThisFieldIsRequired');
    }
    setManagerEmployeeSelectionError(error);
    return error;
  };

  const handleChange = ({ target: { name, value } }) => {
    filters[name] = value;
    setFilters({ ...filters });
    areAllFieldsSet({ ...filters });
    setErrors(name, value);
  };

  // Select field returns '1' for 1, so to I'm converting it back to 1.
  const parseFieldValues = (allFields) => {
    Object.keys(allFields).forEach((key) => {
      if (
        !key.toString().toLowerCase().includes('date')
        && typeof allFields[key] === 'string'
      ) {
        // eslint-disable-next-line no-param-reassign
        allFields[key] = parseInt(allFields[key], 10);
      }
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!managerTeam) delete filters.userId;
    // This userName is to show in the table column
    // when Manager or admin filters it
    let userName = '';
    let allFields = filters;
    if (managerTeam) {
      const error = setErrors('userId', filters.userId);
      if (error.length > 0) return;
    }
    if (managerTeam) {
      allFields.userId = Number(allFields.userId);
      userName = allEmployees.find(emp => emp.id === allFields.userId).fullName;
    }
    if (isAdmin() && !adminReport) {
      Object.keys(adminFields).forEach((key) => {
        adminFields[key] = parseInt(adminFields[key], 10);
      });
      allFields = { ...allFields, ...adminFields, userId: adminFields.employeesId };
      userName = selectedEmployeeNameByAdmin;

      if (adminHirarchyRef.current && adminHirarchyRef.current.setErrorsOfMandatoryFields) {
        const { hasErrors } = adminHirarchyRef.current.setErrorsOfMandatoryFields();
        if (hasErrors) {
          return;
        }
      }
    }

    parseFieldValues(allFields);
    getTimesheet(
      {
        languageId: 1, // this will be dynamic
        pageIndex: 1,
        pageSize: 2147483644,
        isOpenShift: null,
        isOnCallShift: null,
        isOverTimeShift: null,
        // userId will be overwitten by allFields as
        // all fields will have userId in case of specific user
        userId: getUserId(),
        ...allFields,
      },
      userName,
    );
  };

  let additionalMarkup = <></>;
  if (managerTeam) {
    additionalMarkup = (
      <CustomSelect
        label={t('Report.HoursWorked.SelectEmployee')}
        name="userId"
        value={filters.userId}
        onChange={handleChange}
        options={[{ id: '', name: t('Report.HoursWorked.SelectEmployee') }].concat((allEmployees).map(employee => ({
          ...employee, name: employee.fullName,
        }
        )))}
        required
        error={managerEmployeeSelectionError}
      />
    );
  }

  const onDownloadBtnClick = async (isExcelDownload) => {
    const apiUrl = isExcelDownload
      ? Api.shift.downloadShiftHoursWorkedExcel
      : Api.shift.downloadShiftHoursWorkedPdf;

    if (!managerTeam) delete filters.userId;
    if (managerTeam) {
      const error = setErrors('userId', filters.userId);
      if (error.length > 0) return;
    }
    if (managerTeam) filters.userId = parseInt(filters.userId, 10);

    const userRoles = getUser();
    const userRoleTypes = checkUserRoleType(userRoles.role);
    const userRolesDetails = {
      userId: userRoles.userId,
      roleType: userRoleTypes.roleType,
      roleIds: userRoleTypes.userRoleIds,
    };

    const reqObj = {
      id: userRolesDetails.userId,
      languageId: 1,
      roleIds: userRolesDetails.roleIds,
      contractTypeId: 0,
      scheduleId: 0,
      shiftId: 0,
      userRoleIds: userRolesDetails.userRoleIds,
      pageIndex: 1,
      pageSize: 2147483644,
      isOpenShift: null,
      isOnCallShift: null,
      isOverTimeShift: null,
      userId: getUser().userId,
    };

    let requestBody = {
      ...reqObj, ...filters, scheduleId: parseInt(filters.scheduleId, 10), shiftId: parseInt(filters.shiftId, 10),
    };

    if (isAdmin() && !adminReport) {
      Object.keys(adminFields).forEach((key) => {
        adminFields[key] = parseInt(adminFields[key], 10);
      });
      requestBody = { ...requestBody, ...adminFields, userId: adminFields.employeesId };
      if (adminHirarchyRef.current && adminHirarchyRef.current.setErrorsOfMandatoryFields) {
        const { hasErrors } = adminHirarchyRef.current.setErrorsOfMandatoryFields();
        if (hasErrors) {
          return;
        }
      }
    }

    try {
      setDownloadExcelLoading(true);
      const isBlob = true;
      const blob = await sendApiRequest(apiUrl, 'POST', requestBody, isBlob);

      if (blob.type === undefined || blob.type === 'application/json') {
        console.error('Error downloading file');
      } else {
        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `hoursWorkedReport.${isExcelDownload ? 'xlsx' : 'pdf'}`); // 3. Append to html page
        document.body.appendChild(link); // 4. Force download
        link.click(); // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.error(error);
    }
    setDownloadExcelLoading(false);
  };

  const resetFilters = () => {
    if (adminHirarchyRef.current && adminHirarchyRef.current.resetAdminFilters) {
      adminHirarchyRef.current.resetAdminFilters();
    }
    // setAreAdminFiltersSet(false);
    setAdminFields({});
    setEndDateBeforeError('');
    setAreAdminFieldsSet(!isAdmin());
    setSelectedEmployeeNameByAdmin('');
    setManagerEmployeeSelectionError('');
    setFilters({ ...defaultFiltersValue });
  };

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        resetFilters();
      },
    }),
    [],
  );
  

  return (
    <div>
      <DownloadExcelAndPdfBtns
        onDownloadBtnClick={onDownloadBtnClick}
        disabled={loading || downloadExcelLoading}
      />
      <Form className="mb-4" onSubmit={handleSubmit}>
        <div className="row">
          {isAdmin() && !adminReport ? (
            <HirarchicalFiltersForAdmin
              checkAreAllFieldsSet={checkAreAllFieldsSetForAdminHirarchy}
              ref={adminHirarchyRef}
            />
          ) : (
            additionalMarkup
          )}
          <Form.Group className="col-lg-3 col-md-6">
            <Form.Label>{t('Report.HoursWorked.StartDate')}</Form.Label>
            <DatePicker
              autoComplete="off"
              // className="form-control rounded-lg bg-transparent"
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
            <Form.Label>{t('Report.HoursWorked.EndDate')}</Form.Label>
            <DatePicker
              autoComplete="off"
              // className="form-control rounded-lg bg-transparent"
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
              && <div className="text-danger font-sm">{endDateBeforeError}</div>}
          </Form.Group>

          <Form.Group className="col-lg-3 col-md-6">
            <Form.Label>{t('Report.HoursWorked.ShiftType')}</Form.Label>
            <Form.Control
              name="shiftId"
              as="select"
              value={filters.shiftId}
              onChange={handleChange}
              required
            >
              {shiftTypes.map(opt => (
                <option key={opt.shiftTypeId} value={opt.shiftTypeId}>
                  {opt.shiftTypeName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="col-lg-3 col-md-6">
            <Form.Label>{t('SidebarPage.schedule')}</Form.Label>
            <Form.Control
              name="scheduleId"
              as="select"
              value={filters.scheduleId}
              onChange={handleChange}
              required
            >
              <option key="0" value="0">{t('AllText')}</option>
              {schedules.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.title}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>
        <div className="d-flex align-items-center justify-content-end">
          {/* {isAdmin() && !adminReport && ( */}
          <Button
            className="inline-block"
            disabled={loading}
            onClick={resetFilters}
          >
            {t('Report.HoursWorked.ResetFields')}
          </Button>
          {/* )} */}
          <Button
            type="submit"
            className="inline-block"
            // disabled={loading || areAllFieldsFilled === false || endDateBeforeError.length > 0}
            disabled={loading}
          >
            {loading ? `${t('Report.HoursWorked.Searching')}...` : t('Report.HoursWorked.Search')}
          </Button>
        </div>
      </Form>
    </div>
  );
});

export default FilterForm;

function CustomSelect({
  label, name, value, onChange, options, required, error,
}) {
  return (
    <Form.Group className="col-lg-3 col-md-6">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        name={name}
        as="select"
        value={value}
        onChange={onChange}
        required={required}
      >
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </Form.Control>
      {error.length > 0 && <div className="text-danger font-sm">{error}</div>}
    </Form.Group>
  );
}
