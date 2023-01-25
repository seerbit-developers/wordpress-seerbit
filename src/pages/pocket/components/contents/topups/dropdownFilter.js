import React from 'react';
import {Dropdown} from "primereact/dropdown";
import Search from "assets/images/svg/search.svg";
import {CSSTransition} from "react-transition-group";
import PropTypes from 'prop-types';
import {useTranslation} from "react-i18next";
const DropdownFilter = ({
                            paymentOption,
                            filter,
                            channelOption,
                            setPaymentChannel,
                            currency=true,
                            allowedCurrency,
                            isOpen=false,
                            setTransactionReference,
                            transactionReference,
                            setProductId,
                            productId,
                            loading,
                            close,
                            setCurrency
                        }) => {

    const container = React.useRef()
    const { t } = useTranslation();

    const [currencies, setCurrencies] = React.useState([])

    const createChannelOptions = (channelOption) => {
        let arr = [];
        arr = channelOption && channelOption.length > 0 ? channelOption.map(
            (item) => (
                ({
                    ...item,
                    value: item.code,
                    text: item.name,
                })
            )
        ) : []
        arr = arr.filter(item => item.allow_option)
        arr.unshift({ value: "", text: t("ALL PAYMENT CHANNELS") })
        return arr
    };

    const handleClickOutside = (event)=>{
        const isNotInContainer = (container && container.current &&
            !container.current?.contains(event.target))
        const isButton =
            (event.target.id === 'filterToggleDiv' || event.target.id === 'filterToggleSpan' || event.target.id === 'filterToggleImg')
        if (!isButton && isNotInContainer) {
            close()
        }
    }
    React.useEffect( ()=>{
        document.addEventListener('mousedown', handleClickOutside)
    }, [])

    React.useEffect( ()=>{
        if (allowedCurrency){
            const trans = allowedCurrency.map(
                (item) => ({
                    value: item,
                    text: item,
                })
            );
            trans.unshift({ value: "", text: t("ALL CURRENCIES") })
            setCurrencies(trans)
        }
    }, [allowedCurrency])

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

                     }
                 }}
            >Reset</div>
            <div className="--badge-black" onClick={()=>{
                !loading && filter(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    paymentOption
                )
            }}>{loading ? t('Filtering')+"..." : t('Filter')}</div>
        </div>
            <div className="--content">
                <div className="py-2">{t("Search by")}:</div>

                <div className="pt-1">
                    <p className="pb-2">{t("Transaction Reference")}</p>
                    <div className="--search-box">
                        <input type="text"
                               value={transactionReference}
                               placeholder={t("Enter Transaction Reference")}
                               onChange={e=>setTransactionReference(e.target.value)}
                        />
                        <img src={Search} />
                    </div>
                </div>
                <div className="pt-3">
                    <p className="pb-2">{t("Product ID")}</p>
                    <div className="--search-box">
                    <input type="text"
                           placeholder={t("Enter Product ID")}
                           value={productId}
                           onChange={e=>setProductId(e.target.value)}
                    />
                        <img src={Search} />
                    </div>
                </div>


                <div className="space-border my-4" />

                <div>
                    <div className="py-2">{t("Filter by")}:</div>

                </div>

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
