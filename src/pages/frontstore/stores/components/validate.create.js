import Joi from '@hapi/joi';

const validationObject = {
    storeName: Joi.string().required().label('Store name'),

    storeUrl: Joi.string().required().label('Store Link'),

    currency: Joi.string().required().label('Currency'),

    status: Joi.string().label('Status'),

    splitSettlement: Joi.boolean().label('Split Settlement'),

    subAccountId: Joi.any().optional()
        .when('splitSettlement',
            { is: Joi.valid(true),
                then: Joi.string().error(new Error('Split settlement Account is required')).required()
            }
        ).label('Sub Account'),

};
export default validationObject;
