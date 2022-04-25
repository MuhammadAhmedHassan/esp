import React, {
  forwardRef, useImperativeHandle, useRef, useEffect,
} from 'react';
import FilterForm from '../FilterForm';
import ReportTable from '../ReportTable';
import { userService } from '../../../../services';

const { getUser, getUserId, getFirstLastAndCurrentDateOfTheMonth } = userService;

const AdminReportMyHoursWorked = forwardRef(({
  loading,
  getTimesheet,
  filteredDataByShiftId,
  employeeName,
  shiftViaHoursData,
  allStartDatesOfWeeks,
  shiftTypes,
  schedules,
  // New States
  fromDate,
  toDate,
  filteredByShiftIdAndUtcStartDate,
  dateViaHoursDataObj,
  //
  isAllScheduleSelected,
  isAllShiftTypeSelected,
}, ref) => {
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
  
  useImperativeHandle(
    ref,
    () => ({
      reset() {
        if (filtersRef.current && filtersRef.current.reset) {
          filtersRef.current.reset();
        }
      },
    }),
    [],
  );

  return (
    <div>
      <FilterForm
        ref={filtersRef}
        loading={loading}
        getTimesheet={getTimesheet}
        adminReport
        shiftTypes={shiftTypes}
        schedules={schedules}
      />
      <ReportTable
        loading={loading}
        filteredDataByShiftId={filteredDataByShiftId}
        userName={employeeName || getUser().user_name || getUser().userName}
        shiftViaHoursData={shiftViaHoursData}
        allStartDatesOfWeeks={allStartDatesOfWeeks}
        // New States
        fromDate={fromDate}
        toDate={toDate}
        filteredByShiftIdAndUtcStartDate={filteredByShiftIdAndUtcStartDate}
        dateViaHoursDataObj={dateViaHoursDataObj}
        //
        isAllScheduleSelected={isAllScheduleSelected}
        isAllShiftTypeSelected={isAllShiftTypeSelected}
      />
    </div>
  );
});

export default AdminReportMyHoursWorked;
