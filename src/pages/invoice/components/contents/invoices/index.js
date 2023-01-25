import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Table from "./Table";
import PropTypes from "prop-types";
import { Dropdown } from "primereact/dropdown";
import { DebounceInput } from "react-debounce-input";
import Search from "assets/images/svg/search.svg";
import { connect } from "react-redux";
import { CSVLink } from "react-csv";
import Button from "components/button";
import { getInvoices } from "actions/invoiceActions";
import { useTranslation } from "react-i18next";
import {downloadInvoice} from "services/invoiceService";

const Invoices = ({ loading, setTab, getInvoices, ...props }) => {
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(25);
  const [expt, setExport] = useState();
  const [currentPage, setCurrentPage] = useState(25);
  const { t } = useTranslation();

  const exports = [
    {
      text: t("Export to Excel"),
      value: 1,
      label: 1,
    },
  ];

  useEffect(() => {
    if (search) {
      fetchData(0, search);
    } else {
      fetchData();
    }
  }, [search]);

  const changePage = (from = 1) => {
    setCurrentPage(from + 1);
    fetchData(from);
  };

  const fetchData = (from = 0, search) => {
    getInvoices(from, perPage, search);
  };

  const headers = [
    { label: t("Business Name"), key: "businessName" },
    { label: t("Invoice Number"), key: "invoiceNo" },
    { label: t("Amount"), key: "totalAmount" },
    { label: t("Created Date"), key: "createdAt" },
    { label: t("Due Date"), key: "dueDate" },
  ];

  const downloadTemplate = (option) => {
    if (option.value === 1)
      return (
        <div className="my-1 font-12 font-weight-bold">
          <CSVLink
            data={props?.invoices?.data || []}
            headers={headers}
            filename={`${new Date().getTime()}-invoice.csv`}
          >
            <span style={{ color: "#333333" }}>{option.text}</span>
          </CSVLink>
        </div>
      );
  };

  const onDownload = (id) => {
    downloadInvoice(id).then(res=>{
      try {
        window.open(res.downloadLink, '_blank');
      }catch (e) {

      }
    })
  }
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className="--content-full"
      >
        <div className="header">
          <h4>{t("Invoices")}</h4>
        </div>
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-row">
            <Button
              text={t("New Invoice")}
              size="sm"
              onClick={() => setTab("/invoice/create")}
              className="mr-3"
            />
              <DebounceInput
                minLength={2}
                debounceTimeout={1000}
                className="font-12 text-left form-control"
                placeholder={t("Search Invoice Number")}
                aria-label="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value.trim());
                }}
              />
          </div>
          <div className="font-12 font-light d-none d-sm-block">
            <Dropdown
              optionLabel="text"
              style={{ width: 180, height: 37 }}
              value={expt}
              options={exports}
              onChange={(e) => {
                setExport(e.target.value);
              }}
              itemTemplate={downloadTemplate}
              placeholder={t("Export Data")}
              className="font-12 text-left sbt-border-success"
              showClear={true}
            />
          </div>
        </div>

        <div className="section">
          <Table
            invoices={props?.invoices}
            loading={loading}
            perPage={perPage}
            currentPage={currentPage}
            changePage={changePage}
            onDownload={onDownload}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

Invoices.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  loading: state.invoice.loading_invoices,
  invoices: state.invoice.invoices,
});

export default connect(mapStateToProps, {
  getInvoices,
})(Invoices);
