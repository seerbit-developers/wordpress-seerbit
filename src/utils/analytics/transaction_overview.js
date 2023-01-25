/** @format */

import React, { useState, useEffect } from "react";
import TransactionEvents from "./sbt_events";
import { isEmpty } from "lodash";
import { useSpring, animated } from "react-spring";
import moment from "moment";
import ReactCountryFlag from "react-country-flag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  clearState,
  searchVendor
} from "../../actions/postActions";
import { connect } from "react-redux";
import {
  faChevronLeft,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { Can } from "../../modules/Can";
import Conversations from "../../modules/dispute_conversations";
import { DisputeResponse, DisputeStatus } from "../../modules/resolve_dispute";
import Refund from "../../modules/refund";
import styled from "styled-components";
import "../../assets/styles/transaction.overview.scss";

const Wrapper = styled.div`
  background: #fff;
  width: 100%;
  padding-left: 3em;
  min-height: calc(100vh - 90px);
`;
const Go = styled.span`
  display: block;
  font-size: 14px;
  color: #3f99f0;
  font-weight: 500;
  padding-top: 10px;
`;
const DisputeLayer = styled.div`
  position: fixed;
  right: 0;
  height: 100vh;
  width: 400px;
  top: 0;
`;
const Wrap = styled.div`
  background: #f5f7fa;
  border-radius: 2px;
  padding: 1em;
  line-height: 1.5;
  .title {
    color: #000000;
    font-weight: 500;
    font-size: 16px;
  }
  .text-body {
    .text {
      color: #474646;
      float: right;
      font-size: 16px;
    }
    .label {
      color: #6b6b6b;
      font-size: 16px;
    }
  }
  .text-body.pb-2 {
    line-height: 2 !important;
  }
  table {
    border: none !important;
    background: transparent !important;
    td:first-child,
    th {
      box-shadow: none !important;
      background: transparent !important;
      font-size: 1em !important;
      color: #676767 !important;
      font-weight: 500 !important;
      padding: 0.8em;
    }
    td {
      padding: 0.5em !important;
    }

    tr {
      line-height: 1;
    }
    td:last-child {
      line-height: 1.7;
      border-top: 3px solid #676767;
    }
  }
`;
const NavMenuItem = styled.div`
  padding: 3.5em 4.5em 3.5em 0em;
  font-size: 1.1em;
  color: #676767 !important;
`;
const CloseTag = styled.div`
  font-size: 0.9em;
  color: #c2c2c2 !important;
  display: flex;
  .icon {
    font-size: 1.2em;
  }
  padding-bottom: 3em;
  cursor: pointer;
`;
const RightComponent = styled.div`
  float: right;
`;

const Gap = styled.div`
  padding-bottom: 2em;
  padding-top: 1em;
`;
const Space = styled.div`
  padding-bottom: 0.5em;
  padding-top: 0.5em;
`;

const Raise = styled.a`
  color: #ff5f00 !important;
  font-size: 14px;
  font-weight: 600;
`;

const Clear = styled.div`
  clear: both;
`;

export function TransactionOverview({
  setShowOverview,
  props,
  addRefund,
  refund_success,
  closeSuccess,
  replyDispute,
  canRaiseRefund,
  openRefund,
  setRefund,
  transactionChannel,
  search_vendor,
  searchVendor
}) {
  const [eventTrigger, setEvent] = useState(true);
  const [customerTrigger, setCustomer] = useState(true);
  const [historyTrigger, setHistory] = useState(true);
  const [basicTrigger, setBasic] = useState(true);
  const [branchTrigger, setBranch] = useState(true);
  const [perPage, setPerPage] = useState(25);
  const [show_dispute, setShowDispute] = useState(false);
  const [dispute, setDispute] = useState();
  const [message, setMessage] = useState("");
  const [image_upload, setImageUpload] = useState();

  const [refundProcess, setRefundProcess] = useState(false);

  const [error, setError] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [time, setTime] = useState(0);

  const formatNumber = (a) => a;

  const firstColumn = useSpring({
    from: { opacity: 0, marginLeft: -25, marginRight: 25 },
    opacity: 1,
    marginLeft: 0,
    marginRight: 0,
  });

  const secondColumn = useSpring({
    from: { opacity: 0, marginTop: -25, marginBottom: 25 },
    opacity: 1,
    marginTop: 0,
    marginBottom: 0,
  });

  const thirdColumn = useSpring({
    from: { opacity: 0, marginRight: -25, marginLeft: 25 },
    opacity: 1,
    marginRight: 0,
    marginLeft: 0,
  });

  useEffect(() => {
    if (props && props.vendorId) {
      searchVendor({
        size: perPage,
        start: 1,
        searchParam: props.vendorId
      })
    }
  }, [props])

  const preAuthType =
    (props.preAuthType &&
      props.preAuthType.replace("_", " ").toLowerCase()) ||
    "";
  const preAuthCapitalized =
    preAuthType.charAt(0).toUpperCase() +
    preAuthType.slice(1);

  return (
    <Wrapper className="sbt-transaction-overview">
      <NavMenuItem>
        <CloseTag
          onClick={(e) => {
            setShowOverview();
          }}
        >
          <FontAwesomeIcon
            className="cursor-pointer"
            icon={faChevronLeft}
            className="mt-1"
          />{" "}
          <span className="ml-1 mb-2">return to transactions</span>
        </CloseTag>
        <div className="font-medium pb-3 font-20 text-black">
          <div className="container-fluid">
            <div className="row">
              <div className="col-6 pl-0 font-medium">
                Transaction Overview
                <Go>
                  <span className="text-uppercase">{props.transactionRef}</span>{" "}
                  -{" "}
                  <span
                    className={` mb-1 ${props.refundList && props.refundList.length > 0
                      ? "refund"
                      : (props.gatewayResponseMessage === "APPROVED" ||
                        props.gatewayResponseMessage === "Successful") &&
                        (props.gatewayResponseCode === "00") &&
                        (props.status === "COMPLETED" || props.status === "SETTLED")
                        ? "success"
                        : ["SM_X23", "SM_A"].indexOf(
                          props.gatewayResponseCode
                        ) > -1
                          ? "default"
                          : "failed"
                      }-transaction`}
                  >
                    {props.transType !== "PREAUTH"
                      ? props.refundList && props.refundList.length > 0
                        ? "Refunded"
                        : (props.gatewayResponseMessage === "APPROVED" ||
                          props.gatewayResponseMessage === "Successful") &&
                          (props.gatewayResponseCode === "00") &&
                          (props.status === "COMPLETED" || props.status === "SETTLED")
                          ? "Successful"
                          : props.gatewayResponseCode === "SM_X23"
                            ? "Expired"
                            : props.gatewayResponseCode === "SM_A"
                              ? "Aborted"
                              : "Failed"
                      : preAuthCapitalized &&
                        preAuthCapitalized !== "Noauth" &&
                        preAuthCapitalized !== "Refund" &&
                        preAuthCapitalized !== "Cancel"
                        ? `${preAuthCapitalized}d`
                        : preAuthCapitalized === "Refund"
                          ? `${preAuthCapitalized}ed`
                          : preAuthCapitalized === "Cancel"
                            ? `${preAuthCapitalized}led`
                            : preAuthCapitalized === "Noauth"
                              ? props.gatewayResponseCode === "00"
                                ? "Captured"
                                : "Failed"
                              : null}
                  </span>
                </Go>
              </div>
              {/* <div className='col-md-6 pr-0'>
								<RightComponent>
									<img src={iconPrint} />
								</RightComponent>
							</div> */}
            </div>
          </div>{" "}
        </div>

        <Gap>
          <div classNam="container-fluid">
            <div className="row">
              <animated.div className="col-4  p-2" style={firstColumn}>
                <Wrap>
                  <div className="title py-2 font-16 font-medium">
                    Transaction Breakdown
                  </div>
                  <div className="text-body py-1">
                    <span className="label">Transaction Amount -</span>
                    <span className="text float-right">
                      {props.currency}{" "}
                      <strong>
                        {formatNumber(Number(props.amount).toFixed(2))}
                      </strong>
                    </span>
                  </div>
                  <div className="text-body py-1">
                    <span className="label">Transaction Fee -</span>
                    <span className="text float-right">
                      {props.currency}{" "}
                      <strong>
                        {formatNumber(Number(props.fee).toFixed(2))}
                      </strong>
                    </span>
                  </div>
                  <hr className="mt-0" />
                  <div className="text-body">
                    <span className="label">Total Due - </span>
                    <span className="text float-right">
                      {props.currency}{" "}
                      <strong>
                        {formatNumber(
                          Number(props.amount - props.fee).toFixed(2)
                        )}
                      </strong>
                    </span>
                  </div>
                </Wrap>
                {
                  search_vendor &&
                  search_vendor.payload &&
                  props.vendorSettlementAmount !== null &&
                  (
                    <div>
                      <Space />
                      <Wrap>
                        <div className="title py-2 font-16 font-medium">
                          Split Share
                        </div>
                        <div className="text-body py-1">
                          <span className="label">
                            Your Commission -
                          </span>
                          <span className="text float-right">
                            {props.currency}{" "}
                            <strong>
                              {formatNumber(
                                Number(props.amount - props.fee).toFixed(2) - Number(props.vendorSettlementAmount.toFixed(2))
                              ) || 0}
                            </strong>
                          </span>
                        </div>
                        <div className="text-body py-1">
                          <span className="label">Sub Account Share -</span>
                          <span className="text float-right">
                            {props.currency}{" "}
                            <strong>
                              {formatNumber(
                                Number(props.vendorSettlementAmount.toFixed(2))
                              ) || 0}
                            </strong>
                          </span>
                        </div>
                        {/* <hr className="mt-0" />
                        <div className="text-body">
                          <span className="label">Amount Due To You - </span>
                          <span className="text float-right">
                            {props.currency}{" "}
                            <strong>
                              {formatNumber(
                                Number(props.amount - props.fee).toFixed(2) - Number(props.vendorSettlementAmount.toFixed(2))
                              ) || 0}
                            </strong>
                          </span>
                        </div> */}
                      </Wrap>
                    </div>
                  )}
                <Space />
                {props.gatewayResponseCode === "00" &&
                  //props.allowRefund &&
                  isEmpty(props.refundList) &&
                  isEmpty(props.disputeList) &&
                  props.preAuthType !== "REFUND" &&
                  canRaiseRefund && (
                    <Can access={"REFUND_PAYMENT"}>
                      <Wrap>
                        <div className="text-body">
                          <div className="title font-medium py-2">
                            Customer Refund
                          </div>
                          <span className="label">
                            Note: Refunds may take 3-14 working days to
                            complete{" "}
                            <div className="text-body cursor-pointer">
                              <Raise onClick={(e) => setRefund(true)}>
                                Raise a refund
                              </Raise>
                              <Refund
                                amount={formatNumber(Number(props.amount).toFixed(2))}
                                showRefund={openRefund}
                                close={() => setRefund(false)}
                                transactionRef={props.transactionRef}
                                addRefund={(params) => addRefund(params)}
                                full_amount={props.amount}
                                refund_success={refund_success}
                                closeSuccess={closeSuccess}
                                setRefundProcess={setRefundProcess}
                                refundProcess={refundProcess}
                              />
                            </div>
                          </span>
                        </div>
                      </Wrap>
                    </Can>
                  )}
                {props.gatewayResponseCode === "00" &&
                  props.refundList &&
                  props.refundList !== null &&
                  props.refundList.length > 0 && (
                    <Wrap>
                      <div className="text-body">
                        <div className="title font-medium">Refunded</div>
                        <span className="label">
                          Note: Refunds may take 3-14 working days to complete.
                        </span>
                        <div className="w-100 my-2">
                          {props.refundList.map((data, index) => {
                            return (
                              <React.Fragment key={index}>
                                <div className="alert-success">
                                  {`${data.type.replace("_", " ")} of ${data.currency
                                    } ${data.amount}  was carried out on ${data.created_at
                                    }`}
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    </Wrap>
                  )}

                <Space />
                {props.disputeList &&
                  props.disputeList !== null &&
                  props.disputeList.length > 0 && (
                    <Can access={"REFUND_PAYMENT"}>
                      <Wrap>
                        {" "}
                        <div className="text-body">
                          <div className="font-15 title font-medium">
                            Dispute Raise
                          </div>
                          <div className="row px-0 mx-0 alert-warning d-grid">
                            <span className="label col-md p-0 m-auto">
                              Status:{" "}
                              {DisputeStatus(props.disputeList[0].status)}
                            </span>
                            <span className="mx-2 col-md float-right p-0 my-auto">
                              <strong>
                                {DisputeResponse(
                                  {
                                    ...props.disputeList[0],
                                    transDetails: {
                                      amount: props.amount,
                                    },
                                  },
                                  setDispute,
                                  setShowDispute,
                                  replyDispute
                                )}
                              </strong>
                            </span>
                          </div>
                        </div>{" "}
                        <Space />
                      </Wrap>
                    </Can>
                  )}
                <Space />

                {/* <Wrap className='py-3'>
									<div className='title pb-3 pr-2 font-medium'>Fraud Control</div>
									<div className='text-body p-0'>
										<div className='form-inline row mr-0'>
											<label className='form-label font-16 px-3'>Reason</label>
											<div className='col'>
												<input
													className='form-control h-30px br-none w-100'
													type='text'
													fluid
												/>
											</div>
										</div>
									</div>
									<div className='text-body form-inline pb-0 row mr-0'>
										<label className='form-label font-14  px-3 text-left'>
											User Card/Bank Account Number{' '}
										</label>
										<div className='col'>
											<input
												type='checkbox'
												className='form-control font-32 float-right h-30px'
											/>
										</div>
									</div>
									<div className='text-body form-inline pb-0 row mr-0'>
										<label className='form-label font-14  px-3 text-left'>
											Card Holder/Consumer Name{' '}
										</label>
										<div className='col'>
											<input
												type='checkbox'
												className='form-control font-32 float-right h-30px'
											/>
										</div>
									</div>
									<div className='text-body'>
										<span className='label'> &nbsp;</span>
										<div className='text float-right'>
											<Go type='button' className='sbt-deep-color font-medium'>Apply</Go>
										</div>
									</div>
								</Wrap>
						 */}
              </animated.div>
              <animated.div className="col-3 p-2" style={secondColumn}>
                <Wrap>
                  <div className="title py-3 font-medium">Analytics</div>
                  {props.analytics && props.analytics.channel && (
                    <div className="text-body py-1 ">
                      <span className="label">Channel Type -</span>
                      <span className="text float-right text-bold text-uppercase">
                        {props.analytics.channel}
                      </span>
                    </div>
                  )}
                  {props.analytics && props.analytics.channelType && (
                    <div className="text-body py-1">
                      <span className="label">Bank -</span>
                      <span className="text float-right text-bold text-uppercase">
                        {() => transactionChannel(props)}
                      </span>
                    </div>
                  )}
                  {props.analytics && props.analytics.country && (
                    <div className="text-body py-1">
                      <span className="label">Country - </span>
                      <span className="text float-right text-bold">
                        <ReactCountryFlag
                          style={{
                            fontSize: "22px",
                          }}
                          countryCode={props.analytics.country}
                        />
                        {props.analytics.country}
                      </span>
                    </div>
                  )}
                  {props.analytics && props.analytics.ipAddress && (
                    <div className="text-body py-1">
                      <span className="label">IP Address -</span>
                      <span className="text float-right text-bold">
                        {props.analytics.ipAddress}
                      </span>
                    </div>
                  )}
                  {props.analytics && props.analytics.deviceType && (
                    <div className="text-body py-1">
                      <span className="label">Device Type -</span>
                      <span className="text float-right text-bold">
                        {props.analytics.deviceType}
                      </span>
                    </div>
                  )}
                  <div className="text-body py-1">
                    <span className="label">Attempts - </span>
                    <span className="text float-right text-bold">
                      {attempt}
                    </span>
                  </div>
                  <div className="text-body py-1">
                    <span className="label">Errors - </span>
                    <span className="text float-right text-bold">{error}</span>
                  </div>
                </Wrap>
              </animated.div>
              <Clear />
              <animated.div className="col-5  p-2" style={thirdColumn}>
                <Wrap className="bg-white p-0 mb-4">
                  <div className="title pb-3 font-16 font-medium">
                    Basic Details
                    <RightComponent>
                      <FontAwesomeIcon
                        className="cursor-pointer"
                        icon={basicTrigger ? faCaretDown : faCaretUp}
                        onClick={() => {
                          setBasic(!basicTrigger);
                        }}
                      />
                    </RightComponent>
                  </div>
                  {basicTrigger && (
                    <>
                      {props.transactionTimeString && (
                        <div className="text-body font-16 py-1">
                          <span className="label ">Time Stamp -</span>
                          <span className="text float-right">
                            <strong>
                              {moment(props.transactionTimeString).format(
                                "DD-MM-yyyy, hh:mm A"
                              )}
                            </strong>
                          </span>
                        </div>
                      )}
                      <div className="text-body font-16 py-1">
                        <span className="label">Status -</span>
                        <span className={"text float-right"}>
                          <strong>
                            {props.transType !== "PREAUTH"
                              ? props.refundList && props.refundList.length > 0
                                ? "Refunded"
                                : (props.gatewayResponseMessage === "APPROVED" ||
                                  props.gatewayResponseMessage === "Successful") &&
                                  (props.gatewayResponseCode === "00") &&
                                  (props.status === "COMPLETED" || props.status === "SETTLED")
                                  ? "Successful"
                                  : props.gatewayResponseCode === "SM_X23"
                                    ? "Expired"
                                    : props.gatewayResponseCode === "SM_A"
                                      ? "Aborted"
                                      : "Failed"
                              : preAuthCapitalized &&
                                preAuthCapitalized !== "Noauth" &&
                                preAuthCapitalized !== "Refund" &&
                                preAuthCapitalized !== "Cancel"
                                ? `${preAuthCapitalized}d`
                                : preAuthCapitalized === "Refund"
                                  ? `${preAuthCapitalized}ed`
                                  : preAuthCapitalized === "Cancel"
                                    ? `${preAuthCapitalized}led`
                                    : preAuthCapitalized === "Noauth"
                                      ? props.gatewayResponseCode === "00"
                                        ? "Captured"
                                        : "Failed"
                                      : null}
                          </strong>
                        </span>
                      </div>
                      {props.transactionDescription && (
                        <div className="text-body font-16 py-1">
                          <span className="label">Description -</span>
                          <span className="text float-right">
                            <strong>{props.transactionDescription}</strong>
                          </span>
                        </div>
                      )}
                      {props.gatewayResponseMessage !== "APPROVED" && (
                        <div className="text-body font-16 py-1">
                          <span className="label">Gateway Response -</span>
                          <span className="text float-right">
                            <strong>
                              {" "}
                              {props.reason && props.reason != null
                                ? props.reason
                                : props.gatewayResponseMessage}
                            </strong>
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </Wrap>

                <Wrap className="bg-white p-0">
                  <hr className="py-0 " />
                </Wrap>

                {(props.invoiceNumber || props.branchReference) && (
                  <Wrap className="bg-white p-0 mb-4">
                    <div className="title pb-3 font-16 font-medium">
                      Branch Details
                      <RightComponent>
                        <FontAwesomeIcon
                          icon={branchTrigger ? faCaretDown : faCaretUp}
                          onClick={() => {
                            setBranch(!branchTrigger);
                          }}
                        />
                      </RightComponent>
                    </div>
                    {branchTrigger && (
                      <>
                        {" "}
                        {props.branchReference && (
                          <div className="text-body font-16 py-1">
                            <span className="label ">Branch Reference -</span>
                            <span className="text float-right">
                              <strong>{props.branchReference}</strong>
                            </span>
                          </div>
                        )}
                        {props.invoiceNumber && (
                          <div className="text-body font-16 py-1">
                            <span className="label">Invoice Number -</span>
                            <span className="text float-right">
                              <strong>{props.invoiceNumber}</strong>
                            </span>
                          </div>
                        )}
                        {props.branchLocationPhoneNo && (
                          <div className="text-body font-16 py-1">
                            <span className="label">Branch Phone Number -</span>
                            <span className="text float-right">
                              <strong>{props.branchLocationPhoneNo}</strong>
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </Wrap>
                )}
                <Wrap className="bg-white p-0">
                  <div className="title pb-3 font-16 font-medium">
                    Customer Details
                    <RightComponent>
                      <FontAwesomeIcon
                        className="cursor-pointer"
                        icon={customerTrigger ? faCaretDown : faCaretUp}
                        onClick={() => {
                          setCustomer(!customerTrigger);
                        }}
                      />
                    </RightComponent>
                  </div>
                  {customerTrigger && (
                    <>
                      {" "}
                      {props.customer && props.customer.customerName && (
                        <div className="text-body font-16 py-1">
                          <span className="label ">Name -</span>
                          <span className="text float-right">
                            <strong>{props.customer.customerName}</strong>
                          </span>
                        </div>
                      )}
                      {props.customer && props.customer.customerEmail && (
                        <div className="text-body font-16 py-1">
                          <span className="label">Email -</span>
                          <span className="text float-right">
                            <strong>{props.customer.customerEmail}</strong>
                          </span>
                        </div>
                      )}
                      {props.customer.customerPhone && (
                        <div className="text-body font-16 py-1">
                          <span className="label">Phone Number -</span>
                          <span className="text float-right">
                            <strong>{props.customer.customerPhone}</strong>
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </Wrap>

                <Wrap className="bg-white p-0">
                  <hr className="py-0 " />
                </Wrap>

                {props.transType === "PREAUTH" && (
                  <>
                    <Wrap className="bg-white p-0">
                      <div className="title pb-3 font-16 font-medium">
                        Event History
                        <RightComponent>
                          <FontAwesomeIcon
                            className="cursor-pointer"
                            icon={historyTrigger ? faCaretDown : faCaretUp}
                            onClick={() => {
                              setHistory(!historyTrigger);
                            }}
                          />
                        </RightComponent>
                      </div>
                      {historyTrigger && (
                        <>
                          {" "}
                          {props.eventList &&
                            props.eventList.map((event, id) => (
                              <div
                                className="text-body font-16 py-1 text-capitalize"
                                key={id}
                              >
                                <span className="label ">
                                  {event.actionPerformed}
                                </span>
                                <span className="text float-right">
                                  <strong>
                                    {moment(event.time).format(
                                      "DD-MM-yyyy, hh:mm A"
                                    )}
                                  </strong>
                                </span>
                              </div>
                            ))}
                        </>
                      )}
                    </Wrap>

                    <Wrap className="bg-white p-0">
                      <hr className="py-0 " />
                    </Wrap>
                  </>
                )}

                {props.eventList.length > 0 && (
                  <Wrap className="bg-white p-0">
                    <div className="title pb-3 font-16 font-medium">
                      Insight
                      <RightComponent>
                        <FontAwesomeIcon
                          className="cursor-pointer"
                          icon={eventTrigger ? faCaretDown : faCaretUp}
                          onClick={() => {
                            setEvent(!eventTrigger);
                          }}
                        />
                      </RightComponent>
                    </div>
                    <div style={eventTrigger ? {} : { display: "none" }}>
                      <TransactionEvents
                        events={props.eventList}
                        setAttempt={(atmpt) => setAttempt(atmpt)}
                        setError={(err) => setError(err)}
                        setTime={(t) => setTime(t)}
                      />
                    </div>
                  </Wrap>
                )}
              </animated.div>
            </div>
          </div>
        </Gap>
      </NavMenuItem>
      {show_dispute && (
        <DisputeLayer>
          <Conversations
            close={() => setShowDispute(false)}
            dispute={{
              ...props.disputeList[0],
              transDetails: { amount: props.amount },
            }}
            setMessage={setMessage}
            message={message}
            image_upload={image_upload}
            setImageUpload={setImageUpload}
            replyDispute={replyDispute}
          />
        </DisputeLayer>
      )}
    </Wrapper>
  );
}

const mapStateToProps = (state) => ({
  business_details: state.data.business_details,
  search_vendor: state.data.search_vendor
});

export default connect(mapStateToProps, {
  clearState,
  searchVendor
})(TransactionOverview);
