import React from "react";
import AppTable from "components/app-table";
import useWindowSize from "components/useWindowSize";
import moment from "moment";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Badge from "components/badge";
const Table = ({
  invoices,
  loading = false,
  perPage = 25,
  changePage,
  currentPage,
    onDownload
}) => {
  const size = useWindowSize();
  const { width, height } = size;
  const { t } = useTranslation();

  const fullColumns = [
    {
      name: t("Business Name"),
      style: { width: "200px", textAlign: "left" },
      cell: (data) => <div>
        <FontAwesomeIcon icon={faDownload} className='cursor-pointer mr-4' onClick={()=>onDownload(data?.invoiceId)}/>
        <span>{data.businessName}</span>
      </div>,
    },
    {
      name: t("Invoice Number"),
      style: { width: "120px", paddingRight: "15px", textAlign: "left" },
      cell: (data) => <span>{data.invoiceNo}</span>,
    },
    {
      name: t("Amount"),
      style: { width: "120px", paddingRight: "15px", textAlign: "left" },
      cell: (data) => (
        <span>
          {data.currency} {data.totalAmount}
        </span>
      ),
    },
    {
      name: t("Created Date"),
      style: { width: "100px", textAlign: "left" },
      cell: (props) => (
        <span className="font-11">
          {moment(props.createdAt).format("DD-MM-yyyy, hh:mm A")}
          <Badge text={props.status?.toLowerCase()} status={props.status === 'DRAFT' ? 'info' : 'success'} styles={{marginLeft: 10}}/>
        </span>
      ),
    },
    {
      name: t("Due Date"),
      style: { width: "100px", textAlign: "right" },
      cellStyle:{ textAlign: "right" },
      cell: (props) => (
        <span className="font-11">
          {moment(props.dueDate).format("DD-MM-yyyy")}
        </span>
      ),
    },
  ];

  const mobileColumns = [
    {
      name: t("Amount"),
      style: { width: "120px", paddingRight: "15px", textAlign: "left" },
      cell: (data) => (
        <span>
          {data.currency} {data.totalAmount}
        </span>
      ),
    },
    {
      name: t("Due Date"),
      style: { width: "100px", textAlign: "right" },
      cellStyle:{ textAlign: "right" },
      cell: (props) => (
        <span className="font-11">
          {moment(props.dueDate).format("DD-MM-yyyy, hh:mm A")}
        </span>
      ),
    },
  ];

  return (
    <AppTable
      columns={width >= 991 ? fullColumns : mobileColumns}
      headerStyle={{ textTransform: "capitalize" }}
      loading={loading}
      fixedLayout={false}
      paginate={
        invoices
          ? invoices.rowCount
            ? Math.ceil(invoices.rowCount / perPage) > 1
            : false
          : false
      }
      perPage={perPage}
      totalPages={
        invoices
          ? invoices.rowCount
            ? Math.ceil(invoices.rowCount / perPage)
            : 0
          : 0
      }
      changePage={(page) => {
        changePage(page.activePage - 1);
      }}
      currentPage={currentPage}
      data={invoices?.data || []}
    />
  );
};

Table.propTypes = {
  invoices: PropTypes.any,
  loading: PropTypes.bool,
  perPage: PropTypes.number,
  currentPage: PropTypes.number,
  changePage: PropTypes.func.isRequired,
};
export default Table;
