import React, {useEffect, useState} from 'react';
import { motion, AnimatePresence } from "framer-motion"
import Table from "./Table";
import PropTypes from 'prop-types';
import FilterIcon from "assets/images/svg/filterIcon.svg";
import DropdownFilter from "./dropdownFilter";
import {connect} from "react-redux";
import {fetchSubPocketHistory} from "actions/pocketActions";
import {DateRangePicker} from "rsuite";
import moment from "moment";

const Balance = ({ loading,fundPocket,overview,currency, ...props }) => {
    const [perPage, setPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [charge, setCharge] = useState('');
    const [filterSearch, setFilterSearch] = useState(false);
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [pocketReferenceId, setPocketReferenceId] = useState('')
    const [pocketAccountNumber, setPocketAccountNumber] = useState('')
    const [emailAddress, setEmailAddress] = useState('')
    const [customerExternalRef, setCustomerExternalRef] = useState('')
    const [status, setStatus] = useState('')
    useEffect( ()=>{
       fetchData();
    }, []);

    const changePage = (from = 1) => {
        setCurrentPage(from+1);
        fetchData(from);
    }

    const fetchData = (from=0,fromDate=startDate, toDate=endDate)=>{
        const fd = moment.isMoment(fromDate) ?
            fromDate.format("DD-MM-yyyy") :
            (fromDate === null || endDate === null) ? '' :
            moment(fromDate).format("DD-MM-yyyy");

        const td = moment.isMoment(toDate) ?
            toDate.format("DD-MM-yyyy") :
            (fromDate === null || endDate === null) ? '' :
            moment(toDate).format("DD-MM-yyyy");
        props.fetchSubPocketHistory(
            from, perPage,
            {
                "charge": charge,
                "customerExternalRef": customerExternalRef,
                "emailAddress": emailAddress,
                "endDate": td,
                "firstName": firstName,
                "lastName": lastName,
                "phoneNumber": phoneNumber,
                "pocketAccountNumber": pocketAccountNumber,
                "pocketReferenceId": pocketReferenceId,
                "startDate": fd,
                "status": status
            }
        );
    }

    const reset = ()=> {
        setFirstName('')
        setLastName('')
        setPhoneNumber('')
        setPocketReferenceId('')
        setPocketAccountNumber('')
        setCustomerExternalRef('')
        setEmailAddress('')
        setEndDate('')
        setStartDate('')
        setStatus('')
        props.fetchSubPocketHistory(
            0, perPage
        )
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
                <h4>Sub-pockets Balance</h4>
            </div>
                <div className='d-flex justify-content-end align-items-center'>

                        <DropdownFilter
                            loading={loading}
                            isOpen={filterSearch}
                            close={()=>setFilterSearch(false)}
                            open={()=>setFilterSearch(true)}
                            setFirstName={(v)=>setFirstName(v)}
                            setLastName={(v)=>setLastName(v)}
                            setPhoneNumber={(v)=>setPhoneNumber(v)}
                            setReference={(v)=>setPocketReferenceId(v)}
                            setAccount={(v)=>setPocketAccountNumber(v)}
                            firstName={firstName}
                            phoneNumber={phoneNumber}
                            lastName={lastName}
                            reference={pocketReferenceId}
                            account={pocketAccountNumber}
                            emailAddress={emailAddress}
                            setEmailAddress={setEmailAddress}
                            customerExternalRef={customerExternalRef}
                            setCustomerExternalRef={setCustomerExternalRef}
                            setStatus={setStatus}
                            status={status}
                            filter={fetchData}
                            reset={reset}
                        />

                    <DateRangePicker
                        // onChange={(r)=>{ setDates(r); setDefaultDates(r); filter(r)} }
                        onOk={(r)=>{ fetchData(r[0],r[1]); }}
                        placement={"bottomEnd"}
                        appearance="subtle"
                        value={[startDate, endDate]}
                        showOneCalendar
                        disabledDate={DateRangePicker.allowedMaxDays(30)}
                    />
                </div>
                <div className="section">
                    <Table
                        data={props.data}
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
    fetchSubPocketHistory: PropTypes.func.isRequired,
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
    loading: state.pocket.loading_sub_pocket_balance,
    overview: state.pocket.business_pocket_balance,
    data: state.pocket.sub_pocket_balance,
});

export default connect(mapStateToProps, {
    fetchSubPocketHistory
})(Balance);
