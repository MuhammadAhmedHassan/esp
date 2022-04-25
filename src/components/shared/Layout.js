/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import LayoutRoutes from './LayoutRoutes';

export default function Layout(props) {
  const [isSidebarEnabled, setSidebarEnabled] = useState(false);
  const [breadcrumbData, setBreadcrumbData] = useState({ title: '', link: '' });
  return (
    <>
      <LayoutRoutes
        {...props}
        isSidebarEnabled={isSidebarEnabled}
        breadcrumbData={breadcrumbData}
        setSidebarEnabled={setSidebarEnabled}
        setBreadcrumbData={setBreadcrumbData}
      />
    </>
  );
}
