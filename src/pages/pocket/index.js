import React, { useState, useEffect } from "react";
import SideNav from "./components/SideNav";
import Content from "./components/Content";
import FundPocketModal from "../wallets/components/pocketTransferModal";
import { connect } from "react-redux";
import { playCheckout } from "../../utils/js/checkout";
import {alertError, alertInfo, alertSuccess} from "../../modules/alert";
import { useTranslation } from "react-i18next";
import { fetchBusinessPocketBalance } from "../../actions/pocketActions";
import { useHistory } from "react-router";

const Index = (props) => {
  const [tab, setTab] = useState("POCKET_OVERVIEW");
  const [isOpenFundPocket, setIsOpenFundPocket] = useState(false);
  const [amount, setAmount] = useState();
  const { t } = useTranslation();
  let history = useHistory();

  const [pocketReference, setPocketReference] = useState("");
  const [pocketStaticAccount, setPocketStaticAccount] = useState("");
  const {
    country,
    default_currency,
    primaryUser,
    phone_number,
    setting,
    test_public_key,
    live_public_key,
  } = props.business_details;

  const close = (close) => {
    setAmount();
  };
  // const PocketContext = createContext({setIsOpenFundPocket , setPocketReference});
  const callback = (response, closeModal) => {
    if (response.code === "00") {
      props.fetchBusinessPocketBalance("TODAY");
      closeModal && closeModal();
      alertSuccess("Success! Your pocket has been funded");
    } else {
      alertError("Unable to complete the transaction. Kindly try again");
      closeModal && closeModal();
    }
  };
  const showCheckout = () => {
    if (amount) {
      setIsOpenFundPocket(false);
      playCheckout({
        tranref: Math.random().toString(36).substr(2),
        country: country.countryCode,
        currency: default_currency,
        pocketReference: pocketReference,
        amount: amount,
        description: t("Fund Merchant Pocket"),
        full_name: primaryUser.first_name + " " + primaryUser.last_name,
        email: primaryUser.email,
        mobile_no: phone_number,
        public_key: setting.mode === "TEST" ? test_public_key : live_public_key,
        callback,
        close,
      });
    }
  };

  const startFunding = (pocketReferenceId) => {
      if (props.business_details?.pocketServiceConfig?.status === 'ACTIVE'){
        if (props.data?.pocketAccount?.pocketReferenceId){
          setPocketReference(pocketReferenceId);
          setIsOpenFundPocket(true);
        } else {
          alertInfo('Pocket service is inactive for your business')
        }
      } else {
        alertInfo('Pocket service is inactive for your business')
      }
  };
  useEffect(() => {
    if (props.data) {
      if (props.data.pocketAccount) {
        setPocketStaticAccount(
          props.data.pocketAccount.businessPocketAccountNumber
        );
      }
    }
  }, [props.data]);

  return (
    <div className="page-container py-5">
      <FundPocketModal
        isOpen={isOpenFundPocket}
        close={(v) => setIsOpenFundPocket(false)}
        // wallet_payouts={props.wallet_payouts}
        transferAccount={pocketStaticAccount}
        amount={amount}
        setAmount={setAmount}
        config={
          props.business_details
            ? props.business_details.pocketServiceConfig
            : null
        }
        setShowCheckout={() => showCheckout()}
        country={country}
      />
      <div className="pockets-container">
        <div className="sections">
          <SideNav setTab={(url) => history.push(url)} tab={tab} />
          <Content tab={tab} fundPocket={startFunding} setTab={setTab} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user_details: state.data.user_details,
  business_details: state.data.business_details,
  data: state.pocket.business_pocket_balance,
});

export default connect(mapStateToProps, { fetchBusinessPocketBalance })(Index);
