const Utils = require('../core/Utils');

module.exports = async (app, db) => {
    app.get('/transaction/:transaction_id', async (req, res) => {
        try {
            const { transaction_id } = req.params;
            if (!transaction_id) {
                throw {
                    status: 400,
                    message: 'transaction_id not provided'
                };
            }

            let transactionData = await db.Transaction.findOne({where: {id: transaction_id}});

            if (!transactionData) {
                throw {
                    status: 404,
                    message: 'Transaction not found'
                }
            }

            return res.send({
                status: 200,
                body: transactionData
            });
        } catch (err) {
            console.log(err);
            res.send({
                status: err.status,
                message: err.message
            });
        }
    });

    app.all('/amount', async (req, res) => {
        try {
            if (req.method === "PUT") {
                throw {
                    status: 405,
                    message: 'Specified HTTP method not allowed.'
                }
            }
            if (req.headers['content-type'] !== 'application/json') {
                throw {
                    status: 415,
                    message: 'Specified content type not allowed.'
                }
            }
            const {body, headers } = req;
            const transaction_id = headers['transaction-id'];

            const validator = await Utils.validateTransactionData('post', {...body, transaction_id});
            if (Object.keys(validator).length) {
                throw {
                    status: 400,
                    message: validator
                };
            }

            //open transaction
            const transaction = await db.sequelize.transaction();
            try {

                const IntAmount = parseInt(body.amount);

                let createTransaction = await db.Transaction.create({
                    id: transaction_id,
                    account_id: body.account_id,
                    amount: IntAmount
                }, transaction);

                let transactionData = await createTransaction.get({plain:true});
                console.log(`Transaction created. Data: ${JSON.stringify(transactionData)}`);

                let accountData = await db.Account.findOne({where: {id: body.account_id}});
                if (!accountData) {
                    accountData = await db.Account.create({id: body.account_id, balance: body.amount});
                    console.log(`Account created. Data: ${JSON.stringify(accountData)}`);
                } else {
                    const updatedBalance = accountData.balance + IntAmount;

                    const updatedAccountData = await db.Account.update({
                        balance: updatedBalance,
                    }, {
                        where: {id: body.account_id},
                        raw: false
                    }, transaction);

                    console.log(`Account updated. Data: ${JSON.stringify(updatedAccountData)}`);
                }

                //commit transaction
                await transaction.commit();

                return res.send({
                    status: 200,
                    body: transactionData
                });
            } catch(err) {
                console.error(err);
                //rollback transaction
                await transaction.rollback();
            }
        } catch (err) {
            console.log(err);
            res.send({
                status: err.status,
                message: err.message
            });
        }
    });
};