/** @format */

import React, { useState } from "react";
import { connect } from "react-redux";
import {
    getPocketCustomerTransactions,
} from "actions/postActions";
import { Dropdown } from "primereact/dropdown";
import { CSVLink } from "react-csv";
import PocketTransactions from "modules/pocket_transactions";
import Loader from "assets/images/svg/loader.svg";
import styled from "styled-components";
import {useParams} from "react-router";
import LeftChevron from "../../assets/images/svg/leftChevron";
import {Link} from "react-router-dom";

const Wrapper = styled.div`
  background: #fff;
`;

const NavMenuItem = styled.div`
  // width: 95vw;
  margin: auto;
  font-size: 1.1em;
  color: #676767 !important;
  // min-height: calc(100vh - 80px);
`;

const RightComponent = styled.div`
  float: right;
`;

const Counter = styled.span`
  color: #bababa;
  font-size: 12px;
  font-weight: 400;
`;

export function Overview({
                             creditData,
                             close,
                             business_details,
                             type,
                             getPocketCustomerTransactions,

                         }) {
    const [expt, setExport] = useState();
    const [perPage, setPerPage] = useState(25);
    let { pocketReferenceId } = useParams();

    const exports = [
        {
            text: "Export to Excel",
            value: 1,
            label: 1,
        }
    ];

    const headers_credit = [
        { label: "Date", key: "payout.requestDate" },
        { label: "Reference", key: "payout.transactionReference" },
        { label: "Amount", key: "payout.amount" },
        { label: "Currency", key: "currency" },
        { label: "Charge Fees", key: "payout.charge" },
        { label: "Balanace", key: "currentBalance" },
        { label: "Transfer Source", key: "payout.fundingSource" },
        { label: "Status", key: "status" },
    ];


    const downloadTemplate = (option) => {
        if (option.value === 1)
            return (
                <div className="my-1 font-12 font-weight-bold">
                    <CSVLink
                        data={
                            (creditData &&
                                creditData.payload &&
                                creditData.payload.accountHistory) ||
                            []
                        }
                        headers={headers_credit}
                        filename={`${new Date().getTime()}-pocket_transactionss.csv`}
                    >
                        <span style={{ color: "#333333" }}>{option.text}</span>
                    </CSVLink>
                </div>
            );
    };
    React.useEffect( ()=>{

        getPocketCustomerTransactions({
            start: 0,
            size: perPage,
            type: 'ALL',
            pocketReferenceId,
        });
    }, [])

    return (
        <Wrapper className="sbt-transaction">
            <NavMenuItem className="py-5">
                <Link to="/pocket/sub/pockets" className="backk pb-5">
                    <LeftChevron /> return to customers
                </Link>
                <div className="font-medium pb-1 font-20 text-black">
                    {creditData && creditData.payload && creditData.payload.account
                        ? `${creditData.payload.account.firstName}'s`
                        : ""}{" "}
                    Pocket Transactions &nbsp;&nbsp;{" "}
                    <Counter>
                        TOTAL TRANSACTION &nbsp;&nbsp;{" "}
                        {(creditData && creditData.rowCount) || 0}
                    </Counter>
                </div>

                <div className="col-6 m-0 p-0">
                    <div
                        className="paymentstate-box row p-3 ml-0 my-4 border br-normal"
                        style={{ width: "350px" }}
                    >
                        <div className="font-medium pb-3 font-20 text-black">
              <span className="row">
                <div>
                  <div className="px-3">
                    <div>
                      <Counter>Current Balance</Counter>
                    </div>
                      {`${business_details.default_currency || ""} 
                    ${
                          (creditData &&
                              creditData.payload &&
                              creditData.payload.account &&
                              Number(creditData.payload.account.balance)) ||
                          0
                      }`}
                  </div>
                </div>
                <div class="vertical-divider mx-3 mt-3"></div>
                <div>
                  <div className="pl-3">
                    <div>
                      <Counter>Last Transfer</Counter>
                    </div>
                      {`${business_details.default_currency || ""} 
                    ${
                          (creditData &&
                              creditData.payload &&
                              creditData.payload.account &&
                              Number(creditData.payload.account.lastBalance)) ||
                          0
                      }`}
                  </div>
                </div>
              </span>
                        </div>
                    </div>
                </div>
                <div className="my-4">
                    <div className="d-flex justify-content-end">
                        <RightComponent className="row p-0 m-0 sbt-filter">
              <span className="font-12 font-light export_data">
                <Dropdown
                    optionLabel="text"
                    value={expt}
                    options={exports}
                    onChange={(e) => {
                        setExport(e.target.value);
                    }}
                    itemTemplate={downloadTemplate}
                    placeholder="Export Data"
                    className="font-12 text-left w-200px sbt-border-success py-2"
                    showClear={true}
                />
              </span>
                        </RightComponent>
                    </div>
                </div>
                <div>
                    {/* <AppTable columns={fullColumns} /> */}
                    <PocketTransactions
                        data={(creditData && creditData) || []}
                        type={type}
                        pocketReferenceId={pocketReferenceId}
                    />
                    {!creditData && (
                        <div className="d-flex justify-content-center mt-3">
                            <img src={Loader} width="100" />
                        </div>
                    )}
                </div>
            </NavMenuItem>
        </Wrapper>
    );
}

const mapStateToProps = (state) => ({
    business_details: state.data.business_details,
    creditData: state.data.customer_pocket_credit,
});

export default connect(mapStateToProps,{getPocketCustomerTransactions})(Overview);

