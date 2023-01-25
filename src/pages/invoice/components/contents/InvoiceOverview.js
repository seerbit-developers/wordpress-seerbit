import React, { useEffect, useState } from "react";
import Button from "components/button";
import { motion, AnimatePresence } from "framer-motion";
import { connect } from "react-redux";
import { fetchBusinessPocketBalance } from "actions/pocketActions";
import { getInvoiceOverview } from "actions/invoiceActions";
import PropTypes from "prop-types";
import { formatNumber } from "utils";
import { useTranslation } from "react-i18next";
import { getCustomers } from "actions/postActions";
const InvoiceOverview = ({
  getInvoiceOverview,
  loading,
  business_details,
  data,
  setTab,
}) => {
  useEffect(() => {
    getInvoiceOverview();
    getCustomers({ start: 0, size: 1000 });
  }, []);

  const { t } = useTranslation();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className="--content"
      >
        <div className="header d-flex justify-content-between">
          <h4>{t("Overview")}</h4>
          <Button
              text="Create Invoice"
              size="xs"
              onClick={() => setTab("/invoice/create")}
          />
        </div>
        <div className="section">
          <div className="top-panel">
            <div className="action-panel">
              <p>{t("Your statistics in value")}</p>
            </div>
            <div className="bottom-panel d-flex flex-column align-items-start">
              <div
                className="d-flex flex-row justify-content-between"
                style={{ width: "100%" }}
              >
                  <p className="info-text">{t("Total Invoice Sent Out")}</p>
                  <p className="info-bold">
                    {loading ? (
                      <span>{t("Loading")}...</span>
                    ) : (
                      <span>
                        {business_details?.default_currency}{" "}
                        {data && formatNumber(data?.overview?.totalValueSent)}
                      </span>
                    )}
                  </p>
              </div>
              <div
                className="d-flex flex-row justify-content-between py-2"
                style={{ width: "100%" }}
              >
                  <p className="info-text">{t("Total Received Invoice")}</p>
                  <p className="info-bold" style={{ color: "#33A359" }}>
                    {loading ? (
                      <span>{t("Loading")}...</span>
                    ) : (
                      <span>
                        {business_details?.default_currency}{" "}
                        {data && formatNumber(data?.overview?.received)}
                      </span>
                    )}
                  </p>
              </div>
              <div
                className="d-flex flex-row justify-content-between"
                style={{ width: "100%" }}
              >
                  <p className="info-text">{t("Total Overdue Invoices")}</p>
                  <p className="info-bold" style={{ color: "#C4C4C4" }}>
                    {loading ? (
                      <span>{t("Loading")}...</span>
                    ) : (
                      <span>
                        {business_details?.default_currency}{" "}
                        {data && formatNumber(data?.overview?.overdue)}
                      </span>
                    )}
                  </p>
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="top-panel">
            <div className="action-panel">
              <p>{t("Your statistics in volume")}</p>
            </div>
            <div className="bottom-panel d-flex flex-column align-items-start">
              <div
                className="d-flex flex-row justify-content-between"
                style={{ width: "100%" }}
              >
                  <p className="info-text">{t("Total Invoice Sent Out")}</p>
                  <p className="info-bold">
                    {loading ? (
                      <span>{t("Loading")}...</span>
                    ) : (
                      data && data?.overview?.totalVolumeSent
                    )}
                  </p>

              </div>
              <div
                className="d-flex flex-row justify-content-between py-2"
                style={{ width: "100%" }}
              >
                  <p className="info-text">{t("Total Received Invoice")}</p>
                  <p className="info-bold" style={{ color: "#33A359" }}>
                    {loading ? (
                      <span>{t("Loading")}...</span>
                    ) : (
                      data && data?.overview?.totalVolumeReceived
                    )}
                  </p>
              </div>
              <div
                className="d-flex flex-row justify-content-between"
                style={{ width: "100%" }}
              >
                  <p className="info-text">{t("Total Overdue Invoices")}</p>
                  <p className="info-bold" style={{ color: "#C4C4C4" }}>
                    {loading ? (
                      <span>{t("Loading")}...</span>
                    ) : (
                      data && data?.overview?.totalVolumeOverdue
                    )}
                  </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

InvoiceOverview.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.any,
};

const mapStateToProps = (state) => ({
  business_details: state.data.business_details,
  loading: state.invoice.loading_invoice_overview,
  data: state.invoice.invoice_overview,
});

export default connect(mapStateToProps, {
  fetchBusinessPocketBalance,
  getInvoiceOverview,
})(InvoiceOverview);
