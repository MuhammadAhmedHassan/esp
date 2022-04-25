import './App.scss';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Login from './components/Login/Login';
import Auth from './components/Login/Auth';
import ForgotPassword from './components/Login/forgot_password';
import ResetPassword from './components/Login/reset_password';
import Layout from './components/shared/Layout';
import { userService } from './services';
import ProfileIndex from './components/Admin/MyProfile';


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return '';
}

const PrivateRoute = ({ component: Component, ...rest }) => (

  <Route
    {...rest}
    render={props => (getCookie('espUser') ? <Layout {...props} /> : <Redirect to="/login" />)
    }
  />
);

const Authenticated = props => (
  <>
    <PrivateRoute {...props} />
  </>
);

const NotAuthenticated = () => (
  <Route path="/login" render={props => <Login {...props} />} />
);

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Router>
        <Switch>
          {/* <Route
            component={ProfileIndex}
            exact
            path="/profile"
          /> */}
          <Route exact path="/login" component={NotAuthenticated} />
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

          <Route
            component={Auth}
            exact
            path="/auth"
          />

          <Route {...this.props} component={Authenticated} />
          {' '}
          No match route
        </Switch>
      </Router>
    );
  }
}

export default App;
