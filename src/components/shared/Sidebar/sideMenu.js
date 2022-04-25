const MenusLinks = t => [
  {
    name: `${t('Configurable Dashboard')}`,
    link: '/configure-dashboard',
    breadCrumb: '/Configurable Dashboard',
    access: {
      module: 'ConfigurableDashboard',
      permission: 'ConfigurableDashboard',
    },
    dropdowns: [],
  },
  {
    name: `${t('SidebarPage.Dashboard')}`,
    link: '/',
    breadCrumb: '',
    access: {
      module: 'Dashboard',
      permission: 'Dashboard',
    },
    dropdowns: [],
  },
  {
    name: `${t('Schedule/Shift')}`,
    link: '',
    breadCrumb: '/Schedule/Shift',
    access: {
      module: 'Schedule',
      permission: '',
    },
    dropdowns: [
      {
        name: `${t('Schedule')}`,
        link: '/schedule/view-schedule',
        breadCrumb: '/Schedule/Schedule',
        access: {
          module: 'Schedule',
          permission: 'Schedule',
        },
      },
      {
        name: `${t('Shift Template')}`,
        link: '/shift/shift-template',
        breadCrumb: '/Schedule/Shift Template',
        access: {
          module: 'Schedule',
          permission: 'ShiftTemplate',
        },
      },
      {
        name: `${t('My Schedule')}`,
        link: '/schedule/my-schedule',
        breadCrumb: '/Schedule/My Schedule',
        access: {
          module: 'Schedule',
          permission: 'MySchedule',
        },
      },
    ],
  },
  {
    name: `${t('Vacation Management')}`,
    link: '',
    breadCrumb: '/Vacation Management',
    access: {
      module: 'VacationManagement',
      permission: '',
    },
    dropdowns: [
      {
        name: `${t('My Vacation')}`,
        link: '',
        breadCrumb: '/Vacation Management/My Vacation',
        access: {
          module: 'VacationManagement',
          permission: 'MyVacation',
        },
        dropdowns: [
          {
            name: `${t('Apply Vacation')}`,
            link: '/vacation-management/my-vacation/apply-vacation',
            breadCrumb: '/Vacation Management/My Vacation/Apply Vacation',
            access: {
              module: 'MyVacation',
              permission: 'ApplyVacation',
            },
          },
          {
            name: `${t('Applied Vacation')}`,
            link: '/vacation-management/my-vacation/applied-vacation',
            breadCrumb: '/Vacation Management/My Vacation/Applied Vacation',
            access: {
              module: 'MyVacation',
              permission: 'AppliedVacation',
            },
          },
        ],
      },
      {
        name: `${t('Vacation Balance')}`,
        link: '/vacation-management/vacation-balance',
        breadCrumb: '/Vacation Management/Vacation Balance',
        access: {
          module: 'VacationManagement',
          permission: 'VacationBalance',
        },
      },
      {
        name: `${t('Holiday Calendar')}`,
        link: '/vacation-management/holiday-calendar',
        breadCrumb: '/Vacation Management/Holiday Calendar',
        access: {
          module: 'VacationManagement',
          permission: 'HolidayCalendar',
        },
      },
    ],
  },
  {
    name: `${t('Timesheet Management')}`,
    link: '',
    breadCrumb: '/Timesheet Management',
    access: {
      module: 'TimesheetManagement',
      permission: '',
    },
    dropdowns: [
      {
        name: `${t('My Timesheet')}`,
        link: '/timesheet?tab=mytimesheet',
        breadCrumb: '/Timesheet Management/My Timesheet',
        access: {
          module: 'TimesheetManagement',
          permission: 'MyTimesheet',
        },
      },
      {
        name: `${t('Team Timesheet')}`,
        link: '/timesheet',
        breadCrumb: '/Timesheet Management/Team Timesheet',
        access: {
          module: 'TimesheetManagement',
          permission: 'TeamTimesheet',
        },
      },
    ],
  },
  {
    name: `${t('Manage Employee')}`,
    link: '/manage-employee',
    breadCrumb: '/Manage Employee',
    access: {
      module: 'ManageEmployee',
      permission: 'ManageEmployee',
    },
    dropdowns: [],
  },
  {
    name: `${t('Request Management')}`,
    link: '',
    breadCrumb: '/Request Management',
    access: {
      module: 'ManageRequests',
      permission: 'ManageRequests',
    },
    dropdowns: [
      {
        name: `${t('Request')}`,
        link: '',
        breadCrumb: '/Request Management/Request',
        access: {
          module: 'ManageRequests',
          permission: 'ManageDropShift',
        },
      },
      {
        name: `${t('Vacation Request')}`,
        link: '/manage-requests/vacation-requests',
        breadCrumb: '/Request Management/Vacation Request',
        access: {
          module: 'ManageRequests',
          permission: 'VacationRequest',
        },
      },
      {
        name: `${t('Exception Requests')}`,
        link: '',
        breadCrumb: '/Request Management/Exception Requests',
        access: {
          module: 'ManageRequests',
          permission: 'ExceptionRequest',
        },
        dropdowns: [
          {
            name: `${t('Exception')}`,
            link: '/request/exceptions',
            breadCrumb: '/Request Management/Exception Requests',
            access: {
              module: 'ManageRequests',
              permission: 'ExceptionRequest',
            },
          },
          {
            name: `${t('OverTime Employee')}`,
            breadCrumb: '/Request Management/Exception Requests/OverTime',
            link: '/overtime-employee',
            access: {
              module: 'ExceptionRequest',
              permission: 'OverTime',
            },
          },
          {
            name: `${t('OverTime Manager')}`,
            breadCrumb: '/Request Management/Exception Requests/OverTime',
            link: '/overtime-manager',
            access: {
              module: 'ExceptionRequest',
              permission: 'OverTimeManager',
            },
          },
          {
            name: `${t('OverTime Admin')}`,
            breadCrumb: '/Request Management/Exception Requests/OverTime',
            link: '/overtime-admin',
            access: {
              module: 'ExceptionRequest',
              permission: 'OverTimeAdmin',
            },
          },
          {
            name: `${t('Change Time')}`,
            link: '/change-time',
            breadCrumb: '/Request Management/Exception Requests/Change Time',
            access: {
              module: 'ExceptionRequest',
              permission: 'ChangeTime',
            },
          },
          {
            name: `${t('Swap Request')}`,
            link: '/manage-requests/exception-request/swap-time',
            breadCrumb: '/Request Management/Exception Requests/Swap Request',
            access: {
              module: 'ManageRequests',
              permission: 'SwapRequest',
            },
          },
        ],
      },
    ],
  },
  {
    name: `${t('Reports')}`,
    link: '',
    breadCrumb: '/Reports',
    access: {
      module: 'Reports',
      permission: '',
    },
    dropdowns: [
      {
        name: `${t('Shift History Report')}`,
        link: '/manager-Shift-history',
        breadCrumb: '/Reports/Shift History Report',
        access: {
          module: 'Reports',
          permission: 'ShiftHistoryReport',
        },
      },
      {
        name: `${t('Invoice Report')}`,
        link: '',
        breadCrumb: '/Reports/Invoice Report',
        access: {
          module: 'Reports',
          permission: 'InvoiceReport',
        },
      },
      {
        name: `${t('Hours Worked Report')}`,
        link: '/reports/hours',
        breadCrumb: '/Reports/Hours Worked Report',
        access: {
          module: 'Reports',
          permission: 'HoursWorkedReport',
        },
      },
      {
        name: `${t('Leave Balance Report')}`,
        // link: '/reports/leave-balance',
        link: '/reports/leave-balance-report',
        breadCrumb: '/Reports/Leave Balance Report',
        access: {
          module: 'Reports',
          permission: 'LeaveBalanceReport',
        },
      },
      // there were two identical objects that's why removed one.
      {
        name: `${t('Exceptions Report')}`,
        link: '/reports/exceptions-report',
        breadCrumb: '/Reports/Exceptions Report',
        access: {
          module: 'Reports',
          permission: 'ExceptionsReport',
        },
      },
      {
        name: `${t('Over Time Report')}`,
        link: '/reports/over-time-report',
        breadCrumb: '/Reports/Over Time Report',
        access: {
          module: 'Reports',
          permission: 'OverTimeReport',
        },
      },
      {
        name: `${t('Analysis report')}`,
        link: '',
        breadCrumb: '/Reports/Analysis report',
        access: {
          module: 'Reports',
          permission: 'AnalysisReport',
        },
      },
      {
        name: `${t('Monthly comparison report showing Over Time')}`,
        link: '/employee-shift-monthly-comparison',
        breadCrumb: '/Reports/Monthly comparison report showing Over Time',
        access: {
          module: 'Reports',
          permission: 'MonthlyComparisonReportShowingOverTime',
        },
      },
      {
        name: `${t('Hours worked by Contract')}`,
        link: '',
        breadCrumb: '/Reports/Hours worked by Contract',
        access: {
          module: 'Reports',
          permission: 'HoursWorkedByContract',
        },
      },
    ],
  },
  {
    name: `${t('Delegation')}`,
    link: '',
    breadCrumb: '/Delegation',
    access: {
      module: 'Delegation',
      permission: '',
    },
    dropdowns: [
      {
        name: `${t('My Delegators')}`,
        link: '/delegation/add-delegators',
        breadCrumb: '/Delegation/My Delegators',
        access: {
          module: 'Delegation',
          permission: 'MyDelegators',
        },
      },
      {
        name: `${t('Delegate As')}`,
        link: '/delegation/delegator-as',
        breadCrumb: '/Delegation/Delegate As',
        access: {
          module: 'Delegation',
          permission: 'DelegateAs',
        },
      },
      {
        name: `${t('Log History')}`,
        link: '/delegation/log-history',
        breadCrumb: '/Delegation/Log History',
        access: {
          module: 'Delegation',
          permission: 'LogHistory',
        },
      },
    ],
  },
  {
    name: `${t('Manage Location & Geofencing')}`,
    link: '',
    breadCrumb: '/Manage Location & Geofencing',
    access: {
      module: 'ManageLocation&Geofencing',
      permission: '',
    },
    dropdowns: [
      {
        name: `${t('Create Geofence')}`,
        link: '/manage-location/create-geofence',
        breadCrumb: '/Manage Location & Geofencing/Create Geofence',
        access: {
          module: 'ManageLocation&Geofencing',
          permission: 'CreateGeofence',
        },
      },
      {
        name: `${t('Location Listing')}`,
        link: '/manage-location/location-listing',
        breadCrumb: '/Manage Location & Geofencing/Location Listing',
        access: {
          module: 'ManageLocation&Geofencing',
          permission: 'LocationListing',
        },
      },
    ],
  },
  {
    name: `${t('Settings')}`,
    link: '',
    breadCrumb: '/Settings',
    access: {
      module: 'Settings',
      permission: '',
    },
    dropdowns: [
      {
        name: `${t('PunchLogs')}`,
        link: '',
        breadCrumb: '/Settings/PunchLogs',
        access: {
          module: 'Settings',
          permission: 'PunchLogs',
        },
        dropdowns: [
          {
            name: `${t('My PunchLogs')}`,
            link: '/punchlog-employee',
            breadCrumb: '/Settings/PunchLogs/My PunchLogs',
            access: {
              module: 'PunchLogs',
              permission: 'MyPunchLog',
            },
          },
          {
            name: `${t('Team Punch log')}`,
            link: '/punchlog-manager',
            breadCrumb: '/Settings/PunchLogs/Team Punch log',
            access: {
              module: 'PunchLogs',
              permission: 'TeamPunchlog',
            },
          },
        ],
      },
      {
        name: `${t('Manage Translation')}`,
        link: '/language-translator',
        breadCrumb: '/Settings/Manage Translation',
        access: {
          module: 'Settings',
          permission: 'ManageTranslation',
        },
      },
      {
        name: `${t('GDPR')}`,
        link: '/gdpr-setting',
        breadCrumb: '/Settings/GDPR',
        access: {
          module: 'Settings',
          permission: 'GDPR',
        },
      },
      {
        name: `${t('General Settings')}`,
        link: '/configuration/general-settings',
        breadCrumb: '/configuration/general-settings',
        access: {
          module: 'Settings',
          permission: 'GeneralSettings',
        },
      },
      {
        name: `${t('SidebarPage.Settings.userDelete')}`,
        link: '/user-delete',
        breadCrumb: '/Settings/User Delete',
        access: {
          module: 'Settings',
          permission: 'GDPR',
        },
      },
    ],
  },
  {
    name: `${t('ACL')}`,
    link: '/acl',
    breadCrumb: '/ACL',
    access: {
      module: 'ACL',
      permission: 'ACL',
    },
    dropdowns: [],
  },
  {
    name: `${t('User Roles')}`,
    link: '/user-role',
    breadCrumb: '/User Roles',
    access: {
      module: 'UserRoles',
      permission: 'UserRoles',
    },
    dropdowns: [],
  },
  {
    name: `${t('GDPR Consent')}`,
    link: '/gdpr/consent',
    breadCrumb: '/GDPR Consent',
    access: {
      module: 'GDPR',
      permission: 'GDPRConsentListing',
    },
    dropdowns: [],
  },
];
export default {
  MenusLinks,
};
