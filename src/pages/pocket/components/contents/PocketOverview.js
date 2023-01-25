import React, {useEffect, useRef, useState} from 'react';
import Button from "components/button";
import { motion, AnimatePresence } from "framer-motion"
import {connect} from "react-redux";
import {fetchBusinessPocketBalance} from "actions/pocketActions";
import PropTypes from "prop-types";
import {formatNumber} from "utils";
import {DateRangePicker} from "rsuite";
import moment from "moment";
import {useTranslation} from "react-i18next";
import DropdownSelect from "components/dropdown-select/dropdown.select";
import {useHistory} from "react-router";
import {alertError, alertExceptionError, alertInfo} from "modules/alert";
import {generatePocketAccount} from "services/pocketService";
import {Spinner} from "react-bootstrap";
const PocketOverview = ({
                            fetchBusinessPocketBalance,
                            data,
                            fundPocket,
                            currency,
                            business_details
                        }) => {
    const [type, setType] = useState('TODAY');
    const [mounted, setMounted] = useState(false);
    const [active, setActive] = useState(null);
    const [hasAccount, setHasAccount] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect( ()=>{
        fetchBusinessPocketBalance(type);
        setMounted(true);
    }, []);

    const fetchData = (
        type=type,
        fromDate='',
        toDate
    )=>{
        const t = typeof type == 'object' ? type.value : type;
        const fd = moment.isMoment(fromDate) ?
            fromDate.format("DD-MM-yyyy") :
            moment(fromDate).format("DD-MM-yyyy");

        const td = moment.isMoment(toDate) ?
            toDate.format("DD-MM-yyyy") :
            moment(toDate).format("DD-MM-yyyy");
        fetchBusinessPocketBalance(t, fd, td,true);
    }

    useEffect( ()=>{
        if (mounted){
            if (type.value !== 'CUSTOM'){
                fetchBusinessPocketBalance(type.value, '', '', true)
            }
        }
    }, [type]);

    useEffect( ()=>{
        if (data?.pocketAccount?.businessPocketAccountNumber){
            setHasAccount(true);
        }
    }, [data]);


    const { t } = useTranslation();
    let history = useHistory();

    const onFundPocket = ()=>{
        if (business_details?.pocketServiceConfig?.status === 'ACTIVE'){
            if (data?.pocketAccount?.pocketReferenceId){
                fundPocket(data?.pocketAccount?.pocketReferenceId)
            } else {
                alertInfo('Pocket service is inactive for your business')
            }
        } else {
            alertInfo('Pocket service is inactive for your business')
        }
    }

    const generateAccount = ()=>{
        setBusy(true);
        generatePocketAccount(data?.pocketAccount?.pocketReferenceId).then(res=>{
            setBusy(false);
            if (res.responseCode === '00'){
                alertInfo(res.responseMessage ? res.responseMessage : 'Success');
                if (type.value !== 'CUSTOM'){
                    fetchBusinessPocketBalance(type.value, '', '', true)
                }
            }else {
                alertError(res.responseMessage ? res.responseMessage : 'Error generating account number')
            }
        })
            .catch(e=>{
                setBusy(false);
                alertExceptionError(e)
            })
    }

    useEffect( ()=>{
        if (business_details?.pocketServiceConfig?.status !== 'ACTIVE'){
            setActive('INACTIVE')
        }else {
            setActive('ACTIVE')
        }
    }, [business_details]);

    return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x:-10 }}
                    className="--content"
                >
            <div className="header">
                <h4>{t("Pocket Overview")}</h4>
            </div>
                    {(active === 'ACTIVE' && !hasAccount) &&
                        <div className='d-flex justify-content-between align-items-center mb-4'>
                            <div className='alert alert-warning alert-dismissible'>
                                {t('Pocket service requires a primary pocket account')}
                            </div>
                            <Button size="md" onClick={()=>generateAccount()}>
                                {busy ? (
                                    <Spinner animation="border" variant="light" size='sm'/>
                                ) : (
                                    <>{t("Generate Account")}</>
                                )}
                            </Button>
                        </div>
                    }
                    {active === 'INACTIVE' && <div className='alert alert-warning alert-dismissible alert-container'>
                        {t('Pocket service is inactive for your business')}  {t('Contact support on support@seerbit.com')}
                    </div>}

            <div className="section">
                <div className="top-panel">
                    <h5>{t('Pocket Balance')}</h5>
                    <div className="action-panel">
                        <p>{t("These are funds currently in your business pocket")}</p>
                        <Button text="Topup" size="xs" onClick={onFundPocket}/>
                    </div>
                    <div className="bottom-panel">
                        <p className="info-text">{t("Total Funds in Pocket")}</p>
                        <p className="info-bold">{currency} {data && formatNumber(data?.pocketAccount?.balance)}</p>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className="top-panel">
                    <h5>{t('Global Sub-pocket Balance')}</h5>
                    <div className="action-panel">
                        <p>{t("These are funds currently in your business pocket")}</p>
                        <Button text={t('view sub-pockets')} size="xs" type="secondary" onClick={()=>history.push('/pocket/sub/pockets')}/>
                    </div>
                    <div className="bottom-panel">
                        <p className="info-text">{t("Total Funds in Pocket")}</p>
                        <p className="info-bold">{currency} {data && formatNumber(data?.globalSubPocketBalance)}</p>
                    </div>
                </div>
            </div>
                    <div className="section">
                        <div className="top-panel">
                            <h5>{t('Transfers')}</h5>
                            <div className="action-panel hide-calender">
                                <p>{t('These a funds transferred out of your business pockets')}</p>
                                <div>
                                    <DropdownSelect
                                        containerClass='select-container'
                                        data={[
                                            {label:t('Today'), value:'TODAY'},
                                            {label:t('Current Week'), value:'WEEK'},
                                            {label:t('Custom'), value:'CUSTOM'},
                                        ]}
                                        itemClass={'select-item'}
                                        buttonClass={'select-button'}
                                        defaultValue={type}
                                        value={type}
                                        onChange={v=> {
                                            setType(v);
                                        }}
                                    />
                                </div>
                            </div>
                            {type && type.value === 'CUSTOM' &&
                                <DateRangePicker
                                    onOk={(r) => {
                                        fetchData(type,r[0], r[1], true);
                                    }}
                                    appearance="subtle"
                                    showOneCalendar
                                    defaultOpen
                                    size={'xs'}
                                    placeholder={null}
                                    placement={'topEnd'}
                                />
                            }
                            <div className="bottom-panel pb-4" style={{borderBottom:0}}>
                                <p className="info-text">{t('Funds transferred')}</p>
                                <p className="info-bold">{
                                    data ?
                                        `${currency} ${data.fundsTransferred ? formatNumber(data?.fundsTransferred) : 0}`
                                        : ''
                                }</p>
                            </div>
                            {/*<div className="bottom-panel pt-0">*/}
                            {/*    <p className="info-text">Fees & Charges</p>*/}
                            {/*    <p className="info-bold"> {*/}
                            {/*        data ?*/}
                            {/*            data.feesCharged !== null || data.feesCharged !== undefined ?*/}
                            {/*            `NGN ${formatNumber(data?.feesCharged)}`*/}
                            {/*            : ''*/}
                            {/*            : ''*/}
                            {/*    }</p>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
    );
};

PocketOverview.propTypes = {
    loading: PropTypes.bool,
    data: PropTypes.any,
    fetchBusinessPocketBalance: PropTypes.func.isRequired,
    fundPocket: PropTypes.func.isRequired,
    setTab: PropTypes.func.isRequired,
}

const getCurrency = (b)=>{
    return b ? b.default_currency ? b.default_currency : 'NGN' : 'NGN'
}
const mapStateToProps = (state) => ({
    user_details: state.data.user_details,
    business_details: state.data.business_details,
    currency: getCurrency(state.data.business_details),
    profile: state.pocket.profile_credit,
    loading: state.pocket.loading_business_pocket_balance,
    data: state.pocket.business_pocket_balance,
});

export default connect(mapStateToProps, {fetchBusinessPocketBalance})(PocketOverview)
