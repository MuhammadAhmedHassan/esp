/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Multiselect } from 'multiselect-react-dropdown';
import moment from 'moment';
import {
  Row, Col, Form, Modal, Button, Tooltip, OverlayTrigger,

} from 'react-bootstrap';
import FullCalendaresp from './FullCalendar_esp';
import LeaveTransaction from './LeaveTransaction';
import Api from '../../../common/Api';
import { userService } from '../../../../services';
import './style.scss';
import DownloadIcon from '../../../../Images/Icons/downloadIcon.svg';

class VacationCalendar extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    this.state = {
      token: `${token}`,
      userId: userService.getUserId(),
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      currentDate: new Date().getDate(),
      leaveCalendarDataEvent: [],
      leaveCalendarDataEventDetails: [],
      languageId: 1,
      filterId: 1,
      data: [],
      locationIds: [],
      location: [],
      showModal: false,
      employeeList: [],
      employeeId: 0,
    };
  }

  componentDidMount() {
    this.getLeaveCalendarData();
    this.getFilterTypes();
    this.getLocation();
    this.getEmployees();
  }

  getFilterTypes = () => {
    const {
      token, userId,
    } = this.state;
    fetch(`${Api.vacationManagement.getFilterTypes}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        userId: parseInt(userId, 10), languageId: 1,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            data: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getFilterTypes());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getLocation = () => {
    const {
      token,
    } = this.state;
    fetch(`${Api.vacationManagement.getLocation}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        languageId: 1,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            location: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getLocation());
          });
        } else {
          alert(response.message);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getEmployees = () => {
    const {
      token, userId, filterId,
    } = this.state;
    fetch(`${Api.vacationManagement.getEmployees}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        languageId: 1,
        userId: parseInt(userId, 10),
        filterType: parseInt(filterId, 10),
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            employeeList: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getEmployees());
          });
        } else {
          alert(response.message);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  openModal = () => {
    this.setState({
      showModal: true,
    });
  }

  handleDownload = (extension) => {
    const {
      token, userId, currentDate, currentMonth, currentYear, filterId, locationIds,
    } = this.state;

    const data = {
      languageId: 1,
      userId: parseInt(userId, 10),
      year: parseInt(currentYear, 10),
      month: parseInt(currentMonth, 10),
      date: 0,
      filterType: parseInt(filterId, 10),
      locationIds,
    };

    const apiUrl = extension ? `${Api.vacationManagement.downloadCalendarPDF}` : `${Api.vacationManagement.downloadCalendarExcel}`;
    const fileName = extension ? 'HolidayCalendar.pdf' : 'HolidayCalendar.csv';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        token: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => response.blob())
      .then((blob) => {
        if (blob.type === undefined || blob.type === 'application/json') {
          alert('Please try again getting some error.');
        } else {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        }
      })
      .catch(err => console.error(err.toString()));
  }

  getLeaveCalendarData = (date) => {
    const {
      token, userId, currentYear, currentMonth, filterId,
    } = this.state;

    fetch(`${Api.vacationManagement.getLeaveCalendarCount}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        userId: parseInt(userId, 10),
        year: date ? new Date(date).getFullYear() : parseInt(currentYear, 10),
        month: date ? 1 + new Date(date).getMonth() : parseInt(currentMonth, 10),
        filterType: parseInt(filterId, 10),
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          const leaveCalendarDataEvent = [];
          response.data.map(leaveData => leaveData.count > 0 && leaveCalendarDataEvent.push({
            title: leaveData.count,
            start: leaveData.date,
            end: leaveData.date,
          }));
          // console.log(leaveCalendarDataEvent, response);
          this.setState({ leaveCalendarDataEvent });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getLeaveCalendarData(date));
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  renderTooltip = (props, id) => (
    <Tooltip id={id} {...props}>
      {props}
    </Tooltip>
  );


  eventDetails = (selectedDate) => {
    this.getEventDetails(selectedDate);
  }

  eventAction = (selectedDate) => {
    this.getLeaveCalendarData(selectedDate);
  }

  getEventDetails = (eventDate) => {
    const {
      token, userId, filterId, employeeId, locationIds,
    } = this.state;

    let currentYear = new Date().getFullYear();
    let currentMonth = 1 + new Date().getMonth();
    let currentDate = 0;

    if (eventDate) {
      currentYear = new Date(eventDate).getFullYear();
      currentMonth = 1 + new Date(eventDate).getMonth();
      currentDate = new Date(eventDate).getDate();
    }
    
    fetch(`${Api.vacationManagement.getLeaveCalendarData}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        userId: parseInt(userId, 10),
        year: parseInt(currentYear, 10),
        month: parseInt(currentMonth, 10),
        date: parseInt(currentDate, 10),
        filterType: parseInt(filterId, 10),
        employeeId: parseInt(employeeId, 10),
        locationIds,
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          const leaveCalendarDataEventDetails = [];
          response.data.map(leaveData => leaveCalendarDataEventDetails.push({
            id: leaveData.id,
            noOfDays: leaveData.noOfDays,
            employeeName: leaveData.appliedByUser,
            fromTo: `${moment(leaveData.strFromDateTimeUtc).format('DD MMM')}
                - ${leaveData.strToDateTimeUtc ? moment(leaveData.strToDateTimeUtc).format('DD MMM') : 'N/A'}`,
          }));
          this.setState({ leaveCalendarDataEventDetails });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  }

  handleSelectLocation = (selectedList) => {
    const { locationIds } = this.state;
    selectedList.map(data => (!locationIds.includes(data.id) ? locationIds.push(data.id) : ''));
    this.setState({ locationIds }, () => this.getEventDetails());
  }

  handleRemoveLocation = (selectedList, selectedItem) => {
    const { locationIds } = this.state;
    if (locationIds.includes(selectedItem.id)) {
      const index = locationIds.indexOf(selectedItem.id);
      if (index !== -1) {
        locationIds.splice(index, 1);
      }
      this.setState({ locationIds }, () => this.getEventDetails());
    }
  }

  handleSelectEmployee = (selectedList) => {
    this.setState({
      employeeId: (selectedList.map(data => (data.id))).toString(),
    }, () => this.getEventDetails());
  }

  handleRemoveEmployee = () => {
    this.setState({ employeeId: 0 }, () => this.getEventDetails());
  }

  // Handler for Select
  handlefilterTypeDropDown(event) {
    const { target } = event;
    const {
      name, type, checked,
    } = target;
    const value = type === 'checked' ? checked : target.value;
    this.setState({
      [name]: value,
    }, () => {
      if (name === 'filterId') {
        this.getLeaveCalendarData();
        this.getEmployees();
        this.getEventDetails();
      }
    });
  }

  render() {
    const {
      filterType, data, leaveCalendarDataEvent, leaveCalendarDataEventDetails,
      locationIds, location, showModal, employeeList,
    } = this.state;
    const { t } = this.props;
    return (
      <>
        <div className="container-fluid">
          <Row>
            <Col xs={12}>
              <div className="card_layout leaveManagement">
                <Row>
                  <Col md={12} lg={4}>
                    <Form.Label htmlFor={filterType}>
                      {t('HolidayCalendarPage.filterType')}
                    </Form.Label>
                    <select
                      className="form-control"
                      name="filterId"
                      defaultValue={filterType}
                      onChange={event => this.handlefilterTypeDropDown(event)}
                    >
                      {data.map(data => (
                        <option key={data.id} value={data.id}>{data.type}</option>
                      ))}
                    </select>
                  </Col>
                  <Col md={12} lg={4}>
                    <Form.Label htmlFor={locationIds}>
                      {t('ManageEmployeePage.TableHeader_Location')}
                    </Form.Label>
                    <Multiselect
                      id="locationIds"
                      options={location}
                      displayValue="location"
                      onSelect={this.handleSelectLocation}
                      onRemove={this.handleRemoveLocation}
                    />
                  </Col>
                  <Col md={12} lg={4} className="mt-3 downloadIcon">
                    <button
                      type="button"
                      onClick={() => this.openModal()}
                      className="btn btn-download"
                    >

                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 50, hide: 40 }}
                        overlay={this.renderTooltip('Download', 'downloadTooltip')}
                      >
                        <img src={DownloadIcon} alt="Download" />
                      </OverlayTrigger>

                    </button>
                  </Col>
                </Row>
                <Row>
                  <Col lg={8} className="mb20">
                    <FullCalendaresp
                      parentMethod={this.eventDetails}
                      navAction={this.eventAction}
                      data={leaveCalendarDataEvent}
                    />
                  </Col>
                  <Col lg={4} className="mb20">
                    <Row>
                      <Col>
                        <Multiselect
                          id="employeeId"
                          options={employeeList}
                          displayValue="name"
                          onSelect={this.handleSelectEmployee}
                          onRemove={this.handleRemoveEmployee}
                          selectionLimit="1"
                          hidePlaceholder
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <div className="col-md-12">
                        <LeaveTransaction leaveCalendarEventDetails={leaveCalendarDataEventDetails} />
                      </div>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        {
          showModal && (
            <Modal
              show={showModal}
              onHide={this.closeModal}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                {t('DownloadAs')}
              </Modal.Header>
              <Modal.Footer className="justify-content-center">
                <Row>
                  <Col md={6} className="mb-2 text-center">
                    <Button variant="primary" onClick={() => this.handleDownload(true)}>
                      {t('DownloadPDF')}
                    </Button>
                  </Col>
                  <Col md={6} className="text-center">
                    <Button variant="primary" onClick={() => this.handleDownload(false)}>
                      {t('DownloadExcel')}
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="text-center">
                    <Button variant="secondary" onClick={this.closeModal}>
                      {t('CancelBtn')}
                    </Button>
                  </Col>
                </Row>
              </Modal.Footer>
            </Modal>
          )
        }
      </>
    );
  }
}

export default withTranslation()(VacationCalendar);
