/** @format */

import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  getPaymentLinks,
  searchPaymentLink,
  clearState,
  getAllowedCurrencies
} from "../../actions/postActions";
import { isEmpty } from "lodash";
import { Dropdown } from "primereact/dropdown";
import { CSVLink } from "react-csv";
import PrintPDf from "../../utils/downloadPdf";
import AppTable from "components/app-table";
import moment from "moment";
import { DebounceInput } from "react-debounce-input";
import Copy from "../../assets/images/svg/copy.svg";
import Pen from "../../assets/images/svg/pen.svg";
import Search from "../../assets/images/svg/search.svg";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import CreatePaymentLink from "./components/create";
import useWindowSize from "components/useWindowSize";
import Trash from 'assets/images/svg/trash.svg';
import "./css/payment_link.scss";
import ConfirmAction from 'modules/confirmAction';
import { deletePaymentLink, fetchPaymentLinks } from "../../actions/paymentLinkActions";
import {formatNumber, handleCopy} from "utils";
import EditPaymentLink from "./components/edit";
import {useHistory, useParams, useRouteMatch} from "react-router";
import { useTranslation } from "react-i18next";
import {alertError} from "../../modules/alert";

const NavMenuItem = styled.div`
  font-size: 1.1em;
  color: #676767 !important;
`;

const Gap = styled.div`
  position: relative;
  padding-bottom: 2em;
  padding-top: 1em;
`;
const RightComponent = styled.div`
  float: right;
`;



