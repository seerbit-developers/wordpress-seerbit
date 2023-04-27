import React, {useEffect} from 'react';
import {CSSTransition} from "react-transition-group";
import PropTypes from 'prop-types';
import {Dropdown} from "primereact/dropdown";
import {useTranslation} from "react-i18next";
const DropdownFilter = ({
                            filter,
                            isOpen,
                            setFirstName,
                            firstName,
                            lastName,
                            loading,
                            close,
                            open,
                            setLastName,
                            phoneNumber,
                            setPhoneNumber,
                            reference,
                            setReference,
                            setAccount,
                            account,
                            reset,
                            setEmailAddress,
                            emailAddress,
                            status,
                            setStatus,
                            customerExternalRef,
                            setCustomerExternalRef
                        }) => {

    const container = React.useRef()
    const { t } = useTranslation();

    const handleClickOutside = (event)=>{
        const isNotInContainer = (container && container.current &&
            !container.current?.contains(event.target))
        const isButton =
            (event.target.id === 'filterToggleDiv' || event.target.id === 'filterToggleSpan' || event.target.id === 'filterToggleImg')
        if (isButton && !isOpen) {
            open()
        }
        else if (isButton && isOpen) {
            close()
        }
        else if (isNotInContainer) {
            close()
        }
    }
    useEffect( ()=>{
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside );
        };
    }, [isOpen])

    return (
        <CSSTransition
            in={isOpen}
            unmountOnExit
            timeout={200}
            classNames="filter__engine"
        >
            <div className="filter__engine" ref={container}>
                <div className="--container">
                    <div className="--header">
                        <div className="--badge-white"
                             onClick={()=> !loading && reset()}
                        >{t('Reset')}</div>
                        <div className="--badge-black" onClick={()=>{
                            !loading && filter()
                        }}>{loading ? t('Filtering')+'...' : t('Filter')}</div>
                    </div>
                    <div className="--content">
                        <div className="py-2">{t('Search by')}:</div>
                        <div className="d-flex justify-content-between">
                            <div className="pr-2">
                                <p className="py-2">{t('Reference')}</p>
                                <div className="--search-box">
                                    <input type="text"
                                           value={reference}
                                           placeholder=""
                                           onChange={e=>setReference(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="pl-2">
                                <p className="py-2">{t('Account')}</p>
                                <div className="--search-box">
                                    <input type="text"
                                           value={account}
                                           placeholder=""
                                           onChange={e=>setAccount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div className="pr-2">
                                <p className="py-2">{t('First Name')}</p>
                                <div className="--search-box">
                                    <input type="text"
                                           value={firstName}
                                           placeholder=""
                                           onChange={e=>setFirstName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="pl-2">
                                <p className="py-2">{t('Last Name')}</p>
                                <div className="--search-box">
                                    <input type="text"
                                           placeholder=""
                                           value={lastName}
                                           onChange={e=>setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between">
                        <div className="pt-2 pr-2">
                            <p className="py-2">{t('Phone Number')}</p>
                            <div className="--search-box">
                                <input type="text"
                                       placeholder=""
                                       value={phoneNumber}
                                       onChange={e=>setPhoneNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="pt-2 pl-2">
                            <p className="py-2">{t('Email')}</p>
                            <div className="--search-box">
                                <input type="text"
                                       placeholder=""
                                       value={emailAddress}
                                       onChange={e=>setEmailAddress(e.target.value)}
                                />
                            </div>
                        </div>
                        </div>
                        <div className='mt-2'>
                            <p className="pb-2">{t('Status')}</p>
                            <Dropdown
                                style={{ width: 80 }}
                                optionLabel="text"
                                placeholder={t('Select a status')}
                                value={status}
                                options={[
                                    {text:t('Successful'), value:'success'},
                                    {text:t('Failed'), value:'fail'}
                                ]}
                                onChange={(e) => {
                                    setStatus(e.value);
                                }}
                                className="font-12 w-100 cursor-pointer mr-3 sbt-border-success"
                            />
                        </div>
                        {/*<div className="pt-2">*/}
                        {/*    <p className="py-2">External Reference</p>*/}
                        {/*    <div className="--search-box">*/}
                        {/*        <input type="text"*/}
                        {/*               placeholder=""*/}
                        {/*               value={customerExternalRef}*/}
                        {/*               onChange={e=>setCustomerExternalRef(e.target.value)}*/}
                        {/*        />*/}
                        {/*        <img src={Search} />*/}
                        {/*    </div>*/}
                        {/*</div>*/}


                        {/*<div className="space-border my-4"></div>*/}

                        {/*<div>*/}
                        {/*    <div className="py-2">Filter by:</div>*/}

                        {/*</div>*/}

                        <div className="pt-3">

                        </div>

                    </div>
                </div>
            </div>
        </CSSTransition>

    );
};
DropdownFilter.propTypes = {
    isOpen: PropTypes.bool,
    allowedCurrency: PropTypes.array,
    channelOption: PropTypes.array,
    currency: PropTypes.bool,
    loading: PropTypes.bool,
    setOption: PropTypes.func,
    filter: PropTypes.func,
    paymentOption: PropTypes.any,
    productId: PropTypes.string,
    setProductId: PropTypes.func,
    setTransactionReference: PropTypes.func,
    setPaymentChannel: PropTypes.func,
    close: PropTypes.func,
    setCurrency: PropTypes.func,
    transactionReference: PropTypes.string,
    setEmailAddress: PropTypes.func,
    setCustomerExternalRef: PropTypes.func,
    emailAddress: PropTypes.string,
    customerExternalRef: PropTypes.string,
};
export default DropdownFilter;
