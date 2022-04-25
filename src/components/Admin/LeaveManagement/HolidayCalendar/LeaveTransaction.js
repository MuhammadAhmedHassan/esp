/* eslint-disable no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { withTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap';

class LeaveTransaction extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { leaveCalendarEventDetails, t } = this.props;
    return (
      <div className="calendarOuter">
        <h2>{t('HolidayCalendarPage.LeaveTranction')}</h2>

        <Table responsive>
          <thead>
            <tr>
              <th scope="col">
                {t('Employee')}
              </th>
              <th scope="col">
                {t('AppliedPage.NoOfDays')}
              </th>
              <th scope="col">
                {t('HolidayCalendarPage.TableHeader_FromTo')}
              </th>
            </tr>
          </thead>
          <tbody>
            {leaveCalendarEventDetails.length > 0 ? (
              leaveCalendarEventDetails.map(eventDetail => (
                <tr key={eventDetail.id}>
                  <td>{eventDetail.employeeName}</td>
                  <td>{eventDetail.noOfDays}</td>
                  <td>{eventDetail.fromTo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">
                  {t('HolidayCalendarPage.TableHeader_NoOfEmp')}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

      </div>
    );
  }
}

export default withTranslation()(LeaveTransaction);
