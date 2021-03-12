// const db = require('../models');
// const db = require('../models');
// const { Op } = require('sequelize');
// const { omit } = require('lodash');
const Utils = require('../core/Utils');

module.exports = async (app, db) => {
    app.get('/transaction/:transaction_id', async (req, res) => {
        try {
            const transaction = await db.sequelize.transaction();
            const {params: {transaction_id}} = req;

            try {
                let transaction = await db.Transaction.findOne({
                    where: {id: transaction_id},
                    raw: true,
                    transaction
                });

                await transaction.commit();

                return res.json({payload:  queryBuilder});
            } catch (err) {
                console.error(err);
                await transaction.rollback();
            }

            return res.json({payload: 'response'});
        } catch (e) {
            return res.json({'payload': {status: 'error'}});
        }
    });

    app.post('/amount', async (req, res) => {
        try {
            //open transaction stream
            const transaction = await db.sequelize.transaction();
            const {body, query, header } = req;
            console.log(header);

            const validator = await Utils.validateAccountCreateData(body);

            try {
                const transaction = await db.transaction.create({});
            } catch(e) {

            }
            let { client_id, message_id } = req.params;
            if (!client_id) throw 'client_id not provided';

            let options = req.body;
            if (message_id && !options.message_id) {
                options['message_id'] = message_id;
            }

            const messages = await db.getClientMessagesById(client_id, options);

            if (messages.status && messages.status === 'error') {
                throw messages.err;
            }

            res.send({
                status: 'success',
                messages
            });
        } catch (err) {
            res.send({
                status: 'error',
                message: err
            });
        }
    });
};