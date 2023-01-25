import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
    setErrorLog,
    getPocketCustomers,
    getPocketCustomerTransactions,
    searchPocketCustomer,
    clearState,
} from "../../actions/postActions";
import { isEmpty } from "lodash";
import moment from "moment";
import { Dropdown } from "primereact/dropdown";
import AppTable from "components/app-table";
import { CSVLink } from "react-csv";
import useOnClickOutside from "../../utils/onClickOutside";
import { DebounceInput } from "react-debounce-input";
import showAll from "../../assets/images/list.png";
import Copy from "../../assets/images/svg/copy.svg";
import Search from "../../assets/images/svg/search.svg";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import AddPocketCustomerModal from "./components/customerModal";
import Overview from "../../utils/analytics/pocket_customers_overview";
import "./css/customer_pockets.scss";
import useWindowSize from "components/useWindowSize";
import {alertError} from "../../modules/alert";
import {fetchPocketCustomers} from "../../actions/pocketActions";
import {handleCopy}  from "../../utils";
import {useHistory, useLocation} from "react-router";

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


function formatNumber(num) {
    return Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function CustomerPocketsPage(props) {
    const [perPage, setPerPage] = useState(25);
    const [processing, setProcessing] = useState(false);
    const [categorizedCustomers, setCategorizedCustomers] = useState([]);
    const [expt, setExport] = useState();
    const [show_overview, setOverview] = useState(false);
    const [type, setType] = useState(null);
    const [pocketReferenceId, setPocketReferenceId] = useState();
    const [activeTab, setActiveTab] = useState(0);
    const [addCustomer, setAddCustomer] = useState(false);
    const [showFilter, toggleFilter] = useState(false);
    const [radioValue, setRadioValue] = useState("");
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [transLoading, setTransLoading] = useState(false);
    const history = useHistory();

    const { customers, search_pocket_customer } = props;
    const exports = [
        {
            text: "Export to Excel",
            value: 1,
            label: 1,
        },
    ];

    const size = useWindowSize();
    const { width, height } = size;

    const ref = useRef();
    useOnClickOutside(ref, () => toggleFilter(false));

    useEffect(() => {
        props.fetchPocketCustomers(0, perPage);
        props.clearState({ search_pocket_customer: null });
    }, []);

    useEffect(() => {
        setLoading(true);
        if (!isEmpty(customers)) setLoading(false);
        if (!isEmpty(props.error_details)) setLoading(false);
    }, [customers, props.error_details]);

    useEffect(() => {
        setTransLoading(true);
        if (!isEmpty(props.customer_pocket_credit)) setTransLoading(false);
        if (!isEmpty(props.error_details)) setTransLoading(false);
    }, [props.customer_pocket_credit, props.error_details]);

    useEffect(() => {
        const { customers, search_pocket_customer } = props;
        if (isEmpty(search_pocket_customer)) {
            customers && createCategorizedData(customers.payload || []);
        } else {
            createCategorizedData(search_pocket_customer.payload);
        }
    }, [props.customers, props.search_pocket_customer]);

    useEffect(() => {
        if (!isEmpty(props.customer_pocket_credit)) setOverview(true);
    }, [props.customer_pocket_credit]);

    useEffect(() => {
        if (type) {
            getCustomerTransactions(pocketReferenceId, type);
        }
    }, [type]);

    useEffect(() => {
        if (!isEmpty(value) && !isEmpty(radioValue)) {
            if (value.length >= 1) {
                const data = { [radioValue]: value };
                props.fetchPocketCustomers(0,  perPage, data);
                // props.searchPocketCustomer({
                //   size: perPage,
                //   start: 1,
                //   data,
                //   location: "search_pocket_customer",
                // });
            }else{
                props.fetchPocketCustomers(0,  perPage, null);
            }
        }
    }, [value, radioValue]);

    useEffect(() => {
        if (props.error_details && props.location === "pocket_customers") {
            alertError(props.error_details.message);
        }

        if (props.error_details && props.location === "customer_pocket_credit") {
            alertError(props.error_details.message || props.error_details.responseMessage);
        }

        if (props.error_details && props.location === "search_pocket_customer") {
            alertError("There are no results for your search request.");
        }
    }, [props.error_details]);

    const getCustomerTransactions = (pocketReferenceId, type = type) => {
        history.push(`/pocket/sub/pockets/${pocketReferenceId}`)
        // const { getPocketCustomerTransactions } = props;
        // try {
        //     getPocketCustomerTransactions({
        //         size: perPage,
        //         start: 1,
        //         type: type,
        //         pocketReferenceId,
        //     });
        // } catch (e) {
        //     console.error(e);
        // }
    };

    const createCategorizedData = (data = []) => {
        if (!isEmpty(data)) {
            let categorizedCustomers = [];
            categorizedCustomers = data.map((customer, id) => {
                return {
                    ...customer,
                    id: id,
                    currency: props.business_details.default_currency,
                    fullName: `${customer.firstName} ${customer.lastName}`,
                };
            });
            setCategorizedCustomers(categorizedCustomers);
        }
    };

    const changePage = (from = 1) => {
        // if (!isEmpty(value) && !isEmpty(radioValue)) {
        //   if (value.length >= 1) {
        //     const data = { [radioValue]: value };
        //     props.fetchPocketCustomers(from-1,  perPage, data);
        //   }
        //   // else {
        //   //   props.clearState({ search_pocket_customer: null });
        //   // }
        // } else {
        props.fetchPocketCustomers(from-1,  perPage, null);
        // }
        // setProcessing(true);
    };

    const createPocketCustomer = () => {
        setAddCustomer(true);
    };

    useEffect(() => {
        if (props.pocketReferenceId === undefined) {
            setOverview(false);
        }
    }, [props.pocketReferenceId]);

    const headers = [
        { label: "Full Name", key: "fullName" },
        { label: "Email", key: "emailAddress" },
        { label: "Pocket Account Number", key: "pocketAccountNumber" },
        { label: "Phone Number", key: "phoneNumber" },
        { label: "Currency", key: "currency" },
        { label: "Pocket Balance", key: "balance" },
        { label: "Date Added", key: "createdAt" },
    ];


    const downloadTemplate = (option) => {
        if (option.value === 1)
            return (
                <div className="my-1 font-12 font-weight-bold">
                    <CSVLink
                        data={categorizedCustomers || []}
                        headers={headers}
                        filename={`${new Date().getTime()}-pocket_customers.csv`}
                    >
                        <span style={{ color: "#333333" }}>{option.text}</span>
                    </CSVLink>
                </div>
            );
    };

    const createBankName = (data = "") => {
        if (isEmpty(data)) return;

        if (data && data.startsWith("8")) {
            return "Sterling Bank";
        } else {
            return "Providus Bank";
        }
    };

    const [fullColumns, setCol] = useState([]);

    useEffect(() => {
        setCol(
            [
                {
                    name: "Full Name",
                    cell: (props) => (
                        <span
                            className="seerbit-color cursor-pointer"
                            onClick={() => {
                                setType("ALL");
                                setOverview(true);
                                setPocketReferenceId(props.pocketReferenceId);
                                getCustomerTransactions(props.pocketReferenceId, "ALL");
                            }}
                        >{`${props.firstName} ${props.lastName}`}</span>
                    ),
                },
                width > 530 && {
                    name: "Email/Mobile",
                    cell: (row) => (
                        <div className="d-flex flex-column">
                            <span className="">{row.emailAddress.substr(0, 16)}</span>
                            <span>{row.phoneNumber}</span>
                        </div>
                    ),
                },
                width > 667 && {
                    name: "Reference",
                    cell: (props) => (
                        <span className="row p-0 m-0">
              <div className="cut-text-1">{props.pocketReferenceId}</div>
              <img
                  src={Copy}
                  width="15"
                  height="15"
                  className="cursor-pointer"
                  onClick={(e) => {
                      handleCopy(props.pocketReferenceId);
                  }}
              />
            </span>
                    ),
                },
                {
                    name: "Pocket Account Number",
                    cell: (props) => (
                        <span className="row p-0 m-0">
              <div className="cut-text-1 ">{props.pocketAccountNumber ? props.pocketAccountNumber : "NA"}</div>
              <img
                  src={Copy}
                  width="15"
                  height="15"
                  className="cursor-pointer"
                  onClick={() => {
                      handleCopy(props.pocketAccountNumber);
                  }}
              />
            </span>
                    ),
                },
                {
                    name: "Bank Name",
                    cell: (props) => (
                        <span className="row p-0 m-0">
              {createBankName(props?.pocketAccountNumber? props?.pocketAccountNumber : "NA")}
            </span>
                    ),
                },

                width > 915 && {
                    name: "Pocket Balance",
                    cell: (props) => (
                        <div className="cut-text">
                            {props.currency} {formatNumber(props.balance)}
                        </div>
                    ),
                },
                width > 1111 && {
                    name: "Date Added",
                    style: { width: "180px", paddingRight: "15px", textAlign: "left" },
                    cell: (data) => (
                        <span>{moment(data.createdAt).format("Y-MM-DD hh:mm:ss A")}</span>
                    ),
                },
            ].filter(Boolean)
        );
    }, [width]);

    // const [fullColumns] = React.useState([]);

    return (
        <>
            {!show_overview && (
                <Wrapper className="">
                    <AddPocketCustomerModal
                        isOpen={addCustomer}
                        close={() => setAddCustomer(false)}
                        getAddedCustomer={() =>
                            props.getPocketCustomers({ size: perPage, start: 1 })
                        }
                        error_details={props.error_details}
                    />
                    <div className="sbt-transaction">
                        <NavMenuItem className="py-5">
                            <div className="font-medium pb-3 font-20 text-black">
                                Sub Pockets
                                {/*<Counter>*/}
                                {/*  TOTAL{" "}*/}
                                {/*  {!isEmpty(search_pocket_customer)*/}
                                {/*    ? (search_pocket_customer &&*/}
                                {/*        search_pocket_customer.rowCount) ||*/}
                                {/*      0*/}
                                {/*    : (customers && customers.rowCount) || 0}*/}
                                {/*</Counter>*/}
                            </div>

                            <div className="d-flex justify-content-between py-5">
                                {width > 500 && (
                                    <div>
                                        <div
                                            className="row hgx"
                                            // style={{ marginLeft: "9px !important" }}
                                        >
                                            <div className="font-12 font-light">
                                                <div
                                                    className="input-wrap sbt-border-success br-normal px-2"
                                                    style={{ padding: "2px", height: "100%" }}
                                                >
                                                    <DebounceInput
                                                        minLength={2}
                                                        debounceTimeout={1000}
                                                        className="font-12 py-2 w-200px sbt-border-success"
                                                        placeholder="Search"
                                                        aria-label="Search"
                                                        onChange={(e) => {
                                                            setValue(e.target.value);
                                                        }}
                                                        onClick={() => toggleFilter(true)}
                                                    />
                                                    <span>
                                <img src={Search} />
                              </span>
                                                </div>
                                                {showFilter && (
                                                    <div
                                                        className="p-1 sbt-search py-3 mx-1"
                                                        ref={ref}
                                                    >
                                                        <label className="font-bold px-2">
                                                            Search With:
                                                        </label>
                                                        <div>
                                                            <label className="container font-medium">
                                                                <input
                                                                    type="radio"
                                                                    id="referenceId"
                                                                    value="pocketReferenceId"
                                                                    checked={
                                                                        radioValue === "pocketReferenceId"
                                                                    }
                                                                    onChange={(e) =>
                                                                        setRadioValue(e.target.value)
                                                                    }
                                                                />
                                                                <span class="checkmark mr-2"></span>
                                                                Reference Id
                                                            </label>
                                                            <label class="container font-medium">
                                                                <input
                                                                    type="radio"
                                                                    id="firstName"
                                                                    name="firstName"
                                                                    value="firstName"
                                                                    checked={radioValue === "firstName"}
                                                                    onChange={(e) =>
                                                                        setRadioValue(e.target.value)
                                                                    }
                                                                />
                                                                <span class="checkmark mr-2"></span>
                                                                First Name
                                                            </label>
                                                            <label class="container font-medium">
                                                                <input
                                                                    type="radio"
                                                                    id="lastName"
                                                                    name="lastName"
                                                                    value="lastName"
                                                                    checked={radioValue === "lastName"}
                                                                    onChange={(e) =>
                                                                        setRadioValue(e.target.value)
                                                                    }
                                                                />
                                                                <span class="checkmark mr-2"></span>
                                                                Last Name
                                                            </label>
                                                            <label class="container font-medium">
                                                                <input
                                                                    type="radio"
                                                                    id="emailAddress"
                                                                    name="emailAddress"
                                                                    value="emailAddress"
                                                                    checked={radioValue === "emailAddress"}
                                                                    onChange={(e) =>
                                                                        setRadioValue(e.target.value)
                                                                    }
                                                                />
                                                                <span class="checkmark mr-2"></span>
                                                                Email Address
                                                            </label>
                                                            <label class="container font-medium">
                                                                <input
                                                                    type="radio"
                                                                    id="customerExternalRef"
                                                                    name="customerExternalRef"
                                                                    value="customerExternalRef"
                                                                    checked={
                                                                        radioValue === "customerExternalRef"
                                                                    }
                                                                    onChange={(e) =>
                                                                        setRadioValue(e.target.value)
                                                                    }
                                                                />
                                                                <span class="checkmark mr-2"></span>
                                                                Customer External Ref
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
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
                                className="font-12 text-left w-200px sbt-border-success py-1"
                                showClear={true}
                            />
                          </span>
                                            {!isEmpty(search_pocket_customer) && (
                                                <span className="font-12 px-3 cursor-pointer">
                              <div
                                  onMouseUp={() =>
                                      props.clearState({
                                          search_pocket_customer: null,
                                      })
                                  }
                                  className="py-3"
                              >
                                <span>
                                  Show All
                                  <img
                                      src={showAll}
                                      style={{ width: "14px" }}
                                      className="ml-1"
                                  />
                                </span>
                              </div>
                            </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <RightComponent>
                                        <Button
                                            variant="xdh"
                                            height={"40px"}
                                            className="brand-btn"
                                            style={{ width: "140px" }}
                                            onClick={createPocketCustomer}
                                        >
                                            Add Customer
                                        </Button>
                                    </RightComponent>
                                </div>
                            </div>

                            {!isEmpty(search_pocket_customer) && !isEmpty(value) && (
                                <div className="ml-1 font-14 mb-4">
                                    <span className="font-bold">Search Results:</span>{" "}
                                    <span className="">{value}</span>
                                </div>
                            )}
                            <AppTable
                                loading={props.loading_pocket_customers}
                                columns={fullColumns}
                                perPage={perPage}
                                paginate={true}
                                changePage={(page) => {
                                    changePage(page.activePage);
                                }}
                                data={(categorizedCustomers && categorizedCustomers) || []}
                                totalPages={
                                    ( customers && Math.ceil(customers.rowCount / perPage) ) || 0
                                }
                                currentPage={
                                    customers &&
                                    (parseInt(customers.currentPage) === 0 ? 1 :
                                        Math.ceil(parseInt(customers.currentPage) + 1))

                                }
                            />
                        </NavMenuItem>
                    </div>
                </Wrapper>
            )}
            {show_overview && (
                <div>
                    <Overview
                        creditData={props.customer_pocket_credit}
                        loading={transLoading}
                        close={() => {
                            setOverview(false);
                            setActiveTab(0);
                            props.clearState({ customer_pocket_credit: null });
                            window.stop();
                        }}
                        setType={setType}
                        business_details={props.business_details}
                        activeTab={activeTab}
                        pocketReferenceId={pocketReferenceId}
                        setActiveTab={setActiveTab}
                        type={type}
                    />
                </div>
            )}
        </>
    );
}

const mapStateToProps = (state) => ({
    error_details: state.data.error_details,
    user_details: state.data.user_details,
    business_details: state.data.business_details,
    location: state.data.location,
    customers: state.data.pocket_customers,
    add_pocket_customer: state.data.add_pocket_customer,
    customer_pocket_credit: state.data.customer_pocket_credit,
    customer_pocket_debit: state.data.customer_pocket_debit,
    search_pocket_customer: state.data.search_pocket_customer,
    loading_pocket_customers: state.data.loading_pocket_customers,
});
export default connect(mapStateToProps, {
    setErrorLog,
    getPocketCustomers,
    clearState,
    getPocketCustomerTransactions,
    searchPocketCustomer,
    fetchPocketCustomers
})(CustomerPocketsPage);
