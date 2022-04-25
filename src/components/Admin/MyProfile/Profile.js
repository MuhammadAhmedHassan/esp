import React from 'react';
import { withTranslation } from 'react-i18next';
import ChangePasswordModal from './ChangePasswordModal';
import Api from '../../common/Api';
import { userService } from '../../../services';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const email = userService.getUserEmail();
    this.state = {
      isChangePasswordActive: false,
      oldpassword: '',
      newpassword: '',
      confirmnewpassword: '',
      submitted: false,
      loading: false,
      error: '',
      token: `${token}`,
      email,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }

  handleSubmit = () => {
    this.handleOnBlur();
    this.setState({ submitted: true });

    const {
      token,
      email,
      oldpassword,
      newpassword,
      confirmnewpassword,
      isChangePasswordActive,
    } = this.state;

    // stop here if form is invalid
    if (!(oldpassword && newpassword && confirmnewpassword)) {
      return;
    }

    this.setState({ loading: true });
    fetch(`${Api.changePassword}`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: `${token}`,
      }),
      body: JSON.stringify({
        email, oldpassword, newpassword, confirmnewpassword,
      }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            isChangePasswordActive: !isChangePasswordActive,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.handleSubmit());
          });
        }
      })
      .catch(err => console.error(err.toString()));
  }

  ShowChangePasswordModel = () => {
    const { isChangePasswordActive } = this.state;
    this.setState({
      isChangePasswordActive: !isChangePasswordActive,
      oldpassword: '',
      newpassword: '',
      confirmnewpassword: '',
      error: '',
    });
  }

  handleOnBlur() {
    const { newpassword, confirmnewpassword } = this.state;
    if (newpassword !== confirmnewpassword) {
      this.setState({ error: "The passwords doesn't match" });
    } else {
      this.setState({ error: '' });
    }
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.handleOnBlur();
  }

  render() {
    const { userData, t } = this.props;
    const {
      isChangePasswordActive,
      oldpassword,
      newpassword,
      confirmnewpassword,
      error,
      submitted,
      loading,
    } = this.state;
    return (
      <div>
        <div className="MyProfileOuter">
          <div className="row">
            <div className="col-lg-12">
              <div className="avtarOuter">
                <div className="profilePic">
                  <img src={userData.profileImage} alt="ProfileImage" />
                </div>
                <div className="profileInfo">
                  <h4>{`${userData.firstName} ${userData.lastName}`}</h4>
                  <p>{userData.email}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              {/* <div className="profileRight">
                <button className="btn btn-primary" onClick={() => this.ShowChangePasswordModel()}>{t('ChangePasswordPage.ChangePassword')}</button>
              </div> */}
            </div>
          </div>

          <ChangePasswordModal
            isChangePasswordActive={isChangePasswordActive}
            clickAction={() => this.ShowChangePasswordModel()}
            oldpassword={oldpassword}
            newpassword={newpassword}
            confirmnewpassword={confirmnewpassword}
            handleChangeAction={this.handleChange}
            handleSubmitAction={() => this.handleSubmit()}
            error={error}
            handleOnBlurAction={() => this.handleOnBlur()}
            submitted={submitted}
            loading={loading}
          />
        </div>


      </div>
    );
  }
}

export default withTranslation()(Profile);
