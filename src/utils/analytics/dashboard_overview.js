/** @format */

import React from "react";
import { useSpring, animated } from "react-spring";
import { Card } from "react-bootstrap";
import { Can } from "../../modules/Can";
import { useTranslation } from "react-i18next";
function Overview({ business_analytics, business_details, loading }) {
  const { t } = useTranslation();
  function formatNumber(num) {
    return num && num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const props = useSpring({
    from: { opacity: 0, marginTop: -25, marginBottom: 25 },
    opacity: 1,
    marginTop: 0,
    marginBottom: 0,
  });

  return (
    <animated.div style={props}>
      <div className="sbt-transaction-overview">
        <div className="font-medium pl-1 py-3 font-20 text-black">
          {t('Quick Overview')}
        </div>
        {/* <Center> */}

        <Can access="FEE_SETUP">
          <div className="row">
            <div className="col-12" style={props}>
              <Card
                fluid
                className="my-2 sbt-border-success  cursor-pointer"
                onClick={() => (window.location.href = "#/payments/transactions")}
              >
                <Card.Body>
                  <Card.Title className="font-30 text-black">
                    <div className="d-flex flex-row">
                      <span className="payout-analytic">
                        {(business_analytics.nextPayout &&
                          business_analytics.nextPayout?.split(" ")[0]) ||
                          business_details.default_currency}{" "}
                      </span>
                      <span>
                        {(business_analytics.nextPayout &&
                          formatNumber(
                            business_analytics.nextPayout.split(" ")[1]
                          )) ||
                          formatNumber("0")}
                      </span>
                    </div>
                  </Card.Title>
                  <Card.Subtitle className="d-flex  justify-content-between font-12 text-mute">
                    <div>{t('Pending Payout')}</div>
                    {loading && (
                      <div className="text-muted font-italic">{t('Loading...')}</div>
                    )}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Can>

        <Can access="FEE_SETUP">
          <div className="row">
            <div className="col-12">
              <Card
                fluid
                className="my-2 sbt-border-success cursor-pointer"
                onClick={() => (window.location.href = "#/settlements")}
              >
                <Card.Body>
                  <Card.Title className="font-30 text-black">
                    <div className="d-flex flex-row">
                      <span className="payout-analytic">
                        {(business_analytics.lastPayout &&
                          business_analytics.lastPayout?.split(" ")[0]) ||
                          business_details.default_currency}{" "}
                      </span>
                      <span>
                        {(business_analytics.lastPayout &&
                          formatNumber(
                            business_analytics.lastPayout.split(" ")[1]
                          )) ||
                          formatNumber("0")}
                      </span>
                    </div>
                  </Card.Title>
                  <Card.Subtitle className="font-12 text-mute d-flex justify-content-between">
                    <div>{t('Last Payout')}</div>
                    {loading && (
                      <div className="text-muted font-italic">{t('Loading...')}</div>
                    )}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Can>

        <div className="row">
          <div className="col-12">
            <Card
              fluid
              className="my-2 sbt-border-success cursor-pointer"
              onClick={() => (window.location.href = "#/payments/transactions")}
            >
              <Card.Body>
                <Card.Title className="font-30 text-black">
                <div className="d-flex flex-row">
                      <span className="payout-analytic">
                        {(business_analytics.totalCollection &&
                          business_analytics.totalCollection?.split(" ")[0]) ||
                          business_details.default_currency}{" "}
                      </span>
                      <span>
                        {(business_analytics.totalCollection &&
                          formatNumber(
                            business_analytics.totalCollection.split(" ")[1]
                          )) ||
                          formatNumber("0")}
                      </span>
                    </div>


                  {/* {(business_analytics &&
                    formatNumber(business_analytics.totalCollection)) ||
                    formatNumber(`${business_details.default_currency} 0`)} */}
                </Card.Title>
                <Card.Subtitle className="font-12 text-mute d-flex justify-content-between">
                  <div>{t("Today's Collection")}</div>
                  {loading && (
                    <div className="text-muted font-italic">{t('Loading...')}</div>
                  )}
                </Card.Subtitle>
              </Card.Body>
            </Card>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Card
              fluid
              className="my-2 sbt-border-success cursor-pointer"
              // onClick={() => {}}
              onClick={() => (window.location.href = "#/payments/transactions")}
            >
              <Card.Body>
                <Card.Title className="font-30 text-black">
                  {(business_analytics && business_analytics.payVolume) || "0"}
                </Card.Title>
                <Card.Subtitle className="font-12 text-mute d-flex justify-content-between">
                  <div>{t("Today's Transaction Volume")}</div>
                  {loading && (
                    <div className="text-muted font-italic">{t('Loading...')}</div>
                  )}
                </Card.Subtitle>
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Card
              fluid
              className="my-2 sbt-border-success cursor-pointer"
              // onClick={() => {}}
              onClick={() => (window.location.href = "#/transactions/customers")}
            >
              <Card.Body>
                <Card.Title className="font-30 text-black">
                  {(business_analytics && business_analytics.customers) ||'0'}
                </Card.Title>
                <Card.Subtitle className="font-12 text-mute d-flex justify-content-between">
                  <div>{t('Customers')}</div>
                  {loading && (
                    <div className="text-muted font-italic">{t('Loading...')}</div>
                  )}
                </Card.Subtitle>
              </Card.Body>
            </Card>
          </div>
        </div>

        <Can access="FEE_SETUP">
          <div className="row">
            <div className="col-12">
              <Card
                fluid
                className="my-2 border-red cursor-pointer"
                border="warning"
                onClick={() => (window.location.href = "#/disputes")}
              >
                <Card.Body>
                  <Card.Title className="font-30 text-black">
                    {(business_analytics &&
                      business_analytics.pendingDisputes) ||
                      "0"}
                  </Card.Title>
                  <Card.Subtitle className="font-12 text-mute d-flex justify-content-between">
                    <div>{t('Unanswered Disputes')}</div>
                    {loading && (
                      <div className="text-muted font-italic">{t('Loading...')}</div>
                    )}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Can>

        {/* </Center> */}
      </div>
    </animated.div>
  );
}

export default Overview;
