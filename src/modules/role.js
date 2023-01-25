/** @format */

import React from "react";

import { Modal, Button } from "react-bootstrap";
import { MultiSelect } from "primereact/multiselect";

import verify from "../utils/strings/verify";
import validate from "../utils/strings/validate";

import "./css/module.scss";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

function Role({
  close,
  role,
  system_permissions,
  updateRole,
  addRole,
  roleProcess,
  setRoleProcess,
}) {
  const permissions = system_permissions;
  const type = role.name ? "Update" : "Create";
  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description);
  const [permission, setPermission] = useState(role.can);
  const [namePass, setNamePass] = useState(true);
  const [permissionPass, setPermissionPass] = useState(true);

  const toObject = (array) =>
    array.map(
      (item) => ({
        value: item,
        label: item.replace(/_/g, " "),
      }),
      {}
    );

  const handleName = (e) => {
    var thenum = e.target.value.match(RegExp(verify.business_name, "i"), "");
    if (thenum !== null) {
      setName(thenum[0]);
      setNamePass(RegExp(validate.business_name, "i").test(thenum[0]));
    }
  };

  const initProcess = async (name, description, permission) => {
    if (!namePass) {
      setNamePass(false);
      setRoleProcess(false);
    } else if (!permissionPass) {
      setPermissionPass(false);
      setRoleProcess(false);
    } else {
      setNamePass(true);
      setPermissionPass(true);
      const params = {
        data: {
          name,
          description,
          permission,
        },
        id: role.id,
        location: "update_role",
      };
      if (type === "Create") addRole(params);
      else updateRole(params);
    }
  };
  return (
    <Modal onHide={close} show={true} centered>
      <Modal.Header className="border-none pb-0">
      <Modal.Title className="font-20 text-dark pb-3">
          <div className="p-2 px-3 text-bold">
            <strong>Role</strong>
          </div>
        </Modal.Title>
        <button type="button" className="close font-24" onClick={close}>
          <span>×</span>
          <span className="sr-only">Close</span>
        </button>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <form
          className="w-100"
          onSubmit={(e) => {
            e.preventDefault();
            initProcess(name, description, permission);
            setRoleProcess(true);
          }}
        >
          <div className="form-group col-md-12 ">
            <label className="font-12">User Role</label>
            <input
              className="form-control mh-40 bg-white font-14"
              type="text"
              name="role_name"
              value={name}
              onChange={(e) => handleName(e)}
              value={name}
            />
            {!namePass && name && <Error>enter a valid role name</Error>}
          </div>
          <div className=" form-group col-md-12">
            <label className="font-12 ">Description</label>
            <textarea
              type="text"
              name="description"
              className="form-control font-12"
              rows="3"
              style={{ resize: "none" }}
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>
          <div className="form-group col-md-12 role">
            <label className="font-12">Permissions</label>
            <MultiSelect
              value={permission}
              options={toObject(permissions)}
              onChange={(e) => setPermission(e.value)}
              maxSelectedLabels={2}
              className="w-100"
            />
          </div>
          {!permissionPass && (
            <Error>select at least one permission for role</Error>
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
                disabled={roleProcess}
              >
                {roleProcess && (
                  <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
                )}
                {!roleProcess && `Save`}
              </Button>
            </div>
          </div>
        </form>
      </Modal.Body>
      {/* <Success showSuccess={openRefund} close={() => setRefund(false)} /> */}
    </Modal>
  );
}

export default Role;
