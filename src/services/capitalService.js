import { getRequestWithToken, postRequestWithToken } from "./apiService";

const BASE_URL = 'http://ec2-18-130-51-162.eu-west-2.compute.amazonaws.com/sbt-capital-loan/api/v1/'
const TOKEN = 'b85ba006-d680-3aef-af0d-90805cb95b2a'

const getLoanOffers = async () => {
    const url = `borrower/loan/offers`
    return getRequestWithToken(`${BASE_URL}${url}`, TOKEN)
}

const getLoanApplications = async () => {
    const url = `borrower/loan/applications`
    return getRequestWithToken(`${BASE_URL}${url}`, TOKEN)
}

const getFrequency = (offer)=>{
    return (offer.tenorunit === 'MONTHS' || offer.tenorunit === 'month') ? 'MONTHLY' :
        offer.tenorunit === 'WEEKS' ? 'WEEKLY' :
            offer.tenorunit === 'YEAR' ? 'YEARLY' : null
}

const getTenorUnit = (offer)=>{
    return (offer.tenorunit === 'MONTHS' || offer.tenorunit === 'month') ? 'MONTHS' :
        offer.tenorunit === 'WEEKS' ? 'WEEKS' :
            offer.tenorunit === 'YEAR' ? 'YEARS' : null
}

const calculateLoanOffer = async (offer, amount, duration) => {

    const url = `loan/calculate`
    const p =
        {
            "loan": [
                {
                    "borrower": [
                        {
                            "product": [
                                {
                                    "code": offer.code,
                                    "application": [
                                        {
                                            "amount":amount,
                                            "currency": "NGN",
                                            "tenorunit": getTenorUnit(offer),
                                            "tenor": duration,
                                            "repayment": {
                                                "frequency":getFrequency(offer),
                                                "amount": amount/duration
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    return postRequestWithToken(`${BASE_URL}${url}`,p, TOKEN)
}


const acceptLoanOffer = async (offer, amount, tenorunit, duration) => {
    const url = `loan/create`;
    const p =
        {
            "loan": [
                {
                    "borrower": [
                        {
                            "product": [
                                {
                                    "code": offer.code,
                                    "application": [
                                        {
                                            "amount": amount,
                                            "currency": "NGN",
                                            "vertical": "E-COMMERCE",
                                            "purpose": "test",
                                            "tenorunit": tenorunit,
                                            "tenor": duration
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    return postRequestWithToken(`${BASE_URL}${url}`,p, TOKEN)
}

export {
    getLoanOffers,
    calculateLoanOffer,
    acceptLoanOffer,
    getLoanApplications
}
