/** @format */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  getTransactionRange,
  getSampleTransactions,
  getBusinessAnalysis,
  clearState,
} from "../../actions/postActions";
import {
  getRecentTransactions,
  getDashboardAnalytics
} from "../../actions/transactionActions";
import moment from "moment";
import Overview from "../../utils/analytics/dashboard_overview";
import SBTChart from "../../utils/analytics/sbt_chart";
import "./css/dashboard.scss";
import { isEmpty } from "lodash";
import RecentTransactions from "./components/recentTransactions";
import { useTranslation } from "react-i18next";
import { AppModalCenter } from "../../components/app-modal/index";
import i18next from 'i18next';
import {Button} from "react-bootstrap";

export function Dashboard(props) {
  const { t } = useTranslation();
  const [date_format, setDateFormat] = useState("D/MMM/yy");
  const [dates, setDates] = useState(
    new Date(moment(new Date()).subtract(7, "days"))
    // new Date()
  );
  const [period, setPeriod] = useState("day");
  const [length, setLength] = useState(7);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    updateGraph(new Date());
    props.getDashboardAnalytics();
    props.getRecentTransactions();
    setMounted(true)
  }, []);

  useEffect(() => {
    if (dates && mounted){
      updateGraph(dates[1], moment(dates[1]).diff(dates[0], "days") + 1);
    }
  }, [dates]);

  useEffect(() => {
    if (!isEmpty(props.transactions)) props.handleLoading();
    if (!isEmpty(props.error_details)) props.handleLoading();
  }, [props.transactions, props.error_details]);

  const updateGraph = (dates, range = null) => {
    const date = moment(dates).format("DD-MM-yyyy");
    props.getTransactionRange({
      DAY: period,
      DATE: date,
      LENGTH: range ? range : length,
      DATE_FORMAT: date_format,
    });
  };
  // console.log(props.business_details.country.name)
  // const langs = ["Senegal", "Ivory Coast", "Gabon", "Uganda"]
  //country.toLowerCase() === "senegal"
  const country = props.business_details.country.name
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(country.toLowerCase() === "senegal")
  const langChange = () => {
    i18next.changeLanguage("fre")
    localStorage.setItem('i18nextLng', "fre")
    close(setIsCountryModalOpen(false))
  }
  const langChangeClose = () => {
    close(setIsCountryModalOpen(false))
  }
  return (
    <div className="sbt-home">
      <div className="row mr-0 resx">
        <div className="col-md-8 col-sm-12 dashboard-left-section">
          <div className='dashboard-left'>
            <div className="font-medium pb-3 font-20 text-black d-none d-md-block">
              {t('Dashboard Overview')}
            </div>
            <div className="d-none d-md-block">
              <SBTChart
                dataset={
                  (props.transaction_range &&
                    props.transaction_range.payload) ||
                  {}
                }
                loading={props.loading_dashboard_analytics}
                dates={dates}
                period={period}
                setDates={(dates) => setDates(dates)}
                updateGraph={(dates) => updateGraph(dates)}
                date_format={date_format}
                setDateFormat={(e) => setDateFormat(e)}
              />
              <div className="font-medium pt-5 pb-3 text-black font-20">
                {t('Recent Activity')}
              </div>
              <RecentTransactions
                loading={props.loading_recent_transactions}
                data={(props.transactions ? props.transactions.payload : []) || []}
                FooterComponent={props.transactions && props.transactions.payload && (
                    <div className="link py-3 font-16 brand-color">
                      <a
                          href="/#/payments/transactions"
                          className="link"
                      >
                        {" "}
                        {t('view more activities')}
                      </a>
                    </div>
                )}
              />

            </div>
          </div>
        </div>
        <div className="col-md-4 bg-white col-sm-12 p-1">
          <Overview
            business_analytics={
              (props.dashboard_analytics && props.dashboard_analytics.payload) ||
              {}
            }
            business_details={props && props.business_details}
            loading={props.loading_dashboard_analytics}
          />
          <div className="d-block d-md-none mb-5">
            <div className="font-medium pt-5 pb-3 px-3text-black font-20">
              {t('Recent Activity')}
            </div>
            <RecentTransactions
              data={(props.transactions ? props.transactions.payload : []) || []}
              loading={props.loading_recent_transactions}
              FooterComponent={props.transactions && props.transactions.payload && (
                  <div className="link py-3 font-14 font-light">
                    <a href="/#/payments/transactions"
                       className="link brand-color"
                    >
                      {" "}
                      {t('view more activities')}
                    </a>
                  </div>
              )}
            />
          </div>
        </div>
      </div>
      {isCountryModalOpen && <AppModalCenter isOpen={isCountryModalOpen} close={() => close(setIsCountryModalOpen(false))} title="" description="">
                                <div className="p-4">
                                  <div className='d-flex align-items-center mb-2'>
                                    <h4 className='d-inline-block mr-2 mb-0'>{t('Notice')} </h4>
                                    <span></span>
                                  </div>

                                  <div className='mb-4'>
                                    <h6 className="font-medium">{t('Would you like to change your default language to French?')}</h6>
                                  </div>
                                  <div className="mt-5">
                                    <Button

                                        className="brand-btn w-200px cursor-pointer mr-2 "
                                        onClick={langChange}
                                    >
                                      <span className='mr-2'></span>{t(' Yes')}
                                    </Button>
                                    <Button

                                        className="btn btn-light w-200px cursor-pointer"
                                        onClick={langChangeClose}
                                    >
                                    {t(' No')}
                                    </Button>
                                  </div>
                                </div>
                            </AppModalCenter>}
    </div>
  );
}

const mapStateToProps = (state) => ({
  transactions: state.transactions.recent_transactions,
  loading_recent_transactions: state.transactions.loading_recent_transactions,
  loading_dashboard_analytics: state.transactions.loading_dashboard_analytics,
  dashboard_analytics: state.transactions.dashboard_analytics,
  business_analytics: state.data.business_analytics,
  transaction_range: state.data.transaction_range,
  business_details: state.data.business_details,
  location: state.data.location,
  refund: state.data.refund,
  error_details: state.data.error_details,
});

export default connect(mapStateToProps, {
  getTransactionRange,
  getSampleTransactions,
  getBusinessAnalysis,
  clearState,
  getRecentTransactions,
  getDashboardAnalytics
})(Dashboard);
