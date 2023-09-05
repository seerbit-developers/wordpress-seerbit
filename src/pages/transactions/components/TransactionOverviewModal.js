import React, { useEffect, useState, useRef } from "react";
import { Spinner } from 'react-bootstrap';
import ReactCountryFlag from "react-country-flag";
import moment from "moment";
import TransactionEvents from "components/sbt_events";
import verify from "utils/strings/verify";
import Copy from "assets/images/svg/copy.svg";
import { Can } from "modules/Can";
import PrinterIcon from "assets/images/svg/print.svg";
import { withRouter } from "react-router";
import { isEmpty } from "lodash";
import {alertError, alertExceptionError, alertSuccess} from "../../../modules/alert";
import {refundPayment} from "../../../services/transactionService";
import {handleCopy} from 'utils'
import validate from "utils/strings/validate";
import {DisputeResponse, DisputeStatus} from "../../../modules/resolve_dispute";
import Error from "../../error";
import {useTranslation} from "react-i18next";
import AppModal from 'components/app-modal';
import Button from "../../../components/button";
import TransactionChannel from "./TransactionChannel";
import CardDetails, {CardDetailsExpiry} from "../../account/settlement_information/components/CardDetails";
import { Placeholder } from 'rsuite';
const TransactionOverviewModal = ({
                                    props,
                                    refund_success,
                                    canRaiseRefund,
                                    search_vendor,
                                    isOpen,
                                    close,
                                    loading,
                                  }) => {

  const [amount, setAmount] = useState()
  const [amountPass, setAmountPass] = useState(true);
  const [issue, setIssue] = useState(false)
  const [inProcess, setInProcess] = useState(false);
  const [full, setFull] = useState(true);
  const full_amount = Number(props?.amount).toFixed(2);
  const [error, setError] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [time, setTime] = useState(0);
  const preAuthType = (props?.preAuthType && props?.preAuthType.replace("_", " ").toLowerCase()) || "";
  const preAuthCapitalized = preAuthType.charAt(0).toUpperCase() + preAuthType.slice(1);
  const [mobile, setMobile] = useState(true);

  useEffect(() => {
    full && setAmount(full_amount);
    refund_success && setInProcess(false)
  }, [full, refund_success])

  const handleAmount = (e) => {
    var thenum = e.target.value.match(RegExp(verify.number), "");
    if (thenum !== null) {
      setAmount(thenum[0]);
      setAmountPass(RegExp(validate.money).test(thenum[0]));
    }
  };

  const initProcess = async (transactionRef, amount, description, type) => {
    if (parseInt(amount) > parseInt(full_amount)) {
      alertError("Please enter a value below or equals to the full amount.");
      return
    }
    // if (!description) {
    //   alertError("Please enter a value below the full amount.", "transaction_overview");
    //   return
    // }
    amount = full ? full_amount : amount;

    if (!amountPass) {
      setAmount("");
      setInProcess(false);
      alertError("Please enter a valid amount");
    } else {
      console.log('trigger refund')

      setInProcess(true);
      refundPayment({
        transactionRef,
        description,
        amount,
        type,
      }).then((res) => {
        setInProcess(false)
        if (res.responseCode === "00") {
          setAmount(0)
          setIssue(false)
          alertSuccess("Customer refund is being processed.", "transactions_alert");
        } else {
          alertError(res.message
              ? res.message
              : "An Error Occurred sending the request. Kindly try again");
        }
      })
          .catch((e) => {
            setInProcess(false);
            alertExceptionError(e)
          });
    }
  };

  function formatNumber(num) {
    return Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  useEffect(() => {
    if (isOpen) {
      if (document.getElementById("top_nav"))
        document.getElementById("top_nav").style.position = "static";
    } else {
      if (document.getElementById("top_nav"))
        document.getElementById("top_nav").style.position = "relative";
    }
  }, [isOpen]);
  const { t } = useTranslation()

  const ref = useRef();
  // useOnClickOutside(ref, () => close());

  // const print = () => {
  //   setMobile(true)
  //   window.print()
  //   .then(() => {
  //     setMobile(false)
  //   })
  //   return true;
  // }

  return (

      <AppModal
          isOpen={isOpen}
          close={close}
          title={t('Transaction Overview')}
          contentStyle={{padding:0}}
          containerStyle={{padding:0}}
      >
        {
          loading ?
              <div className="p-4">
                <Placeholder.Paragraph style={{ marginTop: 30 }} active rowHeight={20} rows={3}/>
                <Placeholder.Paragraph style={{ marginTop: 30 }} active rowHeight={20} rows={3}/>
                <Placeholder.Paragraph style={{ marginTop: 30 }} active rowHeight={20} rows={3}/>
              </div>
              :
              <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log('submit refund')
                    initProcess(
                        props?.transactionRef,
                        amount,
                        "",
                        full ? "FULL_REFUND" : "PARTIAL_REFUND"
                    );
                  }}>
                <div
                    ref={ref}
                    className="overview-modal-content"
                >
                  <div className="bg-white p-4" id="sect_one">
                    <div className="d-flex flex-row justify-content-between w-100 mb-5">
                      <div className="d-flex justify-content-end d-flex align-items-center">
                  <span className="text-uppercase" style={{fontSize:12, paddingTop:1}}>
                    <img
                        src={Copy}
                        width="15"
                        height="15"
                        className="cursor-pointer mr-2 no-print"
                        onClick={(e) => {
                          handleCopy(props?.transactionRef);
                        }}
                        alt="copy"
                        style={{marginBottom:3}}
                    />
                    {props?.transactionRef?.replaceAll('_', ' ')}
                  </span>
                        <span className="mx-2">-</span>
                        <span
                            className={`${props?.refundList && props?.refundList.length > 0
                                ? "refund"
                                : props?.gatewayResponseMessage === "APPROVED"
                                    ? "text-success"
                                    : ["SM_X23", "SM_A"].indexOf(
                                        props?.gatewayResponseCode
                                    ) > -1
                                        ? "default"
                                        : "text-danger"
                            }`}
                        >
                    {props?.transType !== "PREAUTH"
                        ? props?.refundList && props?.refundList.length > 0
                            ? t('Refunded')
                            : props?.gatewayResponseMessage === "APPROVED" ||
                            props?.gatewayResponseMessage === "Successful"
                                ? t("Successful")
                                : props?.gatewayResponseCode === "SM_X23"
                                    ? t('Expired')
                                    : props?.gatewayResponseCode === "SM_A"
                                        ? t('Aborted')
                                        : t('Failed')
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
                                        ? props?.gatewayResponseCode === "00"
                                            ? t('Captured')
                                            : t('Failed')
                                        : null
                    }
                  </span>
                      </div>
                      <div>
                        <img
                            src={PrinterIcon}
                            alt="icon"
                            onClick={() => {
                              window.print()
                              setMobile(false)
                            }}
                            className="cursor-pointer no-print"
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                <span className="text">
                  <span className="trans--currency">{props?.currency}{" "}</span>
                  <span className="trans--amount">
                    {formatNumber(Number(props?.amount).toFixed(2))}
                  </span>
                </span>

                      <div className="d-flex flex-row">
                        {/*<Button variant="light" className="p-0 px-2" style={{ background: "#DFE0EB" }}>*/}
                        {/*  <span className="font-10">Resend Receipt</span>*/}
                        {/*</Button>*/}

                        {props?.gatewayResponseCode === "00" &&
                            //props?.allowRefund &&
                            isEmpty(props?.refundList) &&
                            isEmpty(props?.disputeList) &&
                            (props?.preAuthType !== "REFUND" && props?.preAuthType !== "CANCEL" && props?.preAuthType !== "AUTHORIZE") &&
                            canRaiseRefund && (
                                <Button onClick={() => setIssue(!issue)} style={{marginLeft:15}} size='sm' type='button'>
                                  {t('Issue Refund')}
                                </Button>
                            )}
                      </div>
                    </div>
                  </div>
                  {issue &&
                      props?.gatewayResponseCode === "00" &&
                      //props?.allowRefund &&
                      isEmpty(props?.refundList) &&
                      isEmpty(props?.disputeList) &&
                      props?.preAuthType !== "REFUND" &&
                      canRaiseRefund &&
                      (
                          <div className="bg-white px-4 py-4 mb-4 mt-4">
                            <Can access={"REFUND_PAYMENT"}>
                              <div className="title mb-3">{t('Refund Customer')}</div>
                              <div className="card--subtitle mb-3">{t('Refund may take 3 - 10 working days to complete')}</div>
                              <div>
                                <div className="form-inline">
                                  <div className="form-group">
                                    <input
                                        type="checkbox"
                                        className="form-control"
                                        onChange={(e) => setFull(!full)}
                                        checked={full}
                                    />
                                    <label className="form-label mx-1 input-font font-12">
                                      {t('Full Refund')}
                                    </label>
                                  </div>
                                </div>
                                <input
                                    className={'d-block form__control--full'}
                                    type="text"
                                    name="amount"
                                    style={{ height: "42px" }}
                                    onChange={(e) => handleAmount(e)}
                                    value={amount}
                                    disabled={full}
                                    placeholder={t('Enter Refund Amount')}
                                />

                              </div>
                              {" "}
                              {!amountPass && amount !== undefined && (
                                  <Error>{t('Enter a valid amount')}</Error>
                              )}

                              <div className="mt-3">
                                <Button
                                    variant="danger"
                                    className="p-0 px-2"
                                    style={{ width: "100%" }}
                                    type="submit"
                                    disabled={inProcess}
                                >
                                  {inProcess ? <Spinner animation="border" size="sm" variant="light" /> : <span className="font-10">{t('Request Refund')}</span>}
                                </Button>
                              </div>
                            </Can>
                          </div>
                      )}
                  <div id="sect_two" className="bg-white px-4 py-4">
                    <div className="title py-2 font-15 font-medium">{t('Transaction Breakdown')}</div>
                    <div className="text-body font-15 py-1">
                      <span className="label">{t('Transaction Amount')} -</span>
                      <span className="text float-right">
                  <strong>
                    {props?.currency}{" "}
                    {formatNumber(Number(props?.amount).toFixed(2))}
                  </strong>
                </span>
                    </div>
                    <div className="text-body font-15 py-1">
                      <span className="label">{t('Transaction Fee')} -</span>
                      <span className="text float-right">
                  <strong>
                    {props?.currency}{" "}
                    {formatNumber(Number(props?.fee).toFixed(2))}
                  </strong>
                </span>
                    </div>
                    <hr className="mt-0" />
                    <div className="text-body font-15">
                      <span className="label">{t('Total Due')} - </span>
                      <span className="text float-right">
                  <strong>
                    {props?.currency}{" "}
                    {formatNumber(
                        Number(props?.amount - props?.fee).toFixed(2)
                    )}
                  </strong>
                </span>
                    </div>
                  </div>

                  {
                    props?.analytics?.channel === 'TRANSFER' ?
                        <div id="sect_others" className="bg-white px-4 py-4 mt-4">
                          <div className="title py-2 font-15 font-medium">{t('Other Information')}</div>
                          <div className="text-body font-15 py-1">
                            <span className="label">{t('Expected Amount')} -</span>
                            <span className="text float-right">
                  <strong>
                    {props?.currency}{" "}
                    {formatNumber(Number(props?.transferAmount).toFixed(2))}
                  </strong>
                </span>
                          </div>
                          <div className="text-body font-15 py-1">
                            <span className="label">{t('Transferred Amount')} -</span>
                            <span className="text float-right">
                  <strong>
                    {props?.currency}{" "}
                    {formatNumber(Number(props?.transferredAmount).toFixed(2))}
                  </strong>
                </span>
                          </div>
                        </div> : null }



                  {props?.gatewayResponseCode === "00" &&
                      props?.refundList &&
                      props?.refundList !== null &&
                      props?.refundList.length > 0 && (
                          <div className="bg-white px-4 py-4 mt-4">
                            <div className="title py-2 font-15 font-medium">{t('Refunded')}</div>
                            <div className="text-body">
                    <span className="label">
                      {t("Note - Refunds may take 3-14 working days to complete.")}
                    </span>
                              <div className="w-100 my-2">
                                {props?.refundList.map((data, index) => {
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
                          </div>
                      )}

                  {search_vendor &&
                      search_vendor.payload &&
                      props?.vendorSettlementAmount !== null && (
                          <div className="bg-white px-4 py-4 mt-4">
                            <div className="title py-2 font-15 font-medium">{t('Split Share')}</div>
                            <div className="text-body py-1">
                              <span className="label">{t('Your Commission')} -</span>
                              <span className="text float-right">
                      {props?.currency}{" "}
                                <strong>
                        {formatNumber(
                            Number(props?.amount - props?.fee).toFixed(2) - Number(props?.vendorSettlementAmount.toFixed(2))
                        ) || 0}
                      </strong>
                    </span>
                            </div>
                            <div className="text-body py-1">
                              <span className="label">{t('Sub Account Share')} -</span>
                              <span className="text float-right">
                      {props?.currency}{" "}
                                <strong>
                        {formatNumber(
                            Number(props?.vendorSettlementAmount.toFixed(2))
                        ) || 0}
                      </strong>
                    </span>
                            </div>
                          </div>)}

                  <div id="sect_three"   className="bg-white px-4 py-4 mt-4">
                    <div className="title pb-3 font-15 font-medium">
                      {t('Customer Details')}
                    </div>
                    <>
                      {" "}
                      <div className="d-flex justify-content-start my-2">
                        {props?.customer && props?.customer.customerName && (
                            <div className="text-body font-14 py-1 mr-5">
                              <div className="label" style={{ color: "#676767" }}>{t('Name')} -</div>
                              <div className="text mt-2 font-medium">
                                {props?.customer.customerName}
                              </div>
                            </div>
                        )}
                        {props?.customer && props?.customer.customerEmail && (
                            <div className="text-body font-14 px-5" style={{float:"none"}}>
                              <div className="label" style={{ color: "#676767" }}>{t('Email')} -</div>
                              <div className="text mt-2 font-medium ">
                                {props?.customer.customerEmail}
                              </div>
                            </div>
                        )}
                      </div>
                      <div className="d-flex justify-content-between">
                        {props?.customer.customerPhone && (
                            <div className="text-body font-14 py-1">
                              <div className="label" style={{ color: "#676767" }}>{t('Phone Number')} -</div>
                              <div className="text mt-2 font-medium">
                                {props?.customer.customerPhone}
                              </div>
                            </div>
                        )}
                        {/*<Button variant="light" className="p-0 px-2 mb-2" style={{ background: "#DFE0EB", height: 40}}>*/}
                        {/*  <span className="font-10">View Customer</span>*/}
                        {/*</Button>*/}
                      </div>
                    </>
                  </div>

                  <div id="sect_four" className="bg-white px-4 py-4 mt-4">
                    <div className="title pb-3 font-15 font-medium">
                      {t('Basic Details')}
                    </div>
                    <>
                      {props?.transactionTimeString && (
                          <div className="text-body font-15 py-1">
                            <span className="label ">{t('Time Stamp')} -</span>
                            <span className="text float-right">
                      {moment(props?.transactionTimeString).format(
                          "DD-MM-yyyy, hh:mm A"
                      )}
                    </span>
                          </div>
                      )}
                      <div className="text-body font-15 py-1">
                        <span className="label">{t('Status')} -</span>
                        <span className={"text float-right"}>

                    {props?.transType !== "PREAUTH"
                        ? props?.refundList && props?.refundList.length > 0
                            ? t("Refunded")
                            : props?.gatewayResponseMessage === "APPROVED" ||
                            props?.gatewayResponseMessage === "Successful"
                                ? t("Successful")
                                : ["SM_X23", "SM_A"].indexOf(
                                    props?.gatewayResponseCode
                                ) > -1
                                    ? t("Pending")
                                    : t("Failed")
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
                                        ? props?.gatewayResponseCode === "00"
                                            ? t("Captured")
                                            : t("Failed")
                                        : null}

                  </span>
                      </div>
                      {props?.transactionDescription && (
                          <div className="text-body font-15 py-1">
                            <span className="label">{t('Description')} -</span>
                            <span className="text float-right">
                      {props?.transactionDescription}
                    </span>
                          </div>
                      )}
                      {props?.gatewayResponseMessage !== "APPROVED" && (
                          <div className="text-body font-15 py-1" style={{minHeight:80}}>
                            <span className="label">{t('Gateway Response')} -</span>
                            <span className="text float-right">

                      {" "}
                              {props?.reason && props?.reason != null
                                  ? props?.reason
                                  : props?.gatewayResponseMessage}

                    </span>
                          </div>
                      )}
                    </>
                  </div>

                  {(props?.invoiceNumber || props?.branchReference) && (
                      <div className="bg-white px-4 py-4 mt-4">
                        <div className="title pb-3 font-15 font-medium">
                          {t('Branch Details')}
                        </div>
                        {" "}
                        {props?.branchReference && (
                            <div className="text-body font-15 py-1">
                              <span className="label">{t('Branch Reference')} -</span>
                              <span className="text float-right font-14">
                      <strong>{props?.branchReference}</strong>
                    </span>
                            </div>
                        )}
                        {props?.invoiceNumber && (
                            <div className="text-body font-15 py-1">
                              <span className="label">{t('Invoice Number')} -</span>
                              <span className="text float-right font-14">
                      <strong>{props?.invoiceNumber}</strong>
                    </span>
                            </div>
                        )}
                        {props?.branchLocationPhoneNo && (
                            <div className="text-body font-15 py-1">
                              <span className="label">{t('Branch Phone Number')} -</span>
                              <span className="text float-right font-14">
                      <strong>{props?.branchLocationPhoneNo}</strong>
                    </span>
                            </div>
                        )}
                      </div>
                  )}

                  {props?.disputeList &&
                      props?.disputeList !== null &&
                      props?.disputeList.length > 0 && (
                          <Can access={"REFUND_PAYMENT"}>
                            <div className="bg-white px-4 py-4 mt-4">
                              <div className="title pb-3 font-15 font-medium">
                                {t('Dispute Raised')}
                              </div>
                              <div className="text-body">
                                <div className="row px-0 mx-0 alert-warning d-grid">
                        <span className="label col-md p-0 m-auto">
                          {t('Status')} : {" "}
                          {DisputeStatus(props?.disputeList[0].status)}
                        </span>
                                  <span className="mx-2 col-md float-right p-0 my-auto">
                          <strong>
                            {DisputeResponse(
                                {
                                  ...props?.disputeList[0],
                                  transDetails: {
                                    amount: props?.amount,
                                  },
                                },
                                setDispute,
                                setShowDispute,
                                replyDispute
                            )}
                          </strong>
                        </span>
                                </div>
                              </div>
                            </div>
                          </Can>
                      )}

                  {/*ANALYTICS SECTION*/}
                  <div id='sect_five' className="bg-white px-3 py-4 mt-4">
                    <div className="title font-15 font-medium">
                      {t('Analytics')}
                    </div>
                    <>
                      <div className="d-flex flex-wrap my-2">
                        <div className="analytics-details--container my-2">
                          {props?.analytics && props?.analytics.channel && (
                              <div className="text-body font-14 py-2 mr-5">
                                <div className="label" style={{ color: "#676767" }}>{t('Channel Type')}</div>
                                <div className="trans--detail mt-2">
                                  {t(props?.analytics.channel)}
                                </div>
                              </div>
                          )}

                          {props?.analytics && props?.analytics.channelType && (
                              <div className="text-body font-14 py-2 mr-5">
                                <div className="label" style={{ color: "#676767" }}>{t('Channel')}</div>
                                <div className="mt-2">
                                  <TransactionChannel props={props}/>
                                </div>
                              </div>
                          )}

                          {props?.analytics && props?.analytics.country && (
                              <div className="text-body font-14 py-2 mr-5">
                                <div className="label" style={{ color: "#676767" }}>{t('Country')} </div>
                                <div className="mt-2">
                                  <ReactCountryFlag
                                      style={{
                                        fontSize: "16px",
                                        paddingRight: "12px",
                                      }}
                                      countryCode={props?.analytics.country}
                                  />
                                  <span className='text-capitalize'>{props?.analytics.country}</span>
                                </div>
                              </div>
                          )}
                        </div>

                        <div className="analytics-details--container my-2">
                          {props?.analytics && props?.analytics.deviceType && (
                              <div className="text-body font-14 py-2 mr-5">
                                <div className="label" style={{ color: "#676767" }}>{t('Device Type')}</div>
                                <div className="trans--detail mt-2">
                                  {props?.analytics.deviceType}
                                </div>
                              </div>
                          )}

                          {props?.analytics && props?.analytics.ipAddress && (
                              <div className="text-body font-14 py-2 mr-5">
                                <div className="label" style={{ color: "#676767" }}>{t('IP Address')} </div>
                                <div className="trans--detail mt-2">
                                  {props?.analytics.ipAddress}
                                </div>
                              </div>
                          )}

                          <div className="text-body font-14 py-2 mr-5">
                            <div className="label" style={{ color: "#676767" }}>{t('Attempts')} </div>
                            <div className="trans--detail mt-2">
                              {attempt}
                            </div>
                          </div>
                        </div>

                        <div className="analytics-details--container my-2">
                          <CardDetails props={props}/>
                          <CardDetailsExpiry props={props}/>
                          <div className="text-body font-14 py-2 mr-5">
                            <div className="label" style={{ color: "#676767" }}>{t('Errors')} </div>
                            <div className="trans--detail mt-2">
                              {error}
                            </div>
                          </div>
                          <div className="text-body font-14 py-2 mr-5">
                            <div className="label" style={{ color: "#676767" }}> </div>
                            <div className="trans--detail mt-2">

                            </div>
                          </div>
                        </div>

                      </div>
                    </>
                  </div>

                  {props?.transType === "PREAUTH" && (
                      <>
                        <div className="bg-white px-4 py-4 mt-4">
                          <div className="title pb-3 font-15 font-medium">
                            {t('Event History')}
                          </div>
                          <>
                            {" "}
                            {props?.eventList &&
                                props?.eventList.map((event, id) => (
                                    <div
                                        className="text-body font-15 py-1 text-capitalize"
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
                        </div>
                      </>
                  )}

                  <div id='sect_six' className="bg-white px-4 py-4 mt-4">
                    <div className="title pb-3 font-15 font-medium">
                      {t('Insights')}
                    </div>
                    {props?.eventList.length > 0
                        ? <TransactionEvents
                            events={props && props?.eventList ? props?.eventList : []}
                            setAttempt={(atmpt) => setAttempt(atmpt)}
                            setError={(err) => setError(err)}
                            setTime={(t) => setTime(t)}
                        />
                        : <span className="font-14" >{t('No Insight at the moment')}</span>
                    }
                  </div>
                </div>
              </form >
        }
      </AppModal >
  );
};

export default withRouter(TransactionOverviewModal);