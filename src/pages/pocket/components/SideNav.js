import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
const SideNav = ({ setTab, tab }) => {
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
          <h4>{t("Pocket")}</h4>
        </div>
        <div className="-list-container">
          <ul className="-list">
            <li
              className={`-item ${
                pathname === "/pocket/overview" || pathname === "/pocket"
                  ? "active"
                  : ""
              }`}
              onClick={() => setTab("/pocket/overview")}
            >
              {t("Overview")}
            </li>
            <li
              className={`-item ${
                pathname === "/pocket/balance" ? "active" : ""
              }`}
              onClick={() => setTab("/pocket/balance")}
            >
              {t("Balance")}
            </li>
            <li
              className={`-item -last ${
                pathname === "/pocket/transfers" ? "active" : ""
              }`}
              onClick={() => setTab("/pocket/transfers")}
            >
              {t("Transfers")}
            </li>
            <li className={`-item -header`}>
              <span>{t("Sub Pockets")}</span>
            </li>
            <li
              className={`-item ${
                pathname === "/pocket/sub/overview" ? "active" : ""
              }`}
              onClick={() => setTab("/pocket/sub/overview")}
            >
              {t("Overview")}
            </li>
            <li
              className={`-item ${
                pathname === "/pocket/sub/pockets" ? "active" : ""
              }`}
              onClick={() => setTab("/pocket/sub/pockets")}
            >
              {t("Sub Pockets")}
            </li>
            <li
              className={`-item ${
                pathname === "/pocket/sub/balance" ? "active" : ""
              }`}
              onClick={() => setTab("/pocket/sub/balance")}
            >
              {t("Balance")}
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
