/**
 * BankAccount
 *
 * @format
 */

import React, {  useState, useEffect } from "react";

import verify from "../../../utils/strings/verify";
import validate from "../../../utils/strings/validate";
import { connect } from "react-redux";
import { Can } from "../../../modules/Can";
import { setErrorLog, clearState } from "../../../actions/postActions";
import { MultiSelect } from "primereact/multiselect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSpinner,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import moment from "moment";

import Table from "utils/analytics/table";

import Pen from "assets/images/svg/pen.svg";
import cogoToast from "cogo-toast";
import styled from "styled-components";
import "./css/user_management.scss";
import Role from "modules/role";
import User from "modules/user";
import RoleDetails from "utils/analytics/role_details";

const NavMenuItem = styled.div`
  padding: 1.5em;
  font-size: 1.1em;
  color: #676767 !important;
`;

const CloseTag = styled.div`
  font-size: 0.9em;
  color: #676767 !important;
  display: flex;
  cursor: pointer;
  & svg {
    font-size: 1.2em;
  }
`;
const Gap = styled.div`
  padding-top: 1em;
`;
const DataWrapper = styled.div`
  height: fit-content;
  width: 500px;
  border: 1px solid #dfe0eb;
  border-radius: 5px;
`;

const Wrap = styled.div`
  margin-bottom: 0.5em;
`;

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

const onRowClick = () => { };
export function UserManagement({
  users,
  inviteUser,
  roles,
  user_permissions,
  updateRole,
  addRole,
  updateUserRole,
  branches,
  fixUserToBranch,
  business_number,
  switchUserMode,
  roleProcess,
  setRoleProcess,
  userProcess,
  setUserProcess,
  inviteProcess,
  setInviteProcess,
  user_details,
  primary_user,
  invite_user,
  clearState,
  location,
  loading,
}) {
  const [toggleUser, setToggleUser] = useState(false);
  const [edit_user, setEditUser] = useState(false);
  const [user, setUser] = useState();

  return (
    <div className="sbt-user-management">
      {!toggleUser && (
        <NavMenuItem className="border br-normal py-5">
          <div classNam="container-fluid">
            <div className="row">
              <div className="font-medium pb-3 font-20 text-black col-md-6 ">
                System User Management
              </div>
              <div className="col-md-6 ">
                <Can access="INVITE_USER">
                  <Button
                    variant="xdh"
                    height={"50px"}
                    className="brand-btn float-right "
                    onClick={() => setToggleUser(!toggleUser)}
                  >
                    Invite Users
                  </Button>{" "}
                </Can>
                <Can access="APPROVE_MERCHANT_PROFILE_UPDATE">
                  <Button
                    variant="xdh"
                    height={"50px"}
                    className="sbt-outline-btn mr-2 float-right font-14 font-normal"
                    onClick={() => setToggleUser(!toggleUser)}
                  >
                    Manage Roles
                  </Button>
                </Can>
              </div>
            </div>
          </div>

          <Gap>
            <Table
              loading={loading}
              data={users}
              nopagination={true}
              header={[
                {
                  name: "Name",
                  pointer: "user.name",
                },
                {
                  name: "Email Address",
                  pointer: "user.email",
                },
                {
                  name: "Phone Number",
                  pointer: "user.phone_number",
                  copy: true,
                  func: (props) => (
                    <span>{props !== null ? props : "Not Available"}</span>
                  ),
                },
                {
                  name: "User Role",
                  pointer: "role.name",
                  func: (props) => (
                    <span className="seerbit-color">
                      {props.replace("_", " ")}
                    </span>
                  ),
                },
                {
                  name: "Last Login",
                  pointer: "user.last_login",
                  func: (props) => (
                    <span className="">{moment(props).fromNow()}</span>
                  ),
                },
                {
                  name: "Action",
                  pointer: "",
                  func: (prop) => (
                    <Can access="ASSIGN_PERMISSION">
                      {prop.user.email !== user_details.email &&
                        primary_user.email !== prop.user.email && (
                          <div
                            className="sbt-deep-color pl-1"
                            onClick={(e) => {
                              setEditUser(true);
                              setUser(prop);
                            }}
                          >
                            <img
                              src={Pen}
                              style={{ height: "10px", width: "10px" }}
                            />{" "}
                            <span className="font-15 cursor-pointer">edit</span>
                          </div>
                        )}
                    </Can>
                  ),
                },
              ]}
              onRowClick={onRowClick}
            />
          </Gap>
        </NavMenuItem>
      )}{" "}
      {edit_user && (
        <User
          user_permissions={user_permissions}
          updateUserRole={updateUserRole}
          roles={roles}
          user_role={user}
          close={(e) => setEditUser(false)}
          branches={branches}
          fixUserToBranch={fixUserToBranch}
          business_number={business_number}
          switchUserMode={switchUserMode}
          userProcess={userProcess}
          setUserProcess={setUserProcess}
        />
      )}
      {toggleUser && (
        <ManageUser
          close={() => {
            setToggleUser(!toggleUser);
            clearState({ invite_user: null })
          }}
          inviteUser={inviteUser}
          roles={roles}
          user_permissions={user_permissions}
          updateRole={updateRole}
          addRole={addRole}
          userProcess={userProcess}
          setUserProcess={setUserProcess}
          roleProcess={roleProcess}
          setRoleProcess={setRoleProcess}
          inviteProcess={inviteProcess}
          setInviteProcess={setInviteProcess}
          invite_user={invite_user}
          clearState={clearState}
          location={location}
        />
      )}
    </div>
  );
}

