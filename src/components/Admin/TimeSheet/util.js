export const primaryHeader = [
  'Exception',
  'Shift Label',
  'Shift Type',
  'Employee',
  'Date',
  'Start Shift',
  'End Shift',
  'Cal.Time',
  'Req.Hour',
  'Designation',
  'Variance',
  'Action',
];

export const secondaryHeader = [
  'Exception',  
  'Schedule Label',
  'Shift Name',
  'Shift Type',
  'Date',
  'Start Shift',
  'End Shift',
  'Cal. Time',
  'Req.Hour',
  'Variance',
  'Action',
];

export const formatDate = (date) => {
  const d = new Date(date);
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${da}/${mo}/${ye}`;
};

export const formatTime = (datetime) => {
  const d = new Date(datetime);
  return d.toLocaleTimeString('en-US');
};

export const checkUserRoleType = (roles = []) => {
  let roleType;
  if (!roles.length > 0) return;

  const names = roles.map(x => (x.id));
  const userRoleIds = names.toString();

  if (roles.find(role => role.name === 'Administrators')) {
    roleType = 'admin';
  } else if (roles.find(role => role.name === 'Manager')) {
    roleType = 'manager';
  } else if (roles.length > 0) {
    roleType = 'user';
  }

  return {
    roleType,
    userRoleIds,
  };
};
