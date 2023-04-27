
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
import "primeicons/primeicons.css";
import "assets/styles/custom.css";
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
    if (
      newProps.loggedin !== undefined &&
      newProps.loggedin.length > 100 &&
      (newProps.location === "signup" || newProps.location === "join-team")
    ) {
      window.location.href = localizer.path_url + "#/confirm-email";
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
      {
        window.location.href = localizer.path_url + "#/auth/login";
      }
      else {
        window.location.href = localizer.path_url + "#/quick-setup";
    //    window.location.reload();
      }
    }
  }

  _onIdle(e) {
    AuthService.logout();
    window.location.href = localizer.path_url
  }

  baseUrl(){
    try {
      return localizer.path_url
    }catch (e) {
      return window.origin
    }
  }
  render() {
    if (
        window.location.hash === "#" &&
        !AuthService.loggedIn() &&
        this.props.location !== "personalInformation"
    ) {
      window.location.href = this.baseUrl() + "#/auth/login";
    }
    if (
        window.location.hash === "#/business-list" &&
        this.props.business_details &&
        !isEmpty(this.props.business_details.setting) &&
        this.props.location !== "signup"
    ) {
      if (
          this.props.business_details &&
          this.props.business_details.status !== "NEW_BUSINESS"
      )

        window.location.href = this.baseUrl();
      else {
        if (this.props.business_details?.otherInfo?.progressStatus === 4){
          window.location.href = this.baseUrl();
        }
        else{
          window.location.href = this.baseUrl()  + "#/quick-setup";
     //     window.location.reload();
        }

      }
    }
    return (
      <React.Fragment>

            {AuthService.loggedIn() &&
            this.props.business_details && this.props.business_details.setting && (
                <>
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
