const db = require('../models');

module.exports = {
    validateAccountData: async (reqType, data) => {
        // uncomment for additional account data
        // const { username, firstname, lastname, email, password, repeat_password } = data;
        // const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const uuidRegexp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        const { balance, account_id } = data;
        const errors = {};

        //change number when adding new keys to check, default: balance, account_id
        if (Object.keys(data).length > 2) {
            errors['body'] = 'Additional body types not supported';
        }

        if (reqType === 'put') {
            if (!account_id.length) {
                errors['account_id'] = 'parameter account_id not provided';
            }

            if (!uuidRegexp.test(account_id)) {
                errors['account_id'] = 'account_id must be uuid format';
            }
        }

        // if (!username.length || !firstname.length || !lastname.length || !email.length || !password.length || !repeat_password.length) {
        //
        //     return "fields are required";
        //
        // } else {
        //     if (username.length < 3) {
        //         errors["username"] = 'username must be greater than 3';
        //     }
        //
        //     if (firstname.length < 3) {
        //         errors["firstname"] = 'firstname must be greater than 3';
        //
        //     }
        //     if (lastname.length < 3) {
        //         errors["lastname"] = 'lastname must be greater than 3';
        //
        //     }
        //     if (password.length < 3) {
        //
        //         errors["password"] = 'password must be greater than 3';
        //
        //     }
        //     if (password !== repeat_password) {
        //
        //         errors["repeat_password"] = 'passwords not matching';
        //     }
        //     if (!emailRegexp.test(email)) {
        //
        //         errors["email"] = 'wrong email';
        //
        //     }
        // }

        return errors ? errors : null;

    },
    validateTransactionData:   async (requestType, data) => {

    },
};
