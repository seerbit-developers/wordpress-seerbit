import React, { useState, useEffect } from "react";
import { navigationMenuConfig } from "config/menuConfig";
import { Nav } from "react-bootstrap";
import { TwoLevelMenu } from "./twoLevelsMenu";
import Tour from "reactour";
import { steps } from "modules/tour-guide";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";

export const NavigationMenu = ({
  business_details,
  startTour,
  setStartTour,
}) => {
  const [isTourOpen, setTour] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    setTimeout(() => {
      window.addEventListener(
        "load",
        setTour(
          !localStorage.getItem("noTour") &&
            window.innerWidth >= 992 &&
            business_details &&
            business_details.setting
        )
      );
    }, 2000);
  }, []);

  useEffect(() => {
    startTour === true && setTour(true);
  }, [startTour]);

  let { pathname } = useLocation();

  const isPageActive = (p) => {
    // console.log('p', p)
    // console.log('pathname', pathname)
    if (pathname === "/" && p === "home") return true;
    pathname = pathname.replace("/", "");
    if (pathname === "/" && p === "home") return true;
    else if (
      (pathname === "transactions" ||
        pathname === "transactionscustomers" ||
        pathname === "transactionspayments" ||
        pathname === "paymentlinks" ||
        pathname === "pockets" ||
        pathname === "transfer" ||
        pathname === "payment") &&
      (p === "transactions" ||
        p === "pockets" ||
        p === "transfer" ||
        p === "payment")
    )
      return true;
    else if (
      (pathname === "finance" ||
        pathname === "settlements" ||
        pathname === "split-settlements" ||
        pathname === "refunds" ||
        pathname === "disputes") &&
      (p === "finance" ||
        p === "settlements" ||
        p === "split-settlements" ||
        p === "refunds" ||
        p === "disputes")
    )
      return true;
    else if (
      (pathname === "recurring" ||
        pathname === "subscriptions" ||
        pathname === "plans" ||
        pathname === "subscribers") &&
      (p === "recurring" ||
        p === "subscriptions" ||
        p === "plans" ||
        p === "subscribers")
    )
      return true;
    else if (pathname === "invoice" || p === "invoice") return true;
    else if (
      (pathname === "pocket" ||
        pathname === "pocketoverview" ||
        pathname === "pocketsuboverview" ||
        pathname === "pocketsubpockets" ||
        pathname === "pocketsubbalance" ||
        pathname === "pockettransfers" ||
        pathname === "pocketbalance") &&
      p === "pocket"
    )
      return true;
    else if (
      (pathname.indexOf("frontstore") !== -1 ||
        pathname === "product-categories" ||
        pathname === "products" ||
        pathname === "productscategories") &&
      (p === "store" ||
        p === "products" ||
        p === "product-categories" ||
        p === "productscategories")
    )
      return true;
    else if (
      (pathname.indexOf("customerspayment") !== -1 ||
        pathname.indexOf("customerspocket") !== -1) &&
      p.indexOf("customers") !== -1
    )
      return true;
    else if (
      pathname.indexOf("account") !== -1 &&
      (p === "account" || p === "settings")
    )
      return true;
  };

  const isSubPageActive = (p) => {
    pathname = pathname.replace("/", "");
    if (pathname === p) return true;
  };
  return (
    <>
      {navigationMenuConfig.map((menu, i) => (
        <li key={i}>
          <Nav.Link
            id={menu.id}
            href={"/#" + menu.navLink === "" ? pathname : menu.navLink}
            className={`sbt nav-item mr-3 ${
              isPageActive(menu.id) ? "active" : ""
            }`}
          >
            {t(menu.title)}
          </Nav.Link>
          <React.Fragment>
            {menu.hasOwnProperty("children") && menu.hasChildren ? (
              menu.hasSections ? (
                <div className="sub-menu-item__container">
                  <TwoLevelMenu />
                </div>
              ) : (
                <div className="sub-menu-item__container--small">
                  {menu.children.map((childMenu, i) => (
                    <Nav.Link
                      id={childMenu.id}
                      key={i}
                      href={"/#" + childMenu.navLink}
                      className={`sbt nav-item mr-3 ${
                        isSubPageActive(childMenu.id) ? "active" : ""
                      }`}
                    >
                      {t(childMenu.title)}
                    </Nav.Link>
                  ))}
                </div>
              )
            ) : null}
          </React.Fragment>
        </li>
      ))}

      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => {
          setTour(false);
          setStartTour(false);
        }}
        closeWithMask
        showButtons
        nextButton={<span>{t("Next")}</span>}
        prevButton={<span>{t("Previous")}</span>}
        onAfterOpen={(target) => {
          document.body.style.overflowY = "hidden";
        }}
        onBeforeClose={(target) => {
          localStorage.setItem("noTour", true);
          document.body.style.overflowY = "auto";
        }}
      />
    </>
  );
};
