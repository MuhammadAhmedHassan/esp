import React from 'react';
import Modal from 'react-bootstrap/Modal';
import '../style.scss';
import { withTranslation } from 'react-i18next';


function NotesModal({
  isOpenModel,
  closeModel,
  handleSubmitAction,
  handleChangeAction,
  notes,
  isEmptyNote,
  t,
}) {
  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isOpenModel}
      onHide={() => closeModel()}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('TimeSheetRequest.NotesTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form autoComplete="off">
          <div className="form-group">
            <label className="form-label" htmlFor="notes">{t('TimeSheetRequest.Notes')}</label>
            <input type="textarea" className="form-input" name="notes" value={notes} onChange={handleChangeAction} />
            {isEmptyNote && (<div className="text-danger">{t('Common.Requried')}</div>)}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className="modal__actions">
          <button type="button" className="btn btn-outline-secondary mt-2" onClick={() => closeModel()}>{t('Common.Close')}</button>
          <button type="button" onClick={() => handleSubmitAction()} className="btn btn-primary mt-2">{t('Common.Send')}</button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default withTranslation()(NotesModal);
