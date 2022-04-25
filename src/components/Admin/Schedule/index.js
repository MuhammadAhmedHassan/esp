import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import listPlugin from '@fullcalendar/list';
import './style.scss';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Api from '../../common/Api';
import { userService } from '../../../services';

class Schedule extends React.PureComponent {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    this.state = {
      token: `Bearer ${token}`,
      userId,
      schedules: [],
      loaded: false,
      createdOnUtc: '',
      endOnUtc: '',
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
    };
  }

  componentDidMount() {
    this.getViewSchedule();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.getViewSchedule();
    }
  }

  getViewSchedule() {
    const {
      token, userId, endOnUtc, createdOnUtc, pageIndex, pageSize,
    } = this.state;

    const data = {
      createdByUserId: userId,
      startOnUtc: createdOnUtc,
      endOnUtc,
      IsActive: true,
      pageIndex,
      pageSize,
    };

    fetch(`${Api.schedule.searchSchedule}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      }),
      body: JSON.stringify({ ...data }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            loaded: true,
            schedules: response.schedules,
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getViewSchedule());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  updatePageNum = (pageNum) => {
    if (pageNum > 0) {
      this.setState({
        pageIndex: pageNum,
        loaded: false,
      });
    }
  }

  updatePageCount = (pageCount) => {
    this.setState({
      pageSize: pageCount,
      loaded: false,
    });
  }

  render() {
    const {
      schedules,
      pageIndex,
      pageSize,
      totalRecords,
      loaded,
    } = this.state;
    const { t } = this.props;
    return (
      <div className="container-fluid view-schedule">
        <div className="card_layout">
          <div className="col-md-12 d-flex justify-content-end create-schedule">
            <Link to="create-schedule" className="btn btn-primary createbtn">{t('SchedulePage.CreateBtn')}</Link>
          </div>
          {
            loaded ? (
              <>
                <FullCalendar
                  plugins={[resourceTimelinePlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
                  dateClick={this.handleDateClick}
                  weekends
                  selectable
                  aspectRatio="2"
                  expandRows="true"
                  initialView="resourceTimelineWeek"
                  resourceAreaWidth="30%"
                  eventClick={this.handleEventClick}
                // events={leaveCalendarData}
                />
              </>
            )
              : <p>{t('LoadingText')}</p>
          }
        </div>
      </div>
    );
  }
}

export default withTranslation()(Schedule);
