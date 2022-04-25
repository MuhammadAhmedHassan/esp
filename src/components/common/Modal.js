import React, { useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import CopySchedule from '../Admin/SeeScheduler/copySchedule';

/**
 * Import ends
 */
function ModalPopUp(props) {
  const {
    onHide, header, inputval, sectionname, data, modalbody, t,
  } = props;
  const textInput = useRef(null);

  const handleClose = (e) => {
    onHide(textInput.current.value, e.target.type);
  };

  const handleCopyScheduleClose = (message) => {
    onHide(message);
  };

  const handleConfirm = () => {
    onHide(true);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {header}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea className={sectionname === 'add-notes' ? 'd-block' : 'd-none'} type="text" name="textboxNotes" ref={textInput} rows="4" cols="80" defaultValue={inputval} />
        <div className={sectionname === 'share-with-team' ? 'd-block' : 'd-none'}>
          <CopySchedule setMessage={handleCopyScheduleClose} requestBodyData={data} />
        </div>
        <span className={(sectionname === 'confirm' || sectionname === 'message') ? 'd-block' : 'd-none'}>{modalbody}</span>
      </Modal.Body>
      <Modal.Footer>
        <Button className={sectionname === 'add-notes' ? 'd-block' : 'd-none'} onClick={e => handleClose(e)}>
          {' '}
          {t('SaveBtn')}
        </Button>
        <Button className={sectionname === 'confirm' ? 'd-block' : 'd-none'} onClick={e => handleConfirm(e)}>
          {' '}
          {t('OkBtn')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
export default (withTranslation()(ModalPopUp));
