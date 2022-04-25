/* eslint-disable no-restricted-globals */
import { BehaviorSubject } from 'rxjs';
import Api from '../components/common/Api';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split('; ');
  const cookie = parts.filter(v => v.split(`${name}=`).length == 2);
  if (cookie.length >= 1) return cookie[0].split(`${name}=`)[1];
  return '{}';
}

function getUser() {
  return JSON.parse(getCookie('espUser'));
}

// to end Impersonation

function endImpersonation() {
  sessionStorage.clear();
  const impUser = getImpUser();
  const user = getUser();
  const data = {
    id: user.userId,
    languageId: 1,
  };

  const requestOptions = {
    method: 'POST',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      token: getToken(),
    }),
    body: JSON.stringify(data),
  };
  fetch(`${Api.delegation.endImpersonation}`, requestOptions)
    .then((response) => {
      if (impUser && Object.keys(impUser).length !== 0) {
        document.cookie = `espUser=${JSON.stringify(impUser || {})};path=/`;
      }
      document.cookie = `${'espImp' + '=; expires='}Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    });
}

async function logout(email) {
  // remove user from local storage to log user out
  // localStorage.removeItem('user');
  sessionStorage.clear();
  const user = getUserEmail();
  // let userData = window.atob(user.authdata);
  // userData = JSON.parse(userData);
  const requestOptions = {
    method: 'POST',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    }),
    body: JSON.stringify({ email: user }),
  };
  await fetch(`${Api.logout}`, requestOptions)
    .then((data) => {
      endImpersonation();
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;max-age=0;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/');
      });
      window.location.href = '/login';
      return data;
    });

  window.location.href = '/login';
  return user;
}

function userDetail(email) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  };
  fetch(`${Api.userDetail}`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      document.cookie = 'espUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
      return user;
    });
}

function getUserEmail() {
  const user = getUser();
  let userData = window.atob(user.authdata);
  userData = JSON.parse(userData).username;
  return userData;
}

function getImpUser() {
  return JSON.parse(getCookie('espImp'));
}

function getUserId() {
  return getUser().userId;
}

function getImpersonatorName() {
  return getUser().impersonatorName;
}

function getToken() {
  return getUser().refreshToken;
}

function getRole() {
  const roles = getUser().role;
  return roles || [];
}

function getImpRole() {
  return getImpUser().role;
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout(getUserEmail());
        location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function loginAd(name, email, aio, props) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name, email, adToken: aio, languageId: 1, loginViaDeviceTypeId: 10,
    }),
  };

  return fetch(`${Api.loginAd}`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      const { location, history } = props;
      const { from } = location.state || { from: { pathname: '/gdpr/consent' } };
      // login successful if there's a user in the response
      if (user.statusCode === 200) {
        const usr = user.data;
        usr.email = '';
        const date = new Date();
        date.setDate(date.getDate() + 1);
        // store user details and basic auth credentials in cookie
        // to keep user logged in between page refreshes
        usr.authdata = JSON.stringify({ username: email });
        usr.authdata = window.btoa(`${usr.authdata}`);
        document.cookie = `espUser=${JSON.stringify(usr)}; expires=${date} ;path=/`;
        endImpersonation();
        if (usr.isFirstLogin) {
          history.push(from);
        }
        // localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    });
}

function login(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username, password, languageId: 1, logInVia: 10,
    }),
  };

  return fetch(`${Api.login}`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      // login successful if there's a user in the response
      if (user.statusCode === 200) {
        const usr = user.data;
        usr.email = '';
        const date = new Date();
        date.setDate(date.getDate() + 1);

        // store user details and basic auth credentials in cookie
        // to keep user logged in between page refreshes
        usr.authdata = JSON.stringify({ username });
        usr.authdata = window.btoa(`${usr.authdata}`);
        document.cookie = `espUser=${JSON.stringify(
          usr,
        )}; expires=${date} ;path=/`;
        endImpersonation();
        // localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    });
}

const impersonationSubject = new BehaviorSubject({
  showName: !!getImpersonatorName(),
  name: getImpersonatorName(),
});

const isEmployee = () => getRole().some(r => r.name === 'Employee');
const isManager = () => getRole().some(r => r.name === 'Manager');
const isAdmin = () => getRole().some(r => r.name === 'Administrators');
const getFirstLastAndCurrentDateOfTheMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDateOfMonth = new Date(year, month, 1);
  const lastDateOfMonth = new Date(year, month + 1, 0);
  const currentDateOfMonth = new Date(year, month, date.getDate());
  return { firstDateOfMonth, currentDateOfMonth, lastDateOfMonth };
};

const usageDetailsSubject = new BehaviorSubject({});


async function getRefreshToken() {
  const { accessToken, refreshToken } = getUser();
  const response = await fetch(`${Api.getRegreshToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      languageId: 1, accessToken, refreshToken,
    }),
  });
  const resp = await response.json();
  if (resp.statusCode === 200) {
    const user = getUser();
    user.accessToken = resp.data.accessToken;
    user.refreshToken = resp.data.refreshToken;
    const usr = user;
    const date = new Date();
    date.setDate(date.getDate() + 1);
    usr.authdata = JSON.stringify({ userName: resp.data.userName });
    usr.authdata = window.btoa(`${usr.authdata}`);
    document.cookie = `espUser=${JSON.stringify(
      usr,
    )}; expires=${date} ;path=/`;
    // endImpersonation();
    return resp.data;
  }
  logout();
  alert('Your session has been expired. Please login again!');
  window.location.reload();
  return true;
}


export const userService = {
  impersonationSubject,
  login,
  loginAd,
  logout,
  userDetail,
  getUser,
  getToken,
  getUserEmail,
  getUserId,
  getRole,
  getImpRole,
  endImpersonation,
  getImpersonatorName,
  getImpUser,
  getCookie,
  isEmployee,
  isManager,
  isAdmin,
  getFirstLastAndCurrentDateOfTheMonth,
  getRefreshToken,
};
