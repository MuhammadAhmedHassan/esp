/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Multiselect } from 'multiselect-react-dropdown';
import {
  withRouter,
} from 'react-router-dom';
import {
  Button, Modal,
} from 'react-bootstrap';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import Api from '../../common/Api';
import { userService } from '../../../services';

class profileDetails extends React.Component {
  constructor(props) {
    super(props);
    const {
      userData, allManagers, edit,
    } = this.props;
    const managerObjs = [];
    let splitIds = [];
    const token = userService.getToken();
    if (edit) {
      const managers = userData.secondaryLineManagerIds;
      if (managers != null) {
        splitIds = managers.split(',').map(Number);
        allManagers.map(data => (splitIds.includes(data.id) ? managerObjs.push(data) : ''));
      }
    }
    this.state = {
      token: ` ${token}`,
      managerIds: splitIds,
      modalState: false,
      successMessage: '',
      selected: managerObjs,
      userRoles: [],
      userRoleIds: [],
      selectedRoleIds: [],
    };
  }

  componentDidMount() {
    this.getUserRole();
  }

  handleSelectManager = (selectedList, selectedItem) => {
    const { managerIds } = this.state;
    if (!managerIds.includes(selectedItem.id)) {
      managerIds.push(selectedItem.id);
    }

    this.setState({ managerIds });
  }

  handleRemoveManager = (selectedList, selectedItem) => {
    const { managerIds } = this.state;
    const index = managerIds.findIndex(x => x === selectedItem.id);
    if (index !== -1) {
      managerIds.splice(index, 1);
    }
    this.setState({ managerIds });
  }

  handleSelectUserRole = (selectedList, selectedItem) => {
    const { userRoleIds } = this.state;
    if (!userRoleIds.includes(selectedItem.id)) {
      userRoleIds.push(selectedItem.id);
    }

    this.setState({ userRoleIds });
  }

  handleRemoveUserRole = (selectedList, selectedItem) => {
    const { userRoleIds } = this.state;

    const index = userRoleIds.findIndex(x => x === selectedItem.id);
    if (index !== -1) {
      userRoleIds.splice(index, 1);
    }
    this.setState({ userRoleIds });
  }

