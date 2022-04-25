import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Form, Button } from 'react-bootstrap';
import './style.scss';
import { commonService } from '../../../../../../services/common.service';

const EmployeeHeader = ({
  handleSearchReport,
  isOverTimeTableLoading,
  overTimeTableDownloadRequest,
  filters,
  setFilters,
  handleFilterChange,
  emp,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handlePrint,
  allLeavesTypes = { allLeavesTypes },
}) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [exception, setException] = useState({});

  const status = [
    { id: 0, value: 'All' },
    { id: 1, value: 'Approved' },
    { id: 2, value: 'Pending' },
    { id: 3, value: 'Rejected' },
  ];

  const handleExceptionChange = (event) => {
    setException(event.target.value);
  };
  const handleYearDropDown = (event) => {
    setYear(event.target.value);
  };
  const data = [...Array(5).keys()].map(i => ({ id: i, year: new Date().getFullYear() - i }));

  return (
    <div className="employee">
      <Form className="employee-row" onSubmit={e => handleSearchReport(e)}>
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
            {allLeavesTypes
              && allLeavesTypes.data
              && allLeavesTypes.data.map(types => (
                <option key={types.id} value={types.id}>
                  {types.name}
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
