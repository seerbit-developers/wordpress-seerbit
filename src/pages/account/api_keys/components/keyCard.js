import React from "react";
import Badge from "components/badge";
import { handleCopy } from "utils";
import {alertSuccess, globalAlert, globalAlertTypes} from "modules/alert";
import {useTranslation} from "react-i18next";

const KeyCard = ({ title, apiKey }) => {
  const { t } = useTranslation();
  const handleFocus = (val, e) => {
    if (e.length > 10 && e.indexOf("SB") === 0) handleCopy(apiKey, e);
    alertSuccess(`${val} Copied`, globalAlertTypes.success, null, "keys_copy");
  };

  const isLink = (link) => {
    return link.indexOf(".com") !== -1;
  };

  return (
    <div className="card__standard--body--content">
      <p className='xwrapx'>
        <span>{t(title)}</span>
        {isLink(apiKey) ? (
          <a href={apiKey} className="ml-5" target="_blank">
            <Badge text={apiKey} type="api-key" />
          </a>
        ) : (
          <span
            className="ml-5"
            title={t('Click to Copy')}
            onClick={() => {
              handleFocus(`${t(title)}`, apiKey);
            }}
          >
            <Badge text={apiKey} type="api-key" />
          </span>
        )}
      </p>
    </div>
  );
};
export default KeyCard;
