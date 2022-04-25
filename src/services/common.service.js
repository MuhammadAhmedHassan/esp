import moment from 'moment';
const lang = navigator.languages ? navigator.languages : navigator.language;
const loadPath = lang[0].toLowerCase();
import(`moment/locale/${loadPath}`).then();

function localizedDate(date) {
  if (date) {
    const splitWithDash = date.split('-');
    const splitWithSlash = date.split('/');
    if (splitWithDash.length > 0 && splitWithDash[0].length > 2) {
      return moment(date, 'YYYY-MM-DD').format('L');
    } if (splitWithDash.length > 0) {
      return moment(date, 'DD-MM-YYYY').format('L');
    } if (splitWithSlash.length > 0) {
      return moment(date, 'DD/MM/YYYY').format('L');
    }
  }
  // console.log(moment.localeData().longDateFormat('L'), splitWithDash.length > 0, splitWithSlash, moment(date, 'DD-MM-YYYY'));
  return '';
}

function localizedDateAndTime(date) {
  const splitWithDash = date.split('-');
  const splitWithSlash = date.split('/');
  if (splitWithDash.length > 0 && splitWithDash[0].length > 2) {
    return moment(date, 'YYYY-MM-DD').format('L');
  } if (splitWithDash.length > 0) {
    return moment(date, 'DD-MM-YYYY hh:mm:ss').format('L hh:mm:ss');
  } if (splitWithSlash.length > 0) {
    return moment(date, 'DD/MM/YYYY').format('L hh:mm:ss');
  }
  // console.log(moment.localeData().longDateFormat('L'), splitWithDash.length > 0, splitWithSlash, moment(date, 'DD-MM-YYYY'));
  return '';
}

function localizedDateFormat() {
  return moment.localeData().longDateFormat('L');
}

function localizedDateFormatForPicker() {
  const regxDD = new RegExp('(DD)');
  const regxYYYY = new RegExp('(YYYY)');
  const format = moment.localeData().longDateFormat('L').replace(regxYYYY, 'yyyy');
  return format.replace(regxDD, 'dd');
}


export const commonService = {
  localizedDate,
  localizedDateFormat,
  localizedDateFormatForPicker,
  localizedDateAndTime,
};
