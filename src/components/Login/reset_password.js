/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { } from 'react';
import logo from '../../Images/logos/esp_logo_primary.svg';
import './style.scss';

class ResetPassword extends React.Component {
  render() {
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
              <form onSubmit={this.handleSubmit}>
                <div className="row">

                  <h2 className="col-12 mb-0">
                    Forgot Password
                  </h2>

                </div>
                <div className="form-group mt-2 mt-sm-4">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" />
                </div>
                <div className="form-group mt-2 mt-sm-4 ">
                  <label className="form-label">Confirm Password</label>
                  <small className="text-danger">Password Does not match</small>
                  <input type="password" className="form-input" />
                </div>

                <div className="row  mt-3 mt-sm-5">
                  <div className="col-sm-12">
                    <button type="submit" className="btn btn-primary login-button"><h3>Submit</h3></button>
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
export default ResetPassword;
