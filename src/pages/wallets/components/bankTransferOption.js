import React from 'react';
import PropTypes from 'prop-types';
import BankTransferDetailsNigeria from "./BankTransferDetailsNigeria";

const BankTransferOption = ( {countryCode, businessPocketAccountNumber}) => {

    return (
        <React.Fragment>
            {
                countryCode === 'NG' ?
                    <React.Fragment>
                        <div className="py-1 font-weight-bold d-inline-block">Fund via Bank Transfer</div>
                        <p className="m-0 font-12 mb-2">Transfer the amount you wish to fund your Pocket Account with, using
                            the account details provided below</p>
                    <BankTransferDetailsNigeria
                        businessPocketAccountNumber={businessPocketAccountNumber}
                    />
                    </React.Fragment>
                    :
                    null
            }
        </React.Fragment>
    );
};

BankTransferOption.propTypes = {
    businessPocketAccountNumber: PropTypes.string,
    countryCode: PropTypes.string,
}

export default BankTransferOption;