export function PaymentLink({
  getPaymentLinks,
  searchPaymentLink,
  get_payment_links,
  payment_links,
  business_details,
  error_details,
  location,
  fetchPaymentLinks,
  deletePaymentLink,
  loading_payment_links_delete,
  loading
}) {
  const [createLink, setCreateLink] = useState(false);
  const [expt, setExport] = useState();
  const [isEdit, setEdit] = useState(false);
  const [selectedData, setData] = useState();
  const [perPage, setPerPage] = useState(25);
  const [searchParam, setSearch] = useState();
  const [selectedLink, selectDeleteData] = useState();
  const [show_confirm_delete, setShowConfirmDelete] = useState(false);
  let history = useHistory();
  let { page } = useParams();
  let { path } = useRouteMatch()

  const {t} = useTranslation()

  const size = useWindowSize()
  const { width, height } = size;

  useEffect(() => {
    // getPaymentLinks()
    fetchPaymentLinks({
      size: perPage,
      start: 1,
      param: searchParam
    });
  }, [])

  useEffect(() => {
    setShowConfirmDelete(false)
  }, [payment_links])

  const reload = () => {
    fetchPaymentLinks({
      size: perPage,
      start: 1,
      param: searchParam
    });
  }

  useEffect(() => {
    if (searchParam && searchParam.length >= 1) {
      fetchPaymentLinks({
        size: perPage,
        start: 1,
        param: searchParam
      });
    } else {
      clearState({ search_payment_link: null });
    }
  }, [searchParam]);

  const exports = [
    {
      text: t("Export to Excel"),
      value: 1,
      label: 1,
    }
  ]

  const headers = [
    { label: t("Link Name"), key: "paymentLinkName" },
    { label: t("Payment Frequency"), key: "paymentFrequency" },
    { label: t("Amount"), key: "amount" },
    { label: t("Date Created"), key: "createdAt" },
    { label: t("Payment Link"), key: "paymentLinkUrl" },
    { label: t("Status"), key: "status" },
  ];

  let payment_link_array = [
    [
      { text: t("Link Name"), style: "tableHeader" },
      { text: t("Payment Frequency"), style: "tableHeader" },
      { text: t("Amount"), style: "tableHeader" },
      { text: t("Date Created"), style: "tableHeader" },
      { text: t("Payment Link"), style: "tableHeader" },
      { text: t("Status"), style: "tableHeader" },
    ],
    [
      { pointer: "paymentLinkName" },
      { pointer: "paymentFrequency" },
      { pointer: "amount" },
      { pointer: "createdAt" },
      { pointer: "paymentLinkUrl" },
      { pointer: "status" }
    ],
  ];

  const downloadTemplate = (option) => {
    if (option.value === 1)
      return (
        <div className="my-1 font-12 font-weight-bold">
          <CSVLink
            data={
              get_payment_links?.payload?.payload || []}
            headers={headers}
            filename={`${new Date().getTime()}-payment_link.csv`}
          >
            <span style={{ color: "#333333" }}>{option.text}</span>
          </CSVLink>
        </div>
      );
  };

  const changePage = (page) => {
    fetchPaymentLinks({
      size: perPage,
      start: page,
      param: searchParam
    });
  };

  useEffect(() => {
    if (error_details && location === "get_payment_links") {
      alertError(error_details.message);
      clearState({ get_payment_links: null });
    }
  }, [error_details]);

  const goToPage = (redirect, id)=>{
    const currentPage = page ? 'links/'+page+'/' : 'links/'
    history.push(currentPage+id+'/'+redirect)
  }

  const [fullColumns] = React.useState([
    {
      name: t('Title'),
      style: { width: '100px' },
      cell: row => (
        <span className="text-right cursor-pointer seerbit-color" title={row && row.paymentLinkName && row.paymentLinkName}
              onClick={()=>goToPage('transactions', row.paymentLinkId)}>
          {row && row.paymentLinkName && row.paymentLinkName}
        </span>
      )
    },
    {
      name: t('Payment Frequency'),
      style: { width: '100px' },
      cell: props => <span className="row p-0 m-0">
        <span>{props && props.paymentFrequency && props.paymentFrequency.replace("_", " ").toLowerCase()}</span>
      </span>
    },
    {
      name: t('Amount'),
      cellStyle: { textAlign: 'left' },
      style: { width: '100px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return (
          <span className="row p-0 m-0">
            <div className="">
              <span>{props.amount !== undefined ?
                `${props && props.currency ? props.currency : business_details.default_currency} ${formatNumber(props.amount)}`
                : t("Not Set")}</span>
            </div>
          </span>
        )
      }
    },
    {
      name: t('Date Created'),
      style: { width: '100px', paddingRight: '15px', textAlign: 'left' },
      cell: data => <span>{moment(data.createdAt).format("DD-MM-yyyy, hh:mm A")}</span>
    },
    {
      name: t('Expiry Date'),
      style: { width: '100px', paddingRight: '15px', textAlign: 'left' },
      cell: data => <span>{data.expiryDate && moment(data.expiryDate).format("DD-MM-yyyy, hh:mm A") || t("Not Set")}</span>
    },
    {
      name: t('Payment Link'),
      style: { width: '150px', paddingRight: '15px', textAlign: 'left' },
      cell: data => <div className="d-flex justify-content-start align-items-center">
        <div className="mr-3">
          {data.paymentLinkUrl.substr(0, 20)}
        </div>
        <img
          src={Copy}
          width="15"
          height="15"
          className="cursor-pointer"
          title="Copy Payment Link"
          onClick={() => {
            handleCopy(data.paymentLinkUrl);
          }}
        />
      </div>
    },
    {
      name: t('Status'),
      style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
      cell: data => <span className='number'>
        <span
          className={`round ${data.status === "ACTIVE" ? 'success' : 'default'
            } rounded-circle`}
        />
        {t(data.status.toLowerCase())}
      </span>
    },
    {
      name: t('Action'),
      style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div>
        <img
          src={Pen}
          style={{ height: "10px", width: "10px" }}
          className="ml-2 mb-1 cursor-pointer"
          onClick={(e) => {
            setEdit(true);
            setCreateLink(true);
            setData(props);
          }}
        />
        <img
          src={Trash}
          alt="delete"
          style={{ height: "10px", width: "10px" }}
          className="ml-2 mb-1 cursor-pointer"
          onClick={(e) => {
            selectDeleteData(props);
            setShowConfirmDelete(true);
          }}
        />
      </div>
    },
  ]);

  const [columns] = React.useState([
    {
      name: t('Title'),
      cell: row => (
        <span className="text-right" title={row && row.paymentLinkName && row.paymentLinkName}>
          {row && row.paymentLinkName && row.paymentLinkName}
        </span>
      )
    },
    {
      name: t('Amount'),
      cellStyle: { textAlign: 'left' },
      cell: props => {
        return (
          <span className="row p-0 m-0">
            <div className="cut-text">
              <span>{props.amount !== undefined ?
                `${props && props.currency ? props.currency : business_details.default_currency} ${formatNumber(props.amount)}`
                : t("Not Set")}</span>
            </div>
          </span>
        )
      }
    },
    {
      name: t('Date Created'),
      cell: data => <span>{moment(data.createdAt).format("DD-MM-yyyy")}</span>
    },
    {
      name: t('Payment Link'),
      style: { width: '150px', paddingRight: '15px', textAlign: 'left' },
      cell: data => <span className="row p-0 m-0">
        <div className="cut-text-1">
          {data.paymentLinkUrl}
        </div>
        <img
          src={Copy}
          width="15"
          height="15"
          className="cursor-pointer"
          onClick={() => {
            handleCopy(data.paymentLinkUrl);
          }}
        />
      </span>
    },
    {
      name: t('Status'),
      style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
      cell: data => <span className='number'>
        <span
          className={`round ${data.status === "ACTIVE" ? 'success' : 'default'
            } rounded-circle`}
        />
        {t(data.status.toLowerCase())}
      </span>
    },
    {
      name: t('Action'),
      style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div>
        <img
          src={Pen}
          style={{ height: "10px", width: "10px" }}
          className="ml-2 mb-1 cursor-pointer"
          onClick={(e) => {
            setEdit(true);
            setCreateLink(true);
            setData(props);
          }}
        />
        <img
          src={Trash}
          alt="delete"
          style={{ height: "10px", width: "10px" }}
          className="ml-2 mb-1 cursor-pointer"
          onClick={(e) => {
            selectDeleteData(props);
            setShowConfirmDelete(true);
          }}
        />
      </div>
    },
  ]);

  return (
    <>
      <div className="page-container">
        <NavMenuItem className="py-5">
          <div className="font-medium font-20 text-black mr-3 d-none d-lg-block mb-4">
            {t("Payment Links")}
          </div>
          <Gap>
            <div className="d-flex justify-content-between">
              <div>
                <Button
                  variant="xdh"
                  height={"40px"}
                  className="brand-btn"
                  style={{ width: "200px" }}
                  onClick={() => {
                    setEdit(false);
                    setCreateLink(true);
                  }
                  }
                >
                  {t("Create Payment Link")}
                </Button>
              </div>
              <div>
                <div className="d-none d-lg-block">
                  <RightComponent>
                    <div className="row">
                      <div className="col-7 input-wrap sbt-border-success br-normal px-2">
                        <DebounceInput
                          minLength={2}
                          debounceTimeout={1000}
                          className="w-100 font-12 text-left sbt-border-success py-2"
                          placeholder={t("Payment Link Name")}
                          aria-label="Search"
                          onChange={(e) => {
                            setSearch(e.target.value);
                          }}
                          disabled={loading}
                        />
                        <span>
                          <img src={Search} />
                        </span>
                      </div>
                      <span className="col-5 font-12 font-light px-3 export_data">
                        <Dropdown
                          optionLabel="text"
                          style={{ width: 180 }}
                          value={expt}
                          options={exports}
                          onChange={(e) => {
                            setExport(e.target.value);
                          }}
                          itemTemplate={downloadTemplate}
                          placeholder={t("Export Data")}
                          className="font-12 text-left sbt-border-success p-2"
                          showClear={true}
                        />
                      </span>
                    </div>
                  </RightComponent>
                </div>
              </div>
            </div>

            {/*mobile filter*/}
            <div className="d-md-none d-flex flex-column align-items-center p-0 m-0 mt-5">

              <div className="input-wrap sbt-border-success br-normal py-1 px-2 mr-3 w-100">
                <DebounceInput
                  minLength={2}
                  debounceTimeout={1000}
                  className="font-12 text-left w-200px sbt-border-success py-2"
                  placeholder={t("Payment Link Name")}
                  aria-label="Search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <div className="text-right w-100">
                  <img src={Search} />
                </div>
              </div>
            </div>
          </Gap>

    
            <AppTable
              columns={width >= 991 ? fullColumns : columns}
              fixedLayout={false}
              headerStyle={{ textTransform: 'uppercase' }}
              loading={loading}
              paginate={
                payment_links && payment_links.rowCount ?
                  Math.ceil(payment_links.rowCount / perPage) > 1 : false
              }
              perPage={perPage}
              totalPages={
                payment_links && payment_links.rowCount ?
                  payment_links.rowCount ? Math.ceil(payment_links.rowCount / perPage) : 0
                  : 0
              }
              changePage={(page) => {
                changePage(page.activePage);
              }}
              currentPage={
                !isEmpty(payment_links)
                  ? payment_links.currentPage + 1
                  : 1
              }
              data={
                !isEmpty(payment_links)
                && !isEmpty(payment_links.payload) &&
                payment_links.payload

              }
              // onClickRow={viewTransactionData}
              rowStyle={{ cursor: 'pointer' }}
            />
          

  
        </NavMenuItem>
      </div>
      <ConfirmAction
        show={show_confirm_delete}
        title={t('APPROVAL REQUEST')}
        process={loading_payment_links_delete}
        message={!loading_payment_links_delete
          ? `${t("You are about to delete")} ${selectedLink?.paymentLinkName?.toUpperCase() || ""}.`
          : `${t("Deleting")}...`}
        handler={() => {
          const index = payment_links.payload.findIndex(item => item.paymentLinkId === selectedLink?.paymentLinkId)
          deletePaymentLink({ id: selectedLink?.paymentLinkId, index })
        }}
        close={(e) => setShowConfirmDelete(false)}
      />
      <CreatePaymentLink
        isOpen={createLink && !isEdit}
        reload={reload}
        isEdit={isEdit}
        selectedData={selectedData}
        close={() => setCreateLink(false)}
      />

      <EditPaymentLink
        isOpen={createLink && isEdit}
        reload={reload}
        isEdit={isEdit}
        selectedData={selectedData}
        close={() => setCreateLink(false)}
      />
    </>
  );
}

const mapStateToProps = (state) => ({
  get_payment_links: state.data.get_payment_links,
  business_details: state.data.business_details,
  error_details: state.data.error_details,
  location: state.data.location,
  loading: state.paymentLink.loading_payment_links,
  payment_links: state.paymentLink.payment_links,
  loading_payment_links_delete: state.paymentLink.loading_payment_links_delete
});

export default connect(mapStateToProps, {
  getAllowedCurrencies,
  getPaymentLinks,
  searchPaymentLink,
  clearState,
  fetchPaymentLinks,
  deletePaymentLink
})(PaymentLink);
