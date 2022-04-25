import React, {
  useState, useEffect, forwardRef, useImperativeHandle,
} from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { sendApiRequest } from '../../../../../common/serviceCall/PostApiCall';
import Api from '../../../../../common/Api';

const defaultDropdownOptions = t => ({
  organisations: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }],
  divisions: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }],
  businessUnit: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }],
  department: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }],
  team: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }],
  primaryManager: [{ id: '0', firstName: t('Report.HoursWorked.HirarchyFieldsForAdmin.All'), lastName: '' }],
  employees: [{ id: '0', firstName: t('Report.HoursWorked.HirarchyFieldsForAdmin.All'), lastName: '' }],
  allCountry: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }],
  allState: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }],
  allCity: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }],
  allLocation: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }],
});
const defaultDropdownOptionsChanged = t => ({
  organisations: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.SelectOrganisation') }],
  divisions: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.SelectDivision') }],
  businessUnit: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.SelectBusinessUnit') }],
  department: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.SelectDepartment') }],
  team: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.SelectTeam') }],
  primaryManager: [{ id: '0', firstName: t('Report.HoursWorked.HirarchyFieldsForAdmin.Select'), lastName: t('Report.HoursWorked.HirarchyFieldsForAdmin.Manager') }],
  employees: [{ id: '0', firstName: t('Report.HoursWorked.HirarchyFieldsForAdmin.Select'), lastName: t('Report.HoursWorked.HirarchyFieldsForAdmin.Employee') }],
  allCountry: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.SelectCountry') }],
  allState: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.SelectState') }],
  allCity: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.SelectCity') }],
  allLocation: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.SelectLocation') }],
});

const defaultValuesOfAdminFilters = {
  divisionId: 0,
  businessUnitId: 0,
  departmentId: 0,
  teamId: 0,
  managerId: 0,
  // countryId: 0,
  // stateId: 0,
  // contractTypeId: 0,
  // city: "",
  organisationId: 0,
  // empTypeById: 0,
  employeesId: 0,
  // locationId: 0,
};

