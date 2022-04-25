import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const IconHolder = ({ icon }) => (
  (icon === 'FaCheck')
    ? <span className="iconHolder iconHolder--FaCheck"><FaCheck /></span>
    : <span className="iconHolder iconHolder--FaTimes"><FaTimes /></span>
);

export default IconHolder;
