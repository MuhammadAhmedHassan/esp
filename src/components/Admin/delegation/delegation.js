import React from 'react';
import {
  Form, Card, Button, Table
} from 'react-bootstrap';
import './delegation.scss';
import api from '../../common/Api';
import ViewDelegation from '../../../Images/Icons/view-delegation.svg';
import DelegationIcon from '../../../Images/Icons/delegation.svg';
import PaginationAndPageNumber from '../../shared/Pagination/index';
import { userService } from '../../../services';

const tableHeader = [
  {
    label: 'Name',
  },
  {
    label: 'Department',
  },
  {
    label: 'Sub Department',
  },
  {
    label: 'Groups',
  },
  {
    label: 'Location',
  },
  {
    label: 'Actions',
  },
];


class Delegation extends React.Component {

  constructor(props) {
    super(props);
    const user = userService.getUser();
    const token = userService.getToken();
    this.state = {
      token: `${token}`,
      user,
      languageId: 1,
      locations: [],
      departments: [],
      subDepartments: [],
      groups: [],
      managers: [],
      employees: [],
      locationId: 0,
      departmentId: 0,
      subDepartmentId: 0,
      groupId: 0,
      managerId: 0,
      employeeId: 0,
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
      tableData: [],
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate() {
    const { loaded } = this.state;
    if (!loaded) {
      this.loadData();
    }
  }

  loadData = () => {
    const {
      languageId, pageIndex, pageSize, locationId, departmentId, subDepartmentId, groupId,
      managerId, employeeId, user, token,
    } = this.state;

    const data = {
      languageId,
      locationId,
      pageIndex,
      pageSize,
      departmentId,
      subDepartmentId,
      groupId,
      managerId,
      employeeId,
    };

    fetch(`${api.delegation.search}`, {
      method: 'POST',
      headers: {
        token: `${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),

    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            tableData: response.data,
            totalRecords: response.totalRecords,
            loaded: true,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.loadData());
          });
        } else {
          this.setState({
            tableData: [],
            loaded: true,
          });
        }
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

  handleSearch = () => {
    this.setState({
      pageIndex: 1,
      loaded: false,
    });
  }

  handleClear = () => {
    this.setState({
      locationId: 0,
      departmentId: 0,
      subDepartmentId: 0,
      groupId: 0,
      managerId: 0,
      employeeId: 0,
      pageIndex: 1,
      pageSize: 10,
      totalRecords: 0,
      tableData: [],
      loaded: false,
    });
  }

  render() {
    const {
      locations, departments, subDepartments, groups, managers, employees,
      pageSize, pageIndex, totalRecords, tableData, locationId, departmentId, subDepartmentId,
      groupId, managerId, employeeId,
    } = this.state;
    return (

      <div className="container-fluid delegation">
        <Card>
          <Card.Body>
            <Form>
              {/* filter Section */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Location</Form.Label>
                    <Form.Control as="select" custom name="locationId" value={locationId} onChange={e => this.handleInputChange(e)} >
                      <option value={0}>Choose...</option>
                      {
                        locations.map((location, index) =>
                          <option key={location.id} value={location.id}>{location.name}</option>)
                      }
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Department</Form.Label>
                    <Form.Control as="select" name="departmentId" value={departmentId} onChange={e => this.handleInputChange(e)} custom>
                      <option value={0}>Choose...</option>
                      {
                        departments.map((dept, index) =>
                          <option key={dept.id} value={dept.id}>{dept.name}</option>)
                      }
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Sub-Department</Form.Label>
                    <Form.Control as="select" name="subDepartmentId" value={subDepartmentId} onChange={e => this.handleInputChange(e)} custom>
                      <option value={0}>Choose...</option>
                      {
                        subDepartments.map((subDept, index) =>
                          <option key={subDept.id} value={subDept.id}>{subDept.name}</option>)
                      }
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Groups</Form.Label>
                    <Form.Control as="select" name="groupId" value={groupId} onChange={e => this.handleInputChange(e)} custom>
                      <option value={0}>Choose...</option>
                      {
                        groups.map((grp, index) =>
                          <option key={grp.id} value={grp.id}>{grp.name}</option>)
                      }
                    </Form.Control>
                  </Form.Group>
                </div>
              </div>

              <div className="row mb-3 align-items-center">
                <div className="col-md-3">
                  <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Manager</Form.Label>
                    <Form.Control as="select" name="managerId" value={managerId} onChange={e => this.handleInputChange(e)} custom>
                      <option value={0}>Choose...</option>
                      {
                        managers.map((manager, index) =>
                          <option key={manager.id} value={manager.id}>{manager.name}</option>)
                      }
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Employee</Form.Label>
                    <Form.Control as="select" name="employeeId" value={employeeId} onChange={e => this.handleInputChange(e)} custom>
                      <option value={0}>Choose...</option>
                      {
                        employees.map((emp, index) =>
                          <option key={emp.id} value={emp.id}>{emp.name}</option>)
                      }
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Button className="filter__primary__btn" onClick={this.handleSearch}>
                    Search
                  </Button>
                </div>
                <div className="col-md-3">
                  <Button className="filter__primary__outline__btn" variant="outline" onClick={this.handleClear}>Clear</Button>
                </div>
              </div>
              {/* /filter section  */}
              {/* Delegation Table */}
              <Table striped hover responsive>
                <thead>
                  <tr>
                    {tableHeader.map(data => (
                      <th>
                        {data.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>

                  {tableData.map(data => (
                    <tr key={data.id}>
                      <td>
                        {data.name}
                      </td>
                      <td>
                        {data.department}
                      </td>
                      <td>
                        {data.subDepartment}
                      </td>
                      <td>
                        {data.groups}
                      </td>
                      <td>
                        {data.location}
                      </td>

                      <td>
                        <div className="d-flex">
                          <img className="mr-3 pointer" src={ViewDelegation} />
                          <img className="pointer" src={DelegationIcon} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <PaginationAndPageNumber
                totalPageCount={Math.ceil(totalRecords / pageSize)}
                totalElementCount={totalRecords}
                updatePageNum={() => this.updatePageNum()}
                updatePageCount={() => this.updatePageCount()}
                currentPageNum={pageIndex}
                recordPerPage={pageSize}
              />
              {/* /Delegation Table */}
            </Form>
          </Card.Body>
        </Card>
      </div>

    );
  }
}

export default Delegation;
