/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Button, Modal,
} from 'react-bootstrap';

class ApiResponsePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: true,
      // eslint-d isable-next-line react/no-unused-state
      body: this.props.body,
    };
  }

  handleCloseModal = () => {
    this.setState({ showModel: false });
    this.props.closeResponseModel();
  };

  render() {
    const {
      showModel, body,
    } = this.state;
    const { t } = this.props;
    return (
      <>
        <Modal
          onHide={this.handleCloseModal}
          show={showModel}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>
            {body}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal}>
              {t('Common.Ok')}
            </Button>
          </Modal.Footer>
        </Modal>
        )
      </>
    );
  }
}
export default withTranslation()(ApiResponsePopup);
