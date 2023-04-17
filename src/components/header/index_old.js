/**
 * /* eslint-disable jsx-a11y/anchor-is-valid
 *
 * @format
 */

/** @format */

import React, { memo, useState, useEffect } from "react";
import { connect } from "react-redux";
import AuthService from "../../utils/auth";
import {
  updateBusiness,
  switchMode,
  switchUserMode,
  saveKey,
  setBusiness,
  getCountries,
  getIndustries,
  addBusiness,
  getWalletTransaction,
  walletTopUp,
  clearState,
} from "../../actions/postActions";
import AddBusiness from "../../modules/business";
import cogoToast from "cogo-toast";
import ConfirmAction from "../../modules/confirmAction";

import { Navbar, Nav, NavDropdown, Modal, Dropdown } from "react-bootstrap";
import Toggle from "react-toggle";
import Tour from "reactour";
import { steps } from "../../modules/tour-guide";

import Logo from "../../assets/images/svg/seerbit.svg";
import TestLogo from "../../assets/images/svg/sbt-test.svg";
import Droppy from "../../assets/images/svg/droppy.svg";
import styled from "styled-components";
import "./css/index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import TopUpWallet from "../../modules/wallet_top_up";

const MerchantWrapper = styled.div`
  padding-right: 3em;
  display: flex;
  padding-left: 2em;
`;

const Merchant = styled.div`
  font-size: 15px;
  color: #676767;
  font-weight: 500;
  padding-bottom: 5px;
`;

const SM = styled.div`
  font-size: 11px;
  color: #bababa;
`;

