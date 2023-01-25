import React from "react";
import { Modal} from "rsuite";
import {updateUserAccountStatus} from "services/userManagementService";
import {alertError, alertExceptionError, alertSuccess} from "modules/alert";
import {useTranslation} from "react-i18next";
import PropTypes from 'prop-types'
function UpdateUserAccountStatusModal({
                                          user,show,close,done
                                      }) {
    const [ process, setProcess ] = React.useState(false);
    const { t } = useTranslation();
    const update = ()=>{
        setProcess(true)
        updateUserAccountStatus(user.user.status, user.user.number).then(res=>{
            setProcess(false)
            const status = user && user.user.status === 'ACTIVE' ? 'Disabled': 'Enabled';
            if (res.responseCode == '00'){
                alertSuccess(`The User Account has been ${status}`);
                done();
                close();
            }else{
                alertError(res.message)
            }
        }).catch(e=>{
            setProcess(false)
            alertExceptionError(e)
        })
    }
    return (
        <div>
            <Modal centered show={show} onHide={close}>
                <div className='modal-content border-none br-0'>
                    <div className='modal-header'>
                        <h5 className='modal-title font-15 text-capitalize'>{t('Confirm Action')}</h5>
                    </div>
                    <div className='modal-body'>
                        <p className='font-14'>
                            {user && user.user.status === 'ACTIVE' ?
                                t('You are about to Disable this account') : t('You are about to Enable this account')}
                            </p>
                    </div>
                    <div className='modal-footer'>
                        <button type='submit' className={`btn ${user && user.user.status === 'ACTIVE' ? 'btn-danger': 'btn-success'}`} onClick={ update }>
                            {process ? t('Processing...') : t('Confirm')}
                        </button>
                        <button
                            type='button'
                            className='btn btn-light'
                            data-dismiss='modal'
                            onClick={(e) => close()}
                        >
                            {t('Cancel')}
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}

UpdateUserAccountStatusModal.propTypes = {
    user: PropTypes.any,
    show: PropTypes.bool,
    close: PropTypes.func,
    done: PropTypes.func,
}
export default UpdateUserAccountStatusModal;
