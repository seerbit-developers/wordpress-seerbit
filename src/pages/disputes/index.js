/** @format */

import React, {useState, useEffect} from "react";
import { connect } from "react-redux";
import {
  getDisputes,
  searchDisputes,
  replyDispute,
  getDispute,
  clearState
} from "../../actions/postActions";
import { Can } from "../../modules/Can";
import Copy from "../../assets/images/svg/copy.svg";
import moment from "moment";
import { isEmpty } from "lodash";
// import Table from "../../utils/analytics/table";
import Filter from "../../utils/analytics/filter";
import Conversations from "../../modules/dispute_conversations";
import { CSVLink } from "react-csv";
import { DisputeStatus } from "modules/resolve_dispute";
import transactions_json from "../../utils/strings/transaction.json";
import { Dropdown } from "primereact/dropdown";
import ReportDispute from "../../modules/ReportDispute";
import "./css/dispute.scss";
import useWindowSize from "components/useWindowSize";
import AppTable from "components/app-table";
import Button from "components/button";
import TableDropdown from "../../components/table-actions-dropdown/table-dropdown";
import {appBusy} from "actions/appActions";
import {acceptBulkDispute, disputeFeedback} from "services/disputeService";
import {alertError, alertExceptionError, alertSuccess} from "modules/alert";
import {handleCopy} from "utils"
import { useTranslation } from "react-i18next";
import {AppModalCenter} from "components/app-modal";



