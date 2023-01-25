/** @format */

import React from "react";

import styled, { keyframes } from "styled-components";
import { Paginator } from "primereact/paginator";
import { Dropdown, Table } from "react-bootstrap";
import moment from "moment";
import "./css/sbt-table.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Loader from "assets/images/svg/loader.svg";
import { isEmpty } from "lodash";

const RightComponent = styled.div`
  float: right;
`;

const animateTableBody = () => keyframes`
    0% {
      opacity: 0;
      margin-top: -25;
      margin-bottom: 25;
    }
    100% {
      opacity: 1;
      margin-top: 0;
      margin-bottom: 0;
    }
`;

const TableBody = styled.tr`
  animation: ${() => animateTableBody()} 0.6s linear;
`;

function SBTTable({
  data,
  header,
  nopagination,
  loading,
  tableRow,
  className,
  perPage,
  setRange,
  currentpage,
  totalRecords,
  changePage,
  onRowClick,
  processing,
  transaction
}) {
  const quantities = [
    { key: 1, text: "10", value: 10 },
    { key: 2, text: "25", value: 25 },
    { key: 3, text: "50", value: 50 },
    { key: 1, text: "100", value: 100 },
    { key: 1, text: "200", value: 200 },
    { key: 1, text: "500", value: 500 },
  ];

  let pointers = [];
  const tableHead = (item) => {
    if (item.pointer) pointers.push(item.pointer.split("."));
    else pointers.push(item.value);
    return (
      <th
        key={item.name}
        className={transaction ? `font-15 ${item.trClassName} pb-3` : `font-15 ${item.trClassName}`}
        style={{ borderTop: "none", borderBottom: "1px solid #dee2e6" }}
      >
        {item.name}
      </th>
    );
  };

  const display = (item, point) => {
    if (!point) return "";
    else if (point.length === 1) return item[point[0]];
    else if (point.length === 2) return item[point[0]][point[1]];
    else if (point.length === 3) return item[point[0]][point[1]][point[2]];
    else if (point.length === 4)
      return item[point[0]][point[1]][point[2]][point[3]];
    else if (point.length === 5)
      return item[point[0]][point[1]][point[2]][point[3]][point[4]];
  };


  return (
    <div>
      <div className={`${className}`}>
        <Table
          basic="very"
          className={`sbt-table clear-both table-hover`}
          style={{ width: "100%", margin: "auto" }}
        >
          <thead>
            <tr>{header.map(tableHead)}</tr>
          </thead>{" "}
          {(data === undefined && data === null) ? (
            <div className="position-absolute" style={{ width: "100%" }}>
              {loading && (
                <tr className="d-flex justify-content-center">
                  <img src={Loader} width="100" height="60" />
                </tr>
              )}
              {!loading && (
                <div
                  style={{
                    color: "#6B6B6B",
                  }}
                  className="d-flex justify-content-center py-2"
                >
                  NO ACTIVITY FOR THIS PERIOD
                </div>
              )}
            </div>
          ) :
            Array.isArray(data) && data.length === 0 ? (
              <div className="position-absolute" style={{ width: "100%" }}>
                {loading && (
                  <tr className="d-flex justify-content-center">
                    <img src={Loader} width="100" height="60" />
                  </tr>
                )}
                {!loading && (
                  <div
                    style={{
                      color: "#6B6B6B",
                    }}
                    className="d-flex justify-content-center py-2"
                  >
                    NO ACTIVITY FOR THIS PERIOD
                  </div>
                )}
              </div>
            )
              : (
                <tbody>
                  {Array.isArray(data) && data.map(function (item, key) {
                    return (
                      <TableBody
                        onClick={(e) => onRowClick && onRowClick(item)}
                        key={key}
                        style={tableRow ? tableRow.style : {} || {}}
                        className="d-grid"
                      >
                        {pointers.map(function (index, key) {
                          return (
                            <td key={key} className="font-14">
                              {" "}
                              {header[key] && header[key].format
                                ? moment(display(item, index)).format(
                                  header[key].format
                                )
                                : header[key] && header[key].func
                                  ? header[key].func(
                                    index ? display(item, index) : item
                                  )
                                  : display(item, index) + "" || index}
                            </td>
                          );
                        })}
                      </TableBody>
                    );
                  })}
                </tbody>
              )}
        </Table>
      </div>
      {nopagination === undefined &&
        Number(totalRecords) > perPage &&
        !isEmpty(data) &&
        !loading && (
          <div className="container-fluid px-3">
            <div className="row">
              <div className="col-6">
                <div className="font-11 black font-light row">
                  <Dropdown>
                    <span className="pt-2 font-13 font-regular">
                      Show {perPage}{" "}
                      <Dropdown.Menu>
                        {quantities.map((data, key) => (
                          <Dropdown.Item
                            onClick={() => setRange(data.value)}
                            key={key}
                          >
                            {data.text}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>{" "}
                      per page{" "}
                    </span>
                    <Dropdown.Toggle className="px-0 mt-1" variant={"none"}>
                      <FontAwesomeIcon
                        icon={faCaretDown}
                        className="sbt-deep-color"
                      />
                    </Dropdown.Toggle>
                  </Dropdown>
                </div>
              </div>

              <div className="col-6 pr-0">
                {currentpage ? (
                  <RightComponent>
                    <Paginator
                      disabled={processing}
                      first={currentpage}
                      rows={perPage}
                      totalRecords={totalRecords}
                      onPageChange={(e) => {
                        changePage(e.page + 1);
                      }}
                      className="border-none"
                      template={" PrevPageLink PageLinks NextPageLink "}
                      rowsPerPageOptions={1}
                      pageLinkSize={5}
                    ></Paginator>
                  </RightComponent>
                ) : (
                  "NONE"
                )}{" "}
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default SBTTable;
