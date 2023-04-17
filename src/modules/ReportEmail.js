import React from "react";
import EmailData from "../utils/strings/email.json";
import { Dropdown } from "primereact/dropdown";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import { requestReport, clearState } from "actions/postActions";
import transactions_json from "../utils/strings/transaction.json";
import "./css/filter.scss";
import moment from "moment";
import {emailTransactionReportLink, emailTransactionReportCsv, sendCustomReport} from "services/transactionService";
import {alertError, alertExceptionError, alertInfo, alertSuccess} from "./alert";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import AppModal from "components/app-modal";
import {Spinner} from "react-bootstrap";
class ReportEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions_field_out: this.getData().transactions_field_out || [
        ...EmailData.transactions_field_out,
      ],
      transactions_field_in: this.getData().transactions_field_in || [
        ...EmailData.transactions_field_in,
      ],
      all_fields: [
        ...EmailData.transactions_field_in,
        ...EmailData.transactions_field_out,
      ],
      dates: null,
      status: "ALL",
      startDate: "",
      endDate: "",
      process:false,
      defaultDates:[
        moment().subtract('1', 'months').toDate(),
        moment().toDate()
      ],
      additionalEmails:[],
      showAdditionalEmails:false,
    };
  }

  listenForKeyMatches = ()=>{
    const self = this;
    document.addEventListener('keydown', function(event) {
      if (event.ctrlKey && event.key === 'i') {
        self.setState({showAdditionalEmails:!self.state.showAdditionalEmails}, (state)=>{
          if (self.state.showAdditionalEmails){
            alertInfo('You can now add additional emails to receive the report')
          }
        })


      }
    })
  }
  onDateChange = (d)=>{
    this.setState({defaultDates:[ moment(d[0]), moment(d[1]) ]})
  }

  componentDidMount = () => {
    this.resetReport();
    this.listenForKeyMatches()
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', ()=> {});
  }

  getData = () => {
    if (
        localStorage.getItem("sbt_email_report") &&
        JSON.parse(localStorage.getItem("sbt_email_report"))
    )
      return JSON.parse(localStorage.getItem("sbt_email_report"));
    return [];
  };
  resetReport = (e) => {
    // if (this.props.custom_field_names){
    //   const tr = this.props.custom_field_names.map(item=>(
    //       {name: item, value: item}
    //   ))
    //   this.setState({
    //     transactions_field_out: [...tr],
    //     transactions_field_in: [],
    //     all_fields: tr
    //   });
    // }else{
      this.setState({
        transactions_field_out: [...EmailData.transactions_field_out],
        transactions_field_in: [...EmailData.transactions_field_in],
      });
    // }
  };
  onDragInEnd = (result) => {
    const data = this.state.all_fields.filter(
        (val) => result.indexOf(val.value) > -1
    );
    this.setState({
      transactions_field_in: data,
    });
  };
  onDragOutEnd = (result) => {
    const data = this.state.all_fields.filter(
        (val) => result.indexOf(val.value) > -1
    );
    this.setState({
      transactions_field_out: data,
    });
  };
  onRemove = (item) => {
    const data = { name: item.replace(/ /g, ""), value: item };
    let out = this.state.transactions_field_out;
    const index = out.findIndex((val) => val.value === item);
    out.splice(index, 1);
    this.setState((prev) => ({
      ...prev,
      transactions_field_in: Array(...prev.transactions_field_in, data),
      transactions_field_out: out,
    }));
  };
  onAdd = (item) => {
    const data = item;
    let out = this.state.transactions_field_in;
    const index = out.findIndex((val) => val.value === item.value);
    out.splice(index, 1);
    this.setState((prev) => ({
      ...prev,
      transactions_field_out: Array(...prev.transactions_field_out, data),
      transactions_field_in: out,
    }));
  };
  filter = (from_date, to_date) => {
    const from = from_date
        ? moment(from_date).format("DD-MM-yyyy")
        : "01-01-2019";
    const to = to_date
        ? moment(to_date).format("DD-MM-yyyy")
        : moment().format("DD-MM-yyyy");
    this.setState({ startDate: from, endDate: to });
  }
  selectedAction = (val) => {
    if (val[1] && val[1] !== null) this.filter(val[0], val[1]);
  };
  sendBulkData = () => {
    const {transactions_field_out} = this.state;
    const startDate = this.state.defaultDates[0]
    const endDate = this.state.defaultDates[1]
    if (transactions_field_out && transactions_field_out.length < 1) {
      alertError("Please select a minimum of 1 field");
      return
    }
    if (startDate === "" || endDate === "") {
      alertError("Please select a start date and an end date");
      return
    }

    let from = startDate
        ? moment(startDate).format("DD-MM-yyyy")
        : moment().subtract(1, "month").format("DD-MM-yyyy");
    let to = endDate
        ? moment(endDate).format("DD-MM-yyyy")
        : moment().subtract(1, "days").format("DD-MM-yyyy");

    if (moment() === moment(endDate))
      to = moment().subtract(1, "days").format("DD-MM-yyyy");

    if(moment(from).diff(to, 'days') > 31){
      alertError("Please select a maximum of 31 days");
      return false;
    }
    const extraEmails = this.state.additionalEmails.filter(Boolean).join(", ");
    const p = {
      startDate: from,
      endDate: to,
      type:'TRANSACTION',
      reportFields: this.props.custom_field_names ?
          transactions_field_out.map(item=>item.value) :
          transactions_field_out,
      emailAddresses: [this.props.email, extraEmails].filter(item=>item.length > 0)
    };

    this.setState({process: true})
    let req;

    if (this.props.custom_field_names){
      req = sendCustomReport(p);
    }
    else if(this.props.request){
      req = emailTransactionReportLink(p,this.state.status)
    }else{
      req = emailTransactionReportCsv(p,this.state.status)
    }
    req
        .then((res) => {
          this.setState({process: false})
          if (res.responseCode === "00") {
            alertSuccess('Success');
          } else {
            alertError(res.message
                ? res.message
                : "An Error Occurred sending the request. Kindly try again");
          }
        })
        .catch((e) => {
          this.setState({process: false})
          alertExceptionError(e)
        });
  }
  updateAdditionalEmails = (e)=>{
    this.setState({additionalEmails: [e.target.value]})
  }

  render() {
    return (
        <AppModal isOpen={this.props.show} close={this.props.close} title={this.props.request ? "Request Report Link" : "Export to CSV"} >

          <div className="pb-5">

            {
                this.state.showAdditionalEmails &&
                <div className="mb-3">
                  <input type="text" className="form-control font-12"
                         placeholder="Additional Emails (separate each one by comma)"
                         onChange={this.updateAdditionalEmails}/>
                </div>
            }
            <div className="font-12 text-left font-12 col-12 pb-4 p-0">
              {this.props.request ? `An email with a link with which you can download a CSV report file will be sent to the following mail box:
                     ${this.props.email}`
                  :
                  `An email with a CSV document will be attached and sent to the following mail boxes:
                      ${this.props.email}` }
              {
                  this.state.showAdditionalEmails && this.state.additionalEmails.map( (email,i)=> {
                    return <span className="font-bold" key={i}>, {email}</span>
                  })
              }
            </div>
             <div className="sbt-filter">
              <div className="d-flex justify-content-between px-0">
                <div className="mr-5 flex-grow-1">
                  <div className="font-weight-bold font-12">
                    {" "}
                    Date Range
                  </div>
                  <div className="calender-wrap cursor-pointer pr-2 sbt-border-success mb-4 pl-3 mt-2">
                    <DateRangePicker
                        onChange={(r)=>{ this.onDateChange(r) } }
                        value={this.state.defaultDates}
                        format="d/MM/y"
                        maxDate={moment().toDate()}
                        calendarIcon={null}
                        clearIcon={null}
                    />
                  </div>
                </div>
                <div className="flex-grow-0">
                  <div className="font-weight-bold font-12">
                    {" "}
                    Status
                  </div>
                  <Dropdown
                      optionLabel="text"
                      value={this.state.status}
                      options={transactions_json.filter}
                      onChange={(e) => {
                        this.setState({ status: e.value });
                      }}
                      className="font-12 w-150px cursor-pointer mr-3 sbt-border-success p-3 mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="row w-100 pb-5 d-flex justify-content-between cg-modal-footer font-12">
              <div className="col-sm-6">
                        {/* <span
                            className="blackC btn btn-default cursor-pointer font-10"
                            onClick={(e) => this.resetReport(e)}
                            disabled
                        >
                          Reset columns
                        </span> */}
              </div>
              <div className="col-sm-6 text-right p-0">
                <button
                    className="btn btn-success font-12"
                    onClick={() => {
                      !this.props.custom_field_names && localStorage.setItem(
                          "sbt_email_report",
                          JSON.stringify({
                            transactions_field_out: this.state
                                .transactions_field_out,
                            transactions_field_in: this.state
                                .transactions_field_in,
                          })
                      );
                      this.sendBulkData()
                    }}
                >
                  {this.state.process ? (
                      <Spinner animation="border" size="sm" variant="light" />
                  ) : (
                      this.props.request ? (
                          `Send Report Link`
                      ) : (
                          `Send CSV Report File`
                      ))}
                </button>
              </div>
            </div>
          </div>

        </AppModal>
    );
  }
}


ReportEmail.propTypes = {
  email: PropTypes.string.isRequired,
  process: PropTypes.bool.isRequired,
  sendReport: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  error_details: state.data.error_details,
  request_report: state.data.request_report,
  custom_field_names: state.transactions.custom_field_names
});

export default connect(mapStateToProps, {
  requestReport,
  clearState
})(ReportEmail);

