/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import {
  Row,
  Card,
  Button,
  Modal,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import '../style.scss';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { userService } from '../../../../services';

import Api from '../../../common/Api';
import { commonService } from '../../../../services/common.service';

const errorMessage = 'You are out of Zone';
const Timer = (props) => {
  const { t } = useTranslation();

  const [timer, setTimer] = useState({ date: '', time: '' });


  const [punchInDetails, setPunchInDetails] = useState({
    geoCoordinates: '',
    isForced: false,
    isClockIn: false,
    shiftId: 0,
    loading: false,
    sourceGuid: 'd6149029-b97e-4555-ab5f-7bf77c90ab96',
    modalBody: '',
    clockInModal: false,
    displayMessage: false,
    responseMessage: '',
    responseStatus: false,
    shiftResponseMessage: '',
  });

  const punchTime = useSelector(state => state.punchTime);
  const userTimerList = useSelector(state => state.userTimerList);
  const clockInData = userTimerList.list;

  useEffect(() => {
    setInterval(() => {
      if (timer.date !== '') {
        const m1 = moment(new Date(), 'DD-MM-YYYY HH:mm:SSSSSSSSS');
        const m2 = moment(timer.date, 'DD-MM-YYYY HH:mm:SSSSSSSSS');
        const m3 = m1.diff(m2, 'seconds');
        setTimer(prevState => ({ ...prevState, time: m3 }));
      }
    }, 1000);
  });

  const getClockInOutStatus = () => {
    const token = userService.getToken();
    const id = userService.getUserId();
    const data = {
      languageId: 1,
      id,
    };

    fetch(`${Api.getClockInOutStatus}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          setPunchInDetails(prevState => ({
            ...prevState,
            isClockIn: response.data.isUserClockIn,
            clockInData: response.data,
          }));
          if (response.data.isUserClockIn) {
            const date = moment.utc(response.data.lastPunchDateTime).toDate();
            setTimer(prevState => ({ ...prevState, date: moment(date).format('DD-MM-YYYY HH:mm:SSSSSSSSS') }));
          }
        }
      })
      .catch(err => console.error(err.toString()));
  };

  useEffect(() => {
    getClockInOutStatus();

    navigator.geolocation.getCurrentPosition((position) => {
      const geoLocation = `${position.coords.latitude} ${position.coords.longitude}`;
      setPunchInDetails(prevState => ({ ...prevState, geoCoordinates: geoLocation }));
    });
  }, [punchInDetails.clockIn]);

  const doClockIn = () => {
    const userId = userService.getUserId();
    const token = userService.getToken();
    const {
      geoCoordinates, isClockIn, isForced,
    } = punchInDetails;

    if (geoCoordinates === '') {
      setPunchInDetails(prevState => ({
        ...prevState,
        displayMessage: true,
        responseMessage: 'Please allow location access to use this feature',
        responseStatus: 200,
      }));
      return true;
    }

    const data = {
      languageId: 1,
      userId,
      isClockIn: !isClockIn,
      sourceGuid: 'd6149029-b97e-4555-ab5f-7bf77c90ab96',
      geoCoordinates,
      isForced,
    };

    fetch(`${Api.clockIn}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 290) {
          setPunchInDetails(prevState => ({
            ...prevState,
            clockInModal: true,
          }));
        } else if (response.statusCode === 200) {
          setPunchInDetails(prevState => ({
            ...prevState,
            isClockIn: !isClockIn,
            displayMessage: true,
            responseMessage: response.message,
            responseStatus: response.statusCode,
          }));
        } else if (response.statusCode !== 200) {
          setPunchInDetails(prevState => ({
            ...prevState,
            displayMessage: true,
            responseMessage: response.message,
            responseStatus: response.statusCode,
          }));
        }
      })
      .catch(err => console.error(err.toString()));
    return true;
  };

  const handleClick = () => {
    doClockIn();
  };

  const doClockInOutsideGeolocation = () => {
    const userId = userService.getUserId();
    const token = userService.getToken();
    const {
      geoCoordinates, isClockIn,
    } = punchInDetails;

    if (geoCoordinates === '') {
      setPunchInDetails(prevState => ({
        ...prevState,
        displayMessage: true,
        responseMessage: 'Please allow location access to use this feature',
        responseStatus: 200,
      }));
      return true;
    }

    const data = {
      languageId: 1,
      userId,
      isClockIn: !isClockIn,
      sourceGuid: 'd6149029-b97e-4555-ab5f-7bf77c90ab96',
      geoCoordinates,
      isForced: true,
    };

    fetch(`${Api.clockIn}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 290) {
          setPunchInDetails(prevState => ({
            ...prevState,
            clockInModal: true,
          }));
        } else if (response.statusCode === 200) {
          setPunchInDetails(prevState => ({
            ...prevState,
            isClockIn: !isClockIn,
            displayMessage: true,
            responseMessage: response.message,
            responseStatus: response.statusCode,
          }));
        } else if (response.statusCode !== 200) {
          setPunchInDetails(prevState => ({
            ...prevState,
            displayMessage: true,
            responseMessage: response.message,
            responseStatus: response.statusCode,
          }));
        }
      })
      .catch(err => console.error(err.toString()));
    return true;
  };


  const handleClose = () => {
    setPunchInDetails(prevState => ({
      ...prevState,
      shiftModal: false,
      clockInModal: false,
      shiftStartEndModal: false,
      displayMessage: false,
    }));
    window.location.reload();
  };

  return (
    <>
      <Card className="cardBox punch-card">
        <p className="cardBox_cardTitle punch-card-header">Today's Punch Record</p>
        <div className="timerTitle">
          <h5>{t('MyProfilePage.Timer')}</h5>
        </div>
        <Row className="mt-4 justify-content-center">
          <div className="timer row mx-1">
            <ul className="timer-list px-1 col-lg-3">
              <li className="mr-1">{Math.floor(moment.duration(timer.time, 'seconds').asHours())}</li>
            </ul>
            <ul className="timer-list px-1  col-lg-3">
              <li className="mr-1">{Math.floor(moment.duration(timer.time, 'seconds').minutes())}</li>
            </ul>
            <ul className="timer-list px-1 col-lg-3">
              <li className="mr-1">{Math.floor(moment.duration(timer.time, 'seconds').seconds())}</li>
            </ul>
          </div>
        </Row>
        <div className="d-flex justify-content-center p-2">
          {punchTime.isError ? punchTime.error.error : null}
          {punchTime.isSuccess ? punchTime.message : null}
        </div>
        <div className=" d-flex justify-content-center p-4">
          <Button
            className="clockInBtn"
            variant="primary"
            onClick={handleClick}
          >
            {punchInDetails.isClockIn ? 'Clock Out' : 'Clock In'}
          </Button>
        </div>
        <div className="punchList mt-4">
          <p>
            {t('MyProfilePage.LastPunch')}
            {`${moment(clockInData.lastPunchDateTime).format('HH:mmA')}`}
          </p>
          <p>
            {' '}
            {`${moment(clockInData.lastPunchDateTime).format(
              'MM/DD/YYYY',
            )}`}
          </p>
        </div>
      </Card>

      {
        punchInDetails.clockInModal && (
          <Modal
            show={punchInDetails.clockInModal}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body>
              {errorMessage}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" onClick={() => doClockInOutsideGeolocation()}>Confirm</Button>
            </Modal.Footer>
          </Modal>
        )
      }
      {
        punchInDetails.displayMessage && (
          <Modal
            show={punchInDetails.displayMessage}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Body>
              {punchInDetails.responseMessage}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        )
      }

    </>
  );
};

export default Timer;
