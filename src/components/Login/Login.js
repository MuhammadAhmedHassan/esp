import React, { } from 'react';
import { connect } from 'react-redux';
import logo from '../../Images/logos/esp_logo_primary.svg';
import microsoftLogo from '../../Images/Icons/microsoft-logo.svg';
import { userService } from '../../services';
import LanguageSelect from '../shared/Multilingual/languageSelect';
import userLoggedin from './action/index';
import Api from '../common/Api';

const mapStateToProps = props => ({
  checkUser: props.checkUserRole,
});

const mapDispatchToProps = dispatch => ({
  userLoggedin: data => dispatch(userLoggedin(data)),
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      submitted: false,
      loading: false,
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  
  loginWithMS = () => {
    window.location.href = Api.adLogin;
  }
  
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { username, password } = this.state;
    
    // stop here if form is invalid
    if (!(username && password)) {
      return;
    }

    this.setState({ loading: true });
    userService.login(username, password)
      .then(
        (data) => {
          const { location, history } = this.props;
          const { from } = location.state || { from: { pathname: '/' } };
          if (data.statusCode !== 200) {
            this.setState({ error: data.message, loading: false });
          } else {
            history.push(from);
          }
          // eslint-disable-next-line react/destructuring-assignment
          this.props.userLoggedin(data);
        },
        error => this.setState({ error, loading: false }),
      );
  }

  render() {
    const {
      username,
      password,
      submitted,
      loading,
      error,
    } = this.state;
    return (
      <div className="container-fluid login">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 py-4">
            <div className="col-12">
              <div className="logo mx-auto mb-5 pb-sm-3">
                <img alt="esp logo" src={logo} />
              </div>
            </div>
            <div className="login-form p-4 p-sm-5">
              <form onSubmit={this.handleSubmit} autoComplete="off">
                <div className="row align-items-center">
                  <h2 className="col-6 mb-0">
                    {/* {t('LoginPage.Login')} */}
                  </h2>
                  <div className="col-6">
                    <div className="language-selector">
                      <LanguageSelect />
                    </div>
                  </div>
                </div>
                {error && (<small className="text-danger">{error}</small>)}
                <div className={`form-group mt-2 mt-sm-4 ${(submitted && !username) && 'error'} `}>
                  <label className="form-label" htmlFor="username">User Id</label>
                  <input type="text" autoComplete="noemail" className="form-input" name="username" value={username} onChange={this.handleChange} />
                  {submitted && !username
                    && <small className="text-danger">Please enter a valid User ID</small>
                  }
                </div>
                <div className={`form-group mt-2 mt-sm-4 ${(submitted && !password) && 'error'}`}>
                  <label className="form-label" htmlFor="password">Pin</label>
                  <input type="password" className="form-input" name="password" value={password} onChange={this.handleChange} />
                  {submitted && !password
                    && <small className="text-danger">Please enter a valid Pin</small>
                  }
                </div>
                <div className="row mt-2 mt-sm-4">
                  <div className="col-12 col-sm-6 text-center">
                    <div className="custom-control custom-checkbox remember-me">
                      <input type="checkbox" className="custom-control-input" id="remember-me" />
                      <label className="custom-control-label" htmlFor="remember-me">Keep me logged in</label>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 mt-2 mt-sm-0 text-center text-sm-right">
                    <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                  </div>
                </div>
                <div className="row  mt-3 mt-sm-5">
                  <div className="col-sm-12 text-center">
                    <button type="submit" className="btn btn-primary login-button" disabled={loading}><h3>Login</h3></button>
                  </div>
                </div>
                <div className="row  mt-3 mt-sm-5">
                  <div className="col-sm-12 text-center">
                    <button type="button" className="btn btn-primary login-button" onClick={() => this.loginWithMS()} disabled={loading}>
                      <h3>
                        <img src={microsoftLogo} width="30" alt="MS Login" className="img-responsive" />
                        {' '}
                        Login with Microsoft
                      </h3>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
