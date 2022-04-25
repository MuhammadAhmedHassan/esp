import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from 'react-bootstrap';
import MyOrganisationExceptionReport from './MyOrganisationExceptionReport';
import MyExceptionReport from './AdminExceptionReport';


function AdminExceptionReport({
  loading, allExceptions,
  getExceptionReport, onDownloadFile, resetTableData,
}) {
  const { t } = useTranslation();
  const myExceptionRef = useRef();
  const myOrganisationExceptionRef = useRef();
  const [key, setKey] = useState('my_exception_report');

  const handleTabChange = (selectedKey) => {
    resetTableData();
    setKey(selectedKey);
    if (myExceptionRef.current && myExceptionRef.current.reset) {
      myExceptionRef.current.reset();
    }
    if (myOrganisationExceptionRef.current && myOrganisationExceptionRef.current.reset) {
      myOrganisationExceptionRef.current.reset();
    }

    // if (selectedKey === 'my_exception_report' && myExceptionRef.current && myExceptionRef.current.getData) {
    //   myExceptionRef.current.getData();
    // }
  };

  const onResetBtnClick = () => { if (resetTableData) resetTableData(); };
  
  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={handleTabChange}
      className="mb-3 custom-tabs"
    >
      <Tab eventKey="my_exception_report" title={t('Report.ExceptionReport.MyExceptionReport')}>
        <MyExceptionReport
          ref={myExceptionRef}
          loading={loading}
          onDownloadFile={onDownloadFile}
          allExceptions={allExceptions}
          getExceptionReport={getExceptionReport}
          resetTableData={resetTableData}
        />
      </Tab>
      <Tab eventKey="my_organisation_exception_report" title={t('Report.ExceptionReport.MyOrganisationExceptionReport')}>
        <MyOrganisationExceptionReport
          ref={myOrganisationExceptionRef}
          loading={loading}
          onDownloadFile={onDownloadFile}
          allExceptions={allExceptions}
          getExceptionReport={getExceptionReport}
          onResetBtnClick={onResetBtnClick}
          resetTableData={resetTableData}
        />
      </Tab>
    </Tabs>
  );
}

export default AdminExceptionReport;
