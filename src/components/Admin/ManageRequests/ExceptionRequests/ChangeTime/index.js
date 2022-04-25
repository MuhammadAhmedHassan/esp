/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import './style.scss';
import {
  Row, Col, Table, Modal, Button, Tooltip, OverlayTrigger, Form,
} from 'react-bootstrap';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import checkedIcon from '../../../../../Images/Icons/checked.svg';
import crossInCircleIcon from '../../../../../Images/Icons/cross-in-circle.svg';
import PaginationAndPageNumber from '../../../../shared/Pagination';
import Api from '../../../../common/Api';
import { sendApiRequest } from '../../../../common/serviceCall/PostApiCall';
import { userService } from '../../../../../services';
import Tabs from './Tabs/index';
import ApiResponsePopup from '../../../../shared/Common/ApiResponsePopup';
import { commonService } from '../../../../../services/common.service';

const { getUserId, isEmployee } = userService;

const tableHeader = (t, isEmployeeUser) => ([
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.ShiftLabel') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.ShiftDate') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.OriginalStartTime') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.OriginalEndTime') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.LineManager') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.RequestedStartTime') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.RequestedEndTime') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.RequestedBy') },
  { label: t(`ManageRequest.ExceptionRequests.ChangeTime.${isEmployeeUser ? 'Status' : 'Actions'}`) }, // for employee change it to status
]);

