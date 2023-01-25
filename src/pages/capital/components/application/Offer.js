import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";
import CloseSvg from "assets/images/svg/closeSvg.svg"
import BackSvg from "assets/images/svg/back-left.svg"
import { motion, AnimatePresence } from "framer-motion"
import {formatNumber} from "utils";
import {Slider} from "rsuite";
import Button from "components/button";
import {calculateLoanOffer} from "services/capitalService";

const Offers = ({ goTo, show, offer }) => {

    const [amount, setAmount] = useState();
    const [duration, setDuration] = useState();
    const [repaymentPeriodRange, setRepaymentPeriodRange] = useState();
    const [minRepaymentPeriodRange, setMinRepaymentPeriodRange] = useState(1);
    const [width, setWidth] = useState();
    const [period, setPeriod] = useState('MONTH');
    const [minAmount, setMinAmount] = useState();
    const [maxAmount, setMaxAmount] = useState();
    const [process, setProcess] = useState(false);

    const getPeriod = (type = 'adj') => {
      if (period === 'MONTH' || period === 'MONTHS'){
          return type === 'adj' ? 'Monthly' : 'Months';
      }else if (period === 'YEAR' || period === 'YEARS'){
          return type === 'adj' ? 'Yearly' : 'Years';
      }else if (period === 'WEEK' || period === 'WEEKS'){
          return type === 'adj' ? 'Week' : 'Weeks';
      }
    }

    useEffect( ()=>{
        if (offer)
        {
            setPeriod(offer.tenorunit)
            setAmount(parseInt(offer.minimumamount))
            setMinAmount(parseInt(offer.minimumamount))
            setMaxAmount(parseInt(offer.maximumamount))
            setRepaymentPeriodRange(parseInt(offer.tenor))
            setDuration(parseInt(offer.tenor))
            setWidth(parseInt(offer.tenor / offer.tenor * 100))
        }
    }, [offer]);

    const calculateLoan = () => {
        setProcess(true)
        calculateLoanOffer(offer, amount, repaymentPeriodRange)
            .then(res=>{
                setProcess(false)
                if (res){
                    goTo('OFFER_REVIEW', offer, res.loan[0].borrower[0].product[0].application[0])
                }

        })
            .catch(e=>{
                setProcess(false)
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
            <span className="back cursor-pointer" onClick={()=>goTo('OFFERS')}><img src={BackSvg} alt="back"/> return to loan offers</span>
            <span className="close cursor-pointer" onClick={()=>goTo('START')}><img src={CloseSvg} alt="close"/></span>
            </div>

            <div className="repayment-details">
                <p className="frequency">{getPeriod()} Repayment</p>
                <p className="amount"><span>&#8358;</span>{formatNumber(amount)}</p>
            </div>
            <div className="offer-details">
                <p className="--text">Our offer for you is:</p>
                <input className="--amount" type="text" value={(amount)} onChange={v=>setAmount(v.target.value)}/>
                <div className="amount-range">
                    <span>Min : ₦{formatNumber(minAmount)}</span>
                    <span>Max : ₦{formatNumber(maxAmount)}</span>
                </div>
                <div className="bottom-actions">
                    <div className="range-duration">
                        <p className="text">For how long?</p>
                        <p className="duration-selected">Selected {getPeriod('plural')} : {repaymentPeriodRange}</p>
                    </div>
                    <div className="repayment-period-range" style={{width:`${width}%`}}>
                        <span>{minRepaymentPeriodRange} {period}</span>
                        <span>{repaymentPeriodRange} {period}</span>
                    </div>
                    <div className="cost-slider">
                        <Slider
                            graduated
                            progress
                            defaultValue={repaymentPeriodRange}
                            onChange={value => {
                                setRepaymentPeriodRange(value)
                                // if (value > 2){
                                //     setWidth(value / repaymentPeriodRange * 100)
                                // }
                            }}
                            min={minRepaymentPeriodRange}
                            max={duration}
                            tooltip={false}
                            barClassName="slider-bar"
                            handleClassName="slider-handle"
                            value={repaymentPeriodRange}
                        />
                    </div>
                    <div className="loan-amount-note">
                        Hey, we’ve selected the best loan duration for convenient repayments.
                        Changing it will change the amount you can borrow.
                        The maximum loan amount is at the bottom right of the box
                    </div>
                    <div>
                        <Button text={process ? 'Processing...' : 'Proceed to Application' } full className="btn"  onClick={()=>calculateLoan()}/>
                    </div>
                </div>
            </div>
        </motion.div>

        </AnimatePresence>
    );
};

Offers.propTypes = {
    goTo: PropTypes.func.isRequired,
    show: PropTypes.bool,
    offer: PropTypes.any,
};

export default Offers;
