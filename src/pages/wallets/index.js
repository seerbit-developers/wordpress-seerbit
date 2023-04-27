/** @format */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getWalletTransaction,
  walletTopUp,
  setErrorLog,
  searchPocketTransaction,
  clearState,
} from "actions/postActions";
import { isEmpty } from "lodash";
import { CSVLink } from "react-csv";
import { Button } from "react-bootstrap";
import TopUpWallet from "modules/wallet_top_up";
import TopUpPocket from "modules/pocket_top_up";
import Brand from "utils/strings/brand.json";
import Details from "modules/details";
import moment from "moment";
// import { Can } from "modules/Can";
import { useTransition, animated } from "react-spring";
import { playCheckout } from "utils/js/checkout";
import FundPocketModal from "./components/pocketTransferModal";
import styled from "styled-components";
import "./css/wallet.scss";
import { Credit } from "./credit";
import {alertError, alertSuccess} from "../../modules/alert";

const Counter = styled.span`
  color: #bababa;
  font-size: 12px;
  font-weight: 400;
  margin-left: 1em;
`;
const Gap = styled.div`
  padding-bottom: 2em;
  padding-top: 1em;
`;


function formatNumber(num) {
  return Number(num)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function WalletPage(props) {
  const { business_details, white_label } = props;
  const { checkoutPageConfig } = business_details;
  const brand_label = props.white_label || Brand.default;

  let background_color =
    (checkoutPageConfig && checkoutPageConfig.backgroundColor) ||
    brand_label.background_color;
  let button_color =
    (checkoutPageConfig && checkoutPageConfig.paybuttonColor) ||
    brand_label.button_color;
  let border_color =
    (checkoutPageConfig && checkoutPageConfig.paychannelColor) ||
    brand_label.border_color;

  const [logo, setLogo] = useState(business_details.logo);
  const [perPage, setPerPage] = useState(25);
  const [show_top_up, setShowTopUp] = useState(false);
  const [show_top_up_pocket, setShowTopUpPocket] = useState(false);
  const [show_overview, setOverview] = useState(false);
  const [details, setDetails] = useState([]);
  const [topUpProcessing, setTopUpProcessing] = useState(false);
  const [process, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show_filter, setShowFilter] = useState(false);
  const [dates, setDates] = useState([]);
  const [amount, setAmount] = useState();

  const [isOpenFundPocket, setIsOpenFundPocket] = useState(false);

  const close = (close) => {
    setAmount();
  };

  const callback = (response, closeModal) => {
    if(response.code === '00'){
      closeModal()
      alertSuccess('Your pocket has been funded')
      props.getWalletTransaction({
        type: "ALL",
        start: 1,
        size: perPage,
      });
    }else{
     alertError('Unable to complete the transaction. Kindly try again.')
    }

  };
  const {
    country,
    default_currency,
    primaryUser,
    phone_number,
    setting,
    test_public_key,
    live_public_key,
  } = props.business_details;


  useEffect(() => {
    if (!show_filter) {
      props.getWalletTransaction({
        type: "ALL",
        start: 1,
        size: perPage,
      });
    }
  }, [show_filter]);

  const showCheckout = () => {
    //   setting.mode === "TEST" ? test_public_key : live_public_key,
    //   "----",
    //   setting.mode
    // );
    if (amount) {
      playCheckout({
        tranref: Math.random().toString(36).substr(2),
        country: country.countryCode,
        currency: default_currency,
        pocketReference:
          (props &&
            props.wallet_payouts &&
            props.wallet_payouts.payload &&
            props.wallet_payouts.payload.account.pocketReferenceId) ||
          0,
        amount: amount,
        description: "Fund Merchant Pocket",
        full_name: primaryUser.first_name + " " + primaryUser.last_name,
        email: primaryUser.email,
        mobile_no: phone_number,
        public_key: setting.mode === "TEST" ? test_public_key : live_public_key,
        customization: {
          theme: {
            name: "Seerbit Checkout",
            border_color: border_color
              ? border_color.indexOf("#") == 0
                ? border_color
                : "#" + border_color
              : "#429df4",
            background_color: background_color
              ? background_color.indexOf("#") == 0
                ? background_color
                : "#" + background_color
              : "#ffffff",
            button_color: button_color
              ? button_color.indexOf("#") == 0
                ? button_color
                : "#" + button_color
              : "#3e98ef",
          },
          display_fee: setting.display_fee,
          display_type: "embed",
          logo,
        },
        callback,
        close,
      });
    }
  };

  const filter = (
    from_date = dates[0],
    to_date = dates[1],
    page = 1,
    range = perPage
  ) => {
    const from = from_date
      ? moment(from_date).format("DD-MM-yyyy")
      : "01-01-2019";
    const to = to_date
      ? moment(to_date).format("DD-MM-yyyy")
      : moment().format("DD-MM-yyyy");
    setProcessing(true);
    setActiveOption("filter");
    const data = {
      endDate: to,
      startDate: from,
    };
    props.searchPocketTransaction(data);
  };

  const onRowClick = (e) => {

  };

  const changePage = (from = 1) => {
    props.getWalletTransaction({
      type: "ALL",
      start: from,
      size: perPage,
    });
  };

  const headers = [
    { label: "Date", key: "payout.requestDate" },
    { label: "Reference", key: "payout.transactionReference" },
    { label: "Amount", key: "payout.amount" },
    { label: "Balanace", key: "currentBalance" },
    { label: "Transfer Source", key: "type" },
    { label: "Status", key: "status" },
  ];

  let transactions_array = [
    [
      { text: "Date", style: "tableHeader" },
      { text: "Reference", style: "tableHeader" },
      { text: "Amount", style: "tableHeader" },
      { text: "Balanace", style: "tableHeader" },
      { text: "Transfer Source", style: "tableHeader" },
      { text: "Status", style: "tableHeader" },
    ],
    [
      { pointer: "payout.requestDate" },
      { pointer: "payout.transactionReference" },
      { pointer: "payout.amount" },
      { pointer: "currentBalance" },
      { pointer: "type" },
      { pointer: "status" },
    ],
  ];

  useEffect(() => {
    if (props.error_details && props.location === "wallet_payouts") {
      alertError(props.error_details.message);
    }
  }, [props.error_details]);

  const downloadTemplate = (option) => {
    if (option.value === 1)
      return (
        <div className="my-1 font-12 font-weight-bold">
          <CSVLink
            data={
              (props.wallet_payouts &&
                props.wallet_payouts.payload &&
                props.wallet_payouts.payload.accountHistory) ||
              []
            }
            headers={headers}
            filename={`${new Date().getTime()}-product_category.csv`}
          >
            <span style={{ color: "#333333" }}>{option.text}</span>
          </CSVLink>
        </div>
      );

  };

  useEffect(() => {
    if (props.wallet && props.location === "wallet-top-up") {
      setTopUpProcessing(false);
      alertSuccess(props.wallet.responsemessage);
    }
    setProcessing(false);
  }, [props.wallet]);

  useEffect(() => {
    if (
      props.error_details &&
      props.error_details.error_source === "wallet-top-up"
    ) {
      setTopUpProcessing(false);
      alertError(props.error_details.message || "Can't complete action at the moment");
    }
    setProcessing(false);
  }, [props.error_details]);

  const setRange = (page = perPage) => {
    props.getWalletTransaction({ size: page, start: 1 });
    setProcessing(true);
  };

  useEffect(() => {
    setLoading(true);
    if (!isEmpty(props.wallet_payouts)) setLoading(false);
    if (!isEmpty(props.error_details)) setLoading(false);
  }, [props.wallet_payouts, props.error_details]);

  const filterTransitions = useTransition(!show_filter, null, {
    from: { opacity: 0, marginRight: -25, marginLeft: 25 },
    enter: {
      opacity: 1,
      marginRight: 0,
      marginLeft: 0,
    },
    leave: { opacity: 0, marginRight: -10, marginLeft: 10 },
  });

  const canFundPocket = () => {
    return (
      props.wallet_payouts &&
      props.wallet_payouts.payload &&
      props.wallet_payouts.payload.account &&
      props.wallet_payouts.payload.account.businessPocketAccountNumber
    );
  };

  const openFundPocketModal = () => {
    if (canFundPocket()) {
      // setShowTopUp(true);
      // setShowTopUpPocket(true);
      setIsOpenFundPocket(true);
    }
  };


  return (
      <div className="page-container">
      <FundPocketModal
        isOpen={isOpenFundPocket}
        close={(v) => setIsOpenFundPocket(v)}
        wallet_payouts={props.wallet_payouts}
        transferAccount={isEmpty(props.wallet_payouts.payload) ? '' :
            props.wallet_payouts.payload.account?.businessPocketAccountNumber}
        amount={amount}
        setAmount={setAmount}
        config={
          props.business_details
            ? props.business_details.pocketServiceConfig
            : null
        }
        setShowCheckout={() => showCheckout()}
        country={country}
        // roles={roles ? roles.payload : []}
        // processInvite={processInvite}
        // onInvite={onInvite}
        // edit={r=>editRole(r)}
        // createCustomRole={()=>setIsOpenCreateRole(true)}
      />
      <div  className="py-5">
        <div className="font-medium pb-3 font-20 text-black">
          Pocket Transactions
          <Counter>
            Fund History{" "}
            {(props.wallet_payouts && props.wallet_payouts.rowCount) || 0}
          </Counter>
        </div>
        <Gap>
          <div className="container-fluid">
            <div className="row">
              <div className="">
                <div
                  className="paymentstate-box row px-2 py-3 ml-0 border br-normal hisx-boxx"
                  // style={{ width: "374px", height: "100px" }}
                >
                  <div className="col-6 xhxx">
                    <div className="tiltx">
                      <small className="text-muted font-12">
                        {props.business_details.default_currency} Pocket Balance
                      </small>
                      <div className="font-weight-bold sbt-deep-color font-18">
                        {formatNumber(
                          (props.wallet_payouts &&
                            props.wallet_payouts.payload &&
                            props.wallet_payouts.payload.account &&
                            props.wallet_payouts.payload.account.balance) ||
                            0
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-6 cbxx">
                    <div className="text-center  py-4">
                      <Button
                        variant="xdh"
                        height={"30px"}
                        className="brand-btn font-11"
                        style={{ width: "130px", minHeight: "30px" }}
                        // disabled={canFundPocket()}
                        onClick={(e) => {
                          openFundPocketModal();
                        }}
                      >
                        Fund your pocket
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Gap>
        <Credit
          loading={loading}
          setRange={setRange}
          props={props.wallet_payouts}
          search={props.search_pocket_transaction}
          headers={headers}
          perPage={perPage}
          setOverview={setOverview}
          setDetails={setDetails}
          setPerPage={setPerPage}
          changePage={changePage}
          onRowClick={onRowClick}
          currency={props.business_details.default_currency}
        />

      </div>
      {show_top_up && (
        <TopUpWallet
          show_top_up={show_top_up}
          close={() => setShowTopUp(false)}
          walletTopUp={props.walletTopUp}
          wallet={props.wallet}
          business_details={props.business_details}
          inProcess={topUpProcessing}
          setInProcess={setTopUpProcessing}
          location={props.location}
        />
      )}
      {show_top_up_pocket && (
        <TopUpPocket
          show_top_up_pocket={show_top_up_pocket}
          close={() => setShowTopUpPocket(false)}
          wallet_payouts={props.wallet_payouts}
          amount={amount}
          setAmount={setAmount}
          config={
            props.business_details
              ? props.business_details.pocketServiceConfig
              : null
          }
          setShowCheckout={() => showCheckout()}
        />
      )}
      {show_overview && (
        <Details
          isOpen={show_overview}
          close={() => setOverview(false)}
          details={details}
          business_details={props.business_details}
          location={props.location}
        />
      )}
    </div>
  );
}

WalletPage.propTypes = {
  getWalletTransaction: PropTypes.func.isRequired,
  walletTopUp: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  error_details: state.data.error_details,
  user_details: state.data.user_details,
  business_details: state.data.business_details,
  location: state.data.location,
  wallet: state.data.wallet,
  wallets: state.data.wallets,
  wallet_payouts: state.data.wallet_payouts,
  white_label: state.data.white_label,
  search_pocket_transaction: state.data.search_pocket_transaction,
});

export default connect(mapStateToProps, {
  clearState,
  getWalletTransaction,
  searchPocketTransaction,
  walletTopUp,
  setErrorLog,
})(WalletPage);
