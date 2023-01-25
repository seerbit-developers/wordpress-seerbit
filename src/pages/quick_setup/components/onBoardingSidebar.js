import React from "react";
import Wordpress from "../../../assets/images/svg/wordpress.png";
import Magento from "../../../assets/images/svg/magento.png";
import Wix from "../../../assets/images/svg/wix.png";


import ApiKeys from "./apiKeys";
import {useTranslation} from "react-i18next";
const OnBoardingSidebar = ({
                               setting,
                               test_private_key,
                               live_private_key,
                               test_public_key,
                               live_public_key

                           })=>{
    const { t } = useTranslation();

    return (
        <div className="onboarding__sidebar">
            <ul className="cursor-pointer no-link-style-parent">
                <li className="mb-3 font-weight-bold">{t('In-app integrations')}</li>
                <li className="mb-3"><a href="https://doc.seerbit.com/getstarted" target="_blank">{t('Get Started')}</a></li>
                <li className="mb-3"><a href="https://doc.seerbit.com/integration" target="_blank">{t('Accept Card Payments')}</a></li>
                <li className="mb-3"><a href="https://doc.seerbit.com/overview-1" target="_blank">{t('Payment Methods')}</a></li>
                <li className="mb-3"><a href="https://doc.seerbit.com/payment-features" target="_blank">{t('Payment Features')}</a></li>
                <li className="mb-3"><a href="https://doc.seerbit.com/libraries" target="_blank">{t('Libraries')}</a></li>
                <li className="mb-3"><a href="https://doc.seerbit.com/webhook-1" target="_blank">{t('Notifications')}</a></li>
            </ul>
            <div className="row mb-3">
                <div className="col-12 p-3">
                    <h3 className="seerbit--section-title">{t('E-commerce Plugins')}</h3>
                </div>
                <div className="col-12 d-flex justify-content-between" style={{ marginTop: "-32px", marginLeft: "-7px" }}>
                    <div className="mr-1 m-0">
                        <img src={Wordpress} height="100" />
                    </div>
                    <div className="mr-1">
                        <img src={Magento} height="100" />
                    </div>
                    <div className="mr-1">
                        <img src={Wix} height="100" />
                    </div>
                </div>
            </div>
            <div className="">
                <span className="test-title">{t('Your Test keys')}</span>
                <div className="text mt-1">
                    {t('Quick start with your test keys.\n' +
                        'Test keys are also available in settings(API Keys).')}
                </div>
                <ApiKeys
                    setting={setting}
                    test_private_key={test_private_key}
                    live_private_key={live_private_key}
                    test_public_key={test_public_key}
                    live_public_key={live_public_key}
                />
            </div>
        </div>
    )
}

export default OnBoardingSidebar
