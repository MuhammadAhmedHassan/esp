import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Button, Modal,
} from 'react-bootstrap';

import {
  withRouter,
} from 'react-router-dom';

class CancelButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel : false,
      redirectURL : this.props.redirectURL,
      data1 : this.props.data1,
      data2 : this.props.data2
    };
  }

  componentDidMount() {
  
  }
  
  handleShow = () => {
    this.setState({
      showModel: true,
    });
  }

  handleCloseModal = () => {
    this.setState({
      showModel: false,
    });
  };

  goBack = (e) => {
    e.preventDefault();
    const {
      redirectURL,data1,
      data2
    } = this.state;
    const { history } = this.props;
    if (redirectURL !== '' && redirectURL != undefined) {
      history.push(redirectURL);
    }else{
      this.props.callBackFunction(this.props,data1,data2);
    }
  };
  
  
  render() {
    const {
      showModel,
    } = this.state;
    const { t } = this.props;
    return (
      <>
        <button
          type="button"
          className="btn btn-primary mt-4"
          onClick={this.handleShow}
        >
          {' '}
          {t('Cancel.CancelBtn')}
          {' '}
        </button>
        {
            showModel && (
            <Modal
              show={showModel}
              onHide={this.handleCloseModal}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Body>
                {t('Cancel.ModelMeessage')}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleCloseModal}>
                  {t('Cancel.NoBtn')}
                </Button>
                <Button variant="primary" onClick={this.goBack}>
                  {' '}
                  {t('Cancel.YesBtn')}
                </Button>
              </Modal.Footer>
            </Modal>
            )
        }
      </>
    );
  }
}
export default withRouter(withTranslation()(CancelButton));
