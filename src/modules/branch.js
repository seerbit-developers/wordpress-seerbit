/** @format */

import React, { useState } from "react";

import {Button } from "react-bootstrap";
import verify from "utils/strings/verify";
import validate from "utils/strings/validate";
import "./css/module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import AppModal from "components/app-modal";

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

function Branch({
  close,
  branch,
  type,
  addBranch,
  updateBranch,
  branchProcessing,
  setBranchProcessing,
  business_details,
    isOpen,
}) {

  const [branchPhoneNoPass, setBranchPhoneNoPass] = useState();
  const [branchEmailAddressPass, setBranchEmailAddressPass] = useState(

  );
  const [branchManagerPass, setBranchManagerPass] = useState(type === "Edit");
  const [branchReferenceNumberPass, setBranchReferenceNumberPass] = useState(

  );
  const [branchLocationAddressPass, setBranchLocationAddressPass] = useState(
    false
  );
  const [branchNamePass, setBranchNamePass] = useState(false);

  const [auto_ref, setAutoRef] = useState(false);
  const [branchPhoneNo, setBranchPhoneNo] = useState("");
  const [branchEmailAddress, setBranchEmailAddress] = useState( "");
  const [branchManager, setBranchManager] = useState("");
  const [branchReferenceNumber, setBranchReferenceNumber] = useState( "");
  const [branchLocationAddress, setBranchLocationAddress] = useState( "");
  const [branchName, setBranchName] = useState("");
  React.useEffect( ()=>{
    if (isOpen && branch){
      setBranchName(branch.branchName)
      setBranchLocationAddress(branch.branchLocationAddress)
      setBranchReferenceNumber(branch.branchReferenceNumber)
      setBranchManager(branch.branchManager)
      setBranchEmailAddress(branch.branchEmailAddress)
      setBranchPhoneNo(branch.branchPhoneNo)
      if (type === 'Edit'){
        setBranchPhoneNoPass(true)
        setBranchNamePass(true)
        setBranchLocationAddressPass(true)
        setBranchReferenceNumberPass(true)
        setBranchManagerPass(true)
        setBranchEmailAddressPass(true)
      }
    }
  }, [isOpen, branch, type])
  // business_details;
  let default_ref = (
    Math.random().toString(16).substr(2) +
    Math.random().toString(16).substr(2) +
    Math.random().toString(16).substr(2)
  ).substr(
    0,
    business_details.invoice.totalLength - business_details.invoice.billLength
  );

  const handleBranchName = (e) => {
    var thenum = e.target.value.match(RegExp(verify.name), "");
    if (thenum !== null) {
      setBranchName(thenum[0]);
      setBranchNamePass(RegExp(validate.name).test(thenum[0]));
    }
  };

  const handleBranchManager = (e) => {
    var thenum = e.target.value.match(RegExp(verify.name), "");
    if (thenum !== null) {
      setBranchManager(thenum[0]);
      setBranchManagerPass(RegExp(validate.name).test(thenum[0]));
    }
  };

  const handlePhoneNumber = (e) => {
    var thenum = e.target.value.match(RegExp(verify.number), "");
    if (thenum !== null) {
      setBranchPhoneNo(thenum[0]);
      setBranchPhoneNoPass(RegExp(validate.number).test(thenum[0]));
    }
  };
  const handleEmailAddress = (e) => {
    var thenum = e.target.value.match(RegExp(verify.email), "");
    if (thenum !== null) {
      setBranchEmailAddress(thenum[0]);
      setBranchEmailAddressPass(RegExp(validate.email).test(thenum[0]));
    }
  };

  const handleBranchReferenceNumber = (e) => {
    setBranchReferenceNumber(e.target.value);
    setBranchReferenceNumberPass(e.target.value.trim().length > 3);
  };

  const handleBranchLocationAddress = (e) => {
    setBranchLocationAddress(e.target.value);
    setBranchLocationAddressPass(e.target.value.trim().length > 10);
  };

  const initProcess = async (
    branchName,
    branchReferenceNumber,
    branchManager,
    branchLocationAddress,
    branchPhoneNo,
    branchEmailAddress
  ) => {
    setBranchProcessing(true);
    if (!branchNamePass) {
      setBranchName("");
      setBranchProcessing(false);
      setBranchNamePass(false);
    } else if (!branchReferenceNumberPass) {
      setBranchReferenceNumber("");
      setBranchProcessing(false);
      setBranchReferenceNumberPass(false);
    } else if (!branchEmailAddressPass) {
      setBranchEmailAddress("");
      setBranchProcessing(false);
      setBranchEmailAddressPass(false);
    } else if (!branchManagerPass) {
      setBranchManager("");
      setBranchProcessing(false);
      setBranchManagerPass(false);
    } else if (!branchPhoneNoPass) {
      setBranchPhoneNo("");
      setBranchProcessing(false);
      setBranchPhoneNoPass(false);
    } else if (!branchLocationAddressPass) {
      setBranchLocationAddress("");
      setBranchProcessing(false);
      setBranchLocationAddressPass(false);
    } else {
      const params = {
        location: type === "Create" ? "new_branch" : "edit_branch",
        data: {
          branchName,
          branchReferenceNumber,
          branchManager,
          branchLocationAddress,
          branchPhoneNo,
          branchEmailAddress,
        },
      };
      if (type === "Create") addBranch(params);
      else {
        params.id = branch.branchNumber;
        updateBranch(params);
      }
    }
  };

  return (

        <AppModal title={`${type} Branch`} isOpen={isOpen} close={() => close(false)}>
        <form
          className="w-100"
          onSubmit={(e) => {
            e.preventDefault();
            initProcess(
              branchName,
              branchReferenceNumber,
              branchManager,
              branchLocationAddress,
              branchPhoneNo,
              branchEmailAddress
            );
          }}
        >
          <div className="row">
            <div className="col-md-12 py-3">
              <label className="font-12">Branch Name</label>
              <input
                className="form-control mh-40 "
                type="text"
                name="name"
                onChange={(e) => handleBranchName(e)}
                value={branchName}
                disabled={branchProcessing}
              />{" "}
              {!branchNamePass && branchName !== undefined && (
                <Error>enter a valid name</Error>
              )}
            </div>
            <div className=" col-md-6 pt-2">
              <label className="font-12">Auto Reference ?</label>
              <div className="form-inline ">
                <label className="form-label font-14 mx-2">Yes</label>
                <input
                  type="checkbox"
                  className="form-control "
                  onChange={() => {
                    if (!auto_ref) {
                      setBranchReferenceNumber(default_ref);
                      setBranchReferenceNumberPass(true);
                    }
                    setAutoRef(!auto_ref);
                  }}
                  checked={auto_ref}
                  disabled={branchProcessing}
                />
                {/* <label className="form-label font-14 mx-2">No</label>
                  <input
                    type="checkbox"
                    className="form-control mr-2 "
                    onChange={() => setAutoRef(false)}
                    checked={!auto_ref}
                  /> */}
              </div>
            </div>{" "}
            <div className="form-group col-md-6 py-2 pl-md-1">
              <label className="font-12">Branch Reference</label>
              <input
                className="form-control mh-40 "
                type="text"
                name="category"
                disabled={auto_ref || branchProcessing}
                onChange={(e) => handleBranchReferenceNumber(e)}
                value={branchReferenceNumber}
              />{" "}
              {!branchReferenceNumberPass &&
                branchReferenceNumber !== undefined && (
                  <Error>
                    enter{" "}
                    {business_details.invoice.totalLength -
                      business_details.invoice.billLength}{" "}
                    digit Reference number
                  </Error>
                )}
            </div>
            <div className="form-group col-12 pb-2">
              <label className="font-12">Branch Address</label>
              <input
                className="form-control mh-40 "
                type="text"
                name="address"
                disabled={branchProcessing}
                onChange={(e) => handleBranchLocationAddress(e)}
                value={branchLocationAddress}
              />
              {!branchLocationAddressPass &&
                branchLocationAddress !== undefined && (
                  <Error>enter a valid address</Error>
                )}
            </div>
            <div className="form-group col-12 pb-2">
              <label className="font-12">Contact Person</label>
              <input
                className="form-control mh-40 "
                type="text"
                name="contact_person"
                disabled={branchProcessing}
                onChange={(e) => handleBranchManager(e)}
                value={branchManager}
              />
              {!branchManagerPass && branchManager !== undefined && (
                <Error>enter a valid name</Error>
              )}
            </div>
            <div className="form-group col-12 pb-2">
              <label className="font-12">Phone Number</label>
              <input
                className="form-control mh-40 "
                type="text"
                name="phone_number"
                disabled={branchProcessing}
                onChange={(e) => handlePhoneNumber(e)}
                value={branchPhoneNo}
              />
              {!branchPhoneNoPass && branchPhoneNo !== undefined && (
                <Error>enter a valid phone number</Error>
              )}
            </div>
            <div className="form-group col-12 pb-2">
              <label className="font-12">Email Address</label>
              <input
                className="form-control mh-40 "
                type="email"
                name="email"
                disabled={branchProcessing}
                onChange={(e) => handleEmailAddress(e)}
                value={branchEmailAddress}
              />
              {!branchEmailAddressPass && branchEmailAddress !== undefined && (
                <Error>enter a valid email</Error>
              )}
            </div>
            <div className="col-12">
              <Button
                variant="xdh"
                size="lg"
                block
                height={"40px"}
                disabled={branchProcessing}
                className="brand-btn"
                type="submit"
              >
                {branchProcessing && (
                  <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
                )}
                {!branchProcessing && `Save`}
              </Button>
            </div>
          </div>
        </form>
      {/* <Success showSuccess={openRefund} close={() => setRefund(false)} /> */}
    </AppModal>
  );
}

export default Branch;
