/** @format */

import React, {Fragment} from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import cogoToast from "cogo-toast";
import CalendarIcon from "../../../assets/images/svg/calendar.svg";
import { useTransition, animated } from "react-spring";
import transactions_json from "../../../utils/strings/transaction.json";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import "./filter.scss";
import {DebounceInput} from "react-debounce-input";
import { DateRangePicker } from 'rsuite';
import {useTranslation} from "react-i18next";


function Filter({
                    showFilter,
                    setDates,
                    dates,
                    filter,
                    allowedCurrency,
                    currency,
                    setCurrency,
                    changePage,
                    setTransactionStatus,
                    transaction_status,
                    setShowFilter,
                    toggleFilter,
                    search,
                    processing,
                    setReference,
                    useNewDatePicker,
                    defaultDates,
                    setDefaultDates,
                    onClearDate
                }) {
    const {t} = useTranslation()
    const [defaultDatesInternal, setDefaultDatesInternal] = React.useState(null);

    React.useEffect( ()=>{
        if(defaultDatesInternal){
            filter();
        }
    }, [defaultDatesInternal])
    const toObject = (array) =>
    {
        const d = array.map(
            (item) => ({
                value: item,
                text: item,
            }),
        );
        d.unshift({value:null, text:'ALL'});
        return d
    }

    const selectedAction = (val) => {
        if (val[0] == null) {
            cogoToast.warn('Select a start date')
        }else if (val[1] == null){
            cogoToast.warn('Select an end date')
        }else if (val[1] !== null){
            filter(val[0], val[1]);
        }
    };

    const transitions = useTransition(showFilter, null, {
        from: { opacity: 0},
        enter: {
            opacity: 1,
            marginLeft: 12,
        },
        leave: { opacity: 0, marginLeft: -10 },
    });

    return (
        transitions.map(({ item, key, props }) => (
            item &&
            <div className="sbt-filter" style={{ marginBottom: transaction_status ? 0 : 54 }}>
                <animated.div className="d-flex flex-row align-items-center" key={key} style={props}>
                    <Fragment>
                        {dates && (
                            <div className="mr-3">
                                <div className="calender-wrap cursor-pointer pl-3 pr-2 sbt-border-success">
                                    <img src={CalendarIcon} />
                                    {!useNewDatePicker && <Calendar
                                        disabled={processing}
                                        placeholder="Select Date Range"
                                        selectionMode="range"
                                        value={dates}
                                        onChange={(e) => {
                                            setDates(e.value);
                                            selectedAction(e.value);
                                        }}
                                        className="font-12 cursor-pointer"
                                        maxDate={new Date()}
                                        showIcon={true}
                                        hideOnDateTimeSelect={true}
                                    ></Calendar>
                                    }
                                    {useNewDatePicker &&
                                        <DateRangePicker
                                            onChange={(r)=>{ setDates(r); setDefaultDates(r); setDefaultDatesInternal(r); onClearDate(true)} }
                                            defaultValue={defaultDates}
                                        />
                                    }
                                </div>
                            </div>
                        )}
                        {currency && (
                            <Dropdown
                                optionLabel="text"
                                value={currency}
                                options={toObject(allowedCurrency)}
                                onChange={(e) => {
                                    setCurrency(e.value);
                                }}
                                className="font-12 w-150px cursor-pointer mr-3 sbt-border-success"
                            />
                        )}
                        {transaction_status && (
                            <Dropdown
                                optionLabel="text"
                                value={transaction_status}
                                options={transactions_json.filter}
                                onChange={(e) => {
                                    setTransactionStatus(e.value);
                                    changePage(currency, e.value);
                                    setShowFilter(true);
                                }}
                                className="font-12 w-150px cursor-pointer mr-3 sbt-border-success"
                            />
                        )}
                        <DebounceInput
                            minLength={2}
                            debounceTimeout={2000}
                            className="font-12 text-left w-200px sbt-border-success p-2"
                            placeholder={t('Cycle reference')}
                            aria-label="Search"
                            onChange={(e) => {
                                search(e.target.value);
                                setReference(e.target.value);
                            }}
                        />
                        <div
                            onClick={() => {
                                setDates([])
                                toggleFilter(!showFilter)
                            }}
                            className="font-12 w-150px px-2 py-3 mt-1"
                        >
                            <strong>
                                <span className="cursor-pointer font-13" style={{ color: "#383838" }}>Close</span>
                                <span className="cursor-pointer text-warning"> x </span>
                            </strong>
                        </div>
                    </Fragment>
                </animated.div>
            </div>
        ))
    );
}

export default Filter;
