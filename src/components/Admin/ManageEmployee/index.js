import React from 'react';
import './style.scss';
import { connect } from 'react-redux';
import AdminRole from './AdminRole';
import UserRole from './UserRole';
import { userService } from '../../../services';

const mapStateToProps = state => ({
  // To get the list of employee details from store
  loggedUserRole: state.checkUserRole.user,
  userId: state.checkUserRole.user.userId,
  roleId: state.checkUserRole.user.role,
});


class ManageEmployee extends React.Component {
  constructor(props) {
    super(props);
    const { location } = this.props;


    this.state = {
      errorMessage: '',
      status: location.state && location.state.status ?  location.state.status :1,
    };
  }

  render() {
    const {status} = this.state;
    const { loggedUserRole } = this.props;
    let isAdministratorRole = false;
    const userRoles = userService.getRole() ? userService.getRole() : [];
    if (userRoles.find(role => role.name === 'Administrators')) {
      isAdministratorRole = true;
    } else {
      isAdministratorRole = false;
    }

    return (
      <div className="container-fluid manage-employee">
        {isAdministratorRole ? (<AdminRole status={status} />) : (<UserRole status={status} />)}        
       
      </div>
    );
  }
}

export default connect(
  mapStateToProps, null,
)(ManageEmployee);
