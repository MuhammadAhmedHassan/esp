export const checkUserRoleType = (roles = []) => {
  let roleType = '';
  if (!roles.length > 0) return;

  const names = roles.map(x => x.id);
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


export const tableHeader = [
  'User',
  'Shift Lable',
  'Type',
  'Exceptions',
  'Status',
  'Day of Week',

];

export const DummayData = {
  username: 'Mike',
  totalRequiredHours: '20',
  totalCalculatetedValue: '20',
  totalVarianceValue: '20',
  totalHours: {
    daysWise: [{
      week: 1,
      total: [{
        day: 5,
        total: '05:15',
      },
      {
        day: 6,
        total: '05:00',
      },
      {
        day: 7,
        total: '07:00',
      },
      {
        day: 8,
        total: '09:00',
      },
      {
        day: 9,
        total: '10:00',
      },

      ],
    },
    {
      week: 2,
      total: [{
        day: 5,
        total: '05:15',
      },
      {
        day: 6,
        total: '05:00',
      },
      {
        day: 7,
        total: '07:00',
      },
      {
        day: 8,
        total: '09:00',
      },
      {
        day: 9,
        total: '10:00',
      },

      ],
    },
    {
      week: 3,
      total: [{
        day: 5,
        total: '05:15',
      },
      {
        day: 6,
        total: '05:00',
      },
      {
        day: 7,
        total: '07:00',
      },
      {
        day: 8,
        total: '09:00',
      },
      {
        day: 9,
        total: '10:00',
      },

      ],
    },
    {
      week: 4,
      total: [{
        day: 5,
        total: '05:15',
      },
      {
        day: 6,
        total: '05:00',
      },
      {
        day: 7,
        total: '07:00',
      },
      {
        day: 8,
        total: '09:00',
      },
      {
        day: 9,
        total: '10:00',
      },

      ],
    }],
    weekWise: [],
  },

  weeksDetails: [{
    week: 1,
    startOfDate: '04-07-2021',
    endOfEnd: '10-07-2021',
    days: [{
      date: 5,
      day: 'Monday',
    }, {
      date: 6,
      day: 'Tuesday',
    }, {
      date: 7,
      day: 'Wednesday',
    }, {
      date: 8,
      day: 'Thursday',
    }, {
      date: 9,
      day: 'Friday',
    },
    ],
  },
  {
    week: 2,
    startOfDate: '11-07-2021',
    endOfEnd: '17-07-2021',
    days: [{
      date: 12,
      day: 'Monday',
    }, {
      date: 13,
      day: 'Tuesday',
    }, {
      date: 14,
      day: 'Wednesday',
    }, {
      date: 15,
      day: 'Thursday',
    }, {
      date: 16,
      day: 'Friday',
    }],
  },
  {
    week: 3,
    startOfDate: '18-07-2021',
    endOfEnd: '24-07-2021',
    days: [{
      date: 19,
      day: 'Monday',
    }, {
      date: 20,
      day: 'Tuesday',
    }, {
      date: 21,
      day: 'Wednesday',
    }, {
      date: 22,
      day: 'Thursday',
    }, {
      date: 23,
      day: 'Friday',
    }],
  },
  {
    week: 4,
    startOfDate: '25-07-2021',
    endOfEnd: '31-07-2021',
    days: [{
      date: 26,
      day: 'Monday',
    }, {
      date: 27,
      day: 'Tuesday',
    }, {
      date: 28,
      day: 'Wednesday',
    }, {
      date: 29,
      day: 'Thursday',
    }, {
      date: 30,
      day: 'Friday',
    }],
  },
  ],

  shiftDetails: [{
    lable: 'Issues related to network and support',
    type: 'Hrs',
    exceptions: 'LC',
    status: 'Accepted',
    totalHourPerTask: '20',
    reports: [{
      week: 1,
      hoursList: [{
        date: 5,
        day: 'Monday',
        hours: '02:00',

      },
      {
        date: 6,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 7,
        day: 'Wednesday',
        hours: '01:45',
      },
      {

        date: 8,
        day: 'Thursday',
        hours: '02:45',
      },
      {

        date: 9,
        day: 'Friday',
        hours: '02:30',
      },
      ],

    },
    {
      week: 2,

      hoursList: [{

        date: 12,
        day: 'Monday',
        hours: '00:00',

      },
      {

        date: 13,
        day: 'Tuesday',
        hours: '00:45',
      },
      {

        date: 14,
        day: 'Wednesday',
        hours: '01:45',
      },
      {

        date: 15,
        day: 'Thursday',
        hours: '02:45',
      },
      {

        date: 16,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    {
      week: 3,
      hoursList: [{
        date: 19,
        day: 'Monday',
        hours: '02:00',

      },
      {
        date: 20,
        day: 'Tuesday',
        hours: '00:45',
      },
      {

        date: 21,
        day: 'Wednesday',
        hours: '01:45',
      },
      {

        date: 22,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 23,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    {
      week: 4,

      hoursList: [{

        date: 26,
        day: 'Monday',
        hours: '02:00',

      },
      {

        date: 27,
        day: 'Tuesday',
        hours: '00:45',
      },
      {

        date: 28,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 29,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 30,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    ],


  },
  {
    lable: 'Issues related to task1 ',
    type: 'Hrs',
    exceptions: 'NI',
    status: 'Accepted',
    totalHourPerTask: '20',
    reports: [{
      week: 1,

      hoursList: [{
        date: 5,
        day: 'Monday',
        hours: '00:45',

      },
      {
        date: 6,
        day: 'Tuesday',
        hours: '02:45',
      },
      {
        date: 7,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 8,
        day: 'Thursday',
        hours: '00:45',
      },
      {
        date: 9,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    {
      week: 2,

      hoursList: [{
        date: 12,
        day: 'Monday',
        hours: '02:00',

      },
      {
        date: 13,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 14,
        day: 'Wednesday',
        hours: '00:45',
      },
      {
        date: 15,
        day: 'Thursday',
        hours: '01:45',
      },
      {
        date: 16,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    {
      week: 3,
      hoursList: [{
        date: 19,
        day: 'Monday',
        hours: '02:00',

      },
      {
        date: 20,
        day: 'Tuesday',
        hours: '00:30',
      },
      {
        date: 21,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 22,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 23,
        day: 'Friday',
        hours: '00:30',
      },
      ],
    },
    {
      week: 4,
      hoursList: [{
        date: 26,
        day: 'Monday',
        hours: '00:00',

      },
      {
        date: 27,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 28,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 29,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 30,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    ],

  },
  {
    lable: 'Issues related to task2',
    type: 'Hrs',
    exceptions: 'EC',
    status: 'Pending',
    totalHourPerTask: '20',
    reports: [{
      week: 1,
      hoursList: [{
        date: 5,
        day: 'Monday',
        hours: '00:00',

      },
      {
        date: 6,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 7,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 8,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 9,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    {
      week: 2,
      hoursList: [{
        date: 12,
        day: 'Monday',
        hours: '02:00',

      },
      {
        date: 13,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 14,
        day: 'Wednesday',
        hours: '00:45',
      },
      {
        date: 15,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 16,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    {
      week: 3,
      hoursList: [{
        date: 19,
        day: 'Monday',
        hours: '02:00',

      },
      {
        date: 20,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 21,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 22,
        day: 'Thursday',
        hours: '00:45',
      },
      {
        date: 23,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    {
      week: 4,
      hoursList: [{
        date: 26,
        day: 'Monday',
        hours: '02:00',

      },
      {
        date: 27,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 28,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 29,
        day: 'Thursday',
        hours: '00:45',
      },
      {
        date: 30,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    ],

  },
  {
    lable: 'Issues related to task3',
    type: 'Hrs',
    exceptions: 'LC',
    status: 'Accepted',
    totalHourPerTask: '20',
    reports: [{
      week: 1,
      hoursList: [{
        date: 5,
        day: 'Monday',
        hours: '02:30',

      },
      {
        date: 6,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 7,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 8,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 9,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    {
      week: 2,
      hoursList: [{
        date: 12,
        day: 'Monday',
        hours: '02:00',

      },
      {
        date: 13,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 14,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 15,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 16,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    {
      week: 3,
      hoursList: [{
        date: 19,
        day: 'Monday',
        hours: '02:00',

      },
      {
        date: 20,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 21,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 22,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 23,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    {
      week: 4,
      hoursList: [{
        date: 26,
        day: 'Monday',
        hours: '02:00',

      },
      {
        date: 27,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 28,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 29,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 30,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    ],

  },
  {
    lable: 'Issues related to task4',
    type: 'Hrs',
    exceptions: 'LC',
    status: 'Accepted',
    totalHourPerTask: '20',
    reports: [{
      week: 1,
      hoursList: [{
        date: 5,
        day: 'Monday',
        hours: '02:30',

      },
      {
        date: 6,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 7,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 8,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 9,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    {
      week: 2,
      hoursList: [{
        date: 12,
        day: 'Monday',
        hours: '02:00',

      },
      {
        date: 13,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 14,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 15,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 16,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    {
      week: 3,
      hoursList: [{
        date: 19,
        day: 'Monday',
        hours: '02:00',

      },
      {
        date: 20,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 21,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 22,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 23,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    {
      week: 4,
      hoursList: [{
        date: 26,
        day: 'Monday',
        hours: '02:00',

      },
      {
        date: 27,
        day: 'Tuesday',
        hours: '00:45',
      },
      {
        date: 28,
        day: 'Wednesday',
        hours: '01:45',
      },
      {
        date: 29,
        day: 'Thursday',
        hours: '02:45',
      },
      {
        date: 30,
        day: 'Friday',
        hours: '02:30',
      },
      ],
    },
    ],

  },
  ],
  totalCalculated: [
    {
      startOfDate: '18-07-2021',
      endOfEnd: '24-07-2021',
      days: [{
        date: 19,
        day: 'Monday',
        sumofTotalTask: 2.5,
      }, {
        date: 20,
        day: 'Tuesday',
        sumofTotalTask: 2.5,
      }, {
        date: 21,
        day: 'Wednesday',
        sumofTotalTask: 2.5,
      }, {
        date: 22,
        day: 'Thursday',
        sumofTotalTask: 2.5,
      }, {
        date: 23,
        day: 'Friday',
        sumofTotalTask: 2.5,
      }],

    },
    {
      startOfDate: '18-07-2021',
      endOfEnd: '24-07-2021',
      days: [{
        date: 19,
        day: 'Monday',
        sumofTotalTask: 2.5,
      }, {
        date: 20,
        day: 'Tuesday',
        sumofTotalTask: 2.5,
      }, {
        date: 21,
        day: 'Wednesday',
        sumofTotalTask: 2.5,
      }, {
        date: 22,
        day: 'Thursday',
        sumofTotalTask: 2.5,
      }, {
        date: 23,
        day: 'Friday',
        sumofTotalTask: 2.5,
      }],

    },
    {
      startOfDate: '18-07-2021',
      endOfEnd: '24-07-2021',
      days: [{
        date: 19,
        day: 'Monday',
        sumofTotalTask: 2.5,
      }, {
        date: 20,
        day: 'Tuesday',
        sumofTotalTask: 2.5,
      }, {
        date: 21,
        day: 'Wednesday',
        sumofTotalTask: 2.5,
      }, {
        date: 22,
        day: 'Thursday',
        sumofTotalTask: 2.5,
      }, {
        date: 23,
        day: 'Friday',
        sumofTotalTask: 2.5,
      }],

    },
    {
      startOfDate: '18-07-2021',
      endOfEnd: '24-07-2021',
      days: [{
        date: 19,
        day: 'Monday',
        sumofTotalTask: 2.5,
      }, {
        date: 20,
        day: 'Tuesday',
        sumofTotalTask: 2.5,
      }, {
        date: 21,
        day: 'Wednesday',
        sumofTotalTask: 2.5,
      }, {
        date: 22,
        day: 'Thursday',
        sumofTotalTask: 2.5,
      }, {
        date: 23,
        day: 'Friday',
        sumofTotalTask: 2.5,
      }],

    },
  ],
  requiredHours: [
    {
      startOfDate: '18-07-2021',
      endOfEnd: '24-07-2021',

      days: [{
        date: 19,
        day: 'Monday',
        sumofTotalTask: 2.5,
      }, {
        date: 20,
        day: 'Tuesday',
        sumofTotalTask: 2.5,
      }, {
        date: 21,
        day: 'Wednesday',
        sumofTotalTask: 2.5,
      }, {
        date: 22,
        day: 'Thursday',
        sumofTotalTask: 2.5,
      }, {
        date: 23,
        day: 'Friday',
        sumofTotalTask: 2.5,
      }],

    },
    {
      startOfDate: '18-07-2021',
      endOfEnd: '24-07-2021',

      days: [{
        date: 19,
        day: 'Monday',
        sumofTotalTask: 2.5,
      }, {
        date: 20,
        day: 'Tuesday',
        sumofTotalTask: 2.5,
      }, {
        date: 21,
        day: 'Wednesday',
        sumofTotalTask: 2.5,
      }, {
        date: 22,
        day: 'Thursday',
        sumofTotalTask: 2.5,
      }, {
        date: 23,
        day: 'Friday',
        sumofTotalTask: 2.5,
      }],

    },
    {
      startOfDate: '18-07-2021',
      endOfEnd: '24-07-2021',

      days: [{
        date: 19,
        day: 'Monday',
        sumofTotalTask: 2.5,
      }, {
        date: 20,
        day: 'Tuesday',
        sumofTotalTask: 2.5,
      }, {
        date: 21,
        day: 'Wednesday',
        sumofTotalTask: 2.5,
      }, {
        date: 22,
        day: 'Thursday',
        sumofTotalTask: 2.5,
      }, {
        date: 23,
        day: 'Friday',
        sumofTotalTask: 2.5,
      }],

    },
    {
      startOfDate: '18-07-2021',
      endOfEnd: '24-07-2021',

      days: [{
        date: 19,
        day: 'Monday',
        sumofTotalTask: 2.5,
      }, {
        date: 20,
        day: 'Tuesday',
        sumofTotalTask: 2.5,
      }, {
        date: 21,
        day: 'Wednesday',
        sumofTotalTask: 2.5,
      }, {
        date: 22,
        day: 'Thursday',
        sumofTotalTask: 2.5,
      }, {
        date: 23,
        day: 'Friday',
        sumofTotalTask: 2.5,
      }],

    },

  ],
  variance: [
    {
      startOfDate: '18-07-2021',
      endOfEnd: '24-07-2021',

      days: [{
        date: 19,
        day: 'Monday',
        sumofTotalTask: 2.5,
      }, {
        date: 20,
        day: 'Tuesday',
        sumofTotalTask: 2.5,
      }, {
        date: 21,
        day: 'Wednesday',
        sumofTotalTask: 2.5,
      }, {
        date: 22,
        day: 'Thursday',
        sumofTotalTask: 2.5,
      }, {
        date: 23,
        day: 'Friday',
        sumofTotalTask: 2.5,
      }],

    },
    {
      startOfDate: '18-07-2021',
      endOfEnd: '24-07-2021',

      days: [{
        date: 19,
        day: 'Monday',
        sumofTotalTask: 2.5,
      }, {
        date: 20,
        day: 'Tuesday',
        sumofTotalTask: 2.5,
      }, {
        date: 21,
        day: 'Wednesday',
        sumofTotalTask: 2.5,
      }, {
        date: 22,
        day: 'Thursday',
        sumofTotalTask: 2.5,
      }, {
        date: 23,
        day: 'Friday',
        sumofTotalTask: 2.5,
      }],

    },
    {
      startOfDate: '18-07-2021',
      endOfEnd: '24-07-2021',

      days: [{
        date: 19,
        day: 'Monday',
        sumofTotalTask: 2.5,
      }, {
        date: 20,
        day: 'Tuesday',
        sumofTotalTask: 2.5,
      }, {
        date: 21,
        day: 'Wednesday',
        sumofTotalTask: 2.5,
      }, {
        date: 22,
        day: 'Thursday',
        sumofTotalTask: 2.5,
      }, {
        date: 23,
        day: 'Friday',
        sumofTotalTask: 2.5,
      }],

    },
    {
      startOfDate: '18-07-2021',
      endOfEnd: '24-07-2021',

      days: [{
        date: 19,
        day: 'Monday',
        sumofTotalTask: 2.5,
      }, {
        date: 20,
        day: 'Tuesday',
        sumofTotalTask: 2.5,
      }, {
        date: 21,
        day: 'Wednesday',
        sumofTotalTask: 2.5,
      }, {
        date: 22,
        day: 'Thursday',
        sumofTotalTask: 2.5,
      }, {
        date: 23,
        day: 'Friday',
        sumofTotalTask: 2.5,
      }],

    },

  ],
};
