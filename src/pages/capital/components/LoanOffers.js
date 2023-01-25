import React, {useEffect, useState} from 'react';
import Start from "./application/Start";
import Offers from "./application/Offers";
import Offer from "./application/Offer";
import OfferReview from "./application/OfferReview";
import Complete from "./application/Complete";
import {getLoanOffers} from "services/capitalService";
const LoanOffers = () => {
    const [height, setHeight] = useState(null);
    const [offersCount, setOffersCount] = useState(0);
    const [tab, setTab] = useState('START');
    const [offers, setOffers] = useState();
    const [offer, setOffer] = useState(null);
    const [calculatedLoanOffer, setCalculatedLoanOffer] = useState(null);

    function calcHeight(el) {
        const height = el.offsetHeight + 100;
        setHeight(height);
    }
    const goTo = (t, offer=null, offerCalculated=null)=>{
        setTab(t)
        setOffer(offer)
        setCalculatedLoanOffer(offerCalculated)
    }

    useEffect( ()=>{
        getLoanOffers().then(res=>{
            if (res){
                setOffers(res.loan[0].lender)
                setOffersCount(res.loan[0].lender.length)
            }
        })
    }, [])


    return (
        <div className="application-section">
            {tab==='START' && <Start goTo={goTo} show={tab==='START'}/> }
            { tab==='OFFERS' && <Offers goTo={goTo}  show={tab==='OFFERS'} offers={offers} offersCount={offersCount}/> }
            { tab==='OFFER' && <Offer
                goTo={goTo}
                show={tab==='OFFER'}
                offers={offers}
                offer={offer}
            /> }
            { tab==='OFFER_REVIEW' && <OfferReview
                goTo={goTo}
                show={tab==='OFFER_REVIEW'}
                offer={offer}
                offers={offers}
                calculatedLoanOffer={calculatedLoanOffer}
            /> }
            { tab==='COMPLETE' && <Complete goTo={goTo}  show={tab==='COMPLETE'} offer={offer} offers={offers} offersCount={offersCount}/> }

        </div>
    );
};

export default LoanOffers;
