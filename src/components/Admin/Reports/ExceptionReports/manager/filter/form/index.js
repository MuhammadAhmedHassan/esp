import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Form, Button } from 'react-bootstrap';
import moment from 'moment';
import './style.scss';
import { commonService } from '../../../../../../../services/common.service';


const data = [...Array(5).keys()].map(i => ({ id: i, year: ((new Date()).getFullYear() - i) }));

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
  allExceptionData,
}) => {
  const [year, setYear] = useState((new Date()).getFullYear());
  const [exception, setException] = useState({});
  
  const handleExceptionChange = (event) => {
    setException(event.target.value);
  };

  const handleYearDropDown = (event) => {
    setYear(event.target.value);
  };
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
          <Form.Label>Year</Form.Label>
          <Form.Control
            name="divisionId"
            as="select"
            className="dropDownClass"
            onChange={handleYearDropDown}
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
          <Form.Label>Exception Type</Form.Label>
          <Form.Control
            name="exceptionType"
            as="select"
            className="dropDownClass"
            onChange={handleFilterChange}
          >
            <option value="0">All</option>
            {allExceptionData && allExceptionData.map(division => (
              <option key={division.id} value={division.id}>
                {division.type}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        {typeKey == 2
          ? (
            <div className="col-lg-3 col-md-6 d-flex justify-content-center flex-column mt-3">
              <Button className="" type="submit">
                {' '}
                Search
                {' '}
              </Button>
            </div>
          )
          : (
            <div className="d-flex justify-content-end flex-column mt-3 ml-lg-auto">
              <Button className="" type="submit">
                {' '}
                Search
                {' '}
              </Button>
            </div>
          )
        }
      </Form>
    </div>
  );
};

export default HeaderForm;
