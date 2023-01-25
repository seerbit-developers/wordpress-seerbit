import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Modal } from 'rsuite';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Calendar } from "primereact/calendar";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import { requestReport, clearState } from "../actions/postActions";
import "./css/filter.scss";
import moment from "moment";
import {disputeExport} from "services/disputeService";
import {alertError, alertExceptionError, alertSuccess} from "modules/alert";
class ReportDispute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: null,
      status: "ALL",
      startDate: "",
      endDate: "",
      process: false,
    };
  }

  selectedAction = (val) => {
    if (val[1] && val[1] !== null) this.filter(val[0], val[1]);
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

  sendBulkData = () => {
    const { dates, startDate, endDate, status } = this.state;
    const { email, type, setProcessing, requestReport } = this.props;
    setProcessing(true);

    if (startDate === "" || endDate === "") {
      alertError("Please select a start date and an end date");
      setProcessing(false);
      return
    }
    this.setState({process:true})
    disputeExport({
      emailAddresses: [email],
      reportFields: [],
      startDate: startDate,
      endDate: endDate,
      type: type,
      businessId: this.props && this.props.business_details && this.props.business_details.number,
      mode: "LIVE"
    })
      .then(res => {
        this.setState({process:false})
        if (res.responseCode === '00'){
          alertSuccess('Successful! Dispute reports sent');
        }else{
          alertError(res.message ? res.message : 'An Error Occurred sending the request. Kindly try again')
        }
      })
      .catch(e=>{
        this.setState({process:false})
        alertExceptionError(e)
      })

    // requestReport({
    //   data: {
    //     emailAddresses: [email],
    //     reportFields: [],
    //     startDate: startDate,
    //     endDate: endDate,
    //     type: type,
    //     businessId: this.props && this.props.business_details && this.props.business_details.number,
    //     mode: "LIVE"
    //   },
    //   location: "request_report",
    //   status: status
    // })
  }


  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.close} centered size="md">
        <Modal.Header>
        </Modal.Header>

              <Modal.Body className="w-100 row mx-0 px-0 pt-0 px-md-1 modal-lg show-fade">
                <div className="exportcsv-box blackC col-sm-12" style={{height:500}}>
                  <div className="text-center font-14 pb-1 borderB">
                    {this.props.request ? "Request Report Link" : "Export to CSV"}
                  </div>
                  <div className="font-12 text-center my-2 mb-4">
                    Select the range of disputes that you want to receive.
                  </div>

                  <div>
                    <div>
                      {this.props.request && <div className="sbt-filter">
                        <div className="d-flex justify-content-around">
                          <div>
                            <div className="font-weight-bold font-12 text-center">Select Date Range</div>
                            <div className="text-center calender-wrap cursor-pointer sbt-border-success mb-4 mt-2" style={{ width: "100px" }}>
                              <Calendar
                                placeholder="Select Date Range"
                                selectionMode="range"
                                value={this.state.dates}
                                onChange={(e) => {
                                  this.setState({ dates: e.value });
                                  this.selectedAction(e.value);
                                }}
                                className="font-12 cursor-pointer"
                                maxDate={new Date()}
                                showIcon={true}
                                hideOnDateTimeSelect={true}
                                required={true}
                              ></Calendar>
                            </div>
                          </div>

                          {/* <div>
                            <div className="font-weight-bold font-12">Select Transaction Status</div>
                            <Dropdown
                              optionLabel="text"
                              value={this.state.status}
                              options={transactions_json.dispute}
                              onChange={(e) => {
                                this.setState({ status: e.value });
                              }}
                              className="font-12 w-150px cursor-pointer mr-3 sbt-border-success p-3 mt-2"
                            />
                          </div> */}
                        </div>

                        <div>
                        </div>
                      </div>}
                      <div className="text-center">
                        <button
                          className="btn btn-success font-14"
                          disabled={!this.props.email}
                          onClick={() => this.props.email && this.sendBulkData()} >
                          {this.state.process ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                          ) : (
                            this.props.request ? (
                              `Send Report Link to ${this.props.email
                                ? this.props.email
                                : " No Email available"
                              }`
                            ) : (
                              `Send CSV to ${this.props.email
                                ? this.props.email
                                : " No Email available"
                              }`
                            ))}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
      </Modal>
    );
  }
}

ReportDispute.propTypes = {
  email: PropTypes.string.isRequired,
  sendReport: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  error_details: state.data.error_details,
  request_report: state.data.request_report,
  business_details: state.data.business_details,
});

export default connect(mapStateToProps, {
  requestReport,
  clearState
})(ReportDispute);

