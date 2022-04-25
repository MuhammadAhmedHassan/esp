
function startDateTom() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
}

function currentDateTom(currentDate) {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + 1);
  return date;
}


function datePlusSeven() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}


function dateMinusSeven() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
}

export function setRealDate(date) {
  if (date) {
    const getDateFormat = `${date.getFullYear()}-${(date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`}-${(date.getDate()) >= 10 ? (date.getDate()) : `0${date.getDate()}`}`;
    const getDateString = new Date(getDateFormat);
    const isoDate = getDateString.toISOString();
    return isoDate;
  }
  
  return date;
}

export default {
  startDateTom,
  datePlusSeven,
  currentDateTom,
  dateMinusSeven  
};
