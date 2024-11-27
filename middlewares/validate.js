const Joi = require('joi');

const productSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().optional(),
    category: Joi.string().required()
});

function validateProduct(req, res, next) {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next();
}

module.exports = validateProduct;
