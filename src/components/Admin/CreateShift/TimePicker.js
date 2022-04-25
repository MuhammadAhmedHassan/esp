/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { enableRipple } from '@syncfusion/ej2-base';
import { TimePicker } from '@syncfusion/ej2-calendars';

class TimePickers extends React.Component {
  render() {
    return (
      <div>
        <TimePicker />
      </div>
    );
  }
}

export default TimePickers;
