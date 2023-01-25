/** @format */

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import ChartLegend from "./chart_legend";
import moment from "moment";
import {useTranslation} from "react-i18next";

function SBTChart({ dataset, setDates, dates, updateGraph, period }) {
    const { t } = useTranslation();
  const [show_success, setShowSuccess] = useState(true);
  const [show_failed, setShowFailed] = useState(true);
  const mydata = Object.keys(dataset).map((i) => dataset[i]);
  let success = [],
    failed = [],
    labels = [];
  var max = 1;
  mydata.reverse();
  for (var x of mydata) {
    success.push(x.success);
    failed.push(x.failure);
    max = parseInt(x.success) > max ? parseInt(x.success) : max;
    max = parseInt(x.failure) > max ? parseInt(x.failure) : max;
    var d = new Date(x.date);
    var dayName = d;

    const dates = x.date.split("-");
    dayName =
      period === "day"
        ? moment(dates[0]).format("ddd")
        : `${moment(dates[0]).format("DD/MM")} -  ${moment(dates[0]).format(
            "DD/MM"
          )}`;
    labels.push(dayName);
  }

  const options = {
    legend: {
      display: false,
      position: "top",
      align: "start",
      labels: {
        boxWidth: 15,
        boxHeight: 15,
      },

      maintainAspectRatio: false,
      cornerRadius: 8,
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          barPercentage: 0.95,
          gridLines: {
            display: false,
            // drawBorder: false
          },
          label: {
            color: "#BABABA",
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
          gridLines: {
            display: false,
            drawBorder: false,
          },
          label: {
            color: "#BABABA",
          },
          borderSkipped: { top: 10, right: 30, left: 20 },
        },
      ],
    },
  };

  const data = {
    labels,
    datasets: [
      show_success
        ? {
            label: t('Successful'),
            backgroundColor: "#4B4B4B",
            borderColor: "#4B4B4B",
            borderWidth: 1,
            hoverBackgroundColor: "#4B4B4B80",
            hoverBorderColor: "#4B4B4B00",
            data: success,
            barBorderRadius: "4px",
            barWidth: "20px",
          }
        : {},
      show_failed
        ? {
            label: t('Failed'),
            backgroundColor: "#ECECEC",
            borderColor: "#ECECEC",
            borderWidth: 1,
            fontWeight: 500,
            hoverBackgroundColor: "#ECECEC80",
            hoverBorderColor: "#ECECEC00",
            data: failed,
            barBorderRadius: "4px",
            barWidth: "20px",
          }
        : {},
    ],
  };

  return (
    <div>
      <ChartLegend
        setDates={setDates}
        dates={dates}
        updateGraph={updateGraph}
        toggleAuthorized={() => setShowSuccess(!show_success)}
        show_success={show_success}
        toggleRefused={() => setShowFailed(!show_failed)}
        show_failed={show_failed}
      />
      <Bar
        data={data}
        options={options}
        // style={{ marginLeft: "1em" }}
        height="100px"
      />
    </div>
  );
}

export default SBTChart;