export function DisputePage(props) {
  const [active_option, setActiveOption] = useState("default");
  const [transaction_status, setTransactionStatus] = useState("ALL");
  const [show_dispute, setShowDispute] = useState(false);
  const [dispute, setDispute] = useState();
  const [perPage, setPerPage] = useState(25);
  const [processing, setProcessing] = useState(false);
  const [dates, setDates] = useState([
    moment().subtract(1, 'months'),
    moment()
  ]);
  const [message, setMessage] = useState("");
  const [image_upload, setImageUpload] = useState();
  const [image, setImage] = useState(null);
  const [expt, setExport] = useState();
  const [loading, setLoading] = useState(false);
  const [showFilter, toggleFilter] = useState(false);
  const [show_mail_report, setShowMailReport] = useState(false);
  const [request, sendRequest] = useState(false);
  const [viewMode, setViewMode] = useState('FULL');
  const [categorizedDisputes, setCategorizedDisputes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkAll, setCheckAll] = useState(false);
  const [rowClass, setRowClass] = useState('');
  const [exportOptions, setExportOptions] = useState([]);
  const [fullColumns, setFullColumns] = useState([]);
  const [batchDispute, setBatchDispute] = useState([]);
  const [confirmBulkAcceptance, setConfirmBulkAcceptance] = useState(false);
  const size = useWindowSize()
  const {t} = useTranslation()
  const { width, height } = size;
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

  var reader = new FileReader();
  reader.onloadend = () => {
    setImage(reader.result);
  };
  if (image_upload) reader.readAsDataURL(image_upload);

  function formatNumber(num) {
    return Number(num)
      .toFixed(2)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const getFromDate = () => {
    if (typeof dates === 'object'){
      return dates && dates[0] ? moment(dates[0]).format("DD-MM-yyyy") : null;
    }else{
      return dates && dates[0] ? dates[0] : null;
    }

  }

  const getToDate = (d=null) => {
    if (typeof dates === 'object'){
      return dates && dates[1] ? moment(dates[1]).format("DD-MM-yyyy") : null;
    }else{
      return dates && dates[1] ? dates[1] : null;
    }
  }

  useEffect(() => {
    filter(getFromDate(), getToDate(), currentPage, perPage)
    const eo = transactions_json.dispute.map(item=>{
      return {text:t(item.text), value: item.value}
    });
    setExportOptions(eo)
    setFullColumns(columns)
  }, []);

  useEffect(() => {
    props.disputes && createCategorizedData(props.disputes.payload || []);
  }, [props.disputes]);

  const createCategorizedData = (data = [], batchDisputesLocal=null) => {
    if (!isEmpty(data)) {
      const tdata = data.map((dispute, id) => {
        return {
          ...dispute,
          id: id,
          selected: batchDisputesLocal ?  batchDisputesLocal.includes(id) : batchDispute.includes(id),
          message: dispute.evidence ? Array.isArray(dispute.evidence) ? dispute.evidence.length ? dispute.evidence[0].message : "" : "" : "",
        };
      });
      setCategorizedDisputes(tdata);
      return tdata
    }
  };

  useEffect(() => {
    setLoading(true);
    if (!isEmpty(props.disputes)) setLoading(false);
    if (!isEmpty(props.error_details)) setLoading(false);
  }, [props.disputes, props.error_details]);

  useEffect(() => {
    if (props.dispute && props.location === "dispute") {
      alertSuccess("Success! Dispute feedback has been Sent!");
      props.clearState({ dispute: null })
      filter(getFromDate(), getToDate(), currentPage, perPage)
      setProcessing(false);
    }
    if (props.error_details && props.error_details.error_source === "dispute") {
      alertError("Request can't be process, try again later");
      props.clearState({ error_details: null })
      setProcessing(false);
    }

    if (props.request_report && props.location === "request_report") {
      const requestData = props.request_report;
      closeEmailReport()
      setProcessing(false);
      alertSuccess(requestData.message);
      props.clearState({ request_report: null });
    }

    if (
      props.error_details &&
      props.error_details.error_source === "request_report"
    ) {
      setProcessing(false);
      alertError(props.error_details.message || props.error_details.responseMessage);
      props.clearState({ error_details: null });
    }

  }, [props.disputes, props.location, props.error_details, props.request_report]);

  useEffect(() => {
    if (showFilter && dates.length === 2) {
      filter();
    }

    if (transaction_status === "ALL" && dates.length === 0) {
      props.getDisputes();
    }
  }, [transaction_status])

  const changePage = (from, range = perPage) => {
    setPerPage(range);
    setLoading(true);
    setCurrentPage(from)
    setBatchDispute([])
    active_option === "filter"
      ? filter(undefined, undefined, from, range)
      : props.getDisputes({ start: from, size: range });
  };

  const filter = (
    from_date = dates[0],
    to_date = dates[1],
    page = 1,
    range = perPage
  ) => {
    const from = from_date
      ? typeof from_date === 'object' ? moment(from_date).format("DD-MM-yyyy") : from_date
      : moment().subtract(1, 'months').format("DD-MM-yyyy");
    const to = to_date
      ? typeof to_date === 'object' ? moment(to_date).format("DD-MM-yyyy") : to_date
      : moment().format("DD-MM-yyyy");

    setActiveOption("filter");
    setLoading(true);
    props.searchDisputes({
      data: {
        endDate: to,
        startDate: from,
        transRefSearch: "",
        type: transaction_status,
      },
      page,
      size: range,
      location: "disputes"
    });
  };

  const replyDispute = () => {
    if (image === null || !image) {
      alertError("Please attach an evidence to the reply.");
      return
    }
    if (message.trim().length === 0) {
      alertError("Enter your response message");
      setProcessing(false)
    } else {
      // setProcessing(true)
      props.appBusy(true, 'Responding to Dispute')
    disputeFeedback({
        url: {
          dispute_ref: dispute.dispute_ref,
          action: "",
        },
        data: {
          evidence: [
            {
              images: [
                {
                  image: image,
                },
              ],
              message: message,
              msg_sender: "merchant",
            },
          ],
          amount: dispute.transDetails.amount,
          resolution: "decline",
          status: "DECLINED",
          resolution_image: null,
          merchant_id: props.business_details.number,
          customer_email: dispute.customer_email,
        },
      })
        .then(res => {
          props.appBusy();
          if (res.responseCode === '00'){
            setShowDispute(false);
            setImageUpload()
            alertSuccess('Successful! Dispute Response received');
            filter(getFromDate(), getToDate(), getCurrentPage(), perPage)
          }else{
            alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
          }
        })
        .catch(e=>{
          props.appBusy()
          alertExceptionError(e)
        })
      // props.replyDispute({
      //   location: "dispute",
      //   url: {
      //     dispute_ref: dispute.dispute_ref,
      //     action: "",
      //   },
      //   data: {
      //     evidence: [
      //       {
      //         images: [
      //           {
      //             image: image,
      //           },
      //         ],
      //         message: message,
      //         msg_sender: "merchant",
      //       },
      //     ],
      //     amount: dispute.transDetails.amount,
      //     resolution: "decline",
      //     status: "DECLINED",
      //     resolution_image: null,
      //     merchant_id: props.business_details.number,
      //     customer_email: dispute.customer_email,
      //   },
      // });
      // setImageUpload()
      // changePage(1);
    }
  };

  const onBulkAccept = ()=> {
    setConfirmBulkAcceptance(true)
  }

  const acceptDispute = (dispute) => {
    props.appBusy(true, 'Accepting Dispute')
    disputeFeedback({
        url: {
          dispute_ref: dispute.dispute_ref,
          action: "accept",
        },
        data: {
          amount: dispute.transDetails.amount,
          resolution: "accept",
          status: "ACCEPTED",
          merchant_id: props.business_details.number,
          customer_email: dispute.customer_email,
        },
      })
        .then(res => {
          props.appBusy();
          if (res.responseCode === '00'){
            alertSuccess('Successful! Dispute Accepted');
            filter(getFromDate(), getToDate(), getCurrentPage(), perPage)
          }else{
            alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
          }
        })
        .catch(e=>{
          props.appBusy()
          alertExceptionError(e)
        })
  };

  const onBulkAcceptance = ()=>{
    props.appBusy(true, 'Accepting selected disputes')
    const ex = batchDispute.map(itemIndex=> {
      return props.disputes.payload.find( (item, i) => {
        return i == itemIndex
      })
    })

    const p = {
      chargeBacks : ex.map(item=> (
          {
            "amount": item.amount,
            "resolution": item.resolution,
            "status": item.status,
            "merchant_id": item.merchant_id,
            "customer_email": item.customer_email,
            "dispute_ref": item.dispute_ref
          }
      ))
    }

    acceptBulkDispute(p)
        .then(res => {
          props.appBusy();
          if (res.responseCode === '00'){
            alertSuccess('Successful! Disputes Accepted');
            filter(getFromDate(), getToDate(), getCurrentPage(), perPage)
            setConfirmBulkAcceptance(false)
            setBatchDispute([])
            setCheckAll(false)
          }else{
            alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
          }
        })
        .catch(e=>{
          props.appBusy()
          alertExceptionError(e)
        })
  }

  const headers = [
    { label: t("Status"), key: "status" },
    { label: t("Date Created"), key: "date_of_dispute" },
    // { label: "Category", value: "Charge back" },
    { label: t("Transaction"), key: "transaction_ref" },
    { label: t("Customer"), key: "customer_email" },
    { label: t("Due Date"), key: "due_when" },
    { label: t("Message"), key: "message" },
    { label: t(""), key: "type" },
  ];

  const downloadTemplate = (option) => {
    if (!option.value) {
      return option.text;
    } else {
      if (option.value === 1)
        return (
          <div className="my-1 font-12 font-weight-bold">
            <CSVLink
              data={(props.disputes && categorizedDisputes) || []}
              headers={headers}
              filename={`${new Date().getTime()}-disputes.csv`}
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
              sendRequest(true)
              setShowMailReport(true);
            }}
          >
            {option.text}
          </div>
        );
    }
  };

  const closeEmailReport = () => {
    setProcessing(false);
    setShowMailReport(false);
  };

  const sendEmailReport = (param) => {
    const data = {
      reportFields: param,
      emailAddresses: [props.user_details.email],
    };
    setProcessing(true);
    if (data.reportFields.length < 3) {
      alertError("Please select a minimum of 3 fields");
      setProcessing(false);
      return false;
    } else {
      let from = dates[0]
        ? moment(dates[0]).format("DD-MM-yyyy")
        : moment().subtract(1, "month").format("DD-MM-yyyy");
      let to = dates[1]
        ? moment(dates[1]).format("DD-MM-yyyy")
        : moment().subtract(1, "days").format("DD-MM-yyyy");

      if (moment() === moment(dates[1]))
        to = moment().subtract(1, "days").format("DD-MM-yyyy");

      const params = {
        start_date: from,
        stop_date: to,
        data,
        location: "email_report",
        type: transaction_status
      };
      props.emailReport(params);
    }
  };

  const onTableActionChange = (action, props) => {
    setDispute(props);
    if (action.value === 'accept') {
      acceptDispute(props)
    }else if (action.value === 'reply'){
      setShowDispute(true);
    }
    else if (action.value === 'view'){
      setShowDispute(true);
      setViewMode('')
    }
  }

  const getCurrentPage = ()=>{
    return  props.disputes &&
    props.disputes.currentpage ?
        parseInt(props.disputes.currentpage) + 1 : 1
  }

  const columns =  [
    {
      name: ()=> <input type='checkbox' onChange={(e)=>onSelectAll(e)}/>,
      hide: false,
      style: {textAlign:'left'},
      cellStyle: {textAlign:'left'},
      cell: row =>
          <input type='checkbox'
                 checked={row.selected}
                 onChange={()=> row.selected ? unTickRow(row.id) : tickRow(row.id) }
          />
    },
    {
      name: t("Status"),
      cell: props => DisputeStatus(props.status)
    },
    {
      name: t('Amount'),
      cell: props => <span>
                  <div className="cut-text">
                    {props.business_details &&
                    props.business_details.default_currency}{" "}
                    {formatNumber(props.transDetails.amount)}
                  </div>
                </span>
    },
    {
      name: t('Reference'),
      cell: props => <span className="row p-0 m-0">
                      <div className="cut-text">{props.transaction_ref}</div>
                      <img
                          src={Copy}
                          width="15"
                          height="15"
                          className="cursor-pointer"
                          onClick={(e) => {
                            handleCopy(props.transaction_ref);
                          }}
                          alt="Copy"/>
                    </span>
    },
    {
      name: t('Dispute Reference'),
      cell: props => <span className="row p-0 m-0">
                      <div className="cut-text">{props.dispute_ref}</div>
                      <img
                          src={Copy}
                          width="15"
                          height="15"
                          className="cursor-pointer"
                          onClick={(e) => {
                            handleCopy(props.dispute_ref);
                          }}
                          alt="Copy"/>
                    </span>
    },
    {
      name: t('Product ID'),
      cell: props => <span className="row p-0 m-0">
                      <div className="cut-text">{props.transDetails ? props.transDetails.product_id ? props.transDetails.product_id : "NA" : "NA"}</div>
                      <img
                          src={Copy}
                          width="15"
                          height="15"
                          className="cursor-pointer"
                          onClick={(e) => {
                            handleCopy(props.transDetails ? props.transDetails.product_id ? props.transDetails.product_id : "" : "");
                          }}
                          alt="Copy"/>
                    </span>
    },
    {
      name: t('Date'),
      cell: props => <span>{moment(props.date_of_dispute).format("DD-MM-yyyy")}</span>
    },
    { name: t(''),
      cell: props => props.status === "IN_DISPUTE" ?
          <TableDropdown data={[
        { label: t('Reply'), value: 'reply' },
        { label: t('Accept'), value: 'accept' },
      ]}
       onChange={(action) => onTableActionChange(action, props)}
          /> :
          <TableDropdown data={[
            { label: t('Details'), value: 'view' }
          ]}
           onChange={(action) => onTableActionChange(action, props)}
          />
    }
  ]
  const [mobileColumns] = React.useState([
    {
      name: t("Status"),
      cell: props => DisputeStatus(props.status)
    },
    {
      name: t('Amount'),
      cell: props => <span>
                  <div className="cut-text">
                    {props.business_details &&
                    props.business_details.default_currency}{" "}
                    {formatNumber(props.transDetails.amount)}
                  </div>
                </span>
    },
    {
      name: t('Date'),
      cell: props => <span>{moment(props.date_of_dispute).format("DD-MM-yyyy")}</span>
    },
    {
      name: t('Expiry Date'),
      cell: props => <span>{moment(props.due_when).format("DD-MM-yyyy")}</span>
    },
    { name: t(''),
      cell: props => props.status === "IN_DISPUTE" ?
          <TableDropdown data={[
            { label: t('Reply'), value: 'reply' },
            { label: t('Accept'), value: 'accept' },
          ]}
                         onChange={(action) => onTableActionChange(action, props)}
          /> :
          <TableDropdown data={[
            { label: t('Details'), value: 'view' }
          ]}
                         onChange={(action) => onTableActionChange(action, props)}
          />
    },
  ]);

  const onSelectAll = (e)=>{
    const ids = createCategorizedData(props.disputes.payload).map(item=>item.id)
    setBatchDispute(e.target.checked ? ids : [])
    setCheckAll(!checkAll)
    setFullColumns(columns)
  }

  const unTickRow = (id)=>{
    const f = batchDispute.filter(item=>item !== id)
    setBatchDispute(f)
  }

  const tickRow = (id)=>{
    const copy = JSON.parse(JSON.stringify(batchDispute))
    copy.push(id)
    setBatchDispute(copy)
  }
  useEffect( ()=>{
    if (batchDispute){
      createCategorizedData(props.disputes.payload)
      setFullColumns(columns)
    }
  }, [batchDispute])

  return (
      <div className="page-container py-5">
        <AppModalCenter
            isOpen={confirmBulkAcceptance}
            close={()=>setConfirmBulkAcceptance(false)}
            title={'Accept selected disputes'}
        >
          <div className='d-flex align-items-center mb-4'>
            <h4 className='d-inline-block mr-2 mb-0'>{t('Accept selected disputes')} </h4>
            <span></span>
          </div>
          <div className='mb-3 text-center'>
            <p>
              {t('All the disputes selected will be accepted')}
            </p>
            <p>A total of <strong>
                {batchDispute ? Array.isArray(batchDispute) ? batchDispute.length : 0 : 0}
              </strong> disputes has been selected</p>
          </div>
          <div className="d-flex justify-content-between align-content-center mt-3">
            <Button
                size='md'
                full
                buttonType='secondary'
                className="mr-3"
                onClick={() => setConfirmBulkAcceptance(false)}
            >{t('Cancel')}
            </Button>
            <Button
                full
                size='md'
                className="ml-3"
                onClick={() => onBulkAcceptance()}
            >
              {t('Accept')}
            </Button>
          </div>
        </AppModalCenter>
        <div className="py-3">
        <div className="font-medium pb-3 font-20 text-black">
          {t("Disputes")}{" "}
        </div>
        {show_mail_report && (
          <ReportDispute
            request={request}
            type="DISPUTE"
            show={show_mail_report}
            process={processing}
            setProcessing={setProcessing}
            close={closeEmailReport}
            sendReport={sendEmailReport}
            email={
              props.user_details.email ? props.user_details.email : ""
            }
          />
        )}

            <div className="d-flex flex-row justify-content-between ">
              <div className="d-flex flex-row justify-content-between">
                <Can access={"EXPORT_MERCHANT_REPORT"}>
                  <Dropdown
                    optionLabel="text"
                    value={transaction_status}
                    options={exportOptions}
                    onChange={(e) => {
                      setTransactionStatus(e.value);
                      toggleFilter(true);
                    }}
                    className="font-12 w-200px sbt-border-success mr-3"
                  />
                </Can>
                <Filter
                    payment_option_filter={false}
                  showFilter={showFilter}
                  setDates={(val) => setDates(val)}
                  dates={dates}
                  filter={(from_date, to_date) => {
                    filter(from_date, to_date);
                  }}
                  changePage={() => changePage(1, perPage)}
                  setTransactionStatus={(status) =>
                    setTransactionStatus(status)
                  }
                  toggleFilter={() => toggleFilter(!showFilter)}
                  useNewDatePicker
                  defaultDates={dates}
                  setDefaultDates={setDates}
                />
              </div>

              {width >= 991 &&
              <div>
                <div className="p-0 m-0">
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
              }

            </div>
          <div className="mt-5">
            {
                (batchDispute && Array.isArray(batchDispute) && batchDispute.length) ?
                <Button buttonType={"success"} type={"button"} size="xs" onClick={()=>onBulkAccept()}>
                  {t('Accept')}</Button> : null
            }
          </div>

          <AppTable
              columns={width >= 991 ? columns : mobileColumns}
              fixedLayout={false}
              headerStyle={{textTransform: 'uppercase'}}
              loading={loading}
              rowClass={rowClass}
              paginate={props.disputes ? props.disputes.rowCount ? Math.ceil(props.disputes.rowCount / perPage) > 1 : false : false}
              perPage={perPage}
              totalPages={props.disputes ? props.disputes.rowCount ? Math.ceil(props.disputes.rowCount / perPage) : 0 : 0}
              changePage={(page) => {
                changePage(page.activePage);
              }}
              currentPage={
                props.disputes &&
                props.disputes.currentpage ?
                    parseInt(props.disputes.currentpage) + 1 : 1
              }
              data={(categorizedDisputes && categorizedDisputes) || []}
          />
      </div>
          <Conversations
              isOpen={show_dispute}
              viewMode={viewMode}
            close={() => {setShowDispute(false); setViewMode('FULL')}}
            dispute={dispute}
            setMessage={setMessage}
            message={message}
            image_upload={image_upload}
            setImageUpload={setImageUpload}
            replyDispute={() => replyDispute()}
          />

    </div>
  );
}

const mapStateToProps = (state) => ({
  disputes: state.data.disputes,
  error_details: state.data.error_details,
  location: state.data.location,
  business_details: state.data.business_details,
  single_dispute: state.data.single_dispute,
  email_report: state.data.email_report,
  request_report: state.data.request_report,
  dispute: state.data.dispute,
  user_details: state.data.user_details,
});

export default connect(mapStateToProps, {
  getDisputes,
  searchDisputes,
  replyDispute,
  getDispute,
  clearState,
  appBusy
})(DisputePage);
