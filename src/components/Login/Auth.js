import React, { } from 'react';
import { userService } from '../../services';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.handleSubmit();
  }

  handleSubmit() {
    const { location: { search } } = this.props;
    const name = new URLSearchParams(search).get('name');
    const email = new URLSearchParams(search).get('email');
    const aio = new URLSearchParams(search).get('aio');

    userService.loginAd(name, email, aio, this.props)
      .then(
        (data) => {
          const { location, history } = this.props;
          const { from } = location.state || { from: { pathname: '/' } };
          if (data.statusCode !== 200) {
            alert(data.message);
            history.push('/login');
          } else {
            history.push(from);
          }
        },
        error => alert(error),
      );
  }

  render() {
    return (
      <div className="container h-100">
        <div className="row align-items-center text-center h-100">
          <div className="col">
            <h3>Please wait! Getting your information ready</h3>
          </div>
        </div>
      </div>
    );
  }
}
export default Auth;
