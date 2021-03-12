// const db = require('../models');
// const db = require('../models');
// const { Op } = require('sequelize');
// const { omit } = require('lodash');
const Utils = require('../core/Utils');

module.exports = async (app, db) => {
    app.get('/transaction/:transaction_id', async (req, res) => {
        try {
            const {params: {transaction_id}} = req;

            let transactionData = await db.Transaction.findOne({
                where: {id: transaction_id},
                raw: true,
            });

            return res.json({
                status: 'error',
                message: '',
                data: transactionData
            });
        } catch (err) {
            res.send({
                status: 'error',
                message: err
            });
        }
    });

    app.post('/amount', async (req, res) => {
        try {
            //open transaction
            const transaction = await db.sequelize.transaction();
            const {body, headers } = req;
            const transaction_id = headers['transaction-id'];

            const validator = await Utils.validateTransactionData('post', {...body, transaction_id});
            console.log(validator);
            if (Object.keys(validator.errors).length) {
                throw validator;
            }

            try {
                let parsedAmount = parseInt(body.amount);
                let transactionData = await db.Transaction.create({
                    account_id: body.account_id,
                    amount: parsedAmount
                }, transaction);

                //commit transaction
                await transaction.commit();

                return res.json({
                    status: 'error',
                    message: '',
                    data: transactionData
                });
            } catch(err) {
                console.error(err);
                //rollback transaction
                await transaction.rollback();
            }
        } catch (err) {
            res.json({
                status: 'error',
                message: err
            });
        }
    });
};