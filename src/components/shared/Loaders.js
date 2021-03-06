import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function Loaders() {
  return (
    <>
      <p className="alert text-center">
        {' '}
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
        {' '}
        Loading ...
        {' '}
      </p>
    </>
  );
}
