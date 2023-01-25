import React from 'react';
import Bank from "assets/images/svg/bank-icon";
import Mastercard from "assets/images/svg/mastercard-icon";
import Visa from "assets/images/svg/visa-icon";
import Verve from "assets/images/verve.png";
import Exchange from "assets/images/svg/transfer-icon";
import {cardQuickDection} from "utils";

const ChannelView = ({props}) => {
    return (
        <span className="number">
          <img
              width="20px"
              height="auto"
              src={
                  props.analytics.channel === "account" ||
                  props.analytics.channel === "ACCOUNT"
                      ? Bank
                      : props.analytics.channelType &&
                      props.analytics.channelType
                          .toLowerCase()
                          .indexOf("master") !== -1
                          ? Mastercard
                          : props.analytics.channelType &&
                          props.analytics.channelType.toLowerCase().indexOf("visa") !==
                          -1
                              ? Visa
                              : props.analytics.channelType &&
                              props.analytics.channelType.toLowerCase().indexOf("verve") !==
                              -1
                                  ? Verve
                                  : props.analytics.channel &&
                                  props.analytics.channel.toLowerCase().indexOf("card") !== -1
                                      ? cardQuickDection(props.maskNumber)
                                      :
                                      Exchange
              }
              className="mr-2 mb-1"
          />

            {props.analytics.channel &&
            props.analytics.channel.toLowerCase().indexOf("card") !== -1
                ? props.maskNumber &&
                `xxxx ${props && props.maskNumber && props.maskNumber?.substring(props.maskNumber.length - 4)}`
                : <span className='trans--detail'>{props.analytics.channel.toLowerCase()}</span> &&
                props.analytics.channel.toLowerCase().indexOf("account") !== -1
                    ? <span className='trans--detail'>{props.analytics.channelType.toLowerCase()}</span>
                    : <span className='trans--detail'>{props.analytics.channel.toLowerCase()}</span> }

        </span>
    );
}
function TransactionChannel({props}) {
        try {
            return  <ChannelView props={props}/>
        }catch (e) {
            return Exchange
        }

}

export default TransactionChannel;
