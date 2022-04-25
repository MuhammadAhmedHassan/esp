import React, { useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "./style.scss";
import { ReactComponent as PrintIcon } from "../../../../../Images/Icons/print.svg";
import { ReactComponent as DownloadsIcon } from "../../../../../Images/Icons/downloadIcon.svg";
import HeaderForm from "../filter/form";

const ManagerTabs = ({
  filters,
  setFilters,
  handleSearchReport,
  isHoursTableLoading,
  handleFilterChange,
  emp,
  hoursTableDownloadRequest,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handlePrint,
  userRolesDetails
}) => {
  const [key, setKey] = useState(1);
  const handleSelectType = (key) => {
    setKey(key);
    if(key===1){
      setFilters((prevState)=>{
        return{...prevState,
          employeesId:userRolesDetails.userId}
      })
      console.log(userRolesDetails.userId);
    }
  };

  return (
    <div className="d-flex tab-container">
      <div className="">
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          // onSelect={(k) => setKey(k)}
          className="mb-3"
          onSelect={(k)=>handleSelectType(k)}
        >
          <Tab
            eventKey={1}
            title="My Hours Worked"
            className={"mr-1 tabs-title-text"}
          >
            <HeaderForm
              handleSearchReport={handleSearchReport}
              isHoursTableLoading={isHoursTableLoading}
              filters={filters}
              setFilters={setFilters}
              handleFilterChange={handleFilterChange}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              emp={emp}
              typeKey={key}
            />
          </Tab>
          <Tab eventKey={2} title="My Team Hours Worked">
            <HeaderForm
              handleSearchReport={handleSearchReport}
              isHoursTableLoading={isHoursTableLoading}
              filters={filters}
              setFilters={setFilters}
              handleFilterChange={handleFilterChange}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              emp={emp}
              typeKey={key}
            />
          </Tab>
        </Tabs>
      </div>
      <div className="d-flex align-items-start mt-3 actionbtn">
        <div className="action-btn-primary mx-2">
          <DownloadsIcon
            style={{ cursor: "pointer" }}
            onClick={hoursTableDownloadRequest}
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
