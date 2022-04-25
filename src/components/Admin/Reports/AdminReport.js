import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab } from 'react-bootstrap';
import AdminMyReport from './components/AdminMyReport';
import AdminOrganisationReport from './components/AdminOrganisationReport';

function AdminReport({
  loading,
  getTimesheet,
  filteredDataByShiftId,
  employeeName,
  shiftViaHoursData,
  resetTableFilters,
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
  const myOrgReportRef = useRef();
  const [key, setKey] = useState('my_hours_report');
  
  const onTabChange = (selectedKey) => {
    resetTableFilters();
    setKey(selectedKey);
    if (myReportRef.current && myReportRef.current.reset) {
      myReportRef.current.reset();
    }
    if (myOrgReportRef.current && myOrgReportRef.current.reset) {
      myOrgReportRef.current.reset();
    }
    if (selectedKey === 'my_hours_report') {
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
          <Tab eventKey="my_hours_report" title={t('Reports.HoursReport.MyHoursWorked')} disabled={loading}>
            <AdminMyReport
              ref={myReportRef}
              loading={loading}
              getTimesheet={getTimesheet}
              filteredDataByShiftId={filteredDataByShiftId}
              employeeName={employeeName}
              shiftViaHoursData={shiftViaHoursData}
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
          <Tab eventKey="my_organisation_hours_report" title={t('Reports.HoursReport.MyOrganisationHoursReport')} disabled={loading}>
            <AdminOrganisationReport
              ref={myOrgReportRef}
              loading={loading}
              getTimesheet={getTimesheet}
              filteredDataByShiftId={filteredDataByShiftId}
              employeeName={employeeName}
              shiftViaHoursData={shiftViaHoursData}
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

export default AdminReport;
