import React from "react";
import moment from "moment";
import AppTable from "components/app-table";
import Badge from "components/badge";
import { useTranslation } from "react-i18next";
import useWindowSize from "components/useWindowSize";
import {getTransactionStatus} from "../../../utils";
function formatNumber(num) {
  return Number(num)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
const RecentTransactions = ({data,FooterComponent, ...props}) => {
  const { t } = useTranslation();
  const size = useWindowSize();
  const { width } = size;


  const columns = React.useMemo(()=> [
    {
      name: t('Amount'),
      cell: (props) => {
        // const preAuthType = (props.preAuthType && props.preAuthType.replace("_", " ").toLowerCase()) || "";
        return (
            <div className="d-flex justify-content-start">
            <span className="cut-text" style={{ flex: 1, fontWeight: "500" }}>
              {props.currency} {formatNumber(props.amount)}
            </span>
            </div>
        );
      },
    },
    {
      name: t('Status'),
      // style: { width: "70px", paddingRight: "15px" },
      cell: (props) => {
        const preAuthType =
            (props.preAuthType &&
                props.preAuthType.replace("_", " ").toLowerCase()) ||
            "";
        const preAuthCapitalized =
            preAuthType.charAt(0).toUpperCase() + preAuthType.slice(1);
        return (
            <div className="text-left" >
              <Badge
                  status={
                    props.refundList && props.refundList.length > 0
                        ? "refund"
                        : (props.gatewayResponseMessage === "APPROVED" ||
                            props.gatewayResponseMessage === "Successful") &&
                        ((props.gatewayResponseCode === "00" &&
                                props.status === "COMPLETED") ||
                            props.status === "SETTLED")
                            ? "success"
                            : ["SM_X23", "SM_A"].indexOf(props.gatewayResponseCode) > -1
                                ? "default"
                                : "fail"
                  }
                  styles={` p-1 ${preAuthCapitalized && preAuthCapitalized === "Refund"
                      ? "refund"
                      : props.refundList && props.refundList.length > 0
                          ? "refund"
                          : (props.gatewayResponseMessage === "APPROVED" ||
                              props.gatewayResponseMessage === "Successful") &&
                          ((props.gatewayResponseCode === "00" &&
                                  props.status === "COMPLETED") ||
                              props.status === "SETTLED")
                              ? "success"
                              : ["SM_X23", "SM_A"].indexOf(props.gatewayResponseCode) > -1
                                  ? "default"
                                  : "failed"
                  }-transaction`}
              >
                {
                  getTransactionStatus(props,preAuthCapitalized)
                }
              </Badge>
            </div>
        );
      },
    },
    {
      name: t('Date'),
      cell: (row) => (
          <span>
          {row ? moment(row.transactionTimeString).format("D-M-yy") : ''}
        </span>
      ),
    },
  ],[data]);
  const fullColumns = React.useMemo(()=>[
    {
      name: t('Customer'),
      style: { width: "200px" },
      cell: (row) => (
        <span
          className="text-right"
          title={row?.customer?.customerName}
        >
          {" "}
          {row?.customer?.customerName?.substr(0, 15)}
        </span>
      ),
    },
    {
      name: t('Reference'),
      cell: (data) => (
        <span className="row p-0 m-0">
          <div
            onClick={(e) => {
            }}
            className="text-uppercase"
          >
            <span>
              {data && data.transactionRef
                ? data.transactionRef.substr(0, 10)
                : ""}
            </span>
          </div>
        </span>
      ),
    },
    {
      name: t('Amount'),
      cellStyle: { textAlign: "left" },
      // style: { width: "140px" },
      cell: (row) => {
        return (
          <div className="text-left" >
            <div>
              <span
                className="font-bold"
                // onClick={() => viewTransactionData(props)}
              >
                {row.currency} {formatNumber(row.amount)}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      name: t('Status'),
      // style: { width: "70px", paddingRight: "15px" },
      cell: (props) => {
        const preAuthType =
          (props.preAuthType &&
            props.preAuthType.replace("_", " ").toLowerCase()) ||
          "";
        const preAuthCapitalized =
          preAuthType.charAt(0).toUpperCase() + preAuthType.slice(1);
        return (
          <div className="text-left" >
            <Badge
              status={
                props.refundList && props.refundList.length > 0
                  ? "refund"
                  : (props.gatewayResponseMessage === "APPROVED" ||
                    props.gatewayResponseMessage === "Successful") &&
                    ((props.gatewayResponseCode === "00" &&
                      props.status === "COMPLETED") ||
                      props.status === "SETTLED")
                    ? "success"
                    : ["SM_X23", "SM_A"].indexOf(props.gatewayResponseCode) > -1
                      ? "default"
                      : "fail"
              }
              styles={` p-1 ${preAuthCapitalized && preAuthCapitalized === "Refund"
                  ? "refund"
                  : props.refundList && props.refundList.length > 0
                    ? "refund"
                    : (props.gatewayResponseMessage === "APPROVED" ||
                      props.gatewayResponseMessage === "Successful") &&
                      ((props.gatewayResponseCode === "00" &&
                        props.status === "COMPLETED") ||
                        props.status === "SETTLED")
                      ? "success"
                      : ["SM_X23", "SM_A"].indexOf(props.gatewayResponseCode) > -1
                        ? "default"
                        : "failed"
                }-transaction`}
            >
              {
                getTransactionStatus(props,preAuthCapitalized)
              }
            </Badge>
          </div>
        );
      },
    },
    {
      name: t('Channel'),
      // cellStyle: { paddingRight: 0,textAlign: "right" },
      // style: { width: "70px", textAlign: "right" },
      cell: (row) => (
        <span
          className="text-lowercase text-center"
          // onClick={() => viewTransactionData(props)}
        >
          {row.analytics
            ? row.analytics.channel
              ? t(row.analytics.channel)
              : ""
            : ""}
        </span>
      ),
    },
    {
      name: t('Date'),
      cellStyle: { paddingRight: 0,textAlign: "right" },
      style: { width: "100px", textAlign: "right" },
      cell: (row) => {
        return <span>
          {row ? moment(row.transactionTime).format("DD-MM-yyyy") : ''}
        </span>
      },
    },

  ], [data]);
  const isMobile = width < 1200;

  return (
    <AppTable
        columns={isMobile ? columns : fullColumns}
        loading={props.loading}
        data={data ? data : []}
        FooterComponent={FooterComponent}
    />
  )
};

export default RecentTransactions;
