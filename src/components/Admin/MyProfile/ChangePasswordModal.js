import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import "./style.scss";

function ChangePasswordModal({
  isChangePasswordActive,
  clickAction,
  oldpassword,
  newpassword,
  confirmnewpassword,
  handleChangeAction,
  handleSubmitAction,
  error,
  handleOnBlurAction,
  submitted,
  loading,
}) {
  const { t } = useTranslation();
  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  return (
    <Modal show={isChangePasswordActive} onHide={() => clickAction()}>
      <Modal.Header closeButton>
        <Modal.Title>{t('ChangePasswordPage.ChangePassword')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form autoComplete="off">
          <div className="form-group">
            <label className="form-label" htmlFor="oldpassword">{t('ChangePasswordPage.OldPassword')}</label>
            <input type="password" className="form-input" name="oldpassword" value={oldpassword} onChange={handleChangeAction} />
            {submitted && !oldpassword
              && <div className="text-danger">{t('ChangePasswordPage.OldPasswordText')}</div>
            }
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="newpassword">{t('ChangePasswordPage.NewPassword')}</label>
            <input type="password" className="form-input" name="newpassword" value={newpassword} onChange={handleChangeAction} />
            {submitted && !newpassword
              && <div className="text-danger">{t('ChangePasswordPage.NewPasswordText')}</div>
            }
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirmnewpassword">{t('ChangePasswordPage.ConfirmPassword')}</label>
            <input type="password" className="form-input" name="confirmnewpassword" value={confirmnewpassword} onChange={handleChangeAction} onBlur={handleOnBlurAction} />
            {error && (<div className="text-danger">{error}</div>)}
            {submitted && !confirmnewpassword
              && <div className="text-danger">{t('ChangePasswordPage.ConfirmText')}</div>
            }
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>

        <div className="modal__actions">
          <button type="button" className="btn btn-outline-secondary mt-2" onClick={() => clickAction()}>{t('AppliedPage.closeBtn')}</button>
          <button type="button" onClick={() => handleSubmitAction()} disabled={loading} className="btn btn-primary mt-2">{t('ChangePasswordPage.ChangePassword')}</button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ChangePasswordModal;
