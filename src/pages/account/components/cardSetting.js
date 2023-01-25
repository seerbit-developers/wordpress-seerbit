import React from "react";
import PersonIcon from "../../../assets/images/svg/personIcon";
import BriefCaseIcon from "../../../assets/images/svg/briefcaseIcon";
import WalletIcon from "../../../assets/images/svg/walletIcon";
import ApiIcon from "../../../assets/images/svg/apiIcon";
import ConfigIcon from "../../../assets/images/svg/configIcon";
import CustomisationIcon from "../../../assets/images/svg/customisationIcon";
import GramophoneIcon from "../../../assets/images/svg/gramophoneIcon";
import ChainIcon from "../../../assets/images/svg/chainIcon";
import UsersIcon from "../../../assets/images/svg/usersIcon";
import {useTranslation} from "react-i18next";
const getIcon = (icon) => {
  switch (icon) {
    case "person":
      return <PersonIcon />;
    case "business":
      return <BriefCaseIcon />;
    case "settlement":
      return <WalletIcon />;
    case "api":
      return <ApiIcon />;
    case "checkout":
      return <ConfigIcon />;
    case "customisation":
      return <CustomisationIcon />;
    case "ads":
      return <GramophoneIcon />;
    case "webhooks":
      return <ChainIcon />;
    case "users":
      return <UsersIcon />;
    default:
      return <PersonIcon />;
  }
};
const CardSetting = (props) => {
  const { t } = useTranslation();

  return (
    <div
      className={props.className || "card__setting--box"}
      key={props.index}
      onClick={() => props.goto(props.item.route)}
    >
      <div>
        {getIcon(props.item.icon)}
        <h5>{t(props.item.title)}</h5>
      </div>
      <p>{t(props.item.description)}</p>
      {props.button && (
        <a className="card-btn" href={props.link}>
          <div>{t('read more')}</div>
        </a>
      )}
    </div>
  );
};

export default CardSetting;
