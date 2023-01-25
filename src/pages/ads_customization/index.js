/**
 * BankAccount
 *
 * @format
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setErrorLog, getBusinessAdvert, updateSingleAdsStatus, setCheckoutAdsStatus, getBusiness, clearState } from "../../actions/postActions";
import CreateAds from "../../modules/create_ads";
import { Button, Modal, Spinner } from "react-bootstrap";
import Table from "../../utils/analytics/table";
import Pen from "../../assets/images/svg/pen.svg";
import styled from "styled-components";
import "./css/ads_customization.scss";

const NavMenuItem = styled.div`
  padding: 1.5em;
  font-size: 1.1em;
  color: #676767 !important;
`;


const Gap = styled.div`
  padding-top: 1em;
`;

const onRowClick = () => { };

export function Ads({
  getBusinessAdvert,
  business_advert,
  clearState,
  updateSingleAdsStatus,
  update_single_advert_status,
  update_ads_status,
  error_details,
  business_details,
  location,
  getBusiness,
  setCheckoutAdsStatus,
  loading
}) {
  const [createAds, setCreateAds] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [selectedAds, setSelectedAds] = useState({});
  const [selectedId, setId] = useState();
  const [check, setCheck] = useState(false);
  const [config, setConfig] = useState(false);
  const [configStatus, setConfigStatus] = useState();

  const isActive = business_details && business_details.checkoutPageConfig && business_details.checkoutPageConfig.checkAdvertStatus === "ACTIVE"

  useEffect(() => {
    getBusinessAdvert();
  }, [update_single_advert_status])

  useEffect(() => {
    getBusiness();
  }, [update_ads_status])

  useEffect(() => {
    if (update_single_advert_status) {
      setCheck(false);
    }
  }, [business_advert])

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
    setCheck(false);
    setConfig(false)
    clearState({ location: null });

  }, [error_details])

  const selectAds = (id) => {
    const filter = business_advert.payload.filter(selected => selected.id === id);
    setSelectedAds(filter[0])
  }

  return (
    <div className="sbt-user-management">
      <NavMenuItem className="border br-normal pb-5">
        <div className="container-fluid">
          <div className="row">
            <div className="font-medium pb-3 font-20 text-black col-md-6 ">
              Checkout Advertisements
              </div>
          </div>
          <Gap>
            <div className="container-fluid">
              <div className="d-flex ">
                <div className="col-6 p-0 font-13">
                  <div className="form-group mb-0 form-inline">
                    <div className="form-group">
                      {config ? (
                        <Spinner animation="border" size="sm" className="m-2" />
                      ) : (
                        <input
                          type="checkbox"
                          className="form-control m-2"
                          checked={
                            configStatus !== undefined
                              ? configStatus
                                ? true : false
                              : isActive ? true : false
                          }
                          onChange={(e) => {
                            e.preventDefault();
                            setConfig(true)
                            setCheckoutAdsStatus({
                              location: "update_ads_status",
                              status:
                                configStatus !== undefined
                                  ? configStatus
                                    ? "INACTIVE" : "ACTIVE"
                                  : isActive ? "INACTIVE" : "ACTIVE"
                            });
                          }}
                        />)}
                    </div>
                    <label className="form-label">
                      Allow ads to display on checkout.
                        </label>
                  </div>
                </div>

                  <div className="col-6">

                      <Button
                        variant="xdh"
                        height={"40px"}
                        className="brand-btn"
                        style={{ width: "140px" }}
                        onClick={() => {
                          setCreateAds(true)
                          setEdit(false)
                          setSelectedAds({});
                          clearState({ location: null });
                        }}
                      >
                        Create
                    </Button>
                  </div>

              </div>
            </div>
          </Gap>
        </div>

        <Gap>
          <Table
            loading={loading}
            data={business_advert && business_advert.payload || []}
            nopagination={true}
            header={[

              {
                name: "Ads Image",
                pointer: "",
                func: (props) => (
                  <div style={{ width: "100px" }}>
                    <img src={props.advertImageUrl} width="70" height="70" />
                  </div>
                ),
              },
              {
                name: "Title",
                pointer: "advertTitle",
                func: (props) => (
                  <div style={{ width: "150px" }}>{props}</div>
                ),
              },
              {
                name: "Description",
                pointer: "advertDescription",
                func: (props) => (
                  <div style={{ width: "250px" }}>{props}</div>
                ),
              },
              {
                name: "Link",
                pointer: "advertUrl",
                copy: true,
                func: (props) => (
                  <div className="seerbit-color" style={{ width: "150px" }}>{props}</div>
                ),
              },
              {
                name: "Status",
                pointer: "",
                func: (props) => (
                  <div className="form-group  form-inline font-14">
                    <div className="form-group p-0">
                      {selectedId === props.id && check ? (
                        <Spinner animation="border" size="sm" className="mr-1" />
                      ) : (
                        <input
                          type="checkbox"
                          className=" mr-2"
                          checked={props.status === "ACTIVE" ? true : false}
                          onChange={(e) => {
                            setId(props.id)
                            e.preventDefault();
                            setCheck(true)
                            updateSingleAdsStatus({
                              id: props.id,
                              location: "update_single_advert_status",
                              status: props.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                            });
                          }}
                          disabled={check}
                        />
                      )}
                    </div>{" "}
                    {props.status === "ACTIVE" ? "Active" : "Inactive"}
                  </div>
                ),
              },
              {
                name: "Action",
                pointer: "",
                func: (props) => (
                  <div
                    className="sbt-deep-color pl-1"
                    onClick={(e) => {
                      selectAds(props.id);
                      setCreateAds(!createAds);
                      setEdit(true);
                      clearState({ location: null });
                    }}
                  >
                    <img
                      src={Pen}
                      style={{ height: "10px", width: "10px" }}
                    />{" "}
                    <span className="font-15 cursor-pointer">edit</span>
                  </div>
                ),
              },
            ]}
            onRowClick={onRowClick}
          />
        </Gap>
      </NavMenuItem>

      <Modal show={createAds} onHide={() => setCreateAds(false)} centered>
        <CreateAds
          close={() => {
            setEdit(false)
            setSelectedAds({})

            setCreateAds(false);
            window.stop();
          }}
          isEdit={isEdit}
          selectedAds={selectedAds || {}}
        />
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  error_details: state.data.error_details,
  location: state.data.location,
  business_advert: state.data.business_advert,
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
  setCheckoutAdsStatus
})(Ads);
