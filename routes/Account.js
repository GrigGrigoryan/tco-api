const Utils = require('../core/Utils');

module.exports = async (app, db) => {
  app.get('/balance/:account_id', async (req, res) => {
    try {
      const { account_id } = req.params;
      const validator = await Utils.validateAccountData('GET', {account_id});

      if (Object.keys(validator).length) {
        throw {
          status: 400,
          message: validator
        }
      }

      const account = await db.Account.findOne({where: {id: account_id}});
      if (!account) {
        throw {
          status: 404,
          message: 'Account not found.'
        };
      }

      return res.send({
        status: 200,
        body: account
      });
    } catch (err) {
      console.log(err);
      return res.send({
        status: err.status,
        message: err.message
      });
    }
  });

  app.get('/max_transaction_volume', async (req, res) => {
    try {
      const { account_id } = req.params;
      const validator = await Utils.validateAccountData('GET', {account_id});

      if (Object.keys(validator).length) {
        throw {
          status: 400,
          message: validator
        }
      }

      let account = await db.Account.findOne({where: {id: account_id}});
      if (!account) {
        throw {
          status: 404,
          message: 'Account not found.'
        };
      }

      return res.send({
        status: 'Account details.',
        body: account
      });
    } catch (err) {
      return res.status(err.status).send(err.message);
    }
  });
};