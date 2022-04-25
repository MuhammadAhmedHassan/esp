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
    "Second",
    "First",
    "Third",
  ],
  datasets: [
    {
      label: "# Leaves",
      data: [12, 14, 3, 5, 8, 10, 12, 14, 3, 5, 8, 10],
      backgroundColor: [
        colorPrimary,
        colorSecondary,
        colorTernary,
        colorSecondary,
        colorPrimary,
        colorTernary,
        colorPrimary,
        colorSecondary,
        colorTernary,
        colorSecondary,
        colorPrimary,
        colorTernary,
      ],
      borderColor: [
        colorPrimary,
        colorSecondary,
        colorTernary,
        colorSecondary,
        colorPrimary,
        colorTernary,
        colorPrimary,
        colorSecondary,
        colorTernary,
        colorSecondary,
        colorPrimary,
        colorTernary,
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
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
    layout: {
      padding: 5
  },
  maintainAspectRatio: true,
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
          afterFit: (scale) => {
            scale.height = 12;
          },
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
        barThickness: 20,
        ticks: {
          display: false, 
          maxTicksLimit: 15,
        },
        gridLines: {
          color: "#34A1D9",
          drawOnChartArea: false,
          tickMarkLength: 0,
          lineWidth: 2,
        },
      },
    ],
  },
};

const VerticalBar = () => (
  <>
    <Bar width={480} height={316} data={data} options={options} />
  </>
);

export default VerticalBar;
