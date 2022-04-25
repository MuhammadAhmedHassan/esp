import React, {
  useState, useEffect, useImperativeHandle, useRef, forwardRef,
} from 'react';
import FilterForm from './FilterForm';
import ReportTable from './ReportTable';
import { userService } from '../../../services';
import { sendApiRequest } from '../../common/serviceCall/PostApiCall';
import apis from '../../common/Api';

const { getUser } = userService;

const ManagerReportTeamHoursWorked = forwardRef(({
  loading,
  getTimesheet,
  filteredDataByShiftId,
  employeeName,
  shiftViaHoursData,
  sortedByWeekNumberAndShiftId,
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
  
  const [allEmployees, setAllEmployees] = useState([]);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);

  const getAllEmployeesRequestBody = () => ({
    id: getUser().userId,
    languageId: 1,
  });

  const getAllEmployees = async () => {
    try {
      setFetchingEmployees(true);
      const res = await sendApiRequest(
        apis.manageEmp.getemployeebymanagerid,
        'POST',
        getAllEmployeesRequestBody(),
      );
      if (res.statusCode === 200) {
        const employees = res.data;
        setAllEmployees(employees);
      }
      setFetchingEmployees(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllEmployees();
  }, []);

  if (fetchingEmployees) return null;

  return (
    <div>
      <FilterForm
        ref={filtersRef}
        loading={loading}
        getTimesheet={getTimesheet}
        managerTeam
        allEmployees={allEmployees}
        shiftTypes={shiftTypes}
        schedules={schedules}
      />
      <ReportTable
        loading={loading}
        filteredDataByShiftId={filteredDataByShiftId}
        userName={employeeName || getUser().user_name || getUser().userName}
        shiftViaHoursData={shiftViaHoursData}
        sortedByWeekNumberAndShiftId={sortedByWeekNumberAndShiftId}
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

export default ManagerReportTeamHoursWorked;
