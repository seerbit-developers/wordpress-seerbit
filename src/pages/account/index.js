import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "components/pageHeader";
// import BusinessProfile from "./components/businessDetails";
import SettingsMenu from "./components/settingsMenu";
import BreadCrumbs from "components/breadCrumbs";
import UserManagement from "./users_management";
import {
  withRouter,
  Switch,
  Route,
  useRouteMatch,
  useParams,
} from "react-router";
import { appHooks } from "../../hooks";
import UserProfile from "./profile";
import BusinessSettings from "./business_settings";
import CheckoutConfig from "./checkout_config";
import Webhooks from "./webhooks";
import Customization from "./customization";
import ApiKeys from "./api_keys";
import SettlementInformation from "./settlement_information";
import CheckoutAds from "./checkout_ads";
import LeftChevron from "../../assets/images/svg/leftChevron";
import {useTranslation} from "react-i18next";

const AccountSettingsPage = ({ history, location }) => {
  const query = appHooks.useQuery();
  let { path, url } = useRouteMatch();
    const { t } = useTranslation();
  const [page, setPage] = React.useState("account_settings");
  React.useEffect(() => {
    const section = query.get("section");
    if (section) {
      setPage(section);
    } else {
      setPage("account_settings");
    }
  }, []);

  React.useEffect(() => {
    const section = query.get("section");
    if (section) {
      setPage(section);
    } else {
      setPage("account_settings");
    }
  }, [location]);

  const changePage = (page) => {
    history.push(page);
  };

  return (
    <div className="container__standard--config">
      <Switch>
        <Route exact path={path}>
          <PageHeader title="Business Account Settings" />
          {/*<BusinessProfile changePage={setPage} />*/}
          <SettingsMenu movetoSection={changePage} />
        </Route>
        <Route path={`${path}/:section`}>
          <Link to="/account" className="backk pb-5">
            <LeftChevron /> {t('return to settings')}
          </Link>
          <PageSection />
        </Route>
      </Switch>
    </div>
  );
};
const PageSection = () => {
  let { section } = useParams();
    const { t } = useTranslation();
  return section === "user_management" ? (
    <React.Fragment>
      <BreadCrumbs />
      <div className="title-page">{t('User Management')}</div>
      <UserManagement />
    </React.Fragment>
  ) : section === "user_profile" ? (
    <React.Fragment>
      <BreadCrumbs />
      <UserProfile />
    </React.Fragment>
  ) : section === "business_details" ? (
    <React.Fragment>
      <BreadCrumbs />
      <div className="title-page">{t('Business Info')}</div>
      <BusinessSettings />
    </React.Fragment>
  ) : section === "checkout" ? (
    <React.Fragment>
      <BreadCrumbs />
      <div className="title-page">{t('Checkout Configuration')}</div>
      <CheckoutConfig />
    </React.Fragment>
  ) : section === "webhooks" ? (
    <React.Fragment>
      <BreadCrumbs />
      <div className="title-page">{t('Webhooks')}</div>
      <Webhooks />
    </React.Fragment>
  ) : section === "customization" ? (
    <React.Fragment>
      <BreadCrumbs />
      <div className="title-page">{t('Checkout Customization')}</div>
      <Customization />
    </React.Fragment>
  ) : section === "api_keys" ? (
    <React.Fragment>
      <BreadCrumbs />
      <div className="title-page">{t('API Keys')}</div>
      <ApiKeys />
    </React.Fragment>
  ) : section === "settlement_information" ? (
    <React.Fragment>
      <BreadCrumbs />
      <div className="title-page">{t('Settlement Information')}</div>
      <SettlementInformation />
    </React.Fragment>
  ) : section === "checkout_adverts" ? (
    <React.Fragment>
      <BreadCrumbs />
      <div className="title-page">{t('Checkout Adverts')}</div>
      <CheckoutAds />
    </React.Fragment>
  ) : null;
};

export default withRouter(AccountSettingsPage);
