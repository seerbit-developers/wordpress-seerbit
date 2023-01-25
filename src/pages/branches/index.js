/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  getBranches,
  getBranchSummary,
  addBranch,
  updateBranch,
  assignStaticAccNumber,
  clearState,
} from "../../actions/postActions";
import cogoToast from "cogo-toast";
import { Can } from "../../modules/Can";
import { isEmpty } from "lodash";
import { CSVLink } from "react-csv";
import { Dropdown } from "primereact/dropdown";
import Branch from "../../modules/branch";
import Table from "../../utils/analytics/table";
import Details from "../../utils/analytics/branch_details";
import Pen from "../../assets/images/svg/pen.svg";
import "./css/branch.scss";
import styled from "styled-components";
import Copy from "../../assets/images/svg/copy.svg";
import Button from "../../components/button";
import {alertError, alertSuccess} from "../../modules/alert";
import {Loader} from "semantic-ui-react";
const Gap = styled.div`
  padding-bottom: 2em;
  padding-top: 1em;
`;
const RightComponent = styled.div`
  float: right;
`;

export function BusinessBranchPage(props) {
  const [perPage, setPerPage] = useState(25);
  const [branchProcessing, setBranchProcessing] = useState(false);
  const [rows, setRows] = useState(0);
  const [type, setType] = useState("Create");
  const [branch, setBranch] = useState();
  const [show_details, setShowDetails] = useState(false);
  const [show_branch, setShowBranch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssignProcessing] = useState(false);
  const [id, setId] = useState()

  const [expt, setExport] = useState();
  const exports = [
    {
      text: "Export to Excel",
      value: 1,
      label: 1,
    }
  ];

  function formatNumber(num) {
    return Number(num)
      .toFixed(2)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const branchSetter = (e, data) => {
    setType(e);
    setBranch(data);
    setShowBranch(true);
  };

  const changePage = (from, range = perPage) => {
    setPerPage(range);
    props.getBranches({ start: from, size: range });
  };

  useEffect(() => {
    props.getBranches();
    props.getBranchSummary();
  }, []);

  useEffect(() => {
    let rowCount = 0;
    if (props.branch_summary && props.branch_summary.payload) {
      for (const data of props.branch_summary.payload) {
        rowCount += parseInt(data.successCount);
      }
      setRows(rowCount);
    }
    if (props.branch && props.location === "new_branch") {
      setBranchProcessing(false);
      setShowBranch(false);
      setShowDetails(false);
      changePage(1);
      alertSuccess(props.branch.message ? props.branch.message : "Branch Created successfully");
    }
    if (props.branch && props.location === "edit_branch") {
      setBranchProcessing(false);
      setShowBranch(false);
      setShowDetails(false);
      changePage(1);
      alertSuccess(props.branch.message ? props.branch.message : "Branch Updated successfully");
    }
    if (
      props.error_details &&
      props.error_details.error_source === "new_branch" || props.error_details && props.error_details.error_source === "edit_branch"
    ) {
      setBranchProcessing(false);
      setShowDetails(false);
      alertError(props.error_details.message ? props.error_details.message : "A Error occurred saving branch. Kindly try again.");
    }

    if (props.branch_account_number && props.location === "branch_account_number") {
      setAssignProcessing(false);
      setId();
      props.getBranches();
      props.getBranchSummary();
      alertSuccess(
        "Static account number was successfully assigned.");
      props.clearState({ branch_account_number: null });
    }

    if (
      props.error_details &&
      props.error_details.error_source === "branch_account_number"
    ) {
      setAssignProcessing(false);
      setId();
      alertError(props.error_details.message);
      props.clearState({ error_details: null });
    }
  }, [
    props.branches,
    props.branch_summary,
    props.location,
    props.error_details,
    props.branch,
    props.branch_account_number

  ]);

  useEffect(() => {
    setLoading(true);
    if (!isEmpty(props.branches)) setLoading(false);
    if (!isEmpty(props.error_details)) setLoading(false);
  }, [props.branches, props.error_details]);


  const getAccountNumber = (data) => {
    setId(data.branchNumber)
    props.assignStaticAccNumber({
      branchId: data.branchNumber,
      location: "branch_account_number",
      data: {
        emailAddress: data.branchEmailAddress,
        sendSms: true
      }
    })
    setAssignProcessing(true);
  }

  const headers = [
    { label: "Branch Name", key: "branchName" },
    { label: "Branch Reference", key: "branchReferenceNumber" },
    { label: "Branch Phone Number", key: "branchPhoneNo" },
    { label: "Contact Person", key: "branchManager" },
    { label: "Branch Address", key: "branchLocationAddress" },
  ];

  const downloadTemplate = (option) => {
    if (!option.value) {
      return option.text;
    } else {
      if (option.value === 1)
        return (
          <div className="my-1 font-12 font-weight-bold">
            <CSVLink
              data={(props.branches && props.branches.payload) || []}
              headers={headers}
              filename={`${new Date().getTime()}-branches.csv`}
              className=""
            >
              <span style={{ color: "#333333" }}>{option.text}</span>
            </CSVLink>
          </div>
        );
    }
  };

  const handleCopy = (e, props) => {
    e.preventDefault();
    cogoToast.success(`Copied Successfully`, { position: "top-right" });
    const textField = document.createElement("textarea");
    textField.innerText = props;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  const onRowClick = () => { };
  return (
    <>
      {!show_details && (
          <div className="page-container py-5">
            <div className="py-3">
          <div>
            <div className="font-medium pb-3 font-20 text-black">
              Branches
              {/*<Counter>*/}
              {/*  TOTAL{" "}*/}
              {/*  {props.branches && props.branches.rowCount*/}
              {/*    ? props.branches.rowCount*/}
              {/*    : 0}*/}
              {/*</Counter>*/}
            </div>
            <Gap>
              <div className="d-flex justify-content-between">
                  <div>
                    <Can access="ADD_BUSINESS_BRANCH">
                      <Button
                        size="sm"
                        onClick={(e) => branchSetter("Create", {})}
                      >
                        Create a branch
                      </Button>
                    </Can>
                  </div>
                  <div>
                    <RightComponent>
                      <div className="row">
                        <Can access="EXPORT_MERCHANT_REPORT">
                          <span className="font-12 font-light px-3 export_data">
                            <Dropdown
                              optionLabel="text"
                              value={expt}
                              options={exports}
                              onChange={(e) => {
                                setExport(e.target.value);
                              }}
                              itemTemplate={downloadTemplate}
                              placeholder="Export Data"
                              className="font-12 text-left w-200px sbt-border-success py-2"
                            />
                          </span>
                        </Can>
                      </div>
                    </RightComponent>
                  </div>
              </div>
            </Gap>

            <Table
              loading={loading}
              data={(props.branches && props.branches.payload) || []}
              totalRecords={(props.branches && props.branches.rowCount) || 0}
              currentpage={
                (props.branches && props.branches.currentPage) || "0"
              }
              changePage={(page) => {
                changePage(page);
              }}
              perPage={perPage}
              setRange={(len) => changePage(1, len)}
              header={[
                {
                  name: "Branch Name",
                  pointer: "branchName",
                  func: (props) => <span className="">{props}</span>,
                },
                {
                  name: "Reference",
                  pointer: "",
                  func: (props) => (
                    <span className="row p-0 m-0">
                      <div
                        onClick={(e) => {
                          setBranch(props);
                          setShowDetails(true);
                        }}
                        className="cut-text seerbit-color cursor-pointer"
                      >
                        {props.branchRef ? props.branchRef : "Not Available"}
                      </div>
                      <img
                        src={Copy}
                        width="15"
                        height="15"
                        className="cursor-pointer"
                        onClick={(e) => {
                          handleCopy(e, props.branchRef);
                        }}
                      />
                    </span>
                  ),
                  copy: true,
                },
                {
                  name: "USSD Code",
                  pointer: "",
                  func: (props) => (
                    <span className="row p-0 m-0">
                      <div className="cut-text-1 cursor-pointer" >
                        {props.branchUSSDNumber ? props.branchUSSDNumber : "Not Applicable"}
                      </div>
                      <img
                        src={Copy}
                        width="15"
                        height="15"
                        className="cursor-pointer"
                        onClick={(e) => {
                          handleCopy(e, props.branchUSSDNumber);
                        }}
                      />
                    </span>
                  ),
                  copy: true,
                },
                {
                  name: "Account Number",
                  pointer: "",
                  func: (props) => (
                    <span className="row p-0 m-0">
                      {
                        !isEmpty(props.branchStaticAccountNumber)
                          ? <div className="cut-text">{props.branchStaticAccountNumber}</div>
                          : <Button
                            type="secondary"
                            size="xs"
                            onClick={() => getAccountNumber(props)}
                            disabled={assigning}
                          >
                            {
                              assigning && id === props.branchNumber ?
                                  <Loader active inline='centered' size='mini'/>
                                : "Request"
                            }
                          </Button>
                      }
                      {props.branchStaticAccountNumber && <img
                        src={Copy}
                        width="15"
                        height="15"
                        className="cursor-pointer"
                        onClick={(e) => {
                          handleCopy(e, props);
                        }}
                      />}
                    </span>
                  ),
                },
                {
                  name: "Reference",
                  pointer: "",
                  func: (props) => (
                    <span className="row p-0 m-0">
                      <div
                        onClick={(e) => {
                          setBranch(props);
                          setShowDetails(true);
                        }}
                        className="cut-text seerbit-color cursor-pointer"
                      >
                        {props.branchReferenceNumber
                          ? props.branchReferenceNumber
                          : "Not Applicable"}
                      </div>
                      <img
                        src={Copy}
                        width="15"
                        height="15"
                        className="cursor-pointer"
                        onClick={(e) => {
                          handleCopy(e, props.branchReferenceNumber);
                        }}
                      />
                    </span>
                  ),
                  copy: true,
                },
                {
                  name: "Contact Person",
                  pointer: "branchManager",
                },
                {
                  name: "Phone Number",
                  pointer: "branchPhoneNo",
                },

                {
                  name: "Action",
                  pointer: "",
                  func: (props) => (
                    <div className="number pl-4 cursor-pointer">
                      <img
                        src={Pen}
                        style={{ height: "10px", width: "10px" }}
                        onClick={(e) => {
                          branchSetter("Edit", props);
                        }}
                      />{" "}
                    </div>
                  ),
                },
              ]}
              onRowClick={onRowClick}
            />
          </div>

            <Branch
              isOpen={show_branch}
              branch={branch}
              type={type}
              close={() => setShowBranch(false)}
              addBranch={(params) => props.addBranch(params)}
              updateBranch={(params) => props.updateBranch(params)}
              branchProcessing={branchProcessing}
              setBranchProcessing={setBranchProcessing}
              business_details={props.business_details}
            />

        </div>
        </div>
      )}
      {show_details && (
        <div className="">
          <Details
            props={branch}
            close={() => setShowDetails(false)}
            clear={() =>
              props.clearState({ branch_transactions: null })
            }
          />
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  branches: state.data.branches,
  branch_summary: state.data.branch_summary,
  business_details: state.data.business_details,
  error_details: state.data.error_details,
  location: state.data.location,
  branch: state.data.branch,
  branch_transactions: state.data.branch_transactions,
  branch_account_number: state.data.branch_account_number
});

export default connect(mapStateToProps, {
  getBranches,
  getBranchSummary,
  addBranch,
  updateBranch,
  assignStaticAccNumber,
  clearState,
})(BusinessBranchPage);
