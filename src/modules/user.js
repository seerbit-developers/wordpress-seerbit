/** @format */

import React from "react";

import { Modal, Button } from "react-bootstrap";

import "./css/module.scss";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import ConfirmAction from "./confirmAction";

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

function User({
  close,
  user_role,
  roles,
  updateUserRole,
  branches,
  business_number,
  switchUserMode,
  fixUserToBranch,
  userProcess,
  setUserProcess,
}) {
  const { user } = user_role;
  const [role, setRole] = useState(user_role.role.name);
  const [user_live, setUserLive] = useState(user.canSwitchMode);
  const [user_branch, setUserBranch] = useState(false);
  const [branch, setBranch] = useState();
  const [show_confirm, setShowConfirm] = useState(false);

  const filterById = (data, id) => {
    return data.find((x, index) => id + "" === x.businessId);
  };

  useEffect(() => {
    if (user.branchAccess && user.branchAccess[0]) {
      const branch_access = filterById(user.branchAccess, business_number);
      setUserBranch(true);
      setBranch(branch_access && branch_access.branchNumber);
    }
  }, []);

  const initProcess = async (email, first_name, last_name, role) => {
    setUserProcess(true);
    const params = {
      location: "x",
      data: {
        email,
        first_name,
        last_name,
        role,
      },
    };
    updateUserRole(params);

    if (user_branch) {
      const params = {
        location: "update_user_role",
        branchNumber: branch,
        userId: user.number,
        mode: user_branch,
      };
      fixUserToBranch(params);
    }
  };

  const switchMyUserMode = () => {
    const params = {
      userId: user.number,
      type: user.canSwitchMode
        ? "switch=false&mode=TEST"
        : "switch=true&mode=LIVE",
      location: "update_user_role",
    };
    switchUserMode(params);
    setUserLive(!user_live);
    setShowConfirm(false);
  };

  return (
    <div>
      <Modal centered show={true} onHide={close}>
        <Modal.Header className="border-none pb-0">
          <Modal.Title className="font-20">Manage User Access</Modal.Title>
          <button type="button" className="close font-24" onClick={close}>
            <span>×</span>
            <span className="sr-only">Close</span>
          </button>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <form
            className="w-100 row mx-0"
            onSubmit={(e) => {
              e.preventDefault();
              initProcess(user.email, user.first_name, user.last_name, role);
              setUserProcess(true);
            }}
          >
            <div className="form-group col-md-6 pr-1">
              <label className="font-12">First Name</label>
              <input
                className="form-control mh-40 bg-white font-14"
                type="text"
                disabled={true}
                value={user.first_name}
              />
            </div>
            <div className="form-group col-md-6 pl-1">
              <label className="font-12">Last Name</label>
              <input
                className="form-control mh-40 bg-white font-14"
                type="text"
                disabled={true}
                value={user.last_name}
              />
            </div>
            <div className="form-group col-md-12 ">
              <label className="font-12">Role</label>
              <select
                className="form-control h-40px font-14"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option selected>--SELECT ROLE--</option>
                {roles === undefined || roles.length === undefined
                  ? null
                  : roles.map((role, key) => (
                      <option key={key} value={role.name}>
                        {role.name}
                      </option>
                    ))}
              </select>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-0 form-inline font-14">
                <label className="form-label mx-2">Assign to Live</label>{" "}
                <div className="form-group">
                  <input
                    type="checkbox"
                    className="form-control  mr-3"
                    checked={user_live}
                    onChange={(e) => {
                      setShowConfirm(true);
                    }}
                  />
                </div>
              </div>
              <div className="form-group mb-0 form-inline font-14">
                <label className="form-label  mx-2">Assign to branch</label>{" "}
                <div className="form-group">
                  <input
                    type="checkbox"
                    className="form-control  mr-3"
                    checked={user_branch}
                    onChange={(e) => {
                      setUserBranch(!user_branch);
                    }}
                  />
                </div>
              </div>
            </div>
            {user_branch && (
              <div className="form-group col-md-6">
                <label className="font-12">Select a branch</label>
                <select
                  className="form-control h-40px"
                  name="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  <option selected>--SELECT BRANCH--</option>
                  {!branches
                    ? null
                    : branches.map((branch, key) => (
                        <option key={key} value={branch.branchNumber}>
                          {branch.branchName}
                        </option>
                      ))}
                </select>
              </div>
            )}
            <div className="form-group col-md-12 ">
              <div className="form-group mh-40">
                <Button
                  variant="xdh"
                  size="lg"
                  block
                  height={"50px"}
                  className="brand-btn"
                  type="submit"
                  disabled={userProcess}
                >
                  {userProcess && (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      spin
                      className="font-20"
                    />
                  )}
                  {!userProcess && `Save Change`}
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
        {/* <Success showSuccess={openRefund} close={() => setRefund(false)} /> */}
      </Modal>
      <ConfirmAction
        show={show_confirm}
        title="Switch User Mode"
        message={`You are about to grant ${user.first_name} ${user.last_name} ${
          user_live ? "TEST" : "LIVE"
        } permission`}
        handler={(e) => switchMyUserMode()}
        close={setShowConfirm}
      />
    </div>
  );
}

export default User;
