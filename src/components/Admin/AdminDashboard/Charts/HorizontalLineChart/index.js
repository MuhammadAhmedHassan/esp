import React from "react";
import { HorizontalBar } from "react-chartjs-2";
import "chartjs-plugin-datalabels";

const colorPrimary = "#0A1E4B";
const colorSecondary = "#34A1D9";
const colorTernary = "#E14542";
const colorlight = "#2A8CA9";

const data = {
  showLabel: true,
  labels: ["Jan", "Feb", "Mar"],
  plugins: {
    datalabels: {
      display: true,
      color: "white",
    },
  },
  datasets: [
    {
      label: "Working Employee ",
      data: [25, 20, 30],
      backgroundColor: colorPrimary,
      fontColor: "white",
    },
    {
      label: "New Employee ",
      backgroundColor: colorSecondary,
      fontColor: "#11CDEF",
      data: [12, 20, 30],
    },
    {
      label: "Allowed Leave ",
      data: [20, 20, 30],
      backgroundColor: colorTernary,
      fontColor: "white",
    },
    {
      label: "Leave ",
      data: [15, 15, 10],
      backgroundColor: colorlight,
      fontColor: "white",
    },
  ],
};

const optionsChart = {
  plugins: {
    datalabels: {
      formatter: (value, ctx) => {
        return `${value}%`
  
      },
      color: "#ffffff",
    },
  },
  layout: {
    padding:{
      left: 30,
      right: 30,
      top: 0,
      bottom: 0
    }
},
  legend: {
    display: false,
    labels: {
      display: false,
      fontColor: "#8898AA",
    },
  },
  scales: {
    yAxes: [
      {
        barThickness: 40,
        gridLines: {
          color: "#34A1D9",
          drawOnChartArea: false,
          tickMarkLength: 0,
          lineWidth: 2,
        },

        ticks: {
          display: false,
        },
        stacked: true,
      },
    ],
    xAxes: [
      {
        barPercentage: 1.0,
        categoryPercentage: 1.0,
        ticks: {
          padding: 5,
          beginAtZero: true,
          steps: 1,
          stepValue: 10,
          maxTicksLimit: 15,
          max: 100,
          fontColor: "#34A1D9",
          callback: function (value) {
            if (!(value % 2)) {
              return `${value}%`;
            }
          },
        },
        gridLines: {
          color: "#34A1D9",
          drawOnChartArea: false,
          // tickMarkLength: 0,
          lineWidth: 2,
        },
        stacked: true,
      },
    ],
  },

};
const HorizontalBarChart = () => (
  <>
    <HorizontalBar height={200} data={data} options={optionsChart} />
  </>
);

export default HorizontalBarChart;
