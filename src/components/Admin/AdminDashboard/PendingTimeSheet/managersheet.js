/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import './style.scss';
import {
  Row, Col, Table, Button, Form,
} from 'react-bootstrap';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import PaginationAndPageNumber from '../../../shared/Pagination';
import Api from '../../../common/Api';
import { sendApiRequest } from '../../../common/serviceCall/PostApiCall';
import { userService } from '../../../../services';

const tableHeader = t => ([
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.ShiftLabel') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.ShiftDate') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.OriginalStartTime') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.OriginalEndTime') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.LineManager') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.RequestedStartTime') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.RequestedEndTime') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.RequestedBy') },
  { label: t('ManageRequest.ExceptionRequests.ChangeTime.OverDue') },
]);

const ManagerSheet = (props) => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageIndex: 1,
    pageSize: 10,
    totalRecords: 0,
    isPaginationChanged: true,
  });
  // eslint-disable-next-line no-undef
  const { t } = useTranslation();

  // eslint-disable-next-line react/destructuring-assignment
  const managerId = props.location.state.id;
  const [changeTimeRequests, setChangeTimeRequests] = useState([]);
  const [clearFilterStatus, setClearFilterStatus] = useState(true);
  const [employee, setEmployee] = useState(0);
  const date = new Date();
  const [startDate, setStartDate] = useState({
    date: new Date(date.getFullYear(), date.getMonth(), 1),
    valid: true,
  });

  const [endDate, setEndDate] = useState({
    date: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    valid: true,
  });

  const apiReqBody = () => ({
    languageId: 1,
    pageIndex: 1,
    pageSize: 10,
    approverUserId: 3,
    userId: 0,
  });


  const [employeeByShiftManager, setEmployeeByShiftManager] = useState([]);

  const fetchEmployeeByShiftManagerId = async () => {
    const body = {
      languageId: 1,
      id: managerId,
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

  const fetchIntialPageLoadData = async (pageIndex = 1, pageSize = 10, paginationFields = {}) => {
    const body = {
      ...apiReqBody(),
      status: 2,
      startDate: null,
      endDate: null,
      pageIndex,
      pageSize,
    };
   
    body.approverUserId = managerId;
    body.userId = 0;
    // eslint-disable-next-line no-use-before-define
    fetchRequestData(body, paginationFields);
  };


  const fetchRequestData = async (body, paginationFields) => {
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

  const filterData = () => {
    const body = {
      languageId: 1,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      // eslint-disable-next-line radix
      status: 2,
      startDate: startDate.date !== null ? moment(startDate.date).format('YYYY-MM-DDTHH:mm:ss') : null,
      endDate: endDate.date !== null ? moment(endDate.date).format('YYYY-MM-DDTHH:mm:ss') : null,
    };

    
    body.approverUserId = managerId;
    // eslint-disable-next-line radix
    body.userId = parseInt(employee);
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

    setEmployee(0);
    fetchIntialPageLoadData();
    setClearFilterStatus(true);
    setPagination(prevState => ({ ...prevState, pageIndex: 1 }));
  };

  const handleSearch = () => {
    filterData();
    setClearFilterStatus(false);
  };
  
  useEffect(() => {
    if (pagination.isPaginationChanged) {
      filterData();
    }
  }, [pagination]);

  return (
    <div className="container-fluid overTime">
      <div className="card_layout change-time">
        <Row>
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
                dateFormat="MM/dd/yyyy"
                className="form-control date-picker-icon"
                pattern="\d{2}\/\d{2}/\d{4}"
              />
            </Form.Group>
          </Col>
          <Col lg={4}>
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
                  {tableHeader(t).map(headerData => (
                    <th key={headerData.label}>{headerData.label}</th>
                  ))}
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
                {changeTimeRequests.map((request) => {
                  const {
                    date, shiftLabel, originalShiftStartTimeUtc, originalShiftEndTimeUtc,
                    lineManager, requestedShiftStartTimeUtc, requestedShiftEndTimeUtc,
                    requestedBy, overDueApprovalDetails,
                  } = request;

                  // pageIndex is the item number 1 or 11
                

                  return (
                    <tr key={originalShiftStartTimeUtc}>
                      <td>{shiftLabel}</td>
                      <td>{formatDate(date)}</td>
                      <td>{formatTime(originalShiftStartTimeUtc)}</td>
                      <td>{formatTime(originalShiftEndTimeUtc)}</td>
                      <td>{lineManager}</td>
                      <td>{formatTime(requestedShiftStartTimeUtc)}</td>
                      <td>{formatTime(requestedShiftEndTimeUtc)}</td>
                      <td>{requestedBy}</td>
                      <td>{overDueApprovalDetails}</td>
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

export default ManagerSheet;
