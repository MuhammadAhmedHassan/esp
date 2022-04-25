
import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

export class LeaveGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      graphDetails,
      graphLabels = [],
      graphValuesBalance = [],
      graphValuesAvailed = [],
      keyPosition = 'top',
    } = this.props;

    let charData = {};
    graphDetails.forEach((record) => {
      graphLabels.push(record.monthName);
      graphValuesBalance.push(record.balance);
    });
    graphDetails.forEach((record) => {
      graphValuesAvailed.push(record.consumed);
    });
    

    charData = {
      labels: graphLabels,
      datasets: [{
        label: 'Vacation Balance',
        data: graphValuesBalance,
        backgroundColor: 'rgba(0 ,194, 240, 0.5)',
        color: 'rgb(255,255,255, 0.3)',
      }, {
        label: 'Vacation Availed',
        data: graphValuesAvailed,
        backgroundColor: 'rgba(0, 132, 163,0.3)',
        color: 'rgb(255,255,255)',
      }],
    };

    const options = {
      legend: {
        position: keyPosition,
        
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    };


    return (
      <Bar data={charData} options={options} />
    );
  }
}

export default LeaveGraph;
