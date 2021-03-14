const Utils = require('../core/Utils');

module.exports = async (app, db) => {
    app.get('/transaction/:transaction_id', async (req, res) => {
        try {
            const { transaction_id } = req.params;
            const validator = await Utils.validateTransactionData('GET', {transaction_id});
            if (Object.keys(validator).length) {
                throw {
                    status: 400,
                    message: validator
                }
            }

            let transactionData = await db.Transaction.findOne({where: {id: transaction_id}, raw: true});
            if (!transactionData) {
                throw {
                    status: 404,
                    message: 'Transaction not found.'
                }
            }

            return res.status(200).send(transactionData);
        } catch (err) {
            console.log(err);
            return res.status(err.status).send(err.message);
        }
    });

    app.all('/amount', async (req, res) => {
        try {
            if (req.method === 'PUT') {
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

            const { body, headers } = req;
            const transaction_id = headers['transaction-id'];

            const validator = await Utils.validateTransactionData('POST', {...body, transaction_id});
            if (Object.keys(validator).length) {
                if (validator.idempotent) {
                    throw {
                        status: 200,
                        message: 'Transaction already exist.'
                    };
                } else {
                    throw {
                        status: 400,
                        message: validator
                    };
                }
            }

            //open transaction
            const transaction = await db.sequelize.transaction();
            try {
                let createTransaction = await db.Transaction.create({
                    id: transaction_id,
                    account_id: body.account_id,
                    amount: body.amount
                }, transaction);

                let transactionData = await createTransaction.get({plain:true});
                console.log(`Transaction created. Data: ${JSON.stringify(transactionData)}`);

                let accountData = await db.Account.findOne({where: {id: body.account_id}, raw: true});
                if (!accountData) {
                    const create = await db.Account.create({id: body.account_id, balance: body.amount});
                    accountData = create.get({plain: true});
                    console.log(`Account created. Data: ${JSON.stringify(accountData)}`);
                } else {
                    const updatedBalance = accountData.balance + body.amount;

                    const updatedAccountData = await db.Account.update({
                        balance: updatedBalance,
                    }, {
                        where: {id: body.account_id},
                        returning: true
                    }, transaction);

                    console.log(`Account rows updated. ${JSON.stringify(updatedAccountData[1])}`);
                }

                //commit transaction
                await transaction.commit();

                return res.status(200).send(transactionData);
            } catch(err) {
                console.error(err);
                //rollback transaction
                await transaction.rollback();
            }
        } catch (err) {
            console.log(err);
            return res.status(err.status).send(err.message);
        }
    });

    app.get('/max_transaction_volume', async (req, res) => {
        try {
            const transactionAccounts = await db.Transaction.findAll({attributes: ['account_id'], raw: true});
            if (!transactionAccounts.length) {
                throw {
                    status: 404,
                    message: 'Transactions not found.'
                }
            }

            let result = {
                maxVolume: 0,
                accounts: []
            };

            let max = 0;
            let accountsTransactions = {};
            for (const account of transactionAccounts) {
                accountsTransactions[account.account_id] = (accountsTransactions[account.account_id] || 0) + 1;
                if (accountsTransactions[account.account_id] > max) {
                    max = accountsTransactions[account.account_id];
                    result.maxVolume = max;
                }
            }

            Object.keys(accountsTransactions).find(key => {
                if (accountsTransactions[key] === result.maxVolume) {
                    result.accounts.push(key);
                }
            });

            return res.status(200).send(result);
        } catch (err) {
            console.error(err);
            return res.status(err.status).send(err.message);
        }
    });
};