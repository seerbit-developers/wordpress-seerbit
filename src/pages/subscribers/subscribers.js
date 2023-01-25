import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DebounceInput } from "react-debounce-input";
import Search from "assets/images/svg/search.svg";
import { getSubscribers, searchSubscriber } from "actions/recurrentActions";
import TableDropdown from "components/table-actions-dropdown/table-dropdown";
import AppTable from "components/app-table";
import { isEmpty } from "lodash";
import useWindowSize from "components/useWindowSize";

function Subscribers(props) {
    const [perPage] = useState(25);
    const [search, setSearch] = useState("");

    const { subscribers, loading, history } = props;
    const size = useWindowSize()
    const { width } = size;

    const [actions] = React.useState(
        [
            { label: 'View Details', value: 'view' }
        ]
    );

    useEffect(() => {
        if (isEmpty(search)) {
            props.getSubscribers(0, perPage)
        } else if (search.length >= 2) {
            props.searchSubscriber(search)
        }
    }, [perPage, search])

    const changePage = (from = 1) => {
        props.getSubscribers(from, perPage)
    };

    const onTableActionChange = (action, props) => {
        if (action.value === 'view') {
            history.push(`subscribers/${props?.customerId}/${props?.cardName}/subscriptions`);
        }
    }

    const [columns] = React.useState([
        {
            name: 'Customer Name', cell: props => props?.cardName
        },
        { name: 'No of Subscriptions', cell: props => <div>{props?.subscriptionCount}</div> },
        { name: 'Life Time Value', cell: props => <div>{props?.currency} {props?.amount}</div> },
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
            name: 'Customer Name', cell: props => props?.cardName
        },
        { name: 'No of Subscriptions', cell: props => <div>{props?.subscriptionCount}</div> },
        { name: 'Life Time Value', cell: props => <div>{props?.currency} {props?.amount}</div> },
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
                Subscribers
            </div>

            <div className="d-none d-lg-flex flex-row align-items-center justify-content-between mb-5">
                <div className="d-flex flex-row align-items-center p-0 m-0">
                    <div className="input-wrap sbt-border-success br-normal py-1 px-2 mr-3">
                        <DebounceInput
                            minLength={2}
                            debounceTimeout={1000}
                            className="font-12 text-left"
                            placeholder="Search Subscribers"
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
                </div>
            </div>

                <AppTable
                    columns={width >= 991 ? columns : columnsMobile}
                    fixedLayout={false}
                    headerStyle={{ textTransform: 'uppercase' }}
                    loading={loading}
                    paginate={subscribers?.rowCount && Math.ceil(subscribers?.rowCount / perPage) > 1 || false}
                    perPage={perPage}
                    totalPages={subscribers?.rowCount && Math.ceil(subscribers?.rowCount / perPage) || 0}
                    changePage={(page) => changePage(page.activePage - 1)}
                    currentPage={subscribers?.currentPage && parseInt(subscribers?.currentPage) === 0 ?
                        1 : parseInt(subscribers?.currentPage) === perPage ?
                            2 : Math.ceil(parseInt(subscribers?.currentPage) / perPage) + 1
                    }
                    data={subscribers?.payload || []}
                    rowStyle={{ cursor: 'pointer' }}
                />
        </div>
    );
}


const mapStateToProps = state => ({
    subscribers: state.recurrent.subscribers,
    loading: state.recurrent.loading_subscribers
});

export default connect(mapStateToProps, {
    getSubscribers,
    searchSubscriber
})(Subscribers);

const mockData = {
    "status": "SUCCESS",
    "currentPage": 0,
    "pageCount": 10,
    "message": "Successful",
    "responseCode": "00",
    "rowCount": 200,
    "payload": [
        {
            "subscriptionCount": 10,
            "cardName": "John Doe",
            "customerId": "iwuwiqiquwiquq",
            "amount": 100.00
        }
    ]
}