function ManageUser({
  close,
  inviteUser,
  roles,
  user_permissions,
  updateRole,
  addRole,
  roleProcess,
  setRoleProcess,
  inviteProcess,
  setInviteProcess,
  invite_user,
  clearState,
  location,
}) {
  return (
    <>
      <div>
        <CloseTag onClick={close}>
          <FontAwesomeIcon icon={faChevronLeft} className="mt-1" />{" "}
          <span className="ml-1 mt-1">return to users</span>
        </CloseTag>

        <div className="d-flex py-2">
          <Customizer
            inviteUser={inviteUser}
            roles={roles}
            inviteProcess={inviteProcess}
            setInviteProcess={setInviteProcess}
            invite_user={invite_user}
            clearState={clearState}
            location={location}
          />
          <Template
            roles={roles}
            user_permissions={user_permissions}
            updateRole={updateRole}
            addRole={addRole}
            roleProcess={roleProcess}
            setRoleProcess={setRoleProcess}
          />
        </div>
      </div>
    </>
  );
}

const Template = ({
  roles,
  user_permissions,
  updateRole,
  addRole,
  roleProcess,
  setRoleProcess,
}) => {
  const [showRole, setShowRole] = useState(false);
  const [showDetails, setDetails] = useState(false);
  const [role, setRole] = useState(false);
  return (
    <DataWrapper className="bg-white p-3 sbt-setup ml-4">
      <Wrap>
        <div className="font-medium font-16 pb-3">Permission</div>
      </Wrap>
      <div className="row">
        {roles &&
          roles.map((data, key) => (
            <div className="form-group col-md-12" key={key}>
              <div className="font-14">
                <div className="black font-12">
                  <span
                    onClick={() => {
                      setRole(data);
                      setDetails(true);
                    }}
                    className="cursor-pointer"
                  >
                    {data.name}
                  </span>
                  <img
                    src={Pen}
                    style={{ height: "10px", width: "10px" }}
                    className="ml-2 mb-1 cursor-pointer"
                    onClick={() => {
                      setRole(data);
                      setShowRole(true);
                    }}
                  />
                </div>
                <div className="text-muted font-13">{data.description}</div>
              </div>{" "}
            </div>
          ))}

        <div className="form-group mh-40 mt-3 col-12">
          <Can access="CREATE_ROLE">
            <Button
              variant="xdh"
              size="lg"
              block
              height={"40px"}
              className="brand-btn"
              onClick={() => {
                setRole({});
                setShowRole(true);
              }}
            >
              Create Role
            </Button>
          </Can>
        </div>
      </div>
      {showRole && (
        <Role
          close={() => setShowRole(false)}
          role={role}
          system_permissions={user_permissions}
          updateRole={updateRole}
          addRole={addRole}
          roleProcess={roleProcess}
          setRoleProcess={setRoleProcess}
        />
      )}
      <RoleDetails
        showDetails={showDetails}
        close={() => setDetails(false)}
        role={role}
      />
    </DataWrapper>
  );
};

