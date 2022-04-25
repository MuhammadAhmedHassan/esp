import React, { useState } from "react";
import { Table, Modal } from "react-bootstrap";
import { tableHeader } from "../util";
import Loaders from "../../../../shared/Loaders";
import "./style.scss";

const ExceptionTable = ({
  hoursWorkedData,
  combineByshiftLabel,
  combineByWeekData,
  isHoursTableLoading,
  combineForWeekWise,
  uniqueDateByWeekData,
  sameDateAddition,
  multipleShiftRequest,
}) => {
  const [show, setShow] = useState(false);

  const mExcHandle = (shiftId) => {
    multipleShiftRequest(shiftId);
    setShow(true);
  };

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

  console.log(
    weekdetails,
    "weekdetails\n",
    shiftWiseData,
    "shiftWiseData",
    calculatedTotalData,
    "byUniqueDate",
    byUniqueDate,
    sameDateHandle,
    "sameDateHandle"
  );

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
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Multiple Execeptions
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Exception Name</th>
                <th>Exception Color Code</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
                {/* {data.map((val)=>{
                  <tr>
                  <td>{}</td>
                  </tr>
                })} */}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {isHoursTableLoading ? (
        <Loaders />
      ) : (
        <Table bordered>
          <thead>
            <tr>
              {tableHeader.map((header, index) => (
                <th
                  className={`p-0 ${index == 6 || index == 5 || index == 0
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
                              {v &&
                                v.dayOfWeek &&
                                v.dayOfWeek.split(" ")[1].substring(0, 3)}
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
                        <td></td>
                        {value.days &&
                          value.days.map((reportDetails) => {
                            return (
                              <td colSpan={1} className="p-0">
                                {reportDetails &&
                                  reportDetails.days &&
                                  reportDetails.days.map((v) => {
                                    if (v) {
                                      return (
                                        <td
                                          className="totaltd"
                                          onClick={
                                            v.exception == "MI"
                                              ? () =>
                                                mExcHandle(
                                                  v.userShiftRecurrenceId
                                                )
                                              : () => { }
                                          }
                                          style={{
                                            fontSize: v.exceptionColourCode
                                              ? "small"
                                              : "inherit",
                                            color: v.exceptionColourCode
                                              ? "white"
                                              : "inherit",
                                            backgroundColor:
                                              v.exceptionColourCode
                                                ? v.shiftLabel ==
                                                  value.shiftLabel
                                                  ? v.exceptionColourCode
                                                  : "inherit"
                                                : "inherit",
                                          }}
                                          colSpan={1}
                                        >
                                          {v.calculatedTime
                                            ? v.shiftLabel == value.shiftLabel
                                              ? v.calculatedTime
                                              : 0
                                            : 0}
                                          {v.exception ? v.exception : null}
                                        </td>
                                      );
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
              <td colSpan={2} className="tableborder"></td>
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
              <td colSpan={2} className="tableborder"></td>
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
              <td colSpan={2} className="tableborder"></td>

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
