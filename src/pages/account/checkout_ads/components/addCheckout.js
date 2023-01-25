import React, { useEffect, useState, useRef } from "react";
import { Button, Spinner } from 'react-bootstrap';
import ReactCountryFlag from "react-country-flag";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import TransactionEvents from "components/sbt_events";
import useOnClickOutside from "utils/onClickOutside";
import verify from "utils/strings/verify";
import Copy from "assets/images/svg/copy.svg";
import { Can } from "modules/Can";
import PrinterIcon from "assets/images/svg/print.svg";
import { withRouter } from "react-router";
import { isEmpty } from "lodash";
import {handleCopy} from "utils"
import {alertError} from "../../../../modules/alert";
import {useTranslation} from "react-i18next";
const TransactionOverviewModal = ({
    props,
    addRefund,
    refund_success,
    canRaiseRefund,
    isMobile,
    transactionChannel,
    search_vendor,
    isOpen,
    close,
}) => {

    const [customerTrigger, setCustomer] = useState(true);
    const [amount, setAmount] = useState()
    const [amountPass, setAmountPass] = useState(true);
    const [issue, setIssue] = useState(false)
    const [inProcess, setInProcess] = useState(false);
    const [full, setFull] = useState(true);
    const full_amount = Number(props.amount).toFixed(2);
    const [error, setError] = useState(0);
    const [attempt, setAttempt] = useState(0);
    const [time, setTime] = useState(0);
    const { t } = useTranslation();


    useEffect(() => {
        full && setAmount(full_amount);
        refund_success && setInProcess(false)
    }, [full, refund_success])

    const handleAmount = (e) => {
        var thenum = e.target.value.match(RegExp(verify.number), "");
        if (thenum !== null) {
            if (thenum[0] >= full_amount) {
                alertError("Please enter a value below the full amount.");
            } else {
                setAmount(thenum[0]);
                setAmountPass(RegExp(validate.money).test(thenum[0]));
            }
        }
    };

    const initProcess = async (transactionRef, amount, description, type) => {
        amount = full ? full_amount : amount;
        setInProcess(true);
        if (!amountPass) {
            setAmount("");
            setInProcess(false);
            setAmountPass(false);
        } else {
            const params = {
                location: "refund",
                data: {
                    transactionRef,
                    description,
                    amount,
                    type,
                },
            };
            addRefund(params);
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
            document.getElementById("top_nav").style.position = "static";
        } else {
            document.getElementById("top_nav").style.position = "relative";
        }
    }, [isOpen]);

    const ref = useRef();
    useOnClickOutside(ref, () => close());

    return (

        <div
            className={`overview-side-modal-window ${isOpen
                ? "overview-side-modal-window-visible"
                : "overview-side-modal-window-hidden"
                }`}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    initProcess(
                        props.transactionRef,
                        amount,
                        "",
                        full ? "FULL_REFUND" : "PARTIAL_REFUND"
                    );
                }}>
                <div
                    className="overview-modal-content"
                    style={isMobile ? { width: "100%" } : { width: "30%" }}
                    ref={ref}>
                    <div className="bg-white px-3 py-4">
                        <div className="d-flex justify-content-between mb-5">
                            <span>{t("Transaction Overview")}</span>
                            <div>
                                <img src={PrinterIcon} alt="icon" />
                            </div>
                        </div>

                        <div className="d-flex flex-row justify-content-between">
                            <FontAwesomeIcon variant="light" icon={faArrowLeft} className="my-1 cursor-pointer" onClick={() => close()} size="2x" />
                            <div className="d-flex justify-content-end">
                                <span className="text-uppercase">
                                    <img
                                        src={Copy}
                                        width="15"
                                        height="15"
                                        className="cursor-pointer mr-2"
                                        onClick={(e) => {
                                            handleCopy(e, props.transactionRef);
                                        }}
                                        alt="copy"
                                    />
                                    {props.transactionRef}
                                </span>
                                <span className="mx-2">-</span>
                                <span
                                    className={`mb-1 ${props.refundList && props.refundList.length > 0
                                        ? "refund"
                                        : props.gatewayResponseMessage === "APPROVED"
                                            ? "text-success"
                                            : ["SM_X23", "SM_A"].indexOf(
                                                props.gatewayResponseCode
                                            ) > -1
                                                ? "default"
                                                : "text-danger"
                                        }`}
                                >
                                    {props.transType !== "PREAUTH"
                                        ? props.refundList && props.refundList.length > 0
                                            ? "Refunded"
                                            : props.gatewayResponseMessage === "APPROVED" ||
                                                props.gatewayResponseMessage === "Successful"
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
                                                        : null
                                    }
                                </span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                            <span className="text">
                                <span className="trans--currency">{props.currency}{" "}</span>
                                <span className="trans--amount">
                                    {formatNumber(Number(props.amount).toFixed(2))}
                                </span>
                            </span>

                            <div className="d-flex flex-row">
                                <Button variant="light" className="p-0 px-2 mr-2" style={{ background: "#DFE0EB" }}>
                                    <span className="font-10">{t("Send Invoice")}</span>
                                </Button>

                                {props.gatewayResponseCode === "00" &&
                                    //props.allowRefund &&
                                    isEmpty(props.refundList) &&
                                    isEmpty(props.disputeList) &&
                                    props.preAuthType !== "REFUND" &&
                                    canRaiseRefund && (
                                        <Button variant="danger" className="p-0 px-2" onClick={() => setIssue(!issue)}>
                                            <span className="font-10">{t("Issue Refund")}</span>
                                        </Button>
                                    )}
                            </div>
                        </div>
                    </div>

                    {issue &&
                        props.gatewayResponseCode === "00" &&
                        //props.allowRefund &&
                        isEmpty(props.refundList) &&
                        isEmpty(props.disputeList) &&
                        props.preAuthType !== "REFUND" &&
                        canRaiseRefund &&
                        (
                            <div className="bg-white px-3 py-4 mt-4">
                                <Can access={"REFUND_PAYMENT"}>
                                    <div className="card--title mb-3">{t("Refund Customer")}</div>
                                    <div className="card--subtitle mb-3">{t("Refund may take 3 - 10 working days to complete")}</div>
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
                                                    {t("Full Refund")}
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
                                            placeholder={t("Enter Refund Amount")}
                                        />
                                    </div>
                                    {" "}
                                    {!amountPass && amount !== undefined && (
                                        <Error>{t("Enter a valid amount")}</Error>
                                    )}

                                    <div className="mt-3">
                                        <Button
                                            variant="danger"
                                            className="p-0 px-2"
                                            style={{ width: "100%" }}
                                            type="submit"
                                            disabled={inProcess}
                                        >
                                            {inProcess ? <Spinner animation="border" size="sm" variant="light" /> : <span className="font-10">{t("Request Refund")}</span>}
                                        </Button>
                                    </div>
                                </Can>
                            </div>
                        )}

                    <div className="bg-white px-3 py-4 mt-4">
                        <div className="title py-2 font-16 font-medium">
                            {t("Transaction Breakdown")}
                        </div>
                        <div className="text-body py-1">
                            <span className="label">{t("Transaction Amount")} -</span>
                            <span className="text float-right">
                                {props.currency}{" "}
                                <strong>
                                    {formatNumber(Number(props.amount).toFixed(2))}
                                </strong>
                            </span>
                        </div>
                        <div className="text-body py-1">
                            <span className="label">{t("Transaction Fee")} -</span>
                            <span className="text float-right">
                                {props.currency}{" "}
                                <strong>
                                    {formatNumber(Number(props.fee).toFixed(2))}
                                </strong>
                            </span>
                        </div>
                        <hr className="mt-0" />
                        <div className="text-body">
                            <span className="label">{t("Total Due")} - </span>
                            <span className="text float-right">
                                {props.currency}{" "}
                                <strong>
                                    {formatNumber(
                                        Number(props.amount - props.fee).toFixed(2)
                                    )}
                                </strong>
                            </span>
                        </div>
                    </div>

                    {search_vendor &&
                        search_vendor.payload &&
                        props.vendorSettlementAmount !== null && (
                            <div className="bg-white px-3 py-4 mt-4">
                                <div className="title py-2 font-16 font-medium">{t("Split Share")}</div>
                                <div className="text-body py-1">
                                    <span className="label">{t("Your Commission")} -</span>
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
                                    <span className="label">{t("Sub Account Share")} -</span>
                                    <span className="text float-right">
                                        {props.currency}{" "}
                                        <strong>
                                            {formatNumber(
                                                Number(props.vendorSettlementAmount.toFixed(2))
                                            ) || 0}
                                        </strong>
                                    </span>
                                </div>
                            </div>)}

                    <div className="bg-white px-3 py-4 mt-4">
                        <div className="title pb-3 font-16 font-medium">
                            {t("Customer Details")}
                        </div>
                        {customerTrigger && (
                            <>
                                {" "}
                                <div className="d-flex justify-content-between my-2">
                                    {props.customer && props.customer.customerName && (
                                        <div className="text-body font-14 py-1">
                                            <div className="label" style={{ color: "#676767" }}>{t("Name")} -</div>
                                            <div className="text">
                                                {props.customer.customerName}
                                            </div>
                                        </div>
                                    )}
                                    {props.customer && props.customer.customerEmail && (
                                        <div className="text-body font-14 py-1">
                                            <div className="label" style={{ color: "#676767" }}>{t("Email")} -</div>
                                            <div className="text">
                                                {props.customer.customerEmail}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-between">
                                    {props.customer.customerPhone && (
                                        <div className="text-body font-14 py-1">
                                            <div className="label" style={{ color: "#676767" }}>{t("Phone Number")} -</div>
                                            <div className="text">
                                                {props.customer.customerPhone}
                                            </div>
                                        </div>
                                    )}
                                    <Button variant="light" className="p-0 px-2" style={{ background: "#DFE0EB", height: 42 }}>
                                        <span className="font-10">{t("View Customer")}</span>
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="bg-white px-3 py-4 mt-4">
                        <div className="title pb-3 font-16 font-medium">
                            {t("Analytics")}
                        </div>
                        {customerTrigger && (
                            <>
                                {" "}
                                <div className="d-flex flex-wrap  my-2">
                                    <div className="d-flex flex-column my-2">
                                        {props.analytics && props.analytics.channel && (
                                            <div className="text-body font-14 py-1 mr-4">
                                                <div className="label" style={{ color: "#676767" }}>{t("Channel Type")} -</div>
                                                <div className="text font-10">
                                                    {props.analytics.channel}
                                                </div>
                                            </div>
                                        )}

                                        {props.analytics && props.analytics.channelType && (
                                            <div className="text-body font-14 py-1 mr-4">
                                                <div className="label" style={{ color: "#676767" }}>{t("Channel")} -</div>
                                                <div className="text font-10">
                                                    {() => transactionChannel(props)}
                                                </div>
                                            </div>
                                        )}

                                        {props.analytics && props.analytics.country && (
                                            <div className="text-body font-14 py-1 mr-4">
                                                <div className="label" style={{ color: "#676767" }}>{t("Country")} - </div>
                                                <div className="text font-10">
                                                    <ReactCountryFlag
                                                        style={{
                                                            fontSize: "22px",
                                                        }}
                                                        countryCode={props.analytics.country}
                                                    />
                                                    {props.analytics.country}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* <div className="d-flex flex-column my-2">
                    {props.analytics && props.analytics.channel && (
                      <div className="text-body font-14 py-1 mr-4">
                        <div className="label" style={{ color: "#676767" }}>Device Type -</div>
                        <div className="text font-10">
                          {props.analytics.channel}
                        </div>
                      </div>
                    )}

                    {props.analytics && props.analytics.channelType && (
                      <div className="text-body font-14 py-1 mr-4">
                        <div className="label" style={{ color: "#676767" }}>Channel -</div>
                        <div className="text font-10">
                          {() => transactionChannel(props)}
                        </div>
                      </div>
                    )}

                    {props.analytics && props.analytics.country && (
                      <div className="text-body font-14 py-1 mr-4">
                        <div className="label" style={{ color: "#676767" }}>Country - </div>
                        <div className="text font-10">
                          <ReactCountryFlag
                            style={{
                              fontSize: "22px",
                            }}
                            countryCode={props.analytics.country}
                          />
                          {props.analytics.country}
                        </div>
                      </div>
                    )}
                  </div> */}



                                    <div className="text-body font-14 py-1 mr-4">
                                        <div className="label" style={{ color: "#676767" }}>{t("Errors")} -</div>
                                        <div className="text font-10">
                                            {error}
                                        </div>
                                    </div>




                                    {props.analytics && props.analytics.ipAddress && (
                                        <div className="text-body font-14 py-1 mr-4">
                                            <div className="label" style={{ color: "#676767" }}>{t("IP Address")} -</div>
                                            <div className="text font-10">
                                                {props.analytics.ipAddress}
                                            </div>
                                        </div>
                                    )}



                                    <div className="text-body font-14 py-1 mr-4">
                                        <div className="label" style={{ color: "#676767" }}>{t("Attempts")} -</div>
                                        <div className="text font-10">
                                            {attempt}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>`


                    <div className="bg-white px-3 py-4 mt-4">
                        <div className="title pb-3 font-16 font-medium">
                            {t("Insights")}
                        </div>
                        {props.eventList.length > 0
                            ? <TransactionEvents
                                events={props && props.eventList ? props.eventList : []}
                                setAttempt={(atmpt) => setAttempt(atmpt)}
                                setError={(err) => setError(err)}
                                setTime={(t) => setTime(t)}
                            />
                            : <span className="font-10" >{t("No Insight at the moment")}</span>
                        }
                    </div>

                </div>
            </form >
        </div >
    );
};

export default withRouter(TransactionOverviewModal);
