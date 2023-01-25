import React from "react";
import {Nav} from "react-bootstrap";
import {Can} from "modules/Can";
import {useTranslation} from "react-i18next";


export const TwoLevelMenu = ()=>{
    const { t } = useTranslation();
    return (
        <div className="divide-transaction">
            <div className="row">
                <div className="col-6 px-0">
                    <div className="sub-menu__section--left">
                        <div className="title font-12 text-muted">{t('Views')}</div>
                        <Nav.Link href="/#/transactions/payments" className="d-block">
                            {t('Payments')}
                        </Nav.Link>
                        <Nav.Link href="/#/transactions/customers" className="d-block">
                            {t('Customers')}
                        </Nav.Link>
                            <Can access={'ACCESS_BRANCHES'}>
                            <Nav.Link href="/#/transactions/branches" className="d-block">
                                {t('Branch Transactions')}
                            </Nav.Link>
                            </Can>
                        {/*<Nav.Link href="/#/customer-pockets" className=" d-block">*/}
                        {/*    Pocket Customers*/}
                        {/*</Nav.Link>*/}
                    </div>
                </div>
                <div className="col-6 px-0 sbt dropdown-bg-2">
                    <div className="sub-menu__section--right">
                        <div className="title font-12 text-muted">{t('Actions')}</div>
                        {/*<Nav.Link href="/#/pockets" className="d-block">*/}
                        {/*    Fund Pocket*/}
                        {/*</Nav.Link>*/}
                        {/*<Nav.Link href="/#/transfer" className="d-block">*/}
                        {/*    Transfer Fund*/}
                        {/*</Nav.Link>*/}
                        <Nav.Link href="/#/payment/links" className="d-block" title={'Create links for your customers to make direct payments to your Business'}>
                            {t('Payment Links')}
                        </Nav.Link>
                    </div>
                </div>
                {/* <div className="col-4 px-0 sbt dropdown-bg-2">
                    <div className="sub-menu__section--right"> */}
                        {/* <div className="title font-12 text-muted">{t('POS')}</div> */}
                        {/*<Nav.Link href="/#/pockets" className="d-block">*/}
                        {/*    Fund Pocket*/}
                        {/*</Nav.Link>*/}
                        {/*<Nav.Link href="/#/transfer" className="d-block">*/}
                        {/*    Transfer Fund*/}
                        {/*</Nav.Link>*/}
                        {/* <Nav.Link href="/#/transactions/pos" className="d-block" title={''}>
                            {t('Terminals')}
                        </Nav.Link> */}
                    {/* </div>
                </div> */}
            </div>
        </div>
    )
}
