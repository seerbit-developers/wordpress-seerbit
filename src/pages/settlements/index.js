/** @format */

import React, {useState, useEffect, Fragment} from "react";
import { connect } from "react-redux";
import {
  getBranches,
  getBranchSettlement,
  getSettlementTransaction,
  getBranchSettlementTransactions,
  transferSettlementFund, clearState,
} from "../../actions/postActions";
import moment from "moment";
import cogoToast from "cogo-toast";
import { Can } from "../../modules/Can";
import ReportSettlement from "../../modules/ReportSettlement";
// import { Dropdown } from "primereact/dropdown";
import transactions_json from "../../utils/strings/transaction.json";
import Details from "../../utils/analytics/settlement_details";
import BranchDetails from "../../utils/analytics/branch_payout_details";
import AppTable from "components/app-table";
import Copy from "../../assets/images/svg/copy.svg";
import { isEmpty } from "lodash";
import styled from "styled-components";
import {exportSettlementReport} from "../../services/settlementService";
import {searchSettlements,getSettlements,getInternationalSettlements} from "../../actions/settlementActions";
import useWindowSize from "../../components/useWindowSize";
import {alertError, alertInfo, alertSuccess} from "../../modules/alert";
import {handleCopy} from "utils";
import { useTranslation } from "react-i18next";
import {DebounceInput} from "react-debounce-input";
import DateRangePicker from 'rsuite/DateRangePicker';
import Dropdown from 'rsuite/Dropdown';
const Gap = styled.div`
  padding-bottom: 2em;
  padding-top: 1em;
`;


