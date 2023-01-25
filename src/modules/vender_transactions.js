/** @format */

import React, { useState, useEffect } from "react";
import Table from "../utils/analytics/table";
import styled from "styled-components";
import { getPocketCustomerTransactions } from "../actions/postActions";
import Copy from "../assets/images/svg/copy.svg";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import cogoToast from "cogo-toast";

import "../pages/customer_pockets/css/customer_pockets.scss";

const Wrapper = styled.div`
  background: #fff;
`;

const NavMenuItem = styled.div`
  width: 95vw;
  margin: auto;
  font-size: 1.1em;
  color: #676767 !important;
  min-height: calc(100vh - 80px);
`;

function formatNumber(num) {
    return Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function VendorTransactions(props) {
    const {
        data,
        activeTab,
        getPocketCustomerTransactions,
        pocketReferenceId,
        type,
    } = props;
    const [perPage, setPerPage] = useState(25);
    const [categorizedTransactions, setCategorizedTransactions] = useState([]);


    useEffect(() => {
        data.payload && createCategorizedData(data.payload.accountHistory);
    }, [data.payload]);

    const createCategorizedData = () => {
        if (!isEmpty(data)) {
            let categorizedTransactions = [];
            categorizedTransactions = data.payload.accountHistory.map((list, id) => {
                return {
                    ...list,
                    currency: props.business_details.default_currency,
                };
            });
            setCategorizedTransactions(categorizedTransactions);
        }
    };

    const onRowClick = (e) => {
        console.log(e);
    };

    const changePage = (from = 1) => {
        getPocketCustomerTransactions({
            start: from,
            size: perPage,
            type,
            pocketReferenceId,
        });
    };

    const setRange = (page = perPage) => {
        getPocketCustomerTransactions({
            size: page,
            start: 1,
            type,
            pocketReferenceId,
        });
    };

    const handleCopy = (e, props) => {
        e.preventDefault();
        cogoToast.success(`Copied Successfully`, { position: "top-right" });
        const textField = document.createElement("textarea");
        textField.innerText = props;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        textField.remove();
    };

    return (
        <Wrapper>
            <NavMenuItem className=" w-100">
                <div className="row mx-auto">
                    <div className="col-md-12">
                    </div>
                </div>
                {activeTab === 0 && (
                    <Table
                        data={(categorizedTransactions && categorizedTransactions) || []}
                        totalRecords={(data.rowCount && data.rowCount) || 0}
                        currentpage={(data && data.currentPage) || "0"}
                        perPage={perPage}
                        transaction={true}
                        changePage={changePage}
                        setRange={(data) => {
                            setRange(data);
                            setPerPage(data);
                        }}
                        header={[
                            {
                                name: "Date",
                                pointer: "payout.requestDate",
                                format: "Y-MM-DD hh:mm:ss A",
                            },

                            {
                                name: "Reference",
                                pointer: "payout.transactionReference",
                                copy: true,
                                func: (props) => (
                                    <span className="row p-0 m-0">
                                        <div className="cut-text seerbit-color">{props}</div>
                                        <img
                                            src={Copy}
                                            width="15"
                                            height="15"
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                handleCopy(e, props);
                                            }}
                                        />
                                    </span>
                                ),
                            },
                            {
                                name: "Amount",
                                pointer: "payout",
                                func: (props) => (
                                    <div className="cut-text">
                                        {props.currency} {formatNumber(props.amount)}
                                    </div>
                                ),
                            },
                            {
                                name: "Balance  After",
                                pointer: "",
                                func: (props) => (
                                    <div className="cut-text">
                                        {props.currency} {formatNumber(props.currentBalance)}
                                    </div>
                                ),
                            },
                            {
                                name: "Transfer Source",
                                pointer: "payout",
                                copy: true,
                                func: (props) => (
                                    <span>{props && props.fundingSource && props.fundingSource || "Not Available"}</span>
                                ),
                            },
                            {
                                name: "Status",
                                pointer: "payout",
                                func: (props) => (
                                    <span
                                        className={
                                            props.status === "SUCCESSFUL"
                                                ? "text-capitalize success-transaction"
                                                : "text-capitalize failed-transaction"
                                        }
                                    >{`${props.status}`}</span>
                                ),
                            },
                        ]}
                        onRowClick={onRowClick}
                    />
                )}
                {activeTab === 1 && (
                    <Table
                        transaction={true}
                        data={(categorizedTransactions && categorizedTransactions) || []}
                        totalRecords={
                            (categorizedTransactions && categorizedTransactions.length) || 0
                        }
                        currentpage={(data && data.currentPage) || "0"}
                        perPage={perPage}
                        changePage={changePage}
                        setRange={(data) => {
                            setRange(data);
                            setPerPage(data);
                        }}
                        header={[
                            {
                                name: "Status",
                                pointer: "payout",
                                func: (props) => (
                                    <span
                                        className={
                                            props.status === "SUCCESSFUL"
                                                ? "text-capitalize success-transaction"
                                                : "text-capitalize failed-transaction"
                                        }
                                    >{`${props.status}`}</span>
                                ),
                            },
                            {
                                name: "Recipient",
                                pointer: "payout",
                                copy: true,
                                func: (props) => (
                                    <span>{props && props.fundingSource && props.fundingSource || "Not Available"}</span>
                                ),
                            },

                            {
                                name: "Amount",
                                pointer: "payout",
                                func: (props) => (
                                    <div className="cut-text">
                                        {props.currency} {formatNumber(props.amount)}
                                    </div>
                                ),
                            },
                            {
                                name: "Charge Fee",
                                pointer: "payout",
                                func: (props) => (
                                    <div className="cut-text">
                                        {props.currency} {formatNumber(props.charge)}
                                    </div>
                                ),
                            },
                            {
                                name: "Date",
                                pointer: "payout.requestDate",
                                format: "Y-MM-DD hh:mm:ss A",
                            },
                        ]}
                        onRowClick={onRowClick}
                    />
                )}
            </NavMenuItem>
        </Wrapper>
    );
}

const mapStateToProps = (state) => ({
    business_details: state.data.business_details,
    customers_transactions: state.data.pocket_customers_transactions,
});

export default connect(mapStateToProps, {
    getPocketCustomerTransactions,
})(VendorTransactions);