  getUserRole = () => {
    const { edit, userData } = this.props;
    const { token } = this.state;

    // Get chapter type
    fetch(`${Api.userRoles.getAll}`, {
      method: 'GET',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          const roleIds = [];
          const roleObjs = [];
          if (edit) {
            let roles = userData.userRole;
            const roleList = response.data;
            if (roles != null) {
              roles = roles.split(',').map(x => x.trim());
              roleList.map((data) => {
                if (roles.includes(data.name)) {
                  roleIds.push(data.id);
                  roleObjs.push(data);
                }
                return data;
              });
            }
          }

          this.setState({
            userRoles: response.data,
            userRoleIds: roleIds,
            selectedRoleIds: roleObjs,
          });
        }else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getUserRole());
          });
        } else {
          alert(response.message);
        }
      })
      .catch(err => console.error(err.toString()));
  };

  updateManager = (id) => {
    const { token, managerIds } = this.state;
    const selectedMIds = managerIds.join(',');
    // Get chapter type
    return fetch(`${Api.manageEmp.updateSecondaryManagers}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: Number(id),
        languageId: 1,
        offset: '',
        role: '',
        isActive: true,
        roleIds: '',
        publicKey: '',
        managerIds: selectedMIds,
      }),
    })
      .then(response => response.json());
    // .then((response) => {
    //   if (response.statusCode === 200) {
    //     this.setState({
    //       modalState: true,
    //       successMessage: response.message,
    //     });
    //   } else {
    //     alert(response.message);
    //   }
    // })
    // .catch(err => console.error(err.toString()));
  };

  updateRoles = (id) => {
    const { token, userRoleIds } = this.state;
    const selectedMIds = userRoleIds.join(',');

    // Get chapter type
    return fetch(`${Api.userRoles.update}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: Number(id),
        languageId: 1,
        offset: '',
        role: '',
        isActive: true,
        roleIds: '',
        publicKey: '',
        userRoleIds: selectedMIds,
      }),
    })
      .then(response => response.json());
    // .then((response) => {
    //   if (response.statusCode === 200) {
    //     this.setState({
    //       modalState: true,
    //       successMessage: response.message,
    //     });
    //   } else {
    //     alert(response.message);
    //   }
    // })
    // .catch(err => console.error(err.toString()));
  };

  handleClose = () => {
    const {
      history,
    } = this.props;
    this.setState({
      modalState: false,
    });
    history.push('/manage-employee');
  }

  update = (id) => {
    const { userRoleIds } = this.state;
    if (userRoleIds.length === 0) {
      return true;
    }
    Promise.all([this.updateManager(id), this.updateRoles(id)]).then((result) => {
      if (result[0].statusCode === 200 && result[1].statusCode === 200) {
        this.setState({
          modalState: true,
          successMessage: 'Profile details updated',
        });
      } else {
        this.setState({
          modalState: true,
          successMessage: `${result[0].message} ${result[1].message} `,
        });
      }
      return '';
    });
    return true;
  }

  render() {
    const {
      userData, edit, allManagers, selectId,
    } = this.props;
    
    const {
      modalState, successMessage, selected,
      userRoles, userRoleIds, managerIds, selectedRoleIds,
    } = this.state;

    const { t } = this.props;

    return (
      <div className="profDetails">
        <h2>{t('MyProfilePage.ProfessionalDetails')}</h2>
        <p>
          <span>
            {' '}
            {t('MyProfilePage.WorkStation')}
            {' '}
          </span>
          {userData.workLocation ? userData.workLocation : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('ManageEmployeePage.TableHeader_Department')}
            {' '}
          </span>
          {userData.department ? userData.department : 'Not Updated'}
        </p>
        <p>
          <span>
            {t('ManageEmployeePage.TableHeader_Division')}
            {' '}
          </span>
          {userData.division ? userData.division : 'Not Updated'}
        </p>
        <p>
          <span>
            {t('ManageEmployeePage.TableHeader_BusinessUnit')}
            {' '}
          </span>
          {userData.businessUnit ? userData.businessUnit : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('MyProfilePage.Client')}
            {' '}
          </span>
          {userData.client ? userData.client : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('ManageEmployeePage.TableHeader_Team')}
          </span>
          {userData.team ? userData.team : 'Not Updated'}
        </p>
        <p>
          <span>
            Work LandLine Number
          </span>
          {userData.workLandline ? userData.workLandline : 'Not Updated'}
        </p>
        <p>
          <span>
            Work Mobile Number
          </span>
          {userData.workMobile ? userData.workMobile : 'Not Updated'}
        </p>
        <p>
          <span>
            Employment Start Date
          </span>
          {userData.employmentStartDate ? moment(userData.employmentStartDate).format('MM/DD/YYYY') : 'Not Updated'}
        </p>
        <p>
          <span>
            Employment End Date
          </span>
          {userData.employmentLeftDate ? moment(userData.employmentLeftDate).format('MM/DD/YYYY') : 'Not Updated'}
        </p>
        <p>
          <span>
            {t('UserRoleText')}
            {' '}
          </span>
          {edit && userRoles.length > 0 ? (
            <>
              <Multiselect
                id="userRoleIds"
                options={userRoles}
                selectedValues={selectedRoleIds}
                displayValue="name"
                onSelect={this.handleSelectUserRole}
                onRemove={this.handleRemoveUserRole}
              />
            </>
          ) : (
            <>
              {userData.userRole ? userData.userRole : 'Not Updated'}
            </>
          )}
        </p>
        {edit ? (
          <p>
            <span />
            {' '}
            {userRoleIds.length === 0 ? <strong className="mandatory">Please select any role</strong> : ''}
          </p>
        ) : ''}
        <p>
          <span>
            {t('ManageEmployeePage.TableHeader_PrimaryManager')}
            {' '}
          </span>
          {userData.primaryLineManager ? userData.primaryLineManager : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('ManageEmployeePage.TableHeader_SecManager')}
            {' '}
          </span>
          {edit && allManagers.length > 0 ? (
            <>
              <Multiselect
                id="managerIds"
                options={allManagers}
                selectedValues={selected}
                displayValue="fullName"
                onSelect={this.handleSelectManager}
                onRemove={this.handleRemoveManager}
              />
            </>
          ) : (
            <>
              {userData.secondaryLineManager ? userData.secondaryLineManager : 'Not Updated'}
            </>
          )}
        </p>
        <p>
          <span>
            {t('MyProfilePage.Title')}
            {' '}
          </span>
          {userData.title ? userData.title : 'Not Updated'}
        </p>
        <p>
          <span>
            {t('MyProfilePage.Skills')}
            {' '}
          </span>
          {userData.skills ? userData.skills : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('MyProfilePage.Certificates')}
            {' '}
          </span>
          {userData.certificates ? userData.certificates : 'Not Updated'}
        </p>
        <p>
          <span>{t('MyProfilePage.EmployingCompany')}</span>
          {userData.employingCompany ? userData.employingCompany : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('MyProfilePage.ExpectedEndOfEmploymentDate')}
            {' '}
          </span>
          {userData.expectedEndOfEmploymentDate ? moment(userData.expectedEndOfEmploymentDate).format('MM/DD/YYYY') : 'Not Updated'}
        </p>
        {edit ? (
          <p>
            <span />
            <>
              <Button variant="primary" type="button" onClick={() => this.update(selectId)} className="no-style">Update</Button>
            </>
          </p>
        ) : ''}
        {
          modalState && (
            <Modal
              show={modalState}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Body>
                {successMessage}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  {t('OkBtn')}
                </Button>
              </Modal.Footer>
            </Modal>
          )
        }
      </div>
    );
  }
}

const ProfileDetail = withRouter(profileDetails);
export default withTranslation()(ProfileDetail);
