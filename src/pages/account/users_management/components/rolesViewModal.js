
import React from "react";
import AppModal from "components/app-modal";
import Button from "components/button";
import { useForm, Controller } from "react-hook-form";
import PencilIcon from "assets/images/svg/pencilIcon";
import Loader from "components/loader";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
const RolesViewModal = ({ isOpen, close, roles, edit, processInvite,createCustomRole }) => {
    const [role, setRole] = React.useState(null);
    const { register, handleSubmit, control, setError, trigger, formState: { errors } } = useForm();
    const { t } = useTranslation();
    return (
        <AppModal title="Roles" isOpen={isOpen} close={() => close(false)}>
            <form>
                <div className="mb-3">
                    {
                        roles ? Array.isArray(roles) ? roles.map( (r, i) =>
                            <div className="py-3" key={i}>
                                <div className="d-flex align-items-center"><label className="mb-1">
                                    <span className="mr-2 text-capitalize">{r.name ? r.name.replace(/_/g, " ") : ""}</span>
                                   {
                                       (r.name === "OPERATIONS"
                                           || r.name === "CUSTOMER_SUPPORT"
                                           || r.name === "MERCHANT_ADMINISTRATOR"
                                           || r.name === "DEVELOPER_SUPPORT"
                                       )
                                       ? <span className="font-extra-light-italic" title="Default System Role">({t('DEFAULT')})</span>
                                           :
                                           <span title="Custom Role">
                                               <span className="font-extra-light-italic">({t('CUSTOM')})</span>
                                           <PencilIcon class="cursor-pointer" onClick={()=>edit(r)}/>
                                           </span>

                                   }
                                </label></div>
                                <p className="text__color--base">{r.description ? r.description : ""}</p>
                            </div>
                        )
                            : null
                            : null
                    }
                </div>
                <Button text={processInvite ?
                    <Loader type={'login'} />: 'Create'}
                        full as="button" buttonType='button' onClick={()=>createCustomRole()} />
            </form>
        </AppModal>
    )
}

RolesViewModal.propTypes = {
    // isOpen: PropTypes.bool,
    // processInvite: PropTypes.bool,
    // close: PropTypes.func.isRequired,
    // createCustomRole: PropTypes.func.isRequired,
    // edit: PropTypes.func.isRequired,
    // roles: PropTypes.any.isRequired,
}
export default RolesViewModal;
