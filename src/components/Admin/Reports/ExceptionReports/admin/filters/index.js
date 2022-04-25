import React from "react";
import { Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "./style.scss";
import { commonService } from '../../../../../../services/common.service';

const Filters = ({
  filtersList,
  filterdates,
  handleSearchTimeSheet,
  handleFilterChange,
}) => {
  const {
    divisionsList = [],
    businessUnitList = [],
    departmentList = [],
    teamsList = [],
    managerList = [],
    userList = [],
    countryList = [],
    statesList = [],
    cityList = [],
    workLocationList = [],
  } = filtersList;
  const {
    startDate = null,
    endDate = null,
    setStartDate,
    setEndDate,
  } = filterdates;

  return (
    <Form className="row" onSubmit={(e) => handleSearchTimeSheet(e)}>
      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg-3 col-md-6"
      >
        <Form.Label>Division</Form.Label>
        <Form.Control
          name="divisionId"
          as="select"
          onChange={handleFilterChange}
        >
          {divisionsList.map((division) => (
            <option key={division.id} value={division.id}>
              {division.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg-3 col-md-6"
      >
        <Form.Label>Business Unit</Form.Label>
        <Form.Control
          name="businessUnitId"
          as="select"
          onChange={handleFilterChange}
        >
          {businessUnitList.map((business) => (
            <option key={business.id} value={business.id}>
              {business.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg-3 col-md-6"
      >
        <Form.Label>Department</Form.Label>
        <Form.Control
          name="departmentId"
          as="select"
          onChange={handleFilterChange}
        >
          {departmentList.map((departmentItem) => (
            <option key={departmentItem.id} value={departmentItem.id}>
              {departmentItem.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg-3 col-md-6"
      >
        <Form.Label>Team</Form.Label>
        <Form.Control name="teamId" as="select" onChange={handleFilterChange}>
          {teamsList.map((teams) => (
            <option key={teams.id} value={teams.id}>
              {teams.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg-3 col-md-6"
      >
        <Form.Label>Manager</Form.Label>
        <Form.Control
          name="managerId"
          as="select"
          onChange={handleFilterChange}
        >
          {managerList.map((primaryManagerType) => (
            <option key={primaryManagerType.id} value={primaryManagerType.id}>
              {primaryManagerType.firstName} {primaryManagerType.lastName}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg-3 col-md-6"
      >
        <Form.Label>Employee</Form.Label>
        <Form.Control
          name="employeesId"
          as="select"
          onChange={handleFilterChange}
        >
          {userList.map((empItem) => (
            <option key={empItem.id} value={empItem.id}>
              {empItem.firstName} {empItem.lastName}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg-3 col-md-6"
      >
        <Form.Label>Country</Form.Label>
        <Form.Control
          name="countryId"
          as="select"
          onChange={handleFilterChange}
        >
          {countryList.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg-3 col-md-6"
      >
        <Form.Label>State</Form.Label>
        <Form.Control name="stateId" as="select" onChange={handleFilterChange}>
          {statesList.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg-3 col-md-6"
      >
        <Form.Label>City</Form.Label>
        <Form.Control name="cityId" as="select" onChange={handleFilterChange}>
          {cityList.map((city, index) => (
            <option key={index} value={city.name}>
              {city.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg-3 col-md-6"
      >
        <Form.Label>Work Location</Form.Label>
        <Form.Control
          name="locationId"
          as="select"
          onChange={handleFilterChange}
        >
          {workLocationList.map((worklocation) => (
            <option key={worklocation.id} value={worklocation.id}>
              {worklocation.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group
        controlId="exampleForm.SelectCustom"
        className={"col-lg-3 col-md-6"}
      >
        <Form.Label>Start Date</Form.Label>
        <DatePicker
          autoComplete="off"
          name="startDate"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          placeholderText={commonService.localizedDateFormat()}
          dateFormat={commonService.localizedDateFormatForPicker()}
          className="form-control-datePicker date-picker-icon"
          pattern="\d{2}\/\d{2}/\d{4}"
          required
        />
      </Form.Group>
      <Form.Group
        controlId="exampleForm.SelectCustom"
        className={"col-lg-3 col-md-6"}
      >
        <Form.Label>End Date</Form.Label>
        <DatePicker
          autoComplete="off"
          name="endDate"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          placeholderText={commonService.localizedDateFormat()}
          dateFormat={commonService.localizedDateFormatForPicker()}
          className="form-control-datePicker date-picker-icon"
          pattern="\d{2}\/\d{2}/\d{4}"
          required
        />
      </Form.Group>
      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg-3 col-md-6"
      >
        <Button className="mx-0 w-100" type="submit">
          Search
        </Button>
      </Form.Group>
    </Form>
  );
};

export default Filters;