export function Header(props) {
  const sales = ["#/customers"];
  const finance = ["#/settlements", "#/refunds", "#/disputes", "#/split-payments"];
  const account = ["#/settings"];
  const products = ["#/products, /#/product-categories"];
  const transactions = ["#/transactions", "/#/customer-pockets", "/#/pockets", "/#/transfer", "/#/branches", "/#/payment"];
  const [processBusiness, setProcessBusiness] = useState(false);
  const [active, setActive] = useState(
    props.primary_user && props.user_details.id !== props.primary_user.number
      ? props.user_details.mode === "LIVE"
      : props.business_details.setting &&
      props.business_details.setting.mode === "LIVE"
  );
  const [isTourOpen, setTour] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const initialState = {
    business_analytics: null,
    sample_transactions: [],
    transactions: [],
    pocket_customers: [],
    wallet_payouts: null,
    wallets: null,
    customers: null,
    payouts: null,
    refunds: null,
    branches: null,
    settlement_transactions: null,
    branch_settlements: null,
    disputes: null,
    business_users: null,
    business_advert: null,
    vendor_transactions: null,
    vendor_settlements: null,
    get_vendors: null,
    search_vendor: null,
    vendor_transaction_overview: null,
    get_payment_links: null
  }

  useEffect(() => {
    if (props.business_key && props.location === "business_key") {
      props.clearState({ ...initialState });
    } else if (props.location === "switch_user" || props.location === "switchMode") {
      props.clearState({ ...initialState });
    }

    if (props.new_business && props.location === "new_business") {
      cogoToast.success(
        props.new_business.message
          ? props.new_business.message
          : "Your new business request has been sent successfully.",
        {
          position: "top-right",
        }
      );
      setProcessBusiness(false);
      setShowAdd(false);
    }

    if (!props.error_details && props.location === "switch_user" || props.location === "switchMode") {
      window.location.reload(false)
    }
    if (
      props.error_details &&
      props.error_details.error_source === "new_business"
    ) {
      cogoToast.error(props.error_details.message || "action not completed", {
        position: "top-right",
      });
      setProcessBusiness(false);
    }
    if (
      props.error_details &&
      (props.error_details.error_source === "switch_user" ||
        props.error_details.error_source === "switchMode")
    ) {
      setActive(
        props.primary_user &&
          props.user_details.id !== props.primary_user.number
          ? props.user_details.mode === "LIVE"
          : props.business_details.setting &&
          props.business_details.setting.mode === "LIVE"
      );
      cogoToast.error(
        props.error_details.data
          ? props.error_details.data.message
          : props.error_details.message || props.error_details.responseMessage,
        {
          position: "top-right",
        }
      );
    }
  }, [
    props.user_details,
    props.location,
    props.error_details,
    props.new_business,
    props.business_details,
  ]);
  useEffect(() => {
    props.getIndustries();
    props.getCountries();
    setTimeout(() => {
      window.addEventListener(
        "load",
        setTour(
          !localStorage.getItem("noTour") &&
          window.innerWidth >= 992 &&
          props.business_details &&
          props.business_details.setting
        )
      );
    }, 2000);
  }, []);

  useEffect(() => {
    if (props.error_details && props.location === "pocket_customers") {
      cogoToast.error(props.error_details.message || props.error_details.responseMessage, {
        position: "top-right",
      });
    }
  }, [props.error_details]);

  return (
    <>
      <div className="sbt-header">
        <Navbar
          bg="fgfg"
          expand="lg"
          style={{ background: "#FAFCFD" }}
          className="container-fluid py-2"
        >
          <Navbar.Brand
            href="https://seerbit.com"
            target="_blank"
            className="px-4 ms-1"
          >
            <img
              src={
                props.business_details &&
                  props.business_details.setting &&
                  props.business_details.setting.mode === "TEST"
                  ? props.white_label
                    ? props.white_label.test_logo
                    : TestLogo
                  : props.white_label
                    ? props.white_label.logo
                    : Logo
              }
              style={{ height: "50px" }}
            />
          </Navbar.Brand>
          {props.business_details.setting && (
            <Nav>
              <Nav.Link
                id="home"
                href="/#/"
                className={`sbt nav-item font-15 me-3 ${window.location.hash === "#/" ? "active" : ""
                  }`}
              >
                Home
              </Nav.Link>
              <NavDropdown
                style={{ border: 0 }}
                title="Transactions"
                id="transaction"
                className={`sbt nav-item font-15 me-3 ${transactions.includes(window.location.hash) ? "active" : ""
                  }`}
              >
                <TransactionDropDown props={props} />
              </NavDropdown>{" "}
              <NavDropdown
                title="Sales"
                id="sales"
                className={`sbt nav-item font-15 me-3 ${sales.indexOf(window.location.hash) > -1 ? "active" : ""
                  }`}
              >
                <NavDropdown.Item href="/#/customers" className="font-13">
                  Customers
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title="Finance"
                id="finance"
                className={`sbt nav-item font-15 me-3 ${finance.indexOf(window.location.hash) > -1 ? "active" : ""
                  }`}
              >
                <NavDropdown.Item href="/#/settlements" className="font-13">
                  Settlement
                </NavDropdown.Item>
                <NavDropdown.Item href="/#/split-payments" className="font-13">
                  Split Payments
                </NavDropdown.Item>
                <NavDropdown.Item href="/#/refunds" className="font-13">
                  Refund
                </NavDropdown.Item>

                <NavDropdown.Item href="/#/disputes" className="font-13">
                  Disputes
                </NavDropdown.Item>
              </NavDropdown>
              {/* <NavDropdown
                title='Store'
                id='basic-nav-dropdown'
                className={`sbt nav-item font-15 me-3 ${products.indexOf(window.location.hash) > -1 ? "active" : ""
                  }`}
              >
                <NavDropdown.Item href='/#/products' className='font-13'>
                  Products
									</NavDropdown.Item>
                <NavDropdown.Item
                  href='/#/product-categories'
                  className='font-13'
                >
                  Product Categories
									</NavDropdown.Item>
              </NavDropdown> */}
              <NavDropdown
                title="Account"
                id="account"
                className={`sbt nav-item font-15 me-3 ${account.indexOf(window.location.hash) > -1 ? "active" : ""
                  }`}
              >
                {/* <NavDropdown.Item href='#' className='font-13'>
									Audit Trail
								</NavDropdown.Item> */}

                <NavDropdown.Item href="/#/settings" className="font-13">
                  Settings
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
          {!props.business_details.setting && <Nav className="me-auto"></Nav>}
          <div className="row ms-auto">
            {/* <div className="row border-right px-3 link">
                <a
                  className="mt-2"
                  href={`https://old.dashboard.seerbitapi.com`}

                  // href={`http://localhost:3008/#/auth/in/${
                  // 	props.user_details.token
                  // }/${window.location.hash
                  // 	.replace('#', '')
                  // 	.replace(/\//g, '--')}`}
                >
                  <span className="me-2">Switch to the old look</span>{" "}
                  <Toggle
                    icons={false}
                    checked={true}
                    className="mt-2"
                    style={{ zIndex: -1 }}
                    onClick={() =>
                      (window.location.href = `https://old.dashboard.seerbitapi.com`)
                    }
                  />
                </a>
              </div> */}

            <MerchantWrapper>
              <span className="row px-3 p-0 border-left ">
                <span id="business" className="px-3">
                  <div className="cursor-pointer">
                    <Merchant>{props.business_details.business_name}</Merchant>
                  </div>
                  <div>
                    <SM className="seerbit-color cursor-pointer">
                      {props.user_details.full_name}
                    </SM>
                  </div>
                </span>

                <Dropdown>
                  <Dropdown.Toggle
                    variant="none"
                    className="p-0 m-0"
                    style={{ verticalAlign: "top" }}
                  >
                    <img src={Droppy} className="px-3" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="border-none">
                    <TemplateDrop
                      props={props}
                      processBusiness={processBusiness}
                      setProcessBusiness={setProcessBusiness}
                      active={active}
                      setActive={setActive}
                      setShowAdd={setShowAdd}
                      showAdd={showAdd}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </span>
            </MerchantWrapper>
          </div>
        </Navbar>
        <Tour
          steps={steps}
          isOpen={isTourOpen}
          onRequestClose={() => setTour(false)}
          closeWithMask
          showButtons
          nextButton={<span>Next</span>}
          prevButton={<span>Previous</span>}
          onAfterOpen={(target) => {
            document.body.style.overflowY = "hidden";
          }}
          onBeforeClose={(target) => {
            localStorage.setItem("noTour", true);
            document.body.style.overflowY = "auto";
          }}
        />
        <Link
          className="fixed-bottom-right float-button"
          onClick={() => setTour(true)}
        >
          <div className="p-2 text-center">
            <span>
              <i class="fa fa-question fa-2x" aria-hidden="true"></i>
            </span>
          </div>
        </Link>
      </div>
    </>
  );
}

const TransactionDropDown = ({ props }) => {
  const [show_top_up, setShowTopUp] = useState(false);
  const [topUpProcessing, setTopUpProcessing] = useState(false);
  return (
    <div className="divide-transaction">
      <div className="col-12">
        <div className="row">
          <div className="col-6 px-0">
            <div className="py-4">
              <div className="title font-12 px-4 py-2 text-muted">Views</div>
              <NavDropdown.Item href="/#/transactions" className="font-13">
                Transactions Overview
              </NavDropdown.Item>
              <NavDropdown.Item href="/#/customer-pockets" className="font-13">
                Pocket Customers
              </NavDropdown.Item>
              {props.business_details.invoice &&
                props.business_details.invoice.active && (
                  <NavDropdown.Item href="/#/branches" className="font-13">
                    Branch Transactions
                  </NavDropdown.Item>
                )}
            </div>
          </div>
          <div className="col-6 px-0 sbt dropdown-bg-2">
            <div className="py-4">
              <div className="title font-12 px-4 py-2 text-muted">Actions</div>
              <NavDropdown.Item href="/#/pockets" className="font-13">
                Fund Pocket
              </NavDropdown.Item>
              <NavDropdown.Item href="/#/transfer" className="font-13">
                Transfer Fund
              </NavDropdown.Item>
              <NavDropdown.Item href="/#/payment" className="font-13">
                Payment Link
              </NavDropdown.Item>
            </div>
          </div>
        </div>
      </div>
      <TopUpWallet
        show_top_up={show_top_up}
        close={() => setShowTopUp(false)}
        walletTopUp={props.walletTopUp}
        wallet={props.wallet}
        business_details={props.business_details}
        inProcess={topUpProcessing}
        setInProcess={setTopUpProcessing}
        location={props.location}
      />
    </div>
  );
};

const TemplateDrop = ({
  props,
  processBusiness,
  setProcessBusiness,
  setActive,
  active,
  setShowAdd,
  showAdd,
}) => {
  const [confirm, setConfirm] = useState(false);

  const switchMode = () => {
    const params = {
      userId: props.user_details.id,
      type: props.user_details.mode === "LIVE" ? "mode=TEST" : "mode=LIVE",
      location: "switch_user",
    };
    props.switchUserMode(params);
  };
  return (
    <div className="divide mt-2">
      <div className="col-7 py-4 ">
        <div className="title font-12 py-2 text-muted mb-2">Businesses</div>
        <div className="items">
          {props.user_details.businessList.map((businessList, index) => {
            return (
              <div
                className="item font-12 py-1 sbt-deep-color mb-2 cursor-pointer"
                onClick={() => {
                  props.setBusiness(index);
                  props.saveKey(businessList.business.number);
                }}
              >
                {businessList.business.business_name}
              </div>
            );
          })}
          {props.business_details && props.business_details.number && (
            <div className="item font-12 py-1 sbt-deep-color cursor-pointer">
              {" "}
              <FontAwesomeIcon icon={faPlus} className="me-2" />{" "}
              <span
                onClick={(e) => {
                  setShowAdd(true);
                }}
              >
                Add Business
              </span>
            </div>
          )}
          {props.primary_user && (
            <div className="absolute-bottom mb-3">
              <span className="border p-2 br-normal ">
                <span className="font-12 me-1">Test mode</span>{" "}
                {props.primary_user &&
                  props.user_details.id === props.primary_user.number && (
                    <Toggle
                      className=""
                      checked={active}
                      onChange={(e) => {
                        if (props.business_details.status === "APPROVED")
                          setActive(!active);
                      }}
                      onClick={(e) => {
                        if (props.business_details.status !== "APPROVED") {
                          setConfirm(true);
                        } else {
                          props.switchMode({
                            location: "switchMode",
                            type: "switch-mode",
                          });
                        }
                      }}
                      icons={false}
                      disabled={
                        props.user_permissions.indexOf(
                          "APPROVE_MERCHANT_PROFILE_UPDATE"
                        ) === -1
                      }
                    />
                  )}
                {props.primary_user &&
                  props.user_details.id !== props.primary_user.number && (
                    <Toggle
                      checked={active}
                      icons={false}
                      onClick={() => {
                        setActive(!active);
                        switchMode();
                      }}
                    />
                  )}
                <span className="font-12">Live mode</span>
              </span>
            </div>
          )}
        </div>
        {confirm && (
          <ConfirmAction
            show={confirm}
            title="APPROVAL REQUEST"
            message={`Your business has not been activated you will be redirected to business setting to supply all required document.`}
            handler={() => (window.location.href = "/#/quick-setup")}
            close={(e) => setConfirm(false)}
          />
        )}
      </div>
      <div className="col-5 support py-4">
        <div className="title font-12  py-2 mb-2">Support</div>

        <div className="items">
          <div className="item font-12 py-1 sbt-deep-color cursor-pointer">
            <a
              href={"http://releasenotes.seerbitapi.com/"}
              className="sbt-deep-color"
              target="_blank"
            >
              Release Notes
            </a>
          </div>
          {props.business_details && props.business_details.number && (
            <div className="item font-12 py-1 sbt-deep-color cursor-pointer">
              <a href={"/#/quick-setup"} className="sbt-deep-color">
                Get Started
              </a>
            </div>
          )}
          <div className="item font-12 py-1 sbt-deep-color cursor-pointer">
            <a
              href="http://doc.seerbit.com"
              target="_blank"
              className="sbt-deep-color"
            >
              API Documentation
            </a>
          </div>
          {props.business_details && props.business_details.number && (
            <div className="item font-12 py-1 mb-2 sbt-deep-color cursor-pointer">
              <a href={"/#/settings"} className="sbt-deep-color">
                Settings
              </a>
            </div>
          )}
        </div>
        <div className="title font-12 py-2 mb-2">Legal</div>
        <div className="items">
          <div className="item font-12 pb-2 sbt-deep-color cursor-pointer">
            <a
              href="https://seerbit.com/security"
              target="_blank"
              className="sbt-deep-color"
            >
              Licenses
            </a>
          </div>
          <div className="item font-12 py-1 sbt-deep-color cursor-pointer">
            <a
              href="https://seerbit.com/privacy"
              target="_blank"
              className="sbt-deep-color"
            >
              Privacy
            </a>
          </div>
          <div className="item font-12 py-1 sbt-deep-color cursor-pointer">
            <a
              href="https://seerbit.com/terms"
              target="_blank"
              className="sbt-deep-color"
            >
              Terms &amp; Condition
            </a>
          </div>
        </div>
        <div className="title font-12 py-4 font-weight-bold"></div>
        <div className="items absolute-bottom mb-2">
          <div
            className="item font-12 py-2 sbt-deep-color cursor-pointer"
            onClick={() => {
              AuthService.logout();
              window.location.href = "/";
            }}
          >
            Logout
          </div>
        </div>
      </div>
      {showAdd && (
        <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
          <AddBusiness
            close={() => setShowAdd(false)}
            business_details={props.business_details}
            countries={props.countries && props.countries.payload}
            industry_list={props.industry_list && props.industry_list.payload}
            addBusiness={props.addBusiness}
            processBusiness={processBusiness}
            setProcessBusiness={setProcessBusiness}
          />
        </Modal>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user_details: state.data.user_details,
  business_details: state.data.business_details,
  primary_user: state.data.business_details.primaryUser,
  location: state.data.location,
  business_key: state.data.business_key,
  business: state.data.business,
  user_permissions: state.data.user_permissions,
  industry_list: state.data.industry_list,
  countries: state.data.countries,
  white_label: state.data.white_label,
  error_details: state.data.error_details,
  wallet: state.data.wallet,
  wallets: state.data.wallets,
  new_business: state.data.new_business,
});

export default connect(mapStateToProps, {
  switchUserMode,
  saveKey,
  updateBusiness,
  switchMode,
  setBusiness,
  getCountries,
  getIndustries,
  addBusiness,
  getWalletTransaction,
  walletTopUp,
  clearState,
})(Header);
