import React from "react";
import { isEmpty } from "lodash";
import AppModal from "components/app-modal";
import Button from "components/button";
import styled from "styled-components";

import BankTransferOption from "./bankTransferOption";
import {useTranslation} from "react-i18next";
const SubHead = styled.span`
  display: block;
  font-size: 15px;
  color: #676767;
  line-height: 2;
`;

const Error = styled.div`
  color: #C10707;
  font-size: 15px;
  line-height: 1
  font-weight: normal;
  margin-top: .2em;
`;

const FundPocketModal = ({
  isOpen,
  close,
  wallet_payouts,
  amount,
  setAmount,
  setShowCheckout,
  config,
  country,
  transferAccount
}) => {
  const [errorMsg, setErrorMsg] = React.useState(null);
  const { t } = useTranslation();
  const handleTopUp = () => {
    if (!amount) {
      setErrorMsg('An amount is required to credit your pocket');
    } else {
      setShowCheckout(true);
      close()
    }
  }

  const updateAmount = (val)=>{
    setErrorMsg(null);
    setAmount(val);
  }



  return (
    <AppModal
      title={"Pocket funding"}
      isOpen={isOpen}
      close={() => close(false)}
    >
      {config && config.fundingCharge > 0 &&
            <div className="font-12 mt-2  mb-3 text-danger font-italic">
              {config.fundingCharge ? 'Please note that you will be charged a fee of '+config.fundingCharge : ''} {config.fundingChargeType ? config.fundingChargeType !== 'FIXED' ? '%' : 'Naira' : '' }
            </div>
            }
       <div className="w-100">
          <div className="">
            <BankTransferOption
                businessPocketAccountNumber={transferAccount}
                countryCode={isEmpty(country.countryCode) ? '' : country.countryCode}
            />
            <strong>{t('Fund via Checkout')}</strong>
            <SubHead className="my-3">
              <label className="font-12 mb-0">{t('Amount')}</label>
              <input
                className={`form-control mh-40 py-2 ${errorMsg ? 'border-error' : ''}`}
                type="text"
                name="amount"
                pattern="[+-]?([0-9]*[.])?[0-9]+"
                onChange={(e) => { updateAmount(e.target.value) }}
                // value={amount}
                required
              />
              {errorMsg ? <p className="text-danger font-12 m-0"> {errorMsg}</p> : ''}
            </SubHead>
            <div className="form-group mh-40">
              <Button
                variant="xdh"
                size="lg"
                block
                height={"10px"}
                full={true}
                className="brand-btn"
                // disabled={!amount}
                aria-disabled={!amount}
                onClick={() => handleTopUp()}
              >
                {t('Fund pocket')}
                </Button>
            </div>
          </div>
        </div>
    </AppModal>
  );
};

export default FundPocketModal;
