import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import FilterForm from '../FilterForm';
import ReportTable from '../ReportTable';
import { userService } from '../../../../services/user.service';

const { getUser } = userService;

const AdminReport = forwardRef(({
  loading,
  getTimesheet,
  filteredDataByShiftId,
  employeeName,
  shiftViaHoursData,
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
        shiftTypes={shiftTypes}
        schedules={schedules}
      />
      <ReportTable
        loading={loading}
        filteredDataByShiftId={filteredDataByShiftId}
        userName={employeeName || getUser().user_name || getUser().userName}
        shiftViaHoursData={shiftViaHoursData}
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

export default AdminReport;
