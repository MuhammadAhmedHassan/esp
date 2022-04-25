import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Form, Button } from 'react-bootstrap';
import Api from '../../../../../common/Api';
import { userService } from '../../../../../../services';
import './style.scss';
import { commonService } from '../../../../../../services/common.service';

const EmployeeHeader = ({
  filters,
  setFilters,
  handleSearchReport,
  isHoursTableLoading,
  handleFilterChange,
  filterdates,
  hoursWorkedData,
  combineByshiftLabel,
  combineByWeekData,
  emp,
}) => {
  const {
    startDate, setStartDate, endDate, setEndDate,
  } = filterdates;
  const [year, setYear] = useState((new Date()).getFullYear());
  const [exception, setException] = useState({});

  const handleExceptionChange = (event) => {
    setException(event.target.value);
  };
  const handleYearDropDown = (event) => {
    setYear(event.target.value);
  };
  const data = [...Array(5).keys()].map(i => ({ id: i, year: ((new Date()).getFullYear() - i) }));
  const exceptionData = [
    {
      id: 1,
      exception: 'ME',
    },
    {
      id: 2,
      exception: 'LC',
    },
    {
      id: 3,
      exception: 'NI',
    },
  ];

  const submitRequest = () => {};
  return (
    <div className="employee">
      <Form className="employee-row" onSubmit={e => handleSearchReport(e)}>
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
            name="divisionId"
            as="select"
            className="dropDownClass"
            onChange={handleYearDropDown}
          >
            {exceptionData.map(division => (
              <option key={division.id} value={division.exception}>
                {division.exception}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        
        <div className="col-lg-3 col-md-6 d-flex justify-content-center flex-column">
          <Button className="" type="submit">
            {' '}
            Search
            {' '}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EmployeeHeader;
