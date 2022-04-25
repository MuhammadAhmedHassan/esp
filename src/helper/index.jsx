import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { userService } from '../services/user.service';

const { getUser, getToken } = userService;

export const isLoggedIn = () => (!!getUser());

export const accessScreen = (screen) => {
  if (getToken()) {
    const accessList = JSON.parse(sessionStorage.getItem('userAccess'));
    const isAccess = accessList.find(x => x.screen === screen);
    return !!isAccess;
  }
  return false;
};

export const PrivateRoute = ({ component: Component, ...rest }) => {
  if (rest.screenKey !== '' && isLoggedIn() && rest.path !== '/') {
    return (
      <Route
        {...rest}
        render={props => (
          accessScreen(rest.screenKey)
            ? <Component {...props} />
            : <h2 className="m-5 text-center">You don't have access to this page</h2>
        )}
      />
    );
  }

  // Show the component only when the user is logged in
  // Otherwise, redirect the user to /login page
  return (
    <Route
      {...rest}
      render={props => (
        isLoggedIn()
          ? <Component {...props} />
          : <Redirect to="/login" />
      )}
    />
  );
};

// restricted = false meaning public route
// restricted = true meaning restricted route
export const PublicRoutes = ({ component: Component, restricted, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isLoggedIn() && restricted
        ? <Redirect to="/" />
        : <Component {...props} />
    )}
  />
);
