import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import { modes } from 'react-transition-group/SwitchTransition';
import { userService } from '../../../services';
import Api from '../../common/Api';
import { setRealDate } from '../../common/app.constant';
import LoadingSpinner from '../../shared/LoadingSpinner';
import ModalPopUp from '../../common/Modal';
import { commonService } from '../../../services/common.service';

function CopySchedule(props) {
  const { setMessage, requestBodyData } = props;
  const token = userService.getToken();
  const [state, setStateComp] = useState({
    startDate: '',
    endDate: '',
    copyToStartDate: '',
    copyByUserId: false,
    requestNotes: '',
    modalShow: false,
    responseMessage: '',
    title: '',
  });

  const [error, setError] = useState({
    startDateErr: '',
    endDateErr: '',
    copyToStartDateErr: '',
    titleErr: '',
  });

  const [includeOpenShifts, setOpenShifts] = useState(false);
  const [includeShiftNotes, setShiftNotes] = useState(false);
  const [scheduleData, setScheduleData] = useState(false);
  const [loading, setLoader] = useState(false);
  const options = [
    { label: 'Shift notes', value: 'includeShiftNotes' },
    { label: 'Open shift', value: 'includeOpenShifts' },
  ];


  const scheduleService = () => {
    const reqBodySchedule = {
      id: requestBodyData.scheduleId,
      languageId: 1,
    };
    setLoader(true);
    fetch(`${Api.schedule.getScheduleByID}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: `Bearer ${token}`,
      }),
      body: JSON.stringify(reqBodySchedule),
    }).then(response => response.json())
      .then(async (response) => {
        if (response.statusCode === 200) {
          setScheduleData(response);
          setStateComp(prevState => ({
            ...prevState,
            title: response.data.title,
          }));
        }else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            scheduleService();
          });
        } else {
          // eslint-disable-next-line no-ale rt
          alert('Error while fetching.');
        }
        setLoader(false);
      }).catch((err) => {
        // eslint-disable-next-line no-alert
        alert(`Error while fetching.${err}`);
        setLoader(false);
      });
  };

  useEffect(() => {
    if (props.requestBodyData && props.requestBodyData.scheduleId) {
      scheduleService();
    }
  }, []);

  const handleFromDateClick = (date) => {
    setStateComp({ ...state, startDate: date });
  };

  const handleToDateClick = (date) => {
    setStateComp({ ...state, endDate: date });
  };

  const handleCopyToStartDate = (date) => {
    setStateComp({ ...state, copyToStartDate: date });
  };

  const handleMultiDp = (selectValues) => {
    setOpenShifts(false);
    setShiftNotes(false);
    selectValues.map((selectedVal) => {
      if (selectedVal.value === 'includeShiftNotes') {
        setShiftNotes(true);
      }
      if (selectedVal.value === 'includeOpenShifts') {
        setOpenShifts(true);
      }
      return true;
    });
  };

  const handleChange = (e) => {
    const { target: { value } } = e;
    setStateComp(prevState => ({
      ...prevState,
      title: value,
    }));
  };

  const callCopyFn = () => {
    setError({
      startDateErr: '',
      endDateErr: '',
      copyToStartDateErr: '',
    });

    if (!state.startDate) {
      setError(prevState => ({
        ...prevState,
        startDateErr: 'Please select start date',
      }));
    }

    if (!state.endDate) {
      setError(prevState => ({
        ...prevState,
        endDateErr: 'Please select end date',
      }));
    }
    if (new Date(state.endDate) < new Date(state.startDate)) {
      setError(prevState => ({
        ...prevState,
        endDateErr: 'End date should be greater than start date',
      }));
    }

    if (!state.copyToStartDate) {
      setError(prevState => ({
        ...prevState,
        copyToStartDateErr: 'Please select copy date',
      }));
    }

    if (!state.title) {
      setError(prevState => ({
        ...prevState,
        titleErr: 'Please add title',
      }));
    }

    if (
      !state.startDate
      || !state.endDate
      || !state.copyToStartDate
      || !state.title
      || new Date(state.endDate) < new Date(state.startDate)
    ) {
      return;
    }
    
    const copyScheduleReq = {
      id: scheduleData.data.id,
      languageId: 1,
      title: state.title,
      startDate: setRealDate(state.startDate),
      endDate: setRealDate(state.endDate),
      copyToStartDate: setRealDate(state.copyToStartDate),
      includeShiftNotes,
      includeOpenShifts,
      copyByUserId: userService.getUserId(),
    };

    setLoader(true);
    fetch(`${Api.schedule.copySchedule}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Token: `Bearer ${token}`,
      }),
      body: JSON.stringify(copyScheduleReq),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          setMessage(response.message);
        } else {
          setMessage(response.message);
        }
        setLoader(false);
        // eslint-disable-next-line no-alert
      }).catch((err) => {
        // eslint-disable-next-line no-alert
        alert(`Error while fetching.${err}`);
        setLoader(false);
      });
  };
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  return (
    
    <>
      <div>
        {loading ? (<LoadingSpinner />) : null}
      </div>
      <p>
        Save time by reusing your schedule. Copy it,
        make changes, and then share with team when you are ready.
      </p>
      <p> Choose the date range you want to copy</p>
      <Form>
        <Form.Row>
          <Form.Group className="col-lg-3 custom-with-datepicker max-w-100" controlId="startDate">
            <DatePicker
              autoComplete="off"
              name="startDate"
              minDate={minDate}
              selected={state.startDate}
              onChange={handleFromDateClick}
              placeholderText={commonService.localizedDateFormat()}
              dateFormat={commonService.localizedDateFormatForPicker()}
              className="form-control cal_icon"
              pattern="\d{2}\/\d{2}/\d{4}"
              required
            />
            <div className={error.startDateErr ? 'text-danger' : 'hidden'}>
              {error.startDateErr}
            </div>
          </Form.Group>
          <Form.Group className="col-lg-3 custom-with-datepicker max-w-100" controlId="endDate">
            <DatePicker
              name="endDate"
              autoComplete="off"
              minDate={minDate}
              selected={state.endDate}
              onChange={handleToDateClick}
              placeholderText={commonService.localizedDateFormat()}
              dateFormat={commonService.localizedDateFormatForPicker()}
              className="form-control"
              pattern="\d{2}\/\d{2}/\d{4}"
              required
            />
            <div className={error.endDateErr ? 'text-danger' : 'hidden'}>
              {error.endDateErr}
            </div>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <p>Include shift notes and open shifts.</p>
          <Form.Group className="col-12">
            <ReactMultiSelectCheckboxes options={options} onChange={handleMultiDp} />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <p>Title you want for section</p>
          <Form.Group className="col-12">
            <Form.Control
              name="title"
              autoComplete="off"
              value={state.title}
              onChange={e => handleChange(e)}
              className="form-control"
              placeholderText="Title"
            />
            <div className={error.titleErr ? 'text-danger' : 'hidden'}>
              {error.titleErr}
            </div>
          </Form.Group>
        </Form.Row>
        <hr />
        <Form.Row>
          <p>Choose the date you want to copy your section to</p>
          <Form.Group className="col-12 custom-with-datepicker max-w-100" controlId="copyToStartDate">
            <DatePicker
              name="copyToStartDate"
              autoComplete="off"
              minDate={minDate}
              selected={state.copyToStartDate}
              onChange={handleCopyToStartDate}
              placeholderText={commonService.localizedDateFormat()}
              dateFormat={commonService.localizedDateFormatForPicker()}
              className="form-control"
              pattern="\d{2}\/\d{2}/\d{4}"
              required
            />
            <div className={error.copyToStartDateErr ? 'text-danger' : 'hidden'}>
              {error.copyToStartDateErr}
            </div>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Button onClick={callCopyFn}>Copy Schedule</Button>
        </Form.Row>
      </Form>


    </>
  );
}
export default CopySchedule;
