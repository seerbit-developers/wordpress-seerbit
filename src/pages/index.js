/** @format */

import React from "react";
import { connect } from "react-redux";
import Dashboard from "./dashboard";
import {
  getPermissions,
  getIndustries,
  getTransactions,
  getCustomers,
  getRefunds,
  getPayouts,
  getRoles,
  getBusinessAnalysis,
  getBranches,
  getSampleTransactions,
  getTransactionRange,
  filterTransactions,
  getBusinessUsers,
  getBankList,
  getCountries,
  getKYC
} from "../actions/postActions";
class Renderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  componentDidMount() {
    this.setState({ loading: true });
  }

  handleLoading = () => {
    this.setState({ loading: false });
  };

  render() {
    const { loading } = this.state;
    return <Dashboard loading={loading} handleLoading={this.handleLoading} />;
  }
}

const mapStateToProps = (state) => ({
  user_details: state.data.user_details,
  location: state.data.location,
  permissions: state.data.permissions,
  roles: state.data.roles,
  bank_list: state.data.bank_list,
  industry_list: state.data.industry_list,
  kyc: state.data.kyc,
  countries: state.data.countries,
});

export default connect(mapStateToProps, {
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
})(Renderer);
