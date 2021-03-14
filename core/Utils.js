const db = require('../models');

module.exports = {
    validateAccountData: async (reqType, data) => {
        const uuidRegexp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        const { balance, account_id } = data;
        const errors = {};
        if (reqType === 'put') {
            if (!balance) {
                errors['balance'] = 'balance not provided';
            }
        }

        if (!account_id) {
            errors['account_id'] = 'parameter account_id not provided';
        }

        if (!uuidRegexp.test(account_id)) {
            errors['account_id'] = 'account_id must be uuid format';
        }

        return errors ? errors : null;

    },
    validateTransactionData: async (reqType, data) => {
        const uuidRegexp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        const { transaction_id, account_id, amount } = data;
        const errors = {};

        if (!transaction_id) {
            errors['transaction_id'] = 'parameter transaction_id not provided';
        }

        if (!uuidRegexp.test(transaction_id)) {
            errors['transaction_id'] = 'transaction_id must be uuid format';
        }

        if (reqType === 'POST') {
            const transaction = await db.Transaction.findOne({where: {id: transaction_id}});
            if (transaction) {
                errors['idempotent'] = true;
                errors['transaction'] = `transaction with transaction_id: ${transaction_id} already exist`;
            }
            if (typeof amount === 'undefined') {
                errors['amount'] = 'amount not provided';
            }

            if (!account_id) {
                errors['account_id'] = 'parameter account_id not provided';
            }

            if (!uuidRegexp.test(account_id)) {
                errors['account_id'] = 'account_id must be uuid format';
            }
        }

        return errors ? errors : null;
    },
};
