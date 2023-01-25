/**
 * BankAccount
 *
 * @format
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  setErrorLog,
  getBusinessAdvert,
  updateSingleAdsStatus,
  setCheckoutAdsStatus,
  getBusiness,
  clearState
} from "actions/postActions";
import Copy from "assets/images/svg/copy.svg";
import AppTable from "components/app-table";
import CreateCheckoutAdvert from "modules/createCheckoutAd";
import EditAd from "modules/edit_ads";
import AppToggle from "components/toggle";
import useWindowSize from "components/useWindowSize";
import { Button, Modal, Spinner } from "react-bootstrap";
import Pen from "assets/images/svg/pen.svg";
import "./css/ads_customization.scss";
import { getCheckoutAdverts } from "../../../actions/userManagementActions";
import { updateCheckoutAdvertStatus } from "../../../services/checkoutService";
import { alertError, alertExceptionError, alertSuccess } from "../../../modules/alert";
import { dispatchUpdateSingleBusiness } from "../../../actions/postActions";
import { handleCopy } from "../../../utils";
import {useTranslation} from "react-i18next";

export function Ads({
  checkout_adverts,
  clearState,
  updateSingleAdsStatus,
  update_ads_status,
  error_details,
  business_details,
  location,
  loading,
  getCheckoutAdverts,
  dispatchUpdateSingleBusiness
}) {

  const [createAds, setCreateAds] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [selectedAds, setSelectedAds] = useState({});
  const [selectedId, setId] = useState();
  const [check, setCheck] = useState(false);
  const [config, setConfig] = useState(false);
  const [configStatus, setConfigStatus] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const isActive = business_details && business_details.checkoutPageConfig && business_details.checkoutPageConfig.checkAdvertStatus === "ACTIVE";

  const size = useWindowSize()
  const { t } = useTranslation();

  const { width, height } = size;

  // useEffect(() => {
  //   getBusinessAdvert();
  // }, [update_single_advert_status])
  useEffect(() => {
    getCheckoutAdverts();
  }, [])

  // useEffect(() => {
  //   // getBusiness();
  // }, [update_ads_status])

  useEffect(() => {
    if (update_ads_status) {
      setConfigStatus(
        update_ads_status &&
        update_ads_status.checkoutPageConfig &&
        update_ads_status.checkoutPageConfig.checkAdvertStatus === "ACTIVE")
      setConfig(false)
    }
  }, [business_details])


  useEffect(() => {
    if (error_details && (location === "update_ads_status" || location === "update_single_advert_status")) {
      alertError("An Error Occurred sending the request. Kindly try again");
    }
    setCheck(false);
    setConfig(false)
    clearState({ location: null });

  }, [error_details])

  const selectAds = (ad) => {
    // const filter = checkout_adverts.payload.filter(selected => selected.id === id);
    setSelectedAds(ad)
  }

  const editAd = (id) => {
    setOpenEditModal(true)
    selectAds(id)
  }

  const editCheckoutAdvertStatus = (s) => {
    setConfig(true)
    updateCheckoutAdvertStatus(s ? 'ACTIVE' : 'INACTIVE').then((res) => {
      if (res.responseCode === "00") {
        setConfig(false);
        alertSuccess("Successful");
        dispatchUpdateSingleBusiness(res.payload)
      } else {
        alertError(res.message
            ? res.message
            : "An Error Occurred sending the request. Kindly try again");
      }
    }).catch((e) => {
      setConfig(false);
      alertExceptionError(e)
    });
  }

  const [columns] = React.useState([
    { name: 'Title', cell: row => <div style={{ width: "150px" }}>{row.advertTitle}</div> },
    {
      name: 'Status', cell: row => <div className="form-group form-inline font-14" style={{ color: "#3F99F0" }}>
        <div className="form-group p-0">
          {selectedId === row.id && check ? (
            <Spinner animation="border" size="sm" className="mr-1" />
          ) : (
            <input
              type="checkbox"
              className=" mr-2"
              checked={row.status === "ACTIVE" ? true : false}
              onChange={(e) => {
                setId(row.id)
                e.preventDefault();
                setCheck(true)
                updateSingleAdsStatus({
                  id: row.id,
                  location: "update_single_advert_status",
                  status: row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                });
              }}
              disabled={check}
            />
          )}
        </div>{" "}
        {row.status === "ACTIVE" ? "active" : "inactive"}
      </div>
    },
    {
      name: 'Action', cell: row => <div
        className="form-group p-0"
        style={{ color: "rgba(0, 0, 0, 0.6)" }}
        onClick={(e) => {
          selectAds(row.id);
          setEdit(true);
          setCreateAds(true)
          clearState({ location: null });
        }}
      >
        <img
          src={Pen}
          style={{ height: "10px", width: "10px" }}
          onClick={(e) => {
            selectAds(row.id);
            setEdit(true);
            clearState({ location: null });
          }}
        />{" "}
        <span
          className="font-15 cursor-pointer"
          onClick={(e) => {
            selectAds(row.id);
            setEdit(true);
            clearState({ location: null });
          }}
        >edit
        </span>
      </div>
    }
  ]);

  const [fullcolumns] = React.useState([
    {
      name: t('Ad Image'),
      style: { width: '170px', paddingRight: '15px', textAlign: 'left' },
      cell: row => <div > <img src={row.advertImageUrl} width="70" height="70" /> </div>
    },
    {
      name: t('Title'),
      style: { width: '150px', paddingRight: '15px', textAlign: 'left' },
      cell: row => <div>{row.advertTitle}</div>
    },
    {
      name: t('Description'),
      style: {
        width: '250px', textAlign: 'left'
      },
      cell: row => <div style={{ color: "rgba(0, 0, 0, 0.6)" }}>{row.advertDescription}</div>
    },
    {
      name: t('Link'),
      // style: {
      //   width: '100px', paddingRight: '15px', textAlign: 'left'
      // },
      cell: row => <div style={{ color: "rgba(0, 0, 0, 0.6)" }} onClick={() => handleCopy(row.advertUrl)}>
        <span title={row.advertUrl}>{row.advertUrl.substr(0, 30)}</span>
        <img
          src={Copy}
          width="15"
          height="15"
          className="cursor-pointer ml-2 mr-2 no-print"
          onClick={(e) => {
            handleCopy(row.advertUrl);
          }}
          alt="copy"
        />
        <a href={row.advertUrl} target="_blank">{t("Preview")}</a>
      </div>
    },
    {
      name: t('Status'),
      style: { width: '150px', paddingRight: '15px', textAlign: 'left' },
      cell: row => <div className="d-flex flex-row align-items-center" style={{ color: "#3F99F0" }}>
        {/*<div>*/}
        {/*  {selectedId === row.id && check ? (*/}
        {/*    <Spinner animation="border" size="sm" className="mr-1" />*/}
        {/*  ) : (*/}
        {/*    <input*/}
        {/*      type="checkbox"*/}
        {/*      className=" mr-2"*/}
        {/*      checked={row.status === "ACTIVE" ? true : false}*/}
        {/*      onChange={(e) => {*/}
        {/*        setId(row.id)*/}
        {/*        e.preventDefault();*/}
        {/*        setCheck(true)*/}
        {/*        updateSingleAdsStatus({*/}
        {/*          id: row.id,*/}
        {/*          location: "update_single_advert_status",*/}
        {/*          status: row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"*/}
        {/*        });*/}
        {/*      }}*/}
        {/*      disabled={check}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*</div>*/}
        <div>{row.status === "ACTIVE" ? t("Active") : t("Inactive")}</div>
      </div>
    },
    {
      name: t('Action'),
      style: { width: '50px', paddingRight: '15px', textAlign: 'left' },
      cell: row => <div
        className="d-flex flex-row align-items-center cursor-pointer"
        style={{ color: "rgba(0, 0, 0, 0.6)" }}
        onClick={(e) => {
          editAd(row)
        }}
      >
        <img
          src={Pen}
          className="mr-2"
          style={{ height: "10px", width: "10px" }}
        />{" "}
        <div className="font-15 cursor-pointer">{t("edit")}</div>

      </div>
    }
  ]);

  return (
    <div>
      <div className="d-flex justify-content-between my-5">
        <div className="">
          <div className="form-group mb-0 form-inline">
            <div className="form-group">
              <div className="d-flex flex-row">
                <div className="mr-2">
                  {config ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <div>
                      <AppToggle
                        activeClass={'config-active'}
                        active={
                          isActive !== undefined
                            ? !!isActive
                            : false
                        }
                        onChange={(s) => {
                          // setConfig(true)
                          editCheckoutAdvertStatus(s)
                          // setCheckoutAdsStatus({
                          //   location: "update_ads_status",
                          //   status:
                          //       configStatus !== undefined
                          //           ? configStatus
                          //           ? "INACTIVE" : "ACTIVE"
                          //           : isActive ? "INACTIVE" : "ACTIVE"
                          // });
                        }} />
                    </div>
                  )}
                </div>
                <div>{t("Display adverts on Checkout")}.</div>
              </div>
            </div>
          </div>
        </div>
        {/*{checkout_adverts && checkout_adverts.payload && checkout_adverts.payload.length < 3 &&*/}
          <Button
            variant="xdh"
            className="brand-btn"
            style={{ width: "180px", height: 40 }}
            onClick={() => {
              setOpenCreateModal(true)
              setEdit(false)
              setSelectedAds({});
              clearState({ location: null });
            }}
          >
            {t('Create Advert')}
          </Button>
        {/*}*/}
      </div>

      {<AppTable
        columns={ width >= 991 ? fullcolumns : columns}
        loading={loading}
        fixedLayout={false}
        paginate={false}
        data={checkout_adverts && checkout_adverts.payload || []}
        className="mt-5"
        rowClass="row-height"
        headerClass=""
      />}

      <EditAd
        isOpen={openEditModal}
        close={() => {
          setOpenEditModal(false);
          getCheckoutAdverts();
        }}
        selectedAds={selectedAds}
      />

      <CreateCheckoutAdvert
        isOpen={openCreateModal}
        close={() => {
          setOpenCreateModal(false);
          getCheckoutAdverts();
        }}
      />

      {/*<Modal show={createAds} onHide={() => setCreateAds(false)} centered>*/}
      {/*  <CreateAds*/}
      {/*    close={() => {*/}
      {/*      setEdit(false)*/}
      {/*      setSelectedAds({})*/}
      {/*      setCreateAds(false);*/}
      {/*      window.stop();*/}
      {/*    }}*/}
      {/*    isEdit={isEdit}*/}
      {/*    selectedAds={selectedAds || {}}*/}
      {/*  />*/}
      {/*</Modal>*/}
    </div>
  );
}

const mapStateToProps = (state) => ({
  error_details: state.data.error_details,
  location: state.data.location,
  // checkout_adverts: state.data.checkout_adverts,
  // checkout_adverts: state.data.checkout_adverts,
  checkout_adverts: state.data.checkout_adverts,
  loading: state.data.loading_checkout_adverts,
  business_details: state.data.business_details,
  update_single_advert_status: state.data.update_single_advert_status,
  update_ads_status: state.data.update_ads_status
});

export default connect(mapStateToProps, {
  setErrorLog,
  getBusiness,
  updateSingleAdsStatus,
  clearState,
  getBusinessAdvert,
  setCheckoutAdsStatus,
  getCheckoutAdverts,
  dispatchUpdateSingleBusiness
})(Ads);
