import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from '../Login/Login';
import ForgotPassword from '../Login/forgot_password';
import ResetPassword from '../Login/reset_password';
import Layout from './Layout';

class Routes extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route
            component={ForgotPassword}
            exact
            path="/forgot-password"
          />
          <Route
            component={ResetPassword}
            exact
            path="/reset-password"
          />
          <Layout />
        </Switch>
      </Router>
    );
  }
}
export default Routes;
