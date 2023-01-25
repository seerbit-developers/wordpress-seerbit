import React from "react";
import AppModal from "components/app-modal";
import DropdownSelect from "components/dropdown-select/dropdown.select";
import Button from "components/button";
import SectionHeader from "components/sectionHeader";
import AppToggle from "components/toggle";
import { alertError } from "modules/alert";
import {hostChecker} from "utils";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import Loader from "../../../../components/loader";
const EditUserModal = ({
    isOpen, close, businessRoles, user, branches, onSwitchUserDataMode,
    onSwitchUserRole, process, processDataMode,business_details,processBusinessDataMode,
                           user_details
}) => {
    const [canSwitchMode, setCanSwitchMode] = React.useState(false);
    const [isPrimaryUser, setIsPrimaryUser] = React.useState(false);
    const [isSameUser, setIsSameUser] = React.useState(false);
    const [hasBranchAccess, setHasBranchAccess] = React.useState(false);
    const [mode, setMode] = React.useState('');
    const [businessMode, setBusinessMode] = React.useState('');
    const [businessHasBranches, setBusinessHasBranches] = React.useState(false);
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [role, setRole] = React.useState('');
    const [branch, setBranch] = React.useState('');
    const [updateRequired, setUpdateRequired] = React.useState(false);
    const { t } = useTranslation();

    React.useEffect(() => {
        if (user) {
            if (user.user) {
                setRole(user.role.id)
                setFirstName(user.user.first_name);
                setLastName(user.user.last_name);
                setEmail(user.user.email);
                setCanSwitchMode(user.user.canSwitchMode)
                setMode(user.user.mode)
                // setIsPrimaryUser(user.role.name == 'MERCHANT_ADMINISTRATOR')
                if (Array.isArray(user.user.branchAccess)) {
                    if (user.user.branchAccess.length) {
                        setHasBranchAccess(true)
                    }
                }
            }
        }
        if (user && user_details){
            setIsSameUser(user_details.email === user.user.email)
        }
    }, [user,user_details]);

    React.useEffect(() => {
        if (business_details.setting) {
            if (business_details.setting) {
            if (business_details.setting.mode) {
                setBusinessMode(business_details.setting.mode)
            }
            }
        }
        if (business_details.primaryUser) {
            if (business_details.primaryUser.email === user_details.email){
                setIsPrimaryUser(true)
            }
        }
    }, [business_details]);

    React.useEffect(() => {
        if (business_details && user_details) {
        if (business_details.primaryUser) {
            if (business_details.primaryUser.email === user_details.email){
                setIsPrimaryUser(true)
            }
        }
        }
    }, [business_details, user_details]);

    React.useEffect(() => {
        if (branches) {
            if (Array.isArray(branches)) {
                if (branches.length) {
                    setBusinessHasBranches(true)
                }
            }
        }
    }, [branches]);

    const switchMode = () => {
        if(businessMode === 'TEST' && user.user.mode === 'TEST'){
            alertError(t('You cannot switch a user account mode if your business is in TEST MODE'))
        }else{
        onSwitchUserDataMode(null)
        }
    }

    const switchBusinessMode = () => {
        if(businessMode === 'TEST' && !user.user.canSwitchMode){
            alertError(t('You cannot switch a user account mode if your business is in TEST MODE'))
        }else{
            const type = user.user.canSwitchMode
            ? "switch=false"
            : "switch=true";
        onSwitchUserDataMode(type)
        }

    }

    const switchRole = () => {
        const r = businessRoles.find(item => item.value == role)
        if (r) {
            const p = {
                role: r.name,
                first_name: firstName,
                last_name: lastName,
                email: user.user.email,
            }
            onSwitchUserRole(p)
        }
    }

    const onSwitchRole = (r) => {
        if (role !== r) {
            setUpdateRequired(true)
        }
    }

    return (
        <AppModal title="Edit User Profile" isOpen={isOpen} close={() => close(false)}>
            <form>
                <div className="mb-3">
                    <label htmlFor="fullName">{t('Name')}</label>
                    <input className="form__control--full"
                        id="fullName"
                        value={firstName + ' ' + lastName}
                        type="text"
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email">{t('Email')}</label>
                    <input className="form__control--full"
                        id="email"
                        value={email}
                        type="text"
                        disabled
                    />
                </div>
                {
                    isPrimaryUser && !isSameUser &&
                    <div className="mb-3">
                        <label htmlFor="role">{t('Role')}</label>
                        <DropdownSelect containerClass="form__control--full"
                                        data={businessRoles}
                                        defaultValue="Select a role"
                                        id="role"
                                        value={role}
                                        as={'div'}
                                        disabled={process}
                                        onChange={({value}) => {
                                            onSwitchRole(value)
                                            setRole(value)
                                        }}
                        />
                    </div>
                }
                {updateRequired &&
                    <div className="mb-3">
                        <Button
                            text={process ? <Loader type={'login'} /> : 'Save'}
                            full
                            as="button"
                            buttonType='button'
                            onClick={() => switchRole()}
                            disabled={process} />
                    </div>
                }
                <div>
                    {
                        isPrimaryUser && hostChecker() !== 'pilot'  &&
                        <div className="mt-4">
                            <SectionHeader title={t('Allow User Perform Live Actions')} />
                    <div className="d-flex justify-content-between mt-2">
                        <p>{t('Allow this user have access to both live and test data')} </p>
                        {processDataMode ? <Loader type={'login'} /> :
                            <AppToggle active={mode === 'LIVE'} onChange={() => switchMode()} />}
                    </div>
                        </div>
                    }

                        {
                        isPrimaryUser  && hostChecker() !== 'pilot'  &&
                        <div className="mt-3">
                            <SectionHeader title="Enable/Disable the user's ability to toggle business mode" />
                    <div className="d-flex justify-content-between mt-2">
                        <p>{t('Enable or Disable the user\'s ability to toggle business mode from LIVE to TEST ')}</p>
                        {processBusinessDataMode ? <Loader type={'login'} /> :
                            <AppToggle active={canSwitchMode} onChange={() => switchBusinessMode()} />}
                    </div>
                        </div>}


                    {
                        businessHasBranches && isPrimaryUser &&
                        <div className="d-flex justify-content-between mt-2">
                            <p>{t('Assign User to a branch')} </p>
                            {
                                process ? <Loader type={'login'} /> :
                                    <AppToggle active={hasBranchAccess} />}
                        </div>
                    }

                    {
                        (hasBranchAccess && businessHasBranches) && isPrimaryUser &&
                        <div className="mb-3">
                            <label htmlFor="role">{t('Select a Branch')}</label>
                            <DropdownSelect containerClass="form__control--full"
                                data={branches}
                                defaultValue="Select a branch"
                                id="role"
                                value={branch}
                                as={'div'}
                                onChange={({ value }) => {
                                    // setRole(value)
                                }}
                            />
                        </div>
                    }
                </div>

            </form>
        </AppModal>
    )
}

EditUserModal.propTypes = {
    isOpen: PropTypes.bool,
    process: PropTypes.bool,
    processBusinessDataMode: PropTypes.bool,
    processDataMode: PropTypes.bool,
    close: PropTypes.func,
    onSwitchUserDataMode: PropTypes.func,
    onSwitchUserRole: PropTypes.func,
    businessRoles: PropTypes.any,
    user: PropTypes.any,
    branches: PropTypes.any,
    business_details: PropTypes.any,
    user_details: PropTypes.any,
}
export default EditUserModal;
