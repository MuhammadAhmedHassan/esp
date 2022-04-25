import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Form, Button } from 'react-bootstrap';
import moment from 'moment';
import './style.scss';
import { commonService } from '../../../../../../../services/common.service';

const data = [...Array(5).keys()].map(i => ({ id: i, year: ((new Date()).getFullYear() - i) }));

const HeaderForm = ({
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
  typeKey,
  allLeavesTypes,
}) => {
  const [year, setYear] = useState((new Date()).getFullYear());
  const [exception, setException] = useState({});
  
  const handleYearDropDown = (event) => {
    setYear(event.target.value);
  };
  console.log(typeKey, 'typeKey');
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
              {emp
                && emp.userList.map(empid => (
                  <option key={empid.id} value={empid.id}>
                    {empid.firstName}
                    {' '}
                    {empid.lastName}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        )}

        <Form.Group
          controlId="exampleForm.SelectCustom"
          className="col-lg-3 col-md-6"
        >
          <Form.Label>Select Year</Form.Label>
          <Form.Control
            name="year"
            as="select"
            className="dropDownClass"
            onChange={handleFilterChange}
          >
            {data.map(division => (
              <option key={division.id} value={division.year}>
                {division.year}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group
          controlId="exampleForm.SelectCustom"
          className="col-lg-3 col-md-6"
        >
          <Form.Label>Start Date</Form.Label>
          <DatePicker
            autoComplete="off"
            name="startDate"
            selected={startDate}
            onChange={date => setStartDate(date)}
            placeholderText={commonService.localizedDateFormat()}
            dateFormat={commonService.localizedDateFormatForPicker()}
            className="form-control date-picker-icon"
            pattern="\d{2}\/\d{2}/\d{4}"
            minDate={new Date(`01/01/${year}`)}
            maxDate={new Date(`12/31/${year}`)}
            value={new Date(`01/01/${year}`)}
            required
          />
        </Form.Group>
        <Form.Group
          controlId="exampleForm.SelectCustom"
          className="col-lg-3 col-md-6 "
        >
          <Form.Label>End Date</Form.Label>
          <DatePicker
            autoComplete="off"
            name="startDate"
            selected={endDate}
            onChange={date => setEndDate(date)}
            placeholderText={commonService.localizedDateFormat()}
            dateFormat={commonService.localizedDateFormatForPicker()}
            className="form-control date-picker-icon"
            pattern="\d{2}\/\d{2}/\d{4}"
            minDate={new Date(`01/01/${year}`)}
            maxDate={new Date(`12/31/${year}`)}
            value={new Date(`01/01/${year}`)}
            required
          />
        </Form.Group>

        <Form.Group
          controlId="exampleForm.SelectCustom"
          className="col-lg-3 col-md-6"
        >
          <Form.Label>Leave Type </Form.Label>
          <Form.Control
            name="leaveType"
            as="select"
            className="dropDownClass"
            onChange={handleFilterChange}
          >
            {allLeavesTypes && allLeavesTypes.data && allLeavesTypes
              .data.map(types => (
                <option key={types.id} value={types.id}>
                  {types.name}
                </option>
              ))}
          </Form.Control>
        </Form.Group>
        {typeKey == 1 ? (
          <div className="d-flex justify-content-end px-0 col-12">
            <Button className="mx-0" type="submit">
              {' '}
              Search
              {' '}
            </Button>
          </div>
        ) : (
          <div className="col-lg-3 col-md-6 ml-2" style={{ marginTop: '4%' }}>
            <Button className="mx-0" type="submit">
              {' '}
              Search
              {' '}
            </Button>
          </div>
        )}
      </Form>
      
    </div>
  );
};

export default HeaderForm;
