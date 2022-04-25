import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import {
  Col, Form, Button, Row, Modal,
} from 'react-bootstrap';
import './style.scss';
import { withTranslation } from 'react-i18next';
import Api from '../../common/Api';
import { userService } from '../../../services';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { setRealDate } from '../../common/app.constant';
import ModalPopUp from '../../common/Modal';
import { commonService } from '../../../services/common.service';

const SwapShift = (props) => {
  const { t, location } = props;
  const token = userService.getToken();
  const userId = userService.getUserId();
  const [teammates, setTeammates] = useState([]);
  const shiftDate = location.state && location.state.requestShift ? new Date(location.state.requestShift.start) : new Date();
  const lastDay = new Date(shiftDate.getFullYear(), shiftDate.getMonth() + 1, 0);
  const monthLast = lastDay;
  const [errors, setError] = useState({
    targetShiftErr: '',
    requestShiftErr: '',
    targetShiftUserIdErr: '',
  });

  const [errorPopUp, setErrorPopUp] = useState(false);

  const handleClose = () => {
    const { history } = props;
    history.push('/schedule/my-schedule');
    setErrorPopUp(false);
  };


  const [state, setStateComp] = useState({
    myCal: false,
    theirCal: false,
    shifts: [],
    requestShift: location.state ? location.state.requestShift : null,
    targetShift: null,
    loading: false,
    requestNotes: '',
    modalShow: false,
    responseMessage: '',

  });

  const handleDateClick = (date) => {
    setStateComp({ ...state, loading: true });
    fetch(`${Api.shift.usersByDate}`, {
      method: 'POST',
      headers: new Headers({
        Token: token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        userId: Number(state.targetShiftUserId) || userId,
        languageId: 1,
        selectedShiftId: state.requestShift.id,
        date: setRealDate(date),
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          setStateComp({
            ...state, shifts: response.data, loading: false, responseMessage: response.message,
          });

          // console.log(date, response);
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            handleDateClick(date);
          });
        } else {
          // eslint-disable-next-line no-alert
          setStateComp({ ...state, loading: false, responseMessage: response.message });
          setErrorPopUp(true);
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(
          `Failed to fetch get all shift types service. Please try again after sometime. ${err}`,
        );
        setStateComp({ ...state, loading: false });
      });
  };

  const getTeamMates = () => {
    fetch(`${Api.shift.getTeammates}`, {
      method: 'POST',
      headers: new Headers({
        Token: token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: userId,
        languageId: 1,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          setTeammates(response.data);
          setStateComp({ ...state, responseMessage: response.message });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            getTeamMates();
          });
        } else {
          // eslint-disable-next-line no-alert
          setStateComp({ ...state, responseMessage: response.message });
          setErrorPopUp(true);
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(
          `Failed to fetch get all shift types service. Please try again after sometime. ${err}`,
        );
      });
  };

  const handleShiftSelect = (e, whoseShift, closeCal) => {
    const { value } = e.target;
    setStateComp({
      ...state,
      [whoseShift]: JSON.parse(value),
      [closeCal]: false,
    });
  };

  const requestSwapShift = () => {
    setError({
      targetShiftErr: '',
      requestShiftErr: '',
      targetShiftUserIdErr: '',
    });

    if (!state.targetShift) {
      setError(prevState => ({
        ...prevState,
        targetShiftErr: 'Please fill the filed',
      }));
    }

    if (!state.requestShift) {
      setError(prevState => ({
        ...prevState,
        requestShiftErr: 'Please fill the filed',
      }));
    }

    if (!state.targetShiftUserId) {
      setError(prevState => ({
        ...prevState,
        targetShiftUserIdErr: 'Please fill the filed',
      }));
    }

    if (!state.targetShiftUserId || !state.requestShift || !state.targetShift) {
      return;
    }

    const data = {
      languageId: 1,
      requestShiftId: state.requestShift ? state.requestShift.id : null,
      requestUserId: userId,
      requestNotes: state.requestNotes,
      targetShiftId: state.targetShift ? state.targetShift.id : null,
      targetShiftUserId: Number(state.targetShiftUserId),
    };
    fetch(`${Api.shift.insertShiftSwap}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: `${token}`,
      }),
      body: JSON.stringify({ ...data }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          // eslint-disable-next-line no-alert
          setStateComp({ ...state, responseMessage: response.message });
          setErrorPopUp(true);
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            requestSwapShift();
          });
        } else {
          setStateComp({ ...state, responseMessage: response.message });
          setErrorPopUp(true);
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(`Request failed ${err}`);
      });
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setStateComp({ ...state, [name]: value });
  };

  const back = () => {
    const { history } = props;
    history.push('/schedule/my-schedule');
  };

  useEffect(() => {
    getTeamMates();
    handleDateClick(new Date());
  }, []);

  return (
    <>
      <Modal show={errorPopUp} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <p>
              {state.responseMessage}
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            ok
          </Button>
        </Modal.Footer>
      </Modal>
      <div>{state.loading && <LoadingSpinner />}</div>
      <div className="container-fluid create-schedule">
        <div className="card_layout">
          <Form>
            <Row>
              <Col lg={10}>
                <Row>
                  <Col md={12}>
                    <Form.Group
                      className="custom-width-swap"
                      controlId="swap-shift-date"
                    >
                      <Form.Label className="form-label-custom">
                        {t('SwapShiftPage.swapShift')}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="shiftName"
                        placeholder="Select your shift"
                        autoComplete="off"
                        defaultValue={
                          state.requestShift ? state.requestShift.title : ''
                        }
                        disabled={location.state && location.state.requestShift}
                        onFocus={() => {
                          setStateComp({ ...state, myCal: true, theirCal: false });
                        }}
                      />
                      {state.myCal && (
                        <div className="bg-white-with-dp">
                          <button
                            type="button"
                            className="link-style"
                            onClick={() => {
                              setStateComp({ ...state, myCal: false });
                            }}
                          >
                            &#x2715;
                          </button>
                          <Row>
                            <Col md={7} lg={6}>
                              <DatePicker
                                className="form-control cal_icon w-100 custom-blue-header"
                                minDate={new Date()}
                                name="selfShiftDate"
                                onChange={handleDateClick}
                                placeholderText={commonService.localizedDateFormat()}
                                dateFormat={commonService.localizedDateFormatForPicker()}
                                pattern="\d{2}\/\d{2}/\d{4}"
                                inline
                                autoComplete="off"
                              />
                            </Col>
                            <Col lg={6} md={5}>
                              {state.shifts
                                && state.shifts.length > 0
                                && state.shifts.map((shift, index) => (
                                  // eslint-disable-next-line react/no-array-index-key
                                  <div
                                    key={`${shift.shiftId}-${index}`}
                                    className="mb-3"
                                  >
                                    <Form.Check
                                      type="radio"
                                      name="requestShift"
                                      value={JSON.stringify(shift)}
                                      defaultChecked={
                                        state.requestShift === `${shift.shiftId}`
                                      }
                                      label={`${shift.title}`}
                                      id={`${shift.shiftId}-${index}`}
                                      onChange={event => handleShiftSelect(
                                        event,
                                        'requestShift',
                                        'myCal',
                                      )
                                      }
                                    />
                                  </div>
                                ))}
                            </Col>
                          </Row>
                        </div>
                      )}
                      <div className={errors.requestShiftErr ? 'text-danger' : 'hidden'}>{errors.requestShiftErr}</div>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="emp-select" className="custom-width-swap">
                      <Form.Label className="form-label-custom">
                        Choose Employee
                      </Form.Label>
                      <Form.Control
                        name="targetShiftUserId"
                        as="select"
                        onChange={handleChange}
                        onFocus={() => {
                          setStateComp({ ...state, myCal: false, theirCal: false });
                        }}
                      >
                        <option value="0">Select Employee</option>
                        {teammates.length > 0
                          && teammates.map(teammate => (
                            // eslint-disable-next-line max-len
                            <option key={teammate.id} value={teammate.id}>
                              {teammate.firstName}
                              &nbsp;
                              {teammate.lastName}
                            </option>
                          ))}
                      </Form.Control>
                      <div className={errors.targetShiftUserIdErr ? 'text-danger' : 'hidden'}>{errors.targetShiftUserIdErr}</div>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    {' '}
                    <Form.Group
                      controlId="swap-shift-date-teammate"
                      className="custom-width-swap"
                    >
                      <Form.Label className="form-label-custom">
                        For this shift
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="swapShiftName"
                        placeholder="Select a team member’s shift"
                        autoComplete="off"
                        defaultValue={
                          state.targetShift ? state.targetShift.title : ''
                        }
                        onFocus={() => {
                          setStateComp({
                            ...state, theirCal: true, myCal: false, shifts: [],
                          });
                        }}
                      />
                      {state.theirCal && (
                        <div className="bg-white-with-dp">
                          <button
                            type="button"
                            className="link-style"
                            onClick={() => {
                              setStateComp({ ...state, theirCal: false });
                            }}
                          >
                            &#x2715;
                          </button>
                          <Row>
                            <Col md={7} lg={6}>
                              <DatePicker
                                className="form-control cal_icon w-100 custom-blue-header"
                                minDate={new Date()}
                                maxDate={monthLast}
                                name="teamMemberDate"
                                onChange={handleDateClick}
                                placeholderText={commonService.localizedDateFormat()}
                                dateFormat={commonService.localizedDateFormatForPicker()}
                                pattern="\d{2}\/\d{2}/\d{4}"
                                inline
                                autoComplete="off"
                              />
                            </Col>
                            <Col md={5} lg={6}>
                              {state.shifts
                                && state.shifts.length > 0
                                && state.shifts.map((shift, index) => (
                                  // eslint-disable-next-line react/no-array-index-key
                                  <div
                                    key={`${shift.shiftId}-swap`}
                                    className="mb-3"
                                  >
                                    <Form.Check
                                      type="radio"
                                      name="swapShift"
                                      value={JSON.stringify(shift)}
                                      defaultChecked={
                                          (state.targetShift && state.targetShift.id === shift.id)
                                        }
                                      label={`${shift.title}`}
                                      id={`${shift.shiftId}-${index}-swap`}
                                      onChange={event => handleShiftSelect(
                                        event,
                                        'targetShift',
                                        'theirCal',
                                      )
                                        }
                                    />
                                  </div>
                                ))}
                            </Col>
                          </Row>
                        </div>
                      )}
                      <div className={errors.targetShiftErr ? 'text-danger' : 'hidden'}>{errors.targetShiftErr}</div>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    {' '}
                    <Form.Group controlId="notes-text" className="custom-width-swap">
                      <Form.Label>Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="requestNotes"
                        rows={3}
                        placeholder="Add a note"
                        onChange={handleChange}
                        onFocus={() => {
                          setStateComp({ ...state, myCal: false, theirCal: false });
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Row>
                      <Col md={12} className="text-center">
                        <Button className="mb-2" type="button" onClick={back}>{t('CancelBtn')}</Button>
                        <Button className="mb-2" type="button" onClick={requestSwapShift}>
                          {' '}
                          {t('SwapShiftPage.SendRequest')}
                          {' '}
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>

          </Form>
        </div>
      </div>
    </>
  );
};
export default withTranslation()(SwapShift);
