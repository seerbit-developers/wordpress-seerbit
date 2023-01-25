import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import CreatePlans from "../../modules/create_plans";
import { Dropdown } from "primereact/dropdown";
import { DebounceInput } from "react-debounce-input";
import { Button } from "react-bootstrap";
import Search from "assets/images/svg/search.svg";
import Copy from "assets/images/svg/copy.svg";
import { getPlans, searchPlan } from "actions/recurrentActions";
import TableDropdown from "components/table-actions-dropdown/table-dropdown";
import AppTable from "components/app-table";
import { isEmpty } from "lodash"
import cogoToast from "cogo-toast";
import Badge from "components/badge";
import useWindowSize from "components/useWindowSize";
import { useTranslation } from 'react-i18next';

function Plans(props) {
    const [perPage] = useState(25);
    const [createPlan, setCreatePlan] = useState(false);
    const [interval, setInterval] = useState("");
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const { plans, loading, history } = props;
    const size = useWindowSize()
    const { width } = size;
    const {t} = useTranslation();

    const [actions] = React.useState(
        [
            { label: 'View Details', value: 'view' }
        ]
    );

    useEffect(() => {
        if (isEmpty(search)) {
            props.getPlans(0, perPage, interval, status)
        } else if (search.length >= 20) {
            props.searchPlan(0, perPage, interval, status, search)
        }
    }, [perPage, interval, status, search])

    const handleCopy = (e, props) => {
        e.preventDefault();
        cogoToast.success(`Copied Successfully`, { position: "top-right" });
        const textField = document.createElement("textarea");
        textField.innerText = props?.details?.planId;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        textField.remove();
    };

    const onTableActionChange = (action, props) => {
        if (action.value === 'view') {
            history.push(`plans/${props?.details?.planId}/subscribers`);
        }

    }

    const changePage = (from = 1) => {
        props.getPlans(from, perPage, interval, status)
    };

    const [columns] = React.useState([
        {
            name: 'Plan Name', cell: props => props?.details?.productId
        },
        { name: 'Amount', cell: props => <div>{props?.currency} {props?.amount}</div> },
        { name: 'Interval', cell: props => <div>{props?.details?.billingCycle && props?.details?.billingCycle.toLowerCase()}</div> },
        {
            name: 'Plan Code', cell: props => <span className="row p-0 m-0">
                <div className="cut-text">
                    {props?.details?.planId}
                </div>
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
        },

        { name: 'Max Limit', cell: props => <div>{props?.details?.limit}</div> },
        {
            name: "Status",
            cell: (props) => {
                return (
                    <div className="text-left" >
                        <Badge
                            status={props?.details?.status === "ACTIVE" ? "success" : "default"}
                            styles={` p-1 ${props?.details?.status === "ACTIVE" ? "success" : "default"}-transaction`}
                        >
                            {props?.details?.status && props?.details?.status.toLowerCase()}
                        </Badge>
                    </div>
                );
            },
        },
        {
            name: '',
            style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
            cell: (props) => (
                <TableDropdown data={actions} onChange={(action) => onTableActionChange(action, props)} />
            )
        }
    ]);

    const [columnsMobile] = React.useState([
        {
            name: 'Plan Name', cell: props => props?.details?.productDescription
        },
        { name: 'Amount', cell: props => <div>{props?.currency} {props?.amount}</div> },
        {
            name: 'Plan Code', cell: props => <span className="row p-0 m-0">
                <div className="cut-text">
                    {props?.details?.planId.substr(0, 4)}
                </div>
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
        },
        {
            name: "",
            cell: (props) => {
                return (
                    <div className="text-left" >
                        <Badge
                            status={props?.details?.status === "ACTIVE" ? "success" : "default"}
                            styles={` p-1 ${props?.details?.status === "ACTIVE" ? "success" : "default"}-transaction`}
                        >
                            {props?.details?.status && props?.details?.status.toLowerCase()}
                        </Badge>
                    </div>
                );
            },
        },
        {
            name: '',
            style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
            cell: (props) => (
                <TableDropdown data={actions} onChange={(action) => onTableActionChange(action, props)} />
            )
        }
    ]);

    return (
        <div className="page-container py-5">
            <div className="font-medium font-20 text-black mr-3 d-none d-lg-block mb-4">
                Plans
            </div>

            <div className="d-none d-lg-flex flex-row align-items-center justify-content-between mb-5">
                <div className="d-flex flex-row align-items-center p-0 m-0">
                    <div className="input-wrap sbt-border-success br-normal py-1 px-2 mr-3">
                        <DebounceInput
                            minLength={2}
                            debounceTimeout={1000}
                            className="font-12 text-left"
                            placeholder="Plan Code"
                            aria-label="Search"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value.trim());
                            }}
                        />
                        <span>
                            <img src={Search} />
                        </span>
                    </div>
                    <div className="input-wrap mr-3">
                        <Dropdown
                            style={{ width: 130 }}
                            optionLabel="text"
                            value={status}
                            options={[
                                {
                                    text: "All Status",
                                    value: "",
                                    label: ""
                                },
                                {
                                    text: "Active",
                                    value: "ACTIVE",
                                    label: "ACTIVE"
                                },
                                {
                                    text: "Inactive",
                                    value: "INACTIVE",
                                    label: "INACTIVE"
                                }
                            ]}
                            onChange={(e) => {
                                setStatus(e.target.value);
                            }}
                            className="font-12 sbt-border-success"
                        />
                    </div>
                    <div className="input-wrap mr-3">
                        <Dropdown
                            style={{ width: 130 }}
                            optionLabel="text"
                            value={interval}
                            options={[
                                {
                                    text: t("All Intervals"),
                                    value: "",
                                    label: ""
                                },
                                {
                                    text: "Daily",
                                    value: "DAILY",
                                    label: "DAILY"
                                },
                                {
                                    text: "Weekly",
                                    value: "WEEKLY",
                                    label: "WEEKLY"
                                },
                                {
                                    text: "Monthly",
                                    value: "MONTHLY",
                                    label: "MONTHLY"
                                },
                                {
                                    text: "Quaterly",
                                    value: "QUARTERLY",
                                    label: "QUARTERLY"
                                },
                                {
                                    text: "Yearly",
                                    value: "YEARLY",
                                    label: "YEARLY"
                                }
                            ]}
                            onChange={(e) => {
                                setInterval(e.target.value);
                            }}
                            className="font-12 sbt-border-success"
                        />
                    </div>
                </div>
                <div>
                    <Button
                        variant="xdh"
                        height={"40px"}
                        className="brand-btn"
                        style={{ width: "200px" }}
                        onClick={() => setCreatePlan(true)}
                    >
                        {t('New Plan')}
                    </Button>
                </div>
            </div>

            {width >= 991 &&
                <AppTable
                    columns={columns}
                    headerStyle={{ textTransform: 'uppercase' }}
                    loading={loading}
                    paginate={plans?.rowCount && Math.ceil(plans?.rowCount / perPage) > 1 || false}
                    perPage={perPage}
                    totalPages={plans?.rowCount && Math.ceil(plans?.rowCount / perPage) || 0}
                    changePage={(page) => changePage(page.activePage - 1)}
                    currentPage={plans?.rowCount && parseInt(plans?.rowCount) === 0 ?
                        1 : parseInt(plans?.currentPage) === perPage ?
                            2 : Math.ceil(parseInt(plans?.currentPage) / perPage) + 1
                    }
                    data={plans?.payload || []}
                    rowStyle={{ cursor: 'pointer' }}
                />
            }

            {width < 991 &&
                <AppTable
                    hideHeader
                    columns={columnsMobile}
                    headerStyle={{ textTransform: 'uppercase' }}
                    loading={loading}
                    paginate={plans?.rowCount && Math.ceil(plans?.rowCount / perPage) > 1 || false}
                    perPage={perPage}
                    totalPages={plans?.rowCount && Math.ceil(plans?.rowCount / perPage) || 0}
                    changePage={(page) => changePage(page.activePage - 1)}
                    currentPage={plans?.rowCount && parseInt(plans?.rowCount) === 0 ?
                        1 : parseInt(plans?.currentPage) === perPage ?
                            2 : Math.ceil(parseInt(plans?.currentPage) / perPage) + 1
                    }
                    data={plans?.payload || []}
                    rowStyle={{ cursor: 'pointer' }}
                />
            }
            <CreatePlans isOpen={createPlan} close={() => setCreatePlan(false)} />
        </div>

    );
}


const mapStateToProps = state => ({
    plans: state.recurrent.plans,
    loading: state.recurrent.loading_plans,
});

export default connect(mapStateToProps, {
    getPlans,
    searchPlan
})(Plans);
