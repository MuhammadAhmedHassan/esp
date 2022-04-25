import React from 'react';
import './style.scss';
import { connect } from 'react-redux';
import EmployeeShiftHistory from '../../EmployeeShift/employeeShiftHistory';
import { userService } from '../../../../services';
import ManagerTabsShift from './managerShiftHistory';

const mapStateToProps = state => ({
  // To get the list of employee details from store
  loggedUserRole: state.checkUserRole.user,
  userId: state.checkUserRole.user.userId,
  roleId: state.checkUserRole.user.role,
});


class ManagerShift extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }

  render() {
    const { loggedUserRole } = this.props;
    let isRole = false;
    const userRoles = userService.getRole() ? userService.getRole() : [];
    if (userRoles.find(role => role.name === 'Manager')) {
      isRole = true;
    } else {
      isRole = false;
    }

    return (
      <div className="container-fluid manage-employee"> 
        {isRole ? (<ManagerTabsShift />) : (<EmployeeShiftHistory />)}
      </div>
    );
  }
}

export default connect(
  mapStateToProps, null,
)(ManagerShift);
