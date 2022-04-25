/* eslint-disable max-len */
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import './style.scss';
import {
  Row, Table, Container, Col, Button,
} from 'react-bootstrap';
import Api from '../../../common/Api';
import { userService } from '../../../../services';
import LoadingSpinner from '../../../shared/LoadingSpinner';
import PaginationAndPageNumber from '../../../shared/Pagination';
import Filter from '../Filter/index';

class PendingAbsence extends Component {
  constructor(props) {
    super(props);
    let isAdmin = false;
    const token = userService.getToken();
    const userRoles = userService.getRole() ? userService.getRole() : [];
    if (userRoles.find(role => role.name === 'Administrators')) {
      isAdmin = true;
    }
    this.state = {
      token: `${token}`,
      pendingAbsence: [],
      loaded: true,
      organisationId: 0,
      divisionId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      managerId: 0,
      userId: 0,
      contractTypeId: 0,
      countryId: 0,
      stateId: 0,
      city: '',
      workLocationId: 0,
      startDate: null,
      endDate: null,
      pageIndex: 1,
      pageSize: 10,
      widgetId: 3,
      totalRecords: 0,
      isAdmin,
    };
    this.handleChange = this.handleChange.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  componentDidMount() {
    this.getPendingAbsence();
  }

  getPendingAbsence = () => {
    const {
      token,
      organisationId,
      divisionId,
      businessUnitId,
      departmentId,
      teamId,
      managerId,
      userId,
      contractTypeId,
      countryId,
      stateId,
      city,
      workLocationId,
      startDate,
      endDate,
      pageIndex,
      pageSize,
      widgetId,
    } = this.state;
    fetch(`${Api.dashboard.getDashboardDetails}`, {
      method: 'POST',
      headers: new Headers({
        Token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        languageId: 1,
        offset: '',
        isActive: true,
        pageIndex,
        pageSize,
        organisationId,
        divisionId,
        businessUnitId,
        departmentId,
        teamId,
        managerId,
        userId,
        contractTypeId,
        countryId,
        stateId,
        city,
        workLocationId,
        startDate,
        endDate,
        widgetId,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            pendingAbsence: response.data,
            loaded: false,
            pageIndex: response.pageIndex || 1,
            pageSize: response.pageSize,
            totalRecords: response.totalRecords,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getPendingAbsence());
          });
        }
      })
      .catch((err) => {
        this.setState({
          pendingAbsence: [],
          loaded: false,
          
        });
        // eslint-disable-next-line no-alert
        alert(`Failed to fetch get user consent service. Please try again after sometime. ${err}`);
      });
  }

  handleChange = (name, value) => {
    // eslint-disable-next-line radix
    this.setState({ [name]: parseInt(value) });
  }

  search = () => {
    this.getPendingAbsence();
  }

  clearFilter = () => {
    this.setState({
      divisionId: 0,
      businessUnitId: 0,
      departmentId: 0,
      teamId: 0,
      managerId: 0,
    }, () => {
      this.getPendingAbsence();
    });
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
      pageSize: parseInt(pageCount, 10),
      pageIndex: 1,
      loaded: false,
    });
  }

  
  view =(managerId) => {
    const { isAdmin } = this.state;
    const { history } = this.props;
    if (isAdmin) {
      history.push({
        pathname: '/view-absence',
        state: { id: managerId },
      });
    } else {
      history.push({
        pathname: '/manage-requests/vacation-requests',
        state: {
          employeeId: managerId,
        },
      });
    }

    // eslint-disable-next-line react/destructuring-assignment
  }

  render() {
    const { t } = this.props;
    const {
      pendingAbsence, pageSize, loaded, totalRecords, pageIndex, isAdmin,
    } = this.state;
    return (
      <>
        <Container fluid>
          <Row>
            <Col>
             
              {!loaded ? (
                <>
                  <div>
              
                <Row>
                  <Filter showEmployee="false" isAdmin={isAdmin} clearFilter={this.clearFilter} search={this.search} handleChange={this.handleChange} />
                </Row>
                
                    <div className="card_layout p-1">
                      <Row className="p-2">
                        <Col>
                          <Table responsive striped bordered>
                            <thead>
                              <tr className="table-header ">
                                <th className="pl-5">{t('Dashboard.PendingAbsence.ManagerName')}</th>
                                <th className="pl-5">{t('Dashboard.PendingAbsence.No')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pendingAbsence.map(data => (
                                <tr key={data.employeeId}>
                                  <td className="pl-5 exceptionText">{data.employeeName}</td>
                                  <td className="pl-5">
                                    <Button className="no-style-btn link" onClick={() => this.view(data.employeeId)}>
                                      {' '}
                                      {data.dataCount}
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          <div className="mt-3">
                            <PaginationAndPageNumber
                              totalPageCount={Math.ceil(totalRecords / pageSize)}
                              totalElementCount={totalRecords}
                              updatePageNum={this.updatePageNum}
                              updatePageCount={this.updatePageCount}
                              currentPageNum={pageIndex}
                              recordPerPage={pageSize}
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>

                  </div>
                </>
              ) : (
                <LoadingSpinner />
              )}
          
            </Col>
          </Row>
        </Container>

      </>
    );
  }
}

export default withTranslation()(PendingAbsence);
