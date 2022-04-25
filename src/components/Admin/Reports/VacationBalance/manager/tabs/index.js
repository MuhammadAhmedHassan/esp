import React, { useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "./style.scss";
import { ReactComponent as PrintIcon } from "../../../../../../Images/Icons/print.svg";
import { ReactComponent as DownloadsIcon } from "../../../../../../Images/Icons/downloadIcon.svg";
import HeaderForm from "../filter/form";

const ManagerTabs = ({
  isOverTimeTableLoading,
  overTimeTableDownloadRequest,
  handleSearchReport,
  filters,
  setFilters,
  handleFilterChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  userRolesDetails,
  emp,
  handlePrint,
  allLeavesTypes,
}) => {
  const [key, setKey] = useState(1);
  const handleSelectType = (key) => {
    setKey(key);
  };

  return (
    <div className="d-flex tab-container justify-content-between">
      <div className="">
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
          onSelect={handleSelectType}
        >
          <Tab
            eventKey={1}
            title="My Over Time"
            className={"mr-1 tabs-title-text"}
          >
            <HeaderForm
              handleSearchReport={handleSearchReport}
              isOverTimeTableLoading={isOverTimeTableLoading}
              filters={filters}
              setFilters={setFilters}
              handleFilterChange={handleFilterChange}
              emp={emp}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              typeKey={key}
              allLeavesTypes={allLeavesTypes}
            />
          </Tab>
          <Tab eventKey={2} title="My Team Over Time">
            <HeaderForm
              handleSearchReport={handleSearchReport}
              isOverTimeTableLoading={isOverTimeTableLoading}
              filters={filters}
              setFilters={setFilters}
              handleFilterChange={handleFilterChange}
              emp={emp}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              typeKey={key}
              allLeavesTypes={allLeavesTypes}
            />
          </Tab>
        </Tabs>
      </div>
      <div className="d-flex align-items-start mt-3 actionbtn">
        <div className="action-btn-primary mx-2">
          <DownloadsIcon
            style={{ cursor: "pointer" }}
            onClick={overTimeTableDownloadRequest}
          />
        </div>
        <div className="action-btn-secondary">
          <PrintIcon style={{ cursor: "pointer" }} onClick={handlePrint} />
        </div>
      </div>
    </div>
  );
};

export default ManagerTabs;
