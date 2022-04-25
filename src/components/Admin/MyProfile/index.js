/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import { withTranslation } from 'react-i18next';
import Profile from './Profile';
import Prodetails from './Pro_details';
import Personaldetails from './Personal_details';
import './style.scss';
import { userService } from '../../../services';
import Api from '../../common/Api';

const { impersonationSubject } = userService;
let impersentSubscriber;

class ProfileIndex extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userEmail = userService.getUserEmail();
    this.state = {
      token: ` ${token}`,
      userEmail,
      userData: null,
      isImpersenating: false,
    };
  }

  componentDidMount() {
    impersentSubscriber = impersonationSubject.subscribe((val) => {
      this.setState({ isImpersenating: val.showName }, () => this.loadData());
    });
  }

  componentWillUnmount() {
    if (impersentSubscriber) {
      impersentSubscriber.unsubscribe();
    }
  }

  loadData = () => {
    const impUser = userService.getUser();
    const { token, userEmail, isImpersenating } = this.state;
    // Get chapter type
    fetch(`${Api.userDetail}`, {
      method: 'POST',
      headers: new Headers({
        token: userService.getToken(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ email: isImpersenating ? impUser.email : userEmail }),
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

  render() {
    const { userData } = this.state;
    const { t } = this.props;
    return (
      userData ? (
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
                  <Prodetails userData={userData} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : <p>{t('LoadingText')}</p>
    );
  }
}

export default withTranslation()(ProfileIndex);
