import React, {useEffect} from "react";
import Header from "./components/Header";
import LoanOffers from "./components/LoanOffers";
import PortfolioBalance from "./components/PortfolioBalance";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {connect} from "react-redux";
import PropTypes from 'prop-types';

const CapitalPage = ({user_details})=>{
    useEffect( ()=>{
        document.querySelector('body').style.backgroundColor = '#F8FAFD';
    }, [])
    return(
        <div className="page-container py-5 capital-container">
            <Header name={user_details?.full_name}/>
                <TransitionGroup className="capital-sections">
                <CSSTransition
                    classNames="fade"
                    timeout={500}
                >
            <PortfolioBalance/>
                </CSSTransition>
                    <CSSTransition>
                        <LoanOffers/>
                    </CSSTransition>
                </TransitionGroup>
        </div>
    )
}
Header.propTypes = {
    user_details: PropTypes.any
};

const mapStateToProps = (state) => ({
    user_details: state.data.user_details,
});

export default connect(mapStateToProps,{})(CapitalPage);
