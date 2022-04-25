import React from 'react';
import { Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { withTranslation } from 'react-i18next';
import { commonService } from '../../../../services/common.service';

const Filters = ({
  filtersList,
  filterdates,
  filters,
  handleSearchManagerTeamTimeSheet,
  handleFilterChange,
  clearManagerTeamFilterChange,
  clearFilterManagerTeamStatus,
  t,
}) => {
  const {
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
      <>
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
            <option key="0" value="0">
              {t('AllText')}
            </option>
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
      </>
      
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
        />

      </Form.Group>
      <Form.Group
        controlId="exampleForm.SelectCustom"
        className="col-lg-3 col-md-6"
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
      <div className="d-flex justify-content-center search-btn col-12">
        <div className="px-3">
          <Button className="mx-0" type="button" onClick={handleSearchManagerTeamTimeSheet}>
            {t('Common.Search')}
          </Button>
        </div>
        {!clearFilterManagerTeamStatus
          ? (
            <div className="px-3">
              <Button className="mx-0" type="button" onClick={clearManagerTeamFilterChange}>
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
