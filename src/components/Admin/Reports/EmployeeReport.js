import React, { useRef, useEffect } from 'react';
import { userService } from '../../../services';
import FilterForm from './FilterForm';
import ReportTable from './ReportTable';

const { getUser, getUserId, getFirstLastAndCurrentDateOfTheMonth } = userService;

function Reports({
  getTimesheet,
  loading,
  filteredDataByShiftId,
  shiftViaHoursData,
  shiftTypes,
  schedules,
  // New states
  fromDate,
  toDate,
  filteredByShiftIdAndUtcStartDate,
  dateViaHoursDataObj,
  fetchFiltersData,
  //
  isAllScheduleSelected,
  isAllShiftTypeSelected,
}) {
  const filtersRef = useRef();
  const { firstDateOfMonth, currentDateOfMonth } = getFirstLastAndCurrentDateOfTheMonth();
  const defaultFiltersValue = ({
    startDate: firstDateOfMonth,
    endDate: currentDateOfMonth,
    userId: getUserId(),
    scheduleId: 0,
    shiftId: 1,
  });

  useEffect(() => {
    if (fetchFiltersData) fetchFiltersData({ showAssignedSchedules: true });
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
        ...defaultFiltersValue,
      },
    );
  }, []);
  
  return (
    <div className="container-fluid">
      <div className="card_layout">
        <FilterForm
          ref={filtersRef}
          loading={loading}
          getTimesheet={getTimesheet}
          shiftTypes={shiftTypes}
          schedules={schedules}
        />

        <ReportTable
          loading={loading}
          filteredDataByShiftId={filteredDataByShiftId}
          userName={getUser().user_name || getUser().userName}
          shiftViaHoursData={shiftViaHoursData}
          // New State
          fromDate={fromDate}
          toDate={toDate}
          filteredByShiftIdAndUtcStartDate={filteredByShiftIdAndUtcStartDate}
          dateViaHoursDataObj={dateViaHoursDataObj}
          //
          isAllScheduleSelected={isAllScheduleSelected}
          isAllShiftTypeSelected={isAllShiftTypeSelected}
        />
      </div>
    </div>
  );
}

export default Reports;