const Customizer = ({
  inviteUser,
  roles,
  inviteProcess,
  setInviteProcess,
  invite_user,
  clearState,
  location,
}) => {
  const [invitee_email, setEmail] = useState();
  const [invitee_firstname, setFirstName] = useState();
  const [role, setRole] = useState(roles && roles.length > 0 && roles[0].name);

  const [emailPass, setEmailPass] = useState(false);
  const [namePass, setNamePass] = useState(false);
  const [rolePass, setRolePass] = useState(true);

  const handleEmail = (e) => {
    var thenum = e.target.value.match(RegExp(verify.email, "i"), "");
    if (thenum !== null) {
      setEmail(thenum[0]);
      setEmailPass(RegExp(validate.email, "i").test(thenum[0]));
    }
  };

  const handleName = (e) => {
    var thenum = e.target.value.match(RegExp(verify.name, "i"), "");
    if (thenum !== null) {
      setFirstName(thenum[0]);
      setNamePass(RegExp(validate.name, "i").test(thenum[0]));
    }
  };

  const initProcess = async (invitee_email, invitee_firstname, role) => {
    clearState({ invite_user: null });
    setInviteProcess(true);
    role = role.replace(/ /g, "_");
    if (!emailPass) {
      setEmailPass(false);
      setInviteProcess(false);
    } else if (!namePass) {
      setNamePass(false);
      setInviteProcess(false);
    } else {
      setEmailPass(true);
      setNamePass(true);
      const params = {
        data: {
          invitee_email,
          invitee_firstname,
          role,
        },
        location: "invite_user",
      };
      inviteUser(params);
    }
  };

  useEffect(() => {
    if (invite_user && location === "invite_user") {
      cogoToast.success(invite_user.message, {
        position: "top-right",
      });
    }
    setInviteProcess(false);
  }, [invite_user]);

  return (
    <DataWrapper className="bg-white px-4 pb-2 pt-4 sbt-setup ">
      <Wrap>
        <div className="font-medium text-black">Add User</div>
      </Wrap>
      <form
        className="w-100"
        onSubmit={(e) => {
          e.preventDefault();
          initProcess(invitee_email, invitee_firstname, role);
        }}
      >
        <div className="row">
          <div className="form-group col-md-12">
            <label className="font-12">User Full Name</label>
            <input
              className="form-control mh-40 "
              type="text"
              name="bank_name"
              onChange={(e) => handleName(e)}
              value={invitee_firstname}
            />
            {!namePass && invitee_firstname && (
              <Error>enter a valid name</Error>
            )}
          </div>

          <div className="form-group  col-md-12">
            <label className="font-12">User Email</label>
            <input
              className="form-control mh-40 "
              type="text"
              name="invitee_email"
              onChange={(e) => handleEmail(e)}
              value={invitee_email}
            />
            {!emailPass && invitee_email && (
              <Error>enter a valid email address</Error>
            )}
          </div>

          <div className="form-group col-12">
            <label className="font-12">Select Role</label>
            <select
              className="form-control h-40px"
              onChange={(e) => setRole(e.target.value)}
            >
              <option selected>--SELECT ROLE--</option>
              {roles &&
                roles.map((item, index) => (
                  <option key={index} data-role={item.name}>
                    {item.name.replace(/_/g, " ")}
                  </option>
                ))}
            </select>
            {!rolePass && role && <Error>Select a role</Error>}
            {/* <MultiSelect
              optionLabel="name"
              optionValue="code"
              value={this.state.cities}
              options={roles}
              onChange={(e) => setRoles(e.value)}
            /> */}
            {/* <input
              className="form-control mh-40 "
              type="text"
              name="account_name"
            /> */}
          </div>
          <Can access="CREATE_ROLE">
            <div className="form-group mb-2 col-12">
              <Button
                variant="xdh"
                size="lg"
                block
                height={"40px"}
                className="brand-btn"
                type="submit"
                disabled={inviteProcess}
              >
                {inviteProcess && (
                  <FontAwesomeIcon icon={faSpinner} spin className="font-20" />
                )}
                Send Invite
              </Button>
            </div>
          </Can>
        </div>
      </form>
    </DataWrapper>
  );
};
export { Template, ManageUser };

const mapStateToProps = (state) => ({
  invite_user: state.data.invite_user,
  location: state.data.location,
});

export default connect(mapStateToProps, {
  setErrorLog,
  clearState,
})(UserManagement);
