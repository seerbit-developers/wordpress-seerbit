import React, {useState} from 'react';
import PropTypes from "prop-types";
import CloseSvg from "assets/images/svg/closeSvg.svg"
import BackSvg from "assets/images/svg/back-left.svg"
import { motion, AnimatePresence } from "framer-motion"
import {formatNumber} from "utils";
import {Slider} from "rsuite";
import Button from "../../../../components/button";
const Complete = ({offersCount = 5, goTo, show,offers}) => {
    const [amount, setAmount] = useState(50000)
    const [duration, setDuration] = useState(5)
    const [repaymentPeriodRange, setRepaymentPeriodRange] = useState(5)
    const [minRepaymentPeriodRange, setMinRepaymentPeriodRange] = useState(0)
    const [width, setWidth] = useState(repaymentPeriodRange / 12 * 100)
    const [period, setPeriod] = useState('MONTH')
    const getPeriod = (type = 'adj') => {
      if (period === 'MONTH'){
          return type === 'adj' ? 'Monthly' : 'Months';
      }else if (period === 'YEAR'){
          return type === 'adj' ? 'Yearly' : 'Years';
      }
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
            {/*<span className="back cursor-pointer" onClick={()=>goTo('OFFER_REVIEW')}><img src={BackSvg} alt="back"/> go back</span>*/}
            <span className="close cursor-pointer" onClick={()=>goTo('START')}><img src={CloseSvg} alt="close"/></span>
            </div>
            <div className="application-complete">
                <div className="svg-container">
                    <svg className="ft-green-tick" xmlns="http://www.w3.org/2000/svg" height="100" width="100"
                         viewBox="0 0 48 48" aria-hidden="true">
                        <circle className="circle" fill="#5bb543" cx="24" cy="24" r="22"/>
                        <path className="tick" fill="none" stroke="#FFF" stroke-width="6" stroke-linecap="round"
                              stroke-linejoin="round" stroke-miterlimit="10" d="M14 27l5.917 4.917L34 17"/>
                    </svg>
                </div>
                <h5>Your Offer has been sent for Review</h5>
            </div>
        </motion.div>

        </AnimatePresence>
    );
};

Complete.propTypes = {
    offersCount: PropTypes.number,
    goTo: PropTypes.func,
    show: PropTypes.bool,
    offers: PropTypes.array,
};

export default Complete;
