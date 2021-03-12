const Utils = require('../core/Utils');

module.exports = async (app, db) => {

    //account calls
    app.post('/account/create', async (req, res) => {
        try {
            const { balance } = req.body;
            const body = req.body;

            const validator = await Utils.validateAccountCreateData(req.body);
            if (Object.keys(validator).length) {
                throw validator;
            }

            const create = await db.account.create(body);
            const account = await create.get({plain: true});
        } catch(err) {
            return res.json({
                status: 'error',
                messages: err
            });
        }
    });

    app.put('/account/:id', async (req, res) => {
        try {
            const { id: account_id } = req.params;
            const body = req.body;

            //Validate account body
            const validator = await Utils.validateAccountData(req.body);
            if (Object.keys(validator).length) {
                throw validator;
            }

            const create = await db.account.create(body);
            const account = await create.get({plain: true});

            return res.json({
                status: 'error',
                account
            });
        } catch(err) {
            return res.json({
                status: 'error',
                messages: err
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

    app.put('/transaction/update', async (req, res) => {
        try {

        } catch(err) {

        }
    });

    app.delete('/transaction/delete', async (req, res) => {
        try {

        } catch(err) {

        }
    });
};