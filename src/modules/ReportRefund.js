import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Refunddata from "../utils/strings/refund.json";
import { Dropdown } from "primereact/dropdown";
import { Modal } from 'rsuite';
import { connect } from "react-redux";
import Sortable from "react-sortablejs";
import { Calendar } from "primereact/calendar";
import cogoToast from "cogo-toast";
import CalendarIcon from "../assets/images/svg/calendar.svg";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import { requestReport, clearState } from "../actions/postActions";
import transactions_json from "../utils/strings/transaction.json";
import "./css/filter.scss";
import moment from "moment";
import {Loader} from "semantic-ui-react";

class ReportRefund extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions_field_out: this.getData().transactions_field_out || [
                ...Refunddata.transactions_field_out,
            ],
            transactions_field_in: this.getData().transactions_field_in || [
                ...Refunddata.transactions_field_in,
            ],
            all_fields: [
                ...Refunddata.transactions_field_in,
                ...Refunddata.transactions_field_out,
            ],
            dates: null,
            status: "ALL",
            startDate: "",
            endDate: ""
        };
    }

    componentDidMount = () => {
        this.resetReport();
    }

    getData = () => {
        if (
            localStorage.getItem("sbt_refund_report") &&
            JSON.parse(localStorage.getItem("sbt_refund_report"))
        )
            return JSON.parse(localStorage.getItem("sbt_refund_report"));
        return [];
    };

    resetReport = (e) => {
        this.setState({
            transactions_field_out: [...Refunddata.transactions_field_out],
            transactions_field_in: [...Refunddata.transactions_field_in],
        });
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
        const { transactions_field_out, startDate, endDate, status } = this.state;
        const { email, type, setProcessing, requestReport } = this.props;
        setProcessing(true);

        if (transactions_field_out && transactions_field_out.length < 3) {
            cogoToast.error("Please select a minimum of 3 fields", { position: "top-right" });
            setProcessing(false);
            return
        }

        if (startDate === "" || endDate === "") {
            cogoToast.error("Please select a start date and an end date", { position: "top-right" });
            setProcessing(false);
            return
        }

        requestReport({
            data: {
                emailAddresses: [email],
                reportFields: transactions_field_out,
                startDate: startDate,
                endDate: endDate,
                type: type
            },
            location: "request_report",
            status: status
        })
    }


    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.close} centered size="md">
                <Modal.Header>
                </Modal.Header>
                            <Modal.Body className="w-100 row mx-0 px-0 pt-0 px-md-1 modal-lg show-fade">
                                <div className="col-sm-12">
                                    <div className="text-center font-14 pb-2 borderB">
                                        {this.props.request ? "Request Report Link" : "Export to CSV"}
                                    </div>
                                    <div className="font-12 text-center mt-2">
                                        Customize your csv to show additional info, in any order you
                                        want.
                                    <div className="font-12 text-center mb-3"> Add and Remove what you want included in the export</div>
                                    </div>
                                    {this.props.request && <div className="sbt-filter">
                                        <div className="row px-0 px-4">
                                            <div className="mr-5">
                                                <div className="font-weight-bold font-12">Select Date Range</div>
                                                <div className="calender-wrap cursor-pointer pr-2 sbt-border-success mb-4 pl-3 mt-2">
                                                    <img src={CalendarIcon} />
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
                                            <div>
                                                <div className="font-weight-bold font-12">Select Transaction Status</div>
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
                                    </div>}
                                    <div className="row px-0 px-md-4 ">
                                        <div className="col-6 font-9 px-0 pr-md-2 borderR">
                                            <div className="font-weight-bold mb-4 font-12">
                                                {" "}
                        Available Columns
                      </div>
                                            <Sortable
                                                // See all Sortable options at https://github.com/RubaXa/Sortable#options
                                                options={{
                                                    group: "shared",
                                                    animation: 150,
                                                    direction: "horizontal",
                                                    easing: "cubic-bezier(1, 0, 0, 1)",
                                                    sort: true,
                                                }}
                                                style={{
                                                    height: "500px",
                                                    overflowY: "auto",
                                                    overflowX: "hidden",
                                                }}
                                                className="w-100 font-9  list-unstyled"
                                                tag="ul"
                                                onChange={(order, sortable, evt) => {
                                                    this.onDragInEnd(order);
                                                }}
                                            >
                                                {this.state.transactions_field_in &&
                                                    this.state.transactions_field_in.map(
                                                        (item, index) => (
                                                            <li
                                                                key={index}
                                                                data-id={item.value}
                                                                className="row  pt-2 pb-2 show-fade"
                                                            >
                                                                <div className="col-1 line-height-26">
                                                                    <span>
                                                                        {/*<FontAwesomeIcon*/}
                                                                        {/*    icon={faBars}*/}
                                                                        {/*    className="font-weight-light text-muted font-14"*/}
                                                                        {/*/>*/}
                                                                    </span>
                                                                </div>
                                                                <div className="text-left col-8 font-14 pr-0">
                                                                    {item.value}
                                                                </div>
                                                                <div className="col-2 line-height-20">
                                                                    <i
                                                                        className="font-weight-light greenC ml-3 cursor-pointer d-inline-block fi fi-plus-a p-2"
                                                                        onClick={(e) => {
                                                                            this.onAdd(item);
                                                                        }}
                                                                        data-index={index}
                                                                        data-name={item.name}
                                                                    ></i>
                                                                </div>
                                                            </li>
                                                        )
                                                    )}
                                            </Sortable>
                                        </div>{" "}
                                        <div className="col-6 font-9 px-0 pl-md-2 ">
                                            <div className="font-weight-bold mb-4 font-12">
                                                {" "}
                        Columns in the Export
                      </div>
                                            <Sortable
                                                // See all Sortable options at https://github.com/RubaXa/Sortable#options
                                                options={{
                                                    group: "shared",
                                                    animation: 150,
                                                }}
                                                style={{
                                                    height: "500px",
                                                    overflowY: "auto",
                                                    overflowX: "hidden",
                                                }}
                                                className="w-100 font-9  list-unstyled"
                                                tag="ul"
                                                onChange={(order, sortable, evt) => {
                                                    this.onDragOutEnd(order);
                                                    // this.setState({ transactions_field_out: order });
                                                }}
                                            >
                                                {this.state.transactions_field_out &&
                                                    this.state.transactions_field_out.map(
                                                        (item, index) => (
                                                            <li
                                                                key={index}
                                                                data-id={item.value}
                                                                className="row  pt-2 pb-2 show-fade"
                                                            >
                                                                <div className="col-1 line-height-26">
                                                                    <span>
                                                                        {/*<FontAwesomeIcon*/}
                                                                        {/*    icon={faBars}*/}
                                                                        {/*    className="font-weight-light text-muted font-14"*/}
                                                                        {/*/>*/}
                                                                    </span>
                                                                </div>
                                                                <div className="text-left col-8 font-14 pr-0">
                                                                    {item.value}
                                                                </div>
                                                                <div className="col-2 line-height-20">
                                                                    <i
                                                                        className="font-weight-light redC ml-3 d-inline-block fi fi-minus-a cursor-pointer p-2"
                                                                        onClick={(e) => {
                                                                            this.onRemove(item.value);
                                                                        }}
                                                                        data-index={index}
                                                                        data-name={item.name}
                                                                    ></i>
                                                                </div>
                                                            </li>
                                                        )
                                                    )}
                                            </Sortable>
                                        </div>
                                        <div className="row w-100 pt-3 d-flex mt-3 justify-content-between cg-modal-footer font-14">
                                            <div className="col-sm-6">
                                                <span
                                                    className="blackC btn btn-default cursor-pointer"
                                                    onClick={(e) => this.resetReport(e)}
                                                >
                                                    Reset
                        </span>
                                            </div>
                                            <div className="col-sm-6 text-right">
                                                <button
                                                    className="btn btn-success font-14"
                                                    onClick={() => {
                                                        localStorage.setItem(
                                                            "sbt_email_report",
                                                            JSON.stringify({
                                                                transactions_field_out: this.state
                                                                    .transactions_field_out,
                                                                transactions_field_in: this.state
                                                                    .transactions_field_in,
                                                            })
                                                        );
                                                        this.props.request ? (
                                                            this.sendBulkData()
                                                        ) : (
                                                                this.props.sendReport(
                                                                    this.state.transactions_field_out
                                                                )
                                                            )
                                                    }}
                                                >
                                                    {this.props.process ? (
                                                        <Loader active inline='centered' />
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

const mapStateToProps = (state) => ({
    error_details: state.data.error_details,
    request_report: state.data.request_report,
});

export default connect(mapStateToProps, {
    requestReport,
    clearState
})(ReportRefund);

