/* eslint-disable no-use-before-define */
import React, {
  useState, useEffect, forwardRef, useImperativeHandle,
} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import { Form, Button } from 'react-bootstrap';
import DownloadExcelAndPdfBtns from '../DownloadExcelAndPdfBtns';
import { userService } from '../../../../../../services/user.service';
import { commonService } from '../../../../../../services/common.service';

const { getUser, getUserId, getFirstLastAndCurrentDateOfTheMonth } = userService;

const validationSchema = t => Yup.object({
  startDate: Yup.date().required(t('Report.ThisFieldIsRequired')),
  endDate: Yup.date().required(t('Report.ThisFieldIsRequired')).min(
    Yup.ref('startDate'), t('ShiftTemplatePage.EndDate_errorText'),
  ),
  exceptionType: Yup.string().required(t('Report.ThisFieldIsRequired')),
});


const ManagerExceptionReport = forwardRef(({
  loading,
  allExceptions,
  getExceptionReport,
  onDownloadFile,
  resetTableData,
}, ref) => {
  const { t } = useTranslation();
  const { firstDateOfMonth, currentDateOfMonth } = getFirstLastAndCurrentDateOfTheMonth();
  const [dropdownOptions, setDropdownOptions] = useState({
    exceptionType: [{ id: '0', name: t('Report.HoursWorked.ExceptionReport.ExceptionType.All') }],
  });
  const formik = useFormik({
    initialValues: {
      startDate: firstDateOfMonth,
      endDate: currentDateOfMonth,
      exceptionType: '0',
    },
    validationSchema: validationSchema(t),
    onSubmit(values) {
      getExceptionReport(requestBody(values));
    },
  });

  useEffect(() => {
    setDropdownOptions({ ...dropdownOptions, exceptionType: allExceptions });
  }, [allExceptions]);

  useImperativeHandle(ref, () => ({
    reset() {
      formik.resetForm();
    },
  }));
  
  const requestBody = (values) => {
    const userRoleIds = getUser().role.map(rle => rle.id).join(',');
    
    return {
      languageId: 1,
      pageIndex: 1,
      pageSize: 23412512,
      userId: parseInt(getUserId(), 10),
      userRoleIds,
      startDate: values.startDate || formik.values.startDate,
      endDate: values.endDate || formik.values.endDate,
      exceptionType: parseInt(values.exceptionType || formik.values.exceptionType, 10),
    };
  };

  const getPageLoadData = () => {
    const defaultObj = { ...formik.initialValues };
    getExceptionReport(requestBody(defaultObj));
  };
  
  useEffect(() => {
    // On Page load data
    getPageLoadData();
  }, []);

  const onDownloadBtnClick = async (isExcelFile) => {
    const errors = await formik.validateForm();
    Object.keys(formik.values).forEach((key) => {
      formik.setFieldTouched(key, true);
    });
    if (Object.keys(errors).length > 0) return;
    onDownloadFile(isExcelFile, requestBody(formik.values));
  };

  return (
    <div>
      <DownloadExcelAndPdfBtns
        onDownloadBtnClick={onDownloadBtnClick}
        disabled={loading}
      />
      <Form onSubmit={formik.handleSubmit}>
        <div className="row">
          <Form.Group className="col-lg-3 col-md-6">
            <Form.Label>{t('Report.HoursWorked.StartDate')}</Form.Label>
            <DatePicker
              autoComplete="off"
              // className="form-control rounded-lg bg-transparent"
              className="form-control"
              value={formik.values.startDate}
              selected={formik.values.startDate}
              name="startDate"
              onChange={selectedDate => formik.setFieldValue('startDate', selectedDate)}
              // placeholderText="MM/DD/YYYY"
              // dateFormat="MM/dd/yyyy"
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
              // className="form-control rounded-lg bg-transparent"
              className="form-control"
              value={formik.values.endDate}
              selected={formik.values.endDate}
              name="endDate"
              onChange={selectedDate => formik.setFieldValue('endDate', selectedDate)}
              // placeholderText="MM/DD/YYYY"
              // dateFormat="MM/dd/yyyy"
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
          <Form.Group
            className="col-lg-3 col-md-6"
          >
            <Form.Label>{t('Report.HoursWorked.ExceptionReport.ExceptionType')}</Form.Label>
            <Form.Control name="exceptionType" value={formik.values.exceptionType} as="select" onChange={formik.handleChange}>
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
            onClick={() => {
              formik.resetForm();
              // Don't reset table data as per the instructions
              // if (resetTableData) resetTableData();
            }}
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

export default ManagerExceptionReport;

function CustomErrorMsg({ touched, error }) {
  if (touched && error) return (<div className="text-danger font-sm">{error}</div>);
  return <></>;
}
