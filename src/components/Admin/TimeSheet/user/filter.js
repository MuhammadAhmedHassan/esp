import React from 'react';
import { Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { withTranslation } from 'react-i18next';
import { commonService } from '../../../../services/common.service';

const Filters = ({
  isManager = false,
  isUser = false,
  filterdates,
  handleSearchTimeSheet, 
  clearFilterChange,
  filters,
  t,
}) => {  
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
        className={`${isUser ? 'col-lg col-md-6' : 'col-lg col-md-6'}`}
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

        {filters.isFilterStartDateEmpty ? <div className="text-danger">{t('Common.Requried')}</div> : null}
      </Form.Group>
      <Form.Group
        controlId="exampleForm.SelectCustom"
        className={`${isUser ? 'col-lg col-md-6' : 'col-lg col-md-6'}`}
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
        {filters.isFilterEndDateEmpty && (<div className="text-danger">{t('Common.Requried')}</div>)}

      </Form.Group>
      {
        !isManager && (
          <div className="d-flex justify-content-center search-btn mt-4">
            <div className="px-3">
              <Button className="mx-0" type="button" onClick={handleSearchTimeSheet}>
                Search
              </Button>
            </div>
            {startDate || endDate
              ? (
                <div className="px-3">
                  <Button className="mx-0" type="button" onClick={clearFilterChange}>
                    Clear Filter
                  </Button>
                </div>
              ) : null
            }

          </div>
        )
      }
    </Form>
  );
};

export default withTranslation()(Filters);
