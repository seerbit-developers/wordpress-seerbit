import React, {useEffect} from 'react';
import Button from "components/button";
import { motion, AnimatePresence } from "framer-motion"
import {connect} from "react-redux";
import {fetchBusinessPocketBalance} from "actions/pocketActions";
import PropTypes from "prop-types";
import {formatNumber} from "utils";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router";
const PocketOverview = ({
                            fetchBusinessPocketBalance,
                            data,
    currency,
                            setTab
                        }) => {
    useEffect( ()=>{
        fetchBusinessPocketBalance()
    }, [])
    const { t } = useTranslation();
    let history = useHistory();
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x:-10 }}
                className="--content"
            >
                <div className="header">
                    <h4>{t('Sub-pockets Overview')}</h4>
                </div>
                <div className="section">
                    <div className="top-panel">
                        <h5>{t('Global Sub-pocket Balance')}</h5>
                        <div className="action-panel">
                            <p>{t('These are funds currently in your sub-pockets')}</p>
                            <Button text="view sub-pockets" size="xs" type="secondary"  onClick={()=>history.push('/pocket/sub/pockets')}/>
                        </div>
                        <div className="bottom-panel">
                            <p className="info-text">{t('Total Funds')}</p>
                            <p className="info-bold">{currency} {data && formatNumber(data?.globalSubPocketBalance)}</p>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="top-panel">
                        <h5>{t('Sub-pocket Holders')}</h5>
                        <div className="action-panel p-0">
                        </div>
                        <div className="bottom-panel">
                            <p className="info-text">{t('Active Sub-pockets')}</p>
                            <p className="info-bold">{data && data?.totalSubPocketVolume}</p>
                        </div>
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
