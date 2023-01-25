import React, {useEffect,useRef} from 'react';
import Search from "assets/images/svg/search.svg";
import {CSSTransition} from "react-transition-group";
import PropTypes from 'prop-types';
import {Dropdown} from "primereact/dropdown";
import {useTranslation} from "react-i18next";
const DropdownFilter = ({
                            filter,
                            isOpen,
                            loading,
                            close,
                            open,
                            reference,
                            setReference,
                            setPocketAccountNumber,
                            pocketAccountNumber,
                            setStatus,
                            status
                        }) => {

    const container = useRef()
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
                 onClick={()=>{
                     if (!loading)
                     {
                         filter(0, new Date(), new Date())
                     }
                 }}
            >{t('Reset')}</div>
            <div className="--badge-black" onClick={()=>{
                !loading && filter()
            }}>{loading ? t('Filtering')+"..." : t('Filter')}</div>
        </div>
            <div className="--content">
                {/*<div className="py-2">Search by:</div>*/}
                {/*<div className="d-flex justify-content-between">*/}
                {/*    <div className="pr-2">*/}
                {/*        <p className="pb-2">Pocket ID</p>*/}
                {/*        <div className="--search-box">*/}
                {/*            <input type="text"*/}
                {/*                   value={reference}*/}
                {/*                   placeholder=""*/}
                {/*                   onChange={e=>setReference(e.target.value)}*/}
                {/*            />*/}
                {/*            <img src={Search} />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className="pl-2">*/}
                {/*        <p className="pb-2">Pocket Account</p>*/}
                {/*        <div className="--search-box">*/}
                {/*            <input type="text"*/}
                {/*                   value={pocketAccountNumber}*/}
                {/*                   placeholder=""*/}
                {/*                   onChange={e=>setPocketAccountNumber(e.target.value)}*/}
                {/*            />*/}
                {/*            <img src={Search} />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="d-flex justify-content-between flex-column">
                    <div className='mt-2'>
                        <p className="pb-2">{t('Reference')}</p>
                        <div className="--search-box">
                            <input type="text"
                                   value={reference}
                                   placeholder=""
                                   onChange={e=>setReference(e.target.value)}
                            />
                            <img src={Search} alt={'search'}/>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <p className="pb-2">{t("Status")}</p>
                        <Dropdown
                            style={{ width: 80 }}
                            optionLabel="text"
                            placeholder={t('Select a status')}
                            value={status}
                            options={[
                                {text: t('Successful'), value:'success'},
                                {text: t('Failed'), value:'fail'}
                            ]}
                            onChange={(e) => {
                                setStatus(e.value);
                            }}
                            className="font-12 w-100 cursor-pointer mr-3 sbt-border-success"
                        />
                    </div>
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
