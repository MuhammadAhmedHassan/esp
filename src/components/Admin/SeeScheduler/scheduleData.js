import React from 'react';
import Api from '../../common/Api';
import moment  from 'moment';

export const callShiftData = (token, reqBody) => new Promise(async (resolve, reject) => {
  const urls = [`${Api.shift.shiftSearch}`, `${Api.shift.openShiftSearch}`];
  try {
    const shiftData = await Promise.all(
      urls.map(
        url => fetch(url, {
          method: 'POST',
          headers: new Headers({
            Token: `${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(reqBody),
        }).then(response => response.json()),
      ),
    );
    if (shiftData[0].statusCode === 200 && shiftData[1].statusCode === 200) {
      const shiftAndNotes = {
        mergedShift: shiftData[0].data.shifts.concat(shiftData[1].data.shifts),
        notes: shiftData[0].data.notes,
      };
      resolve(shiftAndNotes);
    } else {
      reject(shiftData[0].message);
    }
  } catch (err) {
    reject(err);
    // eslint-disable-next-line no-alert
    alert('Failed fetching the shifts', err.message);
  }
});


export const SchedulerDataFn = (shiftData) => {
  const createEventArr = [];
  if (shiftData) {
  // eslint-disable-next-line no-restricted-syntax
    shiftData.getShiftData.mergedShift.forEach((value) => {
      let eveObj = {};
      const userList = [];
      value.users.forEach((user) => {
        const userName = { userName: `${user.firstName} ${user.lastName}`, isConflicted: `${user.isConflicated}`, userId: `${user.id}` };
        userList.push(userName);
      });

      eveObj = {
        id: value.id,
        start: moment.utc(value.startDateTime).local().format(),
        end: moment.utc(value.endDateTime).local().format(),
        resourceId: value.isOpenShift ? 'r1' : 'r2',
        title: value.title,
        users: userList,
        movable: false,
        resizable: false,
        showPopover: true,
        isOpenShift: value.isOpenShift,
        isShiftSwapAllowed: value.isShiftSwapAllowed,
        isOnCallShift: value.isOnCallShift,
        isOverTimeShift: value.isOverTimeShift,
        isConflicted: value.isShiftConflicated,
        colourCode: value.colourCode,
        colour: value.colourName,
        colourCodeLight: value.colourCodeLight,
        shiftStatusId: value.shiftStatusId,
      };
      createEventArr.push(eveObj);
    });

    // eslint-disable-next-line no-unused-vars
    shiftData.getShiftData.notes.forEach((note, index) => {
      let notesObj = {};
      const getdate = new Date(note.date);
      const addHours = getdate.setHours(getdate.getSeconds() + 1);
      const setDate = new Date(addHours);
      notesObj = {
        id: `notes-${note.id}-${note.scheduleId}-${index}`,
        start: note.date,
        end: setDate.toISOString(),
        resourceId: 'r0',
        title: note.notes,
        users: [],
        movable: false,
        resizable: false,
        showPopover: false,
        isOpenShift: false,
        isShiftSwapAllowed: false,
        isOnCallShift: false,
        isOverTimeShift: false,
        isConflicted: false,
        noteId: note.id,
      };
      createEventArr.push(notesObj);
    });

    const DemoData = {
      resources: [{
        id: 'r0',
        name: [<span key="day-notes-txt" className="notes-panel">Day notes</span>],
      }, {
        id: 'r1',
        name: [<span className="open-shift-icon-panel" key="open-shift-txt">Open Shifts</span>],
      }, {
        id: 'r2',
        name: [<span className="emp-shift-icon" key="emp-shift-txt">Employee Shifts</span>],
      }],
      events: createEventArr,
    };
    return DemoData;
  }
  
  return false;
};

export const SchedulerDataFnEmp = (shiftData) => {
  const createEventArr = [];
  if (shiftData) {
  // eslint-disable-next-line no-restricted-syntax
    shiftData.getShiftData.mergedShift.forEach((value) => {
      let eveObj = {};
      const userList = [];
      value.users.forEach((user) => {
        const userName = { userName: `${user.firstName} ${user.lastName}`, isConflicted: `${user.isConflicated}`, userId: `${user.id}` };
        userList.push(userName);
      });
      
      eveObj = {
        id: value.id,
        start: value.startDateTime,
        end: value.endDateTime,
        resourceId: !value.isOpenShift ? 'r0' : '',
        title: value.title,
        users: userList,
        movable: false,
        resizable: false,
        showPopover: true,
        isOpenShift: value.isOpenShift,
        isShiftSwapAllowed: value.isShiftSwapAllowed,
        isOnCallShift: value.isOnCallShift,
        isOverTimeShift: value.isOverTimeShift,
        isConflicted: value.isShiftConflicated,
        colourCode: value.colourCode,
        colour: value.colourName,
        colourCodeLight: value.colourCodeLight,
        shiftStatusId: value.shiftStatusId,
      };
      createEventArr.push(eveObj);
    });
    const DemoData = {
      resources: [{
        id: 'r0',
        name: [<span className="emp-shift-icon" key="emp-shift-txt">Employee Shifts</span>],
      }],
      events: createEventArr,
    };
    return DemoData;
  }
  
  return false;
};
// Scheduler Data function for My schedule
export const SchDataMySchedule = (shiftData) => {
  const createEventArr = [];
  if (shiftData) {
  // eslint-disable-next-line no-restricted-syntax
    shiftData.getShiftData.mergedShift.forEach((value) => {
      let eveObj = {};
      const userList = [];
      value.users.forEach((user) => {
        const userName = { userName: `${user.firstName} ${user.lastName}`, isConflicted: `${user.isConflicated}`, userId: `${user.id}` };
        userList.push(userName);
      });

      eveObj = {
        id: value.id,
        start: value.startDateTime,
        end: value.endDateTime,
        resourceId: value.isOpenShift ? 'r0' : 'r1',
        title: value.title,
        users: userList,
        movable: false,
        resizable: false,
        showPopover: true,
        isOpenShift: value.isOpenShift,
        isShiftSwapAllowed: value.isShiftSwapAllowed,
        isOnCallShift: value.isOnCallShift,
        isOverTimeShift: value.isOverTimeShift,
        isConflicted: value.isShiftConflicated,
        colourCode: value.colourCode,
        colour: value.colourName,
        userShiftStatusIdDashboard: value.userShiftStatusIdDashboard,
        IsOpenShiftRequestAllowed: value.isOpenShiftRequestAllowed,
        colourCodeLight: value.colourCodeLight,
      };
      createEventArr.push(eveObj);
    });
    const DemoData = {
      resources: [
        {
          id: 'r0',
          name: [<span className="open-shift-icon-panel" key="open-shift-txt">Open Shifts</span>],
        }, {
          id: 'r1',
          name: [<span className="emp-shift-icon" key="emp-shift-txt">Employee Shifts</span>],
        }],
      events: createEventArr,
    };
    return DemoData;
  }
  return false;
};

export const initializedData = {
  resources: [
    {
      id: 'r0',
      name: '',
    },
  ],
  events: [
    {
      id: 1,
      start: '',
      end: '',
      resourceId: 'r0',
      title: '',
    },
  ],
};
