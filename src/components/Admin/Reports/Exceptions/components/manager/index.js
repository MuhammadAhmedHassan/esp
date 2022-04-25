import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from 'react-bootstrap';
import MyTeamExceptionReport from './MyTeamExceptionReport';
import MyExceptionReport from './MyExceptionReport';


function ManagerExceptionReport({
  loading, allExceptions,
  getExceptionReport,
  onDownloadFile, resetTableData,
}) {
  const { t } = useTranslation();
  const myReportRef = useRef();
  const myTeamReportRef = useRef();
  const [key, setKey] = useState('my_exception_report');
  
  const handleTabChange = (selectedKey) => {
    resetTableData();
    setKey(selectedKey);
    if (myReportRef.current && myReportRef.current.reset) {
      myReportRef.current.reset();
    }
    if (myTeamReportRef.current && myTeamReportRef.current.reset) {
      myTeamReportRef.current.reset();
    }
  };

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={handleTabChange}
      className="mb-3 custom-tabs"
    >
      <Tab eventKey="my_exception_report" title={t('Report.ExceptionReport.MyExceptionReport')}>
        <MyExceptionReport
          ref={myReportRef}
          loading={loading}
          onDownloadFile={onDownloadFile}
          allExceptions={allExceptions}
          getExceptionReport={getExceptionReport}
          resetTableData={resetTableData}
        />
      </Tab>
      <Tab eventKey="my_team_exception_report" title={t('Report.ExceptionReport.MyTeamExceptionReport')}>
        <MyTeamExceptionReport
          ref={myTeamReportRef}
          loading={loading}
          onDownloadFile={onDownloadFile}
          allExceptions={allExceptions}
          getExceptionReport={getExceptionReport}
          resetTableData={resetTableData}
        />
      </Tab>
    </Tabs>
  );
}

export default ManagerExceptionReport;
