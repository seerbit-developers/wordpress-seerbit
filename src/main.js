
import React from "react";
import { connect } from "react-redux";
import AuthService from "./utils/auth";
import Header from "./components/header";
import ConfigRouters from "./Routes";
import IdleTimer from "react-idle-timer";
import "assets/styles/include.css";
import "assets/styles/style.css";
import "assets/styles/toggle.css";
import "assets/styles/responsive.css";
import "assets/styles/custom.css";
import "primeicons/primeicons.css";
import Brand from "utils/strings/brand.json";
import { hasAccess } from "modules/Can";
import {
  filterTransactions, getBankList, getBranches,
  getBusinessAnalysis, getBusinessUsers, getCountries,
  getCustomers,
  getIndustries, getKYC, getPayouts,
  getPermissions,
  getRefunds, getRoles, getSampleTransactions, getTransactionRange,
  getTransactions,
  setWhiteLabel
} from "actions/postActions";
import _, {isEmpty} from "lodash";
import BlockUI from "./components/blockUi";
import { Toaster } from 'react-hot-toast';
class Init extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      selectedIndex: 0,
      ready: false,
      pendingKyc: false,
      pendingKycDocs: [],
    };
    this.idleTimer = null;

    this.onIdle = this._onIdle.bind(this);
  }

  componentDidMount() {
    // loadProgressBar();
    // this.setState({ user_details: this.props.user_details });
    let domain = window.origin ? window.origin.split(".")[1] : undefined;
    this.props.setWhiteLabel(
      Brand[
        `${
          domain === undefined
            ? "default"
            : domain === "seerbit"
            ? "default"
            : domain
        }`
      ]
    );
    window.onscroll = function() {triggerHeaderSticky()};
    // Get the header
    var header = document.getElementById("top_nav");

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
    function triggerHeaderSticky() {
    }
if (AuthService.loggedIn() && this.props.business_details ) {
  if (this.props.business_details.setting) {
  if (this.props.permissions) {
    if (Array.isArray(this.props.permissions)) {
      if (this.props.permissions.length === 0) {
        this.props.getPermissions();
      }
    }
  }
  //load industries
  if (this.props.industry_list) {
    if (Array.isArray(this.props.industry_list)) {
      if (this.props.industry_list.length === 0) {
        this.props.getIndustries();
      }
    }
  }

  //load bank list
  if (this.props.bank_list) {
    if (Array.isArray(this.props.bank_list)) {
      if (this.props.bank_list.length === 0) {
        this.props.getBankList();
      }
    }
  }

  //load roles
  if (this.props.roles) {
    if (Array.isArray(this.props.roles)) {
      if (this.props.roles.length === 0) {
        this.props.getRoles();
      }
    }
  }

  //load kyc
  if (this.props.kyc) {
    if (_.isEmpty(this.props.kyc)) {
      this.props.getKYC();
    } else {
      // const pendingKYC = this.props.kyc.payload.filter(item=>item.status !== "SUBMITTED")
      // this.setState({pendingKycDocs:pendingKYC})
    }
  }

  //load countries
  if (_.isNull(this.props.countries)) {
    this.props.getCountries();
  }
}
}

  }

  UNSAFE_componentWillReceiveProps(newProps) {
    // if (newProps.hasOwnProperty("business_details")) {
    //   if (!_.isEmpty(newProps.business_details)) {
    //     this.setState({ ready: true });
    //   }
    // }

    if (
      newProps.loggedin !== undefined &&
      newProps.loggedin.length > 100 &&
      (newProps.location === "signup" || newProps.location === "join-team")
    ) {
      window.location.href = window.origin + "/#/confirm-email";
      //window.location.reload();
    }
    if (
      newProps.loggedin !== undefined &&
      newProps.loggedin.length > 100 &&
      newProps.location === "login"
    ) {
      if (
        !hasAccess("MANAGE_MERCHANT_PROFILE", newProps.user_permissions) ||
        newProps.business_details.status !== "NEW_BUSINESS"
      )
        window.location.href = "/";
      else {
        window.location.href = window.origin + "/#/quick-setup";
        window.location.reload();
      }
    }
  }

  // componentDidCatch(err, info_data) {
  //   const {
  //     loggly: { error, providers, info },
  //   } = this.props;
  //   error(err);
  //   info(info_data);
  // }
  // _onAction(e) {
  //   console.log("user did something", e);
  // }

  // _onActive(e) {
  //   console.log("user is active", e);
  //   console.log("time remaining", this.idleTimer.getRemainingTime());
  // }

  _onIdle(e) {

    AuthService.logout();
    window.location.reload();
  }


  render() {
    return (
      <React.Fragment>
        {/*<div id="pending_note">*/}
        {/*  <p>Pending KYC Documents</p>*/}
        {/*  <ul>{*/}
        {/*    this.state.pendingKycDocs.map(item=><li>{item.kycDocumentName}</li>)*/}
        {/*  }</ul>*/}
        {/*</div>*/}
        {/*{!this.state.ready && !AuthService.loggedIn() ? (*/}
        {/*  <ConfigRouters business_details={false} />*/}
        {/*) : !this.state.ready && AuthService.loggedIn() ? (*/}
        {/*  <h1>Loading...</h1>*/}
        {/*) : (*/}
        {/*  <>*/}



            {AuthService.loggedIn() &&
            this.props.business_details && this.props.business_details.setting && (
                <>
                  {/*<LoadingBar*/}
                  {/*  color="#f11946"*/}
                  {/*  onRef={(ref) => (this.LoadingBar = ref)}*/}
                  {/*  className="position-absolute load-range"*/}
                  {/*/>*/}
                  <BlockUI content={<h5>{this.props.block_ui && this.props.block_ui.message}</h5>} show={this.props.block_ui && this.props.block_ui.status}/>
                  <IdleTimer
                    ref={(ref) => {
                      this.idleTimer = ref;
                    }}
                    element={document}
                    onIdle={this.onIdle}
                    debounce={250}
                    timeout={1000 * 60 * 10}
                  />

                  <Header data={this.props} />
                  <ConfigRouters business_details={true} />
                </>
              )}

        {(!AuthService.loggedIn() ||
            this.props.business_details && !this.props.business_details.setting) && (
            <>
              {AuthService.loggedIn() && <Header data={this.props} />}
              <ConfigRouters business_details={false} />
            </>
        )}
        <Toaster />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user_details: state.data.user_details,
  user_permissions: state.data.user_permissions,
  loggedin: state.data.loggedin,
  location: state.data.location,
  business_details: state.data.business_details,
  white_label: state.data.white_label,
  permissions: state.data.permissions,
  roles: state.data.roles,
  bank_list: state.data.bank_list,
  industry_list: state.data.industry_list,
  kyc: state.data.kyc,
  countries: state.data.countries,
  block_ui: state.data.block_ui,
});

export default connect(mapStateToProps, {
  setWhiteLabel,
  getPermissions,
  getIndustries,
  getTransactions,
  getCustomers,
  getRefunds,
  getPayouts,
  getRoles,
  getBusinessAnalysis,
  getSampleTransactions,
  getTransactionRange,
  filterTransactions,
  getBusinessUsers,
  getCountries,
  getBranches,
  getBankList,
  getKYC
})(Init);
