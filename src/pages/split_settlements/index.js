/** @format */

import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  setErrorLog,
  createSplitAccount,
  clearState,
  getVendors,
  getBankList,
  searchVendor,
  deleteSplitAccount
} from "../../actions/postActions";
import { isEmpty } from "lodash";
import { Dropdown } from "primereact/dropdown";
import { CSVLink } from "react-csv";
import Trash from 'assets/images/svg/trash.svg';
import { DebounceInput } from "react-debounce-input";
import AppTable from "components/app-table";
import Copy from "assets/images/svg/copy.svg";
import Pen from "assets/images/svg/pen.svg";
import Search from "assets/images/svg/search.svg";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import AddSplitAccount from "modules/add_split_account";
import VendorOverview from "utils/analytics/vendor_overview";
import ConfirmAction from 'modules/confirmAction';
import useWindowSize from "components/useWindowSize";
import "./css/split_settlement.scss";
import {alertError, alertSuccess} from "../../modules/alert";

import { useTranslation } from "react-i18next";

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

function formatNumber(num) {
  return Number(num)
    .toFixed(2)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function SplitSettlementsPage(props) {
  const [perPage, setPerPage] = useState(25);
  const [isEdit, setEdit] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [expt, setExport] = useState();
  const [splitType, setSplitType] = useState();
  const [loading, setLoading] = useState(false);
  const [createSplitAccount, setCreateSplitAccount] = useState(false);
  const [selectedAccount, setAccount] = useState();
  const [searchParam, setSearch] = useState();
  const [vendorDetails, setVendorDetails] = useState();
  const [show_confirm_delete, setShowConfirmDelete] = useState(false);
  const size = useWindowSize()

  const {t} = useTranslation()

  const { width, height } = size;

  let type;
  if (splitType) {
    splitType === 1 ? type = t("all") : splitType === 2 ? type = t("percentage") : type = t("flat");
  }

  const { get_vendors } = props;
  const exports = [
    {
      text: t("Export to Excel"),
      value: 1,
      label: 1,
    },
  ];

  const chargesType = [
    {
      text: t("All"),
      value: 1,
      label: 1,
    },
    {
      text: t("Percentage"),
      value: 2,
      label: 2,
    },
    {
      text: t("Flat Rate"),
      value: 3,
      label: 3,
    },
  ];

  useEffect(() => {
    props.getBankList();
    props.getVendors({
      size: perPage,
      start: 1,
      type
    });
  }, [splitType]);

  useEffect(() => {
    setLoading(true);
    if (!isEmpty(props.get_vendors)) setLoading(false);
    if (!isEmpty(props.error_details)) setLoading(false);
  }, [props.get_vendors, props.error_details]);

  useEffect(() => {
    if (props.delete_subaccount && props.location === "delete_subaccount") {
      alertSuccess(t("Subaccount was deleted successfully!"));
      props.clearState({ name: "delete_subaccount", value: null });
      props.getVendors({
        size: perPage,
        start: 1
      });
    }
  }, [props.delete_subaccount]);

  useEffect(() => {
    if (props.error_details && props.location === "delete_subaccount") {
      alertError(props.error_details.message);
    }
  }, [props.error_details]);


  const onRowClick = () => { };

  const changePage = (from = 1) => {
    props.getVendors({
      start: from,
      size: perPage,
      type
    });
    setProcessing(true);
  };

  const setRange = (page = perPage) => {
    props.getVendors({
      size: page,
      start: 1,
      type
    });
    setProcessing(true);
  };


  const headers = [
    { label: t("Business Name"), key: "businessName" },
    { label: t("Bank Name"), key: "bankName" },
    { label: t("Bank Account"), key: "accountNumber" },
    { label: t("Sub Account Id"), key: "subAccountId" },
    { label: t("Split Type"), key: "type" },
    { label: t("My Share"), key: "principalValue" },
    { label: t("Sub Account Share"), key: "subAccountValue" },
  ];


  const downloadTemplate = (option) => {
    if (option.value === 1)
      return (
        <div className="my-1 font-12 font-weight-bold">
          <CSVLink
            data={props && props.get_vendors && props.get_vendors.payload || []}
            headers={headers}
            filename={`${new Date().getTime()}-split_settlement.csv`}
          >
            <span style={{ color: "#333333" }}>{option.text}</span>
          </CSVLink>
        </div>
      );

  };

  const handleCopy = (e, props) => {
    e.preventDefault();
    alertSuccess(t(`Copied Successfully`));
    const textField = document.createElement("textarea");
    textField.innerText = props;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  const selectVendor = (id) => {
    const filter = get_vendors && get_vendors.payload && get_vendors.payload.filter(selected => selected.subAccountId === id);
    if (filter)
    {
      setAccount(filter[0])
    }else{
      alertError(t('Unable to select vendor at the moment'))
    }
  }

  const { default_currency } = props.business_details;

  useEffect(() => {
    if (searchParam && searchParam.length >= 1) {
      props.searchVendor({
        size: perPage,
        start: 1,
        searchParam
      });
    } else {
      props.clearState({ search_vendor: null });
    }
  }, [searchParam]);

  const [fullColumns] = React.useState([
    {
      name: t('Business Name'),
      style: { width: '200px' },
      cell: row => <span
        className="cursor-pointer"
        onClick={() => { }}
      >{`${row && row.businessName}`}
      </span>
    },
    {
      name: t('Bank Account'),
      cellStyle: { textAlign: 'left' },
      style: { width: '90px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return <span>{props && props.accountNumber}</span>
      }
    },
    {
      name: t('Sub Account ID'),
      style: { width: '150px', paddingRight: '15px', textAlign: 'left' },
      cell: data =>
        <span className="row p-0 m-0">
          <div
            onClick={() => setVendorDetails({
              subAccountId: data.subAccountId,
              businessName: data.businessName,
              bankName: data.bankName
            })}
            className="cut-text-1 seerbit-color cursor-pointer">
            {data && data.subAccountId}
          </div>
          <img
            src={Copy}
            width="15"
            height="15"
            className="cursor-pointer"
            onClick={(e) => {
              handleCopy(e, data && data.subAccountId);
            }}
          />
        </span>
    },
    {
      name: t('Split Type'),
      cellStyle: { textAlign: 'left' },
      style: { width: '90px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return <span>{props && props.type}</span>
      }
    },
    {
      name: t('My Share'),
      cellStyle: { textAlign: 'left' },
      style: { width: '90px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return <div className="cut-text seerbit-color">
          {props && props.type === "PERCENTAGE"
            ? `${formatNumber(props && props.principalValue)}%`
            : `${default_currency} ${formatNumber(props && props.principalValue)}`}
        </div>
      }
    },
    {
      name: t('Sub Account Share'),
      cellStyle: { textAlign: 'left' },
      style: { width: '90px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return <div className="cut-text seerbit-color">
          {props && props.type === "PERCENTAGE" ? `${formatNumber(props && props.subAccountValue)}%` : "Not Applicable"}
        </div>
      }
    },
    {
      name: t('Action'),
      style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
      cell: props => <div>
        <img
          src={Pen}
          alt="edit"
          style={{ height: "10px", width: "10px" }}
          className="ml-2 mb-1 cursor-pointer"
          onClick={(e) => {
            setEdit(true)
            selectVendor(props && props.subAccountId);
            setCreateSplitAccount(true);
          }}
        />
        <img
          src={Trash}
          alt="delete"
          style={{ height: "10px", width: "10px" }}
          className="ml-2 mb-1 cursor-pointer"
          onClick={(e) => {
            selectVendor(props && props.subAccountId);
            setShowConfirmDelete(true);
          }}
        />
      </div>
    },
  ]);

  const [columns] = React.useState([
    {
      name: t('Business Name'),
      style: { width: '200px' },
      cell: row => <span
        className="cursor-pointer"
        onClick={() => { }}
      >{`${row && row.businessName}`}
      </span>
    },
    {
      name: t('Sub Account ID'),
      style: { width: '150px', paddingRight: '15px', textAlign: 'left' },
      cell: data =>
        <span className="row p-0 m-0">
          <div
            onClick={() => setVendorDetails({
              subAccountId: data.subAccountId,
              businessName: data.businessName,
              bankName: data.bankName
            })}
            className="cut-text-1 seerbit-color cursor-pointer">
            {data && data.subAccountId}
          </div>
          <img
            src={Copy}
            width="15"
            height="15"
            className="cursor-pointer"
            onClick={(e) => {
              handleCopy(e, data && data.subAccountId);
            }}
          />
        </span>
    },
    {
      name: t('My Share'),
      style: { width: '90px', paddingRight: '15px', textAlign: 'left' },
      cell: props => {
        return <div className="cut-text seerbit-color">
          {props && props.type === "PERCENTAGE"
            ? `${formatNumber(props && props.principalValue)}%`
            : `${default_currency} ${formatNumber(props && props.principalValue)}`}
        </div>
      }
    },
    {
      name: t('Sub Account Share'),
      style: { width: '90px', paddingRight: '15px', textAlign: 'left' }, cell: props => {
        return <div className="cut-text seerbit-color">
          {props && props.type === "PERCENTAGE" ? `${formatNumber(props && props.subAccountValue)}%` : t("Not Applicable")}
        </div>
      }
    },
    {
      name: t('Action'),
      cell: props => <div>
        <img
          src={Pen}
          alt="edit"
          style={{ height: "10px", width: "10px" }}
          className="ml-2 mb-1 cursor-pointer"
          onClick={(e) => {
            setEdit(true)
            selectVendor(props && props.subAccountId);
            setCreateSplitAccount(true);
          }}
        />
        <img
          src={Trash}
          alt="delete"
          style={{ height: "10px", width: "10px" }}
          className="ml-2 mb-1 cursor-pointer"
          onClick={(e) => {
            selectVendor(props && props.subAccountId);
            setShowConfirmDelete(true);
          }}
        />
      </div>
    },
  ]);

  return (
    <>
      {vendorDetails && (
        <VendorOverview
          subAccount={vendorDetails}
          close={() => {
            props.clearState({
              vendor_transactions: null,
              vendor_settlements: null,
              vendor_transaction_overview: null,
              name_inquiry: null

            });
            setVendorDetails();
            window.stop();
          }}
        />
      )}

      <AddSplitAccount
        createSplitAccount={createSplitAccount}
        selectedAccount={selectedAccount}
        isEdit={isEdit}
        isOpen={!vendorDetails && createSplitAccount}
        close={() => {
          setCreateSplitAccount(false);
          props.clearState({
            transfer_name_inquiry: null,
            name_inquiry: null,
            error_details: null

          });
          window.stop();
        }}
        error_details={props.error_details}
      />

      {!vendorDetails && (
        <div className="page-container">
          <NavMenuItem className="py-5">
            <div className="font-medium font-20 text-black mr-3 d-none d-lg-block mb-4">
              {t("Split Settlements")}
            </div>
            <Gap>
              <div className="container-fluid p-0">
                <div className="d-flex flex-row">
                  <div className="col-12 p-0">
                    <Button
                      variant="xdh"
                      height={"40px"}
                      className="brand-btn"
                      style={{ width: "200px" }}
                      onClick={() => {
                        setEdit(false);
                        setAccount(props.subAccountId);
                        setCreateSplitAccount(true);
                      }}
                    >
                      {t('Create Split Account')}
                    </Button>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="d-none d-lg-block">
                    <span className="font-12 font-light p-0 m-0 export_data">
                      <Dropdown
                        optionLabel="text"
                        value={splitType}
                        options={chargesType}
                        onChange={(e) => {
                          setSplitType(e.target.value);
                        }}
                        placeholder={t("Split Type")}
                        className="font-12 text-left w-200px sbt-border-success py-1"
                      />
                    </span>
                    <RightComponent>
                      <div className="row">
                        <div className="input-wrap sbt-border-success br-normal px-2">
                          <DebounceInput
                            minLength={2}
                            debounceTimeout={1000}
                            className="font-12 text-left w-200px sbt-border-success py-2"
                            placeholder={t("Sub Account ID")}
                            aria-label="Search"
                            onChange={(e) => {
                              setSearch(e.target.value);
                            }}
                          />
                          <span>
                            <img src={Search} />
                          </span>
                        </div>
                        <span className="font-12 font-light px-3 export_data">
                          <Dropdown
                            optionLabel="text"
                            value={expt}
                            options={exports}
                            onChange={(e) => {
                              setExport(e.target.value);
                            }}
                            itemTemplate={downloadTemplate}
                            placeholder={t("Export Data")}
                            className="font-12 text-left w-200px sbt-border-success py-1"
                            showClear={true}
                          />
                        </span>
                      </div>
                    </RightComponent>
                  </div>
                </div>
              </div>
              {/*mobile filter*/}
              <div className="d-md-none d-flex flex-column align-items-center p-0 m-0 ">

                <div className="input-wrap sbt-border-success br-normal py-1 px-2 mr-3 w-100">
                  <DebounceInput
                    minLength={2}
                    debounceTimeout={1000}
                    className="font-12 text-left w-200px sbt-border-success py-2"
                    placeholder="Sub Account ID"
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

            {width >= 991 &&
              <AppTable
                columns={fullColumns}
                headerStyle={{ textTransform: 'uppercase' }}
                loading={loading}
                paginate={
                  !isEmpty(searchParam) && !isEmpty(props.search_vendor) ? (
                    props && props.search_vendor ? props.search_vendor.rowCount ? Math.ceil(props.search_vendor.rowCount / perPage) > 1 : false : false
                  ) : props && props.get_vendors && props.get_vendors ? props.get_vendors.rowCount ? Math.ceil(props.get_vendors.rowCount / perPage) > 1 : false : false}
                perPage={perPage}
                totalPages={
                  !isEmpty(searchParam) && !isEmpty(props.search_vendor) ? (
                    props.search_vendor ? props.search_vendor.rowCount ? Math.ceil(props.search_vendor.rowCount / perPage) : 0 : 0
                  ) : (
                    props.get_vendors && props.get_vendors.rowCount ? props.get_vendors.rowCount ? Math.ceil(props.get_vendors.rowCount / perPage) : 0 : 0
                  )
                }
                changePage={(page) => {
                  changePage(page.activePage);
                }}
                currentPage={
                  !isEmpty(searchParam) && !isEmpty(props.search_vendor) ? (
                    props && props.search_vendor && props.search_vendor.currentPage &&
                      props.search_vendor.currentPage ?
                      parseInt(props.search_vendor.currentPage) === 0 ? 1 :
                        parseInt(props.search_vendor.currentPage) === perPage ? 2 :
                          Math.ceil(parseInt(props.search_vendor.currentPage) / perPage) + 1 : 1

                  ) : (
                    props && props.get_vendors && props.get_vendors.currentPage &&
                      props.get_vendors.currentPage ?
                      parseInt(props.get_vendors.currentPage) === 0 ? 1 :
                        parseInt(props.get_vendors.currentPage) === perPage ? 2 :
                          Math.ceil(parseInt(props.get_vendors.currentPage) / perPage) + 1 : 1
                  )
                }
                data={
                  !isEmpty(searchParam) && !isEmpty(props.search_vendor) ? (
                    [props.search_vendor &&
                      props.search_vendor.payload &&
                      props.search_vendor.payload] ||
                    [])
                    : props && props.get_vendors &&
                    props.get_vendors.payload &&
                    props.get_vendors.payload || []
                }
                // onClickRow={viewTransactionData}
                rowStyle={{ cursor: 'pointer' }}
              />
            }
            {width < 991 &&
              <AppTable
                hideHeader
                columns={columns}
                headerStyle={{ textTransform: 'uppercase' }}
                loading={loading}
                paginate={
                  !isEmpty(searchParam) && !isEmpty(props.search_vendor) ? (
                    props && props.search_vendor ? props.search_vendor.rowCount ? Math.ceil(props.search_vendor.rowCount / perPage) > 1 : false : false
                  ) : props && props.get_vendors && props.get_vendors ? props.get_vendors.rowCount ? Math.ceil(props.get_vendors.rowCount / perPage) > 1 : false : false}
                perPage={perPage}
                totalPages={
                  !isEmpty(searchParam) && !isEmpty(props.search_vendor) ? (
                    props.search_vendor ? props.search_vendor.rowCount ? Math.ceil(props.search_vendor.rowCount / perPage) : 0 : 0
                  ) : (
                    props.get_vendors && props.get_vendors.rowCount ? props.get_vendors.rowCount ? Math.ceil(props.get_vendors.rowCount / perPage) : 0 : 0
                  )
                }
                changePage={(page) => {
                  changePage(page.activePage);
                }}
                currentPage={
                  !isEmpty(searchParam) && !isEmpty(props.search_vendor) ? (
                    props && props.search_vendor && props.search_vendor.currentPage &&
                      props.search_vendor.currentPage ?
                      parseInt(props.search_vendor.currentPage) === 0 ? 1 :
                        parseInt(props.search_vendor.currentPage) === perPage ? 2 :
                          Math.ceil(parseInt(props.search_vendor.currentPage) / perPage) + 1 : 1

                  ) : (
                    props && props.get_vendors && props.get_vendors.currentPage &&
                      props.get_vendors.currentPage ?
                      parseInt(props.get_vendors.currentPage) === 0 ? 1 :
                        parseInt(props.get_vendors.currentPage) === perPage ? 2 :
                          Math.ceil(parseInt(props.get_vendors.currentPage) / perPage) + 1 : 1
                  )
                }
                data={
                  !isEmpty(searchParam) && !isEmpty(props.search_vendor) ? (
                    [props.search_vendor &&
                      props.search_vendor.payload &&
                      props.search_vendor.payload] ||
                    [])
                    : props && props.get_vendors &&
                    props.get_vendors.payload &&
                    props.get_vendors.payload || []
                }
                // onClickRow={viewTransactionData}
                rowStyle={{ cursor: 'pointer' }}
              />
            }
          </NavMenuItem>
        </div>
      )}
      {show_confirm_delete && (
        <ConfirmAction
          show={show_confirm_delete}
          title={t('APPROVAL REQUEST')}
          message={`${t('You are about to delete')} ${selectedAccount && selectedAccount.businessName && selectedAccount.businessName.toUpperCase() || ""}.`}
          handler={() =>
            selectedAccount && selectedAccount.subAccountId && props.deleteSplitAccount({ id: selectedAccount.subAccountId, location: 'delete_subaccount' })
          }
          close={(e) => setShowConfirmDelete(false)}
        />
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  error_details: state.data.error_details,
  user_details: state.data.user_details,
  business_details: state.data.business_details,
  location: state.data.location,
  get_vendors: state.data.get_vendors,
  search_vendor: state.data.search_vendor,
  delete_subaccount: state.data.delete_subaccount,
});

export default connect(mapStateToProps, {
  createSplitAccount,
  setErrorLog,
  clearState,
  getVendors,
  getBankList,
  searchVendor,
  deleteSplitAccount
})(SplitSettlementsPage);
