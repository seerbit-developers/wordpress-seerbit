import React, {useEffect, useState} from 'react';
import { motion, AnimatePresence } from "framer-motion"
import TopupsTable from "./TopupsTable";
import PropTypes from 'prop-types';
import FilterIcon from "assets/images/svg/filterIcon.svg";
import DropdownFilter from "./dropdownFilter";
import {connect} from "react-redux";
import {fetchPocketProfileCredit} from "actions/pocketActions";
import {useTranslation} from "react-i18next";

const Topups = ({ loading, ...props }) => {
    const [perPage, setPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterSearch, setFilterSearch] = useState(false)
    const { t } = useTranslation();

    useEffect( ()=>{
        props.fetchPocketProfileCredit(
            0, perPage
        );
    }, []);

    const changePage = (from = 1) => {
        setCurrentPage(from+1)
        props.fetchPocketProfileCredit(
            from, perPage
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
                <h4>{t("Pocket Top-ups")}</h4>
            </div>
                <div className="section">
                    <div
                        className="input-wrap sbt-border-success br-normal py-1 mb-4 position-relative"
                        onClick={ ()=>setFilterSearch(!filterSearch)}
                        id="filterToggleDiv"
                        style={{width: 'fit-content'}}
                    >
                <span className="transaction-search-filter-container" id="filterToggleSpan">
                  <img src={FilterIcon} id="filterToggleImg" />
                    {t("Filter")}
                </span>
                        <DropdownFilter
                            loading={loading}
                            isOpen={filterSearch}
                            close={()=>setFilterSearch(false)}
                        />
                    </div>
                    <TopupsTable
                        data={props.profile}
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


Topups.propTypes = {
    loading: PropTypes.bool,
    fetchPocketProfileCredit: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user_details: state.data.user_details,
    business_details: state.data.business_details,
    profile: state.pocket.profile_credit,
    loading: state.pocket.loading_profile_credit,
});

export default connect(mapStateToProps, {
    fetchPocketProfileCredit
})(Topups);
