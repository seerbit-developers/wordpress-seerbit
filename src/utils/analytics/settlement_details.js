/** @format */

import React, { useState, useEffect } from "react";

import moment from "moment";
import { connect } from "react-redux";
import { clearState } from "../../actions/postActions";
import Badge from "components/badge";
import AppTable from "components/app-table";
import { Can } from "../../modules/Can";
import { Dropdown } from "primereact/dropdown";
import { isEmpty } from "lodash";
import transactions_json from "../strings/transaction.json";
import Mastercard from "../../assets/images/svg/mastercard-icon.svg";
import Bank from "../../assets/images/svg/bank-icon.svg";
import Visa from "../../assets/images/svg/visa-icon.svg";
import Verve from "../../assets/images/verve.png";
import Exchange from "../../assets/images/svg/transfer-icon.svg";
import cogoToast from "cogo-toast";
import "./css/sbt-table.scss";
import styled from "styled-components";
import {
  exportRefundsReport,
  exportTransactionsReport,
  getSettlementsRefunds
} from "services/settlementService";
import LeftChevron from "../../assets/images/svg/leftChevron";
import useWindowSize from "../../components/useWindowSize";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import TransactionOverviewModal from "../../pages/transactions/components/TransactionOverviewModal";
import {getTransactionStatusStyle, getTransactionStatusType,getTransactionStatus} from "../index";
import {alertInfo, alertSuccess} from "../../modules/alert";

const RightComponent = styled.div`
  float: right;
`;

