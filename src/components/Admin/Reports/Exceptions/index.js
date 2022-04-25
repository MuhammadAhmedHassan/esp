/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import './style.scss';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { userService } from '../../../../services/user.service';
import AdminExceptionReport from './components/admin';
import ManagerExceptionReport from './components/manager';
import EmployeeExceptionReport from './components/employee';
import { sendApiRequest } from '../../../common/serviceCall/PostApiCall';
import Api from '../../../common/Api';
import ReportTable from './components/ReportTable';
import { commonService } from '../../../../services/common.service';

const { localizedDate, localizedDateFormat } = commonService;


// function localizedDate(date) {
//   const lang = navigator.languages ? navigator.languages : navigator.language;

//   const format = moment().locale(lang).localeData()._longDateFormat.L;

//   return moment.utc(date).local().format(format);
// }

const {
  isAdmin, isEmployee, isManager, getUser,
} = userService;

function Exceptions() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [allExceptions, setAllExceptions] = useState([]);
  // Report Table States
  const [filteredDataByWeekNumber, setFilteredDataByWeekNumber] = useState();
  const [filteredDataByShiftId, setFilteredDataByShiftId] = useState();
  const [userName, setUserName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredByShiftIdAndUtcStartDate, setFilteredByShiftIdAndUtcStartDate] = useState({});
  const [dateViaHoursDataObj, setDateViaHoursDataObj] = useState();

  const getLocalDate = dateTimeUtc => (typeof dateTimeUtc === 'string' ? moment(dateTimeUtc).local().format(localizedDateFormat()) : '');
  // const getShiftIdAndUtcStartDateDataKey = doc => `${doc.shiftId}-${doc.startDateTimeUtc ? localizedDate(doc.startDateTimeUtc) : ''}`;
  const getShiftIdAndUtcStartDateDataKey = doc => `${doc.shiftId}-${doc.startDateTimeUtc ? getLocalDate(doc.startDateTimeUtc) : ''}`;
  const getLocalDateForDatePicker = dateTime => (typeof dateTime === 'object' ? moment(dateTime).local() : '');

  const resetTableData = () => {
    setFilteredDataByWeekNumber(null);
    setFilteredDataByShiftId(null);
    setUserName('');
    setStartDate(null);
    setEndDate(null);
    setDateViaHoursDataObj(null);
    setFilteredByShiftIdAndUtcStartDate({});
  };
  
  const getAllExceptions = async () => {
    try {
      setLoading(true);
      const response = await sendApiRequest(Api.exceptionRequest.exception.getAllException, 'POST');
      if (response.statusCode === 200) {
        setAllExceptions([{ id: '0', name: t('Report.HoursWorked.ExceptionReport.ExceptionType.All') }].concat(response.data.map(exception => ({ id: exception.id, name: exception.type, color: exception.exceptionColourCode }))));
      } else if (response.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          getAllExceptions();
        });
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => { getAllExceptions(); }, []);

  const getExceptionReport = async (requestBody, currentUserName) => {
    try {
      if (Object.keys(requestBody).length < 1) return;
      // setStartDate(localizedDate(requestBody.startDate));
      // setEndDate(localizedDate(requestBody.endDate));
      setStartDate(getLocalDateForDatePicker(requestBody.startDate));
      setEndDate(getLocalDateForDatePicker(requestBody.endDate));
      setLoading(true);
      const response = await sendApiRequest(Api.exceptionRequest.exception.exceptionReportRequest, 'POST', requestBody);

      if (response.statusCode === 200) {
        const { data, dateWiseHoursData, shiftWiseHoursData } = response.data;
        setUserName(currentUserName || getUser().userName);
        
        const dateViaData = dateWiseHoursData.reduce((prv, cur) => {
          // prv[`${localizedDate(cur.date)}`] = cur;
          prv[`${getLocalDate(cur.date)}`] = cur;
          return prv;
        }, {});
        setDateViaHoursDataObj(dateViaData);

        setUserName(currentUserName || getUser().userName);
        
        const shiftIdAndUtcDateViaData = data.reduce((prv, cur) => {
          prv[getShiftIdAndUtcStartDateDataKey(cur)] = cur;
          return prv;
        }, {});
        setFilteredByShiftIdAndUtcStartDate(shiftIdAndUtcDateViaData);
        
        const filteredByWeekNumber = new Map();
        data.forEach((doc) => {
          if (!filteredByWeekNumber.has(doc.weekNumber)) {
            filteredByWeekNumber.set(doc.weekNumber, []);
          }
          const arr = filteredByWeekNumber.get(doc.weekNumber);
          arr.push(doc);
          filteredByWeekNumber.set(doc.weekNumber, arr);
        });
        setFilteredDataByWeekNumber(filteredByWeekNumber);

        const filteredDataByShiftIdReduced = data.reduce((prv, cur) => {
          if (!(cur.shiftId in prv)) {
            prv[`${cur.shiftId}`] = [];
          }
          prv[`${cur.shiftId}`].push(cur);
          return prv;
        }, {});
        setFilteredDataByShiftId(filteredDataByShiftIdReduced);
      } else if (response.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          getExceptionReport(requestBody, currentUserName);
        });
      }
    } catch (error) {
      console.error(error);
      setDateViaHoursDataObj(null);
    }
    setLoading(false);
  };

  const onDownloadFile = async (isExcelFile, requestBody) => {
    try {
      setLoading(true);
      const apiUrl = isExcelFile
        ? Api.exceptionRequest.exception.downloadException
        : Api.exceptionRequest.exception.downloadExceptionReportPdf;

      const isBlob = true;
      const blob = await sendApiRequest(apiUrl, 'POST', requestBody, isBlob);

      if (blob.type === undefined || blob.type === 'application/json') {
        console.error('Error downloading file');
      } else {
        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `exceptionReport.${isExcelFile ? 'xlsx' : 'pdf'}`); // 3. Append to html page
        document.body.appendChild(link); // 4. Force download
        link.click(); // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const dateViaDataLength = dateViaHoursDataObj && Object.keys(dateViaHoursDataObj).length;

  return (
    <div className="container-fluid">
      <div className="card_layout">
        {isAdmin() && (
        <AdminExceptionReport
          loading={loading}
          resetTableData={resetTableData}
          onDownloadFile={onDownloadFile}
          allExceptions={allExceptions}
          getExceptionReport={getExceptionReport}
        />
        )}
        {isManager() && (
        <ManagerExceptionReport
          loading={loading}
          resetTableData={resetTableData}
          onDownloadFile={onDownloadFile}
          allExceptions={allExceptions}
          getExceptionReport={getExceptionReport}
        />
        )}
        {isEmployee()
         && (
         <EmployeeExceptionReport
           loading={loading}
           resetTableData={resetTableData}
           onDownloadFile={onDownloadFile}
           allExceptions={allExceptions}
           getExceptionReport={getExceptionReport}
         />
         )}

        {dateViaHoursDataObj && dateViaDataLength === 0 && (
          <div>{t('Report.Exception.NoDataFound')}</div>
        )}
        
        {(!loading && filteredDataByWeekNumber && dateViaDataLength > 0) && (
          <ReportTable
            loading={loading}
            filteredDataByShiftId={filteredDataByShiftId || {}}
            userName={userName}
            fromDate={startDate}
            toDate={endDate}
            filteredByShiftIdAndUtcStartDate={filteredByShiftIdAndUtcStartDate}
            dateViaHoursDataObj={dateViaHoursDataObj}
          />
        )}
      </div>
    </div>
  );
}

export default Exceptions;
