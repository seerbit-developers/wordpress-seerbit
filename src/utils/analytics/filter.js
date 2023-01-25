/** @format */

import React, {useState} from "react";
import styled from "styled-components";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { isEmpty } from "lodash";
import transactions_json from "../strings/transaction.json";
import "./css/filter.scss";
import { DateRangePicker } from 'rsuite';
import {useTranslation} from "react-i18next";
const Wrapper = styled.div`
  background: #fff;
`;


function Filter({
  showFilter,
  channelOption,
  setOption,
  setDates,
  dates,
  filter,
  allowedCurrency,
  currency,
  setCurrency,
  changePage,
  setTransactionStatus,
  transaction_status = false,
  setShowFilter,
  selectedpaymentOption,
  toggleFilter,
  loading,
  payment_option_filter,
    useNewDatePicker=false,
                    defaultDates,
                    setDefaultDates,
                    refund_source_filter=false,
                    refundSource='ALL',
                    setRefundSource,
                    refundSources=[],
}) {
    const [defaultDatesInternal, setDefaultDatesInternal] = useState(null);
    const [transFilter, setTransFilter] = useState([]);
    const {t} = useTranslation()
    React.useEffect( ()=>{
        const eo = transactions_json.filter.map(item=>{
            return {text:t(item.text), value: item.value}
        });
        setTransFilter(eo)
    }, [])
    React.useEffect( ()=>{
        if(defaultDatesInternal){
            filter();
        }
    }, [defaultDatesInternal])
  const toObject = (array) =>
    array.map(
      (item) => ({
        value: item,
        text: item,
      }),
      {}
    );

  const createChannelOptions = (channelOption) => {
    let arr = [];
    arr = channelOption && channelOption.length > 0 ? channelOption.map(
      (item) => (
        ({
          ...item,
          value: item.code,
          text: item.name,
        })
      )
    ) : []
    arr = arr.filter(item => item.allow_option)
    arr.unshift({ value: "", text: "CHANNEL" })
    return arr
  };

  const selectedAction = (val) => {
    if (val[1] && val[1] !== null) {
      filter();
    }
  };

  // const transitions = useTransition(showFilter, null, {
  //   from: { position: "absolute", opacity: 0, marginLeft: -25 },
  //   enter: {
  //     opacity: 1,
  //     marginLeft: 12,
  //   },
  //   leave: { opacity: 0, marginLeft: -10 },
  // });
  //   console.log(defaultDates)
  return (
    <Wrapper className="sbt-filter">
      <div className="d-flex flex-wrap">
        <div className="mr-3">
          <div className="calender-wrap cursor-pointer pl-2 pr-2 sbt-border-success">
            {/*<img src={CalendarIcon} />*/}
           {!useNewDatePicker && <Calendar
              placeholder={t("Select Date Range")}
              selectionMode="range"
              value={dates}
              onChange={(e) => {
                setDates(e.value);
                // selectedAction(e.value);
              }}
              className="font-12 cursor-pointer"
              maxDate={new Date()}
              showIcon={isEmpty(dates)}
              hideOnDateTimeSelect={true}
              disabled={loading}
            />}
              {useNewDatePicker &&
              <DateRangePicker
                  onChange={(r)=>{ setDates(r); setDefaultDates(r); setDefaultDatesInternal(r)} }
                  defaultValue={defaultDates}
                  // format="MM/dd/y"
              />
              }
            {/*{!isEmpty(dates) && <FontAwesomeIcon icon={faTimes} onClick={() => setDates()} />}*/}
          </div>
        </div>
        {payment_option_filter && (
          <Dropdown
            optionLabel="text"
            value={selectedpaymentOption}
            options={createChannelOptions(channelOption)}
            placeholder={t("Select a payment option")}
            onChange={(e) => {
              setOption(e.value);
              filter(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                e.value
              )
            }}
            className="font-12 w-100px cursor-pointer mr-3 sbt-border-success refunds"
          />)
        }
          {refund_source_filter && (
              <Dropdown
                  optionLabel="text"
                  value={refundSource}
                  options={refundSources}
                  placeholder={t("Select a source")}
                  onChange={(e) => {
                      setRefundSource(e.value);
                      filter(
                          undefined,
                          undefined,
                          undefined,
                          undefined,
                          undefined,
                          e.value
                      )
                  }}
                  className="font-12 w-100px cursor-pointer mr-3 sbt-border-success refunds"
              />)
          }

        {currency && (
          <Dropdown
            style={{ width: 80 }}
            optionLabel="text"
            value={currency}
            options={toObject(allowedCurrency)}
            onChange={(e) => {
              setCurrency(e.value);
              filter(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                e.value
              )
            }}
            className="font-12 cursor-pointer mr-3 sbt-border-success refunds"
          />
        )}

        {transaction_status && (
          <Dropdown
            optionLabel="text"
            value={transaction_status}
            options={transFilter}
            onChange={(e) => {
              setTransactionStatus(e.value);
              changePage(currency, e.value);
              setShowFilter(true);
            }}
            className="font-12 w-150px cursor-pointer mr-3 sbt-border-success refunds"
          />
        )}
      </div>
    </Wrapper>
  );
}

export default Filter;
