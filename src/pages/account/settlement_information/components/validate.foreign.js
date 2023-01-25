import Joi from '@hapi/joi';

const validationObject = {
    payout_bank_code: Joi.string().required().label('Bank Name'),
    payout_account_name: Joi.string().required().label('Account Name'),
    payout_account_number: Joi.string().required().label('Account Number'),
    payout_bvn_number: Joi.any().label('BVN'),
};
export default validationObject;
