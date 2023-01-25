import Joi from '@hapi/joi';
import i18next from "i18next";
const validationObject = {
    payout_bank_code: Joi.string().required().label(i18next.t('Bank Name')),
    payout_account_name: Joi.string().required().label(i18next.t('Account Name')),
    payout_account_number: Joi.string().required().label(i18next.t('Account Number')),
    payout_bvn_number: Joi.any().label(i18next.t('BVN')),
};
export default validationObject;
