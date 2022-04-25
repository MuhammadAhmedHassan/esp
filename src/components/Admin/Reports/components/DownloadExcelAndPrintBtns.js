import React from 'react';
import { Dropdown } from 'react-bootstrap';
import downloadIcon from '../../../../Images/Icons/downloadIcon.svg';


function DownloadExcelAndPdfBtns({ onDownloadBtnClick, disabled }) {
  return (
    <div>
      <Dropdown size="sm" className="text-right">
        <Dropdown.Toggle id="dropdown-basic" className="w-auto no-style-btn bg-transparent">
          <img src={downloadIcon} alt="download" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {/* <Dropdown.Item as="span" onClick={() => onDownloadBtnClick(false)} disabled={disabled}>Download Pdf</Dropdown.Item> */}
          <Dropdown.Item as="span" onClick={() => onDownloadBtnClick(true)} disabled={disabled}>Download Excel</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default DownloadExcelAndPdfBtns;
