import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab } from 'react-bootstrap';
import ManagerReportMyHoursWorked from './ManagerReportMyHoursWorked';
import ManagerReportTeamHoursWorked from './ManagerReportTeamHoursWorked';

function ManagerReport({
  loading,
  getTimesheet,
  filteredDataByShiftId,
  employeeName,
  shiftViaHoursData,
  resetTableFilters,
  sortedByWeekNumberAndShiftId,
  shiftTypes,
  schedules,
  // New States
  fromDate,
  toDate,
  filteredByShiftIdAndUtcStartDate,
  dateViaHoursDataObj,
  fetchFiltersData,
  //
  isAllScheduleSelected,
  isAllShiftTypeSelected,
}) {
  const { t } = useTranslation();
  const myReportRef = useRef();
  const myTeamRef = useRef();
  const [key, setKey] = useState('my_hours_worked');

  const onTabChange = (selectedKey) => {
    resetTableFilters();
    setKey(selectedKey);
    if (myReportRef.current && myReportRef.current.reset) {
      myReportRef.current.reset();
    }
    if (myTeamRef.current && myTeamRef.current.reset) {
      myTeamRef.current.reset();
    }
    if (selectedKey === 'my_hours_worked') {
      fetchFiltersData({ showAssignedSchedules: true });
    } else {
      fetchFiltersData({ showAssignedSchedules: false });
    }
  };

  useEffect(() => {
    fetchFiltersData({ showAssignedSchedules: true });
  }, []);

  return (
    <div className="container-fluid">
      <div className="card_layout">
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={onTabChange}
          className="mb-3"
        >
          <Tab eventKey="my_hours_worked" title={t('Reports.HoursReport.MyHoursWorked')} disabled={loading}>
            <ManagerReportMyHoursWorked
              ref={myReportRef}
              loading={loading}
              getTimesheet={getTimesheet}
              filteredDataByShiftId={filteredDataByShiftId}
              employeeName={employeeName}
              shiftViaHoursData={shiftViaHoursData}
              sortedByWeekNumberAndShiftId={sortedByWeekNumberAndShiftId}
              shiftTypes={shiftTypes}
              schedules={schedules}
              // New States
              fromDate={fromDate}
              toDate={toDate}
              filteredByShiftIdAndUtcStartDate={filteredByShiftIdAndUtcStartDate}
              dateViaHoursDataObj={dateViaHoursDataObj}
              //
              isAllScheduleSelected={isAllScheduleSelected}
              isAllShiftTypeSelected={isAllShiftTypeSelected}
            />
          </Tab>
          <Tab eventKey="my_team_hours_orked" title={t('Reports.HoursReport.MyTeamHoursWorked')} disabled={loading}>
            <ManagerReportTeamHoursWorked
              ref={myTeamRef}
              loading={loading}
              getTimesheet={getTimesheet}
              filteredDataByShiftId={filteredDataByShiftId}
              employeeName={employeeName}
              shiftViaHoursData={shiftViaHoursData}
              sortedByWeekNumberAndShiftId={sortedByWeekNumberAndShiftId}
              shiftTypes={shiftTypes}
              schedules={schedules}
              // New States
              fromDate={fromDate}
              toDate={toDate}
              filteredByShiftIdAndUtcStartDate={filteredByShiftIdAndUtcStartDate}
              dateViaHoursDataObj={dateViaHoursDataObj}
              //
              isAllScheduleSelected={isAllScheduleSelected}
              isAllShiftTypeSelected={isAllShiftTypeSelected}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default ManagerReport;
