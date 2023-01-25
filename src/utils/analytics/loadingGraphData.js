import React from "react";

const NoDataChartPlaceHolder = () =>{
  return(
      <div className="chart">
          <div className="no-chart-data show-fade">
              {/*<h2 className="title">No data for current period</h2>*/}
              <div className="y-axis"></div>
              <div className="x-axis"></div>
              <div className="bars ">
                  {/*<div className="overlay"></div>*/}
                  <div className="bar bar-0"></div>
                  <div className="bar bar-1"></div>
                  <div className="bar bar-2"></div>
                  <div className="bar bar-3"></div>
                  <div className="bar bar-4"></div>
                  <div className="bar bar-5"></div>
                  <div className="bar bar-6"></div>
                  <div className="bar bar-7"></div>
                  <div className="bar bar-8"></div>
                  <div className="bar bar-9"></div>
                  <div className="bar bar-10"></div>
                  <div className="bar bar-11"></div>
                  <div className="bar bar-12"></div>
                  <div className="bar bar-13"></div>
                  <div className="bar bar-14"></div>
                  <div className="bar bar-15"></div>
                  <div className="bar bar-16"></div>
                  <div className="bar bar-17"></div>
                  <div className="bar bar-18"></div>
                  <div className="bar bar-19"></div>
                  <div className="bar bar-20"></div>
                  <div className="bar bar-21"></div>
                  <div className="bar bar-22"></div>
                  <div className="bar bar-23"></div>
                  <div className="bar bar-24"></div>
              </div>
          </div>
      </div>
  );
}

export default NoDataChartPlaceHolder;
