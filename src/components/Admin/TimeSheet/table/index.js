/* eslint-disable no-nested-ternary */
import React from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { withTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Tick from '../../../../Images/Icons/checked.svg';
import PaginationAndPageNumber from '../../../shared/Pagination';
import { formatDate } from '../util';
import { userService } from '../../../../services';
import EditIcon from '../../../../Images/Icons/Edit.svg';
import ExclamationIcon from '../../../../Images/Icons/exclamation-mark.png';
import './style.scss';
import { commonService } from '../../../../services/common.service';

const timeSheetTable = ({
  header = [],
  data = [],
  updatePageNum,
  updatePageCount,
  pagination,
  userRole,
  filters,
  editEmployeeShift,
  updateEmployeeShift,
  handleStartDateChange,
  handleEndDateChange,
  requestShiftTime,
  managerKey,
  t,
}) => {
  const { totalRecords, pageSize, pageIndex } = pagination;
  const { isUser } = userRole;
  return (
    <>
      <div className="timesheet timesheet-content">
        <Table responsive="xl" className="main-table-wrapper timeSheetTable">
          <thead>
            <tr>
              <th />
              {header.map((val, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <th key={index}>{val}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
            <tr>
              <td colSpan="10">
                No records found
              </td>
            </tr>
            )}

            {data.map(
              ({
                sequenceId,
                userId,
                shiftRecurrenceId,
                scheduleName = '',
                exception = '',
                exceptionColourCode = '',
                shiftLabel,
                shiftType,
                employeeName = '',
                date = '',
                startShift = '',
                endShift = '',
                startDateTimeUtc = '',
                endDateTimeUtc = '',
                calculatedTime = '',
                requiredHours = '',
                designation = '',
                variance = '',
                status,
                requestDescription,
                createdByUserId,
                shiftUrl = `/shift-detail/${shiftRecurrenceId}/${userId}/`,
              }) => (
                <tr key={sequenceId}>
                  <td>
                    {exception
                      && (
                        <span
                          className="status"
                          style={{ backgroundColor: `${exceptionColourCode}` }}
                        >
                          {exception}
                        </span>
                      )
                    }

                  </td>
                  {isUser && (
                    <>
                      <td>
                        <span>{scheduleName}</span>
                      </td>
                    </>
                  )}
                  <td>
                    <a href={shiftUrl}>{shiftLabel}</a>
                  </td>
                  <td>
                    <span>{shiftType}</span>
                  </td>
                  {!isUser && (
                    <td>
                      <span>{employeeName}</span>
                    </td>
                  )}

                  <td>
                    <span>
                      {date ? commonService.localizedDate(date) : ''}
                    </span>
                  </td>
                  <td>
                    {filters.rowId === shiftRecurrenceId
                      ? (
                        <div>
                          <DatePicker
                            name="startTime"
                            autoComplete="off"
                            selected={filters.startTime}
                            className="startTime form-control employee-time-sheet-date"
                            onChange={handleStartDateChange}
                            placeholderText="Time"
                            showTimeSelect
                            showTimeSelectOnly
                            dateFormat="hh:mm aa"
                            timeCaption="time"
                            timeIntervals={15}
                          />
                          {filters.isStartDateEmpty && (<div className="text-danger">{t('Common.Requried')}</div>)}
                        </div>

                      )
                      : <span>{startDateTimeUtc && moment.utc(startDateTimeUtc).local().format('HH:mm')}</span>
                    }
                  </td>
                  <td>
                    {filters.rowId === shiftRecurrenceId
                      ? (
                        <div>
                          <DatePicker
                            name="startShift"
                            autoComplete="off"
                            className="endShift form-control employee-time-sheet-date"
                            selected={filters.endTime}
                            placeholderText="Time"
                            showTimeSelect
                            showTimeSelectOnly
                            dateFormat="hh:mm:aa"
                            timeCaption="time"
                            timeIntervals={15}
                            onChange={handleEndDateChange}
                          />
                          {filters.isEndDateEmpty && (<div className="text-danger">{t('Common.Requried')}</div>)}
                        </div>
                      )
                      : <span>{endDateTimeUtc && moment.utc(endDateTimeUtc).local().format('HH:mm')}</span>
                    }
                  </td>
                  <td>
                    <span>{calculatedTime}</span>
                  </td>
                  <td>
                    <span>{requiredHours}</span>
                  </td>
                  {!isUser && (
                    <td>
                      <span>{designation}</span>
                    </td>
                  )}
                  <td>
                    <span>{variance}</span>
                  </td>
                  <td>
                    <div>
                      {isUser || managerKey === 'mytimesheet'
                        ? filters.rowId > 0 && filters.rowId === shiftRecurrenceId
                          ? (
                            <span className="action-icon view danger-bg">
                              <button
                                className="no-style"
                                type="button"
                                onClick={() => updateEmployeeShift(filters.rowId, date)}
                              >
                                <img
                                  title={t('TimeSheet.UpdateShiftTime')}
                                  src={Tick}
                                  alt={t('TimeSheet.UpdateShiftTime')}
                                />
                              </button>
                            </span>
                          )
                          : (
                            <div>
                              {status === 1 && (
                                <div className="shift-request-tooltip">
                                  <img
                                    src={ExclamationIcon}
                                    alt={t('TimeSheet.RequestShiftTime')}
                                    height="30px"
                                  />
                                  <div className="tooltiptext">{requestDescription}</div>
                                </div>
                              )}
                              {status !== 2
                                ? (
                                  <span className="action-icon view danger-bg">
                                    <button
                                      className="no-style"
                                      type="button"
                                      // eslint-disable-next-line max-len
                                      onClick={() => editEmployeeShift(shiftRecurrenceId, startDateTimeUtc, endDateTimeUtc)}
                                    >
                                      <img
                                        title={t('TimeSheet.EditShiftTime')}
                                        src={EditIcon}
                                        alt={t('TimeSheet.EditShiftTime')}
                                      />
                                    </button>
                                  </span>
                                ) : <span>{t('TimeSheet.PendingApproval')}</span>}
                            </div>
                          )
                        : null}

                      {!isUser && status === 0 && managerKey === 'myteam' && createdByUserId === userService.getUserId() && (
                        <span className="action-icon view danger-bg">
                          <button
                            className="no-style"
                            type="button"
                            onClick={() => requestShiftTime(shiftRecurrenceId, userId)}
                          >
                            <img
                              title={t('TimeSheet.RequestShiftTime')}
                              src={EditIcon}
                              alt={t('TimeSheet.RequestShiftTime')}
                            />
                          </button>
                        </span>
                      )}
                      {!isUser && status === 1 && (
                        <div className="shift-request-tooltip">
                          <img
                            src={ExclamationIcon}
                            alt={t('TimeSheet.RequestShiftTime')}
                            height="30px"
                          />
                          <div className="tooltiptext">{requestDescription}</div>
                        </div>
                      )}

                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </Table>
      </div>
      <div className="pagination-wrapper">
        <PaginationAndPageNumber
          totalPageCount={Math.ceil(totalRecords / pageSize)}
          totalElementCount={totalRecords}
          updatePageNum={updatePageNum}
          updatePageCount={updatePageCount}
          currentPageNum={pageIndex}
          recordPerPage={pageSize}
        />
      </div>
    </>
  );
};

export default withTranslation()(timeSheetTable);
