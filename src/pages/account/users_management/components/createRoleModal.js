import React from "react";
import AppModal from "components/app-modal";
import Button from "components/button";
import { useForm } from "react-hook-form";
import {useTranslation} from "react-i18next";
import Loader from "components/loader";
import PropTypes from "prop-types";
const CreateRoleModal = ({ isOpen, close, process,role,save,all_permissions }) => {
    const [permissions, setPermissions] = React.useState([]);
    const [selectAll, setSelectAll] = React.useState(false);
    const { register, handleSubmit, control, setError, trigger,setValue, formState: { errors } } = useForm();
    const { t } = useTranslation();
    React.useEffect( ()=>{
        if (all_permissions && Array.isArray(all_permissions)){
            const can_permissions = all_permissions.map(item => ( {name:item.replace(/_/g, " "),value:item, can:false}))
            let p = [...can_permissions,];
            setPermissions(p)
        }
    },[all_permissions])
    const onSubmit = (data) => {
        if (data){
            const p = {
                name: data.name,
                description: data.description,
                permission: permissions.filter(item=>item.can).map(item=>item.value),
            }
            save(p)
        }
    }

    const checkPermission = (s,r)=>{
        const itemIndex = permissions.findIndex(p => p.value === r.value)
        const copyP = JSON.parse(JSON.stringify(permissions))
        copyP[itemIndex].can = s
        setPermissions(copyP)
    }

    const onSelectAll = ()=>{
        if (selectAll){
            setSelectAll(false)
            const ps = permissions.map(p => ({can: false, name:p.name, value:p.value}) )
            setPermissions(ps)
        }else {
            setSelectAll(true);
            const ps = permissions.map(p => ({can: true, name:p.name, value:p.value}) )
            setPermissions(ps)
        }
    }

    return (
        <AppModal title={'Create Role'} isOpen={isOpen} close={() => close(false)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="name">{t('Name')}</label>
                    {errors.name && <span className="text-danger pl-2">{errors.name.message}</span>}
                    <input className="form__control--full"
                           id="name"
                           name="name"
                           type="text"
                           disabled={process}
                           {...register('name',{
                               required: t('Role name is required'),
                               minLength : {
                                   value: 3,
                                   message: t('At least 3 characters are required')
                               }
                           })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description">{t('Description')}</label>
                    {errors.description && <span className="text-danger pl-2">{
                        errors.description.type === 'required' ?
                            t('A description is required') :
                            errors.description.type === 'minLength' ?
                                t('At least 8 characters are required') : ''
                    }</span>}
                    <textarea
                        name="description"
                        id="description"
                        className="form__control--full"
                        {...register('description', {
                            required: true,
                            minLength : {
                                value: 8,
                                message: t('At least 8 characters are required')
                            }
                        })}
                        disabled={process}
                    />
                </div>
                <div className="d-flex justify-content-between mb-3">
                    <label htmlFor="permissions">{t('Permissions')}</label>
                    <Button text="select all" size="sm" onClick={ ()=>onSelectAll()} buttonType='button' />
                </div>
                <div className="mb-5 scrollable">
                    {
                        permissions.map( (r, i)=>
                            <div className="py-2" key={i}>
                                <label className="mb-1 d-flex align-items-center">
                                    <input type="checkbox"
                                           checked={r.can}
                                           onChange={ (e)=>checkPermission(e.target.checked, r)}
                                    />
                                    <span className="mr-2 ml-2">{r.name}</span>
                                </label>
                            </div>
                        )
                    }
                </div>
                <Button text={process ?
                    <Loader type={'login'} /> : 'Save'}
                        full as="button" buttonType='submit' />
            </form>
        </AppModal>
    )
}

CreateRoleModal.propTypes = {
    isOpen: PropTypes.bool,
    close: PropTypes.func,
    save: PropTypes.func,
    process: PropTypes.bool,
    all_permissions: PropTypes.any,
}
export default CreateRoleModal;
