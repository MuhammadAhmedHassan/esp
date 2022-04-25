import React from 'react';
import { Form } from 'react-bootstrap';

function CustomSelectField({
  label, name, value, onChange, options, required,
}) {
  return (
    <Form.Group className="col-lg-3 col-md-6">
      <Form.Label>{label}</Form.Label>
      <Form.Control name={name} value={value} as="select" onChange={onChange} required={required}>
        {options.map(opt => (<option key={opt.id} value={opt.id}>{opt.name}</option>))}
      </Form.Control>
    </Form.Group>
  );
}

export default CustomSelectField;
