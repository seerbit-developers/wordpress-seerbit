import React from "react";
import CardSetting from "./cardSetting";
import { useTransition, animated } from "react-spring";
import { withRouter } from "react-router";
import {useTranslation} from "react-i18next";

const SettingsMenu = (props) => {
    const [show, setShow] = React.useState(false);
    const { t } = useTranslation();
    const [menu] = React.useState(
        [
            {
                title: t('Personal Info'),
                description: t('Personal details about yourself and other basic data'),
                icon: 'person',
                route: 'account/user_profile'
            },
            {
                title: t('Business Info'),
                description: t('Business information, notification settings business address setup'),
                icon: 'business',
                route: 'account/business_details'
            },
            {
                title: t('Settlement Info'),
                description: t('Bank account details where settlement will be paid into'),
                icon: 'settlement',
                route: 'account/settlement_information'
            },
            {
                title: t('API keys'),
                description: t('Copy test and live api integration keys and view test credentials'),
                icon: 'api',
                route: 'account/api_keys'
            },
            {
                title: t('Checkout Config'),
                description: t('Configure payment channels for your checkout'),
                icon: 'checkout',
                route: 'account/checkout'
            },
            {
                title: t('Checkout Customisation'),
                description: t('Customize your checkout to the look and feel of your brand'),
                icon: 'customisation',
                route: 'account/customization'
            },
            {
                title: t('Checkout Ads'),
                description: t('Create, activate and deactivate adverts on your checkout modal'),
                icon: 'ads',
                route: 'account/checkout_adverts'
            },
            {
                title: t('Webhooks'),
                description: t('Configure Webhook notification URLs for your application'),
                icon: 'webhooks',
                route: 'account/webhooks'
            },
            {
                title: t('User Management'),
                description: t('Manage user roles and permission for team members'),
                icon: 'user',
                route: 'account/user_management'
            },
        ]
    );

    React.useEffect(() => {
        setShow(true)
    }, [])

    const goto = (route) => {
        // props.history.push(route)
        props.movetoSection(route)
    }

    return (
        <div className={`card__settings ${show ? 'card__settings--show' : ''}`}>
            {
                menu.map((item, index) =>
                    <CardSetting key={index} index={index} item={item} goto={goto}>
                    </CardSetting>
                )
            }

        </div>
    )
};

export default withRouter(SettingsMenu);
