import React from "react";
import { Bar } from "react-chartjs-2";

const colorPrimary = "#0A1E4B";
const colorSecondary = "#34A1D9";
const colorTernary = "#E14542";
const data = {
  labels: [
    "First",
    "Second",
    "Third",
    "Second",
    "First",
    "Third",
    "First",
    "Second",
    "Third",
    "First",
  ],
  datasets: [
    {
      label: "#Leaves ",
      data: [12, 14, 13, 5, 10, 13, 5, 12, 6, 10],
      backgroundColor: [
        colorPrimary,
        colorSecondary,
        colorTernary,
        colorSecondary,
        colorTernary,
        colorPrimary,
        colorTernary,
        colorSecondary,
        colorTernary,
        colorSecondary,
      ],
      borderColor: [
        colorPrimary,
        colorSecondary,
        colorTernary,
        colorSecondary,
        colorTernary,
        colorPrimary,
        colorTernary,
        colorSecondary,
        colorTernary,
        colorSecondary,
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  plugins: {
    datalabels: {
      display: false,
    },
  },
  layout: {
    padding: {
      left: 5,
      right: 5,
      top: 0,
      bottom: -5,
    },
  },
  legend: {
    display: false,
  },
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  scales: {
    yAxes: [
      {
        ticks: {
          padding: 5,
          fontColor: "#34A1D9",
          beginAtZero: true,
          min: 0,
          stepSize: 1,
          max: 18,
          callback: function (value, index) {
            if (value > 0) {
              return value % 5 == 0 ? `${value}` : " ";
            } else {
              return "";
            }
          },
          align: "left",
        },

        gridLines: {
          color: "#34A1D9",
          drawOnChartArea: false,
          lineWidth: 2,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontColor: "#34A1D9",
          beginAtZero: true,
          min: 0,
          stepSize: 1,
          callback: function (value, index) {
            return `${index + 1}`;
          },
        },
        barThickness: 30,
        gridLines: {
          lineWidth: 2,
          color: "#34A1D9",
          drawOnChartArea: false,
        },
      },
    ],
  },
};

const HorizontalBarChart = () => (
  <>
    <Bar width={480} height={316} data={data} options={options} />
  </>
);

export default HorizontalBarChart;
