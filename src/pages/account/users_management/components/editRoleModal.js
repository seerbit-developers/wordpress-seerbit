import React from "react";
import AppModal from "components/app-modal";
import Button from "components/button";
import { useForm } from "react-hook-form";
import {useTranslation} from "react-i18next";
import Loader from "components/loader";
const EditRoleModal = ({ isOpen, close, process, role,save }) => {
    const [permissions, setPermissions] = React.useState([]);
    const [roleName, setRoleName] = React.useState([]);
    const [selectAll, setSelectAll] = React.useState(false);
    const { register, handleSubmit, control, setError, trigger,setValue, formState: { errors } } = useForm();
    const { t } = useTranslation();
    React.useEffect( ()=>{
        if (role){
            setValue('name', role.name.replace(/_/g, " "))
            setValue('description', role.description)
            setRoleName(role.name.replace(/_/g, " "))
            //get permissions
            const can_permissions = role.can.map(item => ( {name:item.replace(/_/g, " "),value:item, can:true}))
            const cannot_permissions = role.cannot.map(item => ( {name:item.replace(/_/g, " "),value:item, can:false}))
            let permissions = [...can_permissions, ...cannot_permissions];
            setPermissions(permissions)
        }
    },[role])

    const onSubmit = (data) => {
        if (data){
            const p = {
                name: data.name,
                id: role.id,
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
        <AppModal title={roleName ? `Edit Role (${roleName})` : '...'} isOpen={isOpen} close={() => close(false)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="name">{t('Name')}</label>
                    {errors.name && <span className="text-danger pl-2">{errors.name.message}</span>}
                    <input className="form__control--full"
                           id="name"
                           name="name"
                           type="text"
                           disabled={process}
                           {...register('name', {
                               required: t('Role name is required'),
                           })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description">{t('Description')}</label>
                    {errors.description && <span className="text-danger pl-2">{errors.description.message}</span>}
                    <textarea
                        name="description"
                        className="form__control--full"
                        {...register('description',{
                            required: false
                        })}
                        disabled={process}
                    />
                </div>
                <div className="d-flex justify-content-between mb-3">
                    <label htmlFor="permissions">{t('Permissions')}</label>
                    <Button text={t('Select all')} size="sm" onClick={ ()=>onSelectAll()} buttonType='button' disabled={process}/>
                </div>
                <div className="mb-5 scrollable">
                    {
                        permissions.map( (r, i)=>
                            <div className="py-2" key={i}>
                                <label className="mb-1 d-flex align-items-center">
                                    <input type="checkbox" checked={r.can}
                                           onChange={ (e)=>checkPermission(e.target.checked, r)}/>
                                    <span className="mr-2 ml-2">{r.name}</span>
                                </label>
                            </div>
                        )
                    }
                </div>
                <Button text={process ?
                    <Loader type={'login'} /> : 'Save'}
                        full as="button" buttonType='submit' onClick={() => onSubmit()} />
            </form>
        </AppModal>
    )
}

export default EditRoleModal;
