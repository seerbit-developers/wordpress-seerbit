import React, {Fragment} from 'react';
import {t} from "i18next";

function CardDetailsView({props}) {
    const banks = [{"name":"9 Payment Service Bank","value":"9"},{"name":"Access Bank Plc","value":"Access"},{"name":"Citibank Nigeria Limited","value":"Citibank"},{"name":"Coronation Merchant Bank","value":"Coronation"},{"name":"Ecobank Nigeria Plc","value":"Ecobank"},{"name":"FBNQuest Merchant Bank","value":"FBNQuest"},{"name":"Fidelity Bank Plc","value":"Fidelity"},{"name":"First Bank of Nigeria Limited","value":"First Bank"},{"name":"First City Monument Bank Plc","value":"Monument"},{"name":"FSDH Merchant Bank","value":"FSDH"},{"name":"Globus Bank","value":"Globus"},{"name":"Guaranty Trust Bank Plc","value":"Guaranty"},{"name":"Heritage Banking Company Limited","value":"Heritage"},{"name":"Jaiz Bank Plc","value":"Jaiz "},{"name":"Keystone Bank Limited","value":"Keystone"},{"name":"Nova Merchant Bank","value":"Nova"},{"name":"Parallex Bank ","value":"Parallex"},{"name":"Polaris Bank Limited","value":"Polaris"},{"name":"Providus Bank","value":"Providus"},{"name":"Rand Merchant Bank","value":"Rand"},{"name":"Stanbic IBTC Bank Plc","value":"Stanbic"},{"name":"Standard Chartered","value":"Chartered"},{"name":"Sterling Bank Plc","value":"Sterling"},{"name":"SunTrust Bank Nigeria Limited","value":"SunTrust"},{"name":"Union Bank of Nigeria Plc","value":"Union"},{"name":"United Bank for Africa Plc","value":"United"},{"name":"Unity Bank Plc","value":"Unity"},{"name":"VFD Microfinance Bank","value":"VFD"},{"name":"Wema Bank Plc","value":"Wema"},{"name":"Zenith Bank Plc","value":"Zenith"}];

    const getBank = (name) => {
      try {
          if (name) {
              const g = banks.find(item => {
                  const s = name.toLocaleLowerCase().indexOf(item.value.toLocaleLowerCase())
                  return s > -1
              })
              if (g) {
                  return g.name
              } else {
                  return name
              }
          }
          return 'NA';
      }catch (e) {
          return 'NA'
      }
    }
    return (
        <Fragment>
                <div className="text-body font-14 py-2 mr-5">
                    <div className="label" style={{ color: "#676767" }}>{t('Bank Name')} </div>
                    <div className="trans--detail mt-2">
                        {/*{props?.cardTransDetails*/}
                        {/*    ?.cardName}*/}
                        {getBank(props?.cardTransDetails
                            ?.cardName)}
                    </div>
                </div>
        </Fragment>
    );
}

function CardDetailsExpiryView({props}) {
    return (
        <Fragment>
            <div className="text-body font-14 py-2 mr-5">
                <div className="label" style={{ color: "#676767" }}>{t('Expiry')} </div>
                <div className="trans--detail mt-2">
                    {props?.cardExpiryMonth} / {props?.cardExpiryYear}
                </div>
            </div>
        </Fragment>
    );
}

function CardDetails({props}) {
    return (
        props?.analytics?.channel?.toLocaleLowerCase() === 'card'  ? <CardDetailsView props={props} /> : null
    );
}

function CardDetailsExpiry({props}) {
    return (
        (props?.analytics?.channel?.toLocaleLowerCase() === 'card' && props?.cardExpiryMonth && props?.cardExpiryYear )  ? <CardDetailsExpiryView props={props} /> : null
    );
}

export default CardDetails;
export {CardDetailsExpiry};
