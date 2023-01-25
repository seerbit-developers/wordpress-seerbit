import React, { useState } from "react";
import TableDropdown from "components/table-actions-dropdown/table-dropdown";
import { getBusinessStores } from "actions/frontStoreActions";
import { connect } from 'react-redux';
import AppTable from "components/app-table";
import { dispatchUpdateProfile, getBranches, getBusinessUsers, getRoles } from "actions/postActions";
import { getBusinessUsersList,updateSingleBusinessUser } from "actions/userManagementActions";
import BadgeCircle from "components/badgeCircle";
import { Can } from "modules/Can";
import Button from "components/button";
import InviteUserModal from "./components/inviteUserModal";
import EditUserModal from "./components/editUserModal";
import { inviteUserToBusiness, switchUserDataMode, switchUserRole } from "services/userManagementService";
import {  alertSuccess, alertExceptionError, alertError } from "modules/alert";
import RolesViewModal from "./components/rolesViewModal";
import EditRoleModal from "./components/editRoleModal";
import CreateRoleModal from "./components/createRoleModal";
import {createBusinessRole,updateBusinessRole} from "services/businessService";
import UpdateUserAccountStatusModal from "./components/updateUserAccountStatusModal";
import { useTranslation } from "react-i18next";
import Badge from "components/badge";
const UserManagement = ({ getBusinessUsersList, roles, loading, business_users, getRoles, branches, getBranches,
    user_permissions,
    user_details,
    business_details}) => {
    const { t } = useTranslation();
    const [isOpenInviteUser, setIsOpenInviteUser] = useState(false);
    const [isOpenEditUser, setIsOpenEditUser] = useState(false);
    const [user, setUser] = useState(null);
    const [businessRoles, setBusinessRoles] = React.useState([]);
    const [businessBranches, setBusinessBranches] = React.useState([]);
    const [process, setProcess] = React.useState(false);
    const [processDataMode, setProcessDataMode] = React.useState(false);
    const [processBusinessDataMode, setProcessDBusinessataMode] = React.useState(false);
    const [processInvite, setProcessInvite] = React.useState(false);
    const [isOpenViewRoles, setIsOpenViewRoles] = React.useState(false);
    const [isOpenEditRole, setIsOpenEditRole] = React.useState(false);
    const [isOpenCreateRole, setIsOpenCreateRole] = React.useState(false);
    const [role, setRole] = React.useState(null);
    const [isUpdatingRole, setIsUpdatingRole] = React.useState(false);
    const [isCreatingRole, setIsCreatingRole] = React.useState(false);
    const [showAccountStatusModal, setShowAccountStatusModal] = useState(false);
    const [onSuccess, setOnSuccess] = React.useState(false);

    const onSwitchUserDataMode = (type) => {
        if(!type){
            setProcessDataMode(true);
        }else{
            setProcessDBusinessataMode(true)
        }

        switchUserDataMode(user.user.number, type).then(res => {
                setProcessDataMode(false);
                setProcessDBusinessataMode(false)
            if (res.responseCode === '00') {
                // updateSingleBusinessUser(res.payload, res.payload.number)
                setIsOpenEditUser(false);
                alertSuccess('The User\'s DATA MODE has been updated successfully')
                getBusinessUsersList()
            } else {
                alertError(res.message ? res.message : 'An Error Occurred updating the user\'s data mode. Kindly try again')
            }
        }).catch(e => {
            setProcessDataMode(false);
            setProcessDBusinessataMode(false)
            alertExceptionError(e)
        })
    }

    const onSwitchUserRole = (data) => {
        setProcess(true);
        switchUserRole(data).then(res => {
            setProcess(false);
            if (res.responseCode === '00') {
                setIsOpenEditUser(false);
                alertSuccess('User role has been updated successfully')
                getBusinessUsersList()
            } else {
                alertError(res.message ? res.message : 'An Error Occurred updating the user\'s role. Kindly try again')
            }
        }).catch(e => {
            setProcess(false);
            alertExceptionError(e)
        })
    }

    const onInvite = (data) => {
        setProcessInvite(true);
        inviteUserToBusiness(data).then(res => {
            setProcessInvite(false);
            if (res.responseCode === '00') {
                setOnSuccess(true);
                alertSuccess('Invitation Successfully Sent!');
                getBusinessUsersList();
            } else {
                alertError(res.message ? res.message : 'An Error Occurred sending the invite. Kindly try again')
            }
        }).catch(e => {
            setProcessInvite(false);
           alertExceptionError(e)
        })
    }

    const onUpdateRole = (data) => {
        setIsUpdatingRole(true);
        updateBusinessRole(data).then(res => {
            if (res.responseCode === '00') {
                alertSuccess(t('Role updated Successfully!'))
                getRoles()
                setIsOpenEditRole(false)
                setIsOpenViewRoles(false)
            } else {
                alertError(res.message ? t(res.message) : t('An Error Occurred processing request. Kindly try again'))
            }
            setIsUpdatingRole(false);
        }).catch(e => {
            setIsUpdatingRole(false);
            alertExceptionError(e)
        })
    }

    const onCreateRole = (data) => {
        setIsCreatingRole(true);
        createBusinessRole(data).then(res => {
            if (res.responseCode === '00') {
                alertSuccess('Role created Successfully!')
                getRoles()
                setIsOpenCreateRole(false)
            } else {
                alertError(res.message ? res.message : 'An Error Occurred processing request. Kindly try again')
            }
            setIsCreatingRole(false);
        }).catch(e => {
            setIsCreatingRole(false);
            alertExceptionError(e)
        })
    }

    const [actions] = React.useState(
        [
            { label: t('Edit'), value: 'edit' },
        ]
    );

    const onTableActionChange = (action, user) => {
        setUser(user)
        if (action.value === 'edit') {
            setIsOpenEditUser(true);
        }
    }

    const editRole = (r) => {
        setRole(r)
        setIsOpenEditRole(true);
    }

    const updateAccountStatus = (userData) =>{
        setUser(userData);
        setShowAccountStatusModal(true)
    }

    const getInitial = (row) => {
      if (row?.user?.first_name){
          return row.user?.first_name?.charAt(0)
      } else if (row?.user?.last_name){
          return row.user?.last_name?.charAt(0)
      }
      else  {
          return row.user?.email?.charAt(0)
      }
    }

    const [columns] = React.useState([
        { name: t('Name'),
            style: { width: '130px' },
            cell: row => <div><BadgeCircle text={getInitial(row)} status="basic" /> <span> {row.user?.first_name}</span> </div> },
        {
            name: t('Email/Mobile'),
            style: { width: '180px' },
            cell: row => <div className="d-flex flex-column">
                <span className="seerbit-color" title={row.user?.email}>
                    {row.user?.email}</span><span>{row.user?.phone_number}
            </span>
        </div>
        },
        { name: t('User Role'),
            style: { width: '80px' },
            cell: row => <span className="text-capitalize"> {row.role?.name.toLowerCase().replace(/_/g, " ")}</span> },
        { name: t('Last Login'),
            style: { width: '80px' },
            cell: row => <span> {row.user?.last_login ? row.user?.last_login : 'Never'}</span> },
        { name: t('Status'),
            style: { width: '80px' },
            cell: row =>
                ((row.role.name !== 'MERCHANT_ADMINISTRATOR' && row.user?.number !== user_details.id ) ?
                        <Button size="sm" type={`${row.user?.status === 'ACTIVE' ? 'fail' : 'type'}`}
                                onClick={ ()=> updateAccountStatus(row) }
                                text={row.user.status === 'ACTIVE' ? 'Disable': 'Enable'}/> :
                    <Badge className='ml-4' type='info'>{row.user?.status}</Badge>
                )},
            {
                name: t('Data Mode'),
                style: { width: '50px' },
                cell: row => <span> {row.user?.mode ? t(row.user?.mode) : "NA"}</span> },
        { name: '',
            cellStyle: { width: '50px',textAlign: 'right' },
            style: { textAlign: 'right', width: '50px' },
            cell: row =>  <Can access="ASSIGN_PERMISSION">
                <TableDropdown data={actions} onChange={(action) => onTableActionChange(action, row)} />
        </Can> },
    ]);

    const [columnsMobile] = React.useState([
        { name: t('Name'), cell: row => <div><BadgeCircle text={row.user?.first_name?.charAt(0)} status="basic" /> <span> {row.user?.first_name}</span> </div> },
        { name: t('Email/Mobile'), cell: row => <div className="d-flex flex-column"><span className="seerbit-color">{row.user.email}</span><span>{row.user?.phone_number}</span></div> },
        { name: '', styles: { textAlign: 'center', padding: "1.5em 0" }, cell: row => <Can access="ASSIGN_PERMISSION"><TableDropdown data={actions} onChange={(action) => onTableActionChange(action, row)} /></Can> },
    ]);

    React.useEffect(() => {
        getBusinessUsersList()
        getRoles()
        getBranches()
    }, []);

    React.useEffect(() => {
        if (roles) {
            if (roles.hasOwnProperty('payload')) {
                const r = roles.payload.map(item =>
                { return { label: item.name.replace(/_/, ' '), value: item.id, name:item.name }
                });
                setBusinessRoles(r)
            }
        }
    }, [roles?.payload]);

    // React.useEffect(() => {
    //     if (branches) {
    //         // console.log(branches)
    //         // setBusinessBranches(branches)
    //     }
    // }, [branches]);

    return (
        <div className="">
            <UpdateUserAccountStatusModal
                user={user}
                show={ showAccountStatusModal }
                close={ ()=> setShowAccountStatusModal(false) }
                done={ ()=> getBusinessUsersList() }
            />
            <InviteUserModal
                onSuccess={onSuccess}
                setOnSuccess={setOnSuccess}
                isOpen={isOpenInviteUser}
                close={(v) => setIsOpenInviteUser(v)}
                businessRoles={businessRoles}
                processInvite={processInvite}
                onInvite={onInvite}
            />
            <RolesViewModal
                isOpen={isOpenViewRoles}
                close={(v) => setIsOpenViewRoles(v)}
                roles={roles ? roles.payload : []}
                processInvite={processInvite}
                onInvite={onInvite}
                edit={r=>editRole(r)}
                createCustomRole={()=>setIsOpenCreateRole(true)}
            />
            <EditRoleModal
                isOpen={isOpenEditRole}
                close={(v) => setIsOpenEditRole(v)}
                role={role}
                process={isUpdatingRole}
                save={onUpdateRole}
            />
            <CreateRoleModal
                isOpen={isOpenCreateRole}
                close={() => setIsOpenCreateRole(false)}
                role={role}
                process={isCreatingRole}
                save={onCreateRole}
                all_permissions={user_permissions}
            />
            <EditUserModal
                isOpen={isOpenEditUser}
                close={(v) => setIsOpenEditUser(v)}
                businessRoles={businessRoles}
                branches={businessBranches}
                user={user}
                business_details={business_details}
                user_details={user_details}
                process={process}
                processDataMode={processDataMode}
                processBusinessDataMode={processBusinessDataMode}
                onSwitchUserDataMode={onSwitchUserDataMode}
                onSwitchUserRole={onSwitchUserRole}
            />

            <div className="d-flex justify-content-end mt-4">
                <Button text="Manage Roles" onClick={() => setIsOpenViewRoles(true)} type="blue" size="sm" />
                <Button testId='invite-team-btn' text="Invite a Team Member" onClick={() => setIsOpenInviteUser(true)} size="sm" className='ml-4'/>
            </div>
            <div className="d-none d-md-block">
                <AppTable
                    columns={columns}
                    fixedLayout={false}
                    loading={loading}
                    paginate={false}
                    data={business_users ? business_users.payload ? business_users.payload : [] : []}
                    className="mt-5"
                    rowClass= "row-height"
                    headerClass = ""
                />
            </div>
            <div className="d-block d-md-none">
            <AppTable
                columns={columnsMobile}
                loading={loading}
                paginate={false}
                data={business_users ? business_users.payload ? business_users.payload : [] : []}
                className="mt-5"
                rowClass= "row-height"
                headerClass = ""
            />
            </div>
        </div>
    )
}


const mapStateToProps = state => ({
    business_stores: state.frontStore.business_stores_data,
    business_users: state.userManagement.business_users,
    loading: state.userManagement.loading_business_users,
    roles: state.data.roles,
    branches: state.data.branches,
    user_permissions: state.data.user_permissions,
    user_details: state.data.user_details,
    business_details: state.data.business_details,
});
export default connect(mapStateToProps, { getBusinessStores, getBusinessUsers, getBusinessUsersList, getRoles, getBranches,dispatchUpdateProfile,updateSingleBusinessUser })(UserManagement);
