import React from "react";
import { Table, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { DummayData, tableHeader } from "../util";
import Loaders from "../../../shared/Loaders";
import "./style.scss";

const ExceptionTable = ({
  hoursWorkedData,
  combineByshiftLabel,
  combineByWeekData,
  isHoursTableLoading,
  combineForWeekWise,
  uniqueDateByWeekData,
  sameDateAddition,
}) => {
  const getHeaderStyle = (index, headerType) => {
    let style = {};
    if (index == 1) {
      style = { minWidth: 350, borderBottom: "none" };
    } else if (index == 0) {
      style = {
        minWidth: 150,
        textAlign: "center",
        border: "none",
        borderTop: "1px solid  #dee2e6",
      };
    } else {
      style = {
        minWidth: 100,
        whiteSpace: "nowrap",
        borderBottom: "none",
        borderRight: "none",
        paddingTop: headerType === "Day of Week" ? 30 : null,
      };
    }
    return style;
  };

  const weekdetails = hoursWorkedData
    ? combineByWeekData(hoursWorkedData.data ? hoursWorkedData.data : [])
    : [];

  const shiftWiseData = hoursWorkedData
    ? combineByshiftLabel(
        hoursWorkedData.data ? hoursWorkedData.data : [],
        weekdetails
      )
    : [];

  const calculatedTotalData = hoursWorkedData
    ? combineForWeekWise(hoursWorkedData, shiftWiseData)
    : [];

  const byUniqueDate = weekdetails ? uniqueDateByWeekData(weekdetails) : [];

  const sameDateHandle = sameDateAddition
    ? sameDateAddition(shiftWiseData)
    : [];

  function getIndex() {
    let mainIndex = 0;
    if (calculatedTotalData) {
      calculatedTotalData.map((labels, index) => {
        if (labels) {
          if (labels.shiftLabel) {
            mainIndex = index;
          }
        }
      });
    }
    return mainIndex;
  }

  return (
    <div className="HoursTableContainer">
      {isHoursTableLoading ? (
        <Loaders />
      ) : (
        <Table bordered>
          <thead>
            <tr>
              {tableHeader.map((header, index) => (
                <th
                  className={`p-0 ${
                    index == 6 || index == 5 || index == 0
                      ? "borderhead"
                      : "border-0"
                  }`}
                >
                  <tr className="d-flex justify-content-center align-items-center">
                    <td className="border-0">
                      {" "}
                      {header === "Day of Week" && "Week"}
                    </td>
                  </tr>
                  <tr
                    className="p-0"
                    style={{ height: header === "Day of Week" ? 82 : null }}
                  >
                    <td style={getHeaderStyle(index, header)}>{header}</td>
                  </tr>
                </th>
              ))}

              {byUniqueDate &&
                byUniqueDate.map((val) => {
                  return (
                    <th className="p-0">
                      <tr className="d-flex justify-content-center align-items-center">
                        <td className="border-0">
                          {val &&
                            val.weekStartDate &&
                            `${val.weekStartDate.substring(
                              8,
                              10
                            )}-${val.weekStartDate.substring(
                              5,
                              7
                            )}-${val.weekStartDate.substring(0, 4)}`}
                        </td>
                      </tr>

                      <tr className="trHeight">
                        {val.days.map((v, index) => {
                          return (
                            <td className="daytd">
                              {v && v.date}{" "}
                              {v && v.day && v.day.substring(0, 3)}
                            </td>
                          );
                        })}
                      </tr>
                    </th>
                  );
                })}
              <th>
                <tr className="d-flex justify-content-center align-items-center">
                  <td className="border-0 marginClass">Totals</td>
                </tr>
              </th>
            </tr>
          </thead>
          <tbody>
            <td
              align="center"
              className="lable finalCalculated"
              rowSpan={
                calculatedTotalData
                  ? calculatedTotalData.length
                    ? calculatedTotalData.length + 4
                    : 7
                  : 7
              }
            >
              {/* {null} */}

              {calculatedTotalData &&
                calculatedTotalData[getIndex()] &&
                calculatedTotalData[getIndex()].userName}
            </td>
            {sameDateHandle &&
              sameDateHandle.map((value, index) => {
                return (
                  <>
                    {value && value.shiftLabel && (
                      <tr>
                        <td className="lable shiftLable">{value.shiftLabel}</td>
                        <td>Hrs</td>
                        <td className="text-center">{null}</td>
                        <td>
                          {null}
                          {/* {value.status} */}
                        </td>
                        <td></td>

                        {value.days &&
                          value.days.map((reportDetails) => {
                            return (
                              <td colSpan={1} className="p-0">
                                {reportDetails &&
                                  reportDetails.days &&
                                  reportDetails.days.map((v,pointer) => {
                                    if (v) {
                                      if(reportDetails.days[pointer+1] && 
                                        reportDetails.days[pointer].weekDates
                                        ==reportDetails.days[pointer+1].weekDates){
                                          if(v.shiftLabel == value.shiftLabel){
                                            return (
                                              <td className="totaltd" colSpan={1}>
                                                {v.calculatedTime && v.calculatedTime}
                                              </td>
                                            );
                                          }
                                      }
                                      else{
                                        return (
                                          <td className="totaltd" colSpan={1}>
                                            {v.calculatedTime
                                              ? v.shiftLabel == value.shiftLabel
                                                ? v.calculatedTime
                                                : 0
                                              : 0}
                                          </td>
                                        );
                                      }
                                    }
                                  })}
                              </td>
                            );
                          })}

                        {hoursWorkedData &&
                          hoursWorkedData.shiftWiseHoursData &&
                          hoursWorkedData.shiftWiseHoursData.map((shifts) => {
                            if (shifts.shiftId == value.shiftId) {
                              return (
                                <td colSpan={1}>
                                  {shifts &&
                                    shifts.totalHours &&
                                    shifts.totalHours}
                                </td>
                              );
                            }
                          })}
                      </tr>
                    )}
                  </>
                );
              })}

            <tr>
              <td colSpan={3} className="tableborder"></td>
              <td colSpan={2}>Total Calculated</td>
              {byUniqueDate &&
                byUniqueDate &&
                byUniqueDate.map((weeks) => (
                  <td className="p-0">
                    {weeks &&
                      weeks.days &&
                      weeks.days.map((day) => {
                        let flag = false;
                        let calculatedHours = null;

                        hoursWorkedData &&
                          hoursWorkedData.dateWiseHoursData &&
                          hoursWorkedData.dateWiseHoursData.map((dateData) => {
                            if (dateData.date == day.weekDates) {
                              flag = true;
                              calculatedHours = dateData.totalCalculatedHours;
                            }
                          });
                        return (
                          <td className="totaltd" colSpan={1}>
                            {flag ? calculatedHours : 0}
                          </td>
                        );
                      })}
                  </td>
                ))}
              <td colSpan={1}>
                {hoursWorkedData &&
                  hoursWorkedData.dateWiseHoursData &&
                  hoursWorkedData.dateWiseHoursData.reduce(function (
                    total,
                    obj
                  ) {
                    let a = obj.totalCalculatedHours.split(":");
                    let b = total.split(":");
                    let x = parseInt(a[0]) + parseInt(b[0]);
                    let y = parseInt(a[1]) + parseInt(b[1]);
                    if (y > 60) {
                      x = x + Math.round(y / 60);
                      y = y % 60;
                    }
                    return `${x}:${y}`;
                  },
                  "0:0")}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="tableborder"></td>
              <td colSpan={2}>Required Hours</td>
              {byUniqueDate &&
                byUniqueDate &&
                byUniqueDate.map((weeks) => (
                  <td className="p-0">
                    {weeks &&
                      weeks.days &&
                      weeks.days.map((day) => {
                        let flag = false;
                        let requiredHours = null;

                        hoursWorkedData &&
                          hoursWorkedData.dateWiseHoursData &&
                          hoursWorkedData.dateWiseHoursData.map((dateData) => {
                            if (dateData.date == day.weekDates) {
                              flag = true;
                              requiredHours = dateData.totalRequiredHours;
                            }
                          });
                        return (
                          <td className="totaltd" colSpan={1}>
                            {flag ? requiredHours : 0}
                          </td>
                        );
                      })}
                  </td>
                ))}

              <td colSpan={1}>
                {hoursWorkedData &&
                  hoursWorkedData.dateWiseHoursData &&
                  hoursWorkedData.dateWiseHoursData.reduce(function (
                    total,
                    obj
                  ) {
                    return total + parseInt(obj.totalRequiredHours);
                  },
                  0)}
              </td>
            </tr>
            <tr className="border-0">
              <td colSpan={3} className="tableborder"></td>

              <td colSpan={2}>Variance</td>
              {byUniqueDate &&
                byUniqueDate &&
                byUniqueDate.map((weeks) => (
                  <td className="p-0">
                    {weeks &&
                      weeks.days &&
                      weeks.days.map((day) => {
                        let flag = false;
                        let variance = null;

                        hoursWorkedData &&
                          hoursWorkedData.dateWiseHoursData &&
                          hoursWorkedData.dateWiseHoursData.map((dateData) => {
                            if (dateData.date == day.weekDates) {
                              flag = true;
                              variance = dateData.totalVariance;
                            }
                          });
                        return (
                          <td className="totaltd" colSpan={1}>
                            {flag ? variance : 0}
                          </td>
                        );
                      })}
                  </td>
                ))}
              <td colSpan={1}>
                {hoursWorkedData &&
                  hoursWorkedData.dateWiseHoursData &&
                  hoursWorkedData.dateWiseHoursData.reduce(function (
                    total,
                    obj
                  ) {
                    return total + parseInt(obj.totalVariance);
                  },
                  0)}
              </td>
            </tr>
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ExceptionTable;
