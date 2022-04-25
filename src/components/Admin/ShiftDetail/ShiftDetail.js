/* eslint-disable react/no-unused-state */
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Form,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import Api from '../../common/Api';
import { userService } from '../../../services';
import Loaders from '../../shared/Loaders';

const mapStateToProps = state => ({
  // To get the list of employee details from store
  loggedUserRole: state.checkUserRole.user,
  userId: state.checkUserRole.user.userId,
  roleId: state.checkUserRole.user.role,
});

class ShiftDetail extends React.Component {
  constructor(props) {
    super(props);
    const token = userService.getToken();
    const userId = userService.getUserId();
    const {
      match,
    } = this.props;
   
    this.state = {
      token: `${token}`,
      userId: `${userId}`,
      loading: true,
      shiftData: {},
      id: match.params.id,
      uId: match.params.uId,
    };
  }
  
  componentDidMount() {
    this.getShiftData();
  }

  getShiftData = () => {
    const {
      token, userId, id, uId,
    } = this.state;

    fetch(`${Api.timesheet.shiftDetail}`, {
      method: 'POST',
      headers: new Headers({
        token: `${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        id: parseInt(id, 10),
        languageId: 1,
        userId: uId > 0 ? parseInt(uId, 10) : parseInt(userId, 10),
      }),
    }).then(response => response.json())
      .then((response) => {
        if (response.statusCode === 200) {
          this.setState({
            shiftData: response.data,
            loading: false,
          });
        } else if (response.statusCode === 401) {
          const refreshToken = userService.getRefreshToken();
          refreshToken.then(() => {
            const tokens = userService.getToken();
            this.setState({ token: tokens }, () => this.getShiftData());
          });
        } else {
          alert(response.message);
        }
      })

      .catch(err => console.error(err.toString()));
  }
  
  render() {
    const {
      shiftData, loading,
    } = this.state;
    const { t } = this.props;
    return (
      <>
        {loading ? (
          <div className="customloader">
            <Loaders />
          </div>
        ) : (
          <div className="container-fluid">
            <div className="card_layout">
              <h3>
                {t('ShiftDetail.Info')}
              </h3>
              <Form className="row">
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
                  <Form.Label>{t('EmployeeNameText')}</Form.Label>
                  <Form.Control name="managerId" value={shiftData.userName} type="text" readOnly />
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
                  <Form.Label>{t('ShiftStartTime')}</Form.Label>
                  <Form.Control name="managerId" value={shiftData.actualStartDateTime === null ? '-' : moment.utc(shiftData.actualStartDateTime).local().format('HH:mm, DD/MM/YYYY')} type="text" readOnly />
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
                  <Form.Label>{t('ShiftEndTime')}</Form.Label>
                  <Form.Control name="managerId" value={shiftData.actualEndDateTime === null ? '-' : moment.utc(shiftData.actualEndDateTime).local().format('HH:mm, DD/MM/YYYY')} type="text" readOnly />
                </Form.Group>
                
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
                  <Form.Label>{t('BreakTime')}</Form.Label>
                  <Form.Control name="managerId" value={shiftData.allowedPaidBreakTime} type="text" readOnly />
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
                  <Form.Label>{t('LoggedInVia')}</Form.Label>
                  <Form.Control name="managerId" value={(shiftData.loginVia === null) ? ('-') : (shiftData.loginVia)} type="text" readOnly />
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
                  <Form.Label>{t('GeoLocation')}</Form.Label>
                  <Form.Control name="managerId" value={(shiftData.geoLocation === null) ? ('-') : (shiftData.geoLocation)} type="text" readOnly />
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
                  <Form.Label>{t('SchedulePage.Table_ScheduleName')}</Form.Label>
                  <Form.Control name="managerId" value={shiftData.scheduleName} type="text" readOnly />
                </Form.Group>
              </Form>
            </div>
            <div className="card_layout">
              <h3>
                {t('ShiftDetail.ShiftInformation')}
              </h3>
              <Form className="row">
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
                  <Form.Label>{t('ShiftLabel')}</Form.Label>
                  <Form.Control name="managerId" value={shiftData.shiftTitle} type="text" readOnly />
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
                  <Form.Label>{t('AnyNote')}</Form.Label>
                  <Form.Control name="managerId" value={(shiftData.notes === null) ? ('-') : (shiftData.notes)} type="text" readOnly />
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
                  <Form.Label>{t('RequiredHours')}</Form.Label>
                  <Form.Control name="managerId" value={shiftData.requiredHours} type="text" readOnly />
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
                  <Form.Label>{t('TotalCalculatedHours')}</Form.Label>
                  <Form.Control name="managerId" value={(shiftData.totalHours.length === 0) ? ('-') : (shiftData.totalHours)} type="text" readOnly />
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className="col-lg-4 col-md-6">
                  <Form.Label>{t('Variance')}</Form.Label>
                  <Form.Control name="managerId" value={(shiftData.variance.length === 0) ? ('-') : (shiftData.variance)} type="text" readOnly />
                </Form.Group>
              </Form>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps, null,
)(withTranslation()(ShiftDetail));
