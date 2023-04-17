import React from "react";
import "./css/app-table.scss";
import NoDataPlaceHolder from "../../assets/images/svg/no-data";
import PaginatorEngine from "./components/paginatorEngine";
import PropTypes from 'prop-types'

const Index = (props) => {
  const { hideHeader,fixedLayout,FooterComponent } = props;

  const renderCell = (cell, data, i) => {
    if (cell.hasOwnProperty("cell")) {
      return cell.cell(props.data[i]);
    } else if (cell.hasOwnProperty("selector")) {
      return data[cell.selector] !== undefined || data[cell.selector] !== null
        ? data[cell.selector]
        : "NA";
    }
  };
  return (
    <div>
      <div
        className={`app-table ${fixedLayout ? '' : 'not-fixed'} app-table-container ${
          props.className ? props.className : ""
        } ${props.scroll ? "scroll-table w-100" : ""}`}
      >
        {props.loading ? (
          <div className="h-100 d-flex justify-content-center align-items-center">
            <div
              className="w-100"
              // style={{
              //     width: "200px",
              //     margin: "10% auto",
              //     height: "100%",
              // }}
            >

            </div>
          </div>
        ) : null}
        <table
          className={`table-border-header-off ${
            props.loading
              ? "component-fade--out-half"
              : "component-fade--in-half"
          }`}
          style={props.scroll ? { width: "1290px" } : {}}
        >
          {props.data || props.columns ? (
            <React.Fragment>
              {hideHeader !== undefined ||
                (hideHeader !== false && (
                  <thead>
                    <tr className={props.rowClass} style={props.headerStyle}>
                      {props.columns
                        ? props.columns.map((h, i) => (
                              h.hide ? null :
                            <th className="b-0" key={i} style={h.style}>
                              { (typeof h.name === 'string') ? h.name
                                  : (typeof h.name === 'function') ? h.name() : ''}
                            </th>
                          ))
                        : null}
                    </tr>
                  </thead>
                ))}
              {/* <img src={ScrollIcon} className="mobile-table-scroll-icon" /> */}
              <tbody
                className={`${
                  props.loading
                    ? "component-fade--out-half"
                    : "component-fade--in-half"
                }`}
              >
                {props.data && props.columns
                  ? Array.isArray(props.data)
                    ? props.data.length > 0
                      ? props.data.map((data, i) => (
                          <tr
                            key={i}
                            style={{ ...props.rowStyle }}
                            className={props.rowClass}
                            onClick={() =>
                              props.onClickRow && props.onClickRow(data)
                            }
                          >
                            {props.columns.map((col, coli) => (
                              col.hide ? null : <td style={{ ...col.cellStyle, ...col.styles }} key={coli}>
                                {renderCell(col, data, i)}
                              </td>
                            ))}
                          </tr>
                        ))
                      : null
                    : null
                  : null}
              </tbody>
              {FooterComponent ? FooterComponent : null}
            </React.Fragment>
          ) : (
            <tr className="position-relative">
              <div
                className="text-center position-absolute"
                style={{
                  left: 0,
                  right: 0,
                  top: "60%",
                  margin: "auto",
                }}
              >
                Table Not Configured
              </div>
            </tr>
          )}
        </table>

        {Array.isArray(props.data) ? (
          props.data.length < 1 ? (
            <div className="h-100">
              <div
                className="text-center"
                style={{
                  width: "200px",
                  margin: "10% auto",
                  height: "100%",
                }}
              >
                {props.loading ? (
                  <h4>Loading...</h4>
                ) : (
                  <React.Fragment>
                    <NoDataPlaceHolder />
                    <div className="my-3 text-muted">
                      No Data in this time frame
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          ) : null
        ) : null}
      </div>
      {!props.paginate ? null : Array.isArray(props.data) &&
        props.data.length > 0 ? (
        <PaginatorEngine
          disabled={props.loading}
          perPage={props.perPage}
          setPerPage={props.setPerPage}
          totalPages={parseInt(props.totalPages)}
          currentPage={props.currentPage}
          changePage={props.changePage}
          changePageFromPerPage={props.changePageFromPerPage}
        />
      ) : null}
    </div>
  );
};

Index.propTypes = {
  fixedLayout : PropTypes.bool
}
Index.defaultProps = {
  fixedLayout: true
};
export default Index;
