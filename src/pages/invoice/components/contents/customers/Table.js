import React from "react";
import AppTable from "components/app-table";
import useWindowSize from "components/useWindowSize";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
const Table = ({
  invoice_customers,
  loading = false,
  perPage = 25,
  changePage,
  currentPage,
}) => {
  const size = useWindowSize();
  const { width, height } = size;
  const { t } = useTranslation();

  const fullColumns = [
    {
      name: t("Business Name"),
      cell: (data) => <span>{data.businessName}</span>,
    },
    {
      name: t("Customer Name"),
      cell: (props) => <span className="font-11">{props.contactName}</span>,
    },
    {
      name: t("Customer Phone Number"),
      cell: (props) => <span className="font-11">{props.customerPhone}</span>,
    },
    {
      name: t("Customer Email"),
      cell: (props) => <span className="font-11">{props.customerEmail}</span>,
    },
    {
      name: t("Value In"),
      cell: (data) => <span>{data.valueIn}</span>,
    },
    {
      name: t("Value Out"),
      cell: (data) => <span>{data.valueOut}</span>,
    },
    {
      name: t("Count"),
      cell: (data) => <span>{data.count}</span>,
    },
  ];

  const mobileColumns = [
    {
      name: t("Customer Name"),
      cell: (props) => <span className="font-11">{props.contactName}</span>,
    },
    {
      name: t("Customer Email"),
      cell: (props) => (
        <div className="font-11 cut-text">{props.customerEmail}</div>
      ),
    },
    {
      name: t("Value In"),
      cell: (data) => <span>{data.valueIn}</span>,
    },
    {
      name: t("Value Out"),
      cell: (data) => <span>{data.valueOut}</span>,
    },
    {
      name: t("Count"),
      cell: (data) => <span>{data.count}</span>,
    },
  ];

  return (
    <AppTable
      columns={width >= 991 ? fullColumns : mobileColumns}
      headerStyle={{ textTransform: "capitalize" }}
      loading={loading}
      fixedLayout={false}
      paginate={Math.ceil(invoice_customers?.rowCount / perPage) > 1 || false}
      perPage={perPage}
      totalPages={Math.ceil(invoice_customers?.rowCount / perPage) || 0}
      changePage={(page) => {
        changePage(page.activePage - 1);
      }}
      currentPage={currentPage}
      data={invoice_customers?.data || []}
    />
  );
};

Table.propTypes = {
  data: PropTypes.any,
  loading: PropTypes.bool,
  perPage: PropTypes.number,
  currentPage: PropTypes.number,
  changePage: PropTypes.func.isRequired,
};
export default Table;
