/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { withTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { commonService } from '../../../services/common.service';

class Personaldetails extends React.Component {
  render() {
    const { userData, t } = this.props;

    const addressData = userData.addresses;
    const jobData = userData.jobs;
    return (
      <div className="personalDetails">
        <h2>
          {' '}
          {t('MyProfilePage.PersonalDetails')}
          {' '}
        </h2>
        <p>
          <span>
            {t('MyProfilePage.FirstName')}
            {' '}
          </span>
          {userData.firstName ? userData.firstName : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('MyProfilePage.LastName')}
            {' '}
          </span>
          {userData.lastName ? userData.lastName : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('MyProfilePage.Age')}
            {' '}
          </span>
          {userData.age ? userData.age : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('MyProfilePage.Gender')}
            {' '}
          </span>
          {userData.gender ? userData.gender : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            Date of Birth
            {' '}
          </span>
          {userData.dateOfBirth ? moment(userData.dateOfBirth).format('MM/DD/YYYY') : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            Religion
            {' '}
          </span>
          {userData.religion ? userData.religion : 'Not Updated'}
        </p>
        <p>
          <span>
            {t('MyProfilePage.City/Province')}
            {' '}
          </span>
          {userData.city ? userData.city : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('CountryText')}
            {' '}
          </span>
          {userData.country ? userData.country : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('MyProfilePage.TimeZone')}
            {' '}
          </span>
          {userData.timeZone ? userData.timeZone : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('MyProfilePage.MobileNumber')}
            {' '}
          </span>
          {userData.mobileNumber ? userData.mobileNumber : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('MyProfilePage.PhoneNumber')}
            {' '}
          </span>
          {userData.phone ? userData.phone : 'Not Updated'}
        </p>
        <p>
          <span>
            Personal Mobile
          </span>
          {userData.personalMobile ? userData.personalMobile : 'Not Updated'}
        </p>
        <p>
          <span>
            Personal Landline
          </span>
          {userData.personalLandline ? userData.personalLandline : 'Not Updated'}
        </p>
        <p>
          <span>
            {' '}
            {t('MyProfilePage.Fax')}
            {' '}
          </span>
          {userData.fax ? userData.fax : 'Not Updated'}
        </p>
        <p>
          <span>
            Nationality
          </span>
          {userData.nationality ? userData.nationality : 'Not Updated'}
        </p>
        <p>
          <span>
            Ethnicity
          </span>
          {userData.ethnicity ? userData.ethnicity : 'Not Updated'}
        </p>
        <p>
          <span>
            Email
          </span>
          {userData.email ? userData.email : 'Not Updated'}

        </p>
        <p>
          <span>
            Personal Email
          </span>
          {userData.personalEmail ? userData.personalEmail : 'Not Updated'}
        </p>
        <p>
          <span>
            Address
          </span>
          {addressData.map(data => (
            <address>
              <p>
                Ownership:
                {' '}
                {data.ownership}
              </p>
              <p>
                {data.address1}
                {' '}
                {data.address2}
                {' '}
                {data.address3}
                {' '}
                {data.address4}
                <br />
                {data.address5}
                <br />
                {data.postCode}
              </p>
            </address>
          ))}
        </p>
        <p>
          <span>
            Job
          </span>
          {jobData.map(data => (
            <p>
              {data.jobTitle}
              <br />
              {data.classification}
              <br />
              {`${commonService.localizedDate(data.startDate)} - ${data.endDate ? commonService.localizedDate(data.endDate) : 'Till date'}`}
            </p>
          ))}
        </p>
      </div>
    );
  }
}

export default withTranslation()(Personaldetails);
