import React from "react";
import InvoiceOverview from "./contents/InvoiceOverview";
import Invoices from "./contents/invoices";
import Customers from "./contents/customers";
import CreateInvoice from "./contents/createInvoice";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router";

const Content = ({ setTab }) => {
  return (
    <Switch>
      <Route
        path={`/invoice`}
        exact
        render={() => <InvoiceOverview setTab={setTab} />}
      />
      <Route
        path={`/invoice/overview`}
        exact
        render={() => <InvoiceOverview setTab={setTab} />}
      />
      <Route
        path={`/invoice/invoices`}
        exact
        render={() => <Invoices setTab={setTab} />}
      />
      <Route
        path={`/invoice/create`}
        exact
        render={() => <CreateInvoice setTab={setTab} />}
      />
      <Route
        path={`/invoice/customers`}
        exact
        render={() => <Customers setTab={setTab} />}
      />
    </Switch>
  );
};

Content.propTypes = {
  tab: PropTypes.string,
  fundPocket: PropTypes.func.isRequired,
  setTab: PropTypes.func.isRequired,
};
export default Content;
