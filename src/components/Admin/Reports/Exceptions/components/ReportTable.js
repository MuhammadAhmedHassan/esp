/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { commonService } from '../../../../../services/common.service';

const { localizedDateFormat } = commonService;

// function localizedDate(date) {
//   const lang = navigator.languages ? navigator.languages : navigator.language;

//   const format = moment().locale(lang).localeData()._longDateFormat.L;

//   return moment.utc(date).local().format(format);
// }

function ReportTable({
  loading,
  filteredDataByShiftId,
  userName,
  fromDate,
  toDate,
  filteredByShiftIdAndUtcStartDate,
  dateViaHoursDataObj,
}) {
  const { t } = useTranslation();
  const [fromDateToDateArr, setFromDateToDateArr] = useState([]);
  const [startDatesOfWeeks, setStartDatesOfWeeks] = useState();
  
  useEffect(() => {
    const datesArr = [];
    for (let currentDate = moment(fromDate); currentDate.isSameOrBefore(toDate); currentDate.add(1, 'days')) {
      datesArr.push(moment(currentDate));
    }
    setFromDateToDateArr(datesArr);

    const weeksStartDateMap = new Map();
    datesArr.forEach((d) => {
      // const key = localizedDate(moment(d).startOf('week'));
      const key = moment(d).startOf('week').format(localizedDateFormat());
      if (!weeksStartDateMap.has(key)) {
        weeksStartDateMap.set(key, 0);
      }
      const previousValue = weeksStartDateMap.get(key);
      weeksStartDateMap.set(key, previousValue + 1);
    });
    setStartDatesOfWeeks(weeksStartDateMap);
  }, []);

  const getExceptionAndMultipleException = (document) => {
    const styles = {};
    let exception = '';
    let multipleExceptions = '';
    if (document) {
      styles.backgroundColor = document.exceptionColourCode;
      styles.color = document.exceptionColourCode ? '#fff' : '';
      exception = (
        <>
          {/* <div className="text-center">{document.exceptionHoursInHMFormate}</div> */}
          <div className="text-center">{document.calculatedTimeInHMFormate}</div>
          <div className="text-center mt-1">{document.exception}</div>
        </>
      );
      if (document.exception === 'ME') {
        multipleExceptions = document.multipleExceptions;
        if (multipleExceptions) {
          multipleExceptions = multipleExceptions.split(',');
                       
          multipleExceptions = [...multipleExceptions].map((mulExp) => {
            const firstIndex = mulExp.indexOf('(');
            const lastIndex = mulExp.indexOf(')');
            const exp = (mulExp.substring(0, firstIndex) + mulExp.substr(lastIndex + 1)).trim();
            return <div>{exp}</div>;
          });
        }
      }
    }

    return { exception, multipleExceptions, styles };
  };
  
  return loading || Object.keys(filteredByShiftIdAndUtcStartDate || {}).length === 0 || !filteredDataByShiftId ? (
    <div />
  ) : (
    <div className="reports-table-container">
      <table className="reports-table">
        <thead>
          <tr>
            <th />
            <th className="no-border" colSpan={4} />
            <th className="no-border" />
            <th className="no-border" />
            {/* Displaying weeks */}
            {startDatesOfWeeks && [...startDatesOfWeeks].map(([startDateOfWeek, colSpan], idx) => (
              <th key={idx} colSpan={colSpan}>{moment(startDateOfWeek).format(localizedDateFormat())}</th>
            ))}
          </tr>
          <tr>
            <th>{t('Report.HoursWorked.Employee')}</th>
            <th className="table-row-headers" colSpan={4}>{t('Report.HoursWorked.ScheduleName')}</th>
            <th className="table-row-headers">{t('Report.HoursWorked.ShiftLabel')}</th>
            <th className="table-row-headers">{t('Report.HoursWorked.ShiftType')}</th>
            {fromDateToDateArr.map((date, idx) => (
              <th key={idx} className="text-center">
                {date.format('DD')}
                {' '}
                {date.format('ddd')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th rowSpan={Object.keys(filteredDataByShiftId).length + 1} className="simple-headers">
              {userName}
            </th>
          </tr>

          {Object.keys(filteredDataByShiftId).map((shiftId, idx) => {
            const reportObj = filteredDataByShiftId[shiftId];
            const {
              shiftLabel, scheduleName, shiftType, userId,
            } = reportObj[0];
            return (
              <tr key={`${shiftId}-${idx + 1}`}>
                <th className="table-row-headers simple-headers " colSpan={4}>
                  <div>{scheduleName}</div>
                </th>
                <th className="primary-color table-row-headers ">
                  <Link to={`/shift-detail/${shiftId}/${userId}`}>
                    <div>{shiftLabel}</div>
                  </Link>
                </th>
                <th className="table-row-headers simple-headers ">
                  <div>{shiftType}</div>
                </th>
                {fromDateToDateArr.map((date) => {
                  // const document = filteredByShiftIdAndUtcStartDate[`${shiftId}-${localizedDate(date)}`];
                  const document = filteredByShiftIdAndUtcStartDate[`${shiftId}-${date.format(localizedDateFormat())}`];
                  const { exception, multipleExceptions, styles } = getExceptionAndMultipleException(document);
                  return (
                    <td key={date} style={styles}>
                      <OverlayTrigger
                        key={date}
                        id={date}
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={(
                          <Tooltip id={`tooltip-${date}`}>{multipleExceptions || exception}</Tooltip>
                        )}
                      >
                        <span>{exception}</span>
                      </OverlayTrigger>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {/* Total exception Hours */}
          <tr>
            <td className="no-border" />
            <td className="no-border" />
            <td className="no-border" />
            <td className="no-border" />

            <td className="no-border" />
            <td className="no-border" />
            <td>{t('Report.HoursWorked.TotalExceptionHours')}</td>
            {fromDateToDateArr.map((date, idx) => {
              // const totalObj = dateViaHoursDataObj[`${localizedDate(date)}`];
              const totalObj = dateViaHoursDataObj[`${date.format(localizedDateFormat())}`];
              return (
                <td key={idx} className="text-center">
                  {totalObj ? totalObj.totalCalculatedHours : ''}
                </td>
              );
            })}
          </tr>
          {/* Actual Hours */}
          <tr>
            <td className="no-border" />
            <td className="no-border" />
            <td className="no-border" />
            <td className="no-border" />

            <td className="no-border" />
            <td className="no-border" />
            <td>{t('Report.HoursWorked.ActualHours')}</td>
            {fromDateToDateArr.map((date, idx) => {
              // const totalObj = dateViaHoursDataObj[`${localizedDate(date)}`];
              const totalObj = dateViaHoursDataObj[`${date.format(localizedDateFormat())}`];
              return (
                <td key={idx} className="text-center">
                  {totalObj ? totalObj.totalActualHours : ''}
                </td>
              );
            })}
          </tr>
          {/* Required Hours */}
          <tr>
            <td className="no-border" />
            <td className="no-border" />
            <td className="no-border" />
            <td className="no-border" />

            <td className="no-border" />
            <td className="no-border" />
            <td>{t('Report.HoursWorked.RequiredHours')}</td>
            {fromDateToDateArr.map((date, idx) => {
              // const totalObj = dateViaHoursDataObj[`${localizedDate(date)}`];
              const totalObj = dateViaHoursDataObj[`${date.format(localizedDateFormat())}`];
              return (
                <td key={idx} className="text-center">
                  {totalObj ? totalObj.totalRequiredHours : ''}
                </td>
              );
            })}
          </tr>
          {/* Variance row */}
          <tr>
            <td className="no-border" />
            <td className="no-border" />
            <td className="no-border" />
            <td className="no-border" />

            <td className="no-border" />
            <td className="no-border" />
            <td>{t('Report.HoursWorked.Variance')}</td>
            {fromDateToDateArr.map((date, idx) => {
              // const totalObj = dateViaHoursDataObj[`${localizedDate(date)}`];
              const totalObj = dateViaHoursDataObj[`${date.format(localizedDateFormat())}`];
              return (
                <td key={idx} className="text-center">
                  {totalObj ? totalObj.totalVariance : ''}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;
