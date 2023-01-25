import Joi from '@hapi/joi';

const validationObject = {
    productName: Joi.string().required().label('Product name'),

    productCode: Joi.string().required().label('Product code'),

    amount: Joi.number().required().label('Amount'),

    categoryId: Joi.number().required().label('Category'),

    productDescription: Joi.string().required().label('Product description'),

    quantity: Joi.any().label('Quantity'),
};
export default validationObject;
