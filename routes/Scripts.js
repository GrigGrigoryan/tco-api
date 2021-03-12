const Utils = require('../core/Utils');

module.exports = async (app, db) => {

    //account calls
    app.post('/account/create', async (req, res) => {
        try {
            const body = req.body;

            const create = await db.Account.create(body);
            const account = await create.get({plain: true});
            if (!account) {
                throw 'account not found';
            }
            return res.json({
                status: 'success',
                message: 'account created successfully',
                data: account
            });
        } catch(err) {
            return res.json({
                status: 'error',
                message: err
            });
        }
    });

    app.put('/account/:account_id', async (req, res) => {
        try {
            //open transaction
            const transaction = await db.sequelize.transaction();
            const { account_id } = req.params;
            const body = req.body;

            //Validate account body
            try {
                const validator = await Utils.validateAccountData('put', {...body, account_id});
                if (Object.keys(validator).length) {
                    throw validator;
                }

                let account = await db.Account.update(body, {
                    where: {id: account_id},
                }, transaction);

                await transaction.commit();


                return res.json({
                    status: 'error',
                    message: '',
                    account
                });
            } catch(err) {
                console.error(err);
                await transaction.rollback();
            }
        } catch(err) {
            return res.json({
                status: 'error',
                message: err
            });
        }
    });

    app.delete('/account/delete', async (req, res) => {
        try {

        } catch(err) {

        }
    });


    //transaction calls

    app.post('/transaction/create', async (req, res) => {
        try {

        } catch(err) {

        }
    });

    app.put('/transaction/:transaction_id', async (req, res) => {
        try {
            //open transaction
            const transaction = await db.sequelize.transaction();
            const { transaction_id } = req.params;
            const body = req.body;

            //Validate account body
            try {
                const validator = await Utils.validateTransactionData('put', {...body, transaction_id});
                if (Object.keys(validator).length) {
                    throw validator;
                }

                let transactionData = await db.Transaction.update(body, {
                    where: {id: transaction_id},
                }, transaction);


                await transaction.commit();

                return res.json({
                    status: 'error',
                    message: '',
                    transaction: transactionData
                });
            } catch(err) {
                console.error(err);
                await transaction.rollback();
            }
        } catch(err) {
            return res.json({
                status: 'error',
                message: err
            });
        }
    });

    app.delete('/transaction/delete', async (req, res) => {
        try {

        } catch(err) {

        }
    });
};