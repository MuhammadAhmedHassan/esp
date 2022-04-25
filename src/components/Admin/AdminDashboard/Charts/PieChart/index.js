import React from "react";
import { Pie } from "react-chartjs-2";

const colorPrimary = "#2684A3";
const colorSecondary = "#2F9EC3";
const colorTernary = "#3BC3F1";

const data = {
  labels: ["First", "Second", "Third"],
  datasets: [
    {
      data: [10, 15, 13],
      backgroundColor: [colorPrimary, colorTernary, colorSecondary],
      borderColor: [colorPrimary, colorTernary, colorSecondary],
      borderWidth: 1,
    },
  ],
};
const options = {
  plugins: {
    datalabels: {
     display:false
    }
  },
  legend: {
    display: false,
  },
  tooltips: {
    enabled: false,
  },
  segmentShowStroke: false,
  segmentStrokeWidth: 0,
};

const DashboardPieChart = () => {
  return <Pie data={data} width={300} height={300} options={options} />;
};

export default DashboardPieChart;
