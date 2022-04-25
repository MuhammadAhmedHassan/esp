import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Form, Button } from "react-bootstrap";
import "./style.scss";
import { commonService } from '../../../../../../services/common.service';


const HeaderForm = ({
  typeKey,
  filters,
  setFilters,
  handleSearchReport,
  isHoursTableLoading,
  handleFilterChange,
  emp,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const data = [
    {
      id: 1,
      year: 2020,
    },
  ];

  return (
    <div className="manager-container">
      <Form
        className="form-row"
        onSubmit={(e) => {
          handleSearchReport(e);
        }}
      >
        {typeKey == 2 && (
          <Form.Group
            controlId="exampleForm.SelectCustom"
            className="col-lg-3 col-md-6"
          >
            <Form.Label>Select Employee</Form.Label>
            <Form.Control
              name="employeesId"
              as="select"
              className="dropDownClass"
              onChange={handleFilterChange}
            >
              {emp &&
                emp.userList.map((empid) => (
                  <option key={empid.id} value={empid.id}>
                    {empid.firstName} {empid.lastName}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        )}

        <Form.Group
          controlId="exampleForm.SelectCustom"
          className="col-lg-3 col-md-6"
        >
          <Form.Label>Start Date</Form.Label>
          <DatePicker
            autoComplete="off"
            name="startDate"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText={commonService.localizedDateFormat()}
            dateFormat={commonService.localizedDateFormatForPicker()}
            className="form-control date-picker-icon"
            pattern="\d{2}\/\d{2}/\d{4}"
            required
          />
        </Form.Group>
        <Form.Group
          controlId="exampleForm.SelectCustom"
          className="col-lg-3 col-md-6"
        >
          <Form.Label>End Date</Form.Label>
          <DatePicker
            autoComplete="off"
            name="startDate"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText={commonService.localizedDateFormat()}
            dateFormat={commonService.localizedDateFormatForPicker()}
            className="form-control date-picker-icon"
            pattern="\d{2}\/\d{2}/\d{4}"
            required
          />
        </Form.Group>
        <div className="col-lg-3 col-md-6 d-flex justify-content-center flex-column">
          <Button className="" type="submit">
            {" "}
            Search{" "}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default HeaderForm;
