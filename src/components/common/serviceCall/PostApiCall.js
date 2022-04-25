import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import { userService } from '../../../services/user.service';

const { getToken, getUser } = userService;

const PostApiCall = (apiUrl, reqBody, token) => new Promise(async (resolve, reject) => {
  fetch(apiUrl, {
    method: 'POST',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Token: token,
    }),
    body: JSON.stringify(reqBody),
  }).then(response => response.json())
    .then((response) => {
      if (response.statusCode === 200
            || response.statusCode === 202
            || response.statusCode === 204) {
        // eslint-disable-next-line no-alert
        resolve(response);
      } else {
        // eslint-disable-next-line no-alert
        alert(`Error while performing the operation. Please try again after sometime. The error is ${response.message}`);
        reject(response.message);
      }
      // eslint-disable-next-line no-alert
    }).catch(err => alert('Error while performing the operation. Please try again after sometime', err));
});
export default PostApiCall;

const getISODateOnlyForDatePickerDates = (date) => {
  if (date instanceof Date && typeof date.getMonth === 'function') {
  // if (Object.prototype.toString.call(date) === '[object Date]') {
    const OneMilliSecond = 60000;
    const userTimezoneOffset = date.getTimezoneOffset() * OneMilliSecond;
    return new Date(date.getTime() - userTimezoneOffset).toISOString();
  }
  return date;
};

export const sendApiRequest = (url, method = 'GET', body, isBlobReq) => {
  let newBody = body;
  if (typeof body !== 'undefined' && typeof body === 'object') {
    newBody = cloneDeep(body);
    Object.keys(newBody).forEach((key) => {
      const isDate = key.toLowerCase().includes('date');
      if (isDate) {
        newBody[key] = getISODateOnlyForDatePickerDates(newBody[key]);
      }
    });
  }
  return fetch(url, {
    method,
    // body: body ? JSON.stringify(body) : undefined,
    body: newBody ? JSON.stringify(newBody) : undefined,
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      token: getToken(),
      refreshToken: getUser().refreshToken,
    }),
  }).then(res => (isBlobReq ? res.blob() : res.json()))
    .then(async (data) => {
      if (data.statusCode === 401) {
        await userService.getRefreshToken();
        return sendApiRequest(url, method, body, isBlobReq);
      }
      return data;
    });
};
