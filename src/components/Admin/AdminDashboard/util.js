export const cardData = [
  {
    title: "Employee",
    count: 80,
  },
  {
    title: "Hours Consumed",
    count: 127,
  },
  {
    title: "Tasks",
    count: 68,
  },
  {
    title: "Open Shifts",
    count: 54,
  },
];

const colorPrimary = "#2684A3";
const colorSecondary = "#2F9EC3";
const colorTernary = "#3BC3F1";

export const pieChartData = [
  [
    { name: "Group A", value: 400, color: colorTernary },
    { name: "Group B", value: 300, color: colorSecondary },
    { name: "Group C", value: 300, color: colorPrimary },
    { name: "Group D", value: 200, color: colorPrimary },
    { name: "Group E", value: 278, color: colorPrimary },
    { name: "Group F", value: 189, color: colorPrimary },
    { name: "Group G", value: 200, color: colorPrimary },
    { name: "Group H", value: 278, color: colorPrimary },
    { name: "Group I", value: 189, color: colorPrimary },
  ],
  [
    { name: "Group A", value: 200, color: colorSecondary },
    { name: "Group B", value: 400, color: colorPrimary },
    { name: "Group C", value: 200, color: colorPrimary },
    { name: "Group D", value: 250, color: colorTernary },
    { name: "Group E", value: 208, color: colorTernary },
    { name: "Group F", value: 180, color: colorTernary },
  ],
  [
    { name: "Group A", value: 200, color: colorSecondary },
    { name: "Group B", value: 400, color: colorTernary },
    { name: "Group C", value: 200, color: colorTernary },
    { name: "Group D", value: 250, color: colorSecondary },
    { name: "Group E", value: 208, color: colorSecondary },
    { name: "Group F", value: 180, color: colorSecondary },
  ],
];

export const descriptionTitles = [
  "Recent Activity",
  "Lorem Ipsum",
  "Amed preducra",
];

export const horizontalgraphdata = [
  {
    name: "person1",
    uv: 10,
    pv: 20,
    xy: 30,
    color: colorPrimary,
  },
  {
    name: "person2",
    uv: 30,
    pv: 20,
    xy: 22,
    color: colorSecondary,
  },
  {
    name: "person3",
    uv: 20,
    pv: 19,
    xy: 22,
    color: colorTernary,
  },
];
export const ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export const customizedTick = (ticksNumber) => {
  const isValid = ticksNumber % 5 === 0 ? true : false;
  const ticksvalue = isValid && ticksNumber > 0 ? ticksNumber : "";
  return ticksvalue;
};
