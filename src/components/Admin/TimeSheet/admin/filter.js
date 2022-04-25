import React from 'react';
import { Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { withTranslation } from 'react-i18next';
import { commonService } from '../../../../services/common.service';


const Filters = ({
  filtersList,
  filterdates,
  handleSearchAdminTeamTimeSheet,
  handleFilterChange,
  filters,
  clearAdminTeamFilterChange,
  clearFilterAdminTeamStatus,
  t,
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
    <Form className="row">
      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg-3 col-md-6"
      >
        <Form.Label>Division</Form.Label>
        <Form.Control
          name="divisionId"
          as="select"
          value={filters.divisionId}
          onChange={handleFilterChange}
        >
          {divisionsList.map(division => (
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
          value={filters.businessUnitId}
          onChange={handleFilterChange}
        >
          {businessUnitList.map(business => (
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
          value={filters.departmentId}
          onChange={handleFilterChange}
        >
          {departmentList.map(departmentItem => (
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
        <Form.Control
          name="teamId"
          as="select"
          value={filters.teamId}
          onChange={handleFilterChange}
        >
          {teamsList.map(teams => (
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
          value={filters.managerId}
          onChange={handleFilterChange}
        >
          {managerList.map(primaryManagerType => (
            <option
              key={primaryManagerType.id}
              value={primaryManagerType.id}
            >
              {primaryManagerType.firstName}
              {' '}
              {primaryManagerType.lastName}
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
          value={filters.employeesId}
          onChange={handleFilterChange}
        >
          {userList.map(empItem => (
            <option key={empItem.id} value={empItem.id}>
              {empItem.firstName}
              {' '}
              {empItem.lastName}
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
          value={filters.countryId}
          onChange={handleFilterChange}
        >
          {countryList.map(country => (
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
        <Form.Control
          name="stateId"
          as="select"
          value={filters.stateId}
          onChange={handleFilterChange}
        >
          {statesList.map(state => (
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
        <Form.Control
          name="cityId"
          as="select"
          value={filters.city}
          onChange={handleFilterChange}
        >
          {cityList.map((city, index) => (
            // eslint-disable-next-line react/no-array-index-key
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
          value={filters.workLocationId}
          onChange={handleFilterChange}
        >
          {workLocationList.map(worklocation => (
            <option key={worklocation.id} value={worklocation.id}>
              {worklocation.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
       
      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg col-md-6"
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
        />
      </Form.Group>
      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg col-md-6"
      >
        <Form.Label>End Date</Form.Label>
        <DatePicker
          autoComplete="off"
          name="endDate"
          selected={endDate}
          onChange={date => setEndDate(date)}
          placeholderText={commonService.localizedDateFormat()}
          dateFormat={commonService.localizedDateFormatForPicker()}
          className="form-control date-picker-icon"
          pattern="\d{2}\/\d{2}/\d{4}"
        />
      </Form.Group>
      <div className="d-flex justify-content-center search-btn mt-4 col-12">
        <div className="px-3">
          <Button className="mx-0" type="button" onClick={handleSearchAdminTeamTimeSheet}>
            {t('Common.Search')}
          </Button>
        </div>
        {!clearFilterAdminTeamStatus
          ? (
            <div className="px-3">
              <Button className="mx-0" type="button" onClick={clearAdminTeamFilterChange}>
                {t('Common.ClearFilter')}
              </Button>
            </div>
          ) : null
            }
      </div>
    </Form>
  );
};

export default withTranslation()(Filters);
