import React from 'react';
import { withTranslation } from 'react-i18next';
import Prodetails from './Pro_details';
import Personaldetails from './Personal_details';
import Profile from './Profile';
import './style.scss';
import { userService } from '../../../services';
import Api from '../../common/Api';

class ViewProfileIndex extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const { match } = this.props;
    let isEdit = true;
    if (match.params.id && match.params.view) {
      isEdit = false;
    }
    this.state = {
      token: ` ${token}`,
      loadedAllManagers: false,
      userData: null,
      id: match.params.id || userService.getUserId(),
      isViewMode: isEdit,
      allManagers: [],
      selectedServiceTypes: [],
    };
  }

  componentDidMount() {
    this.loadData();
    this.getManagers();
  }

  loadData = () => {
    const { token, id } = this.state;
    // Get chapter type
    fetch(`${Api.userDetail}`, {
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
        email: '',
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            userData: response.data,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.loadData());
          });
        } else {
          this.setState({
            userData: [],
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  getManagers = () => {
    const {
      token, id, userData, allManagers, selectedServiceTypes,
    } = this.state;


    // Get chapter type
    fetch(`${Api.manageEmp.getmanagersbyuserid}`, {
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
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            allManagers: response.data, loadedAllManagers: true,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getManagers());
          });
        } else {
          this.setState({
            allManagers: [],
          });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  render() {
    const {
      userData, isViewMode, loadedAllManagers, allManagers, id, selectedServiceTypes,
    } = this.state;
    const { t } = this.props;
    return (
      (userData && loadedAllManagers) ? (
        <>
          <div className="container-fluid">
            <div className="card_layout myProfile_comp">
              <div className="row">
                <div className="col-md-12">
                  <Profile userData={userData} />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <Personaldetails userData={userData} />
                </div>
                <div className="col-lg-6">
                  {!isViewMode ? (
                    <Prodetails userData={userData} edit allManagers={allManagers} selectId={id} selectedServiceTypes={selectedServiceTypes} />
                  ) : (
                    <Prodetails userData={userData} allManagers={allManagers} selectedServiceTypes={selectedServiceTypes} selectId={id} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : <p>{t('LoadingText')}</p>
    );
  }
}

export default withTranslation()(ViewProfileIndex);
