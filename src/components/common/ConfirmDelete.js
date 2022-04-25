import React from 'react';
import Modal from 'react-bootstrap/Modal';

const ConfirmDelete = (
  {
    showMessage,
    messageTitle,
    message,
    confirmDelete,
    closeMessage,
    object,
  },
) => (
  <Modal show={showMessage} dialogClassName="messageModal modal-dialog-centered">
    <Modal.Header>
      <Modal.Title>
        {messageTitle}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {message}
    </Modal.Body>
    <Modal.Footer>
      <div className="modal__actions">
        <button type="button" className="btn btn-outline-primary" onClick={() => closeMessage()}> Don&apos;t delete </button>
        <button type="button" className="btn btn-danger" onClick={() => confirmDelete()}>{`Yes, delete ${object}`}</button>
      </div>
    </Modal.Footer>
  </Modal>
);

export default ConfirmDelete;
