import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Table from "./Table";
import PropTypes from "prop-types";
import { Dropdown } from "primereact/dropdown";
import { DebounceInput } from "react-debounce-input";
import Search from "assets/images/svg/search.svg";
import { connect } from "react-redux";
import { CSVLink } from "react-csv";
import { getCustomers } from "actions/invoiceActions";
import Button from "components/button";
import CreateCustomer from "./CreateCustomer";
import { useTranslation } from "react-i18next";

const Customers = ({ loading, setTab, overview, getCustomers,countries, ...props }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(25);
  const [expt, setExport] = useState();
  const [currentPage, setCurrentPage] = useState(1);
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
    fetchData(from, search);
  };

  const fetchData = (from = 0, search) => {
    getCustomers(from, perPage, search);
  };

  const headers = [
    { label: t("Business Name"), key: "businessName" },
    { label: t("Customer Name"), key: "contactName" },
    { label: t("Customer Phone Number"), key: "customerPhone" },
    { label: t("Customer Email"), key: "customerEmail" },
    { label: t("Value In"), key: "valueIn" },
    { label: t("Value Out"), key: "valueOut" },
    { label: t("Count"), key: "count" },
  ];

  const downloadTemplate = (option) => {
    if (option.value === 1)
      return (
        <div className="my-1 font-12 font-weight-bold">
          <CSVLink
            data={props?.invoice_customers?.data || []}
            headers={headers}
            filename={`${new Date().getTime()}-invoice-customers.csv`}
          >
            <span style={{ color: "#333333" }}>{option.text}</span>
          </CSVLink>
        </div>
      );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className="--content-full"
      >
        <CreateCustomer
            isOpen={open}
            close={(v) => setOpen(false)}
            countries={countries?.payload}
        />
        <div className="header">
          <h4>{t("Customer")}</h4>
        </div>
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-row ">
            <Button
              text={t("New Customer")}
              size="sm"
              onClick={() => setOpen(true)}
              className="mr-3"
            />
              <DebounceInput
                minLength={2}
                debounceTimeout={1000}
                className="font-12 text-left form-control"
                placeholder={t("Search Customer")}
                aria-label="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value.trim());
                }}
              />
          </div>
          <div className="font-12 font-light">
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
            invoice_customers={props?.invoice_customers}
            loading={loading}
            perPage={perPage}
            currentPage={currentPage}
            changePage={changePage}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

Customers.propTypes = {
  loading: PropTypes.bool,
  countries: PropTypes.array,
  getCustomers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  loading_invoice_customers: state.invoice.loading_invoice_customers,
  invoice_customers: state.invoice.invoice_customers,
  countries: state.data.countries,
});

export default connect(mapStateToProps, {
  getCustomers,
})(Customers);
