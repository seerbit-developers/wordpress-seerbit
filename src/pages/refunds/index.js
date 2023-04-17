/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getRefunds, searchRefunds, clearState } from "../../actions/postActions";
import moment from "moment";
import { CSVLink } from "react-csv";
import styled from "styled-components";
import { Dropdown } from "primereact/dropdown";
import { Can } from "../../modules/Can";
import Copy from "../../assets/images/svg/copy.svg";
import { isEmpty } from "lodash";
import ReportRefund from "../../modules/ReportRefund";
import AppTable from "components/app-table";
import useWindowSize from "../../components/useWindowSize";
import Filter from "../../utils/analytics/filter";
import {alertError, alertSuccess} from "../../modules/alert";
import {DebounceInput} from "react-debounce-input";
import {handleCopy}  from "utils";
const Gap = styled.div`
  padding-bottom: 2em;
  padding-top: 1em;
`;

import { useTranslation } from "react-i18next";


function RefundPage(props) {
  const [active_option, setActiveOption] = useState("default");
  const [searchParam, setSearchParam] = useState("");
  const [show_filter, setShowFilter] = useState(false);
  const [perPage, setPerPage] = useState(25);
  const [processing, setProcessing] = useState();
  const [dates, setDates] = useState([]);
  const [refundSource, setRefundSource] = useState('ALL');
  const [refundSources] = useState([
      {value:'ALL', text:'ALL'},
    {value:'CHARGEBACK', text:'CHARGEBACK'},
    {value:'REFUND', text:'REFUND'}]
  );
  const [defaultDates, setDefaultDates] = useState([
    moment().subtract(3, 'months'),
    moment()
  ]);
  const [expt, setExport] = useState();
  const [loading, setLoading] = useState(false);
  const [show_mail_report, setShowMailReport] = useState(false);
  const size = useWindowSize()
  const { width, height } = size;
  const {t} = useTranslation()

  const exports = [
    {
      text: t("Export to Excel"),
      value: 1,
      label: 1,
    },
    {
      text: t("Request Report link"),
      value: 3,
      label: 3
    }
  ];

  const getFromDate = () => {
    if (typeof defaultDates === 'object') {
      return defaultDates && defaultDates[0] ? moment(defaultDates[0]).format("DD-MM-yyyy") : null;
    } else {
      return defaultDates && defaultDates[0] ? defaultDates[0] : null;
    }

  }

  const getToDate = () => {
    if (typeof defaultDates === 'object') {
      return defaultDates && defaultDates[1] ? moment(defaultDates[1]).format("DD-MM-yyyy") : null;
    } else {
      return defaultDates && defaultDates[1] ? defaultDates[1] : null;
    }
  }

  function formatNumber(num) {
    return Number(num)
      .toFixed(2)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  useEffect(() => {
    filter()
    setLoading(true);
  }, []);

  useEffect(() => {
    setProcessing(false);
  }, [props.refunds, props.location, props.error_details]);

  useEffect(() => {
    setLoading(true);
    if (!isEmpty(props.refunds)) setLoading(false);
    if (!isEmpty(props.error_details)) setLoading(false);
  }, [props.refunds, props.error_details]);

  useEffect(() => {
    if (props.request_report && props.location === "request_report") {
      closeEmailReport();
      setProcessing(false);
      alertSuccess(props.request_report.responseMessage);
    }
  }, [props.location]);

  useEffect(() => {
    if (
      props.error_details &&
      props.error_details.error_source === "request_report"
    ) {
      setProcessing(false);
      alertError(props.error_details.message || props.error_details.responseMessage);
      props.clearState({ error_details: null });
    }
  }, [props.error_details]);

  const changePage = (from, range = perPage) => {
    const from_date = getFromDate();
    const to_date = getToDate();
    setPerPage(range);
    active_option === "filter"
      ? filter(from_date, to_date, from, range)
      : props.getRefunds({ start: from, size: perPage });
    setProcessing(true);
  };

  const filter = (
    from_date = getFromDate(),
    to_date = getToDate(),
    page = 1,
    range = perPage,
    search_term = searchParam,
    refundSource = refundSource,
  ) => {

    const from = from_date
    const to = to_date
    setProcessing(true);
    setActiveOption("filter");
    const data = {
      search_term: search_term,
      stop_date: to,
      start_date: from,
      mode: "",
      page,
      size: range,
      location: "refund",
      refundSource: refundSource,
    };
    props.searchRefunds(data);
  };

  const headers = [
    { label: t("Reference"), key: "refundRef" },
    { label: t("Beneficiary Name"), key: "customer.customerName" },
    { label: t("Beneficiary Mobile No"), key: "customer.customerPhone" },
    { label: t("Currency"), key: "currency" },
    { label: t("Amount"), key: "amount" },
    { label: t("Refund Source"), key: "refundCategoryEnum" },
    { label: t("Refund Type"), key: "type" },
    { label: t("Triggered Date"), key: "created_at" },
    { label: t("Product ID"), key: "transaction.productId" },
  ];

  const downloadTemplate = (option) => {
    if (!option.value) {
      return option.text;
    } else {
      if (option.value === 1)
        return (
          <div className="my-1 font-12 font-weight-bold">
            <CSVLink
              data={(props.refunds && props.refunds.payload) || []}
              headers={headers}
              filename={`${new Date().getTime()}-refund.csv`}
              className=""
            >
              <span style={{ color: "#333333" }}>{option.text}</span>
            </CSVLink>
          </div>
        );
      else if (option.value === 3)
        return (
          <div
            className="my-1 font-12 font-weight-bold"
            onClick={() => {
              setShowMailReport(true);
            }}
          >
            {option.text}
          </div>
        );
    }
  };

  const closeEmailReport = () => {
    setShowMailReport(false);
  };

  // const filterTransitions = useTransition(!show_filter, null, {
  //   from: { opacity: 0, marginRight: -25, marginLeft: 25 },
  //   enter: {
  //     opacity: 1,
  //     marginRight: 0,
  //     marginLeft: 0
  //   },
  //   leave: { opacity: 0, marginRight: -10, marginLeft: 10 },
  // });
  const [fullColumns] = React.useState([
    {
      name: t('Status'),
      style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div className="cut-text">
        {props.status ? props.status : "NA"}
      </div>
    },
    {
      name: t('Amount'),
      style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div className="cut-text">
          {props.currency} {formatNumber(props.amount)}
      </div>
    },
    {
      name: t('Beneficiary'),
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <span title={isEmpty(props.customer.customerName) ? '' : props.customer.customerName?.substring(0,20)}>
        {isEmpty(props.customer.customerName) ? 'NA' : props.customer.customerName?.substring(0,20)}
      </span>
    },
    {
      name: t('Source'),
      style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div>
        {props.refundCategoryEnum ? t(props.refundCategoryEnum.replace(/_/g, ' ')) : t("REFUND")}
      </div>
    },
    {
      name: t('Refund Type'),
      style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div>
        {props.type ? t(props.type.replace(/_/g, ' ').replace('FULL DISPUTE', 'FULL REFUND')) : "NA"}
      </div>
    },
    {
      name: t('Transaction Reference'),
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div className="d-flex align-items-center justify-content-start p-0 m-0">
                  <div className="cursor-pointer pr-2 text-uppercase" style={{width:150}} title={props.transactionRef}>{props.transactionRef.substr(0, 15)}</div>
                  <img
                      src={Copy}
                      width="15"
                      height="15"
                      className="cursor-pointer"
                      onClick={(e) => {
                        handleCopy(props.transactionRef);
                      }}
                  />
                </div>
    },
    {
      name: t('Date'),
      cellStyle: { textAlign: 'right', padding:0 },
      style: { width: '100px',textAlign: 'right',paddingRight:'15px' },
      cell: props => <span>{moment(props.created_at).format("DD-MM-yyyy, hh:mm A")}</span>
    }
  ]);
  const [tabColumns] = React.useState([
    {
      name: t('Status'),
      style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div className="cut-text">
        {props.status ? t(props.status) : "NA"}
      </div>
    },
    {
      name: t('Amount'),
      style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div className="cut-text">
          {props.currency} {formatNumber(props.amount)}
      </div>
    },
    {
      name: t('Beneficiary'),
      style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div>
        {isEmpty(props.customer.customerName) ? 'NA' : props.customer.customerName?.substring(0,20)}
      </div>
    },

    {
      name: t('Transaction Reference'),
      style: { width: '150px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <span className="row p-0 m-0">
                  <div className="cut-text cursor-pointer pr-2 text-uppercase">{props.transactionRef.substr(0, 15)}</div>
                  <img
                      src={Copy}
                      width="15"
                      height="15"
                      className="cursor-pointer"
                      onClick={(e) => {
                        handleCopy(props.transactionRef);
                      }}
                  />
                </span>
    },
    {
      name: t('Date'),
      cellStyle: { textAlign: 'right', padding:0 },
      style: { width: '100px',textAlign: 'right',paddingRight:'15px' },
      cell: props => <span>{moment(props.created_at).format("DD-MM-yyyy, hh:mm A")}</span>
    }
  ]);
  const [mobileColumns] = React.useState([
    {
      name: t('Status'),
      style: { width: '80px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div className="cut-text">
        {props.status ? props.status : "NA"}
      </div>
    },
    {
      name: t('Amount'),
      style: { width: '180px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div className="cut-text">
        {props.currency} {formatNumber(props.amount)}
      </div>
    },

    {
      name: t('Date'),
      cellStyle: { textAlign: 'right', padding:0 },
      style: { width: '80px',textAlign: 'right',paddingRight:'15px' },
      cell: props => <span>{moment(props.created_at).format("DD-MM-yyyy, hh:mm A")}</span>
    }
  ]);

  return (
      <div className="page-container py-5">
        <div className="py-3">
        <div className="font-medium pb-3 px-0 font-20 text-black">
          {t("Refunds")}{" "}
          {/*<Counter>*/}
          {/*  TOTAL{" "}*/}
          {/*  {props.refunds && props.refunds.rowCount*/}
          {/*    ? props.refunds.rowCount*/}
          {/*    : 0}*/}
          {/*</Counter>*/}
        </div>
        <Gap>

          <div className="">
            <div className="d-flex flex-row justify-content-between">
              <div className="w-100 d-flex">
                <Filter
                  showFilter={show_filter}
                  useNewDatePicker
                  dates={dates}
                  filter={filter}
                  setDefaultDates={setDefaultDates}
                  setDates={setDates}
                  defaultDates={defaultDates}
                  // filter={(from_date, to_date) => {
                  //   filter(from_date, to_date);
                  // }}
                  setShowFilter={(bol) => setShowFilter(bol)}
                  toggleFilter={() => setShowFilter(!show_filter)}
                  refund_source_filter
                  refundSource={refundSource}
                  setRefundSource={setRefundSource}
                  refundSources={refundSources}
                />
                <DebounceInput
                    minLength={2}
                    debounceTimeout={2000}
                    className="input-wrap sbt-border-success br-normal w-200px"
                    placeholder={t("Transaction Reference")}
                    aria-label="Search"
                    onChange={(e) => {
                      filter(getFromDate(), getToDate(), 1, perPage, e.target.value);
                      setSearchParam(e.target.value);
                    }}
                />
              </div>
              <div>
                <div className="row p-0 m-0">
                  {/*{filterTransitions.map(({ item, key, props }) => (*/}
                  {/*  item && <animated.span className="font-12 px-3 cursor-pointer" key={key} style={props}>*/}
                  {/*    <div*/}
                  {/*      onClick={() => setShowFilter(!show_filter)}*/}
                  {/*      className="py-2 mt-1"*/}
                  {/*    >*/}
                  {/*      <span>*/}
                  {/*        Filters*/}
                  {/*            <img*/}
                  {/*          src={iconFilter}*/}
                  {/*          style={{ width: "12px" }}*/}
                  {/*          className="ml-1"*/}
                  {/*        />*/}
                  {/*      </span>*/}
                  {/*    </div>*/}
                  {/*  </animated.span>*/}
                  {/*))}*/}
                  <Can access={"EXPORT_MERCHANT_REPORT"}>
                    <span className="font-12 font-light export_data">
                      <Dropdown
                        optionLabel="text"
                        value={expt}
                        options={exports}
                        onChange={(e) => {
                          setExport(e.target.value);
                        }}
                        itemTemplate={downloadTemplate}
                        placeholder={t("Export Data")}
                        className="font-12 text-left w-200px sbt-border-success"
                      />
                    </span>
                  </Can>
                </div>
              </div>
            </div>
          </div>

        </Gap>
        {show_mail_report && (
          <ReportRefund
            request={true}
            type="REFUND"
            show={show_mail_report}
            process={processing}
            setProcessing={setProcessing}
            close={closeEmailReport}
            email={
              props.user_details.email ? props.user_details.email : ""
            }
          />
        )}
          {
          <AppTable
              columns={width >= 991 ? fullColumns : (width > 540 && width < 991) ? tabColumns : mobileColumns}
              headerStyle={{textTransform: 'uppercase'}}
              loading={loading}
              fixedLayout={false}
              paginate={props.refunds ? props.refunds.rowCount ? Math.ceil(props.refunds.rowCount / perPage) > 1 : false : false}
              perPage={perPage}
              totalPages={props.refunds ? props.refunds.rowCount ? Math.ceil(props.refunds.rowCount / perPage) : 0 : 0}
              changePage={(page) => {
                changePage(page.activePage);
              }}
              currentPage={
                props.refunds &&
                props.refunds.currentpage ?
                    parseInt(props.refunds.currentpage) + 1 : 1
              }
              data={
                props.refunds &&
                props.refunds.payload ?
                    props.refunds.payload : []
              }
          />
          }
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user_details: state.data.user_details,
  refunds: state.data.refunds,
  refunds_search_result: state.data.refunds_search_result,
  error_details: state.data.error_details,
  location: state.data.location,
  business_details: state.data.business_details,
  request_report: state.data.request_report,
});

export default connect(mapStateToProps, { getRefunds, searchRefunds, clearState })(
  RefundPage
);
