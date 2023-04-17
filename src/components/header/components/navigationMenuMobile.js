import React from "react";
import HamburgerIcon from "assets/images/svg/hamburgerIcon";
import { navigationMenuConfig } from "../../../config/menuConfig";
import DropdownSelect from "components/dropdown-select/dropdown.select";
import { useHistory, useLocation } from "react-router";
import AppToggle from "../../toggle";
import CloseSvg from "../../../assets/images/svg/closeSvg.svg";
import Button from "../../button";
import AuthService from "../../../utils/auth";
import LogoutIcon from "../../../assets/images/svg/logoutIcon";
import {useTranslation} from "react-i18next";
import {CanAccess} from "../../../modules/Can";

export const NavigationMenuMobile = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [page, setPage] = React.useState("Home");
  const { t } = useTranslation();
  let { pathname } = useLocation();
  const history = useHistory();
  const onSwitchBusiness = (biz) => {
    const BizIndex = props.businessList.findIndex((item) => item.value === biz);
    props.switchBusiness(BizIndex, biz);
  };

  React.useEffect(() => {
    if (isOpen) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (pathname === "/") setPage("Home");
    else if (pathname.indexOf("/transactions") !== -1) setPage("Payments");
    else if (pathname.indexOf("/branches") !== -1) setPage("Branch Payments");
    else if (pathname.indexOf("/customer-pockets") !== -1)
      setPage("Customer Pockets");
    else if (pathname.indexOf("/pockets") !== -1) setPage("Pockets");
    else if (pathname.indexOf("/transfer") !== -1) setPage("Transfers");
    else if (pathname.indexOf("/payment") !== -1) setPage("Payment Link");
    else if (pathname.indexOf("/settlements") !== -1) setPage("Settlements");
    else if (pathname.indexOf("/refunds") !== -1) setPage("Refunds");
    else if (pathname.indexOf("/disputes") !== -1) setPage("Disputes");
    else if (pathname.indexOf("/products") !== -1) setPage("Products");
    else if (pathname.indexOf("/product-categories") !== -1)
      setPage("Product Categories");
    else if (pathname.indexOf("/account") !== -1) setPage("Account Settings");
  }, [pathname]);

  const onSwitchBusinessMode = () => {
    props.toggleMode();
  };

  return (
    <nav className="navigation-menu--mobile-container" role="navigation">
      <div className="header">
        <span>
          <img
              src="https://res.cloudinary.com/dpejkbof5/image/upload/v1622721401/favicon_abgbto.png"
              alt="seerbit_logo"
              className="cursor-pointer"
              style={{ width: 20, height: 20 }}
              onClick={() => history.push("/")}
          />
        </span>
        <span>{page}</span>
        <HamburgerIcon
            className="cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <nav
        className={`mobile__nav ${isOpen ? "mobile__nav--open" : ""}`}
        role="navigation"
      >
        <div className="header p-3">
        <span style={{ flex:5 }}>
          <img
              src="https://res.cloudinary.com/dpejkbof5/image/upload/v1622721401/favicon_abgbto.png"
              alt="seerbit_logo"
              className="cursor-pointer"
              style={{ width: 20, height: 20 }}
              onClick={() => history.push("/")}
          />
        </span>
          <span style={{flex:1, textAlign:'right'}}
                className="cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}>
            <img src={CloseSvg}
            />
          </span>

        </div>
        <div className="card-basic mt-4 bg-white">
          <h5 className="title">{t('Business Switch')}</h5>
          <DropdownSelect
            containerClass="form__control--full"
            data={props.businessList ? props.businessList : []}
            defaultValue=""
            id="business_list"
            value={props.business ? props.business.value : null}
            as={"div"}
            onChange={({ value }) => {
              onSwitchBusiness(value);
            }}
          />
        </div>

        {props && props.business_number && (
          <div className="d-flex justify-content-between mt-5">
            {/* <Button
              type="white"
              size="sm"
              full
              className="me-2"
              style={{ width: "90%" }}
            > */}
            <div
              className="d-flex justify-content-between align-items-center ms-12"
              style={{ lineHeight: "normal", marginLeft: "18px" }}
            >
              <AppToggle
                active={props.mode}
                onChange={onSwitchBusinessMode}
                activeClass={"config-active"}
              />
              <span className="" style={{ marginLeft: "6px" }}>
                {props.mode ? t("Live Mode") : t("Test Mode")}
              </span>
            </div>
            {/* </Button> */}
          </div>
        )}
        <ul
          className="mobile__nav__menu"
          id="menu"
          tabIndex="-1"
          aria-label="main navigation"
        >
          {navigationMenuConfig.map((menu, i) => (
            <li className="mobile__nav__item" key={i}>
              <a
                href={"/#" + menu.navLink}
                onClick={() => setIsOpen(false)}
                className={`mobile__nav__link ${
                  !menu.hasOwnProperty("children") ? "text__color--dark" : ""
                }`}
              >
                {menu.title}
              </a>
              {menu.hasOwnProperty("children") ? (
                !menu.hasSections ? (
                  <ul
                    className="mobile__nav__menu__child"
                    id="menu"
                    tabIndex="-1"
                    aria-label="main navigation"
                  >
                    {menu.children.map((childMenu, i) => (
                        CanAccess(menu.permissions) ?
                      <li className="mobile__nav__item" key={i}>
                        <a
                          href={"/#" + childMenu.navLink}
                          onClick={() => setIsOpen(false)}
                          className="mobile__nav__link__child"
                        >
                          {t(childMenu.title)}
                        </a>
                      </li> : null
                    ))}
                  </ul>
                ) : (
                  <ul
                    className="mobile__nav__menu__child"
                    id="menu"
                    tabIndex="-1"
                    aria-label="main navigation"
                  >
                    {menu.children.map((childMenu, i) =>
                      childMenu.children.map((childMenuSub, i) => (
                               CanAccess(childMenuSub.permissions) ?
                        <li className="mobile__nav__item" key={i}>
                          <a
                            href={"/#" + childMenuSub.navLink}
                            onClick={() => setIsOpen(false)}
                            className="mobile__nav__link__child"
                          >
                            {t(childMenuSub.title)}
                          </a>
                        </li>
                                  : null
                      ))
                    )}
                  </ul>
                )
              ) : null}
            </li>
          ))}
        </ul>
        <div className="mt-2 pb-5">
          <Button
              type="white"
              size="sm"
              textColor="#FFF"
              full={true}
              onClick={() => {
                AuthService.logout();
                window.location.href = "/";
              }}
          >
            <LogoutIcon /> <span>{t('Sign Out')}</span>
          </Button>
        </div>
      </nav>
    </nav>
  );
};
