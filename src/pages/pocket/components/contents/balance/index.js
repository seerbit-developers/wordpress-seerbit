import React, {useEffect, useState} from 'react';
import { motion, AnimatePresence } from "framer-motion"
import Table from "./Table";
import PropTypes from 'prop-types';
import FilterIcon from "assets/images/svg/filterIcon.svg";
import DropdownFilter from "./dropdownFilter";
import {connect} from "react-redux";
import {fetchPocketProfileCredit, fetchBusinessPocketHistory} from "actions/pocketActions";
import Button from "components/button";
import {formatNumber} from "utils";
import {DateRangePicker} from "rsuite";
import moment from "moment";
import {useTranslation} from "react-i18next";

const Balance = ({ loading,fundPocket,overview,currency, ...props }) => {
    const [perPage, setPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterSearch, setFilterSearch] = useState(false)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [pocketReferenceId, setPocketReferenceId] = useState('')
    const [pocketAccountNumber, setPocketAccountNumber] = useState('')
    const [reference, setReference] = useState('')
    const [status, setStatus] = useState('');
    const { t } = useTranslation();
    useEffect( ()=>{
        fetchData()
    }, []);

    const changePage = (from = 1) => {
        setCurrentPage(from+1)
        fetchData(from)
    }
    const fetchData = (from=0, fromDate=startDate, toDate=endDate)=>{
        const fd = moment.isMoment(fromDate) ?
            fromDate.format("DD-MM-yyyy") :
            (fromDate === null || endDate === null) ? '' :
            moment(fromDate).format("DD-MM-yyyy");

        const td = moment.isMoment(toDate) ?
            toDate.format("DD-MM-yyyy") :
            (fromDate === null || endDate === null) ? '' :
            moment(toDate).format("DD-MM-yyyy");
        setStartDate(fromDate)
        setEndDate(toDate)
        props.fetchBusinessPocketHistory(
            from, perPage,
            {
                "endDate":td,
                "pocketAccountNumber": pocketAccountNumber,
                "pocketReferenceId": pocketReferenceId,
                "startDate": fd,
                "status": status,
                "transactionRef": reference,
                "type": ""
            }
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x:-10 }}
                className="--content-full"
            >
            <div className="header">
                <h4>{t('Pocket Balance')}</h4>
            </div>
                <div className="d-flex justify-content-between">
                <div className="panel-info">
                    <div className="header">
                        <p>{t('Account Balance')}</p>
                        <h3>{currency} { overview ? formatNumber(overview?.pocketAccount?.balance) : '--' } </h3>
                    </div>
                    <Button text="Topup" size="xs" onClick={fundPocket}/>
                </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <div
                        className="input-wrap sbt-border-success br-normal py-1 position-relative"
                        id="filterToggleDiv"
                        style={{width: 'fit-content'}}
                    >
                <span className="transaction-search-filter-container" id="filterToggleSpan">
                  <img src={FilterIcon} id="filterToggleImg" alt={t('Search')}/>
                    {t('Filter')}
                </span>
                        <DropdownFilter
                            loading={loading}
                            isOpen={filterSearch}
                            close={()=>setFilterSearch(false)}
                            open={()=>setFilterSearch(true)}
                            reference={reference}
                            status={status}
                            setStatus={setStatus}
                            setReference={setReference}
                            pocketAccountNumber={pocketAccountNumber}
                            setPocketAccountNumber={setPocketAccountNumber}
                            pocketReferenceId={pocketReferenceId}
                            setPocketReferenceId={setPocketReferenceId}
                            filter={fetchData}
                        />
                    </div>
                    <DateRangePicker
                        // onChange={(r)=>{ setDates(r); setDefaultDates(r); filter(r)} }
                        onChange={(r)=>{ fetchData(0,r[0],r[1]) }}
                        placement={"bottomEnd"}
                        showOneCalendar
                        appearance="subtle"
                        disabledDate={DateRangePicker.allowedMaxDays(90)}
                    />
                </div>
                <div className="section">
                    <Table
                        data={props.business_pocket_history}
                        loading={loading}
                        perPage={perPage}
                        currentPage={currentPage}
                        changePage={changePage}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};


Balance.propTypes = {
    loading: PropTypes.bool,
    fetchPocketProfileCredit: PropTypes.func.isRequired,
    fundPocket: PropTypes.func.isRequired,
}
const getCurrency = (b)=>{
    return b ? b.default_currency ? b.default_currency : 'NGN' : 'NGN'
}
const mapStateToProps = (state) => ({
    user_details: state.data.user_details,
    currency: getCurrency(state.data.business_details),
    business_details: state.data.business_details,
    profile: state.pocket.profile_credit,
    loading: state.pocket.loading_business_pocket_history,
    overview: state.pocket.business_pocket_balance,
    business_pocket_history: state.pocket.business_pocket_history,
});

export default connect(mapStateToProps, {
    fetchPocketProfileCredit,
    fetchBusinessPocketHistory
})(Balance);