function formatNumber(num) {
  return Number(num)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function SettlementDetails({
  props,
  close,
  settlement_transactions,
  error_details,
  clearState,
  type
}) {

  const exports = transactions_json.export_settlement_details;
  const [expt, setExport] = useState();
  const [isSideMenuModalOpen, setIsSideMenuModalOpen] = useState(false);
  const [transaction_data, setTransactionData] = useState();
  const [show_overview, setShowOverview] = useState();
  const [loadingRefunds, setLoadingRefunds] = useState(false);
  const [refunds, setRefunds] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('TRANSACTIONS');
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
  });
  const size = useWindowSize()
  const { width, height } = size;
  const renderTooltipReference = (props) => (
      <Tooltip id="button-tooltip">
        {props.transactionRef}
      </Tooltip>
  );

  useEffect(() => {
    setLoading(true);
    if (!isEmpty(settlement_transactions) && !props.refundVolume) {
      setLoading(false);
      setTransactions(settlement_transactions);
    }

    if (!isEmpty(error_details)) setLoading(false);

    if (!isEmpty(refunds) && !isEmpty(settlement_transactions)) {
      setLoading(false);
      const transformed_refunds = refunds.map(item=> {return {...item, amount:-item.amount, settlementAmount:-item.amount}})
      const newTransactions = [].concat(settlement_transactions,transformed_refunds)
      setTransactions(newTransactions)
    }
  }, [settlement_transactions, error_details, refunds]);

  const exportReports = () => {
    cogoToast.loading('Exporting Records');
    if (transactions) {
      if (transactions) {
        exportTransactionsReport(transactions).then(() => {
          alertSuccess('Download complete');
        }).catch((e) => {
          alertInfo('Sorry! An unexpected error occurred while downloading records. Try again.');
        })
      } else {
       alertInfo('Sorry! No data available to download yet');
      }
    } else {
      alertInfo('Sorry! No data available to download yet');
    }
  }
  const exportRefunds = () => {
    if (refunds) {
      if (Array.isArray(refunds) && refunds.length) {
        cogoToast.loading('Exporting Records');
        exportRefundsReport(refunds)
      }
    }

  }
  const getRefunds = () => {
    setLoadingRefunds(true);
    getSettlementsRefunds(props.cycleRef,type).then(res => {
      // exportRefundsReport('nNEeehupCqyUbYzUCz').then(res=>{
      setLoadingRefunds(false);
      if (res.responseCode === '00') {
        setRefunds(res.payload);
      }
    }).catch(e => {
      setLoadingRefunds(false);
    })
  }
  const downloadTemplate = (option) => {
    if (!option.value) {

    } else {
      if (option.value === 1) {
        return (
          <div className="my-1 font-12 font-weight-bold">
            <span style={{ color: "#333333" }} onClick={() => exportReports()}>{option.text}</span>
          </div>
        );
      }
      if (option.value === 2  && props.refundVolume) {
        return (
          <div className="my-1 font-12 font-weight-bold">
            <span style={{ color: "#333333" }} onClick={() => exportRefunds()}>{option.text}</span>
          </div>
        );
      }else{
        return null
      }
    }
  };
  const transactionChannel = (props) => {
    try {
      return (
        <span className="number">
          <img
            width="25px"
            height="auto"
            src={
              props.analytics.channel === "account" ||
                props.analytics.channel === "ACCOUNT"
                ? Bank
                : props.analytics.channelType &&
                  props.analytics.channelType
                    .toLowerCase()
                    .indexOf("master") !== -1
                  ? Mastercard
                  : props.analytics.channelType &&
                    props.analytics.channelType.toLowerCase().indexOf("visa") !==
                    -1
                    ? Visa
                    : props.analytics.channelType &&
                      props.analytics.channelType.toLowerCase().indexOf("verve") !==
                      -1
                      ? Verve
                      : props.analytics.channel &&
                        props.analytics.channel.toLowerCase().indexOf("card") !== -1
                        ? cardQuickDection(props.maskNumber)
                        : Exchange
            }
            className="mr-2 mb-1"
          />
          {props.analytics.channel &&
            props.analytics.channel.toLowerCase().indexOf("card") !== -1
            ? props.maskNumber &&
            `xxxx ${props.maskNumber.substring(props.maskNumber.length - 4)}`
            : props.analytics.channel &&
              props.analytics.channel.toLowerCase().indexOf("account") !== -1
              ? props.analytics.channelType
              : props.analytics.channel}
        </span>
      );
    } catch (e) {
      return Exchange;
    }
  };
  const cardQuickDection = text => {
    return /^5[1-5][0-9]+/.test(text) || text === '2223000000000007'
      ? Mastercard
      : /^4[0-9]+(?:[0-9]{3})?/.test(text)
        ? Visa
        : /^5[0][0-9]+/.test(text)
          ? Verve
          : '';
  };

  useEffect(() => {
    if (props.refundVolume) {
      getRefunds()
    }
  }, [props.refundVolume]);

  const viewTransactionData = (data) => {
    setIsSideMenuModalOpen(true)
    setTransactionData(data);
  }

  const [fullColumnsTransactions] = React.useState([
    {
      name: 'Customer',
      style: { width: '200px' },
      cell: row => <span className="text-right" title={row && row.customer && row.customer.customerName}> {row && row.customer && row.customer.customerName && row.customer.customerName.substr(0, 15)}</span>
    },
    {
      name: 'Reference',
      style: { width: '200px' },
      cell: data => <span className="row p-0 m-0">

        <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltipReference(data)}
        ><div
            onClick={(e) => {
              viewTransactionData(data)
            }}
            className="cut-text cursor-pointer text-uppercase"
        >
            <span>{data && data.transactionRef ? data.transactionRef.substr(0, 15) : ""}</span>

          </div>
        </OverlayTrigger>
      </span>
    },
    {
      name: 'Settled Amount',
      cellStyle: { textAlign: 'left' },
      style: { width: '120px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return (
            <div className="text-left" onClick={() => viewTransactionData(props)}>
              <div>
              <span className="" style={{ fontWeight: "500" }} onClick={() => viewTransactionData(props)}>
                {props.currency} {formatNumber(props.settlementAmount)}
              </span>
              </div>

            </div>
        )
      }
    },
    {
      name: 'Amount',
      cellStyle: { textAlign: 'left' },
      style: { width: '120px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return (
            <div className="text-left" onClick={() => viewTransactionData(props)}>
              <div>
              <span className="" style={{ fontWeight: "500" }} onClick={() => viewTransactionData(props)}>
                {props.currency} {formatNumber(props.amount)}
              </span>
              </div>

            </div>
        )
      }
    },
    {
      name: '',
      style: { width: '100px', paddingRight: '15px' },
      cell: props => {
        const preAuthType = (props.preAuthType && props.preAuthType.replace("_", " ").toLowerCase()) || "";
        const preAuthCapitalized = preAuthType.charAt(0).toUpperCase() + preAuthType.slice(1);
        return (
            <div className="text-left" onClick={() => viewTransactionData(props)}>
              <Badge
                  status={getTransactionStatusType(props,preAuthCapitalized)}
                  styles={getTransactionStatusStyle(props,preAuthCapitalized)}
              >
                {getTransactionStatus(props,preAuthCapitalized)}
              </Badge>
            </div>
        )
      }
    },
    {
      name: 'Payment Channel',
      style: { width: '250px', paddingRight: '15px', textAlign: 'left' },
      cell: row => <span className="text-lowercase text-center" onClick={() => viewTransactionData(props)}>{row.analytics ? row.analytics.channel ? row.analytics.channel : "" : ""}</span>
    },


    {
      name: 'Date',
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: data => <span>{moment(data.transactionTimeString).format("DD-MM-yyyy, hh:mm A")}</span>
    },
      ]);
  const [columnsMobile] = React.useState([
    {
      name: 'Settled Amount',
      cellStyle: { textAlign: 'left' },
      style: { width: '110px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return (
            <div className="text-left" onClick={() => viewTransactionData(props)}>
              <div>
              <span className="" style={{ fontWeight: "500" }} onClick={() => viewTransactionData(props)}>
                {props.currency} {formatNumber(props.settlementAmount)}
              </span>
              </div>

            </div>
        )
      }
    },
    {
      name: '',
      style: { width: '100px', paddingRight: '15px' },
      cell: props => {
        const preAuthType = (props.preAuthType && props.preAuthType.replace("_", " ").toLowerCase()) || "";
        const preAuthCapitalized = preAuthType.charAt(0).toUpperCase() + preAuthType.slice(1);
        return (
            <div className="text-left" onClick={() => viewTransactionData(props)}>
              <Badge
                  status={getTransactionStatusType(props,preAuthCapitalized)}
                  styles={getTransactionStatusStyle(props,preAuthCapitalized)}
              >
                {getTransactionStatus(props,preAuthCapitalized)}
              </Badge>
            </div>
        )
      }
    },
    {
      name: 'Time Stamp', cell: data => <span>{moment(data.transactionTimeString).format("D-M-yy, HH:mm")}</span>
    },
  ]);

  return (
    <>
      {!show_overview && (
        <div className="page-container py-5">
          <div className="py-3">
            <div onClick={(e) => {
              clearState({ settlement_transactions: null });
              close();
            }} className="backk pb-5">
              <LeftChevron /> return to settlements
            </div>
            <div className="font-medium pb-3 font-20 text-black">
              Settlement Details{" "}
              {/*<Counter>TOTAL {settlement_transactions.length || 0}</Counter>*/}
            </div>
                <div className="d-flex justify-content-between">
                  <div
                    className="col-md-8 col-sm-12"
                    style={{ backgroundColor: "#fcfcff" }}
                  >
                    <div className="paymentstate-box row pb-4 border br-normal">
                      <div className="col-sm-3">
                        <div className="text-center">
                          <br />
                          <div className="font-weight-bold sbt-deep-color font-18">
                            {moment(props.createdAt).format(
                              "ddd. MMM DD, yyyy"
                            )}
                          </div>
                          <small className="text-muted">Completed on</small>
                        </div>
                      </div>

                      <div className="col-sm-3">
                        <div className="text-center">
                          <br />
                          <div className="font-weight-bold sbt-deep-color font-18">
                            {props.paymentCurrency && props.paymentCurrency}{" "}
                            {props.settlementAmount &&
                              formatter.format(props.settlementAmount)}
                          </div>
                          <small className="text-muted">Amount settled</small>
                        </div>
                      </div>

                      <div className="col-sm-3">
                        <div className="text-center">
                          <br />
                          <div className="font-weight-bold sbt-deep-color font-18">
                            {props.paymentCurrency && props.paymentCurrency}{" "}
                            {props.originalAmount ? formatter.format(props.originalAmount) : 0}
                          </div>
                          <small className="text-muted">
                            Transaction Amount
                          </small>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <div className="text-center">
                          <br />
                          <div className="font-weight-bold sbt-deep-color font-18">
                            {props.paymentCurrency && props.paymentCurrency}{" "}
                            {props.refundVolume || 0}
                          </div>
                          <small className="text-muted">Amount Refunded</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-none d-sm-block">
                    <RightComponent>
                      <div className="row">
                        <Can access={"EXPORT_MERCHANT_REPORT"}>
                          {
                            (!loading && !loadingRefunds) &&
                          <span className="font-12 font-light px-3 export_data">
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
                          }
                        </Can>
                      </div>
                    </RightComponent>
                  </div>
                </div>

            <div className="pt-5">
              {
                activeTab === 'TRANSACTIONS' ?
                  <div className="font-medium pb-3 font-16 text-black">
                    Transactions{" "}
                  </div>
                  :
                  <div className="font-medium pb-3 font-16 text-black">
                    Refunds{" "}
                  </div>
              }

              {
                props.refundVolume ?
                  <div className="d-flex mb-3">
                    <div
                      className={`font-medium font-16 text-black settlement--tab ${activeTab === 'TRANSACTIONS' && 'settlement--tab-active'}`}
                      onClick={() => setActiveTab('TRANSACTIONS')}>
                      Transactions{" "}
                    </div>
                    <div
                      className={`font-medium font-16 text-black settlement--tab ${activeTab === 'REFUNDS' && 'settlement--tab-active'}`}
                      onClick={() => setActiveTab('REFUNDS')}
                    >
                      Refunds{" "}
                    </div>
                  </div>
                  : null
              }

            </div>
            <div>

              {
                activeTab === 'TRANSACTIONS' && (
                width >= 991 ?
                <AppTable
                    columns={fullColumnsTransactions}
                    headerStyle={{textTransform: 'uppercase'}}
                    loading={loading || loadingRefunds}
                    paginate={false}
                    data={transactions}
                    onClickRow={viewTransactionData}
                    rowStyle={{ cursor: 'pointer' }}
                />
                :
                <AppTable
                columns={columnsMobile}
                headerStyle={{textTransform: 'uppercase'}}
                loading={loading || loadingRefunds}
                paginate={false}
                data={transactions}
                onClickRow={viewTransactionData}
                rowStyle={{ cursor: 'pointer' }}
                />
                )

              }
              {
                activeTab === 'REFUNDS' && (
                    width >= 991 ?
                        <AppTable
                            columns={fullColumnsTransactions}
                            headerStyle={{textTransform: 'uppercase'}}
                            loading={loadingRefunds}
                            paginate={false}
                            data={(refunds && refunds) || []}
                            onClickRow={viewTransactionData}
                            rowStyle={{ cursor: 'pointer' }}
                        />
                        :
                        <AppTable
                            columns={columnsMobile}
                            headerStyle={{textTransform: 'uppercase'}}
                            loading={loadingRefunds}
                            paginate={false}
                            data={(refunds && refunds) || []}
                            onClickRow={viewTransactionData}
                            rowStyle={{ cursor: 'pointer' }}
                        />
                )
              }


            </div>
          </div>
        </div>
      )}
      {isSideMenuModalOpen &&
      <TransactionOverviewModal
          isOpen={isSideMenuModalOpen}
          close={() => setIsSideMenuModalOpen(false)}
          props={transaction_data}
          setShowOverview={() => setShowOverview(false)}
          transactionChannel={transactionChannel}
          isMobile={width < 991}
      />}
    </>
  );
}

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps, {
  clearState,
})(SettlementDetails);
