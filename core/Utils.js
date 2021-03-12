const validateAccountCreateData = (requestType, data) => {
    const { balance, name, surname, password, repeat_password, email } = data;
    const errors = {};

    if (!name.length || !surname.length || !password.length || !repeat_password.length || !email.length) {

        return "fields are required"

    } else {

        if (name.length < 3) {

            errors["name"] = 'name must be greater then 3'

        }
        if (surname.length < 3) {

            errors["surname"] = 'surname must be greater then 3'

        }
        if (password.length < 3) {

            errors["password"] = 'password must be greater then 3'

        }
        if (password !== repeat_password) {

            errors["repeat_password"] = 'wrong password'

        }
        if (!emailRegexp.test(email)) {

            errors["email"] = 'wrong email'

        }

    }

    return errors ? errors : null;

};
const validateTransactionData = (requestType, data) => {
    if (requestType === 'get') {

    }
    const { account_id, amount } = data;
    const errors = {};

    if (!account_id || !amount) {

        return "fields are required"

    } else {
        if (amount.length < 3) {

            errors["name"] = 'name must be greater then 3'

        }
        if (surname.length < 3) {

            errors["surname"] = 'surname must be greater then 3'

        }
        if (password.length < 3) {

            errors["password"] = 'password must be greater then 3'

        }
        if (password !== repeat_password) {

            errors["repeat_password"] = 'wrong password'

        }
        if (!emailRegexp.test(email)) {

            errors["email"] = 'wrong email'

        }

    }

    return errors ? errors : null;

};

module.exports = {
    validateAccountCreateData: async (requestType, data) => {
        const { balance, name, surname, password, repeat_password, email } = data;
        const errors = {};

        if (!name.length || !surname.length || !password.length || !repeat_password.length || !email.length) {

            return "fields are required"

        } else {

            if (name.length < 3) {

                errors["name"] = 'name must be greater then 3'

            }
            if (surname.length < 3) {

                errors["surname"] = 'surname must be greater then 3'

            }
            if (password.length < 3) {

                errors["password"] = 'password must be greater then 3'

            }
            if (password !== repeat_password) {

                errors["repeat_password"] = 'wrong password'

            }
            if (!emailRegexp.test(email)) {

                errors["email"] = 'wrong email'

            }

        }

        return errors ? errors : null;

    },
    validateTransactionData: async (requestType, data) => {

    }
};
