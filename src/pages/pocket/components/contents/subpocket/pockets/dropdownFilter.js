import React, {useEffect} from 'react';
import Search from "assets/images/svg/search.svg";
import {CSSTransition} from "react-transition-group";
import PropTypes from 'prop-types';
import {useTranslation} from "react-i18next";
import {DateRangePicker} from "rsuite";
const DropdownFilter = ({
                            filter,
                            allowedCurrency,
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
                            startDate,
                            endDate
                        }) => {

    const container = React.useRef()
    const { t } = useTranslation();

    const handleClickOutside = (event)=>{
        const isNotInContainer = (container && container.current &&
            !container.current?.contains(event.target))
        // console.log('isNotInContainer', isNotInContainer)
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
            >{t("Reset")}</div>
            <div className="--badge-black" onClick={()=>{
                !loading && filter()
            }}>{loading ? t('Filtering')+'...' : t('Filter')}</div>
        </div>
            <div className="--content">
                <div className="py-2">{t("Search by")}:</div>
                <div className="d-flex justify-content-between">
                    <div className="pr-2">
                        <p className="pb-2">{t("Reference")}</p>
                        <div className="--search-box">
                            <input type="text"
                                   value={reference}
                                   placeholder=""
                                   onChange={e=>setReference(e.target.value)}
                            />
                            <img src={Search} alt={'search'}/>
                        </div>
                    </div>
                    <div className="p-2">
                        <p className="pl-2">{t("Account")}</p>
                        <div className="--search-box">
                            <input type="text"
                                   value={account}
                                   placeholder=""
                                   onChange={e=>setAccount(e.target.value)}
                            />
                            <img src={Search} alt={'search'}/>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                <div className="pr-2">
                    <p className="pb-2">{t("First Name")}</p>
                    <div className="--search-box">
                        <input type="text"
                               value={firstName}
                               placeholder=""
                               onChange={e=>setFirstName(e.target.value)}
                        />
                        <img src={Search}  alt={'search'}/>
                    </div>
                </div>
                <div className="pl-2">
                    <p className="pb-2">{t("Last Name")}</p>
                    <div className="--search-box">
                    <input type="text"
                           placeholder=""
                           value={lastName}
                           onChange={e=>setLastName(e.target.value)}
                    />
                        <img src={Search}  alt={'search'}/>
                    </div>
                </div>
                </div>
                <div className="pt-2">
                    <p className="pb-2">{t("Phone Number")}</p>
                    <div className="--search-box">
                    <input type="text"
                           placeholder=""
                           value={phoneNumber}
                           onChange={e=>setPhoneNumber(e.target.value)}
                    />
                        <img src={Search} alt={'search'}/>
                    </div>
                </div>


                <div className="space-border my-4" />
                <div className="position-relative">
                    <DateRangePicker
                        // onChange={(r)=>{ setDates(r); setDefaultDates(r); filter(r)} }
                        onOk={(r)=>{ filter(r[0],r[1]); }}
                        placement={"bottomEnd"}
                        appearance="subtle"
                        value={[startDate, endDate]}
                        showOneCalendar
                        className='position-absolute'
                        disabledDate={DateRangePicker.allowedMaxDays(30)}/>
                </div>

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
};
export default DropdownFilter;
