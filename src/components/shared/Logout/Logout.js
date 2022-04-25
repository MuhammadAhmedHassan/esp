import React, { } from 'react';
import { userService } from '../../../services';

class Logout extends React.Component {
  constructor(props) {
    super(props);
    userService.logout();
  }
}
export default Logout;
