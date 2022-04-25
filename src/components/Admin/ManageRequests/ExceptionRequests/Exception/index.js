import React, { useEffect, useState } from 'react';
import './style.scss';
import {
  Row, Col, Table, Modal, Button, Form,
} from 'react-bootstrap';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import checkedIcon from '../../../../../Images/Icons/checked.svg';
import crossInCircleIcon from '../../../../../Images/Icons/cross-in-circle.svg';
import PaginationAndPageNumber from '../../../../shared/Pagination';
import Api from '../../../../common/Api';
import { sendApiRequest } from '../../../../common/serviceCall/PostApiCall';
import { userService } from '../../../../../services';
import Tabs from './Tabs/index';
import ApiResponsePopup from '../../../../shared/Common/ApiResponsePopup';
import { commonService } from '../../../../../services/common.service';
import Filter from './Filter';

const { getUserId, isEmployee, isAdmin } = userService;

const ManageRequestsException = (props) => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageIndex: 1,
    pageSize: 10,
    totalRecords: 0,
    isPaginationChanged: true,
  });

  const { t } = useTranslation();

  const [exceptionRequests, setExceptionRequests] = useState([]);
  const [requestIdToReject, setRequestIdToReject] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loadingStatusRequest, setLoadingStatusRequest] = useState(false);
  const [clearFilterStatus, setClearFilterStatus] = useState(true);
  const [isEmptyNote, setEmptyNote] = useState(false);
  const [status, setStatus] = useState(0);
  const [startDate, setStartDate] = useState({
    date: new Date(moment().startOf('month')),
    valid: true,
  });
  const [showModel, setShowModel] = useState(false);
  const [body, setResponseBody] = useState(false);
  const [endDate, setEndDate] = useState({
    date: new Date(moment().endOf('month')),
    valid: true,
  });

  // eslint-disable-next-line react/destructuring-assignment
  const selectedTab = props.location && props.location.state ? props.location.state.tab : 'myTimeSheet';
   
  const [tabkey, setTabkey] = useState(selectedTab);

  // eslint-disable-next-line react/destructuring-assignment
  const propsEmployee = props.location && props.location.state ? props.location.state.employeeId : 0;
  // eslint-disable-next-line react/destructuring-assignment
  const propsDivisionId = props.location && props.location.state ? props.location.state.divisionId : 0;
  // eslint-disable-next-line react/destructuring-assignment
  const propsBusinessUnitId = props.location && props.location.state ? props.location.state.businessUnitId : 0;
  // eslint-disable-next-line max-len
  // eslint-disable-next-line react/destructuring-assignment
  const propsDepartmentId = props.location && props.location.state ? props.location.state.departmentId : 0;
  // eslint-disable-next-line react/destructuring-assignment
  const propsTeamId = props.location && props.location.state ? props.location.state.teamId : 0;
  // eslint-disable-next-line react/destructuring-assignment
  const propsManagerId = props.location && props.location.state ? props.location.state.managerId : 0;

  const [searchParamAdmin, setAdminParams] = useState({
    divisionId: parseInt(propsDivisionId),
    businessUnitId: parseInt(propsBusinessUnitId),
    departmentId: parseInt(propsDepartmentId),
    teamId: parseInt(propsTeamId),
    managerId: parseInt(propsManagerId),
    // eslint-disable-next-line radix
    empId: parseInt(propsEmployee),
    isReset: false,
  });

  const handleChange = (name, value) => {
    // eslint-disable-next-line no-multi-assign
    const params = searchParamAdmin[name] = value;
    setAdminParams(prevState => (
      {
        ...prevState,
        ...params,
      }
    ));
  };

  const fetchRequestData = async (requestBody, paginationFields) => {
    let userId = getUserId();
    if (!isEmployee() && tabkey !== 'myTimeSheet') {
      // eslint-disable-next-line eqeqeq
      userId = (searchParamAdmin.empId != 0) ? Number(searchParamAdmin.empId) : userId;
    }
    const data = {
      ...requestBody,
      divisionId: Number(searchParamAdmin.divisionId),
      businessUnitId: Number(searchParamAdmin.businessUnitId),
      departmentId: Number(searchParamAdmin.departmentId),
      teamId: Number(searchParamAdmin.teamId),
      managerId: Number(searchParamAdmin.managerId),
      userId,
    };
    try {
      const response = await sendApiRequest(Api.exceptionRequest.exception.search, 'POST', data);
      if (response.statusCode === 200) {
        setExceptionRequests([]);
        setExceptionRequests(response.data);
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

  const fetchData = async () => {
    const requestBody = {
      languageId: 1,
      userId: getUserId(),
      statusId: parseInt(status, 10),
      startDateTime: startDate.date,
      endDateTime: endDate.date,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      // requestTypeId = 1 for my exceptions and requestTypeId = 2 for my team exceptions.
      requestTypeId: tabkey === 'myTimeSheet' ? 1 : 2,
    };
    fetchRequestData(requestBody);
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
  };
  const updatePageCount = (recordsPerPage) => {
    setPagination(prevState => ({
      ...prevState,
      pageSize: parseInt(recordsPerPage, 10),
      pageIndex: 1,
      isPaginationChanged: true,
    }));
  };

  const handleApproved = async (id) => {
    try {
      const response = await sendApiRequest(Api.exceptionRequest.exception.approveReject, 'POST', {
        id,
        languageId: 1,
        offset: '',
        isActive: true,
        // 30 is Approved Status id
        statusId: 30,
        approvedRejectedById: getUserId(),
        notes: '',
      });
      if (response.statusCode === 200) {
        fetchData();
        setResponseBody('Request approved successfully');
        setShowModel(true);
      } else if (response.statusCode === 401) {
        const refreshToken = userService.getRefreshToken();
        refreshToken.then(() => {
          handleApproved(id);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id, userId, type) => {
    if (type === 'showModal') {
      setRequestIdToReject(`${id}-${userId}`);
    } else {
      try {
        if (rejectionReason === '') {
          setEmptyNote(true);
          return false;
        }
        let [rId, uId] = requestIdToReject.split('-');
        rId = Number(rId);

        setLoadingStatusRequest(true);
        const response = await sendApiRequest(Api.exceptionRequest.exception.approveReject, 'POST', {
          id: rId,
          languageId: 1,
          offset: '',
          isActive: true,
          // 20 is Rejected Status id
          statusId: 20,
          approvedRejectedById: getUserId(),
          notes: rejectionReason,
        });
        if (response.statusCode === 200) {
          fetchData();
          setResponseBody('Request rejected successfully');
          setShowModel(true);
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            handleReject(id, userId, type);
          });
        }
      } catch (error) {
        console.error(error);
      }
      setLoadingStatusRequest(false);
      setRequestIdToReject('');
      setRejectionReason('');
    }
    return true;
  };

  const closeModal = () => {
    setRequestIdToReject('');
    setRejectionReason('');
    setEmptyNote(false);
  };

  const handleKeyChange = (key) => {
    setTabkey(key);
    setPagination(prevState => ({ ...prevState, pageIndex: 1, isPaginationChanged: true }));
  };

  const filterData = (key) => {
    const requestBody = {
      languageId: 1,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      statusId: parseInt(status, 10),
      userId: getUserId(),
      startDateTime: startDate.date !== null ? moment(startDate.date).format('YYYY-MM-DDTHH:mm:ss') : null,
      endDateTime: endDate.date !== null ? moment(endDate.date).format('YYYY-MM-DDTHH:mm:ss') : null,
      // requestTypeId = 1 for my exceptions and requestTypeId = 2 for my team exceptions.
      requestTypeId: key === 'myTimeSheet' ? 1 : 2,
    };

    fetchRequestData(requestBody, {});
  };

  const clearFilterChange = () => {
    setStartDate(() => ({
      date: new Date(moment().startOf('month')),
      valid: true,
    }));
    setEndDate(() => ({
      date: new Date(moment().endOf('month')),
      valid: true,
    }));
    setAdminParams({
      divisionId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      managerId: 0,
      empId: 0,
      isReset: true,
    });
    setStatus('0');
    setClearFilterStatus(true);
    setPagination(prevState => ({ ...prevState, pageIndex: 1, isPaginationChanged: true }));
  };

  const handleSearch = () => {
    setPagination(prevState => (
      {
        ...prevState,
        pageIndex: 1,
        isPaginationChanged: true,
      }
    ));
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

  const Actions = ({ id, userId }) => (
    <div>
      <button type="button" className="no-style-btn" onClick={() => handleApproved(id, userId)}>
        <img
          src={checkedIcon}
          alt="Checked"
          title={t('ManageRequest.ExceptionRequests.ChangeTime.Approve')}
        />
      </button>
      <button type="button" className="no-style-btn" onClick={() => handleReject(id, userId, 'showModal')}>
        <img
          src={crossInCircleIcon}
          alt="Cancel"
          title={t('ManageRequest.ExceptionRequests.ChangeTime.Reject')}
        />
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
        )}

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
          {
            tabkey === 'myTeam' && !isEmployee() && (
              <Filter isAdmin={isAdmin()} handleChange={handleChange} params={searchParamAdmin} />
            )
          }
          <Col lg={3}>
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
                dateFormat="MM/dd/yyyy"
                className="form-control date-picker-icon"
                pattern="\d{2}\/\d{2}/\d{4}"
              />
            </Form.Group>
          </Col>
          <Col lg={3}>
            <Form.Group
              controlId="exampleForm.SelectCustom"
            >
              <Form.Label>End Date</Form.Label>
              <DatePicker
                autoComplete="off"
                name="endDate"
                selected={endDate.date}
                placeholderText="MM/DD/YYYY"
                dateFormat="MM/dd/yyyy"
                onChange={date => setEndDate(() => ({
                  date,
                  valid: true,
                }))}
                className="form-control date-picker-icon"
                pattern="\d{2}\/\d{2}/\d{4}"
              />
            </Form.Group>
          </Col>
          <Col lg={3}>
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
                <option key="10" value="10"> Pending </option>
                <option key="20" value="20"> Rejected </option>
                <option key="3" value="30"> Approved  </option>
                <option key="40" value="40"> Withdrawn  </option>
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
            {
              tabkey === 'myTimeSheet' ? (
                <Table responsive className="text-no-wrap">
                  <thead>
                    <tr>
                      <th className="text-left">Start Date</th>
                      <th>End Date</th>
                      <th>Actual Start Date</th>
                      <th>Actual End Date</th>
                      <th>Exception Type</th>
                      <th>Shift Name</th>
                      <th>Exception Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exceptionRequests.length === 0 && (
                      <tr>
                        <td colSpan="10">
                          No records found
                        </td>
                      </tr>
                    )}
                    {exceptionRequests.map((request) => {
                      const {
                        actualStartDateTime, exceptionType, shiftTitle, status,
                        startDateTime, endDateTime, actualEndDateTime,
                      } = request;

                      return (
                        <tr key={actualStartDateTime}>
                          <td>{startDateTime ? commonService.localizedDateAndTime(startDateTime) : ''}</td>
                          <td>{endDateTime ? commonService.localizedDateAndTime(endDateTime) : ''}</td>
                          <td>{actualStartDateTime ? commonService.localizedDateAndTime(actualStartDateTime) : ''}</td>
                          <td>{actualEndDateTime ? commonService.localizedDateAndTime(actualEndDateTime) : ''}</td>
                          <td>{exceptionType}</td>
                          <td>{shiftTitle}</td>
                          <td>{status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <Table responsive className="text-no-wrap">
                  <thead>
                    <tr>
                      <th className="text-left">Employee Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Actual Start Date</th>
                      <th>Actual End Date</th>
                      <th>Exception Type</th>
                      <th>Shift Name</th>
                      <th>Exception Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exceptionRequests.length === 0 && (
                      <tr>
                        <td colSpan="10">
                          No records found
                        </td>
                      </tr>
                    )}
                    {exceptionRequests.map((request) => {
                      const {
                        actualStartDateTime, exceptionType, shiftTitle, status,
                        id, userId, userName, notes,
                        startDateTime, endDateTime, actualEndDateTime,
                      } = request;

                      const isPending = status === 'Pending';
                      // pageIndex is the item number 1 or 11
                      let actionsCol = status;
                      if (!isEmployee() && tabkey === 'myTeam') {
                        actionsCol = (
                          isPending ? (
                            <Actions
                              userId={userId}
                              id={id}
                            />
                          ) : (status)
                        );
                      }

                      return (
                        <tr key={actualStartDateTime}>
                          <td>{userName}</td>
                          <td>{startDateTime ? commonService.localizedDateAndTime(startDateTime) : ''}</td>
                          <td>{endDateTime ? commonService.localizedDateAndTime(endDateTime) : ''}</td>
                          <td>{actualStartDateTime ? commonService.localizedDateAndTime(actualStartDateTime) : ''}</td>
                          <td>{actualEndDateTime ? commonService.localizedDateAndTime(actualEndDateTime) : ''}</td>
                          <td>{exceptionType}</td>
                          <td>{shiftTitle}</td>
                          <td>{status}</td>
                          <td>{actionsCol}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )
            }

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

export default ManageRequestsException;


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
