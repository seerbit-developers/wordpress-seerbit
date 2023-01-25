import React, {useState} from 'react';
import PropTypes from "prop-types";
import CloseSvg from "assets/images/svg/closeSvg.svg"
import BackSvg from "assets/images/svg/back-left.svg"
import { motion, AnimatePresence } from "framer-motion"
import {formatNumber} from "utils";
import Button from "components/button";
import {acceptLoanOffer} from "services/capitalService";
import {alertError, alertExceptionError} from "modules/alert";
import {connect} from "react-redux";
const Offers = ({offersCount = 5, goTo, show,offers, offer, calculatedLoanOffer}) => {
    const [process, setProcess] = useState(false);

    const save = ()=>{
        setProcess(true)
        acceptLoanOffer(
            offer,
            calculatedLoanOffer.amount,
            calculatedLoanOffer.tenorunit,
            calculatedLoanOffer.tenor,
        )
            .then(res=>{
                setProcess(false)
                if (res && res.code !== 'error'){
                    goTo('COMPLETE', offer, calculatedLoanOffer)
                }else{
                    alertError(res.message)
                }

            })
            .catch(e=>{
                setProcess(false);
                alertExceptionError(e)
            })
    }
    return (
        <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x:10 }}
            className="offer pt-3"
        >
            <div className="header">
            <span className="back cursor-pointer" onClick={()=>goTo('OFFER', offer)}><img src={BackSvg} alt="back"/> go back</span>
            <span className="close cursor-pointer" onClick={()=>goTo('START')}><img src={CloseSvg} alt="close"/></span>
            </div>
            <div className="loan-review">
                <p className="--text">Loan Summary</p>
                <div className="loan-summary">
                    <div className="table-row">
                        <p className="key">Loan Amount</p>
                        <p className="value"><span>&#8358;</span>{formatNumber(parseFloat(calculatedLoanOffer?.amount))}</p>
                    </div>
                    <div className="table-row">
                        <p className="key">Interest</p>
                        <p className="value"><span>&#8358;</span>{formatNumber(parseFloat(calculatedLoanOffer?.repayment.totalinterest))}</p>
                    </div>
                    <div className="border"></div>
                    <div className="table-row">
                        <p className="key">Total Repayment</p>
                        <p className="value"><span>&#8358;</span>{formatNumber(parseFloat(calculatedLoanOffer?.repayment.totalamount))}</p>
                    </div>
                </div>
                <p className="--text">Repayment Schedule</p>
                <div className="repayment-schedule">
                    <table>
                        <tr>
                            <th>Payment Date</th>
                            <th>Payment Amount</th>
                            <th>Balance</th>
                        </tr>
                        <tbody>
                        {
                            calculatedLoanOffer ? calculatedLoanOffer.repayment.schedule.map( item =>
                                <tr className="table-row">
                                    <td>{item.date}</td>
                                    <td><span>&#8358;</span>{formatNumber(parseFloat(item.repaymentamount))}</td>
                                    <td><span>&#8358;</span>{formatNumber(parseFloat(item.endingbalance))}</td>
                                </tr>
                            )
                                : null
                        }

                        </tbody>
                    </table>
                </div>
                <div className="mt-4">
                    <Button text={process ? 'Processing...' : 'Accept / Send Loan Offer for Review'} full className="btn" onClick={()=>save()}/>
                </div>
            </div>
        </motion.div>

        </AnimatePresence>
    );
};

Offers.propTypes = {
    offersCount: PropTypes.number,
    goTo: PropTypes.func,
    show: PropTypes.bool,
    offers: PropTypes.array,
    offer: PropTypes.any,
    calculatedLoanOffer: PropTypes.any,
    alertError: PropTypes.any,
};
const mapStateToProps = (state) => ({
    user_details: state.data.user_details,
});

export default connect(mapStateToProps,{})(Offers);
