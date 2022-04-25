import React from 'react';
import Modal from 'react-bootstrap/Modal';

const AlertPanel = (
  {
    showMessage,
    error,
    message,
    closeMessage,
  },
) => (
  <Modal show={showMessage} dialogClassName="messageModal modal-dialog-centered">
    <Modal.Header>
      <Modal.Title className={error && 'error-heading'}>
        {!error ? 'Confirmation' : 'Error'}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {message}
    </Modal.Body>
    <Modal.Footer>
      <div className="modal__actions">
        <button type="button" className="btn btn-primary" onClick={() => closeMessage()}> Close </button>
      </div>
    </Modal.Footer>
  </Modal>
);

export default AlertPanel;
