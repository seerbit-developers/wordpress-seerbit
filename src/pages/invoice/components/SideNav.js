import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";

const SideNav = ({ setTab }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 120) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", () => handleScroll);
    };
  }, [handleScroll]);

  const { t } = useTranslation();
  let { pathname } = useLocation();

  return (
    <div className={`--nav`}>
      <div className={`container ${scrolled ? "scrolled" : ""}`}>
        <div className="header">
          <h4>{t("Invoice")}</h4>
        </div>
        <div className="-list-container">
          <ul className="-list">
            <li
              className={`-item ${
                pathname === "/invoice/overview" || pathname === "/invoice"
                  ? "active"
                  : ""
              }`}
              onClick={() => setTab("/invoice/overview")}
            >
              {t("Overview")}
            </li>
            <li
              className={`-item ${
                (pathname === "/invoice/invoices" || pathname === "/invoice/create" ) ? "active" : ""
              }`}
              onClick={() => setTab("/invoice/invoices")}
            >
              {t("Invoices")}
            </li>
            <li
              className={`-item -last ${
                pathname === "/invoice/customers" ? "active" : ""
              }`}
              onClick={() => setTab("/invoice/customers")}
            >
              {t("Customers")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

SideNav.propTypes = {
  setTab: PropTypes.func.isRequired,
  tab: PropTypes.func.string,
};
export default SideNav;
