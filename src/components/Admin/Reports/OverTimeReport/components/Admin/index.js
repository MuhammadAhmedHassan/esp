import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab } from 'react-bootstrap';
import AdminOverTime from './AdminOverTime';
import AdminMyOrganisationOverTime from './AdminMyOrganisationOverTime';

function AdminOverTimeIndex({
  loading, tableData, pagination, getSearchOvertimeReport, resetFields,
  onDownloadFile, hasData,
}) {
  const { t } = useTranslation();
  const adminRef = useRef();
  const adminOrgRef = useRef();
  const [key, setKey] = useState('my_over_time');
  
  const handleTabChange = (selectedKey) => {
    resetFields();
    setKey(selectedKey);
    if (adminRef.current && adminRef.current.getData && selectedKey === 'my_over_time') {
      adminRef.current.getData();
    } else if (adminOrgRef.current && adminOrgRef.current.getData && selectedKey === 'my_organisation_over_time') {
      adminOrgRef.current.getData();
    }
  };
  
  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={handleTabChange}
      className="mb-3"
    >
      <Tab eventKey="my_over_time" title={t('AdminOverTime.MyOverTime')}>
        <AdminOverTime
          ref={adminRef}
          onDownloadFile={onDownloadFile}
          loading={loading}
          tableData={tableData}
          pagination={pagination}
          getSearchOvertimeReport={getSearchOvertimeReport}
          resetParentFields={resetFields}
          hasData={hasData}
        />
      </Tab>
      <Tab eventKey="my_organisation_over_time" title={t('AdminOverTime.MyOrganisationOverTime')}>
        <AdminMyOrganisationOverTime
          ref={adminOrgRef}
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

export default AdminOverTimeIndex;