const HirarchicalFiltersForAdmin = forwardRef(({ checkAreAllFieldsSet }, ref) => {
  const { t } = useTranslation();
  const [showErrorModal, setShowErrorModal] = useState('');
  const [dropdownsOptions, setDropdownsOptions] = useState(defaultDropdownOptions(t));

  const [filters, setFilters] = useState({ ...defaultValuesOfAdminFilters });
  const [hirarchyFilters] = useState([
    // "contractTypeId",
    // "empTypeById",
    'organisationId',
    'divisionId',
    'businessUnitId',
    'departmentId',
    'teamId',
    'managerId',
    'employeesId',
    'countryId',
    'stateId',
    // "city",
    'locationId',
  ]);

  const [hirarchyDropdownOptions] = useState([
    'organisations',
    'divisions',
    'businessUnit',
    'department',
    'team',
    'primaryManager',
    'employees',
    'allCountry',
    'allState',
    'allCity',
    'allLocation',
  ]);

  const resetFilters = (index = 0, resetOrganizationAsWell) => {
    // this function will reset all the data of sub fields
    const newFilters = {};
    const newDropdowns = {};
    [...hirarchyFilters].splice(index).forEach((key) => {
      newFilters[`${key}`] = 0;
    });
    [...hirarchyDropdownOptions].splice(index).forEach((key) => {
      newDropdowns[`${key}`] = [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }];
    });

    if (resetOrganizationAsWell) newFilters.organisationId = '0';

    setDropdownsOptions({ ...dropdownsOptions, ...newDropdowns });
    // setFilters({ ...filters, ...newFilters });
    return { ...filters, ...newFilters };
  };

  useImperativeHandle(ref, () => ({
    resetAdminFilters() {
      const newFilters = resetFilters(1, true);
      setFilters(newFilters);
    },
    getDefaultValuesOfAdminFilters() {
      return { ...defaultValuesOfAdminFilters };
    },
  }));
  

  const getOrganisationId = async () => {
    try {
      const response = await sendApiRequest(Api.getAllOrganisations, 'POST', {
        id: 0,
        languageId: 1,
      });

      if (response.statusCode === 200) {
        setDropdownsOptions({
          ...dropdownsOptions,
          organisations: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }].concat(
            response.data,
          ),
        });
      } else setShowErrorModal(`${t('Report.HoursWorked.HirarchyFieldsForAdmin.ErrorFetchingOrganisations')} ${response.error}`);
    } catch (err) {
      setShowErrorModal(`${t('Report.HoursWorked.HirarchyFieldsForAdmin.ErrorFetchingOrganisations')} ${err}`); // Error fetching Organisations ${err}
    }
  };

  useEffect(() => {
    getOrganisationId();
  }, []);

  const getDivisionsByOrganisationId = async (organizationId = 0) => {
    try {
      const response = await sendApiRequest(
        Api.manageEmp.getdivisionsbyorganisationid,
        'POST',
        {
          id: parseInt(organizationId, 10),
          languageId: 1,
        },
      );

      if (response.statusCode === 200) {
        setDropdownsOptions({
          ...dropdownsOptions,
          divisions: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }].concat(response.data),
        });
        setFilters({
          ...filters,
          organisationId: organizationId,
          divisionId: 0,
        });
      }
    } catch (err) {
      console.error(err.toString());
    }
  };

  const getBusinessUnitByDivisionId = async (divId = 0) => {
    try {
      const response = await sendApiRequest(
        Api.getBusinessUnitByDivisionId,
        'POST',
        {
          id: Number(divId),
          languageId: 1,
        },
      );
      setDropdownsOptions({
        ...dropdownsOptions,
        businessUnit: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }].concat(
          response.data,
        ),
      });
      setFilters({ ...filters, divisionId: divId, businessUnitId: 0 });
    } catch (err) {
      console.error(err.toString());
    }
  };

  const getDepartmentByBusinessUnitId = async (businessUnitId = 0) => {
    try {
      const response = await sendApiRequest(
        Api.getDepartmentByBusinessUnitId,
        'POST',
        { id: Number(businessUnitId), languageId: 1 },
      );

      if (response.statusCode === 200) {
        setDropdownsOptions({
          ...dropdownsOptions,
          department: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }].concat(
            response.data,
          ),
        });
        setFilters({ ...filters, businessUnitId, departmentId: 0 });
      }
    } catch (err) {
      console.error(err.toString());
    }
  };

  const getManagerAndEmployeesByTeamId = async (teamId = 0) => {
    const urls = [`${Api.getManagersByTeamId}`, `${Api.getUsersByTeamId}`];

    try {
      const [managersByTeamId, employeesByTeamId] = await Promise.all(
        urls.map(url => sendApiRequest(url, 'POST', {
          id: Number(teamId),
          languageId: 1,
        })),
      );

      setDropdownsOptions({
        ...dropdownsOptions,
        primaryManager: [{ id: '0', firstName: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }].concat(
          managersByTeamId.data,
        ),
        // employees: employeesByTeamId.data,
        employees: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }].concat(employeesByTeamId.data),
      });
      setFilters({
        ...filters, departmentId: filters.departmentId, teamId, managerId: 0, employeesId: 0,
      });
      return {
        ...filters, departmentId: filters.departmentId, teamId, managerId: 0, employeesId: 0,
      };
    } catch (error) {
      console.error(error);
    }
  };

  const getEmployeesByManagerId = async (managerId = 0) => {
    try {
      const response = await sendApiRequest(
        Api.punchLog.getAllEmployees,
        'POST',
        {
          id: Number(managerId),
          managerId: Number(managerId),
          languageId: 1,
        },
      );

      setDropdownsOptions({
        ...dropdownsOptions,
        employees: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }].concat(response.data),
      });
      setFilters({ ...filters, managerId, employeesId: '0' });
    } catch (error) {
      console.error(error);
    }
  };

  const getTeamsManagerAndEmployeesByDepartmentId = async (
    departmentId = 0,
  ) => {
    const urls = [
      `${Api.getTeamsByDepartmentId}`,
      `${Api.getManagersByDepartmentId}`,
      `${Api.getUsersByDepartmentId}`,
    ];

    try {
      const [teamsRes, managersRes, employeesRes] = await Promise.all(
        urls.map(url => sendApiRequest(url, 'POST', {
          id: Number(departmentId),
          languageId: 1,
        })),
      );

      setDropdownsOptions({
        ...dropdownsOptions,
        team: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }].concat(teamsRes.data),
        primaryManager: [{ id: '0', firstName: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }].concat(
          managersRes.data,
        ),
        // employees: employeesRes.data,
        employees: [{ id: '0', name: t('Report.HoursWorked.HirarchyFieldsForAdmin.All') }].concat(employeesRes.data),
      });
      setFilters({
        ...filters, departmentId, teamId: 0, managerId: 0,
      });

      return [teamsRes, managersRes, employeesRes];
    } catch (error) {
      return error;
    }
  };

  const getDataBasedOnFilters = async (name, value) => {
    switch (name) {
      case 'organisationId':
        if (value === 0 || value === '0') return resetFilters(1);
        await getDivisionsByOrganisationId(value);
        break;
      case 'divisionId':
        if (value === 0 || value === '0') return resetFilters(2);
        await getBusinessUnitByDivisionId(value);
        break;
      case 'businessUnitId':
        if (value === 0 || value === '0') return resetFilters(3);
        await getDepartmentByBusinessUnitId(value);
        break;
      case 'departmentId':
        if (value === 0 || value === '0') return resetFilters(4);
        getTeamsManagerAndEmployeesByDepartmentId(value);
        break;
      case 'teamId':
        if (value === 0 || value === '0') return resetFilters(5);
        const stateValues = await getManagerAndEmployeesByTeamId(value);
        return stateValues;
      case 'managerId':
        if (value === 0 || value === '0') return resetFilters(6);
        getEmployeesByManagerId(value);
        break;
      case 'employeesId':
        setFilters({ ...filters, employeesId: value });
        break;
      case 'countryId':
        break;
      case 'stateId':
        break;
      case 'city':
        break;
      case 'locationId':
        break;
      default:
        break;
    }
  };

  const checkAreAllFieldsFilled = fields => Object.values(fields).every(field => !!Number(field));

  const handleTeamChange = async (departmentId) => {
    await getTeamsManagerAndEmployeesByDepartmentId(departmentId);
    return { departmentId, teamId: 0, managerId: 0 };
  };

  const handleChange = async ({ target }) => {
    const { name, value } = target;
    const resetedFilters = await getDataBasedOnFilters(name, value);
    let newFilters = { ...filters, [name]: value };
    if (resetedFilters) {
      newFilters = { ...resetedFilters, [name]: value };
    }

    if (name === 'teamId' && parseInt(value, 10) === 0) {
      const teamFilters = await handleTeamChange(filters.departmentId);
      newFilters = { ...newFilters, ...teamFilters };
    }
    
    setFilters(newFilters);
    const isEveryFieldSet = checkAreAllFieldsFilled(newFilters);
    let selectedEmployeeName = '';
    if (Number(newFilters.employeesId)) {
      const employee = dropdownsOptions.employees.find(
        // eslint-disable-next-line eqeqeq
        emp => emp.id == newFilters.employeesId,
      );
      if (employee) selectedEmployeeName = employee.fullName;
    }
    if (checkAreAllFieldsSet) {
      checkAreAllFieldsSet(newFilters, isEveryFieldSet, selectedEmployeeName);
    }
  };

  return (
    <>
      <CustomModal
        t={t}
        show={!!showErrorModal}
        message={showErrorModal}
        handleClose={() => setShowErrorModal('')}
      />
      <CustomSelectField
        label={t('Report.HoursWorked.Organisation')}
        name="organisationId"
        value={filters.organisationId}
        onChange={handleChange}
        options={dropdownsOptions.organisations}
      />
      <CustomSelectField
        label={t('Report.HoursWorked.Division')}
        name="divisionId"
        value={filters.divisionId}
        onChange={handleChange}
        options={dropdownsOptions.divisions}
      />
      <CustomSelectField
        label={t('Report.HoursWorked.BusinessUnit')}
        name="businessUnitId"
        value={filters.businessUnitId}
        onChange={handleChange}
        options={dropdownsOptions.businessUnit}
      />
      <CustomSelectField
        label={t('Report.HoursWorked.Department')}
        name="departmentId"
        value={filters.departmentId}
        onChange={handleChange}
        options={dropdownsOptions.department}
      />
      <CustomSelectField
        label={t('Report.HoursWorked.Team')}
        name="teamId"
        value={filters.teamId}
        onChange={handleChange}
        options={dropdownsOptions.team}
      />
      <CustomSelectField
        label={t('Report.HoursWorked.Manager')}
        name="managerId"
        value={filters.managerId}
        onChange={handleChange}
        options={dropdownsOptions.primaryManager.map(manager => ({
          id: manager.id,
          name: `${manager.firstName || t('Report.HoursWorked.HirarchyFieldsForAdmin.All')} ${manager.lastName || ''}`,
        }))}
      />
      <CustomSelectField
        label={t('Report.HoursWorked.Employee')}
        name="employeesId"
        value={filters.employeesId}
        onChange={handleChange}
        options={dropdownsOptions.employees.map(empItem => ({
          id: empItem.id,
          name:
            `${empItem.firstName || t('Report.HoursWorked.HirarchyFieldsForAdmin.All')} ${empItem.lastName || ''}`,
        }))}
      />
    </>
  );
});

export default HirarchicalFiltersForAdmin;

function CustomSelectField({
  label, name, value, onChange, options,
}) {
  return (
    <Form.Group
      controlId="exampleForm.SelectCustom"
      className="col-lg-3 col-md-6"
    >
      <Form.Label>{label}</Form.Label>
      <Form.Control name={name} value={value} as="select" onChange={onChange}>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
}

function CustomModal({
  handleClose, show, message, t,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {t('Report.HoursWorked.ApiError')}
          :
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{message || t('Report.HoursWorked.OldTokenErrorMsg') }</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('Report.HoursWorked.Close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