const ManageRequestsChangeTime = (props) => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageIndex: 1,
    pageSize: 10,
    totalRecords: 0,
    isPaginationChanged: true,
  });
  const { t } = useTranslation();

  const [changeTimeRequests, setChangeTimeRequests] = useState([]);
  const [requestIdToReject, setRequestIdToReject] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loadingStatusRequest, setLoadingStatusRequest] = useState(false);
  const [clearFilterStatus, setClearFilterStatus] = useState(true);
  const [isEmptyNote, setEmptyNote] = useState(false);
  const date = new Date();

  // eslint-disable-next-line react/destructuring-assignment
  const selectedTab = props.location && props.location.state ? props.location.state.tab : 'myTimeSheet';
  const [tabkey, setTabkey] = useState(selectedTab);

  // eslint-disable-next-line react/destructuring-assignment
  const propsStatus = props.location && props.location.state ? props.location.state.status : 0;
  const [status, setStatus] = useState(propsStatus);

  // eslint-disable-next-line react/destructuring-assignment
  const isShowOverdue = props.location && props.location.state && props.location.state.employeeId;

  // eslint-disable-next-line react/destructuring-assignment
  const propsEmployee = props.location && props.location.state ? props.location.state.employeeId : 0;
  const [employee, setEmployee] = useState(propsEmployee);


  const [startDate, setStartDate] = useState({
    date: isShowOverdue ? new Date(date.getFullYear(), date.getMonth(), 1) : null,
    valid: true,
  });
  const [showModel, setShowModel] = useState(false);
  const [body, setResponseBody] = useState(false);
  const [endDate, setEndDate] = useState({
    date: isShowOverdue ? new Date(date.getFullYear(), date.getMonth() + 1, 0) : null,
    valid: true,
  });
  const apiReqBody = () => ({
    languageId: 1,
    pageIndex: 1,
    pageSize: 10,
    approverUserId: !isEmployee() ? getUserId() : 0,
    userId: isEmployee() ? getUserId() : 0,
  });

  const manageCorrectionReqBody = () => ({
    languageId: 1,
    userShiftChangeTimeRequestId: 0,
    shiftRecurrenceId: 0,
    userId: 0,
    isApproved: true,
    description: '',
  });

  
  const [employeeByShiftManager, setEmployeeByShiftManager] = useState([]);

  const fetchEmployeeByShiftManagerId = async () => {
    const body = {
      languageId: 1,
      id: getUserId(),
    };
    try {
      const response = await sendApiRequest(Api.manageEmp.getEmployeeByShiftManagerId, 'POST', body);
      if (response.statusCode === 200) {
        setEmployeeByShiftManager(response.data);
      } else if (response.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          fetchEmployeeByShiftManagerId();
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchEmployeeByShiftManagerId(); }, []);

  
  const renderTooltip = (props, id) => (
    <Tooltip id={id} {...props}>
      {props}
    </Tooltip>
  );
  

  const fetchData = async (pageIndex = 1, pageSize = 10, paginationFields = {}) => {
    const body = {
      ...apiReqBody(),
      // eslint-disable-next-line radix
      status: parseInt(status),
      startDate: startDate.date,
      endDate: endDate.date,
      pageIndex,
      pageSize,
    };
    // eslint-disable-next-line no-use-before-define
    fetchRequestData(body, paginationFields);
  };


  const fetchIntialPageLoadData = async (pageIndex = 1, pageSize = 10, paginationFields = {}) => {
    const body = {
      ...apiReqBody(),
      status: 0,
      startDate: null,
      endDate: null,
      pageIndex,
      pageSize,
    };
    if (tabkey === 'myTeam' && !isEmployee()) {
      body.approverUserId = getUserId();
      body.userId = 0;
    } else {
      body.approverUserId = 0;
      body.userId = getUserId();
    }
    // eslint-disable-next-line no-use-before-define
    fetchRequestData(body, paginationFields);
  };


  const fetchRequestData = async (body, paginationFields) => {
    // setPagination(prevState => ({ ...prevState, isPaginationChanged: false }));
    try {
      const response = await sendApiRequest(Api.exceptionRequest.changeTime.searchCorrectionRequest, 'POST', body);
      if (response.statusCode === 200) {
        setChangeTimeRequests([]);
        setChangeTimeRequests(response.data);
        setPagination({
          ...pagination,
          totalRecords: response.totalRecords,
          pageIndex: response.pageIndex,
          ...paginationFields,
          isPaginationChanged: false,
        });
      } else if (response.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          fetchRequestData();
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updatePageNum = async (pageNumber) => {
    if (pageNumber > 0) {
      setPagination(prevState => ({
        ...prevState,
        pageIndex: pageNumber,
        isPaginationChanged: true,
      }));
    }
    // const { pageSize } = pagination;
    // const nextPageFirstItem = ((pageNumber - 1) * pageSize) + 1;
    // await fetchData(nextPageFirstItem, pageSize, { currentPage: pageNumber });
  };
  const updatePageCount = (recordsPerPage) => {
    setPagination(prevState => ({
      ...prevState,
      pageSize: parseInt(recordsPerPage, 10),
      pageIndex: 1,
      isPaginationChanged: true,
    }));
    // fetchData(1, Number(recordsPerPage), { pageSize: Number(recordsPerPage) });
  };

  const formatTime = date => (date ? moment.utc(date).local().format('HH:mm') : '');
  const formatDate = date => (date ? moment.utc(date).local().format('MM/DD/yyyy') : '');

  const updateRequests = (userShiftChangeTimeRequestId, shiftRecurrenceId, userId, statusName) => {
    setChangeTimeRequests(changeTimeRequests.map(req => (
      req.userId === userId
        && req.shiftRecurrenceId === shiftRecurrenceId
        && req.userShiftChangeTimeRequestId === userShiftChangeTimeRequestId
        ? { ...req, statusName } : req)));
  };

  const handleApproved = async (userShiftChangeTimeRequestId, shiftRecurrenceId, userId) => {
    try {
      const response = await sendApiRequest(Api.exceptionRequest.changeTime.manageCorrectionRequest, 'POST', {
        ...manageCorrectionReqBody(),
        description: '',
        isApproved: true,
        userShiftChangeTimeRequestId,
        shiftRecurrenceId,
        userId,
      });
      if (response.statusCode === 200) {
        updateRequests(userShiftChangeTimeRequestId, shiftRecurrenceId, userId, 'Accepted');
        setResponseBody('Request approved successfully');
        setShowModel(true);
      } else if (response.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          handleApproved();
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // eslint-disable-next-line consistent-return
  const handleReject = async (userShiftChangeTimeRequestId, shiftRecurrenceId, userId, type) => {
    if (type === 'showModal') {
      setRequestIdToReject(`${userShiftChangeTimeRequestId}-${shiftRecurrenceId}-${userId}`);
    } else {
      try {
        if (rejectionReason === '') {
          setEmptyNote(true);
          return false;
        }
        let [requestId, recurrenceId, uid] = requestIdToReject.split('-');
        requestId = Number(requestId);
        recurrenceId = Number(recurrenceId);
        uid = Number(uid);

        setLoadingStatusRequest(true);
        const response = await sendApiRequest(Api.exceptionRequest.changeTime.manageCorrectionRequest, 'POST', {
          ...manageCorrectionReqBody(),
          isApproved: false,
          userShiftChangeTimeRequestId: requestId,
          shiftRecurrenceId: recurrenceId,
          description: rejectionReason,
          userId: uid,
        });
        if (response.statusCode === 200) {
          updateRequests(requestId, recurrenceId, uid, 'Rejected');
          setResponseBody('Request rejected successfully');
          setShowModel(true);
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            handleReject();
          });
        }
      } catch (error) {
        console.error(error);
      }
      setLoadingStatusRequest(false);
      setRequestIdToReject('');
      setRejectionReason('');
    }
  };

  const closeModal = () => {
    setRequestIdToReject('');
    setRejectionReason('');
    setEmptyNote(false);
  };

  const handleKeyChange = (key) => {
    setTabkey(key);
    // eslint-disable-next-line no-use-before-define
    setPagination(prevState => ({ ...prevState, pageIndex: 1, isPaginationChanged: true }));
    // filterData(key);
  };

  const filterData = (key) => {
    const body = {
      languageId: 1,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      // eslint-disable-next-line radix
      status: parseInt(status),
      startDate: startDate.date !== null ? moment(startDate.date).format('YYYY-MM-DDTHH:mm:ss') : null,
      endDate: endDate.date !== null ? moment(endDate.date).format('YYYY-MM-DDTHH:mm:ss') : null,
    };

    if (key === 'myTeam' && !isEmployee()) {
      body.approverUserId = getUserId();
      // eslint-disable-next-line radix
      body.userId = parseInt(employee);
    } else {
      body.approverUserId = 0;
      body.userId = getUserId();
    }
    fetchRequestData(body, {});
  };

  const clearFilterChange = () => {
    setStartDate(() => ({
      date: null,
      valid: true,
    }));
    setEndDate(() => ({
      date: null,
      valid: true,
    }));
    setStatus('0');
    setEmployee(0);
    fetchIntialPageLoadData();
    setClearFilterStatus(true);
    setPagination(prevState => ({ ...prevState, pageIndex: 1 }));
  };

  const handleSearch = () => {
    filterData(tabkey);
    setClearFilterStatus(false);
  };
  
  useEffect(() => {
    if (pagination.isPaginationChanged) {
      filterData(tabkey);
    }
  }, [pagination]);

  const closeResponseModel = () => {
    setShowModel(false);
  };

  const Actions = ({ userShiftChangeTimeRequestId, shiftRecurrenceId, userId }) => (
    <div>
      <button type="button" className="no-style-btn" onClick={() => handleApproved(userShiftChangeTimeRequestId, shiftRecurrenceId, userId)}>
       
        <OverlayTrigger
          placement="top"
          delay={{ show: 50, hide: 40 }}
          overlay={renderTooltip('Checked', 'checkedTooltip')}
        >
          <img
            src={checkedIcon}
            alt="Checked"
          />
        </OverlayTrigger>
      </button>
      <button type="button" className="no-style-btn" onClick={() => handleReject(userShiftChangeTimeRequestId, shiftRecurrenceId, userId, 'showModal')}>
        <OverlayTrigger
          placement="top"
          delay={{ show: 50, hide: 40 }}
          overlay={renderTooltip('Cancel', 'cancelTooltip')}
        >
          <img
            src={crossInCircleIcon}
            alt="Cancel"
          />
        </OverlayTrigger>
      </button>
    </div>
  );
  return (
    <div className="container-fluid overTime">
      <div className="card_layout change-time">
      
        {showModel && (
        <ApiResponsePopup
          body={body}
          closeResponseModel={closeResponseModel}
        />
        ) }
           
        {!!requestIdToReject && (
          <CustomModal
            t={t}
            loading={loadingStatusRequest}
            handleClose={closeModal}
            handleSave={handleReject}
            handleChange={val => setRejectionReason(val)}
            value={rejectionReason}
            isEmptyNote={isEmptyNote}
          />
        )}
        {!isEmployee()
          && (
            <Tabs
              tabkey={tabkey}
              handleKeyChange={handleKeyChange}
            />
          )
        }
        <Row className="mt-3 mx-0">
          {tabkey === 'myTeam' && !isEmployee() && (
            <Col lg={4}>
              <Form.Group
                controlId="exampleForm.SelectCustom"
              >
                <Form.Label>Employee</Form.Label>
                <Form.Control
                  name="employeesId"
                  as="select"
                  value={employee}
                  className="form-control"
                  onChange={e => setEmployee(e.target.value)}
                >
                  <option key="0" value="0">
                    {t('AllText')}
                  </option>
                  {employeeByShiftManager.map(empItem => (
                    <option key={empItem.id} value={empItem.id}>
                      {empItem.firstName}
                      {' '}
                      {empItem.lastName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          )}
          <Col lg={4}>
            <Form.Group
              controlId="exampleForm.SelectCustom"
            >
              <Form.Label>Start Date</Form.Label>
              <DatePicker
                autoComplete="off"
                name="startDate"
                selected={startDate.date}
                placeholderText="MM/DD/YYYY"
                onChange={date => setStartDate(() => ({
                  date,
                  valid: true,
                }))}
                placeholderText={commonService.localizedDateFormat()}
                dateFormat={commonService.localizedDateFormatForPicker()}
                className="form-control date-picker-icon"
                pattern="\d{2}\/\d{2}/\d{4}"
              />
            </Form.Group>
          </Col>
          <Col lg={4}>
            <Form.Group
              controlId="exampleForm.SelectCustom"

            >
              <Form.Label>End Date sds</Form.Label>
              <DatePicker
                autoComplete="off"
                name="endDate"
                selected={endDate.date}
                placeholderText="MM/DD/YYYY"
                placeholderText={commonService.localizedDateFormat()}
                dateFormat={commonService.localizedDateFormatForPicker()}
                onChange={date => setEndDate(() => ({
                  date,
                  valid: true,
                }))}
                className="form-control date-picker-icon"
                pattern="\d{2}\/\d{2}/\d{4}"
              />
            </Form.Group>
          </Col>
          <Col lg={4}>
            <Form.Group
              controlId="exampleForm.SelectCustom"
            >
              <Form.Label>Status</Form.Label>
              <Form.Control
                name="status"
                as="select"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option key="0" value="0"> Select Status</option>
                <option key="1" value="1"> Requested </option>
                <option key="2" value="2"> Pending </option>
                <option key="3" value="3"> Accepted  </option>
                <option key="4" value="4"> Rejected  </option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="d-flex flex-column flex-sm-row align-items-center search-btn">
              <div className="px-3">
                <Button className="mx-0" type="button" onClick={() => handleSearch()}>
                  {t('Common.Search')}
                </Button>
              </div>
              {!clearFilterStatus
                ? (
                  <div className="px-3">
                    <Button className="mx-0" type="button" onClick={() => clearFilterChange()}>
                      {t('Common.ClearFilter')}
                    </Button>
                  </div>
                ) : null
              }

            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Table responsive className="text-no-wrap">
              <thead>
                <tr>
                  {tableHeader(t, isEmployee()).map(headerData => (
                    <th key={headerData.label}>{headerData.label}</th>
                  ))}
                  {isEmployee() || tabkey === 'myTimeSheet' ? <th>{t('ManageRequest.ExceptionRequests.ChangeTime.Message')}</th> : null}
                  {isShowOverdue ? <th>{t('ManageRequest.ExceptionRequests.ChangeTime.OverDue')}</th> : null}

                </tr>
              </thead>
              <tbody>
                {changeTimeRequests.length === 0 && (
                <tr>
                  <td colSpan="10">
                    No records found
                  </td>
                </tr>
                )}
                {changeTimeRequests.map((request, i) => {
                  const {
                    date, shiftLabel, originalShiftStartTimeUtc, originalShiftEndTimeUtc,
                    lineManager, requestedShiftStartTimeUtc, requestedShiftEndTimeUtc,
                    // eslint-disable-next-line max-len
                    requestedBy, statusName, status, shiftRecurrenceId, userShiftChangeTimeRequestId,
                    userId, approveRejectDescription, requestDescription, overDueApprovalDetails,
                  } = request;

                  const isPending = statusName === 'Pending';
                  // pageIndex is the item number 1 or 11
                  let actionsCol = statusName;
                  if (!isEmployee() && tabkey === 'myTeam') {
                    actionsCol = (
                      isPending ? (
                        <Actions
                          userId={userId}
                          userShiftChangeTimeRequestId={userShiftChangeTimeRequestId}
                          shiftRecurrenceId={shiftRecurrenceId}
                        />
                      ) : (statusName)
                    );
                  }

                  return (
                    <tr key={originalShiftStartTimeUtc}>
                      <td>{shiftLabel}</td>
                      <td>
                        {date ? commonService.localizedDate(date) : ''}
                      </td>
                      <td>{formatTime(originalShiftStartTimeUtc)}</td>
                      <td>{formatTime(originalShiftEndTimeUtc)}</td>
                      <td>{lineManager}</td>
                      <td>{formatTime(requestedShiftStartTimeUtc)}</td>
                      <td>{formatTime(requestedShiftEndTimeUtc)}</td>
                      <td>{requestedBy}</td>
                      <td>{actionsCol}</td>
                      {isEmployee() || tabkey === 'myTimeSheet' ? <td className="max-width-150px">{status === 1 ? requestDescription : approveRejectDescription}</td> : null}
                      {isShowOverdue ? <td className="max-width-150px">{overDueApprovalDetails}</td> : null}
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <div className="mt-3">
              <PaginationAndPageNumber
                totalPageCount={Math.ceil(pagination.totalRecords / pagination.pageSize)}
                totalElementCount={pagination.totalRecords}
                updatePageNum={updatePageNum}
                updatePageCount={updatePageCount}
                currentPageNum={pagination.pageIndex}
                recordPerPage={pagination.pageSize}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ManageRequestsChangeTime;


function CustomModal({
  loading, handleClose, handleSave, handleChange, value, isEmptyNote, t,
}) {
  const dummyFunc = () => { };
  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show
      onHide={loading ? dummyFunc : handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('ManageRequest.ExceptionRequests.ChangeTime.RejectionReason')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea cols="30" rows="7" value={value} onChange={e => handleChange(e.target.value)} placeholder={t('ManageRequest.ExceptionRequests.ChangeTime.TypeTheReasonHere')} className="w-100" />
        {isEmptyNote && (<div className="text-danger">{t('Common.Requried')}</div>)}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          {t('ManageRequest.ExceptionRequests.ChangeTime.Close')}
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {t('ManageRequest.ExceptionRequests.ChangeTime.Save')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
