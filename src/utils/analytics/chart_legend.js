import React from "react";
import { DateRangePicker } from 'rsuite';

import "./css/chart-legend.scss";
import {useTranslation} from "react-i18next";

function ChartLegend({
  setDates,
  dates,
  updateGraph,
  toggleAuthorized,
  toggleRefused,
  show_failed,
  show_success,
}) {
    const { t } = useTranslation();
  return (
    <div className="sbt-chart-legend mb-5">
        <div className="d-flex justify-content-between dashboard-chart--legend">
            <div className='dashboard-chart--legend'>
              <div className="text-black mr-2 text-bold font-15">
                  {t('Transactions')} &nbsp;
                <span className="border-right" />
              </div>{" "}
              &nbsp;
              <span
                className="font-13 mr-2 d-flex cursor-pointer"
                style={!show_success ? { textDecoration: "line-through" } : {}}
                onClick={toggleAuthorized}
              >
                <label
                  style={{
                    backgroundColor: "#686C70",
                    borderRadius: 0,
                    height: "14px",
                    width: "14px",
                    marginTop: "2px",
                    marginRight: ".5em",
                      lineHeight:'normal'
                  }}
                />
                  {t('Successful')} &nbsp;
              </span>
              <span
                className="font-13 d-flex cursor-pointer"
                style={!show_failed ? { textDecoration: "line-through" } : {}}
                onClick={toggleRefused}
              >
                <label
                  style={{
                    backgroundColor: "#CCCDD9",
                    borderRadius: 0,
                    height: "14px",
                    width: "14px",
                    marginTop: "2px",
                    marginRight: ".5em",
                      lineHeight:'normal'
                  }}
                />
                  {t('Failed')} &nbsp;
              </span>
            </div>
            <div className="dashboard-chart--date">
                {/*<img src={CalendarIcon} />*/}
                {/* <Calendar
                  // selectionMode="range"
                  value={dates}
                  onChange={(e) => setDates(e.value)}
                  onSelect={(e) => updateGraph(e.value)}
                  className="font-12 "
                  showIcon={true}
                  hideOnDateTimeSelect={true}
                ></Calendar> */}
                <DateRangePicker
                onChange={(e) => {setDates(e)}}
                // onOk={(e) => { updateGraph()}}
                onClean={(e) => { updateGraph()}}
                showOneCalendar
                appearance="default"
                disabledDate={DateRangePicker.allowedMaxDays(7)}
                defaultValue={[new Date(), dates]}
                />
                {/*<img src={Drop} />*/}
              </div>
        </div>
    </div>
  );
}

export default ChartLegend;
