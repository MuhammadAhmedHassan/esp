import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab } from 'react-bootstrap';
import ManagerOverTime from './ManagerOverTime';
import MyTeamOverTime from './MyTeamOverTime';

function ManagerOverTimeIndex({
  loading, tableData, pagination, getSearchOvertimeReport, resetFields,
  onDownloadFile, hasData,
}) {
  const { t } = useTranslation();
  const managerRef = useRef();
  const managerTeamRef = useRef();
  const [key, setKey] = useState('my_over_time');
  
  const handleTabChange = (selectedKey) => {
    if (resetFields) resetFields();
    setKey(selectedKey);
    if (managerRef.current && managerRef.current.getData && selectedKey === 'my_over_time') {
      managerRef.current.getData();
    } else if (managerTeamRef.current && managerTeamRef.current.getData && selectedKey === 'my_team_over_time') {
      managerTeamRef.current.getData();
    }
  };

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={handleTabChange}
      className="mb-3"
    >
      <Tab eventKey="my_over_time" title={t('ManagerOverTime.MyOverTime')}>
        <ManagerOverTime
          ref={managerRef}
          onDownloadFile={onDownloadFile}
          loading={loading}
          tableData={tableData}
          pagination={pagination}
          getSearchOvertimeReport={getSearchOvertimeReport}
          resetParentFields={resetFields}
          hasData={hasData}
        />
      </Tab>
      <Tab eventKey="my_team_over_time" title={t('ManagerOverTime.MyTeamOverTime')}>
        <MyTeamOverTime
          ref={managerTeamRef}
          onDownloadFile={onDownloadFile}
          loading={loading}
          tableData={tableData}
          pagination={pagination}
          getSearchOvertimeReport={getSearchOvertimeReport}
          resetParentFields={resetFields}
          hasData={hasData}
        />
      </Tab>
    </Tabs>
  );
}

export default ManagerOverTimeIndex;