function SettlementPage(props) {
  const {t} = useTranslation()
  const [show_branch_details, setShowBranchDetails] = useState(false);
  const [location, setLocation] = useState("Local");
  const [active_option, setActiveOption] = useState("default");
  const [perPage, setPerPage] = useState(25);
  const [show_details, setShowDetails] = useState(false);
  const [payout_data, setPayoutData] = useState();
  const [branch_payout_data, setBranchPayoutData] = useState();
  const [show_mail_report, setShowMailReport] = useState(false);
  const [type, setType] = useState(false);
  const [reference, setReference] = useState("");
  const [processing, setProcessing] = useState();
  const [id, setID] = useState();
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(null);
  const [dateFilter, setDateFilter] = useState(true);
  const [ready, setReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [locationsOptions, setLocationsOptions] = useState([]);
  const [dates, setDates] = useState([
    moment().subtract(1, 'month').toDate(),
    moment().toDate(),
  ]);
  const size = useWindowSize()
  const { width } = size;

  function formatNumber(num) {
    return Number(num)
      .toFixed(2)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const changePage = (from, range = perPage, t = type) => {
    setPerPage(range);
    setCurrentPage(from);
    const start_date = dates ? dates[0]
    ? moment(dates[0]).format("DD-MM-yyyy")
    :  moment().subtract(1, 'month').format("DD-MM-yyyy")
    :  moment().subtract(1, 'month').format("DD-MM-yyyy");
  const stop_date = dates ? dates[1]
    ? moment(dates[1]).format("DD-MM-yyyy")
    : moment().format("DD-MM-yyyy")
    : moment().format("DD-MM-yyyy");
    const data = {
      search_term: reference,
      stop_date: stop_date,
      start_date: start_date,
      from,
      page:from,
      type: t,
      size: range
    };
    props.searchSettlements(data);
    setProcessing(true);
  };

  const filter = (
    from_date = dates[0],
    to_date = dates[1],
    page = 1,
    range = perPage,
    t = type,
    ref = "",
  ) => {
    setReference(ref)
    const from = from_date
      ? moment(from_date).format("DD-MM-yyyy")
      :  moment().subtract(3, 'month').format("DD-MM-yyyy");
    const to = to_date
      ? moment(to_date).format("DD-MM-yyyy")
      : moment().subtract(1, 'day').format("DD-MM-yyyy");
    setProcessing(true);
    setActiveOption("filter");

    const data = {
      search_term: ref,
      stop_date: dateFilter ? to : null,
      start_date: dateFilter ? from : null,
      mode: "",
      page,
      type: t,
      size: range,
      location: "payout",
      // cur: currency ? currency : props.business_details.default_currency,
    };
    props.searchSettlements(data);
    setActiveOption("filter");
  };

  const viewDetails = (e) => {
    if (e.hasBranchSummary) {
      setShowBranchDetails(true);
      setBranchPayoutData(e);
      props.getBranchSettlement({ cycleRef: e.cycleRef });
      // this.setState({ show_branch: true, transactions: e.transactions });
    } else {
      props.getSettlementTransaction({ cycleRef: e.cycleRef });
      setShowDetails(true);
      setPayoutData(e);
    }
  };

  useEffect(() => {
    // props.getSettlements();
    const start_date = dates ? dates[0]
    ? moment(dates[0]).format("DD-MM-yyyy")
    :  moment().subtract(1, 'month').format("DD-MM-yyyy")
    :  moment().subtract(1, 'month').format("DD-MM-yyyy");
  const stop_date = dates ? dates[1]
    ? moment(dates[1]).format("DD-MM-yyyy")
    : moment().subtract(1, 'day').format("DD-MM-yyyy")
    : moment().subtract(1, 'day').format("DD-MM-yyyy");
    const data = {
      search_term: reference,
      stop_date: dateFilter ? stop_date : null,
      start_date: dateFilter ? start_date : null,
      currentPage,
      type: type,
      size: perPage
    };
    props.searchSettlements(data);
    setProcessing(true);
    const eo = transactions_json.location.map(item=>{
      return {text:t(item.text), value: item.value}
    });
    setLocationsOptions(eo)
  }, []);

  useEffect(() => {
    if (props.business_details.default_currency)
      setCurrency(props.business_details.default_currency);
  }, [props.business_details]);

  useEffect(() => {
    setProcessing(false);
  }, [
    props.payouts,
    props.location,
    props.error_details,
    props.settlement_transactions,
    props.branch_settlements,
  ]);

  useEffect(() => {
    setLoading(true);
    if (!isEmpty(props.payouts)) {setLoading(false); setReady(true)};
    if (!isEmpty(props.error_details)) setLoading(false);
  }, [props.payouts, props.error_details]);

  useEffect(() => {
    if (props.error_details && props.location === "payouts") {
      setID();
      alertError(props.error_details.message);
    }

    if (
      props.error_details &&
      props.error_details.error_source === "request_report"
    ) {
      alertError(props.error_details.message || props.error_details.responseMessage);
      props.clearState({ error_details: null });
    }

    if (props.error_details && props.location === "transfer_settlement_fund") {
      setID();
      alertError(props.error_details.message);
    }
  }, [props.error_details]);

  useEffect(() => {
    if (props.request_report && props.location === "request_report") {
      closeEmailReport()
      alertSuccess(props.request_report.responseMessage);
    }

    if (props.transfer_settlement_fund && props.location === "transfer_settlement_fund") {
      setID();
      alertSuccess("Transfer was successful");
      props.clearState({ transfer_settlement_fund: null });
      props.getSettlements();
    }
  }, [props.location]);

  useEffect(()=>{
    reference && filter(dates[0], dates[1], 1, perPage, type, reference);
  }, [reference])
  const exportReports = ()=>{
    cogoToast.loading('Exporting Records');
    if (props.payouts){
      if (props.payouts.payload) {
        exportSettlementReport(props.payouts.payload).then( ()=>{
          alertSuccess('Download complete');
        }).catch( (e)=>{
          alertInfo('Sorry! An unexpected error occurred while downloading records. Try again.');
        })
      }else{
        alertInfo('Sorry! No data available to download yet');
      }
    }else{
      alertInfo('Sorry! No data available to download yet');
    }
  }

  const closeEmailReport = () => {
    setShowMailReport(false);
  };

  const onFilter = (type) => {
    setLocation(type);
    setType(type !== "local");
    filter(dates[0], dates[1], currentPage, perPage, type !== "local")
  }

  const [fullColumns] = React.useState([
    {
      name: t('Total Amount'),
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div className="cut-text">
        {props.settlementcurrency}{" "}
        {formatNumber(props.originalAmount)}
      </div>
    },
    {
      name: t('Settlement Amount'),
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div
          onClick={() => viewDetails(props)}
          className="cut-text seerbit-color cursor-pointer"
      >
        {props.settlementcurrency}{" "}
        {formatNumber(props.settlementAmount)}
      </div>
    },
    {
      name: t('Fee'),
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div className="cut-text">
        {props.settlementcurrency} {formatNumber(props.fee)}
      </div>
    },
    {
      name: t('Reference'),
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <span className="d-flex justify-content-start align-items-center">
                      <span className="cut-text">{props.cycleRef}</span>
                      <img
                          src={Copy}
                          width="15"
                          height="15"
                          className="cursor-pointer"
                          onClick={(e) => {
                            handleCopy(props.cycleRef);
                          }}
                       alt="Copy"/>
                    </span>
    },
    {
      name: t('Recipient'),
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: props => {
        let recipient = [];
        recipient =
            props.transfers &&
            props.transfers.filter(
                (transfer) =>
                    transfer.description === "Merchant Transfer"
                    // || transfer.description === "CG Transfer"
            );
        return (
            <span className="text-capitalize">
                        {recipient.length > 0 &&
                        recipient[0].merchantPayoutType === "wallet"
                            ? "Business Pocket"
                            : recipient.length > 0
                                ? recipient[0].receiverAccountName.substr(0,23)
                                : props.payoutServiceType === 'WALLET' ? props.merchant.business_name : "Not Available"}
                      </span>
        );
      },
    },
    {
      name: t("Status"),
      cellStyle: { textAlign: 'right',padding:0 },
      style: { width: '100px',textAlign: 'right' },
      selector: "status",
    },
    {
      name: t('Date'),
      cellStyle: { textAlign: 'right', padding:0 },
      style: { width: '180px',textAlign: 'right',paddingRight:'15px' },
      cell: props => <span>{moment(props.createdAt).format("DD-MM-yyyy, hh:mm A")}</span>
    }
  ]);
  const [mobileColumns] = React.useState([
    {
      name: t('Total Amount'),
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div className="cut-text">
        {props.settlementcurrency}{" "}
        {formatNumber(props.originalAmount)}
      </div>
    },
    {
      name: t('Settlement Amount'),
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div
          onClick={() => viewDetails(props)}
          className="cut-text seerbit-color cursor-pointer"
      >
        {props.settlementcurrency}{" "}
        {formatNumber(props.settlementAmount)}
      </div>
    },
    {
      name: t('Date'),
      cellStyle: { textAlign: 'right', padding:0 },
      style: { width: '180px',textAlign: 'right',paddingRight:'15px' },
      cell: props => <span>{moment(props.createdAt).format("DD-MM-yyyy, hh:mm A")}</span>
    }
  ]);

  return (
    <>
      {!show_details && !show_branch_details && (
        <div className="page-container py-5">
          <div className="py-3">
            <div className="font-medium pb-3 font-20 text-black">
              {t("Settlements")}
            </div>
            <Gap>
              <div>
                <div className="d-flex flex-row justify-content-between">
                  <div className="d-flex">
                    {width >= 991 &&
                        <Fragment>
                          <DateRangePicker
                              onChange={(r)=>{ setDates(r);} }
                              defaultValue={dates}
                              appearance={'default'}
                          />
                          <DebounceInput
                              minLength={2}
                              debounceTimeout={2000}
                              className="font-12 text-left w-200px sbt-border-success p-2 ml-3"
                              placeholder={t('Cycle reference')}
                              aria-label="Search"
                              onChange={(e) => {
                                search(e.target.value);
                                setReference(e.target.value);
                              }}
                          />
                        </Fragment>
                    }
                  </div>
                  <div>
                    <div className="d-flex justify-content-end p-0 m-0">
                      <Dropdown title="Filter">
                        <Dropdown.Item onClick={()=>onFilter('local')}>Local</Dropdown.Item>
                        <Dropdown.Item onClick={()=>onFilter('international')}>International</Dropdown.Item>
                      </Dropdown>
                      <Can access={"EXPORT_MERCHANT_REPORT"}>
                        <div className='ml-3'>
                        <Dropdown
                            title="Export"
                        >
                          <Dropdown.Item onClick={()=>exportReports()}>Export to Excel</Dropdown.Item>
                          <Dropdown.Item  onClick={()=>setShowMailReport(true)}>Export to email</Dropdown.Item>
                        </Dropdown>
                        </div>
                      </Can>
                    </div>
                  </div>
                </div>
              </div>

            </Gap>
            {show_mail_report && (
              <ReportSettlement
                request={true}
                type="SETTLEMENT"
                show={show_mail_report}
                process={processing}
                setProcessing={setProcessing}
                isInternational={location === 'International'}
                close={closeEmailReport}
                email={
                  props.user_details.email ? props.user_details.email : ""
                }
              />
            )}
            {
            <AppTable
                columns={width >= 991 ? fullColumns : mobileColumns}
                headerStyle={{textTransform: 'uppercase'}}
                loading={props.loading}
                fixedLayout={false}
                paginate={props.payouts ? props.payouts.rowCount ? Math.ceil(props.payouts.rowCount / perPage) > 1 : false : false}
                perPage={perPage}
                totalPages={props.payouts ? props.payouts.rowCount ? Math.ceil(props.payouts.rowCount / perPage) : 0 : 0}
                changePage={(page) => {
                  changePage(page.activePage);
                }}
                currentPage={
                  props.payouts &&
                  props.payouts.currentpage ?
                      parseInt(props.payouts.currentpage) + 1 : 1
                }
                data={
                  props.payouts &&
                  props.payouts.payload ?
                      props.payouts.payload : []
                }
            />
            }
            {width < 991 &&
            <AppTable
                columns={mobileColumns}
                headerStyle={{textTransform: 'uppercase'}}
                loading={props.loading}
                paginate={props.payouts ? props.payouts.rowCount ? Math.ceil(props.payouts.rowCount / perPage) > 1 : false : false}
                perPage={perPage}
                totalPages={props.payouts ? props.payouts.rowCount ? Math.ceil(props.payouts.rowCount / perPage) : 0 : 0}
                changePage={(page) => {
                  changePage(page.activePage);
                }}
                currentPage={
                  props.payouts &&
                  props.payouts.currentpage ?
                      parseInt(props.payouts.currentpage) + 1 : 1
                }
                data={
                  props.payouts &&
                  props.payouts.payload ?
                      props.payouts.payload : []
                }
            />
            }
          </div>
        </div>
      )}
      {show_details && (
        <div>
          <Details
            props={payout_data}
            type={type}
            close={() => setShowDetails(false)}
            settlement_transactions={
              (props.settlement_transactions &&
                props.settlement_transactions.payload) ||
              []
            }
          />
        </div>
      )}
      {show_branch_details && (
        <div>
          <BranchDetails
            props={branch_payout_data}
            close={() => setShowBranchDetails(false)}
            error_details={props.error_details}
            branch_settlements={
              (props.branch_settlements && props.branch_settlements.payload) ||
              []
            }
            getBranchSettlementTransactions={
              props.getBranchSettlementTransactions
            }
            settlement_transactions={
              (props.settlement_transactions &&
                props.settlement_transactions.payload) ||
              []
            }
            clear={() =>
              props.clearState({
                name: "branch_settlements",
                value: {},
              })
            }
          />
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  // payouts: state.data.payouts,
  payouts_search_result: state.data.payouts_search_result,
  error_details: state.data.error_details,
  location: state.data.location,
  user_details: state.data.user_details,
  business_details: state.data.business_details,
  branches: state.data.branches,
  branch_payout: state.data.branch_payout,
  branch_settlements: state.data.branch_settlements,
  settlement_transactions: state.data.settlement_transactions,
  transfer_settlement_fund: state.data.transfer_settlement_fund,
  request_report: state.data.request_report,
  loading: state.data.loading_settlements,
  settlements: state.settlement.settlements,
  payouts: state.settlement.settlements,
});

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
});

export default connect(mapStateToProps, {
  getSettlements,
  searchSettlements,
  getInternationalSettlements,
  getBranches,
  getBranchSettlement,
  getSettlementTransaction,
  getBranchSettlementTransactions,
  transferSettlementFund,
  clearState,
})(SettlementPage);
