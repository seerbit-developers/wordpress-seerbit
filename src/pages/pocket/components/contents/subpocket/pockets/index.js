import React, {useEffect, useState} from 'react';
import { motion, AnimatePresence } from "framer-motion"
import Table from "./Table";
import PropTypes from 'prop-types';
import FilterIcon from "assets/images/svg/filterIcon.svg";
import DropdownFilter from "./dropdownFilter";
import {connect} from "react-redux";
import {fetchBusinessSubPockets} from "actions/pocketActions";
import Button from "components/button";
// import {formatNumber} from "utils";
import CreateSubPocket from "./create";
import {useTranslation} from "react-i18next";

const SubPockets = ({ loading,fundPocket,overview, ...props }) => {
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterSearch, setFilterSearch] = useState(false)
    const [createModal, setCreateModal] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [pocketReferenceId, setPocketReferenceId] = useState('')
    const [pocketAccountNumber, setPocketAccountNumber] = useState('')
    const { t } = useTranslation();
    useEffect( ()=>{
        props.fetchBusinessSubPockets(
            0, perPage
        );
    }, []);

    const changePage = (from = 1) => {
        setCurrentPage(from+1)
        fetchData(from)
    }

    const fetchData = (from = 0) =>{
        props.fetchBusinessSubPockets(
            from, perPage ,
            {
                firstName : firstName,
                lastName : lastName,
                phoneNumber : phoneNumber,
                pocketReferenceId : pocketReferenceId,
                pocketAccountNumber : pocketAccountNumber,
            }
        );
    }

    const reset = ()=> {
        setFirstName('')
        setLastName('')
        setPhoneNumber('')
        setPocketReferenceId('')
        setPocketAccountNumber('')
        props.fetchBusinessSubPockets(
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
                <CreateSubPocket
                    isOpen={createModal}
                    close={()=>setCreateModal(false)}
                    reload={fetchData}
                />
            <div className="header">
                <h4>{t('Sub-Pockets')}</h4>
            </div>
                <div className="section">
                <div className="d-flex">
                        <Button text="New sub pocket" size="sm" onClick={()=>setCreateModal(true)}/>
                    <div
                        className="input-wrap sbt-border-success br-normal py-1 ml-2 position-relative"
                        id="filterToggleDiv"
                        style={{width: 'fit-content'}}
                    >
                <span className="transaction-search-filter-container" id="filterToggleSpan">
                  <img src={FilterIcon} id="filterToggleImg" />
                    {t('Filter')}
                </span>
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
                            filter={fetchData}
                            reset={reset}
                        />
                    </div>
                </div>

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


SubPockets.propTypes = {
    loading: PropTypes.bool,
    fetchSubPocketHistory: PropTypes.func.isRequired,
    fundPocket: PropTypes.func.isRequired,
}
const getCurrency = (b)=>{
    return b ? b.default_currency ? b.default_currency : 'NGN' : 'NGN'
}
const mapStateToProps = (state) => ({
    user_details: state.data.user_details,
    business_details: state.data.business_details,
    currency: getCurrency(state.data.business_details),
    profile: state.pocket.profile_credit,
    loading: state.pocket.loading_business_sub_pockets,
    overview: state.pocket.business_pocket_balance,
    data: state.pocket.business_sub_pockets,
});

export default connect(mapStateToProps, {
    fetchBusinessSubPockets
})(SubPockets);
