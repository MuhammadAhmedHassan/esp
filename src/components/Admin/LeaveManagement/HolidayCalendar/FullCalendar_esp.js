/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-undef */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

function renderEventContent(eventInfo) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a className="fc-daygrid-event fc-daygrid-dot-event fc-event fc-event-start fc-event-end">
      <div className="fc-daygrid-event-dot" />
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </a>
  );
}

class FullCalendaresp extends React.Component {
  constructor(props) {
    super(props);
    this.calendarRef = React.createRef();
  }

  
  handleEventClick = (clickInfo) => {
    const { parentMethod } = this.props;
    parentMethod(clickInfo.event.start.toString());
  }

  handleActionEventClick = (date) => {
    const { navAction } = this.props;
    navAction(date);
  }
  

  render() {
    const { data } = this.props;
    return (
      <div className="calendarOuter">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          dateClick={this.handleDateClick}
          ref={this.calendarRef}
          weekends
          selectable
          aspectRatio="2"
          expandRows="true"
          initialView="dayGridMonth"
          customButtons={{
            CPrev: {
              icon: 'chevron-left',
              click: () => {
                const calendarApi = this.calendarRef.current.getApi();
                calendarApi.prev();
                this.handleActionEventClick(calendarApi.getDate());
              },
            },
            CNext: {
              icon: 'chevron-right',
              click: () => {
                const calendarApi = this.calendarRef.current.getApi();
                calendarApi.next();
                this.handleActionEventClick(calendarApi.getDate());
              },
            },

            CToday: {
              text: 'Today',
              click: () => {
                const calendarApi = this.calendarRef.current.getApi();
                calendarApi.today();
                this.handleActionEventClick(calendarApi.getDate());
              },
            },

          }}
          headerToolbar={
            {
              left: 'title',
              center: '',
              right: 'CToday CPrev,CNext',
            }
          }
          eventContent={renderEventContent}
          eventClick={this.handleEventClick}
          events={data}
        />
      </div>
    );
  }
}

export default FullCalendaresp;
